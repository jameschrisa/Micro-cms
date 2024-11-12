import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { Keyboard, X } from 'lucide-react'

interface KeyboardContextType {
  isSearchOpen: boolean
  setIsSearchOpen: (isOpen: boolean) => void
  keyboardShortcutsEnabled: boolean
  setKeyboardShortcutsEnabled: (enabled: boolean) => void
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined)

interface KeyboardProviderProps {
  children: ReactNode
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [keyboardShortcutsEnabled, setKeyboardShortcutsEnabled] = React.useState(() => {
    // Load the initial state from localStorage, default to true if not set
    const saved = localStorage.getItem('keyboardShortcutsEnabled')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Save the keyboard shortcuts state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('keyboardShortcutsEnabled', JSON.stringify(keyboardShortcutsEnabled))
  }, [keyboardShortcutsEnabled])

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return

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
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [keyboardShortcutsEnabled])

  return (
    <KeyboardContext.Provider 
      value={{ 
        isSearchOpen, 
        setIsSearchOpen, 
        keyboardShortcutsEnabled, 
        setKeyboardShortcutsEnabled 
      }}
    >
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
  const { keyboardShortcutsEnabled } = useKeyboard()

  if (!keyboardShortcutsEnabled) return null

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
