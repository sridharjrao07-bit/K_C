import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FavoriteButton from '@/components/FavoriteButton'

export const revalidate = 0;

export default async function FavoritesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/favorites')
  }

  // Fetch user's favorite items (artisans and products)
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(`
            id,
            created_at,
            artisan:profiles!artisan_id(
                id,
                full_name,
                craft,
                location,
                avatar_url,
                bio
            ),
            product:products!product_id(
                id,
                title,
                price,
                images,
                artisan_id,
                profiles(full_name)
            )
        `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const favoriteArtisans = favorites?.filter((f: any) => f.artisan) || [];
  const favoriteProducts = favorites?.filter((f: any) => f.product) || [];

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/dashboard" className="hover:text-[#6f5c46] transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-[#6f5c46]">Favorites</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">❤️</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-[#6f5c46]">
                Your Favorites
              </h1>
              <p className="text-gray-600">
                Artisans and products you&apos;ve saved
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {(!favorites || favorites.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e5d1bf] animate-fade-in">
            <div className="w-20 h-20 bg-[#faf7f2] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl opacity-50">💔</span>
            </div>
            <h3 className="text-xl font-bold text-[#6f5c46] mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Browse our talented artisans and their products, then click the heart icon to save your favorites!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#c65d51] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#a84e44] transition-smooth shadow-md"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Favorite Products Section */}
            {favoriteProducts.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-[#6f5c46] mb-6 border-b border-[#e5d1bf] pb-2">
                  Favorite Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteProducts.map((fav: any, index: number) => (
                    <div
                      key={fav.id}
                      className="group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Favorite Button */}
                        <div className="absolute top-3 right-3 z-10">
                          <FavoriteButton
                            itemId={fav.product.id}
                            type="product"
                            itemName={fav.product.title}
                            size="sm"
                          />
                        </div>

                        {/* Image */}
                        <Link href={`/shop/${fav.product.id}`}>
                          <div className="aspect-[4/5] bg-white relative overflow-hidden group-hover:bg-gray-50 transition-colors">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {fav.product.images?.[0] ? (
                              <img
                                src={fav.product.images[0]}
                                alt={fav.product.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                No Image
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="p-4">
                          <Link href={`/shop/${fav.product.id}`}>
                            <h3 className="font-bold text-lg text-[#6f5c46] group-hover:text-[#c65d51] transition-colors line-clamp-1">
                              {fav.product.title}
                            </h3>
                          </Link>
                          <p className="text-[#c65d51] font-bold text-lg mb-1">
                            ₹{fav.product.price}
                          </p>
                          <p className="text-gray-500 text-sm">
                            by {fav.product.profiles?.full_name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Favorite Artisans Section */}
            {favoriteArtisans.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-[#6f5c46] mb-6 border-b border-[#e5d1bf] pb-2">
                  Favorite Artisans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteArtisans.map((fav: any, index: number) => (
                    <div
                      key={fav.id}
                      className="group animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative bg-white rounded-2xl shadow-sm border border-[#e5d1bf] overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Favorite Button */}
                        <div className="absolute top-3 right-3 z-10">
                          <FavoriteButton
                            itemId={fav.artisan?.id}
                            type="artisan"
                            itemName={fav.artisan?.full_name}
                            size="sm"
                          />
                        </div>

                        {/* Image */}
                        <Link href={`/artisan/${fav.artisan?.id}`}>
                          <div className="aspect-[4/3] bg-[#e5d1bf] relative overflow-hidden">
                            {fav.artisan?.avatar_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={fav.artisan.avatar_url}
                                alt={fav.artisan.full_name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl text-[#6f5c46]">
                                {fav.artisan?.full_name?.charAt(0) || "A"}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="p-4">
                          <Link href={`/artisan/${fav.artisan?.id}`}>
                            <h3 className="font-bold text-lg text-[#6f5c46] group-hover:text-[#c65d51] transition-colors">
                              {fav.artisan?.full_name}
                            </h3>
                          </Link>
                          <p className="text-[#c65d51] font-medium text-sm mb-2">
                            {fav.artisan?.craft || "Artisan"}
                          </p>
                          {fav.artisan?.location && (
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {fav.artisan.location}
                            </p>
                          )}
                          <Link
                            href={`/artisan/${fav.artisan?.id}`}
                            className="mt-4 block w-full text-center bg-[#6f5c46] text-white py-2 rounded-lg font-medium hover:bg-[#5a4a38] transition-colors"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
