"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const modules = [
    {
        id: "pricing-strategy",
        title: "Digital Pricing Strategy",
        description: "Learn how to calculate costs, handle taxes, and set competitive prices for an international audience.",
        icon: "💰",
        duration: "10 mins",
        level: "Essential"
    },
    {
        id: "product-photography",
        title: "Handmade Photography",
        description: "Capture the soul of your craft using just your smartphone and natural lighting.",
        icon: "📸",
        duration: "15 mins",
        level: "Intermediate"
    },
    {
        id: "digital-storytelling",
        title: "The Power of Storytelling",
        description: "How to write a bio and product stories that connect emotionally with global buyers.",
        icon: "✍️",
        duration: "12 mins",
        level: "Crucial"
    },
    {
        id: "shipping-packaging",
        title: "Safe Shipping & Packaging",
        description: "Design unboxing experiences that protect your craft and wow your customers.",
        icon: "📦",
        duration: "8 mins",
        level: "Practical"
    }
];

export default function TrainingList() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl font-display font-bold text-[#6f5c46]">{t("training.title")}</h1>
                        <Link href="/dashboard" className="text-[#6f5c46] hover:underline font-semibold text-sm">
                            {t("training.backToDashboard")}
                        </Link>
                    </div>
                    <p className="text-xl text-gray-600">{t("training.subtitle")}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {modules.map((module, index) => (
                        <div
                            key={module.id}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5d1bf] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="text-4xl mb-6 bg-[#faf7f2] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                                {module.icon}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-[#e5d1bf] text-[#6f5c46] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {module.level}
                                </span>
                                <span className="text-gray-400 text-xs font-medium italic">
                                    {module.duration} {t("training.read")}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-[#6f5c46] mb-4 group-hover:text-[#c65d51] transition-colors">{module.title}</h2>
                            <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                                {module.description}
                            </p>
                            <Link
                                href={`/dashboard/training/${module.id}`}
                                className="inline-flex items-center gap-2 text-[#6f5c46] font-bold group-hover:gap-4 transition-all"
                            >
                                {t("training.startModule")} <span>→</span>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Secondary Certificate placeholder */}
                <div className="mt-16 bg-gradient-to-r from-[#6f5c46] to-[#5a4a38] p-8 md:p-12 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{t("training.certification")}</h2>
                        <p className="text-gray-300">{t("training.certSubtitle")}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 font-bold opacity-50 cursor-not-allowed">
                        0/4 {t("training.modulesComplete")}
                    </div>
                </div>
            </div>
        </div>
    );
}
