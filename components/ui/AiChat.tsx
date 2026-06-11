'use client'

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface QuickPrompt {
  id: string
  title: string
  prompt: string
  icon: React.ReactNode
}

// ─────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────
const IconSend = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
)

const IconChat = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const IconMaximize = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
)

const IconMinimize = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
  </svg>
)

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

const IconResearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
)

const IconChart = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)

const IconTrending = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
)

const IconReport = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
)

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Selamat datang di **RECA AI Analyst Terminal**. Saya memiliki akses ke seluruh konten platform Anda — termasuk Intel Feed, Research Library, Private Reports, dan Learning Center. Tanyakan apa saja, termasuk "apakah ada riset tentang X?" atau "laporan apa yang tersedia untuk saya?"',
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'cek-research',
    title: 'Cek Research Tersedia',
    prompt: 'Riset apa saja yang tersedia di Research Library saat ini?',
    icon: <IconResearch />,
  },
  {
    id: 'cek-report',
    title: 'Laporan Saya',
    prompt: 'Laporan privat apa yang tersedia untuk akun saya?',
    icon: <IconReport />,
  },
  {
    id: 'update-market',
    title: 'Update Pasar Terkini',
    prompt: 'Berikan ringkasan intel feed terbaru yang ada di dashboard.',
    icon: <IconChart />,
  },
  {
    id: 'saran-investasi',
    title: 'Tesis Investasi',
    prompt: 'Berdasarkan data yang ada di platform, sektor mana yang paling menarik saat ini?',
    icon: <IconTrending />,
  },
]

// ─────────────────────────────────────────────────────────────
// MARKDOWN RENDERER
// ─────────────────────────────────────────────────────────────
function renderMarkdown(text: string) {
  if (!text) return null
  const lines = text.split('\n')

  return lines.map((line, index) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ')
    let content = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line

    // Bold rendering
    const parts = content.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-emerald-400">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={i}>{part}</span>
    })

    if (isBullet) {
      return (
        <div key={index} className="flex gap-2 mt-1.5 mb-1.5 pl-1">
          <span className="text-emerald-500 mt-0.5 select-none flex-shrink-0">•</span>
          <span className="text-gray-300">{rendered}</span>
        </div>
      )
    }

    if (line.trim() === '') return <div key={index} className="h-2" />

    return (
      <div key={index} className="mb-1 text-gray-300">
        {rendered}
      </div>
    )
  })
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return () => clearTimeout(timer)
  }, [messages, open, loading])

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [input])

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE])
    setShowPrompts(true)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleQuickPrompt = (promptText: string) => {
    setInput('')
    setShowPrompts(false)
    sendMessage(promptText)
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setShowPrompts(false)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      // Kirim semua messages kecuali initial greeting assistant
      // agar Gemini history selalu dimulai dari 'user'
      let payload = [...updatedMessages]
      if (payload.length > 0 && payload[0].role === 'assistant') {
        payload = payload.slice(1)
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.reply || data.error || 'Request failed')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `**Koneksi gagal.** ${errMsg}. Silakan coba kembali.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center select-none
          ${open
            ? 'w-12 h-12 bg-slate-800 text-gray-400 hover:text-white border border-slate-700'
            : 'w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 border border-slate-700/50 hover:border-emerald-500/50 hover:scale-105'
          }`}
        aria-label="Toggle RECA AI Terminal"
      >
        {open ? <IconClose /> : <IconChat />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
          </span>
        )}
      </button>

      {/* ── Chat panel ── */}
      <div
        className={`fixed z-40 transition-all duration-300 ease-in-out flex flex-col bg-[#0B1120] border border-slate-800 shadow-2xl shadow-black/80
          ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}
          ${isFullscreen
            ? 'bottom-0 right-0 w-full h-[100dvh] rounded-none border-none'
            : 'bottom-24 right-6 w-[calc(100vw-3rem)] max-w-[420px] h-[640px] max-h-[82vh] rounded-2xl overflow-hidden'
          }`}
      >
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
              <IconChat />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <h2 className="text-gray-100 text-sm font-bold tracking-wide flex items-center gap-2">
                RECA ANALYST
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Platform-Aware
                </span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Terhubung ke data platform Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <button
                onClick={clearHistory}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Hapus riwayat percakapan"
              >
                <IconTrash />
              </button>
            )}
            <button
              onClick={() => setIsFullscreen(v => !v)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              title={isFullscreen ? 'Perkecil' : 'Perbesar'}
            >
              {isFullscreen ? <IconMinimize /> : <IconMaximize />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-gradient-to-b from-[#0B1120] to-[#070c16]">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user'
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2.5 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono select-none
                    ${isUser
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700'
                    }`}
                  >
                    {isUser ? 'USR' : 'AI'}
                  </div>

                  {/* Bubble */}
                  <div className={`px-4 py-3 text-sm leading-relaxed shadow-md
                    ${isUser
                      ? 'bg-blue-600/10 text-blue-100 rounded-2xl rounded-tr-none border border-blue-500/20'
                      : 'bg-slate-800/40 text-gray-200 rounded-2xl rounded-tl-none border border-slate-700/40'
                    }`}
                  >
                    {isUser
                      ? <span className="whitespace-pre-wrap">{msg.content}</span>
                      : renderMarkdown(msg.content)
                    }
                  </div>
                </div>
              </div>
            )
          })}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2.5 flex-row">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <IconChat />
                </div>
                <div className="bg-slate-800/30 px-5 py-3.5 rounded-2xl rounded-tl-none border border-slate-700/30 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-emerald-500/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-1" />
        </div>

        {/* Quick prompts */}
        {showPrompts && !loading && messages.length <= 1 && (
          <div className="px-4 pb-4 shrink-0 bg-[#0B1120]">
            <p className="text-[10px] font-bold text-slate-500 mb-2.5 uppercase tracking-widest ml-1 select-none">
              Pertanyaan Cepat
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_PROMPTS.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleQuickPrompt(item.prompt)}
                  className="flex items-start gap-2.5 text-left bg-slate-800/30 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0B1120] border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-300 group-hover:text-gray-100 transition-colors leading-tight">{item.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 shrink-0">
          <div className="relative flex items-end gap-2 bg-[#0B1120] border border-slate-700 focus-within:border-emerald-500/40 rounded-xl p-1.5 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya tentang riset, laporan, atau analisis pasar..."
              className="flex-1 max-h-36 min-h-[40px] w-full bg-transparent text-gray-200 text-sm px-3 py-2.5 resize-none focus:outline-none placeholder:text-slate-600"
              disabled={loading}
              rows={1}
            />
            <div className="pb-1 pr-1 shrink-0">
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200
                  ${loading || !input.trim()
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900'
                  }`}
              >
                <IconSend />
              </button>
            </div>
          </div>
          <p className="text-center mt-2.5 text-[10px] text-slate-500 font-medium tracking-wide select-none">
            RECA Intelligence Terminal — Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </>
  )
}