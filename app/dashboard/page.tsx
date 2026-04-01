import { createClient } from '@/lib/supabase/server'
import { BookOpen, MessageCircle, CheckCircle, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { RecommendationPanel } from '@/components/dashboard/RecommendationPanel'
import type { LearningPath, UserProgress, ActivityEvent } from '@/types'

const EVENT_LABELS: Record<string, string> = {
  module_viewed: 'Studied',
  quiz_completed: 'Completed quiz in',
  path_started: 'Started',
  message_sent: 'Asked AI Tutor',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: paths }, { data: progress }, { data: activity }, { data: modules }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('learning_paths').select('*').order('order_index'),
    supabase.from('user_progress').select('*').eq('user_id', user!.id),
    supabase.from('activity_log').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(8),
    supabase.from('modules').select('id, title'),
  ])

  const completedModules = (progress as UserProgress[] | null)?.filter(p => p.status === 'completed').length ?? 0
  const startedPaths = new Set((progress as UserProgress[] | null)?.map(p => p.path_id)).size
  const moduleMap = Object.fromEntries((modules ?? []).map(m => [m.id, m.title]))
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Student'

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {firstName} 👋</h1>
        <p className="text-slate-400 mt-1">Continue your medical education journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: 'Paths started', value: startedPaths, color: 'text-blue-400' },
          { icon: CheckCircle, label: 'Modules completed', value: completedModules, color: 'text-green-400' },
          { icon: TrendingUp, label: 'Available paths', value: (paths as LearningPath[] | null)?.length ?? 0, color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${color}`} />
                <div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-sm text-slate-400">{label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left col: paths + tutor */}
        <div className="col-span-2 space-y-6">
          {/* Paths */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Learning Paths</h2>
              <Link href="/dashboard/paths" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-blue-400 hover:text-blue-300')}>
                View all
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(paths as LearningPath[] | null)?.map((path) => {
                const pathProgress = (progress as UserProgress[] | null)?.filter(p => p.path_id === path.id) ?? []
                const completed = pathProgress.filter(p => p.status === 'completed').length
                return (
                  <Link key={path.id} href={`/dashboard/paths/${path.slug}`}>
                    <Card className="bg-slate-900 border-slate-800 hover:border-blue-600/50 transition-colors cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <div className="text-3xl mb-2">{path.icon}</div>
                        <CardTitle className="text-white text-sm">{path.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-xs line-clamp-2">{path.description}</p>
                        {completed > 0 && (
                          <p className="text-green-400 text-xs mt-2">{completed} module{completed !== 1 ? 's' : ''} done</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Tutor CTA */}
          <Card className="bg-gradient-to-r from-blue-900/40 to-slate-900 border-blue-800/50">
            <CardContent className="pt-5 pb-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MessageCircle className="w-9 h-9 text-blue-400" />
                <div>
                  <div className="font-semibold text-white text-sm">AI Tutor</div>
                  <div className="text-slate-400 text-xs">EU guidelines, drug mechanisms, anatomy</div>
                </div>
              </div>
              <Link href="/dashboard/tutor" className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-500 text-sm')}>
                Start chatting
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right col: recommendations + activity */}
        <div className="space-y-4">
          <RecommendationPanel />

          {/* Recent activity */}
          {(activity as ActivityEvent[] | null) && (activity as ActivityEvent[]).length > 0 && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> Recent activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(activity as ActivityEvent[]).map(e => (
                  <div key={e.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-slate-300 text-xs">
                        {EVENT_LABELS[e.event_type] ?? e.event_type}
                        {e.entity_id && moduleMap[e.entity_id] ? ` "${moduleMap[e.entity_id]}"` : ''}
                      </span>
                      <div className="text-slate-600 text-xs">{new Date(e.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
