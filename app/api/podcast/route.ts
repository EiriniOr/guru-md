import Anthropic from '@anthropic-ai/sdk'
import { tavily } from '@tavily/core'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! })

const SYSTEM = `You are a medical podcast host for Guru, M.D. — a health education platform for medical students.
Your tone is engaging, clear, and educational. You explain things at a medical student level.
Focus on EU/Swedish medical context where relevant (ESC, EMA, Socialstyrelsen, FASS).

When given news articles, create a 2-3 minute podcast episode script.
Structure: brief intro → 2-3 key stories with clinical context → takeaway for medical students.
Write it as natural spoken audio — no markdown, no bullet points, no headers. Just flowing prose.
Keep it under 450 words.`

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topic, articles } = await request.json() as {
    topic: string
    articles?: Array<{ title: string; content: string; url: string }>
  }

  // If no articles provided, fetch fresh ones
  let sourceArticles = articles
  if (!sourceArticles || sourceArticles.length === 0) {
    const res = await tavilyClient.search(`${topic} medical news 2025`, {
      searchDepth: 'basic',
      maxResults: 5,
    })
    sourceArticles = res.results.map(r => ({ title: r.title, content: r.content, url: r.url }))
  }

  const sourcesText = sourceArticles
    .slice(0, 4)
    .map((a, i) => `[Article ${i + 1}] ${a.title}\n${a.content.slice(0, 400)}`)
    .join('\n\n')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Create a podcast episode about: "${topic}"\n\nSource articles:\n${sourcesText}`,
    }],
  })

  const script = message.content[0].type === 'text' ? message.content[0].text : ''

  return NextResponse.json({ script, sources: sourceArticles.slice(0, 4) })
}
