import { createClient } from '@/lib/supabase/server'
import { DeleteAccountButton } from './DeleteAccountButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCircle } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, university, year_of_study, country')
    .eq('id', user!.id)
    .single()

  return (
    <div className="p-8 max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <p className="text-slate-400 mt-1">Manage your account settings.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-slate-400" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Email</span>
            <span className="text-white">{user!.email}</span>
          </div>
          {profile?.full_name && (
            <div className="flex justify-between">
              <span className="text-slate-400">Name</span>
              <span className="text-white">{profile.full_name}</span>
            </div>
          )}
          {profile?.university && (
            <div className="flex justify-between">
              <span className="text-slate-400">University</span>
              <span className="text-white">{profile.university}</span>
            </div>
          )}
          {profile?.year_of_study && (
            <div className="flex justify-between">
              <span className="text-slate-400">Year</span>
              <span className="text-white">{profile.year_of_study}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-red-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-400 text-base">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm mb-4">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  )
}
