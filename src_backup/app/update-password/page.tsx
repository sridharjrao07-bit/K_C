"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                alert("Password updated successfully!");
                router.push("/dashboard");
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
                    <h1 className="text-3xl font-display font-bold text-[#6f5c46] mb-2">New Password</h1>
                    <p className="text-gray-600">Enter your new secure password</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#6f5c46] mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6f5c46] text-white py-3 rounded-lg font-semibold hover:bg-[#5a4a38] transition-smooth disabled:opacity-70"
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
