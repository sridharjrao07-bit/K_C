import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import MarketplaceContent from '@/components/MarketplaceContent'
import ShopHeader from '@/components/ShopHeader'

export const revalidate = 0; // Ensure fresh data on every request

export default async function Shop() {
    const supabase = await createClient()

    // Fetch products with artisan details
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            profiles (full_name, craft)
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-[#faf7f2]">
            {/* Header */}
            <ShopHeader />

            {/* Marketplace Content with Filtering */}
            <MarketplaceContent initialProducts={products || []} />
        </div>
    )
}
