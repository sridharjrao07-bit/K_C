"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Language } from "@/lib/translations";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import CartIcon from "@/components/CartIcon";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  const languages = [
    { code: "en" as Language, name: "EN" },
    { code: "hi" as Language, name: "हि" },
    { code: "kn" as Language, name: "ಕ" },
  ];

  // Dynamic colors based on scroll
  const navClasses = `sticky top-0 z-50 transition-all duration-300 animate-slide-down ${isScrolled
    ? "glass-dark shadow-md border-b border-white/10"
    : "glass-dark border-b border-white/10"
    }`;

  // Always use White/Light text for Dark Background
  const textColor = "text-white";
  const mutedTextColor = "text-white/90";
  const hoverColor = "hover:text-[#c65d51]";
  const activeLangBg = "bg-white text-black";
  const inactiveLangText = "text-white hover:text-white";
  const logoColor = "text-white";

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className={`text-2xl font-display font-bold tracking-widest transition-colors ${logoColor} group-hover:text-[#c65d51]`}>
              KAARIGAR<span className="text-[#c65d51] group-hover:text-[#6f5c46] transition-colors">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className={`font-medium transition-all relative group ${isActive('/about') ? 'text-[#c65d51] font-bold' : `${textColor} ${hoverColor}`}`}>
              {t("nav.about")}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c65d51] transition-all duration-300 group-hover:w-full ${isActive('/about') ? 'w-full' : ''}`}></span>
            </Link>
            <Link href="/shop" className={`font-medium transition-all relative group ${isActive('/shop') ? 'text-[#c65d51] font-bold' : `${textColor} ${hoverColor}`}`}>
              {t("nav.shop")}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c65d51] transition-all duration-300 group-hover:w-full ${isActive('/shop') ? 'w-full' : ''}`}></span>
            </Link>
            {user ? (
              <>
                {user.user_metadata?.role !== 'customer' && (
                  <Link href="/dashboard" className={`nav-link font-bold text-white bg-white/10 px-6 py-2 rounded-full hover:bg-white/20 transition-all active:scale-95 ${isActive('/dashboard') ? 'bg-[#c65d51]' : ''}`}>
                    {t("nav.dashboard")}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`${mutedTextColor} ${hoverColor} transition-colors flex items-center gap-2`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-[#c65d51] text-white px-8 py-3 rounded-full font-bold hover:bg-[#a84e44] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#c65d51]/20">
                {t("nav.login")}
              </Link>
            )}

            {/* Cart Icon */}
            <CartIcon />

            {/* Desktop Language Switcher */}
            <div className="flex items-center gap-2 border-l pl-6 ml-6 border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`text-xs font-bold px-2 py-1 rounded transition-all ${language === lang.code ? activeLangBg : inactiveLangText}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textColor} hover:text-[#c65d51] focus:outline-none p-2`}
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-up bg-[#1a1a1a] border-b border-white/10 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/about" className="block px-4 py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>
              {t("nav.about")}
            </Link>
            <Link href="/shop" className="block px-4 py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>
              {t("nav.shop")}
            </Link>
            {user ? (
              <>
                {user.user_metadata?.role !== 'customer' && (
                  <Link href="/dashboard" className="block px-4 py-4 text-lg font-bold text-[#c65d51] hover:bg-[#e5d1bf]/20 rounded-xl border border-[#c65d51]/30 transition-all uppercase tracking-wider" onClick={() => setIsMenuOpen(false)}>
                    {t("nav.dashboard")}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-4 text-lg font-medium text-gray-400 hover:text-[#c65d51] transition-all uppercase tracking-wider"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-4 text-lg font-bold text-white bg-[#c65d51] rounded-xl text-center shadow-lg shadow-[#c65d51]/20" onClick={() => setIsMenuOpen(false)}>
                {t("nav.login")}
              </Link>
            )}

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/10 mt-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`text-sm font-bold px-4 py-2 rounded-lg transition-all border ${language === lang.code
                    ? 'bg-white text-black border-white'
                    : 'text-white/80 border-white/20'
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
