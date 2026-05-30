import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import {
  verifyAdminRequest,
  writeAuditLog,
  sanitizeString,
  isValidDriveUrl,
  isValidUrl,
  validateChartData,
} from '@/lib/security'

// ── Rate limit store (in-memory, resets on server restart)
// For production use Redis or Supabase-based rate limiting.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 30        // max requests
const RATE_LIMIT_WINDOW = 60_000 // per 60 seconds

function checkRateLimit(actorId: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(actorId)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(actorId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false

  entry.count++
  return true
}

function forbidden(msg = 'Forbidden') {
  return NextResponse.json({ error: msg }, { status: 403 })
}

function badRequest(msg = 'Bad request') {
  return NextResponse.json({ error: msg }, { status: 400 })
}

export async function POST(request: NextRequest) {
  // ── 1. Verify admin identity
  const auth = await verifyAdminRequest()
  if (!auth) return forbidden('Unauthorized — admin access required')

  const { user, profile } = auth

  // ── 2. Rate limit
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: 'Too many requests. Wait 60 seconds and try again.' },
      { status: 429 }
    )
  }

  // ── 3. Parse body safely
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON body')
  }

  const { action } = body
  if (!action || typeof action !== 'string') return badRequest('Missing action')

  const supabaseAdmin = createAdminClient()

  // ── Shared audit helper
  const audit = (act: string, target?: string, metadata?: Record<string, unknown>) =>
    writeAuditLog({
      actorId: user.id,
      actorEmail: profile.email,
      action: act,
      target,
      metadata,
      request,
    })

  // ================================================================
  // ACTION: create_user
  // ================================================================
  if (action === 'create_user') {
    const { email, password, full_name, role } = body

    // Validate
    if (!email || !password || !full_name || !role)
      return badRequest('Missing required fields: email, password, full_name, role')

    if (typeof email !== 'string' || !email.includes('@'))
      return badRequest('Invalid email format')

    if (typeof password !== 'string' || password.length < 8)
      return badRequest('Password must be at least 8 characters')

    const allowedRoles = ['premium_member', 'client_premium', 'admin']
    if (!allowedRoles.includes(String(role)))
      return badRequest('Invalid role')

    // Create auth user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: sanitizeString(String(email), 255),
      password: String(password),
      email_confirm: true,
      user_metadata: { full_name: sanitizeString(String(full_name), 100) },
    })

    if (error) return badRequest(error.message)

    // Upsert profile — handles race condition with trigger
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: data.user.id,
          email: sanitizeString(String(email), 255),
          full_name: sanitizeString(String(full_name), 100),
          role: String(role),
        },
        { onConflict: 'id' }
      )

    if (profileError) return badRequest(profileError.message)

    await audit('user.created', String(email), { role, full_name })
    return NextResponse.json({ success: true, userId: data.user.id })
  }

  // ================================================================
  // ACTION: inject_feed
  // ================================================================
  if (action === 'inject_feed') {
    const { title, category, content, chart_data, chart_type, drive_link } = body

    if (!title || !category || !content)
      return badRequest('Missing required fields: title, category, content')

    const allowedCategories = ['news', 'industry_data', 'reca_letter']
    if (!allowedCategories.includes(String(category)))
      return badRequest('Invalid category')

    const allowedChartTypes = ['line', 'area', 'bar', 'bar_horizontal', 'donut']
    if (chart_type && !allowedChartTypes.includes(String(chart_type)))
      return badRequest('Invalid chart_type')

    if (drive_link && !isValidDriveUrl(String(drive_link)))
      return badRequest('drive_link must be a Google Drive URL')

    if (chart_data && !validateChartData(chart_data))
      return badRequest('chart_data must be an array of {label: string, value: number}')

    const { error } = await supabaseAdmin.from('dashboard_feeds').insert({
      title: sanitizeString(String(title), 300),
      category: String(category),
      content: sanitizeString(String(content), 10000),
      chart_data: chart_data || null,
      chart_type: chart_type ? String(chart_type) : 'line',
      drive_link: drive_link ? String(drive_link) : null,
    })

    if (error) return badRequest(error.message)

    await audit('feed.created', String(title), { category, chart_type })
    return NextResponse.json({ success: true })
  }

  // ================================================================
  // ACTION: add_research
  // ================================================================
  if (action === 'add_research') {
    const { title, description, drive_link_pdf, drive_link_ppt } = body

    if (!title) return badRequest('Title is required')

    if (drive_link_pdf && !isValidDriveUrl(String(drive_link_pdf)))
      return badRequest('drive_link_pdf must be a Google Drive URL')
    if (drive_link_ppt && !isValidDriveUrl(String(drive_link_ppt)))
      return badRequest('drive_link_ppt must be a Google Drive URL')

    const { error } = await supabaseAdmin.from('general_researches').insert({
      title: sanitizeString(String(title), 300),
      description: description ? sanitizeString(String(description), 1000) : null,
      drive_link_pdf: drive_link_pdf ? String(drive_link_pdf) : null,
      drive_link_ppt: drive_link_ppt ? String(drive_link_ppt) : null,
    })

    if (error) return badRequest(error.message)

    await audit('research.created', String(title))
    return NextResponse.json({ success: true })
  }

  // ================================================================
  // ACTION: add_private_report
  // ================================================================
  if (action === 'add_private_report') {
    const {
      client_id, title, description,
      drive_link_pdf, drive_link_ppt, drive_link_csv, drive_link_md,
      youtube_link, artikel_link,
    } = body

    if (!client_id || !title)
      return badRequest('Missing required fields: client_id, title')

    // Verify client_id belongs to an actual client_premium user
    const { data: clientProfile, error: clientError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, email')
      .eq('id', String(client_id))
      .single()

    if (clientError || !clientProfile)
      return badRequest('Client not found')

    if (!['client_premium', 'admin'].includes(clientProfile.role))
      return badRequest('Target user is not a client_premium — update their role first')

    // Validate all URLs
    const driveLinks = [drive_link_pdf, drive_link_ppt, drive_link_csv, drive_link_md]
    for (const link of driveLinks) {
      if (link && !isValidDriveUrl(String(link)))
        return badRequest(`Invalid Google Drive URL: ${link}`)
    }
    if (youtube_link && !isValidDriveUrl(String(youtube_link)))
      return badRequest('youtube_link must be a YouTube URL')
    if (artikel_link && !isValidUrl(String(artikel_link)))
      return badRequest('artikel_link must be a valid HTTPS URL')

    const { error } = await supabaseAdmin.from('private_reports').insert({
      client_id: String(client_id),
      title: sanitizeString(String(title), 300),
      description: description ? sanitizeString(String(description), 1000) : null,
      drive_link_pdf: drive_link_pdf ? String(drive_link_pdf) : null,
      drive_link_ppt: drive_link_ppt ? String(drive_link_ppt) : null,
      drive_link_csv: drive_link_csv ? String(drive_link_csv) : null,
      drive_link_md: drive_link_md ? String(drive_link_md) : null,
      youtube_link: youtube_link ? String(youtube_link) : null,
      artikel_link: artikel_link ? String(artikel_link) : null,
    })

    if (error) return badRequest(error.message)

    await audit('private_report.assigned', String(title), {
      client_id,
      client_email: clientProfile.email,
    })
    return NextResponse.json({ success: true })
  }

  // ================================================================
  // ACTION: add_course
  // ================================================================
  if (action === 'add_course') {
    const { title, type, description, source_link, cover_image } = body

    if (!title || !type || !source_link)
      return badRequest('Missing required fields: title, type, source_link')

    const allowedTypes = ['video', 'book']
    if (!allowedTypes.includes(String(type)))
      return badRequest('Invalid type — must be video or book')

    if (!isValidUrl(String(source_link)))
      return badRequest('source_link must be a valid URL')

    if (cover_image && !isValidUrl(String(cover_image)))
      return badRequest('cover_image must be a valid URL')

    const { error } = await supabaseAdmin.from('course_modules').insert({
      title: sanitizeString(String(title), 300),
      type: String(type),
      description: description ? sanitizeString(String(description), 1000) : null,
      source_link: String(source_link),
      cover_image: cover_image ? String(cover_image) : null,
    })

    if (error) return badRequest(error.message)

    await audit('course.created', String(title), { type })
    return NextResponse.json({ success: true })
  }

  // ================================================================
  // ACTION: delete_feed / delete_research / delete_course
  // ================================================================
  if (action === 'delete_feed') {
    const { id } = body
    if (!id) return badRequest('Missing id')
    const { error } = await supabaseAdmin.from('dashboard_feeds').delete().eq('id', Number(id))
    if (error) return badRequest(error.message)
    await audit('feed.deleted', String(id))
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_research') {
    const { id } = body
    if (!id) return badRequest('Missing id')
    const { error } = await supabaseAdmin.from('general_researches').delete().eq('id', Number(id))
    if (error) return badRequest(error.message)
    await audit('research.deleted', String(id))
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_course') {
    const { id } = body
    if (!id) return badRequest('Missing id')
    const { error } = await supabaseAdmin.from('course_modules').delete().eq('id', Number(id))
    if (error) return badRequest(error.message)
    await audit('course.deleted', String(id))
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_private_report') {
    const { id } = body
    if (!id) return badRequest('Missing id')
    const { error } = await supabaseAdmin.from('private_reports').delete().eq('id', String(id))
    if (error) return badRequest(error.message)
    await audit('private_report.deleted', String(id))
    return NextResponse.json({ success: true })
  }

  return badRequest(`Unknown action: ${action}`)
}

// Block semua method selain POST
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
