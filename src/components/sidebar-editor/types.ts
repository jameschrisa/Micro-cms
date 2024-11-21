import { SidebarItems } from "../../types/sidebar"

export interface SidebarEditorProps {
  onClose: () => void
}

export interface SectionProps {
  section: SidebarItems[0]
  sectionIndex: number
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (newSection: SidebarItems[0]) => void
  onRemove: () => void
  provided: any
}

export interface TopicProps {
  topic: SidebarItems[0]['items'][0]
  sectionIndex: number
  topicIndex: number
  onUpdate: (newTopic: SidebarItems[0]['items'][0]) => void
  onRemove: () => void
}

export interface EditorState {
  localItems: SidebarItems
  hasChanges: boolean
  expandedSections: number[]
}

export interface EditorActions {
  setLocalItems: (items: SidebarItems) => void
  setHasChanges: (hasChanges: boolean) => void
  toggleSection: (index: number) => void
  handleSave: () => Promise<void>
  handleAddSection: () => void
  handleRemoveSection: (index: number) => void
  handleAddTopic: (sectionIndex: number) => void
  handleRemoveTopic: (sectionIndex: number, topicIndex: number) => void
}
