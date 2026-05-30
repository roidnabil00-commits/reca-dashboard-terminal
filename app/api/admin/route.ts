import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const body = await request.json()
  const { action } = body
  const supabaseAdmin = createAdminClient()

  if (action === 'create_user') {
    const { email, password, full_name, role } = body
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Upsert profile — handles duplicate key from trigger
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: data.user.id, email, full_name, role }, { onConflict: 'id' })
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })
    return NextResponse.json({ success: true, userId: data.user.id })
  }

  if (action === 'inject_feed') {
    const { title, category, content, chart_data, chart_type, drive_link } = body
    const { error } = await supabaseAdmin.from('dashboard_feeds').insert({
      title, category, content,
      chart_data: chart_data || null,
      chart_type: chart_type || 'line',
      drive_link: drive_link || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (action === 'add_research') {
    const { title, description, drive_link_pdf, drive_link_ppt } = body
    const { error } = await supabaseAdmin.from('general_researches').insert({
      title, description,
      drive_link_pdf: drive_link_pdf || null,
      drive_link_ppt: drive_link_ppt || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (action === 'add_private_report') {
    const { client_id, title, description, drive_link_pdf, drive_link_ppt, drive_link_csv, drive_link_md, youtube_link, artikel_link } = body
    const { error } = await supabaseAdmin.from('private_reports').insert({
      client_id, title, description,
      drive_link_pdf: drive_link_pdf || null,
      drive_link_ppt: drive_link_ppt || null,
      drive_link_csv: drive_link_csv || null,
      drive_link_md: drive_link_md || null,
      youtube_link: youtube_link || null,
      artikel_link: artikel_link || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  if (action === 'add_course') {
    const { title, type, description, source_link, cover_image } = body
    const { error } = await supabaseAdmin.from('course_modules').insert({
      title, type, description, source_link,
      cover_image: cover_image || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
