import { createClient } from '@/lib/supabase/server'
import { buildRecommendationPrompt } from '@/lib/claude/prompts'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: activity }, { data: progress }, { data: paths }, { data: modules }] = await Promise.all([
    supabase.from('activity_log').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('user_progress').select('*').eq('user_id', user.id),
    supabase.from('learning_paths').select('*').order('order_index'),
    supabase.from('modules').select('id, title, path_id'),
  ])

  const completedModuleIds = new Set((progress ?? []).filter(p => p.status === 'completed').map(p => p.module_id))

  const activitySummary = (activity ?? [])
    .slice(0, 15)
    .map(e => `${e.event_type} — ${e.entity_type ?? ''} ${e.entity_id ?? ''} at ${e.created_at.slice(0, 10)}`)
    .join('\n') || 'No activity yet'

  const progressSummary = (paths ?? []).map(path => {
    const pathModules = (modules ?? []).filter(m => m.path_id === path.id)
    const done = pathModules.filter(m => completedModuleIds.has(m.id)).length
    return `${path.title}: ${done}/${pathModules.length} modules completed`
  }).join('\n')

  const availablePaths = (paths ?? []).map(p => `- ${p.slug}: ${p.title} (${p.specialty})`).join('\n')

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: buildRecommendationPrompt(activitySummary, progressSummary, availablePaths),
      }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{"recommendations":[]}'
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const { recommendations } = JSON.parse(cleaned)

    return NextResponse.json({ recommendations })
  } catch (err) {
    console.error('Recommendations error:', err)
    return NextResponse.json({ recommendations: [] })
  }
}
