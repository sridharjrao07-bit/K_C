import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ArtisanDashboardClient from '@/components/ArtisanDashboardClient'

export default async function Dashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    if (user.user_metadata?.role === 'customer') {
        redirect('/shop');
    }

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('artisan_id', user.id)
        .order('created_at', { ascending: false });

    // Format user for the client component
    const clientUser = {
        id: user.id,
        email: user.email,
        user_metadata: {
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <ArtisanDashboardClient user={clientUser} initialProducts={products || []} />
        </div>
    )
}
