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
  const [expandedSections, setExpandedSections] = useState<number[]>([])

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
  }

  const handleRemoveSection = (index: number) => {
    const newItems = [...localItems]
    newItems.splice(index, 1)
    setLocalItems(newItems)
    setHasChanges(true)
  }

  const handleAddTopic = (sectionIndex: number) => {
    const newItems = [...localItems]
    newItems[sectionIndex].items.push({
      title: 'New Topic',
      href: `/docs/new-topic-${Date.now()}`
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
