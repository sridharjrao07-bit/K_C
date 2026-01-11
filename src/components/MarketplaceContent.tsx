"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  inventory_count: number;
  images: string[];
  artisan_id: string;
  profiles: {
    full_name: string;
    craft: string;
  } | null;
}

export default function MarketplaceContent({ initialProducts }: { initialProducts: Product[] }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { id: "All", label: t("shop.allCategories") },
    { id: "Textiles", label: t("shop.categories.textiles") },
    { id: "Pottery", label: t("shop.categories.pottery") },
    { id: "Woodwork", label: t("shop.categories.woodwork") },
    { id: "Metalwork", label: t("shop.categories.metalwork") },
    { id: "Jewelry", label: t("shop.categories.jewelry") },
    { id: "Other", label: t("shop.categories.other") }
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e5d1bf] mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder={t("shop.searchPlaceholder")}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c65d51] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeCategory === category.id
                ? "bg-[#6f5c46] text-white shadow-md scale-105"
                : "bg-[#faf7f2] text-[#6f5c46] hover:bg-[#e5d1bf]"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-[#e5d1bf] group"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                {product.images && product.images[0] && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#6f5c46]">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#6f5c46] mb-1 group-hover:text-[#c65d51] transition-colors">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {t("common.by")} <span className="font-semibold text-[#8c7358]">{product.profiles?.full_name}</span>
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-bold text-[#6f5c46]">₹{product.price}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.inventory_count > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                    {product.inventory_count > 0 ? t("shop.inStock") : t("shop.soldOut")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[#e5d1bf]">
          <div className="w-20 h-20 bg-[#faf7f2] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#6f5c46] mb-2">{t("shop.noResults")}</h3>
          <p className="text-gray-500">{t("shop.tryAdjusting")}</p>
        </div>
      )}
    </div>
  );
}
