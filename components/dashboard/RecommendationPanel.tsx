'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Recommendation {
  type: 'path' | 'module'
  slug: string
  title: string
  reason: string
}

export function RecommendationPanel() {
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recommendations')
      .then(r => r.json())
      .then(d => setRecs(d.recommendations ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Analysing your progress…
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recs.length === 0) return null

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" /> Recommended for you
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recs.map((rec, i) => (
          <Link
            key={i}
            href={rec.type === 'path' ? `/dashboard/paths/${rec.slug}` : `/dashboard/paths`}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{rec.title}</div>
              <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{rec.reason}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
