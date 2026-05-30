'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getDrivePreviewUrl } from '@/lib/drive'
import type { PrivateReport, Profile, ReportFileCard } from '@/types'

interface Props {
  reports: PrivateReport[]
  profile: Profile | null
}

type FileType = 'pdf' | 'ppt' | 'csv' | 'md' | 'youtube' | 'artikel'

interface FileMeta {
  type: FileType
  label: string
  description: string
  accentColor: string
  borderColor: string
  badgeColor: string
  icon: React.ReactNode
}

const FILE_META: FileMeta[] = [
  {
    type: 'pdf',
    label: 'PDF Report',
    description: 'Dokumen laporan lengkap dalam format PDF',
    accentColor: 'bg-slate-900',
    borderColor: 'border-slate-300',
    badgeColor: 'bg-slate-100 text-slate-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    type: 'ppt',
    label: 'Presentation',
    description: 'Slide presentasi ringkasan temuan utama',
    accentColor: 'bg-orange-700',
    borderColor: 'border-orange-200',
    badgeColor: 'bg-orange-50 text-orange-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    type: 'csv',
    label: 'Data & Spreadsheet',
    description: 'Dataset mentah dan tabel data pendukung',
    accentColor: 'bg-emerald-700',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-50 text-emerald-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    type: 'md',
    label: 'Executive Brief',
    description: 'Ringkasan eksekutif dan poin-poin kunci',
    accentColor: 'bg-blue-700',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-50 text-blue-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    type: 'youtube',
    label: 'Video Briefing',
    description: 'Penjelasan video dari tim analis RECA',
    accentColor: 'bg-rose-700',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-50 text-rose-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    type: 'artikel',
    label: 'Referensi Artikel',
    description: 'Artikel dan sumber referensi pendukung',
    accentColor: 'bg-violet-700',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-50 text-violet-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
]

function getUrl(report: PrivateReport, type: FileType): string | null | undefined {
  const map: Record<FileType, string | null | undefined> = {
    pdf: report.drive_link_pdf,
    ppt: report.drive_link_ppt,
    csv: report.drive_link_csv,
    md: report.drive_link_md,
    youtube: report.youtube_link,
    artikel: report.artikel_link,
  }
  return map[type]
}

function buildFileCards(reports: PrivateReport[]): ReportFileCard[] {
  const cards: ReportFileCard[] = []
  reports.forEach(report => {
    FILE_META.forEach(meta => {
      const url = getUrl(report, meta.type)
      if (url) {
        cards.push({
          type: meta.type,
          label: meta.label,
          url,
          reportTitle: report.title,
          reportDescription: report.description,
          reportId: report.id,
        })
      }
    })
  })
  return cards
}

function getYouTubeEmbed(url: string): string {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1`
  }
  return url
}

export default function PrivateReportClient({ reports }: Props) {
  const [activeCard, setActiveCard] = useState<ReportFileCard | null>(null)
  const [mdContent, setMdContent] = useState<string | null>(null)
  const [loadingMd, setLoadingMd] = useState(false)

  const fileCards = buildFileCards(reports)

  const openCard = async (card: ReportFileCard) => {
    setActiveCard(card)
    setMdContent(null)
    if (card.type === 'md') {
      setLoadingMd(true)
      try {
        const fileId = card.url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1]
        if (!fileId) throw new Error()
        const res = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`)
        setMdContent(await res.text())
      } catch {
        setMdContent('> Tidak dapat memuat konten. Pastikan file Google Drive diset ke "Anyone with the link can view".')
      } finally {
        setLoadingMd(false)
      }
    }
  }

  const renderModalContent = () => {
    if (!activeCard) return null

    if (activeCard.type === 'md') {
      return (
        <div className="flex-1 overflow-auto px-6 py-6">
          {loadingMd ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="w-5 h-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Memuat dokumen...</span>
            </div>
          ) : (
            <div className="prose-reca max-w-3xl mx-auto">
              <ReactMarkdown>{mdContent || ''}</ReactMarkdown>
            </div>
          )}
        </div>
      )
    }

    if (activeCard.type === 'youtube') {
      return (
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-950 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={getYouTubeEmbed(activeCard.url)}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeCard.reportTitle}
              />
            </div>
          </div>
        </div>
      )
    }

    if (activeCard.type === 'artikel') {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-violet-50 border border-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-violet-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-navy-900 text-lg mb-2">{activeCard.reportTitle}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Artikel referensi akan dibuka di tab baru. Pastikan koneksi internet Anda stabil.
            </p>
            <a
              href={activeCard.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Buka Artikel
            </a>
          </div>
        </div>
      )
    }

    // PDF, PPT, CSV — Google Drive preview
    const previewUrl = getDrivePreviewUrl(activeCard.url)
    if (previewUrl) {
      return (
        <div className="flex-1 overflow-hidden">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title={activeCard.reportTitle}
            allow="autoplay"
            style={{ minHeight: 0 }}
          />
        </div>
      )
    }

    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Pratinjau tidak tersedia untuk file ini.
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#991b1b] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-navy-900">Private Reports</h1>
              <p className="text-sm text-gray-500">
                Laporan eksklusif — terikat ke akun Anda
                {fileCards.length > 0 && (
                  <span className="ml-2 font-medium text-navy-700">{fileCards.length} dokumen tersedia</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {activeCard && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl flex flex-col overflow-hidden shadow-2xl"
            style={{ height: '93dvh', maxHeight: '93dvh' }}
          >
            {/* Modal header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 uppercase tracking-wide">
                      Confidential
                    </span>
                    {(() => {
                      const meta = FILE_META.find(m => m.type === activeCard.type)
                      if (!meta) return null
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.badgeColor}`}>
                          {meta.label}
                        </span>
                      )
                    })()}
                  </div>
                  <h2 className="font-display font-bold text-navy-900 text-sm sm:text-base leading-tight truncate">
                    {activeCard.reportTitle}
                  </h2>
                  {activeCard.reportDescription && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{activeCard.reportDescription}</p>
                  )}
                </div>
                <button
                  onClick={() => { setActiveCard(null); setMdContent(null) }}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}

      {/* File Cards Grid */}
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {fileCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#991b1b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <p className="font-display font-bold text-gray-700 text-lg">Belum Ada Dokumen</p>
            <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
              Laporan eksklusif yang ditugaskan ke akun Anda akan muncul di sini.
            </p>
          </div>
        ) : (
          <>
            {/* Group by report title */}
            {reports.map(report => {
              const cards = fileCards.filter(c => c.reportId === report.id)
              if (cards.length === 0) return null
              return (
                <div key={report.id} className="mb-8">
                  {/* Report header */}
                  <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gray-200">
                    <div className="w-1 h-10 bg-[#991b1b] rounded-full flex-shrink-0 mt-0.5" />
                    <div>
                      <h2 className="font-display font-bold text-navy-900 text-base leading-tight">{report.title}</h2>
                      {report.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{report.description}</p>
                      )}
                    </div>
                    <span className="ml-auto flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 uppercase tracking-wide">
                      Confidential
                    </span>
                  </div>

                  {/* File cards for this report */}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, idx) => {
                      const meta = FILE_META.find(m => m.type === card.type)!
                      return (
                        <button
                          key={idx}
                          onClick={() => openCard(card)}
                          className={`text-left w-full rounded-xl border-2 ${meta.borderColor} bg-white hover:shadow-md transition-all duration-200 overflow-hidden group`}
                        >
                          {/* Card accent bar */}
                          <div className={`${meta.accentColor} px-4 py-3 flex items-center gap-2.5`}>
                            <div className="text-white opacity-90">
                              {meta.icon}
                            </div>
                            <span className="text-white font-semibold text-sm">{meta.label}</span>
                          </div>

                          {/* Card body */}
                          <div className="px-4 py-3">
                            <p className="text-xs text-gray-500 leading-relaxed">{meta.description}</p>
                            <div className="flex items-center gap-1.5 mt-3 text-navy-700 text-xs font-semibold group-hover:gap-2.5 transition-all duration-200">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                              Buka Dokumen
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
