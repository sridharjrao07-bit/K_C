"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import ArtisanQRCode from "@/components/ArtisanQRCode";
import QuickStats from "@/components/QuickStats";
import DeleteProductButton from "@/components/DeleteProductButton";

interface Product {
  id: string;
  title: string;
  price: number;
  inventory_count: number;
  images: string[] | null;
}

interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function DashboardClient({ user, initialProducts }: { user: User, initialProducts: Product[] }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-[#c65d51] shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold border-2 border-[#8c7358]">
                {user.user_metadata?.full_name?.charAt(0) || "A"}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#6f5c46]">
              {t("dashboard.welcome")}, <span className="text-[#c65d51]">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
            </h1>
          </div>
          <p className="text-gray-600">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/settings" className="bg-white text-[#6f5c46] px-6 py-2 rounded-full border border-[#e5d1bf] font-semibold hover:bg-[#faf7f2] transition-smooth shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {t("dashboard.settings")}
          </Link>
          <Link href={`/artisan/${user.id}`} className="bg-[#6f5c46] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5a4a38] transition-smooth shadow-md">
            {t("dashboard.viewPublicShop")}
          </Link>
        </div>
      </header>

      <QuickStats artisanId={user.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {/* Verification Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] hover:shadow-md transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#6f5c46]">{t("dashboard.verification")}</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">{t("dashboard.pending")}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">Complete your artisan profile validation to start selling.</p>
          <Link href="/verification" className="w-full block text-center bg-[#6f5c46] text-white py-2 rounded-lg hover:bg-[#5a4a38] transition-smooth">
            {t("dashboard.startVerification")}
          </Link>
        </div>

        {/* Product Showcase Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] hover:shadow-md transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#6f5c46]">{t("dashboard.myProducts")}</h2>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">{t("dashboard.active")}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">Showcase your craft to the world. Add products to your catalog.</p>
          <Link href="/dashboard/products/add" className="w-full block text-center bg-[#c65d51] text-white py-2 rounded-lg hover:bg-[#a84e44] transition-smooth">
            {t("dashboard.addNewProduct")}
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] hover:shadow-md transition-smooth flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#6f5c46]">{t("dashboard.training")}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{t("dashboard.new")}</span>
            </div>
            <p className="text-gray-600 text-sm">Modules to help you price better and grow your digital shop.</p>
          </div>
          <Link href="/dashboard/training" className="w-full block text-center border border-[#6f5c46] text-[#6f5c46] py-2 rounded-lg mt-4 hover:bg-[#faf7f2] transition-smooth">
            {t("dashboard.startLearning")}
          </Link>
        </div>

        {/* QR Code Card */}
        <ArtisanQRCode artisanId={user.id} />
      </div>

      {/* Product List Section */}
      <div className="mt-12 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-[#6f5c46]">{t("dashboard.yourCollection")}</h2>
          <Link href="/dashboard/products/add" className="text-[#c65d51] hover:underline text-sm font-semibold">
            + {t("dashboard.addAnother")}
          </Link>
        </div>

        {initialProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#e5d1bf]">
            <p className="text-gray-500 mb-4">{t("dashboard.noProducts")}</p>
            <Link href="/dashboard/products/add" className="bg-[#6f5c46] text-white px-6 py-2 rounded-lg hover:bg-[#5a4a38] transition-smooth">
              {t("dashboard.launchFirst")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {initialProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-[#e5d1bf] overflow-hidden hover:shadow-md transition-smooth group">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#6f5c46] truncate">{product.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[#c65d51] font-bold">₹{product.price}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Stock: {product.inventory_count}</span>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="text-[#6f5c46] hover:text-[#c65d51] text-xs font-bold transition-colors"
                    >
                      {t("dashboard.editDetails")}
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
