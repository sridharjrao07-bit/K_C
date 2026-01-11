"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ImageVerificationService, ImageCheckResult } from "@/lib/image-verification";

export default function AddProduct() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [verificationResults, setVerificationResults] = useState<Record<number, ImageCheckResult>>({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Textiles",
        inventory_count: "1"
    });

    const categories = ["Textiles", "Pottery", "Woodwork", "Metalwork", "Jewelry", "Other"];

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(newFiles);

            // Create previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(newPreviews);

            // Run Instant Verification (The Traffic Light System)
            const results: Record<number, ImageCheckResult> = {};

            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i];
                // 1. Visible: Quality Check
                const qualityCheck = await ImageVerificationService.verifyImageQuality(file);

                // 2. Invisible: Metadata & Safety Checks (Simulated)
                const recentCheck = ImageVerificationService.checkRecentWork(file);
                const safetyCheck = await ImageVerificationService.simulateContentSafety(file);

                // Determine final status
                if (qualityCheck.status === 'error' || safetyCheck.status === 'error') {
                    results[i] = { status: 'error', message: 'Issue Found', details: qualityCheck.details || safetyCheck.details };
                } else if (qualityCheck.status === 'warning' || recentCheck.status === 'warning') {
                    results[i] = { status: 'warning', message: 'Check Quality', details: qualityCheck.details || recentCheck.details };
                } else {
                    results[i] = { status: 'success', message: 'Perfect!', details: 'Ready to showcase.' };
                }
            }
            setVerificationResults(results);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Please login first");
                router.push('/login');
                return;
            }

            // 1. Upload Images
            const imageUrls = [];
            for (const file of images) {
                const fileName = `${user.id}/${Date.now()}_${file.name}`;
                // Upload to 'products' bucket 
                const { data, error } = await supabase.storage
                    .from('products')
                    .upload(fileName, file);

                if (error) throw error;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                imageUrls.push(publicUrl);
            }

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('products')
                .insert({
                    artisan_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    inventory_count: parseInt(formData.inventory_count),
                    images: imageUrls
                });

            if (dbError) throw dbError;

            alert("Product added successfully!");
            router.push('/dashboard');

        } catch (error: any) {
            console.error(error);
            alert("Error adding product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-[#6f5c46] mb-8">Add New Product</h1>

                {/* VISIBLE LAYER: Visual Guidelines */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5d1bf] mb-8 animate-fade-in">
                    <h3 className="font-bold text-[#6f5c46] mb-4 flex items-center gap-2">
                        <span>📸</span> Photo Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <div className="aspect-square bg-green-50 rounded-lg border-2 border-green-200 flex items-center justify-center relative overflow-hidden group">
                                <span className="text-4xl">✨</span>
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">PERFECT</div>
                            </div>
                            <p className="text-sm text-center text-gray-600">Bright natural light, clean background</p>
                        </div>
                        <div className="space-y-2">
                            <div className="aspect-square bg-yellow-50 rounded-lg border-2 border-yellow-200 flex items-center justify-center relative overflow-hidden group opacity-70">
                                <span className="text-4xl filter blur-[2px]">🌫️</span>
                                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">BLURRY</div>
                            </div>
                            <p className="text-sm text-center text-gray-600">Avoid shaky or out-of-focus shots</p>
                        </div>
                        <div className="space-y-2">
                            <div className="aspect-square bg-red-50 rounded-lg border-2 border-red-200 flex items-center justify-center relative overflow-hidden group opacity-70">
                                <span className="text-4xl">🌙</span>
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">TOO DARK</div>
                            </div>
                            <p className="text-sm text-center text-gray-600">Avoid dark rooms or shadows</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5d1bf] animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Product Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Handwoven Silk Scarf"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Description</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the story and materials..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-[#6f5c46] mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            {/* Inventory */}
                            <div>
                                <label className="block text-sm font-medium text-[#6f5c46] mb-2">Inventory Count</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none"
                                    value={formData.inventory_count}
                                    onChange={e => setFormData({ ...formData, inventory_count: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Category</label>
                            <select
                                className="w-full px-4 py-3 rounded-lg border border-[#e5d1bf] focus:ring-2 focus:ring-[#c65d51]/20 focus:border-[#c65d51] outline-none bg-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* REAL-TIME FEEDBACK: Images */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Product Images</label>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                    {imagePreviews.map((src, index) => {
                                        const result = verificationResults[index];
                                        return (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={src} alt="Preview" className="w-full h-full object-cover" />

                                                {/* Traffic Light Feedback Overlay */}
                                                {result && (
                                                    <div className={`absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs`}>
                                                        <div className="flex items-center gap-1 font-bold">
                                                            {result.status === 'success' && <span className="text-green-400">● Good</span>}
                                                            {result.status === 'warning' && <span className="text-yellow-400">● Check</span>}
                                                            {result.status === 'error' && <span className="text-red-400">● Error</span>}
                                                        </div>
                                                        <p className="truncate opacity-90">{result.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-8 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    // required // removed required to allow updating existing products later if needed, but for add it's handled
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                                <div className="text-4xl mb-2">📸</div>
                                <p className="font-semibold text-[#6f5c46]">Upload Images</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {images.length > 0 ? "Change selection" : "Select up to 5 photos"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading || images.length === 0}
                            className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Creating Product..." : "Launch Product"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
