'use client'

import { useState } from 'react'
import type { Profile, ChartType } from '@/types'

interface AdminClientProps {
  profiles: Profile[]
}

type AdminTab = 'users' | 'feeds' | 'research' | 'reports' | 'courses'

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'users',    label: 'Users' },
  { id: 'feeds',    label: 'Feed Injection' },
  { id: 'research', label: 'Research' },
  { id: 'reports',  label: 'Private Reports' },
  { id: 'courses',  label: 'Courses' },
]

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'line',           label: 'Line Chart' },
  { value: 'area',           label: 'Area Chart' },
  { value: 'bar',            label: 'Bar Chart (Vertical)' },
  { value: 'bar_horizontal', label: 'Bar Chart (Horizontal)' },
  { value: 'donut',          label: 'Donut Chart' },
]

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
    />
  )
}

function SelectEl({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
    >
      {children}
    </select>
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition resize-y"
    />
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 border-t border-gray-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  )
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-navy-900 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingLabel || 'Menyimpan...'}
        </>
      ) : label}
    </button>
  )
}

export default function AdminClient({ profiles: initialProfiles }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)

  const post = async (body: object): Promise<boolean> => {
    setLoading(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setFeedback({ type: 'error', msg: data.error || 'Terjadi kesalahan. Coba lagi.' })
        return false
      }
      setFeedback({ type: 'success', msg: 'Data berhasil disimpan.' })
      return true
    } catch {
      setFeedback({ type: 'error', msg: 'Koneksi gagal. Periksa jaringan Anda.' })
      return false
    } finally {
      setLoading(false)
    }
  }

  const clientProfiles = profiles.filter(p => p.role === 'client_premium')

  // ---------- USER FORM ----------
  function UserForm() {
    const blank = { email: '', password: '', full_name: '', role: 'premium_member' }
    const [f, setF] = useState(blank)
    const s = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF(prev => ({ ...prev, [k]: e.target.value }))

    return (
      <form onSubmit={async e => {
        e.preventDefault()
        const ok = await post({ action: 'create_user', ...f })
        if (ok) {
          setProfiles(prev => [...prev, { id: `tmp-${Date.now()}`, email: f.email, full_name: f.full_name, role: f.role as Profile['role'] }])
          setF(blank)
        }
      }} className="space-y-4">
        <Field label="Nama Lengkap">
          <Input value={f.full_name} onChange={s('full_name')} required placeholder="Nama lengkap member" />
        </Field>
        <Field label="Email">
          <Input type="email" value={f.email} onChange={s('email')} required placeholder="email@domain.com" />
        </Field>
        <Field label="Password">
          <Input type="password" value={f.password} onChange={s('password')} required placeholder="Minimal 8 karakter" minLength={8} />
        </Field>
        <Field label="Role Akses" hint="Pilih Client Premium agar member dapat menerima Private Report.">
          <SelectEl value={f.role} onChange={s('role')}>
            <option value="premium_member">Premium Member</option>
            <option value="client_premium">Client Premium</option>
            <option value="admin">Admin</option>
          </SelectEl>
        </Field>
        <SubmitButton loading={loading} label="Buat Akun" loadingLabel="Membuat akun..." />
      </form>
    )
  }

  // ---------- FEED FORM ----------
  function FeedForm() {
    const blank = { title: '', category: 'news', content: '', chart_data: '', chart_type: 'line' as ChartType, drive_link: '' }
    const [f, setF] = useState(blank)
    const [showChartHelp, setShowChartHelp] = useState(false)

    return (
      <form onSubmit={async e => {
        e.preventDefault()
        let chart_data = null
        if (f.chart_data.trim()) {
          try { chart_data = JSON.parse(f.chart_data) }
          catch { setFeedback({ type: 'error', msg: 'Format JSON Chart Data tidak valid. Periksa kembali.' }); return }
        }
        const ok = await post({ action: 'inject_feed', ...f, chart_data })
        if (ok) setF(blank)
      }} className="space-y-4">
        <Field label="Judul">
          <Input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} required placeholder="Contoh: Analisis IHSG Q2 2025" />
        </Field>
        <Field label="Kategori">
          <SelectEl value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))}>
            <option value="news">Market News</option>
            <option value="industry_data">Industry Data</option>
            <option value="reca_letter">RECA Letter</option>
          </SelectEl>
        </Field>
        <Field label="Konten" hint="Gunakan baris kosong (Enter dua kali) untuk paragraf baru. Gunakan **teks** untuk cetak tebal.">
          <Textarea
            value={f.content}
            onChange={e => setF(p => ({ ...p, content: e.target.value }))}
            required rows={6}
            placeholder={"Tulis konten analisis di sini...\n\nParagraf baru dengan baris kosong di atas.\n**Teks tebal** menggunakan tanda bintang ganda."}
          />
        </Field>

        <SectionDivider label="Visualisasi Data (Opsional)" />

        <Field label="Tipe Chart">
          <SelectEl value={f.chart_type} onChange={e => setF(p => ({ ...p, chart_type: e.target.value as ChartType }))}>
            {CHART_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SelectEl>
        </Field>

        <Field
          label="Data Chart (JSON)"
          hint="Kosongkan jika tidak ada grafik. Untuk satu seri: [{label, value}]. Untuk multi-seri: [{label, value, category}]."
        >
          <div className="relative">
            <Textarea
              value={f.chart_data}
              onChange={e => setF(p => ({ ...p, chart_data: e.target.value }))}
              rows={4}
              placeholder={'[{"label":"Jan","value":120},{"label":"Feb","value":135}]'}
            />
            <button
              type="button"
              onClick={() => setShowChartHelp(v => !v)}
              className="absolute top-2 right-2 text-xs text-navy-700 font-medium hover:underline"
            >
              Contoh JSON
            </button>
          </div>
          {showChartHelp && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-600 leading-relaxed space-y-2">
              <p className="font-semibold text-gray-700">Satu seri (Line/Area/Bar):</p>
              <p>{`[{"label":"Jan","value":100},{"label":"Feb","value":120}]`}</p>
              <p className="font-semibold text-gray-700 pt-1">Multi kategori (Grouped Bar):</p>
              <p>{`[{"label":"2026","value":9.79,"category":"global"},{"label":"2026","value":7,"category":"indonesia"}]`}</p>
              <p className="font-semibold text-gray-700 pt-1">Nilai kecil (misal FnB growth):</p>
              <p>{`[{"label":"Jul","value":0.000060},{"label":"Aug","value":0.000061}]`}</p>
            </div>
          )}
        </Field>

        <Field label="Link Google Drive (Opsional)">
          <Input value={f.drive_link} onChange={e => setF(p => ({ ...p, drive_link: e.target.value }))} placeholder="https://drive.google.com/..." />
        </Field>

        <SubmitButton loading={loading} label="Publikasikan Feed" loadingLabel="Mempublikasikan..." />
      </form>
    )
  }

  // ---------- RESEARCH FORM ----------
  function ResearchForm() {
    const blank = { title: '', description: '', drive_link_pdf: '', drive_link_ppt: '' }
    const [f, setF] = useState(blank)
    return (
      <form onSubmit={async e => {
        e.preventDefault()
        const ok = await post({ action: 'add_research', ...f })
        if (ok) setF(blank)
      }} className="space-y-4">
        <Field label="Judul Riset">
          <Input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} required placeholder="Indonesian Consumer Market 2025" />
        </Field>
        <Field label="Deskripsi">
          <Textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Deskripsi singkat isi riset ini..." />
        </Field>
        <Field label="Link PDF (Google Drive)" hint="Thumbnail cover akan diambil otomatis dari file ini.">
          <Input value={f.drive_link_pdf} onChange={e => setF(p => ({ ...p, drive_link_pdf: e.target.value }))} placeholder="https://drive.google.com/file/d/.../view" />
        </Field>
        <Field label="Link Slides / PPT (Google Drive)">
          <Input value={f.drive_link_ppt} onChange={e => setF(p => ({ ...p, drive_link_ppt: e.target.value }))} placeholder="https://drive.google.com/file/d/.../view" />
        </Field>
        <SubmitButton loading={loading} label="Tambah Research" />
      </form>
    )
  }

  // ---------- PRIVATE REPORT FORM ----------
  function ReportForm() {
    const blank = {
      client_id: '', title: '', description: '',
      drive_link_pdf: '', drive_link_ppt: '', drive_link_csv: '',
      drive_link_md: '', youtube_link: '', artikel_link: '',
    }
    const [f, setF] = useState(blank)
    const s = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF(prev => ({ ...prev, [k]: e.target.value }))

    return (
      <form onSubmit={async e => {
        e.preventDefault()
        if (!f.client_id) { setFeedback({ type: 'error', msg: 'Pilih client terlebih dahulu.' }); return }
        const ok = await post({ action: 'add_private_report', ...f })
        if (ok) setF(blank)
      }} className="space-y-4">
        <Field label="Assign ke Client">
          <SelectEl value={f.client_id} onChange={e => setF(p => ({ ...p, client_id: e.target.value }))} required>
            <option value="">— Pilih Client —</option>
            {clientProfiles.map(p => (
              <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
            ))}
          </SelectEl>
          {clientProfiles.length === 0 && (
            <p className="text-xs text-red-600 mt-1.5 font-medium">
              Belum ada Client Premium. Buat akun dengan role "Client Premium" di tab Users terlebih dahulu.
            </p>
          )}
        </Field>
        <Field label="Judul Report">
          <Input value={f.title} onChange={s('title')} required placeholder="Analisis Pasar — PT Nama Perusahaan Q2 2025" />
        </Field>
        <Field label="Deskripsi">
          <Textarea value={f.description} onChange={s('description')} rows={2} placeholder="Ringkasan singkat isi report ini..." />
        </Field>

        <SectionDivider label="File dan Tautan" />

        <p className="text-xs text-gray-500 leading-relaxed">
          Isi hanya jenis file yang tersedia. Setiap jenis file yang diisi akan tampil sebagai kartu terpisah di halaman client.
        </p>

        <Field label="PDF Report (Google Drive)">
          <Input value={f.drive_link_pdf} onChange={s('drive_link_pdf')} placeholder="https://drive.google.com/file/d/.../view" />
        </Field>
        <Field label="Presentation / Slides (Google Drive)">
          <Input value={f.drive_link_ppt} onChange={s('drive_link_ppt')} placeholder="https://drive.google.com/file/d/.../view" />
        </Field>
        <Field label="Data / Spreadsheet / CSV (Google Drive)">
          <Input value={f.drive_link_csv} onChange={s('drive_link_csv')} placeholder="https://drive.google.com/file/d/.../view" />
        </Field>
        <Field label="Executive Brief / Markdown (Google Drive)" hint="File .md yang dapat dirender langsung di platform.">
          <Input value={f.drive_link_md} onChange={s('drive_link_md')} placeholder="https://drive.google.com/file/d/.../view" />
        </Field>
        <Field label="Video Briefing (YouTube)" hint="Gunakan link YouTube unlisted untuk privasi.">
          <Input value={f.youtube_link} onChange={s('youtube_link')} placeholder="https://youtu.be/..." />
        </Field>
        <Field label="Referensi Artikel (URL)">
          <Input value={f.artikel_link} onChange={s('artikel_link')} placeholder="https://example.com/artikel" />
        </Field>

        <SubmitButton loading={loading} label="Assign Report ke Client" loadingLabel="Menyimpan..." />
      </form>
    )
  }

  // ---------- COURSE FORM ----------
  function CourseForm() {
    const blank = { title: '', type: 'video', description: '', source_link: '', cover_image: '' }
    const [f, setF] = useState(blank)
    return (
      <form onSubmit={async e => {
        e.preventDefault()
        const ok = await post({ action: 'add_course', ...f })
        if (ok) setF(blank)
      }} className="space-y-4">
        <Field label="Judul Modul">
          <Input value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} required placeholder="Pengantar Analisis Ekuitas IDX" />
        </Field>
        <Field label="Tipe Konten">
          <SelectEl value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value }))}>
            <option value="video">Video (YouTube)</option>
            <option value="book">Book / Resource</option>
          </SelectEl>
        </Field>
        <Field label="Deskripsi">
          <Textarea value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Deskripsi singkat isi modul ini..." />
        </Field>
        <Field
          label={f.type === 'video' ? 'YouTube URL' : 'URL Resource'}
          hint={f.type === 'video' ? 'Gunakan link unlisted untuk menjaga privasi.' : 'Link menuju buku, artikel, atau resource eksternal.'}
        >
          <Input value={f.source_link} onChange={e => setF(p => ({ ...p, source_link: e.target.value }))} required placeholder={f.type === 'video' ? 'https://youtu.be/...' : 'https://...'} />
        </Field>
        {f.type === 'book' && (
          <Field label="Cover Image URL (Opsional)" hint="URL gambar untuk tampilan cover kartu buku.">
            <Input value={f.cover_image} onChange={e => setF(p => ({ ...p, cover_image: e.target.value }))} placeholder="https://..." />
          </Field>
        )}
        <SubmitButton loading={loading} label="Tambah Modul" />
      </form>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-navy-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Backoffice Management — Restricted Access</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {/* Mobile tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 lg:hidden">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFeedback(null) }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar nav */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <nav className="space-y-1 sticky top-6">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setFeedback(null) }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-navy-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Member count */}
              <div className="mt-5 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ringkasan</p>
                {(['admin', 'client_premium', 'premium_member'] as const).map(role => (
                  <div key={role} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-600 capitalize">{role.replace('_', ' ')}</span>
                    <span className="text-xs font-bold text-navy-900">{profiles.filter(p => p.role === role).length}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 mt-1">
                  <span className="text-xs font-semibold text-gray-700">Total</span>
                  <span className="text-xs font-bold text-navy-900">{profiles.length}</span>
                </div>
              </div>
            </nav>
          </div>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Feedback banner */}
            {feedback && (
              <div className={`mb-5 px-4 py-3 rounded-lg border text-sm font-medium flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {feedback.type === 'success' ? (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                )}
                {feedback.msg}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-5 bg-white">
                  <h2 className="font-display font-bold text-navy-900 text-base mb-5">Onboard User Baru</h2>
                  <UserForm />
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-display font-bold text-navy-900 text-base">Daftar Member ({profiles.length})</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {profiles.map((p, i) => (
                          <tr key={p.id || i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5 text-sm font-medium text-navy-900">{p.full_name}</td>
                            <td className="px-5 py-3.5 text-sm text-gray-500 font-mono text-xs hidden sm:table-cell">{p.email}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                p.role === 'client_premium' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {p.role?.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feeds' && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-display font-bold text-navy-900 text-base mb-5">Publikasi Feed / Market Update</h2>
                <FeedForm />
              </div>
            )}

            {activeTab === 'research' && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-display font-bold text-navy-900 text-base mb-5">Tambah Research Library</h2>
                <ResearchForm />
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-display font-bold text-navy-900 text-base mb-5">Assign Private Report ke Client</h2>
                <ReportForm />
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-display font-bold text-navy-900 text-base mb-5">Tambah Modul Course</h2>
                <CourseForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
