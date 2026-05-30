import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

/**
 * Verify the request comes from an authenticated admin.
 * Returns the user object or null if unauthorized.
 */
export async function verifyAdminRequest() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') return null

  return { user, profile }
}

/**
 * Write an entry to the audit_logs table.
 */
export async function writeAuditLog({
  actorId,
  actorEmail,
  action,
  target,
  metadata,
  request,
}: {
  actorId: string
  actorEmail: string
  action: string
  target?: string
  metadata?: Record<string, unknown>
  request?: NextRequest
}) {
  const supabaseAdmin = createAdminClient()

  const ip =
    request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request?.headers.get('x-real-ip') ||
    'unknown'

  await supabaseAdmin.from('audit_logs').insert({
    actor_id: actorId,
    actor_email: actorEmail,
    action,
    target: target || null,
    metadata: metadata || null,
    ip_address: ip,
  })
}

/**
 * Sanitize a string to prevent injection in log/display contexts.
 */
export function sanitizeString(input: string, maxLength = 500): string {
  return String(input).trim().slice(0, maxLength)
}

/**
 * Validate that a URL is a Google Drive or YouTube URL.
 */
export function isValidDriveUrl(url: string): boolean {
  if (!url) return true // optional fields allowed empty
  try {
    const u = new URL(url)
    return (
      u.hostname === 'drive.google.com' ||
      u.hostname === 'docs.google.com' ||
      u.hostname === 'youtu.be' ||
      u.hostname === 'www.youtube.com' ||
      u.hostname === 'youtube.com'
    )
  } catch {
    return false
  }
}

/**
 * Validate article URL — must be http/https.
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Validate chart data JSON — must be array of objects with label + value.
 */
export function validateChartData(raw: unknown): boolean {
  if (!raw) return true
  if (!Array.isArray(raw)) return false
  return raw.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).label === 'string' &&
      typeof (item as Record<string, unknown>).value === 'number'
  )
}
