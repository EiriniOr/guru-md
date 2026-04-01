import type { TavilySource } from '@/types'

interface Props {
  index: number
  source: TavilySource
}

export function SourceBadge({ index, source }: Props) {
  const hostname = (() => {
    try { return new URL(source.url).hostname.replace('www.', '') }
    catch { return source.url }
  })()

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={source.title}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
    >
      <span className="text-green-400 font-mono">[{index}]</span>
      <span className="max-w-[120px] truncate">{hostname}</span>
    </a>
  )
}
