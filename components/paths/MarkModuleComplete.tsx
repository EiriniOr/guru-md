'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  moduleId: string
  pathId: string
  isCompleted: boolean
}

export function MarkModuleComplete({ userId, moduleId, pathId, isCompleted }: Props) {
  const [done, setDone] = useState(isCompleted)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const newStatus = done ? 'in_progress' : 'completed'

    await supabase.from('user_progress').upsert({
      user_id: userId,
      module_id: moduleId,
      path_id: pathId,
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,module_id' })

    if (newStatus === 'completed') {
      await supabase.from('activity_log').insert({
        user_id: userId,
        event_type: 'module_viewed',
        entity_id: moduleId,
        entity_type: 'module',
        metadata: { completed: true },
      })
      toast.success('Module marked as complete!')
    }

    setDone(!done)
    setLoading(false)
    router.refresh()
  }

  return (
    <Button
      onClick={toggle}
      disabled={loading}
      className={done
        ? 'bg-green-700 hover:bg-green-800 text-white'
        : 'bg-green-600 hover:bg-green-500 text-white'
      }
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      {done ? 'Completed' : 'Mark as complete'}
    </Button>
  )
}
