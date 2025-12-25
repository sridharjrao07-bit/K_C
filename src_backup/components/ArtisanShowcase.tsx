"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";

const artisans = [
  {
    name: "Ramesh Sharma",
    craft: "Blue Pottery",
    location: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=400",
    bio: "Preserving the 14th-century tradition of Jaipur Blue Pottery with natural quartz."
  },
  {
    name: "Nandini Rao",
    craft: "Silk Weaving",
    location: "Kanchipuram, TN",
    image: "https://images.unsplash.com/photo-1610116303244-6239f8134730?auto=format&fit=crop&q=80&w=400",
    bio: "Award-winning weaver specializing in gold-border temple sarees."
  },
  {
    name: "Abdul Karim",
    craft: "Bidriware",
    location: "Bidar, Karnataka",
    image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&q=80&w=400",
    bio: "Mastering the art of silver inlay on zinc and copper alloys for 40 years."
  }
];

export default function ArtisanShowcase() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#6f5c46] mb-4">
              {t("home.artisanShowcase.title")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              {t("home.artisanShowcase.subtitle")}
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[#c65d51] font-bold text-lg hover:gap-4 transition-all flex items-center gap-2 group"
          >
            {t("home.artisanShowcase.explore")} <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((artisan, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-xl border border-[#e5d1bf]">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-bold text-white mb-1">{artisan.name}</h3>
                  <p className="text-[#c65d51] font-medium mb-4">{artisan.craft}</p>
                  <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {artisan.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute -right-20 top-40 w-80 h-80 bg-[#faf7f2] rounded-full filter blur-3xl opacity-50 -z-10" />
    </section>
  );
}
