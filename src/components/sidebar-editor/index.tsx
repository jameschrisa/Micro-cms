import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, Save, X } from 'lucide-react'
import { memo } from 'react'
import { SidebarEditorProps } from './types'
import { useEditor } from './use-editor'
import { SectionItem } from './section-item'
import { useAuth } from '../../contexts/auth-context'
import { Navigate } from 'react-router-dom'

export const SidebarEditor = memo(function SidebarEditor({ onClose }: SidebarEditorProps) {
  const { user } = useAuth()
  const [
    { localItems, hasChanges, expandedSections },
    {
      setLocalItems,
      setHasChanges,
      toggleSection,
      handleSave,
      handleAddSection,
      handleRemoveSection
    }
  ] = useEditor()

  // Protect the editor from non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result
    const newItems = Array.from(localItems)

    if (type === 'section') {
      // Simple array move for sections
      const [removed] = newItems.splice(source.index, 1)
      newItems.splice(destination.index, 0, removed)
      setLocalItems(newItems)
      setHasChanges(true)
    } else if (type === 'topic') {
      const sourceSectionIndex = parseInt(source.droppableId)
      const destSectionIndex = parseInt(destination.droppableId)
      
      if (isNaN(sourceSectionIndex) || isNaN(destSectionIndex)) return
      
      const sourceSection = newItems[sourceSectionIndex]
      const destSection = newItems[destSectionIndex]
      
      if (!sourceSection || !destSection) return

      // If moving within the same section
      if (sourceSectionIndex === destSectionIndex) {
        const newTopics = Array.from(sourceSection.items)
        const [removed] = newTopics.splice(source.index, 1)
        newTopics.splice(destination.index, 0, removed)
        sourceSection.items = newTopics
      } else {
        // Moving between different sections
        const [removed] = sourceSection.items.splice(source.index, 1)
        destSection.items.splice(destination.index, 0, removed)
      }
      
      setLocalItems(newItems)
      setHasChanges(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 z-50 grid gap-4 rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Navigation</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`
                inline-flex items-center justify-center gap-2 rounded-md px-4 py-2
                text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                ${hasChanges ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground'}
              `}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop to reorder sections and topics. Add descriptions to improve documentation clarity.
              </p>
              <button
                onClick={handleAddSection}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </button>
            </div>

            <Droppable droppableId="sections" type="section">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto rounded-md transition-colors ${
                    snapshot.isDraggingOver ? 'bg-accent/50' : ''
                  }`}
                >
                  {localItems.map((section, index) => (
                    <Draggable
                      key={index.toString()}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <SectionItem
                          section={section}
                          sectionIndex={index}
                          isExpanded={expandedSections.includes(index)}
                          onToggle={() => toggleSection(index)}
                          onUpdate={(newSection) => {
                            const newItems = [...localItems]
                            newItems[index] = newSection
                            setLocalItems(newItems)
                            setHasChanges(true)
                          }}
                          onRemove={() => handleRemoveSection(index)}
                          provided={provided}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  )
})
