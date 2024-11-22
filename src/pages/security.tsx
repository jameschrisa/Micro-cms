import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'

export function SecurityPage() {
  const { user, changePassword } = useAuth()
  const [guestPassword, setGuestPassword] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [message, setMessage] = useState('')

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleChangeGuestPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (guestPassword.length < 6) {
      setMessage('Password must be at least 6 characters long')
      return
    }
    changePassword('guest', guestPassword)
    setGuestPassword('')
    setMessage('Guest password updated successfully')
  }

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword.length < 6) {
      setMessage('Password must be at least 6 characters long')
      return
    }
    changePassword('admin', adminPassword)
    setAdminPassword('')
    setMessage('Admin password updated successfully')
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Security Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage user passwords and security settings
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={handleChangeGuestPassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Change Guest Password</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                placeholder="New guest password"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                minLength={6}
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Update Guest Password
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={handleChangeAdminPassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Change Admin Password</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="New admin password"
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                minLength={6}
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Update Admin Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
