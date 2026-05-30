'use client'

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface QuickPrompt {
  id: string
  title: string
  prompt: string
  icon: React.ReactNode
}

// ============================================================================
// SVG ICONS COMPONENTS (OPTIMIZED INLINE)
// ============================================================================
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

const IconChartSummary = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)

const IconTrendingUp = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
)

const IconGlobalEconomy = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
)

// ============================================================================
// BASE STYLING CONSTANTS & MESSAGES
// ============================================================================
const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Selamat datang di **RECA AI Analyst Terminal**. Saya siap memberikan analisis komprehensif terkait makroekonomi, tren pasar modal, dan lanskap bisnis di Indonesia. Ada yang bisa saya bantu hari ini?',
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'idx-update',
    title: 'Update IHSG',
    prompt: 'Berikan analisis singkat mengenai tren pergerakan IHSG minggu ini beserta sektor yang paling potensial.',
    icon: <IconChartSummary />,
  },
  {
    id: 'macro-indo',
    title: 'Makroekonomi',
    prompt: 'Bagaimana proyeksi pertumbuhan ekonomi Indonesia di kuartal ini mempertimbangkan kebijakan suku bunga BI terbaru?',
    icon: <IconGlobalEconomy />,
  },
  {
    id: 'tech-sector',
    title: 'Sektor Teknologi',
    prompt: 'Analisis potensi investasi di sektor teknologi dan startup digital Indonesia untuk jangka menengah.',
    icon: <IconTrendingUp />,
  },
]

