import { ChatWindow } from '@/components/chat/ChatWindow'

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; topic?: string; path?: string }>
}) {
  const { topic } = await searchParams

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-slate-800 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">AI Tutor</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {topic
            ? `Topic: ${topic} — ask anything about this subject`
            : 'Ask anything about medicine, EU guidelines, pharmacology…'
          }
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow moduleTitle={topic} />
      </div>
    </div>
  )
}
