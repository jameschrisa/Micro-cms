import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, useLocation, Outlet, Navigate } from 'react-router-dom'
import { SiteHeader } from './components/layout/site-header'
import { Sidebar } from './components/layout/sidebar'
import { useNavigation, findAdjacentPages } from './contexts/navigation-context'
import { KeyboardShortcuts } from './contexts/keyboard-context'
import { useSidebar } from './contexts/sidebar-context'
import { useAuth } from './contexts/auth-context'
import { DocPage } from './components/doc-page'
import { SettingsPage } from './pages/settings'
import { SecurityPage } from './pages/security'
import { LoginPage } from './pages/login'
import { useEffect, useState } from 'react'
import { SidebarItems } from './types/sidebar'
import { db } from './services/db'
import { ToastContainer } from './components/ui/toast'
import { Providers } from './providers'
import { KeyboardNavigation } from './components/keyboard-navigation'

function NavigationUpdater() {
  const location = useLocation()
  const { setPreviousPage, setNextPage } = useNavigation()
  const { items } = useSidebar()

  useEffect(() => {
    const { previous, next } = findAdjacentPages(items, location.pathname)
    setPreviousPage(previous)
    setNextPage(next)
  }, [location.pathname, setPreviousPage, setNextPage, items])

  return <Outlet />
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function DocsLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1">
        <div className="grid grid-cols-[220px_1fr] gap-6 lg:grid-cols-[240px_1fr]">
          <Sidebar isLoggedIn={!!user} />
          <main className="relative py-6 lg:gap-10 lg:py-8">
            <div className="mx-auto w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
      <KeyboardShortcuts />
    </div>
  )
}

function Introduction() {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      const introContent = await db.getSiteContent('intro')
      if (introContent) {
        setContent(introContent)
      }
      setIsLoading(false)
    }
    loadContent()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-2/3 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
        <div className="h-4 w-4/6 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <DocPage
      title="r00k Documentation"
      description="Comprehensive security and risk management documentation platform."
      content={content}
      onContentChange={async (newContent: string) => {
        await db.saveSiteContent('intro', newContent)
        setContent(newContent)
      }}
    />
  )
}

function DynamicDocPage() {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { items } = useSidebar()

  const pageInfo = items.reduce<{ title: string; description: string } | undefined>((found, section) => {
    if (found) return found
    const topic = section.items.find(item => item.href === location.pathname)
    if (topic) {
      return {
        title: topic.title,
        description: topic.description
      }
    }
    return undefined
  }, undefined)

  useEffect(() => {
    const loadContent = async () => {
      const savedContent = await db.getPageContent(location.pathname)
      if (savedContent) {
        setContent(savedContent)
      }
      setIsLoading(false)
    }
    loadContent()
  }, [location.pathname])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-2/3 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
        <div className="h-4 w-4/6 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <DocPage
      title={pageInfo?.title || 'Documentation'}
      description={pageInfo?.description || ''}
      content={content}
      onContentChange={async (newContent: string) => {
        await db.savePageContent(location.pathname, newContent)
        setContent(newContent)
      }}
    />
  )
}

function Root() {
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
    <Providers>
      <ToastContainer />
      <Outlet />
    </Providers>
  )
}

function KeyboardNavigationWrapper() {
  return (
    <KeyboardNavigation>
      <Outlet />
    </KeyboardNavigation>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<NavigationUpdater />}>
        <Route element={<KeyboardNavigationWrapper />}>
          <Route
            path="/"
            element={
              <RequireAuth>
                <DocsLayout>
                  <Introduction />
                </DocsLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/docs/*"
            element={
              <RequireAuth>
                <DocsLayout>
                  <DynamicDocPage />
                </DocsLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAdmin>
                <DocsLayout>
                  <SettingsPage />
                </DocsLayout>
              </RequireAdmin>
            }
          />
          <Route
            path="/security"
            element={
              <RequireAdmin>
                <DocsLayout>
                  <SecurityPage />
                </DocsLayout>
              </RequireAdmin>
            }
          />
        </Route>
      </Route>
    </Route>
  )
)

export default function App() {
  return <RouterProvider router={router} />
}
