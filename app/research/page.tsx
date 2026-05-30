import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import ResearchClient from './ResearchClient'
import type { Profile, GeneralResearch } from '@/types'

export default async function ResearchPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: researches } = await supabase
    .from('general_researches')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <ResearchClient researches={(researches || []) as GeneralResearch[]} />
      </main>
    </div>
  )
}
