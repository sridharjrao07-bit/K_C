"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Textiles",
        inventory_count: "1",
        images: [] as string[]
    });

    const categories = ["Textiles", "Pottery", "Woodwork", "Metalwork", "Jewelry", "Other"];

    useEffect(() => {
        const fetchProduct = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                alert("Error fetching product");
                router.push('/dashboard');
                return;
            }

            if (data) {
                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price.toString(),
                    category: data.category,
                    inventory_count: data.inventory_count.toString(),
                    images: data.images || []
                });
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const supabase = createClient();
            const { error: dbError } = await supabase
                .from('products')
                .update({
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    inventory_count: parseInt(formData.inventory_count),
                })
                .eq('id', id);

            if (dbError) throw dbError;

            alert("Product updated successfully!");
            router.push('/dashboard');
            router.refresh();

        } catch (error: any) {
            console.error(error);
            alert("Error updating product: " + error.message);
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
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold text-[#6f5c46]">Edit Product</h1>
                    <Link href="/dashboard" className="text-[#6f5c46] hover:underline text-sm font-semibold">
                        Back to Dashboard
                    </Link>
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
                                    min="0"
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

                        {/* Current Images Preview */}
                        <div>
                            <label className="block text-sm font-medium text-[#6f5c46] mb-2">Current Images</label>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {formData.images.map((url, idx) => (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img key={idx} src={url} alt="Product" className="w-24 h-24 object-cover rounded-lg border border-[#e5d1bf]" />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">Image replacement is not supported in this version. To change images, please delete and recreate the product.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {updating ? "Saving Changes..." : "Update Product"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
