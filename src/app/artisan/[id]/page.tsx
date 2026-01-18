import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ArtisanQRCode from '@/components/ArtisanQRCode'
import ShareProfile from '@/components/ShareProfile'
import ArtisanStory from '@/components/ArtisanStory'
import CustomerReviews from '@/components/CustomerReviews'
import BehindTheScenes from '@/components/BehindTheScenes'
import FavoriteButton from '@/components/FavoriteButton'
import ArtisanProfileClient from '@/components/ArtisanProfileClient'

export const revalidate = 0;

export default async function ArtisanProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient()

    // 1. Fetch Artisan Profile
    const { data: artisan, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (profileError || !artisan) {
        notFound();
    }

    // 2. Fetch Artisan's Products
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('artisan_id', id)
        .order('created_at', { ascending: false });

    // 3. Fetch Gallery Items
    const { data: galleryItems } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('artisan_id', id)
        .order('display_order', { ascending: true });

    return (
        <div className="min-h-screen bg-[#faf7f2]">
            {/* Artisan Hero */}
            <div className="bg-[#6f5c46] text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4776f] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in">
                    <div className="w-32 h-32 bg-[#e5d1bf] rounded-full mx-auto overflow-hidden text-[#6f5c46] mb-6 border-4 border-[#8c7358] shadow-xl">
                        {artisan.avatar_url ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={artisan.avatar_url}
                                    alt={artisan.full_name}
                                    fill
                                    sizes="128px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl font-bold">
                                {artisan.full_name?.charAt(0) || "A"}
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">{artisan.full_name}</h1>
                    <p className="text-xl text-[#e5d1bf] mb-4 uppercase tracking-wider font-semibold">{artisan.craft || "Master Artisan"}</p>
                    <div className="flex flex-col items-center gap-6">
                        <ShareProfile artisanId={id} artisanName={artisan.full_name} />
                        <ArtisanProfileClient artisanId={id} artisanName={artisan.full_name} />
                        <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                            <span className="text-sm">Verified Kaarigar Connect Partner</span>
                        </div>
                    </div>
                </div>

                {/* Floating QR Card for Desktop */}
                <div className="hidden lg:block absolute top-1/2 right-8 -translate-y-1/2 pr-8 animate-slide-in-right">
                    <ArtisanQRCode artisanId={id} />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ArtisanStory artisan={artisan} />

                {/* Behind the Scenes Gallery */}
                <BehindTheScenes galleryItems={galleryItems || []} />

                {/* Collection Grid */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display font-bold text-[#6f5c46]">Original Creations</h2>
                    <span className="text-gray-500">{products?.length || 0} items</span>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <Link
                                key={product.id}
                                href={`/shop/${product.id}`}
                                className="group block bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image */}
                                <div className="aspect-[4/5] bg-white relative overflow-hidden p-4 group-hover:bg-gray-50 transition-colors">
                                    {product.images && product.images[0] ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                className="object-contain group-hover:scale-105 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-[#6f5c46] mb-1 line-clamp-1">{product.title}</h3>
                                    <p className="text-[#c65d51] font-bold">₹{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e5d1bf]">
                        <p className="text-gray-500 mb-4">No products listed in this collection yet.</p>
                    </div>
                )}

                {/* Customer Reviews */}
                <CustomerReviews artisanId={id} />
            </div>
        </div>
    )
}
