import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import PrivateReportClient from './PrivateReportClient'
import type { Profile, PrivateReport } from '@/types'

export default async function PrivateReportPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // RLS will automatically filter by client_id for non-admins
  const { data: reports } = await supabase
    .from('private_reports')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <PrivateReportClient reports={(reports || []) as PrivateReport[]} profile={profile as Profile} />
      </main>
    </div>
  )
}
