import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_INSTRUCTION = `You are the official RECA AI Analyst Assistant — an elite market intelligence advisor embedded within the Reca Intelligence Terminal platform. 

Your mandate:
- Provide sharp, elite management consultant-style, data-driven answers about Indonesian markets to our premium members.
- Speak with authority and precision. Every response should feel like a senior partner's briefing note.
- Focus on: Indonesian macroeconomics, sectoral analysis, capital markets (IDX), consumer trends, commodity markets, regulatory landscape, and investment thesis.
- Use structured analysis: lead with the key insight, support with data/reasoning, close with the strategic implication.
- When uncertain, say so clearly — never speculate beyond your knowledge. Direct them to RECA research reports when deeper analysis is needed.
- Communicate in the same language the user uses (Bahasa Indonesia or English).
- Maintain a tone that is authoritative, concise, and deeply professional — never casual or generic.`

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    })

    // Build chat history (all but last message)
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({ history })

    // Send the last message
    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'AI service unavailable', reply: 'Maaf, layanan AI sedang tidak tersedia. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
