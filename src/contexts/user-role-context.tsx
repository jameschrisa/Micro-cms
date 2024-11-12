import { createContext, useContext, ReactNode } from 'react'

interface UserRoleContextType {
  isAdmin: boolean
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

interface UserRoleProviderProps {
  children: ReactNode
}

export function UserRoleProvider({ children }: UserRoleProviderProps) {
  // For demo purposes, we'll set isAdmin to true
  // In a real app, this would be determined by authentication
  const isAdmin = true

  return (
    <UserRoleContext.Provider value={{ isAdmin }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }
  return context
}
