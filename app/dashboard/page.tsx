import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import DashboardClient from './DashboardClient'
import type { Profile, DashboardFeed } from '@/types'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: feeds } = await supabase
    .from('dashboard_feeds')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <DashboardClient
          profile={profile as Profile}
          feeds={(feeds || []) as DashboardFeed[]}
        />
      </main>
    </div>
  )
}
