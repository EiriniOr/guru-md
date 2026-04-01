import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { QuizQuestion } from '@/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId, questions, answers } = await request.json() as {
    moduleId: string
    questions: QuizQuestion[]
    answers: number[]
  }

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
  const total = questions.length
  const passed = score / total >= 0.6

  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .insert({ user_id: user.id, module_id: moduleId, questions, answers, score, total, passed })
    .select()
    .single()

  // Log activity
  await supabase.from('activity_log').insert({
    user_id: user.id,
    event_type: 'quiz_completed',
    entity_id: moduleId,
    entity_type: 'module',
    metadata: { score, total, passed },
  })

  // Mark module complete if passed
  if (passed) {
    const { data: module_ } = await supabase
      .from('modules')
      .select('path_id')
      .eq('id', moduleId)
      .single()

    if (module_) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        path_id: module_.path_id,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,module_id' })
    }
  }

  return NextResponse.json({ attemptId: attempt?.id, score, total, passed })
}
