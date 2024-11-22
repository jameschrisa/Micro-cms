import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import logo from '../assets/logo.svg'

export function LoginPage() {
  const [username, setUsername] = useState<'admin' | 'guest'>('guest')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <img 
            src={logo} 
            alt="r00k Logo" 
            className="h-24 w-24"
          />
          <h1 className="text-2xl font-bold">Welcome to r00k</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access the documentation
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Account Type
            </label>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value as 'admin' | 'guest')}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
