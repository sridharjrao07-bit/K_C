"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

export default function LoginPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                alert(error.message);
                return;
            }

            if (data.user?.user_metadata?.role === 'customer') {
                router.push("/shop");
            } else {
                router.push("/dashboard");
            }
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] flex">
            {/* Left Side - Image/Decorative */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#6f5c46] via-[#332b23] to-[#5a3b25] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-texture-pattern opacity-10"></div>

                {/* Decorative floating elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-[#d4776f] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#b87d4b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>

                <div className="relative z-10 text-center px-12 animate-fade-in">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#d4776f] to-[#c65d51] rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                            <span className="text-white font-bold text-3xl">KC</span>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        {t("auth.welcomeBack")}
                    </h2>
                    <p className="text-lg text-[#e5d1bf]/80 max-w-md mx-auto leading-relaxed">
                        {t("auth.welcomeSubtitle")}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative">
                <div className="w-full max-w-md space-y-8 animate-slide-up">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-8 lg:hidden">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#a76d42] to-[#c65d51] bg-clip-text text-transparent">
                                Kaarigar Connect
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold text-[#6f5c46]">{t("auth.signIn")}</h2>
                        <p className="mt-2 text-gray-600">
                            {t("auth.newTo")}{" "}
                            <Link href="/register" className="font-medium text-[#c65d51] hover:text-[#a84e44] transition-smooth">
                                {t("auth.createAccount")}
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="space-y-2 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                            <label htmlFor="email" className="text-sm font-medium text-[#6f5c46]">
                                {t("auth.email")}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] focus:border-transparent transition-all duration-300 focus:scale-[1.01] focus:shadow-lg"
                                placeholder={t("auth.placeholderEmail")}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-sm font-medium text-[#6f5c46]">
                                    {t("auth.password")}
                                </label>
                                <Link href="/forgot-password" className="text-sm font-medium text-[#c65d51] hover:text-[#a84e44] transition-colors">
                                    {t("auth.forgotPassword")}
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] focus:border-transparent transition-all duration-300 focus:scale-[1.01] focus:shadow-lg"
                                placeholder={t("auth.placeholderPassword")}
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 opacity-0 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-[#b87d4b] to-[#d4776f] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t("auth.signingIn")}
                                    </>
                                ) : (
                                    t("auth.signIn")
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
