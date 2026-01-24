"use client";

import { useState } from "react";
import ContactArtisanModal from "@/components/ContactArtisanModal";
import FavoriteButton from "@/components/FavoriteButton";
import { useLanguage } from "@/context/language-context";

interface ArtisanProfileClientProps {
  artisanId: string;
  artisanName: string;
}

export default function ArtisanProfileClient({ artisanId, artisanName }: ArtisanProfileClientProps) {
  const { t } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <FavoriteButton
          itemId={artisanId}
          type="artisan"
          itemName={artisanName}
          size="lg"
          showCount
        />
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="bg-[#c65d51] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a84e44] transition-smooth shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {t("contact.button") || "Contact"}
        </button>
      </div>

      {/* Contact Modal */}
      <ContactArtisanModal
        artisanId={artisanId}
        artisanName={artisanName}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
