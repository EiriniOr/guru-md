'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'

const SUGGESTIONS = [
  'Explain the pathophysiology of heart failure',
  'What are ESC guidelines for AF management?',
  'How does metoprolol work?',
  'Describe the brachial plexus injuries',
]

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  return (
    <div className="space-y-2">
      {/* Suggestions (only when empty) */}
      {value === '' && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => onSend(s)}
              disabled={disabled}
              className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask a medical question… (Enter to send)"
          rows={1}
          className="flex-1 resize-none bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 overflow-hidden"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          size="icon"
          className="bg-blue-600 hover:bg-blue-500 flex-shrink-0 rounded-xl w-11 h-11"
        >
          <SendHorizonal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
