import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SourceBadge } from './SourceBadge'
import type { TavilySource } from '@/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: TavilySource[]
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm">
          🦠
        </div>
      )}

      <div className={`max-w-[80%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-slate-800 text-slate-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none
              prose-p:my-1 prose-p:text-slate-100
              prose-headings:text-white prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
              prose-strong:text-white
              prose-code:text-blue-300 prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded prose-code:text-xs
              prose-pre:bg-slate-700 prose-pre:text-xs
              prose-table:text-slate-200 prose-th:text-white prose-th:border-slate-600 prose-td:border-slate-600
              prose-blockquote:border-blue-400 prose-blockquote:text-slate-300
              prose-li:text-slate-100 prose-li:my-0.5
              prose-a:text-blue-400
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || '▌'}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.sources.map((s, i) => (
              <SourceBadge key={i} index={i + 1} source={s} />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-sm">
          👤
        </div>
      )}
    </div>
  )
}
