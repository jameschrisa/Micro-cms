import React, { createContext, useContext, useState, useEffect } from 'react'
import { SidebarItems } from '../types/sidebar'
import { db } from '../services/db'

interface SidebarContextType {
  items: SidebarItems
  updateItems: (items: SidebarItems) => void
  addSection: (title: string) => void
  removeSection: (index: number) => void
  addTopic: (sectionIndex: number, title: string, href: string) => void
  removeTopic: (sectionIndex: number, topicIndex: number) => void
  reorderSections: (startIndex: number, endIndex: number) => void
  reorderTopics: (sectionIndex: number, startIndex: number, endIndex: number) => void
  updateSectionTitle: (index: number, title: string) => void
  updateTopic: (sectionIndex: number, topicIndex: number, title: string, href: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  initialItems: SidebarItems
  children: React.ReactNode
}

export function SidebarProvider({ initialItems, children }: SidebarProviderProps) {
  const [items, setItems] = useState<SidebarItems>(initialItems)

  // Load saved sidebar configuration on mount
  useEffect(() => {
    const loadSavedConfig = async () => {
      const savedItems = await db.getSidebarConfig()
      if (savedItems) {
        setItems(savedItems)
      } else {
        // If no saved config exists, save the initial items
        await db.saveSidebarConfig(initialItems)
      }
    }
    loadSavedConfig()
  }, [initialItems])

  // Helper function to persist changes
  const persistChanges = async (newItems: SidebarItems) => {
    setItems(newItems)
    await db.saveSidebarConfig(newItems)
  }

  const updateItems = async (newItems: SidebarItems) => {
    await persistChanges(newItems)
  }

  const addSection = async (title: string) => {
    const newItems = [...items, { title, items: [] }]
    await persistChanges(newItems)
  }

  const removeSection = async (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    await persistChanges(newItems)
  }

  const addTopic = async (sectionIndex: number, title: string, href: string) => {
    const newItems = [...items]
    newItems[sectionIndex].items.push({ title, href })
    await persistChanges(newItems)
  }

  const removeTopic = async (sectionIndex: number, topicIndex: number) => {
    const newItems = [...items]
    newItems[sectionIndex].items.splice(topicIndex, 1)
    await persistChanges(newItems)
  }

  const reorderSections = async (startIndex: number, endIndex: number) => {
    const newItems = [...items]
    const [removed] = newItems.splice(startIndex, 1)
    newItems.splice(endIndex, 0, removed)
    await persistChanges(newItems)
  }

  const reorderTopics = async (sectionIndex: number, startIndex: number, endIndex: number) => {
    const newItems = [...items]
    const section = newItems[sectionIndex]
    const [removed] = section.items.splice(startIndex, 1)
    section.items.splice(endIndex, 0, removed)
    await persistChanges(newItems)
  }

  const updateSectionTitle = async (index: number, title: string) => {
    const newItems = [...items]
    newItems[index].title = title
    await persistChanges(newItems)
  }

  const updateTopic = async (sectionIndex: number, topicIndex: number, title: string, href: string) => {
    const newItems = [...items]
    newItems[sectionIndex].items[topicIndex] = { title, href }
    await persistChanges(newItems)
  }

  return (
    <SidebarContext.Provider
      value={{
        items,
        updateItems,
        addSection,
        removeSection,
        addTopic,
        removeTopic,
        reorderSections,
        reorderTopics,
        updateSectionTitle,
        updateTopic,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
