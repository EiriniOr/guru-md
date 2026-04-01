import { createClient } from '@/lib/supabase/server'
import { BookOpen, MessageCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import type { LearningPath, UserProgress } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: paths }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('learning_paths').select('*').order('order_index'),
    supabase.from('user_progress').select('*').eq('user_id', user!.id),
  ])

  const completedModules = (progress as UserProgress[] | null)?.filter(p => p.status === 'completed').length ?? 0
  const startedPaths = new Set((progress as UserProgress[] | null)?.map(p => p.path_id)).size

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

      {/* Quick access: paths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Learning Paths</h2>
          <Link href="/dashboard/paths" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-blue-400 hover:text-blue-300')}>
            View all
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(paths as LearningPath[] | null)?.map((path) => {
            const pathProgress = (progress as UserProgress[] | null)?.filter(p => p.path_id === path.id) ?? []
            const completed = pathProgress.filter(p => p.status === 'completed').length
            return (
              <Link key={path.id} href={`/dashboard/paths/${path.slug}`}>
                <Card className="bg-slate-900 border-slate-800 hover:border-blue-600/50 transition-colors cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="text-3xl mb-2">{path.icon}</div>
                    <CardTitle className="text-white text-base">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-xs line-clamp-2">{path.description}</p>
                    {completed > 0 && (
                      <p className="text-green-400 text-xs mt-2">{completed} module{completed !== 1 ? 's' : ''} completed</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick access: tutor */}
      <Card className="bg-gradient-to-r from-blue-900/40 to-slate-900 border-blue-800/50">
        <CardContent className="pt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-10 h-10 text-blue-400" />
            <div>
              <div className="font-semibold text-white">AI Tutor</div>
              <div className="text-slate-400 text-sm">Ask anything — EU guidelines, drug mechanisms, anatomy</div>
            </div>
          </div>
          <Link href="/dashboard/tutor" className={cn(buttonVariants(), 'bg-blue-600 hover:bg-blue-500')}>
            Start chatting
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
