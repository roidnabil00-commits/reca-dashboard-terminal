'use client'

import { useState } from 'react'
import { getDrivePreviewUrl, extractDriveFileId } from '@/lib/drive'
import type { GeneralResearch } from '@/types'

interface ResearchClientProps {
  researches: GeneralResearch[]
}

function CoverImage({ driveLink, title }: { driveLink?: string | null; title: string }) {
  const [imgError, setImgError] = useState(false)
  const fileId = driveLink ? extractDriveFileId(driveLink) : null

  if (fileId && !imgError) {
    return (
      <div className="w-full h-36 bg-gray-100 rounded-t-xl overflow-hidden">
        <img
          src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w400`}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  // Fallback cover
  return (
    <div className="w-full h-36 bg-gradient-to-br from-navy-900 to-navy-700 rounded-t-xl flex items-center justify-center">
      <div className="text-center px-4">
        <svg className="w-10 h-10 text-white/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <p className="text-white/60 text-xs font-medium line-clamp-2 leading-tight">{title}</p>
      </div>
    </div>
  )
}

export default function ResearchClient({ researches }: ResearchClientProps) {
  const [selected, setSelected] = useState<GeneralResearch | null>(null)
  const [viewMode, setViewMode] = useState<'pdf' | 'ppt'>('pdf')
  const [search, setSearch] = useState('')

  const filtered = researches.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  )

  const previewUrl = selected
    ? getDrivePreviewUrl(viewMode === 'pdf' ? selected.drive_link_pdf || '' : selected.drive_link_ppt || '')
    : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-display font-bold text-navy-900">Research Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">Premium market research, exclusively for members.</p>
          {/* Search */}
          <div className="mt-4 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search research..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selected && previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl flex flex-col overflow-hidden shadow-2xl" style={{ height: '92dvh', maxHeight: '92dvh' }}>
            <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex items-start justify-between gap-3 flex-shrink-0">
              <div className="min-w-0">
                <h2 className="font-display font-bold text-navy-900 text-sm sm:text-base truncate">{selected.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{selected.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {selected.drive_link_pdf && (
                  <button onClick={() => setViewMode('pdf')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${viewMode === 'pdf' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    PDF
                  </button>
                )}
                {selected.drive_link_ppt && (
                  <button onClick={() => setViewMode('ppt')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${viewMode === 'ppt' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    PPT
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title={selected.title}
                allow="autoplay"
                style={{ minHeight: 0 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No research found.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <div key={r.id} className="card overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
                {/* Cover */}
                <CoverImage driveLink={r.drive_link_pdf || r.drive_link_ppt} title={r.title} />

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-navy-900 text-sm leading-tight mb-1 line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">{r.description}</p>

                  <div className="flex gap-2">
                    {r.drive_link_pdf && (
                      <button
                        onClick={() => { setSelected(r); setViewMode('pdf') }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        PDF
                      </button>
                    )}
                    {r.drive_link_ppt && (
                      <button
                        onClick={() => { setSelected(r); setViewMode('ppt') }}
                        className="flex-1 py-1.5 border border-navy-900 text-navy-900 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors"
                      >
                        PPT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
