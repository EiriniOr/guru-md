import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { CheckCircle, Circle, ChevronRight } from 'lucide-react'
import type { Module, UserProgress } from '@/types'

export default async function PathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: path } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!path) notFound()

  const [{ data: modules }, { data: progress }] = await Promise.all([
    supabase.from('modules').select('*').eq('path_id', path.id).order('order_index'),
    supabase.from('user_progress').select('*').eq('user_id', user!.id).eq('path_id', path.id),
  ])

  const completed = (progress as UserProgress[] | null)?.filter(p => p.status === 'completed').length ?? 0
  const total = (modules as Module[] | null)?.length ?? 0

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="text-5xl">{path.icon}</span>
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/paths" className="text-slate-400 hover:text-slate-300 text-sm">Paths</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 text-sm">{path.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{path.title}</h1>
          <Badge variant="secondary" className="mt-1 bg-slate-800 text-slate-300">{path.specialty}</Badge>
          <p className="text-slate-400 mt-2 text-sm">{path.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      {completed > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="text-green-400">{completed} / {total} completed</span>
          </div>
          <div className="bg-slate-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Modules</h2>
        {(modules as Module[] | null)?.map((module, i) => {
          const moduleProgress = (progress as UserProgress[] | null)?.find(p => p.module_id === module.id)
          const isDone = moduleProgress?.status === 'completed'

          return (
            <Link key={module.id} href={`/dashboard/paths/${slug}/${module.id}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-blue-600/40 transition-all cursor-pointer">
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {isDone
                      ? <CheckCircle className="w-5 h-5 text-green-400" />
                      : <Circle className="w-5 h-5 text-slate-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-mono">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <CardTitle className="text-white text-sm font-medium">{module.title}</CardTitle>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{module.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Link href={`/dashboard/tutor?path=${path.slug}`} className={cn(buttonVariants({ variant: 'ghost' }), 'text-blue-400 hover:text-blue-300 pl-0')}>
        Ask the AI Tutor about {path.title} →
      </Link>
    </div>
  )
}
