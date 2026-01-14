"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/language-context";

export default function UpdatePasswordPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        console.log("Starting password update...");

        try {
            const supabase = createClient();

            // Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Session:", session ? "exists" : "missing");

            if (!session) {
                alert("Session expired. Please request a new password reset link.");
                setIsLoading(false);
                router.push("/forgot-password");
                return;
            }

            console.log("Updating password...");
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                console.error("Password update error:", error);
                alert(error.message);
                setIsLoading(false);
                return;
            }

            console.log("Password updated successfully!");
            alert(t("auth.passwordUpdated"));
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An error occurred: " + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#e8dcc9]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#6f5c46]">{t("auth.updatePassword")}</h2>
                    <p className="text-gray-500 mt-2">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#6f5c46] mb-2">
                            {t("auth.newPassword")}
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f]"
                            placeholder={t("auth.placeholderPassword")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#6f5c46] mb-2">
                            {t("auth.confirmPassword")}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-[#faf7f2] border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f]"
                            placeholder={t("auth.placeholderPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#b87d4b] to-[#d4776f] text-white py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70"
                    >
                        {isLoading ? "Updating..." : t("auth.updatePassword")}
                    </button>
                </form>
            </div>
        </div>
    );
}
