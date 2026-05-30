'use client'

import { useState } from 'react'
import DataChart from '@/components/charts/DataChart'
import AiChat from '@/components/ui/AiChat'
import type { Profile, DashboardFeed } from '@/types'

interface DashboardClientProps {
  profile: Profile | null
  feeds: DashboardFeed[]
}

const categoryLabels: Record<string, string> = {
  news: 'Market News',
  industry_data: 'Industry Data',
  reca_letter: 'RECA Letter',
}

const categoryBadge: Record<string, string> = {
  news: 'badge-news',
  industry_data: 'badge-data',
  reca_letter: 'badge-letter',
}

// Render content with proper paragraph + bold + newline support
function RichContent({ content }: { content: string }) {
  // Split by double newline = paragraphs, single newline = line break
  const paragraphs = content.split(/\n\n+/)
  return (
    <div className="text-gray-700 text-sm leading-relaxed space-y-3">
      {paragraphs.map((para, i) => {
        // Handle **bold** markdown
        const parts = para.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={i} className="whitespace-pre-line">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold text-navy-900">{part.slice(2, -2)}</strong>
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}

export default function DashboardClient({ profile, feeds }: DashboardClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = activeCategory === 'all'
    ? feeds
    : feeds.filter((f) => f.category === activeCategory)

  const newsCount = feeds.filter((f) => f.category === 'news').length
  const dataCount = feeds.filter((f) => f.category === 'industry_data').length
  const letterCount = feeds.filter((f) => f.category === 'reca_letter').length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-bold text-navy-900">Intelligence Terminal</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
                <span className="font-medium text-navy-900">{profile?.full_name?.split(' ')[0] || 'Member'}</span>
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 font-mono">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="flex items-center gap-1.5 mt-1 justify-end">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-xs text-emerald-600 font-medium">Live Feed</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
            {[
              { label: 'Market Updates', value: newsCount, color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Industry Data', value: dataCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
              { label: 'RECA Letters', value: letterCount, color: 'text-amber-700', bg: 'bg-amber-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl px-3 sm:px-4 py-3`}>
                <p className={`text-xl sm:text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex gap-0 overflow-x-auto">
          {['all', 'news', 'industry_data', 'reca_letter'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-150 ${
                activeCategory === cat
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat === 'all' ? 'All Feeds' : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No feeds available in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((feed) => {
              const isCritical = feed.category === 'industry_data' &&
                feed.chart_data && feed.chart_data.some((d) => d.value < 0)
              const isExpanded = expandedId === feed.id
              const hasLongContent = feed.content.length > 300

              return (
                <div key={feed.id} className="card p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={categoryBadge[feed.category]}>
                          {categoryLabels[feed.category]}
                        </span>
                        {isCritical && <span className="badge-critical">⚠ Critical</span>}
                      </div>
                      <h2 className="font-display font-bold text-navy-900 text-base sm:text-lg leading-tight">
                        {feed.title}
                      </h2>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0 font-mono">
                      {new Date(feed.created_at || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  {/* Rich content with expand/collapse */}
                  <div className={`relative ${!isExpanded && hasLongContent ? 'max-h-32 overflow-hidden' : ''}`}>
                    <RichContent content={feed.content} />
                    {!isExpanded && hasLongContent && (
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
                    )}
                  </div>

                  {hasLongContent && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : feed.id)}
                      className="text-xs font-medium text-navy-700 hover:text-navy-900 mt-2 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg> Show less</>
                      ) : (
                        <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg> Read more</>
                      )}
                    </button>
                  )}

                  {/* Chart */}
                  {feed.chart_data && feed.chart_data.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <DataChart
                        data={feed.chart_data}
                        type={feed.category === 'industry_data' ? 'area' : 'line'}
                        isCritical={!!isCritical}
                        height={220}
                      />
                    </div>
                  )}

                  {feed.drive_link && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <a href={feed.drive_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-navy-700 hover:text-navy-900 font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        View Full Document
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AiChat />
    </div>
  )
}
