"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string;
    avatar_url: string;
  };
}

interface CustomerReviewsProps {
  artisanId: string;
  initialReviews?: Review[];
}

export default function CustomerReviews({ artisanId, initialReviews = [] }: CustomerReviewsProps) {
  const { t } = useLanguage();
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch reviews if not provided
      if (initialReviews.length === 0) {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
                        id,
                        rating,
                        comment,
                        created_at,
                        reviewer:profiles!reviewer_id(full_name, avatar_url)
                    `)
          .eq('artisan_id', artisanId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setReviews(data as any);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [artisanId, supabase, initialReviews.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        artisan_id: artisanId,
        reviewer_id: user.id,
        rating,
        comment
      })
      .select(`
                id,
                rating,
                comment,
                created_at,
                reviewer:profiles!reviewer_id(full_name, avatar_url)
            `)
      .single();

    if (error) {
      if (error.code === '23505') {
        setError("You have already reviewed this artisan.");
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } else if (data) {
      setReviews([data as any, ...reviews]);
      setComment("");
      setRating(5);
      setShowForm(false);
      setSuccess("Review submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }

    setSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`text-2xl transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="mt-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#6f5c46]">
            {t("reviews.title") || "Customer Reviews"}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={Math.round(parseFloat(averageRating))} />
            <span className="text-lg font-bold text-[#6f5c46]">{averageRating}</span>
            <span className="text-gray-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>

        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#c65d51] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#a84e44] transition-smooth shadow-md"
          >
            {t("reviews.writeReview") || "Write a Review"}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Review Form */}
      {showForm && user && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] mb-8 animate-slide-up">
          <h3 className="font-bold text-lg text-[#6f5c46] mb-4">{t("reviews.yourReview") || "Your Review"}</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating rating={rating} interactive onRate={setRating} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#e5d1bf] rounded-xl focus:ring-2 focus:ring-[#c65d51] focus:border-transparent transition-all"
              placeholder="Share your experience with this artisan..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#6f5c46] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5a4a38] transition-smooth disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Login Prompt */}
      {!user && (
        <div className="bg-[#faf7f2] p-6 rounded-2xl border border-[#e5d1bf] mb-8 text-center">
          <p className="text-gray-600 mb-3">{t("reviews.loginPrompt") || "Log in to leave a review"}</p>
          <a href="/login" className="text-[#c65d51] font-semibold hover:underline">
            {t("nav.login") || "Login"}
          </a>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#e5d1bf]">
          <p className="text-gray-500">{t("reviews.noReviews") || "No reviews yet. Be the first to review!"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] hover:shadow-md transition-smooth">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold text-lg overflow-hidden flex-shrink-0">
                  {review.reviewer?.avatar_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={review.reviewer.avatar_url}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    review.reviewer?.full_name?.charAt(0) || "U"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-[#6f5c46]">{review.reviewer?.full_name || "Anonymous"}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
