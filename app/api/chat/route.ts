import { createClient } from '@/lib/supabase/server'
import { searchMedical } from '@/lib/tavily/search'
import { buildTutorSystemPrompt } from '@/lib/claude/prompts'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import type { TavilySource } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, sessionId, moduleTitle } = await request.json() as {
    message: string
    sessionId: string | null
    moduleTitle?: string
  }

  // Fetch or create session
  let currentSessionId = sessionId
  if (!currentSessionId) {
    const { data: session } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select()
      .single()
    currentSessionId = session?.id ?? null
  }

  // Fetch prior messages for context
  const { data: priorMessages } = currentSessionId
    ? await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true })
        .limit(20)
    : { data: [] }

  // Persist user message
  await supabase.from('chat_messages').insert({
    session_id: currentSessionId,
    role: 'user',
    content: message,
  })

  // Search medical sources
  const sources: TavilySource[] = await searchMedical(
    `${message} medical education${moduleTitle ? ` ${moduleTitle}` : ''}`
  )

  // Build messages array
  const messages = [
    ...(priorMessages ?? []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ]

  // Stream from Claude
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: buildTutorSystemPrompt(sources, moduleTitle),
    messages,
  })

  let fullResponse = ''

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // Send sessionId first
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'session', sessionId: currentSessionId })}\n\n`)
      )

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          const text = chunk.delta.text
          fullResponse += text
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'text', text })}\n\n`)
          )
        }
      }

      // Persist assistant message
      await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: fullResponse,
        sources: sources.length > 0 ? sources : null,
      })

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: user.id,
        event_type: 'message_sent',
        entity_id: currentSessionId,
        entity_type: 'chat_session',
      })

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'done', sources })}\n\n`)
      )
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
