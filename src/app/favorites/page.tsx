import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FavoritesClient from '@/components/FavoritesClient'

export const revalidate = 0;

export default async function FavoritesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/favorites')
  }

  // Fetch user's favorite items (artisans and products)
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      artisan_id,
      product_id
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Separate artisan and product favorites
  const artisanFavoriteIds = favorites?.filter((f: any) => f.artisan_id).map((f: any) => f.artisan_id) || [];
  const productFavoriteIds = favorites?.filter((f: any) => f.product_id).map((f: any) => f.product_id) || [];

  // Fetch artisan details
  let artisansData: any[] = [];
  if (artisanFavoriteIds.length > 0) {
    const { data: artisans } = await supabase
      .from('profiles')
      .select('id, full_name, craft, location, avatar_url, bio')
      .in('id', artisanFavoriteIds);
    artisansData = artisans || [];
  }

  // Fetch product details
  let productsData: any[] = [];
  if (productFavoriteIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, title, price, images, artisan_id, profiles(full_name)')
      .in('id', productFavoriteIds);
    productsData = products || [];
  }

  // Map favorites with their related data
  const favoriteArtisans = favorites?.filter((f: any) => f.artisan_id).map((f: any) => ({
    id: f.id,
    created_at: f.created_at,
    artisan: artisansData.find((a: any) => a.id === f.artisan_id)
  })).filter((f: any) => f.artisan) || [];

  const favoriteProducts = favorites?.filter((f: any) => f.product_id).map((f: any) => ({
    id: f.id,
    created_at: f.created_at,
    product: productsData.find((p: any) => p.id === f.product_id)
  })).filter((f: any) => f.product) || [];

  return (
    <FavoritesClient
      favoriteArtisans={favoriteArtisans}
      favoriteProducts={favoriteProducts}
    />
  );
}
