import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigation } from './navigation-context'
import { Keyboard, X } from 'lucide-react'

interface KeyboardContextType {
  isSearchOpen: boolean
  setIsSearchOpen: (isOpen: boolean) => void
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined)

interface KeyboardProviderProps {
  children: ReactNode
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const navigate = useNavigate()
  const { previousPage, nextPage } = useNavigation()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Search shortcut (Cmd/Ctrl + K)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }

      // Close search with Escape
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }

      // Navigation shortcuts (Alt + Arrow keys)
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowLeft':
            if (previousPage) {
              event.preventDefault()
              navigate(previousPage.href)
            }
            break
          case 'ArrowRight':
            if (nextPage) {
              event.preventDefault()
              navigate(nextPage.href)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate, previousPage, nextPage])

  return (
    <KeyboardContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
      {children}
    </KeyboardContext.Provider>
  )
}

export function useKeyboard() {
  const context = useContext(KeyboardContext)
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider')
  }
  return context
}

// Keyboard shortcut hints component
export function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg border border-border shadow-lg transition-colors"
        >
          <Keyboard className="h-4 w-4" />
          <span className="text-muted-foreground">Keyboard shortcuts</span>
        </button>
      ) : (
        <div className="p-4 bg-muted/95 backdrop-blur-sm rounded-lg border border-border shadow-lg animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Keyboard Shortcuts</h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-8">
              <span className="text-muted-foreground">Search</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-background rounded border border-border">⌘</kbd>
                <kbd className="px-2 py-1 text-xs bg-background rounded border border-border">K</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-muted-foreground">Previous page</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-background rounded border border-border">⌥</kbd>
                <kbd className="px-2 py-1 text-xs bg-background rounded border border-border">←</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-muted-foreground">Next page</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-background rounded border border-border">⌥</kbd>
                <kbd className="px-2 py-1 text-xs bg-background rounded border border-border">→</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
