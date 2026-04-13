'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/account/delete', { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Failed to delete account.')
      setLoading(false)
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (confirming) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-400 font-medium">Are you sure? All your data will be permanently deleted.</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting…' : 'Yes, delete my account'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 rounded-lg text-sm font-medium border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
    >
      Delete account
    </button>
  )
}
