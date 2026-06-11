'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Cek apakah sudah login — kalau iya langsung redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        setCheckingSession(false)
      }
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email atau password salah. Silakan periksa kembali.'
          : error.message
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  // Tampilkan loading saat cek session agar tidak flicker
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0f2044] flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)
            `,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">R</span>
          </div>
          <div>
            <p className="text-white font-display font-bold text-lg leading-none">RECA</p>
            <p className="text-white/50 text-xs mt-0.5">Intelligence Terminal</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Private Market<br />Intelligence.<br />
            <span className="text-white/40">Exclusively Yours.</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Akses riset pasar eksklusif, laporan privat, dan analisis berbasis AI — dirancang untuk pengambil keputusan elit.
          </p>
        </div>

        {/* Footer note */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-white/30 text-xs">
            Akses hanya untuk undangan. Semua sesi direkam dan dipantau.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <div className="w-12 h-12 bg-[#0f2044] rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-display font-bold text-xl">R</span>
          </div>
          <p className="font-display font-bold text-[#0f2044] text-lg">RECA Intelligence Terminal</p>
          <p className="text-gray-400 text-sm mt-1">Private Market Intelligence Platform</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-[#0f2044]">Secure Access</h2>
            <p className="text-gray-500 text-sm mt-1">Masukkan kredensial Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="email@domain.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f2044] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f2044] focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f2044] text-white font-semibold py-2.5 rounded-lg hover:bg-[#1a3366] transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Terminal'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Tidak ada registrasi publik. Hubungi account manager RECA Anda untuk mendapatkan akses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}