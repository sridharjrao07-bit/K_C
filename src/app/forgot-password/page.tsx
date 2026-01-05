"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
            });

            if (error) {
                alert(error.message);
            } else {
                setMessage(t("auth.checkEmail"));
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#e8dcc9]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#6f5c46]">{t("auth.resetPassword")}</h2>
                    <p className="text-gray-500 mt-2">Enter your email to receive instructions.</p>
                </div>

                {message ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#6f5c46] mb-2">
                                {t("auth.email")}
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f]"
                                placeholder={t("auth.placeholderEmail")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#b87d4b] to-[#d4776f] text-white py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70"
                        >
                            {isLoading ? "Sending..." : t("auth.sendResetLink")}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-medium text-[#c65d51] hover:text-[#a84e44]">
                        {t("auth.backToLogin")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
