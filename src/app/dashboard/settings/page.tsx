"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArtisanSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        full_name: "",
        craft: "",
        phone: "",
        bio: "",
        avatar_url: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setFormData({
                    full_name: data.full_name || "",
                    craft: data.craft || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                    avatar_url: data.avatar_url || ""
                });
            }
            setLoading(false);
        };

        fetchProfile();
    }, [router]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not authenticated");

            let currentAvatarUrl = formData.avatar_url;

            // 1. Upload Avatar if changed
            if (avatarFile) {
                const fileName = `${user.id}/avatar_${Date.now()}`;
                const { data, error } = await supabase.storage
                    .from('profile-images')
                    .upload(fileName, avatarFile);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('profile-images')
                    .getPublicUrl(fileName);

                currentAvatarUrl = publicUrl;
            }

            // 2. Update Profile
            const { error: dbError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    craft: formData.craft,
                    phone: formData.phone,
                    bio: formData.bio,
                    avatar_url: currentAvatarUrl
                })
                .eq('id', user.id);

            if (dbError) throw dbError;

            alert("Profile updated successfully!");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            alert("Error updating profile: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6f5c46]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold text-[#6f5c46]">Artisan Settings</h1>
                    <Link href="/dashboard" className="text-[#6f5c46] hover:underline text-sm font-semibold">
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-100">
                            <div className="w-24 h-24 bg-[#e5d1bf] rounded-full overflow-hidden border-4 border-white shadow-md relative group">
                                {avatarFile ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={URL.createObjectURL(avatarFile)} alt="Avatar Preview" className="w-full h-full object-cover" />
                                ) : formData.avatar_url ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl text-[#6f5c46] font-bold">
                                        {formData.full_name.charAt(0) || "A"}
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span className="text-white text-xs font-bold">Change</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">Update your profile picture</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-[#6f5c46] mb-2">Display Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            {/* Specialty/Craft */}
                            <div>
                                <label className="block text-sm font-medium text-[#6f5c46] mb-2">Primary Craft</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                    value={formData.craft}
                                    onChange={e => setFormData({ ...formData, craft: e.target.value })}
                                    placeholder="e.g. Traditional Pottery"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* Bio / Story */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Your Story (Bio)</label>
                            <textarea
                                rows={6}
                                className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell the world about your heritage and craft..."
                            />
                            <p className="text-xs text-gray-400 mt-2">This bio will be featured in the &apos;Artisan Story&apos; section of your public profile.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {updating ? "Saving Settings..." : "Update Private Profile"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
