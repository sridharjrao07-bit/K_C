"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Check your email for the password reset link");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-[#6f5c46] mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your email to receive a reset link</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#6f5c46] mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none transition-all"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6f5c46] text-white py-3 rounded-lg font-semibold hover:bg-[#5a4a38] transition-smooth disabled:opacity-70"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm text-[#c65d51] hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
