import Link from 'next/link'
import { buttonVariants } from '@/lib/button-variants'
import { cn } from '@/lib/utils'
import { GuruLogo } from '@/components/ui/GuruLogo'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-4">
            <GuruLogo size={72} />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Guru, <span className="text-green-400">M.D.</span>
            </h1>
          </div>
          <p className="text-green-200 text-lg">AI-powered health education for medical students</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            { icon: '🧠', label: 'AI Tutor', desc: 'Evidence-based answers from medical literature' },
            { icon: '📚', label: 'Learning Paths', desc: 'Cardiology, Pharmacology, Anatomy & more' },
            { icon: '📝', label: 'Smart Quizzes', desc: 'AI-generated questions adapted to your progress' },
            { icon: '🇸🇪', label: 'Swedish Focus', desc: 'FASS, Janusinfo & ESC guidelines integrated' },
          ].map((f) => (
            <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
              <div className="text-2xl">{f.icon}</div>
              <div className="font-semibold text-white text-sm">{f.label}</div>
              <div className="text-slate-400 text-xs">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }), 'bg-green-600 hover:bg-green-500 text-white px-8')}>
            Get started
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-white/20 text-white hover:bg-white/10 px-8')}>
            Sign in
          </Link>
        </div>

        <p className="text-slate-500 text-xs">
          EU/Swedish medical guidelines · Student mode · English
        </p>
      </div>
    </main>
  )
}
