"use client";

import { use } from "react";
import Link from "next/link";

const trainingContent: Record<string, any> = {
    "pricing-strategy": {
        title: "Digital Pricing Strategy",
        content: `
            Selling online is different from selling in a local haat. You need to account for hidden costs.
            
            ### The Pricing Formula
            **Price = (Materials + Labor + Overhead) × Margin + Shipping + Taxes**
            
            #### 1. Know Your Costs
            Don't just count the fabric or clay. Count the electricity, your packaging time, and the tea you drank!
            
            #### 2. The Global Context
            Buyers in Europe or the US look at quality first. Don't underprice your hard work—it makes it look "cheap" instead of "precious".
            
            #### 3. Platform Fees
            Remember that marketplaces take a small cut (usually 5-15%). Build this into your final price.
        `,
        tips: ["Never price based on desperation.", "Research similar premium products.", "Offer free shipping by including it in the price."],
        icon: "💰"
    },
    "product-photography": {
        title: "Handmade Photography",
        content: `
            Your photos are the only thing your customer can touch before they buy.
            
            ### The Three Pillars
            
            #### 1. Light is Everything
            Use natural window light. Avoid direct harsh sun. Early morning or late afternoon light is "golden".
            
            #### 2. Clean Backgrounds
            Earthy, neutral backgrounds like light wood, stone, or white linen work best for traditional crafts.
            
            #### 3. The Detail Shot
            Buyers want to see the weave, the brushstroke, and the texture. Take at least one close-up macro shot.
        `,
        tips: ["Clean your phone lens.", "Use a tripod (or a stack of books).", "No flashy filters—keep it real."],
        icon: "📸"
    }
};

export default function TrainingViewer({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const activeModule = trainingContent[id] || {
        title: "Module Content",
        content: "Detailed training content is being prepared for this module. Check back shortly!",
        tips: ["Be patient.", "Keep crafting.", "Update your profile."],
        icon: "📚"
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-3xl mx-auto">
                <nav className="mb-8 flex items-center justify-between">
                    <Link href="/dashboard/training" className="text-gray-500 hover:text-[#6f5c46] font-semibold flex items-center gap-2">
                        <span>←</span> Back to Academy
                    </Link>
                    <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c65d51] w-2/3"></div>
                    </div>
                </nav>

                <article className="animate-fade-in">
                    <div className="text-5xl mb-6">{activeModule.icon}</div>
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
                            return <p key={i} className="mb-4">{line}</p>;
                        })}
                    </div>

                    <div className="bg-[#faf7f2] p-8 rounded-3xl border border-[#e5d1bf] mb-12">
                        <h2 className="text-xl font-bold text-[#6f5c46] mb-4 flex items-center gap-2">
                            <span>💡</span> Pro Tips for Success
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
                        <button className="bg-[#6f5c46] text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all">
                            Complete & Next <span>→</span>
                        </button>
                    </div>
                </article>
            </div>
        </div>
    );
}
