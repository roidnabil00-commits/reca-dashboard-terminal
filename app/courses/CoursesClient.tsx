'use client'

import { useState } from 'react'
import type { CourseModule } from '@/types'

interface CoursesClientProps {
  modules: CourseModule[]
}

function getYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be, youtube.com/watch, youtube.com/embed
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`
  }
  return url
}

export default function CoursesClient({ modules }: CoursesClientProps) {
  const [activeModule, setActiveModule] = useState<CourseModule | null>(
    modules.find((m) => m.type === 'video') || modules[0] || null
  )
  const [activeTab, setActiveTab] = useState<'video' | 'book'>('video')

  const videoModules = modules.filter((m) => m.type === 'video')
  const bookModules = modules.filter((m) => m.type === 'book')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-display font-bold text-navy-900">Learning Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Exclusive courses and resources for premium members.</p>

          {/* Tab switcher */}
          <div className="flex gap-1 mt-4">
            {(['video', 'book'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  const first = modules.find((m) => m.type === tab)
                  if (first) setActiveModule(first)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-navy-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'video' ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Video ({videoModules.length})
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    Books ({bookModules.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto">
        {activeTab === 'video' ? (
          videoModules.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">No video modules available yet.</div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Player */}
              <div className="flex-1">
                {activeModule && activeModule.type === 'video' && (
                  <div>
                    <div className="iframe-wrapper rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <iframe
                        src={getYouTubeEmbedUrl(activeModule.source_link)}
                        title={activeModule.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-4">
                      <h2 className="font-display font-bold text-navy-900 text-xl">{activeModule.title}</h2>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{activeModule.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Playlist */}
              <div className="lg:w-72 xl:w-80">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Course Modules</h3>
                <div className="space-y-2">
                  {videoModules.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveModule(m)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-150 ${
                        activeModule?.id === m.id
                          ? 'bg-navy-900 border-navy-900 text-white'
                          : 'bg-white border-gray-200 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                          activeModule?.id === m.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold leading-tight ${activeModule?.id === m.id ? 'text-white' : 'text-navy-900'}`}>
                            {m.title}
                          </p>
                          <p className={`text-xs mt-1 line-clamp-2 ${activeModule?.id === m.id ? 'text-white/70' : 'text-gray-400'}`}>
                            {m.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          bookModules.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">No book modules available yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookModules.map((m) => (
                <a
                  key={m.id}
                  href={m.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-navy-900 text-base group-hover:text-navy-700 transition-colors">{m.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-3">{m.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-navy-700 text-xs font-medium">
                    Open Resource
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
