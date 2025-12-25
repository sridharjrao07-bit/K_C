"use client";

import { useLanguage } from "@/context/language-context";

export default function ShopHeader() {
  const { t } = useLanguage();
  return (
    <section className="bg-[#6f5c46] py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
          {t("shop.title")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light animate-slide-up animation-delay-100">
          {t("shop.subtitle")}
        </p>
      </div>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full"></div>
      </div>
    </section>
  );
}
