"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function TrainingList() {
    const { language, t } = useLanguage();

    // Get the modules from the translation file based on current language
    // We need to cast to any because the structure is deep and dynamic
    const currentModules = (translations[language] as any).training?.modules || {};

    // Convert object to array for mapping
    const modulesList = Object.keys(currentModules).map(key => ({
        id: key,
        ...currentModules[key],
        // Icons are not in translations, so we map them separately or keep them static
        icon: getModuleIcon(key)
    }));

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
                    {modulesList.map((module: any, index: number) => (
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
                            <p className="text-gray-600 leading-relaxed mb-8 flex-grow line-clamp-3">
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
                        0/5 {t("training.modulesComplete")}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to get icons (keeping them out of translations for now as they are universal)
function getModuleIcon(id: string) {
    switch (id) {
        case 'pricing-strategy': return '💰';
        case 'product-photography': return '📸';
        case 'digital-storytelling': return '✍️';
        case 'shipping-packaging': return '📦';
        case 'marketplace-verification': return '✅';
        default: return '📚';
    }
}
