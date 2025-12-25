"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AddProduct() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Textiles",
        inventory_count: "1"
    });

    const categories = ["Textiles", "Pottery", "Woodwork", "Metalwork", "Jewelry", "Other"];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
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
                // Upload to 'products' bucket (Must be Public)
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
            router.push('/dashboard'); // Later: Redirect to product list

        } catch (error: any) {
            console.error(error);
            alert("Error adding product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-display font-bold text-[#6f5c46] mb-8">Add New Product</h1>

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

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Product Images</label>
                            <div className="border-2 border-dashed border-[#d4776f]/30 rounded-xl p-8 text-center hover:bg-[#faf7f2] transition-smooth cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    required
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                                <div className="text-4xl mb-2">📸</div>
                                <p className="font-semibold text-[#6f5c46]">Upload Images</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {images.length > 0 ? `${images.length} files selected` : "Select up to 5 photos"}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {uploading ? "Creating Product..." : "Launch Product"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
