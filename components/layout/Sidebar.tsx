'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Newspaper,
  LogOut,
} from 'lucide-react'
import { GuruLogo } from '@/components/ui/GuruLogo'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/paths', icon: BookOpen, label: 'Learning Paths' },
  { href: '/dashboard/tutor', icon: MessageCircle, label: 'AI Tutor' },
  { href: '/dashboard/news', icon: Newspaper, label: 'News & Podcast' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full fixed left-0 top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <GuruLogo size={36} />
          <span className="font-bold text-white text-base leading-tight">Guru, <span className="text-green-400">M.D.</span></span>
        </Link>
        <span className="text-xs text-slate-500 mt-1 block pl-1">Student mode</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-green-600/20 text-green-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
