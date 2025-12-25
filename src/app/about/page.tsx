"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function About() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#6f5c46] via-[#332b23] to-[#5a3b25] text-white">
                <div className="absolute inset-0 bg-texture-pattern opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
                            {t("about.title")}{" "}
                            <span className="bg-gradient-to-r from-[#e5d1bf] via-[#d4a574] to-[#f26b83] bg-clip-text text-transparent">
                                Kaarigar Connect
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            {t("about.subtitle")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                            {t("about.mission")}
                        </h2>
                        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                            {t("about.missionDesc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-slide-up">
                            <div className="bg-gradient-to-br from-sand to-cream p-8 rounded-2xl shadow-lg hover:shadow-xl transition-smooth">
                                <h3 className="text-2xl font-bold text-bark mb-4">{t("about.challenge")}</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {t("about.challengeDesc")}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#f2e8df] to-[#f0e8dc] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-smooth">
                                <h3 className="text-2xl font-bold text-[#6f5c46] mb-4">{t("about.solution")}</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {t("about.solutionDesc")}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#d4776f] to-[#c65d51] p-12 rounded-3xl text-white shadow-2xl animate-float">
                            <h3 className="text-3xl font-bold mb-6">{t("about.values")}</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-3xl mr-3">🎨</span>
                                    <div>
                                        <strong className="block">Preserving Heritage</strong>
                                        Traditional crafts carry centuries of cultural knowledge
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-3xl mr-3">💰</span>
                                    <div>
                                        <strong className="block">Economic Empowerment</strong>
                                        Fair prices and direct market access for artisans
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-3xl mr-3">🌍</span>
                                    <div>
                                        <strong className="block">Global Reach</strong>
                                        Connecting local crafts to worldwide customers
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Help Section */}
            <section className="py-20 bg-gradient-to-b from-[#faf7f2] to-[#e5d1bf]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                            How We <span className="text-[#c65d51]">Help</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-smooth text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                                {t("features.f1_title")}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-bark">{t("features.f1_title")}</h3>
                            <p className="text-gray-600 text-sm">
                                {t("features.f1_desc")}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-smooth text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                                📚
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-bark">{t("features.f2_title")}</h3>
                            <p className="text-gray-600 text-sm">
                                {t("features.f2_desc")}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-smooth text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#d4776f] to-[#c65d51] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                                🛍️
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-bark">Showcase</h3>
                            <p className="text-gray-600 text-sm">
                                Beautiful product pages highlighting your craft story
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-smooth text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                                🚀
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-bark">Launch</h3>
                            <p className="text-gray-600 text-sm">
                                Tools to export your listings to Amazon, Flipkart, ONDC
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                            {t("about.values")}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 border-2 border-[#e5d1bf] rounded-2xl hover:border-[#d4776f] hover:shadow-lg transition-smooth">
                            <div className="text-5xl mb-4">🤝</div>
                            <h3 className="text-2xl font-bold mb-3 text-[#6f5c46]">{t("about.respect")}</h3>
                            <p className="text-gray-600">
                                {t("about.respectDesc")}
                            </p>
                        </div>

                        <div className="text-center p-8 border-2 border-[#e5d1bf] rounded-2xl hover:border-[#d4776f] hover:shadow-lg transition-smooth">
                            <div className="text-5xl mb-4">🌱</div>
                            <h3 className="text-2xl font-bold mb-3 text-[#6f5c46]">{t("about.simplicity")}</h3>
                            <p className="text-gray-600">
                                {t("about.simplicityDesc")}
                            </p>
                        </div>

                        <div className="text-center p-8 border-2 border-[#e5d1bf] rounded-2xl hover:border-[#d4776f] hover:shadow-lg transition-smooth">
                            <div className="text-5xl mb-4">💡</div>
                            <h3 className="text-2xl font-bold mb-3 text-[#6f5c46]">{t("about.empowerment")}</h3>
                            <p className="text-gray-600">
                                {t("about.empowermentDesc")}
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
                        Whether you&apos;re a kaarigar looking to grow or someone who believes in supporting traditional crafts
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-block bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-smooth"
                        >
                            Register as Artisan
                        </Link>
                        <Link
                            href="/"
                            className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-700 transition-smooth"
                        >
                            Explore Platform
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
