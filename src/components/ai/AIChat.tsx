'use client'

import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { FootprintResult } from '@/types/carbon'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface AIChatProps {
  footprintContext: FootprintResult
}

export function AIChat({ footprintContext }: AIChatProps) {
  const { getToken } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-assistant',
      role: 'assistant',
      content: `Hello! I'm your Gemini Carbon Advisor. I can see your footprint is currently ${footprintContext.total.toFixed(1)} tonnes of CO₂e/yr. Ask me anything about how to reduce it, get recommendations for specific actions, or outline a personalized carbon plan!`,
    },
  ])
  const [input, setInput] = useState('')
  const [generating, setGenerating] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || generating) return

    const userMessage = input.trim()
    const userMsgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
    const assistantMsgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
    setInput('')
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: userMessage }])
    setGenerating(true)

    // Add temporary empty assistant message to stream into
    setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }])

    try {
      const token = await getToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          footprintContext: {
            transport: footprintContext.transport,
            diet: footprintContext.diet,
            energy: footprintContext.energy,
            flights: footprintContext.flights,
            goods: footprintContext.goods,
            total: footprintContext.total,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('ReadableStream not supported')

      let assistantResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunkText = decoder.decode(value)
        const lines = chunkText.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim()
            if (dataStr === '[DONE]') continue

            try {
              const data = JSON.parse(dataStr)
              if (data.text) {
                assistantResponse += data.text
                setMessages((prev) => {
                  const updated = [...prev]
                  const last = updated[updated.length - 1]
                  if (last && last.role === 'assistant') {
                    last.content = assistantResponse
                  }
                  return updated
                })
              } else if (data.error) {
                console.error('API Stream Error:', data.error)
              }
            } catch (err) {
              // Ignore parsing errors for partial/malformed JSON chunks
            }
          }
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('Chat error:', errorMsg)
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last && last.role === 'assistant') {
          last.content = 'Sorry, I encountered an issue. Please try checking your connection or trying again shortly.'
        }
        return updated
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl glassmorphism">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-card/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">AI Carbon Advisor</h3>
            <span className="text-[10px] text-emerald-500 font-bold">Online & Active</span>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">Powered by Gemini</span>
      </div>

      {/* Message Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
              {!isUser && (
                <div className="p-2 bg-secondary text-primary rounded-xl border border-border/40 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-primary text-primary-foreground font-semibold rounded-tr-none'
                    : 'bg-secondary/40 border border-border/30 text-foreground rounded-tl-none'
                }`}
              >
                {msg.content === '' && generating ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Thinking...
                  </span>
                ) : (
                  msg.content
                )}
              </div>
              {isUser && (
                <div className="p-2 bg-primary/15 text-primary rounded-xl shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-border/40 bg-card/40 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your carbon reductions..."
          disabled={generating}
          aria-label="Message to AI"
          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || generating}
          className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/95 transition-all shadow-md shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-50"
          aria-label="Send message to AI"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
