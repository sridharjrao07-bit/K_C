"use client";

import { useState } from "react";

export default function ShareProfile({ artisanId, artisanName }: { artisanId: string, artisanName: string }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/artisan/${artisanId}` : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Discover ${artisanName} on Kaarigar Connect`,
          text: `Check out the beautiful handcrafted work by ${artisanName} at Kaarigar Connect.`,
          url: profileUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Error copying:", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="group flex items-center gap-3 bg-white text-[#6f5c46] px-8 py-3 rounded-full font-bold hover:bg-[#c65d51] hover:text-white transition-all shadow-lg active:scale-95"
    >
      <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {copied ? "Link Copied!" : "Share Profile"}
    </button>
  );
}
