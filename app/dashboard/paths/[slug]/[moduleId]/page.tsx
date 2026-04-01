import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'

import { MarkModuleComplete } from '@/components/paths/MarkModuleComplete'
import { ModuleTabs } from '@/components/paths/ModuleTabs'

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string }>
}) {
  const { slug, moduleId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: path }, { data: module_ }] = await Promise.all([
    supabase.from('learning_paths').select('*').eq('slug', slug).single(),
    supabase.from('modules').select('*').eq('id', moduleId).single(),
  ])

  if (!path || !module_) notFound()

  // Log view + upsert progress
  await Promise.all([
    supabase.from('activity_log').insert({
      user_id: user!.id,
      event_type: 'module_viewed',
      entity_id: module_.id,
      entity_type: 'module',
      metadata: { path_slug: slug, module_title: module_.title },
    }),
    supabase.from('user_progress').upsert({
      user_id: user!.id,
      module_id: module_.id,
      path_id: path.id,
      status: 'in_progress',
    }, { onConflict: 'user_id,module_id', ignoreDuplicates: false }),
  ])

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user!.id)
    .eq('module_id', moduleId)
    .single()

  const isCompleted = progress?.status === 'completed'

  return (
    <div className="p-8 max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-slate-400">
        <Link href="/dashboard/paths" className="hover:text-slate-300">Paths</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/dashboard/paths/${slug}`} className="hover:text-slate-300">{path.title}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-300">{module_.title}</span>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{module_.title}</h1>
          {isCompleted && <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Completed</Badge>}
        </div>
        <p className="text-slate-400">{module_.description}</p>
      </div>

      {/* Tabs: content / quiz */}
      <ModuleTabs
        content={module_.content_md}
        moduleId={module_.id}
        moduleTitle={module_.title}
        pathSlug={slug}
      />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
        <MarkModuleComplete
          userId={user!.id}
          moduleId={module_.id}
          pathId={path.id}
          isCompleted={isCompleted}
        />
        <Link
          href={`/dashboard/tutor?module=${moduleId}&topic=${encodeURIComponent(module_.title)}`}
          className={cn(buttonVariants({ variant: 'outline' }), 'border-slate-700 text-slate-300 hover:bg-slate-800')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask AI Tutor
        </Link>
      </div>
    </div>
  )
}
