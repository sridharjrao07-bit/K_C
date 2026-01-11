"use client";

import { use } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";

export default function TrainingViewer({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { language } = useLanguage();

    // Fetch content from translations
    const allModules = (translations[language] as any).training?.modules || {};
    const activeModule = allModules[id];

    // Helper for icons (same as list page)
    const getModuleIcon = (moduleId: string) => {
        switch (moduleId) {
            case 'pricing-strategy': return '💰';
            case 'product-photography': return '📸';
            case 'digital-storytelling': return '✍️';
            case 'shipping-packaging': return '📦';
            case 'marketplace-verification': return '✅';
            default: return '📚';
        }
    };

    if (!activeModule) {
        return (
            <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#6f5c46]">Module Not Found</h1>
                    <Link href="/dashboard/training" className="text-[#c65d51] hover:underline mt-4 block">
                        Back to Academy
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-3xl mx-auto">
                <nav className="mb-8 flex items-center justify-between">
                    <Link href="/dashboard/training" className="text-gray-500 hover:text-[#6f5c46] font-semibold flex items-center gap-2">
                        <span>←</span> Back
                    </Link>
                    <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c65d51] w-2/3"></div>
                    </div>
                </nav>

                <article className="animate-fade-in">
                    <div className="text-5xl mb-6">{getModuleIcon(id)}</div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-[#6f5c46] mb-8 leading-tight">
                        {activeModule.title}
                    </h1>

                    <div className="prose prose-stone prose-lg max-w-none text-gray-700 leading-relaxed mb-12">
                        {activeModule.content.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('###')) {
                                return <h3 key={i} className="text-2xl font-bold text-[#6f5c46] mt-8 mb-4">{line.replace('###', '')}</h3>;
                            }
                            if (line.startsWith('####')) {
                                return <h4 key={i} className="text-xl font-bold text-[#8c7358] mt-6 mb-2">{line.replace('####', '')}</h4>;
                            }
                            if (line.trim().startsWith('**')) {
                                return <p key={i} className="font-bold my-4">{line.replaceAll('**', '')}</p>;
                            }
                            if (line.trim() === "") return <br key={i} />

                            return <p key={i} className="mb-4">{line}</p>;
                        })}
                    </div>

                    <div className="bg-[#faf7f2] p-8 rounded-3xl border border-[#e5d1bf] mb-12">
                        <h2 className="text-xl font-bold text-[#6f5c46] mb-4 flex items-center gap-2">
                            <span>💡</span> Pro Tips ({activeModule.tips.length})
                        </h2>
                        <ul className="space-y-3">
                            {activeModule.tips.map((tip: string, i: number) => (
                                <li key={i} className="flex gap-3 text-gray-700">
                                    <span className="text-[#c65d51]">•</span> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-between items-center py-8 border-t border-gray-100">
                        <button className="text-gray-400 font-bold opacity-50 cursor-not-allowed">
                            Previous Lesson
                        </button>
                        <Link href="/dashboard/training" className="bg-[#6f5c46] text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all">
                            Complete & Next <span>→</span>
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
}
