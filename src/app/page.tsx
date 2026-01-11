"use client";

import Link from "next/link";
import ArtisanShowcase from "@/components/ArtisanShowcase";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#6f5c46] via-[#332b23] to-[#5a3b25] text-white">
                {/* Animated background with texture */}
                <div className="absolute inset-0 bg-texture-pattern opacity-10"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
                            {t("hero.titlePart1")}{" "}
                            <span className="bg-gradient-to-r from-[#e5d1bf] via-[#d4a574] to-[#e89b87] bg-clip-text text-transparent">
                                {t("hero.titlePart2")}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            {t("hero.description")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="bg-gradient-to-r from-[#d4776f] to-[#c65d51] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-smooth shadow-lg"
                                >
                                    {t("nav.dashboard") || "Go to Dashboard"}
                                </Link>
                            ) : (
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-[#d4776f] to-[#c65d51] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-smooth shadow-lg"
                                >
                                    {t("hero.startJourney")}
                                </Link>
                            )}
                            <Link
                                href="/about"
                                className="glass text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-smooth"
                            >
                                {t("hero.learnMore")}
                            </Link>
                        </div>
                    </div>

                    {/* Decorative elements with earthy colors */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4776f] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#b87d4b] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-cream">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                            {t("features.title")} <span className="text-[#d4776f]">{t("features.titleAccent")}</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {t("features.subtitle")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 group animate-slide-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t("features.f1_title")}</h3>
                            <p className="text-gray-600">
                                {t("features.f1_desc")}
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t("features.f2_title")}</h3>
                            <p className="text-gray-600">
                                {t("features.f2_desc")}
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t("features.f3_title")}</h3>
                            <p className="text-gray-600">
                                {t("features.f3_desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Artisan Showcase Section */}
            <ArtisanShowcase />

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                            {t("howItWorks.title")} <span className="gradient-text">{t("howItWorks.titleAccent")}</span>
                        </h2>
                        <p className="text-xl text-gray-600">{t("howItWorks.subtitle")}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                1
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t("howItWorks.step1")}</h3>
                            <p className="text-gray-600">
                                {t("howItWorks.step1_desc")}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t("howItWorks.step2")}</h3>
                            <p className="text-gray-600">
                                {t("howItWorks.step2_desc")}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t("howItWorks.step3")}</h3>
                            <p className="text-gray-600">
                                {t("howItWorks.step3_desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#a76d42] via-[#d4776f] to-[#6f5c46] text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                        {t("cta.title")}
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        {t("cta.subtitle")}
                    </p>
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="inline-block bg-white text-[#6f5c46] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-smooth hover:bg-[#e5d1bf]"
                        >
                            {t("nav.dashboard") || "Go to Dashboard"}
                        </Link>
                    ) : (
                        <Link
                            href="/register"
                            className="inline-block bg-white text-[#6f5c46] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-smooth hover:bg-[#e5d1bf]"
                        >
                            {t("cta.button")}
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Kaarigar Connect</h3>
                            <p className="text-sm">
                                Empowering traditional kaarigars to reach the digital marketplace
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/about" className="hover:text-white transition-smooth">{t("nav.about")}</Link></li>
                                {!user && <li><Link href="/register" className="hover:text-white transition-smooth">{t("nav.getStarted")}</Link></li>}
                                {!user && <li><Link href="/login" className="hover:text-white transition-smooth">{t("nav.login")}</Link></li>}
                                {user && <li><Link href="/dashboard" className="hover:text-white transition-smooth">{t("nav.dashboard")}</Link></li>}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-smooth">Help Center</Link></li>
                                <li><Link href="#" className="hover:text-white transition-smooth">Contact Us</Link></li>
                                <li><Link href="#" className="hover:text-white transition-smooth">FAQs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-smooth">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-smooth">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                        <p>&copy; 2024 Kaarigar Connect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
