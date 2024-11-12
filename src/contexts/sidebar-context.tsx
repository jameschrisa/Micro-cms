import React, { createContext, useContext, useState } from 'react'
import { SidebarItems } from '../types/sidebar'

interface SidebarContextType {
  items: SidebarItems
  updateItems: (items: SidebarItems) => void
  addSection: (title: string) => void
  removeSection: (index: number) => void
  addTopic: (sectionIndex: number, title: string, href: string, description: string) => void
  removeTopic: (sectionIndex: number, topicIndex: number) => void
  reorderSections: (startIndex: number, endIndex: number) => void
  reorderTopics: (sectionIndex: number, startIndex: number, endIndex: number) => void
  updateSectionTitle: (index: number, title: string) => void
  updateTopic: (sectionIndex: number, topicIndex: number, title: string, href: string, description: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  initialItems: SidebarItems
  children: React.ReactNode
}

export function SidebarProvider({ initialItems, children }: SidebarProviderProps) {
  const [items, setItems] = useState<SidebarItems>(initialItems)

  const updateItems = (newItems: SidebarItems) => {
    setItems(newItems)
  }

  const addSection = (title: string) => {
    setItems([...items, { title, items: [] }])
  }

  const removeSection = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const addTopic = (sectionIndex: number, title: string, href: string, description: string) => {
    const newItems = [...items]
    newItems[sectionIndex].items.push({ title, href, description })
    setItems(newItems)
  }

  const removeTopic = (sectionIndex: number, topicIndex: number) => {
    const newItems = [...items]
    newItems[sectionIndex].items.splice(topicIndex, 1)
    setItems(newItems)
  }

  const reorderSections = (startIndex: number, endIndex: number) => {
    const newItems = [...items]
    const [removed] = newItems.splice(startIndex, 1)
    newItems.splice(endIndex, 0, removed)
    setItems(newItems)
  }

  const reorderTopics = (sectionIndex: number, startIndex: number, endIndex: number) => {
    const newItems = [...items]
    const section = newItems[sectionIndex]
    const [removed] = section.items.splice(startIndex, 1)
    section.items.splice(endIndex, 0, removed)
    setItems(newItems)
  }

  const updateSectionTitle = (index: number, title: string) => {
    const newItems = [...items]
    newItems[index].title = title
    setItems(newItems)
  }

  const updateTopic = (sectionIndex: number, topicIndex: number, title: string, href: string, description: string) => {
    const newItems = [...items]
    newItems[sectionIndex].items[topicIndex] = { title, href, description }
    setItems(newItems)
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
