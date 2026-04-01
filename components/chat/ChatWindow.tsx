'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { GuruLogo } from '@/components/ui/GuruLogo'
import type { TavilySource } from '@/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: TavilySource[]
}

interface Props {
  moduleTitle?: string
  initialSessionId?: string
}

export function ChatWindow({ moduleTitle, initialSessionId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId ?? null)
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (streaming) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' }
    setMessages(prev => [...prev, userMsg, assistantMsg])
    setStreaming(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId, moduleTitle }),
    })

    if (!res.body) { setStreaming(false); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = JSON.parse(line.slice(6))
        if (data.type === 'session') setSessionId(data.sessionId)
        if (data.type === 'text') {
          setMessages(prev => prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: m.content + data.text } : m
          ))
        }
        if (data.type === 'done') {
          setMessages(prev => prev.map(m =>
            m.id === assistantMsg.id ? { ...m, sources: data.sources } : m
          ))
        }
      }
    }

    setStreaming(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-16 space-y-3">
            <div className="flex justify-center"><GuruLogo size={64} /></div>
            <p className="text-lg font-medium text-slate-300">Ask Guru, M.D.</p>
            <p className="text-sm">
              {moduleTitle
                ? `Studying ${moduleTitle} — ask anything about this topic`
                : 'Ask about any medical topic — EU guidelines, pharmacology, anatomy…'
              }
            </p>
          </div>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-4">
        <ChatInput onSend={sendMessage} disabled={streaming} />
      </div>
    </div>
  )
}
