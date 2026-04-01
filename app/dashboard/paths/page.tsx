import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LearningPath, Module, UserProgress } from '@/types'

export default async function PathsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: paths }, { data: modules }, { data: progress }] = await Promise.all([
    supabase.from('learning_paths').select('*').order('order_index'),
    supabase.from('modules').select('*'),
    supabase.from('user_progress').select('*').eq('user_id', user!.id),
  ])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Learning Paths</h1>
        <p className="text-slate-400 mt-1">Choose a specialty to start learning</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(paths as LearningPath[] | null)?.map((path) => {
          const pathModules = (modules as Module[] | null)?.filter(m => m.path_id === path.id) ?? []
          const pathProgress = (progress as UserProgress[] | null)?.filter(p => p.path_id === path.id) ?? []
          const completed = pathProgress.filter(p => p.status === 'completed').length
          const started = pathProgress.length > 0

          return (
            <Link key={path.id} href={`/dashboard/paths/${path.slug}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-blue-600/50 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{path.icon}</span>
                      <div>
                        <CardTitle className="text-white text-xl">{path.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-slate-800 text-slate-300 text-xs">
                          {path.specialty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      {started ? (
                        <span className="text-green-400">{completed} / {pathModules.length} completed</span>
                      ) : (
                        <span>{pathModules.length} modules</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">{path.description}</p>
                  {started && (
                    <div className="mt-3 bg-slate-800 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${(completed / pathModules.length) * 100}%` }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
