'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsCard } from './NewsCard'
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search, RefreshCw } from 'lucide-react'

interface Article {
  url: string
  title: string
  content: string
  score?: number
}

const TOPIC_CHIPS = [
  'Cardiology ESC',
  'Pharmacology EMA',
  'Swedish Socialstyrelsen',
  'Infectious disease EU',
  'Oncology Europe',
  'Mental health Sweden',
]

export function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState('')
  const [activeQuery, setActiveQuery] = useState('')

  const fetchNews = useCallback(async (q?: string) => {
    setLoading(true)
    const url = q ? `/api/news?topic=${encodeURIComponent(q)}` : '/api/news'
    const res = await fetch(url)
    const data = await res.json()
    setArticles(data.articles ?? [])
    setActiveQuery(data.query ?? '')
    setLoading(false)
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (topic.trim()) fetchNews(topic.trim())
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Search medical news… (e.g. heart failure, EMA approval)"
            className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fetchNews()}
          disabled={loading}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </form>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-2">
        {TOPIC_CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => { setTopic(chip); fetchNews(chip) }}
            className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Podcast player */}
      {!loading && articles.length > 0 && (
        <PodcastPlayer
          topic={activeQuery}
          articles={articles.slice(0, 4)}
        />
      )}

      {/* Articles */}
      {loading ? (
        <div className="flex items-center gap-3 text-slate-400 py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Fetching latest medical news…</span>
        </div>
      ) : articles.length === 0 ? (
        <p className="text-slate-500 text-sm py-8 text-center">No articles found. Try a different search.</p>
      ) : (
        <div className="space-y-3">
          <p className="text-slate-500 text-xs">Showing results for: <span className="text-slate-300">{activeQuery}</span></p>
          {articles.map((a, i) => (
            <NewsCard key={i} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}
