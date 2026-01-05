"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<"artisan" | "customer">("artisan");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        craft: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: role === "artisan" ? formData.phone : null,
                        craft: role === "artisan" ? formData.craft : null,
                        role: role
                    }
                }
            });

            if (error) {
                alert(error.message);
                return;
            }

            alert("Registration meaningful! Please check your email to verify your account.");
            router.push("/login");

        } catch (error) {
            console.error(error);
            alert("An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] flex">
            {/* Left Side - Image/Decorative */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#6f5c46] via-[#332b23] to-[#5a3b25] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-texture-pattern opacity-10"></div>
                <div className="absolute top-20 left-20 w-64 h-64 bg-[#d4776f] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#b87d4b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>

                <div className="relative z-10 text-center px-12 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        {role === "artisan" ? "Join the Kaarigar Community" : "Discover Authentic Crafts"}
                    </h2>
                    <p className="text-lg text-[#e5d1bf]/80 max-w-md mx-auto leading-relaxed">
                        {role === "artisan"
                            ? "Start your digital journey today. Showcase your craft to the world."
                            : "Support traditional artisans and buy unique, handcrafted products directly."}
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
                        <h2 className="text-3xl font-bold text-[#6f5c46]">Create Account</h2>

                        {/* Role Switcher */}
                        <div className="mt-6 flex bg-white p-1 rounded-xl border border-[#e8dcc9] mb-6">
                            <button
                                type="button"
                                onClick={() => setRole("artisan")}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === "artisan"
                                        ? "bg-[#6f5c46] text-white shadow-md"
                                        : "text-gray-500 hover:text-[#6f5c46]"
                                    }`}
                            >
                                I am an Artisan
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("customer")}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === "customer"
                                        ? "bg-[#c65d51] text-white shadow-md"
                                        : "text-gray-500 hover:text-[#c65d51]"
                                    }`}
                            >
                                I am a Shopper
                            </button>
                        </div>

                        <p className="mt-2 text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-[#c65d51] hover:text-[#a84e44] transition-smooth">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-[#6f5c46]">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] transition-smooth"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        {/* Artisan Only Fields */}
                        {role === "artisan" && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div className="space-y-2">
                                    <label htmlFor="craft" className="text-sm font-medium text-[#6f5c46]">
                                        Craft Type
                                    </label>
                                    <select
                                        id="craft"
                                        className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] transition-smooth"
                                        value={formData.craft}
                                        onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                                        required={role === "artisan"}
                                    >
                                        <option value="">Select Craft</option>
                                        <option value="pottery">Pottery</option>
                                        <option value="textiles">Textiles</option>
                                        <option value="jewelry">Jewelry</option>
                                        <option value="woodwork">Woodwork</option>
                                        <option value="metalwork">Metalwork</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-[#6f5c46]">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required={role === "artisan"}
                                        className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] transition-smooth"
                                        placeholder="+91..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-[#6f5c46]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] transition-smooth"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-[#6f5c46]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-[#e8dcc9] focus:outline-none focus:ring-2 focus:ring-[#d4776f] transition-smooth"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center ${role === "artisan"
                                        ? "bg-gradient-to-r from-[#b87d4b] to-[#d4776f]"
                                        : "bg-gradient-to-r from-[#c65d51] to-[#e89b87]"
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    role === "artisan" ? "Register Kaarigar" : "Start Shopping"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
