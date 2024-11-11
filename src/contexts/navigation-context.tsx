import React, { createContext, useContext, ReactNode } from 'react'

interface NavigationItem {
  title: string
  href: string
}

interface NavigationContextType {
  previousPage: NavigationItem | null
  nextPage: NavigationItem | null
  setPreviousPage: (page: NavigationItem | null) => void
  setNextPage: (page: NavigationItem | null) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [previousPage, setPreviousPage] = React.useState<NavigationItem | null>(null)
  const [nextPage, setNextPage] = React.useState<NavigationItem | null>(null)

  return (
    <NavigationContext.Provider
      value={{
        previousPage,
        nextPage,
        setPreviousPage,
        setNextPage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// Helper function to find adjacent pages
export function findAdjacentPages(
  items: Array<{ title: string; items: Array<{ title: string; href: string }> }>,
  currentPath: string
): { previous: NavigationItem | null; next: NavigationItem | null } {
  // Flatten the navigation items into a single array
  const flattenedItems = items.reduce<Array<{ title: string; href: string }>>(
    (acc, section) => [...acc, ...section.items],
    []
  )

  // Find the current page index
  const currentIndex = flattenedItems.findIndex(item => item.href === currentPath)

  // If the page is not found, return null for both
  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  // Find previous and next pages
  const previous = currentIndex > 0 ? flattenedItems[currentIndex - 1] : null
  const next = currentIndex < flattenedItems.length - 1 ? flattenedItems[currentIndex + 1] : null

  return { previous, next }
}
