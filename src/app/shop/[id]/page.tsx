import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient()

    // Fetch product with artisan details
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            profiles (
                full_name,
                craft,
                email
            )
        `)
        .eq('id', id)
        .single();

    // Debug logging
    console.log(`[ProductPage] Fetching product: ${id}`);
    if (error) {
        console.error(`[ProductPage] Supabase Error:`, error);
    }
    if (!product) {
        console.error(`[ProductPage] No product found for ID: ${id}`);
    } else {
        console.log(`[ProductPage] Found product:`, product.title);
    }

    if (error || !product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-[#6f5c46] mb-8 animate-fade-in">
                    <Link href="/shop" className="hover:text-[#c65d51] transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-400">{product.category || "Product"}</span>
                    <span>/</span>
                    <span className="font-semibold truncate max-w-[200px]">{product.title}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Section */}
                    <div className="animate-slide-up">
                        <div className="aspect-[4/5] bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden p-6 relative group">
                            {product.images?.[0] ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">
                                    <span className="text-lg">No Image Available</span>
                                </div>
                            )}

                            {/* Artisan Badge/Tag */}
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#e5d1bf]">
                                <p className="text-xs font-bold text-[#c65d51] uppercase tracking-wider">
                                    Authentic {product.profiles?.craft || "Handcraft"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Story & Details Section */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#6f5c46] mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center space-x-4 mb-8">
                            <Link href={`/artisan/${product.artisan_id}`} className="flex items-center space-x-2 group">
                                <div className="w-10 h-10 bg-[#e5d1bf] rounded-full flex items-center justify-center text-[#6f5c46] font-bold group-hover:bg-[#d4a574] transition-colors">
                                    {product.profiles?.full_name?.charAt(0) || "A"}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Crafted by</p>
                                    <p className="font-semibold text-[#6f5c46] group-hover:text-[#c65d51] transition-colors">
                                        {product.profiles?.full_name || "Unknown Artisan"}
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div className="prose prose-stone max-w-none text-gray-600 mb-8 leading-relaxed">
                            <h3 className="text-lg font-bold text-[#6f5c46] mb-2 font-display">The Story</h3>
                            <p className="whitespace-pre-line">{product.description || "No description provided for this masterpiece."}</p>
                        </div>

                        <div className="border-t border-[#e5d1bf] pt-8 mb-8">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Price</p>
                                    <p className="text-3xl font-bold text-[#c65d51]">₹{product.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Inventory</p>
                                    <p className="font-medium text-[#6f5c46]">{product.inventory_count > 0 ? `${product.inventory_count} available` : "Out of Stock"}</p>
                                </div>
                            </div>

                            <button className="w-full bg-[#6f5c46] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#5a4a38] hover:shadow-lg transition-all transform hover:-translate-y-1">
                                Add to Cart
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Direct support to Indian Artisans. 100% Secure Checkout.
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-white rounded-xl border border-[#e5d1bf]">
                                <div className="text-2xl mb-2">🌿</div>
                                <p className="text-xs font-bold text-[#6f5c46]">Eco-friendly</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-[#e5d1bf]">
                                <div className="text-2xl mb-2">✨</div>
                                <p className="text-xs font-bold text-[#6f5c46]">Handmade</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-[#e5d1bf]">
                                <div className="text-2xl mb-2">🤝</div>
                                <p className="text-xs font-bold text-[#6f5c46]">Fair Trade</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
