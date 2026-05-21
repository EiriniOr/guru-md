'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GuruLogo } from '@/components/ui/GuruLogo'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ backgroundColor: '#020a05' }}
    >
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,116,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,116,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,212,116,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <GuruLogo size={40} />
            <span className="text-2xl font-bold">
              Guru, <span style={{ color: '#00d474' }}>M.D.</span>
            </span>
          </Link>
          <p className="text-sm" style={{ color: '#52846a' }}>
            Sign in to your account
          </p>
        </div>

        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            border: '1px solid rgba(0,212,116,0.15)',
            backgroundColor: 'rgba(10,26,15,0.6)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">Welcome back</h2>
            <p className="text-sm mt-0.5" style={{ color: '#52846a' }}>
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" style={{ color: '#a8d5ba' }} className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.se"
                required
                className="placeholder:text-[#3d5c4a]"
                style={{
                  backgroundColor: 'rgba(0,212,116,0.05)',
                  borderColor: 'rgba(0,212,116,0.15)',
                  color: 'white',
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" style={{ color: '#a8d5ba' }} className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: 'rgba(0,212,116,0.05)',
                  borderColor: 'rgba(0,212,116,0.15)',
                  color: 'white',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#00d474',
                color: '#020a05',
                boxShadow: '0 0 20px rgba(0,212,116,0.3)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: '#52846a' }}>
            No account?{' '}
            <Link href="/signup" className="font-medium hover:underline" style={{ color: '#00d474' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
