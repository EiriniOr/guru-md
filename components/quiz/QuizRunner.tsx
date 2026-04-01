'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { QuizQuestion } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, ChevronRight, Trophy } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  moduleId: string
  moduleTitle: string
  pathSlug: string
}

type Phase = 'loading' | 'quiz' | 'result'

export function QuizRunner({ moduleId, moduleTitle, pathSlug }: Props) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null)
  const [generating, setGenerating] = useState(false)

  async function startQuiz() {
    setGenerating(true)
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId }),
    })
    if (!res.ok) { toast.error('Failed to generate quiz'); setGenerating(false); return }
    const { questions: qs } = await res.json()
    setQuestions(qs)
    setAnswers([])
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setPhase('quiz')
    setGenerating(false)
  }

  function selectAnswer(idx: number) {
    if (revealed) return
    setSelected(idx)
  }

  function confirm() {
    if (selected === null) return
    setRevealed(true)
    setAnswers(prev => [...prev, selected])
  }

  async function next() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      // Submit
      const finalAnswers = [...answers]
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, questions, answers: finalAnswers }),
      })
      const data = await res.json()
      setResult(data)
      setPhase('result')
    }
  }

  const q = questions[current]

  if (phase === 'loading') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-4xl">📝</div>
        <div>
          <h3 className="text-lg font-semibold text-white">Quiz: {moduleTitle}</h3>
          <p className="text-slate-400 text-sm mt-1">5 AI-generated questions · 60% to pass</p>
        </div>
        <Button onClick={startQuiz} disabled={generating} className="bg-green-600 hover:bg-green-500">
          {generating ? 'Generating questions…' : 'Start quiz'}
        </Button>
      </div>
    )
  }

  if (phase === 'result' && result) {
    const pct = Math.round((result.score / result.total) * 100)
    return (
      <div className="text-center space-y-6 py-8">
        <Trophy className={cn('w-14 h-14 mx-auto', result.passed ? 'text-yellow-400' : 'text-slate-500')} />
        <div>
          <h3 className="text-2xl font-bold text-white">{result.passed ? 'Passed!' : 'Not quite'}</h3>
          <p className="text-slate-400 mt-1">{result.score} / {result.total} correct ({pct}%)</p>
          {result.passed && <p className="text-green-400 text-sm mt-1">Module marked as complete</p>}
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={startQuiz} disabled={generating} variant="outline" className="border-slate-700 text-slate-300">
            {generating ? 'Generating…' : 'Retry'}
          </Button>
          <Button onClick={() => router.push(`/dashboard/paths/${pathSlug}`)} className="bg-green-600 hover:bg-green-500">
            Back to path
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz' && q) {
    const correct = q.correct
    return (
      <div className="space-y-5">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Question {current + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={cn('w-2 h-2 rounded-full', i < current ? 'bg-green-500' : i === current ? 'bg-white' : 'bg-slate-700')} />
            ))}
          </div>
        </div>

        {/* Question */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-5">
            <p className="text-white font-medium leading-relaxed">{q.question}</p>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect = i === correct
            let style = 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
            if (revealed) {
              if (isCorrect) style = 'bg-green-900/40 border-green-500 text-green-300'
              else if (isSelected && !isCorrect) style = 'bg-red-900/40 border-red-500 text-red-300'
              else style = 'bg-slate-800 border-slate-700 text-slate-500'
            } else if (isSelected) {
              style = 'bg-green-900/40 border-green-500 text-green-200'
            }
            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={cn('w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3', style)}
              >
                <span className="font-mono text-xs w-5 flex-shrink-0">{['A','B','C','D'][i]}</span>
                <span className="flex-1">{opt}</span>
                {revealed && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <Card className="bg-green-950/40 border-green-800/50">
            <CardContent className="pt-4 pb-4">
              <p className="text-green-200 text-sm">{q.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Action */}
        <div className="flex justify-end">
          {!revealed ? (
            <Button onClick={confirm} disabled={selected === null} className="bg-green-600 hover:bg-green-500">
              Confirm answer
            </Button>
          ) : (
            <Button onClick={next} className="bg-green-600 hover:bg-green-500">
              {current + 1 < questions.length ? (
                <><ChevronRight className="w-4 h-4 mr-1" /> Next question</>
              ) : 'See results'}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return null
}
