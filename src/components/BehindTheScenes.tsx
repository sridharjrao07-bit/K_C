"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

interface BehindTheScenesProps {
  galleryItems: GalleryItem[];
}

export default function BehindTheScenes({ galleryItems }: BehindTheScenesProps) {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (selectedImage) {
      const currentIndex = galleryItems.findIndex(item => item.id === selectedImage.id);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setSelectedImage(galleryItems[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) {
        setSelectedImage(galleryItems[currentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, galleryItems]);

  if (galleryItems.length === 0) return null;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-[#d4776f] to-[#c65d51] rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-[#6f5c46]">
            {t("gallery.title") || "Behind the Scenes"}
          </h2>
          <p className="text-gray-500">
            {t("gallery.subtitle") || "A glimpse into the creative process"}
          </p>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            className="break-inside-avoid group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedImage(item)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative w-full aspect-square">
                <Image
                  src={item.image_url}
                  alt={item.caption || "Behind the scenes"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              {item.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">{item.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows */}
          {galleryItems.findIndex(item => item.id === selectedImage.id) > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleryItems.findIndex(item => item.id === selectedImage.id);
                setSelectedImage(galleryItems[currentIndex - 1]);
              }}
              className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {galleryItems.findIndex(item => item.id === selectedImage.id) < galleryItems.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleryItems.findIndex(item => item.id === selectedImage.id);
                setSelectedImage(galleryItems[currentIndex + 1]);
              }}
              className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-5xl max-h-[85vh] mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[75vh]">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.caption || "Gallery image"}
                fill
                className="object-contain"
                priority
              />
            </div>
            {selectedImage.caption && (
              <div className="mt-4 text-center">
                <p className="text-white text-lg">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
