'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuditEntry {
  id: number
  actor_email: string
  action: string
  target: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

const ACTION_COLORS: Record<string, string> = {
  'user.created':              'bg-blue-100 text-blue-700',
  'feed.created':              'bg-emerald-100 text-emerald-700',
  'feed.deleted':              'bg-red-100 text-red-700',
  'research.created':          'bg-teal-100 text-teal-700',
  'research.deleted':          'bg-red-100 text-red-700',
  'private_report.assigned':   'bg-purple-100 text-purple-700',
  'private_report.deleted':    'bg-red-100 text-red-700',
  'course.created':            'bg-amber-100 text-amber-700',
  'course.deleted':            'bg-red-100 text-red-700',
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      setLogs((data || []) as AuditEntry[])
      setLoading(false)
    }
    fetchLogs()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-3">
        <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Memuat log...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">{logs.length} entri terakhir</p>
        <button
          onClick={() => {
            setLoading(true)
            supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100)
              .then(({ data }) => { setLogs((data || []) as AuditEntry[]); setLoading(false) })
          }}
          className="text-xs text-navy-700 font-medium hover:underline"
        >
          Refresh
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Belum ada aktivitas tercatat.
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className={`inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}`}>
                    {log.action}
                  </span>
                  <div className="min-w-0">
                    {log.target && (
                      <p className="text-sm font-medium text-navy-900 truncate">{log.target}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      oleh <span className="font-medium">{log.actor_email}</span>
                      {log.ip_address && log.ip_address !== 'unknown' && (
                        <span className="ml-1 text-gray-400">dari {log.ip_address}</span>
                      )}
                    </p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">
                        {JSON.stringify(log.metadata)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0 font-mono tabular-nums">
                  {new Date(log.created_at).toLocaleString('id-ID', {
                    day: 'numeric', month: 'short',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
