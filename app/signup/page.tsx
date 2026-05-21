'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GuruLogo } from '@/components/ui/GuruLogo'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [university, setUniversity] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        university,
        year_of_study: yearOfStudy ? parseInt(yearOfStudy) : null,
      }).eq('id', user.id)
    }

    toast.success('Account created! Redirecting…')
    router.push('/dashboard')
    router.refresh()
  }

  const inputStyle = {
    backgroundColor: 'rgba(0,212,116,0.05)',
    borderColor: 'rgba(0,212,116,0.15)',
    color: 'white',
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
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
          <Link href="/" className="inline-flex items-center gap-3">
            <GuruLogo size={40} />
            <span className="text-2xl font-bold">
              Guru, <span style={{ color: '#00d474' }}>M.D.</span>
            </span>
          </Link>
          <p className="text-sm" style={{ color: '#52846a' }}>
            Create your student account
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
            <h2 className="text-lg font-bold text-white">Get started</h2>
            <p className="text-sm mt-0.5" style={{ color: '#52846a' }}>
              Medical student mode
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" style={{ color: '#a8d5ba' }} className="text-sm">
                Full name
              </Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Anna Johansson"
                required
                className="placeholder:text-[#3d5c4a]"
                style={inputStyle}
              />
            </div>

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
                style={inputStyle}
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
                minLength={6}
                required
                style={inputStyle}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="university" style={{ color: '#a8d5ba' }} className="text-sm">
                University{' '}
                <span style={{ color: '#3d5c4a' }}>(optional)</span>
              </Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Karolinska Institutet"
                className="placeholder:text-[#3d5c4a]"
                style={inputStyle}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="year" style={{ color: '#a8d5ba' }} className="text-sm">
                Year of study{' '}
                <span style={{ color: '#3d5c4a' }}>(optional)</span>
              </Label>
              <Input
                id="year"
                type="number"
                min={1}
                max={6}
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                placeholder="1–6"
                className="placeholder:text-[#3d5c4a]"
                style={inputStyle}
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center" style={{ color: '#52846a' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: '#00d474' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
