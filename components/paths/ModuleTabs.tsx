'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { QuizRunner } from '@/components/quiz/QuizRunner'
import { cn } from '@/lib/utils'

interface Props {
  content: string
  moduleId: string
  moduleTitle: string
  pathSlug: string
}

export function ModuleTabs({ content, moduleId, moduleTitle, pathSlug }: Props) {
  const [tab, setTab] = useState<'content' | 'quiz'>('content')

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1 w-fit">
        {(['content', 'quiz'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize',
              tab === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {t === 'content' ? 'Study' : 'Quiz'}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {tab === 'content' && (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-code:text-green-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded
          prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
          prose-table:text-slate-300
          prose-th:text-white prose-th:border-slate-700
          prose-td:border-slate-700
          prose-blockquote:border-green-500 prose-blockquote:text-slate-300 prose-blockquote:bg-green-950/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-a:text-green-400
          prose-li:text-slate-300
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}

      {/* Quiz tab */}
      {tab === 'quiz' && (
        <QuizRunner moduleId={moduleId} moduleTitle={moduleTitle} pathSlug={pathSlug} />
      )}
    </div>
  )
}
