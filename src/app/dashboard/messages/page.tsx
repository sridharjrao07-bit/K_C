import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MessagesInbox from '@/components/MessagesInbox'

export const revalidate = 0;

export default async function MessagesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/messages')
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-[#6f5c46] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-[#6f5c46]">Messages</span>
        </div>

        {/* Messages Inbox Component */}
        <MessagesInbox />
      </div>
    </div>
  )
}
