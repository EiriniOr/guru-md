import { createClient } from '@/lib/supabase/server'
import { buildQuizPrompt } from '@/lib/claude/prompts'
import { parseQuizResponse } from '@/lib/quiz/parser'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId } = await request.json() as { moduleId: string }

  const { data: module_ } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single()

  if (!module_) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: buildQuizPrompt(module_.title, module_.content_md),
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const questions = parseQuizResponse(raw)
    return NextResponse.json({ questions })
  } catch (err) {
    console.error('Quiz parse error:', err, '\nRaw:', raw)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
