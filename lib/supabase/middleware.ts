import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // PERBAIKANNYA ADA DI SINI: Tambahkan : any[]
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Method setAll ini dipanggil dari Server Component.
            // Error ini bisa diabaikan dengan aman karena kita punya
            // middleware.ts yang mengurus pembaruan sesi user.
          }
        },
      },
    }
  )
}