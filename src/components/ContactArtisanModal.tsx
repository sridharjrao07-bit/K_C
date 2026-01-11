"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

interface ContactArtisanModalProps {
  artisanId: string;
  artisanName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactArtisanModal({ artisanId, artisanName, isOpen, onClose }: ContactArtisanModalProps) {
  const { t } = useLanguage();
  const supabase = createClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError("");

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: artisanId,
        subject,
        content: message
      });

    if (error) {
      setError("Failed to send message. Please try again.");
    } else {
      setSuccess(true);
      setSubject("");
      setMessage("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }

    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6f5c46] to-[#8c7358] text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold">
                {t("contact.title") || "Contact Artisan"}
              </h2>
              <p className="text-[#e5d1bf] mt-1">
                {t("contact.sendTo") || "Send a message to"} {artisanName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {!user ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#faf7f2] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#6f5c46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{t("contact.loginRequired") || "Please log in to send a message"}</p>
              <a
                href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="inline-block bg-[#c65d51] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#a84e44] transition-smooth"
              >
                {t("nav.login") || "Login"}
              </a>
            </div>
          ) : success ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#6f5c46] mb-2">{t("contact.success") || "Message Sent!"}</h3>
              <p className="text-gray-600">{t("contact.successDesc") || "The artisan will receive your message soon."}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contact.subject") || "Subject"}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e5d1bf] rounded-xl focus:ring-2 focus:ring-[#c65d51] focus:border-transparent transition-all"
                  placeholder="e.g., Question about custom orders"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contact.message") || "Message"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e5d1bf] rounded-xl focus:ring-2 focus:ring-[#c65d51] focus:border-transparent transition-all resize-none"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#c65d51] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a84e44] transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {t("contact.send") || "Send Message"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-[#e5d1bf] text-gray-600 rounded-xl hover:bg-[#faf7f2] transition-colors"
                >
                  {t("contact.cancel") || "Cancel"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
