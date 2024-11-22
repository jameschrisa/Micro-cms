import { ReactNode, useEffect, useState } from 'react'
import { KeyboardProvider } from './contexts/keyboard-context'
import { SidebarProvider } from './contexts/sidebar-context'
import { NavigationProvider } from './contexts/navigation-context'
import { AuthProvider } from './contexts/auth-context'
import { SidebarItems } from './types/sidebar'
import { db } from './services/db'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [initialItems, setInitialItems] = useState<SidebarItems>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSidebar = async () => {
      const items = await db.getSidebarConfig()
      if (items) {
        setInitialItems(items)
      }
      setIsLoading(false)
    }
    loadSidebar()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <NavigationProvider>
        <KeyboardProvider>
          <SidebarProvider initialItems={initialItems}>
            {children}
          </SidebarProvider>
        </KeyboardProvider>
      </NavigationProvider>
    </AuthProvider>
  )
}
