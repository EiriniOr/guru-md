import { ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Article {
  url: string
  title: string
  content: string
  score?: number
}

export function NewsCard({ article }: { article: Article }) {
  const hostname = (() => {
    try { return new URL(article.url).hostname.replace('www.', '') }
    catch { return article.url }
  })()

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-medium hover:text-green-400 transition-colors line-clamp-2 leading-snug"
            >
              {article.title}
            </a>
            <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
              {article.content}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-slate-500 text-xs">{hostname}</span>
            </div>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-green-400 transition-colors flex-shrink-0 mt-0.5"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
