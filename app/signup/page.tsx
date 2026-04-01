'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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

    // Update profile with extra fields
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="text-4xl">🦠</div>
          <h1 className="text-2xl font-bold text-white">Guru, M.D.</h1>
          <p className="text-slate-400 text-sm">Create your student account</p>
        </div>

        <Card className="bg-white/5 border-white/10 text-white">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle className="text-white">Get started</CardTitle>
              <CardDescription className="text-slate-400">Medical student mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Anna Johansson"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.se"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university" className="text-slate-300">University <span className="text-slate-500">(optional)</span></Label>
                <Input
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Karolinska Institutet"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-slate-300">Year of study <span className="text-slate-500">(optional)</span></Label>
                <Input
                  id="year"
                  type="number"
                  min={1}
                  max={6}
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  placeholder="1–6"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500">
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
              <p className="text-slate-400 text-sm text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:underline">Sign in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
