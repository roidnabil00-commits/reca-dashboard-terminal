import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes yang boleh diakses tanpa login
const PUBLIC_ROUTES = ['/login']

// Routes yang hanya boleh diakses admin
const ADMIN_ROUTES = ['/admin']

// Static file patterns yang dilewati middleware
const STATIC_PATTERN = /^\/(_next\/static|_next\/image|favicon\.ico|icons\/|manifest\.json|sw\.js|workbox-)/

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Lewati static files
  if (STATIC_PATTERN.test(pathname)) {
    return NextResponse.next()
  }

  // ── Buat response dasar
  let supabaseResponse = NextResponse.next({ request })

  // ── Init Supabase client dengan cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ── Refresh session (penting agar token tidak expired)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r))
  const isApiRoute = pathname.startsWith('/api/')

  // ── API routes: biarkan handler yang validasi
  if (isApiRoute) {
    return addSecurityHeaders(supabaseResponse)
  }

  // ── Kalau ada auth error → paksa ke login (bukan redirect loop)
  if (authError && !isPublic && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('reason', 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  // ── User belum login → redirect ke login (kecuali sudah di halaman public)
  if (!user) {
    if (isPublic) return addSecurityHeaders(supabaseResponse)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── User sudah login tapi buka /login → redirect ke dashboard
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ── Admin route protection
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // Non-admin mencoba akses admin → redirect tanpa error message
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // ── Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return addSecurityHeaders(supabaseResponse)
}

/**
 * Tambahkan security headers ke setiap response.
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  const h = response.headers

  // Prevent clickjacking
  h.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  h.set('X-Content-Type-Options', 'nosniff')

  // XSS protection (legacy browsers)
  h.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy — jangan bocorkan URL ke third party
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy — matikan fitur browser yang tidak dipakai
  h.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // Content Security Policy
  // frame-src: izinkan drive.google.com dan youtube-nocookie.com untuk iframe
  h.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js butuh ini
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://drive.google.com https://lh3.googleusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
      "frame-src https://drive.google.com https://docs.google.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|sw\\.js|workbox-.*\\.js).*)',
  ],
}
