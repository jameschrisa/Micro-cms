import { useState } from 'react'
import { useSidebar } from '../../contexts/sidebar-context'
import { db } from '../../services/db'
import { toastStore } from '../ui/toast'
import { EditorState, EditorActions } from './types'
import { SidebarItems } from '../../types/sidebar'

export function useEditor(): [EditorState, EditorActions] {
  const { items, updateItems } = useSidebar()
  const [localItems, setLocalItems] = useState<SidebarItems>(items)
  const [hasChanges, setHasChanges] = useState(false)
  // Initialize expandedSections with indices of all sections
  const [expandedSections, setExpandedSections] = useState<number[]>(
    Array.from({ length: items.length }, (_, i) => i)
  )

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleSave = async () => {
    try {
      await db.saveSidebarConfig(localItems)
      updateItems(localItems)
      toastStore.show('Navigation saved successfully')
      setHasChanges(false)
    } catch (error) {
      toastStore.show('Failed to save navigation', 'error')
    }
  }

  const handleAddSection = () => {
    const newItems = [...localItems, { title: 'New Section', items: [] }]
    setLocalItems(newItems)
    setHasChanges(true)
    // Expand the newly added section
    setExpandedSections(prev => [...prev, newItems.length - 1])
  }

  const handleRemoveSection = (index: number) => {
    const newItems = [...localItems]
    newItems.splice(index, 1)
    setLocalItems(newItems)
    setHasChanges(true)
    // Remove the section from expandedSections
    setExpandedSections(prev => prev.filter(i => i !== index))
  }

  const handleAddTopic = (sectionIndex: number) => {
    const newItems = [...localItems]
    newItems[sectionIndex].items.push({
      title: 'New Topic',
      href: `/docs/new-topic-${Date.now()}`,
      description: 'Enter a description for this topic'
    })
    setLocalItems(newItems)
    setHasChanges(true)
  }

  const handleRemoveTopic = (sectionIndex: number, topicIndex: number) => {
    const newItems = [...localItems]
    newItems[sectionIndex].items.splice(topicIndex, 1)
    setLocalItems(newItems)
    setHasChanges(true)
  }

  return [
    { localItems, hasChanges, expandedSections },
    {
      setLocalItems,
      setHasChanges,
      toggleSection,
      handleSave,
      handleAddSection,
      handleRemoveSection,
      handleAddTopic,
      handleRemoveTopic
    }
  ]
}
