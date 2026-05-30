import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import CoursesClient from './CoursesClient'
import type { Profile, CourseModule } from '@/types'

export default async function CoursesPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <CoursesClient modules={(modules || []) as CourseModule[]} />
      </main>
    </div>
  )
}
