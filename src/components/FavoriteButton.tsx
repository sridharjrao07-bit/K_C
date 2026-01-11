"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  artisanId: string;
  artisanName?: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export default function FavoriteButton({ artisanId, artisanName, size = "md", showCount = false }: FavoriteButtonProps) {
  const supabase = createClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [animating, setAnimating] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl"
  };

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Try to get favorite count (silently fail if table doesn't exist)
        if (showCount) {
          try {
            const { count } = await supabase
              .from('favorites')
              .select('*', { count: 'exact', head: true })
              .eq('artisan_id', artisanId);
            setCount(count || 0);
          } catch (e) {
            // Table might not exist
          }
        }

        // Check if current user has favorited
        if (user) {
          try {
            const { data } = await supabase
              .from('favorites')
              .select('id')
              .eq('user_id', user.id)
              .eq('artisan_id', artisanId)
              .single();
            setIsFavorite(!!data);
          } catch (e) {
            // Table might not exist
          }
        }
      } catch (e) {
        // Silently fail
      }
    };

    checkFavorite();
  }, [artisanId, supabase, showCount]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setAnimating(true);
    setLoading(true);

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('artisan_id', artisanId);

        setIsFavorite(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            artisan_id: artisanId
          });

        setIsFavorite(true);
        setCount((c) => c + 1);
      }
    } catch (e) {
      console.error('Favorite toggle failed:', e);
    }

    setLoading(false);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`${sizeClasses[size]} bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 ${animating ? 'scale-125' : ''} ${loading ? 'opacity-50' : ''}`}
        title={isFavorite ? `Remove ${artisanName || 'artisan'} from favorites` : `Add ${artisanName || 'artisan'} to favorites`}
      >
        <span className={`transition-all ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>
      {showCount && count > 0 && (
        <span className="text-sm text-gray-500 font-medium">{count}</span>
      )}
    </div>
  );
}