// ============================================================================
// CORE HELPER FUNCTIONS
// ============================================================================
const formatMarkdownToJSX = (text: string) => {
  if (!text) return null
  
  const lines = text.split('\n')
  return lines.map((line, index) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ')
    let formattedLine = line

    if (isBullet) {
      formattedLine = formattedLine.replace(/^[-*]\s+/, '')
    }

    const parts = formattedLine.split(/(\*\*.*?\*\*)/g)
    const renderedParts = parts.map((part, i) => {
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
          <span className="text-emerald-500 mt-0.5 select-none">•</span>
          <span className="text-gray-300">{renderedParts}</span>
        </div>
      )
    }

    if (line.trim() === '') {
      return <div key={index} className="h-3"></div>
    }

    return (
      <div key={index} className="mb-1 text-gray-300">
        {renderedParts}
      </div>
    )
  })
}

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================
export default function AiChat() {
  // --- Local Component State ---
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showPrompts, setShowPrompts] = useState<boolean>(true)

  // --- Document Element References ---
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // --- Effect 1: Initialize System Chat History ---
  useEffect(() => {
    const savedHistory = localStorage.getItem('reca_chat_history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as ChatMessage[]
        if (parsed && parsed.length > 0) {
          setMessages(parsed)
          setShowPrompts(false)
        } else {
          setMessages([INITIAL_MESSAGE])
        }
      } catch (e) {
        setMessages([INITIAL_MESSAGE])
      }
    } else {
      setMessages([INITIAL_MESSAGE])
    }
  }, [])

  // --- Effect 2: Persist Chat History Stream ---
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('reca_chat_history', JSON.stringify(messages))
    }
  }, [messages])

  // --- Effect 3: Anchor Dynamic Scroll Viewport ---
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [messages, open, loading])

  // --- Effect 4: Textarea Boundary Matrix Resizer ---
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`
    }
  }, [input])

  // --- Control Mechanisms ---
  const clearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh jejak riwayat analisis ini?')) {
      setMessages([INITIAL_MESSAGE])
      localStorage.removeItem('reca_chat_history')
      setShowPrompts(true)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmission(input)
    }
  }

  const handleQuickPrompt = (promptText: string) => {
    setInput('')
    setShowPrompts(false)
    handleSubmission(promptText)
  }

  // --- Core API Data Dispatcher Pipeline ---
  const handleSubmission = async (targetText: string) => {
    const sanitizedText = targetText.trim()
    if (!sanitizedText || loading) return

    // 1. Establish Local Visual State Update Immediately
    const userMsg: ChatMessage = { role: 'user', content: sanitizedText }
    const updatedMessagesList = [...messages, userMsg]
    
    setMessages(updatedMessagesList)
    setInput('')
    setLoading(true)
    setShowPrompts(false)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      // FIX CRITICAL BUG OPSI 1: 
      // Filter out any messages that aren't properly sequenced.
      // Gemini startChat history must start with a 'user' message. 
      // If our very first element is the INITIAL_MESSAGE (role: assistant), we slice it out.
      let payloadMessages = [...updatedMessagesList]
      
      if (payloadMessages.length > 0 && payloadMessages[0].role === 'assistant') {
        payloadMessages = payloadMessages.slice(1)
      }

      // 2. Perform Network Handshake
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ messages: payloadMessages }),
      })

      const payloadData = await response.json()
      
      if (!response.ok) {
        throw new Error(payloadData.reply || payloadData.error || 'Network transaction failed')
      }

      // 3. Inject Assistant Node Response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: payloadData.reply },
      ])

    } catch (err: any) {
      console.error('[RECA Chat Interface Exception]:', err)
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: `**Sistem Interupsi:** Koneksi gagal diproses. (${err.message || 'Unknown Network Error'}). Silakan ulangi instruksi Anda.` 
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // LAYOUT VIEWPORT RENDERING ARCHITECTURE
  // ============================================================================
  return (
    <>
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE FLOATING TOGGLE UNIT                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center select-none
          ${open 
            ? 'w-12 h-12 bg-slate-800 text-gray-400 hover:text-white border border-slate-700' 
            : 'w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 hover:shadow-emerald-500/20 border border-slate-700/50 hover:border-emerald-500/50 hover:scale-105'
          }`}
        aria-label="Toggle RECA Workspace Terminal"
      >
        {open ? <IconClose /> : <IconChat />}
        
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
        )}
      </button>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* INTERFACE PANEL CONSOLE MATRIX                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div 
        className={`fixed z-40 transition-all duration-300 ease-in-out flex flex-col bg-[#0B1120] border border-slate-800 shadow-2xl shadow-black/80
          ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}
          ${isFullscreen 
            ? 'bottom-0 right-0 w-full h-[100dvh] sm:rounded-none border-none' 
            : 'bottom-24 right-6 w-[calc(100vw-3rem)] max-w-[420px] h-[640px] max-h-[82vh] rounded-2xl overflow-hidden'
          }
        `}
      >
        {/* HEADER BLOCK */}
        <div className="bg-slate-900/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
              <IconChat />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h2 className="text-gray-100 text-sm font-bold tracking-wide flex items-center gap-2">
                RECA TERMINAL <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v3.5</span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Market Analyst Engine
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <button 
                onClick={clearHistory}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-150"
                title="Wipe Terminal Session"
              >
                <IconTrash />
              </button>
            )}
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-150 hidden sm:block"
              title={isFullscreen ? "Minimize Layout" : "Maximize Layout"}
            >
              {isFullscreen ? <IconMinimize /> : <IconMaximize />}
            </button>
          </div>
        </div>

        {/* MESSAGES CONSOLE DISPLAY STREAM */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-gradient-to-b from-[#0B1120] to-[#070c16] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user'
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} transform transition-all duration-200`}>
                <div className={`flex gap-3 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Identity Badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 select-none text-xs font-mono
                    ${isUser 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'bg-slate-800 text-emerald-400 border border-slate-700'
                    }
                  `}>
                    {isUser ? 'USR' : 'AI'}
                  </div>

                  {/* Message Node Bubble */}
                  <div
                    className={`px-4 py-3 text-[14px] leading-relaxed shadow-md tracking-normal font-normal
                      ${isUser
                        ? 'bg-blue-600/10 text-blue-100 rounded-2xl rounded-tr-none border border-blue-500/20'
                        : 'bg-slate-800/40 text-gray-200 rounded-2xl rounded-tl-none border border-slate-700/40'
                      }`}
                  >
                    {isUser ? (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    ) : (
                      formatMarkdownToJSX(msg.content)
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Core App Pending State Animator */}
          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-3 max-w-[85%] flex-row">
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
          <div ref={bottomRef} className="h-2" />
        </div>

        {/* ACCELERATED QUICK PROMPTS CONTROLLERS */}
        {showPrompts && !loading && messages.length <= 1 && (
          <div className="px-5 pb-5 shrink-0 bg-[#0B1120]">
            <p className="text-[10px] font-bold text-slate-500 mb-2.5 uppercase tracking-widest ml-1 select-none">
              Saran Analisis Pasar Modal & Makro
            </p>
            <div className="flex flex-col gap-2">
              {QUICK_PROMPTS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleQuickPrompt(item.prompt)}
                  className="flex items-center gap-3.5 w-full text-left bg-slate-800/30 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0B1120] border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-200 shrink-0">
                    {item.icon}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xs font-bold text-gray-300 group-hover:text-gray-100 transition-colors">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 w-full">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INPUT HARDWARE MATRIX PANEL */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 shrink-0">
          <div className="relative flex items-end gap-2 bg-[#0B1120] border border-slate-700 focus-within:border-emerald-500/40 rounded-xl p-1.5 transition-all duration-200 shadow-inner">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Masukkan query analitik atau rumusan makro..."
              className="flex-1 max-h-36 min-h-[40px] w-full bg-transparent text-gray-200 text-sm px-3 py-2.5 resize-none focus:outline-none placeholder:text-slate-600 scrollbar-thin scrollbar-thumb-slate-800"
              disabled={loading}
              rows={1}
            />
            <div className="pb-1 pr-1 shrink-0">
              <button
                onClick={() => handleSubmission(input)}
                disabled={loading || !input.trim()}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200
                  ${loading || !input.trim() 
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' 
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 hover:shadow-lg hover:shadow-emerald-500/20'
                  }
                `}
              >
                <IconSend />
              </button>
            </div>
          </div>
          <div className="text-center mt-3 select-none">
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide">
              RECA Systems Platform • Powered by Gemini 3.5 Flash Engine
            </p>
          </div>
        </div>
      </div>
    </>
  )
}