'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // WhatsApp Configuration
  const whatsappNumber = '6281931655410'
  const waText = (msg: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
  const waDirect = waText('Halo Tim RECA, saya ingin konsultasi soal riset pasar untuk bisnis F&B saya.')

  // Form State
  const [form, setForm] = useState({ nama: '', usaha: '', kebutuhan: '' })
  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Halo Tim RECA, saya ${form.nama || '-'} dari ${form.usaha || '-'}. Yang ingin saya konsultasikan: ${form.kebutuhan || '-'}`
    window.open(waText(msg), '_blank', 'noopener,noreferrer')
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white font-sans relative overflow-x-hidden pb-16">
      
      {/* Soft Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[500px] bg-gradient-to-b from-blue-100/50 via-slate-100/30 to-transparent blur-3xl pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. FLOATING CAPSULE NAVBAR */}
      {/* ========================================================= */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
        <header className="w-full max-w-xl md:max-w-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-full px-4 py-2 flex items-center justify-between shadow-lg shadow-slate-200/50">
          
          {/* Logo with "R" */}
          <Link href="/" className="flex items-center gap-2 pl-2">
            <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-serif font-black text-sm flex items-center justify-center">
              R
            </span>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-slate-900 font-bold">
              RECA
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-xs text-slate-600 font-medium">
            <a href="#kenapa" className="hover:text-slate-900 transition-colors">Kenapa</a>
            <a href="#fitur" className="hover:text-slate-900 transition-colors">Membership</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all"
            >
              Masuk
            </Link>
            <a
              href="#konsultasi"
              className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
            >
              Gabung
            </a>
          </div>
        </header>
      </div>

      {/* ========================================================= */}
      {/* 2. HERO SECTION (100% FULL SCREEN / VIEWPORT HEIGHT) */}
      {/* ========================================================= */}
      <section className="min-h-[100dvh] flex flex-col justify-center items-center px-6 max-w-4xl md:max-w-5xl mx-auto text-center relative z-10 pt-20 pb-10">
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
          Jalankan Bisnis <span className="text-slate-400">Kalian</span> <br />
          Berdasarkan Data, <br />
          <span className="text-slate-400 font-light">Bukan Tebakan.</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-xl md:max-w-2xl mx-auto font-light">
          RECA membantu Anda melihat apa yang kompetitor tidak tunjukkan  posisi mereka, lokasi yang sesuai, dan strategi marketing yang sedang mereka jalankan.
        </p>

        {/* Primary CTA Button */}
        <div className="mt-10">
          <a
            href="#konsultasi"
            className="inline-block px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-slate-900/20 hover:scale-105"
          >
            Konsultasikan Bisnis Anda
          </a>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. DIBANGUN OLEH / AUTHORITY CARD */}
      {/* ========================================================= */}
      <section id="kenapa" className="px-4 max-w-2xl md:max-w-5xl mx-auto mb-8 pt-6">
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Teks Kiri (Mobile: Atas) */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 font-bold block mb-2">
                DIBANGUN OLEH
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                [Abil]
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light mb-2">
                [Banyak sekali bisnis di luaran sana yang masih tidak tahu arah perusahaannya ingin dibawa kemana karena tidak ada contoh business model yang bisa dilihat, Reca hadir sebagai peta dengan memberikan hasil analisa & riset baik dari market/ pasar dan kompetitor sehingga bisnis kalian bisa melihat gambaran dan meniru startegi kompetitor yang sudah berhasil.]
              </p>
            </div>

            {/* Foto Kanan (Mobile: Bawah) */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src="/abilreca.jpeg"
                alt="Foto Pendiri RECA"
                className="w-full h-full object-cover object-center"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. PROBLEM STATEMENT SECTION */}
      {/* ========================================================= */}
      <section className="px-4 max-w-2xl md:max-w-5xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-6">
            Anda bukan kekurangan informasi, <br />
            <span className="text-slate-500 font-light">masalah Anda adalah:</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              'Penghasilan bisnis Anda tidak memiliki sistem untuk bertumbuh.',
              'Keputusan lokasi dan marketing masih dibuat berdasarkan feeling.',
              'Anda tidak tahu persis apa yang kompetitor lakukan minggu ini.',
              'Anda tidak punya cara sistematis untuk membaca peluang pasar.',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 font-mono font-bold text-base leading-none mt-0.5">✕</span>
                <span className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHAT YOU WILL GET (MEMBERSHIP PILARS) */}
      {/* ========================================================= */}
      <section id="fitur" className="px-4 max-w-2xl md:max-w-5xl lg:max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pl-2 gap-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">MEMBERSHIP</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Apa yang akan Anda <span className="text-slate-400 font-light">dapatkan?</span>
            </h2>
          </div>
          <a
            href="#konsultasi"
            className="inline-block px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md shadow-slate-900/10 w-fit"
          >
            Konsultasikan Bisnis Anda
          </a>
        </div>

        {/* Responsive Grid Desktop: 3 Kolom / 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 01 */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold">01</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Analisa Kompetitor</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light mb-4">
                Sebelum modal keluar, kami petakan siapa pemain di sekitar lokasi Anda  konsep, harga, dan celah yang belum digarap.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate-500">RECA REPORT</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium">Radius 1 km</span>
              </div>
              <p className="text-xs text-slate-900 font-semibold">Kompetitor Sejenis</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">7 tempat</p>
              <p className="text-[11px] text-slate-500 mt-1">4 buka dalam 6 bulan terakhir</p>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold">02</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Analisa Lokasi</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light mb-4">
                Bandingkan beberapa titik di sekitar anda berdasarkan traffic, kepadatan kompetitor, dan kecocokan dengan konsep bisnis Anda.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 grid grid-cols-2 gap-3 mt-auto">
              <div>
                <p className="text-[11px] text-slate-500 mb-1">Jam tersepi</p>
                <p className="text-lg font-bold text-slate-900">14–16</p>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <p className="text-[11px] text-slate-500 mb-1">Celah pasar</p>
                <p className="text-lg font-bold text-slate-900">Terdeteksi</p>
              </div>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold">03</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Riset Campaign Marketing Kompetitor</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light mb-4">
                Kami rangkum promo, akun, channel, konten dan campaign yang sedang berjalan  supaya strategi Anda tidak jalan buta.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 mt-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-medium">Promo bundling akhir pekan</span>
                <span className="text-slate-500 font-mono">Aktif</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-medium">Kolaborasi micro-influencer</span>
                <span className="text-slate-500 font-mono">2 mgg lalu</span>
              </div>
            </div>
          </div>

          {/* Feature 04 */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold">04</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Laporan Privat Sesuai Kebutuhan</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light mb-4">
                Riset kustom yang disesuaikan dengan pertanyaan spesifik bisnis Anda, disusun jadi laporan siap dibaca dan dipakai.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mt-auto">
              <p className="text-[11px] text-slate-500 mb-2">Status laporan Anda</p>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-full bg-slate-900" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">Siap dibagikan ke tim Anda</p>
            </div>
          </div>

          {/* Feature 05 */}
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <span className="text-xs font-mono text-slate-400 font-bold">05</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Materi Belajar Gratis</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light mb-4">
                Akses modul marketing praktis di portal member  untuk membekali Anda di luar laporan yang Anda pesan.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mt-auto">
              <p className="text-xs text-slate-900 font-semibold">Marketing In This Economy</p>
              <p className="text-[11px] text-slate-500 mt-1">class & modul · gratis untuk semua member</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. STUDI KASUS SECTION */}
      {/* ========================================================= */}
      <section className="px-4 max-w-2xl md:max-w-5xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em] font-bold block mb-2">STUDI KASUS</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            Riset kompetitor profesional
          </h2>
          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Kami memetakan kompetitor terdekat, membandingkan harga menu dan jam ramai, lalu menunjukkan celah yang belum digarap siapa pun di sekitar lokasi."
            </p>
            <p className="text-[11px] text-slate-400 mt-3 font-mono">
               Nama klien dirahasiakan sesuai kesepakatan privasi.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FILTERING QUALIFICATION CARD */}
      {/* ========================================================= */}
      <section className="px-4 max-w-2xl md:max-w-5xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              RECA bukan untuk <span className="text-slate-400 font-light">semua orang.</span>
            </h2>

            <a
              href="#konsultasi"
              className="inline-block px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md shadow-slate-900/10 w-fit"
            >
              Konsultasikan Bisnis Anda
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            {/* Not For You Section */}
            <div>
              <p className="text-[11px] font-mono tracking-widest text-slate-400 font-bold mb-3 uppercase">RECA BUKAN UNTUK ANDA JIKA</p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 line-through decoration-slate-300">
                <li>Cuma cari jawaban instan tanpa mau eksekusi.</li>
                <li>Belum serius mau buka atau jalankan bisnis.</li>
                <li>Berharap dijamin pasti untung.</li>
              </ul>
            </div>

            {/* Suitable For You Section */}
            <div>
              <p className="text-[11px] font-mono tracking-widest text-slate-500 font-bold mb-3 uppercase">RECA COCOK JIKA ANDA</p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-800">
                {[
                  'Sedang merencanakan atau menjalankan bisnis F&B.',
                  'Mau keputusan lokasi & marketing berbasis data.',
                  'Terbuka pada temuan yang mungkin di luar dugaan Anda.'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-slate-900 font-bold">✓</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FORM KONSULTASI SECTION */}
      {/* ========================================================= */}
      <section id="konsultasi" className="px-4 max-w-2xl md:max-w-5xl mx-auto mb-12">
        <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-8 md:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Teks Deskripsi Kiri */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 font-bold block mb-2">MULAI</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Mau tahu posisi Anda dibanding kompetitor?
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-md">
                Isi form ini, tim kami akan menghubungi Anda lewat WhatsApp untuk mendiskusikan kebutuhan riset  gratis, tanpa komitmen.
              </p>
            </div>

            {/* Form Kanan */}
            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-6 text-slate-900 grid gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="nama">Nama</label>
                <input
                  id="nama" type="text" required value={form.nama} onChange={updateForm('nama')}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="usaha">Nama usaha</label>
                <input
                  id="usaha" type="text" required value={form.usaha} onChange={updateForm('usaha')}
                  placeholder="Nama bisnis Anda, atau rencana bisnisnya"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="kebutuhan">Yang ingin dikonsultasikan</label>
                <textarea
                  id="kebutuhan" required rows={3} value={form.kebutuhan} onChange={updateForm('kebutuhan')}
                  placeholder="Misal: analisa kompetitor sebelum buka cabang baru di Bandung"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors resize-none"
                />
              </div>
              <button type="submit" className="w-full px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-md">
                Kirim &amp; lanjut ke WhatsApp
              </button>
              <p className="text-[11px] text-slate-400 text-center -mt-1">
                Anda akan diarahkan ke WhatsApp dengan pesan yang sudah terisi otomatis.
              </p>
            </form>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FAQ ACCORDION SECTION */}
      {/* ========================================================= */}
      <section id="faq" className="px-4 max-w-2xl md:max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">FAQ</h2>

        <div className="bg-white border border-slate-200 rounded-[32px] p-4 sm:p-6 md:p-8 shadow-sm space-y-3">
          {[
            { q: 'Bisnis saya masih kecil, apa tetap bisa pakai RECA?', a: 'Bisa. RECA melayani mulai dari usaha rumahan yang baru mau buka, sampai bisnis dengan beberapa cabang. Cakupan risetnya disesuaikan dengan kebutuhan dan skala Anda.' },
            { q: 'Bagaimana cara mulainya?', a: 'Isi form di atas atau hubungi kami via WhatsApp, ceritakan bisnis dan pertanyaan yang ingin dijawab. Kami akan diskusikan ruang lingkup dan biayanya sebelum riset dimulai.' },
            { q: 'Data yang saya bagikan aman?', a: 'Ya. Laporan privat hanya bisa diakses oleh akun Anda di portal member, dan tidak dibagikan ke pihak lain.' },
            { q: 'Selain laporan, apa lagi yang saya dapat?', a: 'Akses ke portal member berisi materi belajar marketing dan pembaruan riset ringan, di luar laporan privat yang Anda pesan.' },
          ].map((faq, idx) => (
            <div key={idx} className="border-b border-slate-100 last:border-none pb-3">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 hover:text-slate-900 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-mono text-base pl-2">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 font-light leading-relaxed pb-2 pl-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. FOOTER SECTION */}
      {/* ========================================================= */}
      <footer className="px-4 max-w-2xl md:max-w-5xl mx-auto text-xs text-slate-600 font-light border-t border-slate-200 pt-10 space-y-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <p className="text-[11px] font-mono tracking-[0.12em] text-slate-400 uppercase font-bold mb-3">MEMBERSHIP</p>
            <div className="flex flex-col gap-2 text-xs text-slate-800">
              <a href="#fitur" className="hover:text-slate-900 transition-colors">Analisa kompetitor</a>
              <a href="#fitur" className="hover:text-slate-900 transition-colors">Analisa lokasi</a>
              <a href="#fitur" className="hover:text-slate-900 transition-colors">Materi belajar</a>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-mono tracking-[0.12em] text-slate-400 uppercase font-bold mb-3">TENTANG</p>
            <div className="flex flex-col gap-2 text-xs text-slate-800">
              <a href="#kenapa" className="hover:text-slate-900 transition-colors">Kenapa RECA</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
              <Link href="/login" className="hover:text-slate-900 transition-colors">Masuk</Link>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-mono tracking-[0.12em] text-slate-400 uppercase font-bold mb-3">KONTAK KAMI</p>
            <div className="flex flex-col gap-2 text-xs text-slate-800">
              <a href={waDirect} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                WhatsApp Admin
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-400 leading-relaxed">
          © 2026 RECA. Insight dan rekomendasi didasarkan pada data yang tersedia saat riset dilakukan; keputusan bisnis tetap sepenuhnya di tangan Anda.
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 11. FLOATING WHATSAPP BUTTON */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 right-5 z-50">
        <a
          href={waDirect}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Konsultasi via WhatsApp"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-slate-300/50 hover:scale-110 transition-transform group"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      </div>

    </div>
  )
}