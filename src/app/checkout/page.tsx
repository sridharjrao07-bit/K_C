import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckoutForm from '@/components/CheckoutForm'
import Link from 'next/link';

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/checkout')
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 items-center flex gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#c65d51]">Home</Link>
          <span>/</span>
          <span className="text-[#6f5c46] font-semibold">Checkout</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-[#6f5c46] mb-8">
          Secure Checkout
        </h1>

        <CheckoutForm user={user} />
      </div>
    </div>
  )
}
