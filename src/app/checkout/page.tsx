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


        <CheckoutForm user={user} />
      </div>
    </div>
  )
}
