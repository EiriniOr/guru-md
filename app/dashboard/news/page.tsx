import { NewsFeed } from '@/components/news/NewsFeed'

export default function NewsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-slate-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">Medical News & Podcast</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Latest EU/Swedish medical updates — listen as a podcast or read the articles
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NewsFeed />
      </div>
    </div>
  )
}
