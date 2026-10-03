
'use client'

import { useState } from 'react'
import {
  getDrivePreviewUrl,
  extractDriveFileId,
} from '@/lib/drive'
import type { GeneralResearch } from '@/types'

interface ResearchClientProps {
  researches: GeneralResearch[]
}

// =====================================================
// COVER IMAGE
// Menampilkan thumbnail PDF/PPT dari Google Drive
// Jika gagal, tampilkan fallback cover RECA
// =====================================================

function CoverImage({
  driveLink,
  title,
}: {
  driveLink?: string | null
  title: string
}) {
  const [imgError, setImgError] = useState(false)

  const fileId = driveLink
    ? extractDriveFileId(driveLink)
    : null

  const thumbnailUrl = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`
    : null

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      {thumbnailUrl && !imgError ? (
        <img
          src={thumbnailUrl}
          alt={`Cover laporan: ${title}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-4 text-center">
          <svg
            className="mb-4 h-12 w-12 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>

          <p className="line-clamp-4 text-sm font-bold leading-relaxed text-slate-700">
            {title}
          </p>

          <div className="mt-4 border-t border-slate-400/50 pt-3">
            <p className="text-xs font-black tracking-[0.2em] text-slate-800">
              RECA
            </p>
            <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-slate-600">
              RESEARCH REPORT
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// MAIN RESEARCH LIBRARY
// =====================================================

export default function ResearchClient({
  researches,
}: ResearchClientProps) {
  const [selected, setSelected] = useState<GeneralResearch | null>(
    null
  )

  const [viewMode, setViewMode] = useState<'pdf' | 'ppt'>('pdf')
  const [search, setSearch] = useState('')

  // Search by title and description
  const filtered = researches.filter((research) => {
    const query = search.trim().toLowerCase()

    return (
      research.title.toLowerCase().includes(query) ||
      (research.description ?? '').toLowerCase().includes(query)
    )
  })

  // Current document link
  const activeDriveLink =
    selected && viewMode === 'pdf'
      ? selected.drive_link_pdf
      : selected?.drive_link_ppt

  // Google Drive preview URL
  const previewUrl = activeDriveLink
    ? getDrivePreviewUrl(activeDriveLink)
    : null

  // Open report
  const openResearch = (
    research: GeneralResearch,
    mode?: 'pdf' | 'ppt'
  ) => {
    const preferredMode =
      mode ??
      (research.drive_link_pdf ? 'pdf' : 'ppt')

    setSelected(research)
    setViewMode(preferredMode)
  }

  // Close modal
  const closePreview = () => {
    setSelected(null)
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            RECA Intelligence Terminal
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Research Library
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Premium market research, exclusively for members.
          </p>
        </header>

        {/* SEARCH */}
        <div className="relative mb-8 max-w-xl">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search research reports..."
            aria-label="Search research reports"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* RESULTS COUNT */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filtered.length} research report
            {filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* REPORT GRID */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
            <p className="text-base font-semibold text-slate-700">
              No research reports found.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Try another keyword or clear your search.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((research) => (
              <article
                key={research.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                {/* BOOK COVER */}
                <button
                  type="button"
                  onClick={() => openResearch(research)}
                  aria-label={`Open ${research.title}`}
                  className="block w-full overflow-hidden bg-slate-100 text-left"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <CoverImage
                      driveLink={
                        research.drive_link_pdf ||
                        research.drive_link_ppt
                      }
                      title={research.title}
                    />
                  </div>
                </button>

                {/* REPORT DETAILS */}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <button
                    type="button"
                    onClick={() => openResearch(research)}
                    className="text-left"
                  >
                    <h2 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-slate-600 sm:text-base">
                      {research.title}
                    </h2>
                  </button>

                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {research.description ||
                      'Laporan riset pasar eksklusif.'}
                  </p>

                  {/* ACCESS BUTTONS */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {research.drive_link_pdf && (
                      <button
                        type="button"
                        onClick={() =>
                          openResearch(research, 'pdf')
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                        PDF
                      </button>
                    )}

                    {research.drive_link_ppt && (
                      <button
                        type="button"
                        onClick={() =>
                          openResearch(research, 'ppt')
                        }
                        className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-50"
                      >
                        PPT
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          onClick={closePreview}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="research-preview-title"
            className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <h2
                  id="research-preview-title"
                  className="line-clamp-2 text-base font-bold text-slate-900 sm:text-xl"
                >
                  {selected.title}
                </h2>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
                  {selected.description}
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
                aria-label="Close preview"
                className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* DOCUMENT CONTROLS */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
              {selected.drive_link_pdf && (
                <button
                  type="button"
                  onClick={() => setViewMode('pdf')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    viewMode === 'pdf'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  PDF Preview
                </button>
              )}

              {selected.drive_link_ppt && (
                <button
                  type="button"
                  onClick={() => setViewMode('ppt')}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    viewMode === 'ppt'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  PPT Preview
                </button>
              )}

              {activeDriveLink && (
                <a
                  href={activeDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Open in Google Drive
                </a>
              )}
            </div>

            {/* DOCUMENT VIEWER */}
            <div className="min-h-0 flex-1 bg-slate-100">
              {previewUrl ? (
                <iframe
                  key={`${selected.id}-${viewMode}`}
                  src={previewUrl}
                  title={`${selected.title} - ${viewMode.toUpperCase()} Preview`}
                  className="h-full w-full border-0"
                  allow="autoplay"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <p className="font-semibold text-slate-700">
                    Preview unavailable
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    This report does not have a valid Google Drive link for the selected format.
                  </p>

                  {activeDriveLink && (
                    <a
                      href={activeDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      Open Document
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}