import React, { createContext, useContext, useState } from 'react'

type UserRole = 'admin' | 'guest'
type Username = 'admin' | 'guest'

interface User {
  username: Username
  role: UserRole
}

interface Passwords {
  admin: string
  guest: string
}

interface AuthContextType {
  user: User | null
  login: (username: Username, password: string) => boolean
  logout: () => void
  changePassword: (username: Username, newPassword: string) => void
}

const defaultUsers: Passwords = {
  admin: 'admin123',
  guest: 'guest123'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [passwords, setPasswords] = useState<Passwords>(defaultUsers)

  const login = (username: Username, password: string): boolean => {
    if (passwords[username] === password) {
      setUser({
        username,
        role: username === 'admin' ? 'admin' : 'guest'
      })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const changePassword = (username: Username, newPassword: string) => {
    setPasswords(prev => ({
      ...prev,
      [username]: newPassword
    }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
