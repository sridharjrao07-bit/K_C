"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export default function GalleryUpload({ artisanId }: { artisanId: string }) {
  const { t } = useLanguage();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchGallery();
  }, [artisanId]);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('artisan_id', artisanId)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${artisanId}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);

    if (uploadError) {
      setError("Failed to upload image. Please try again.");
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    // Insert into gallery_items
    const { data, error: insertError } = await supabase
      .from('gallery_items')
      .insert({
        artisan_id: artisanId,
        image_url: publicUrl,
        caption: caption,
        display_order: items.length
      })
      .select()
      .single();

    if (insertError) {
      setError("Failed to save gallery item.");
    } else if (data) {
      setItems([...items, data]);
      setCaption("");
      setSuccess("Image uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteItem = async (itemId: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    // Delete from storage
    const path = imageUrl.split('/gallery/')[1];
    if (path) {
      await supabase.storage.from('gallery').remove([path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#d4776f] to-[#c65d51] text-white p-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-bold">{t("gallery.manage") || "Behind the Scenes Gallery"}</h2>
        </div>
        <p className="text-white/80 mt-1 text-sm">
          Share your creative process with your customers
        </p>
      </div>

      <div className="p-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Upload Form */}
        <div className="mb-8 p-6 bg-[#faf7f2] rounded-xl border-2 border-dashed border-[#e5d1bf]">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption (optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5d1bf] rounded-xl focus:ring-2 focus:ring-[#c65d51] focus:border-transparent transition-all"
              placeholder="e.g., Hand-weaving the perfect pattern..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label
              htmlFor="gallery-upload"
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-[#6f5c46] text-[#6f5c46] rounded-xl font-semibold cursor-pointer hover:bg-[#6f5c46] hover:text-white transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {uploading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload Image
                </>
              )}
            </label>
          </div>
        </div>

        {/* Gallery Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No images in your gallery yet. Upload your first behind-the-scenes photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.caption || "Gallery item"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => deleteItem(item.id, item.image_url)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm truncate">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
