import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useSidebar } from '../contexts/sidebar-context'
import { Plus, Trash2, GripVertical, Edit, Save, X } from 'lucide-react'

interface SidebarEditorProps {
  onClose: () => void
}

export function SidebarEditor({ onClose }: SidebarEditorProps) {
  const {
    items,
    reorderSections,
    reorderTopics,
    addSection,
    removeSection,
    addTopic,
    removeTopic,
    updateSectionTitle,
    updateTopic,
  } = useSidebar()

  const [editingSection, setEditingSection] = useState<{ index: number; title: string } | null>(null)
  const [editingTopic, setEditingTopic] = useState<{
    sectionIndex: number
    topicIndex: number
    title: string
    href: string
  } | null>(null)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [newTopic, setNewTopic] = useState({ sectionIndex: -1, title: '', href: '' })

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'section') {
      reorderSections(source.index, destination.index)
    } else if (type === 'topic') {
      const sectionIndex = parseInt(result.type.split('-')[1])
      reorderTopics(sectionIndex, source.index, destination.index)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 z-50 grid gap-4 rounded-lg border bg-background p-6 shadow-lg overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Navigation</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="New section title"
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            onClick={() => {
              if (newSectionTitle) {
                addSection(newSectionTitle)
                setNewSectionTitle('')
              }
            }}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections" type="section">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {items.map((section, sectionIndex) => (
                  <Draggable
                    key={section.title}
                    draggableId={section.title}
                    index={sectionIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="rounded-lg border bg-card p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {editingSection?.index === sectionIndex ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="text"
                                value={editingSection.title}
                                onChange={(e) =>
                                  setEditingSection({ ...editingSection, title: e.target.value })
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              />
                              <button
                                onClick={() => {
                                  updateSectionTitle(sectionIndex, editingSection.title)
                                  setEditingSection(null)
                                }}
                                className="rounded-md p-2 hover:bg-accent"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingSection(null)}
                                className="rounded-md p-2 hover:bg-accent"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <h3 className="flex-1 font-semibold">{section.title}</h3>
                              <button
                                onClick={() =>
                                  setEditingSection({ index: sectionIndex, title: section.title })
                                }
                                className="rounded-md p-2 hover:bg-accent"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeSection(sectionIndex)}
                                className="rounded-md p-2 hover:bg-accent text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>

                        <Droppable droppableId={`topics-${sectionIndex}`} type={`topic-${sectionIndex}`}>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="ml-6 space-y-2">
                              {section.items.map((topic, topicIndex) => (
                                <Draggable
                                  key={topic.href}
                                  draggableId={topic.href}
                                  index={topicIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center gap-2 rounded-md border bg-background p-2"
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      {editingTopic?.sectionIndex === sectionIndex &&
                                      editingTopic?.topicIndex === topicIndex ? (
                                        <div className="flex-1 flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={editingTopic.title}
                                            onChange={(e) =>
                                              setEditingTopic({ ...editingTopic, title: e.target.value })
                                            }
                                            placeholder="Title"
                                            className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                          />
                                          <input
                                            type="text"
                                            value={editingTopic.href}
                                            onChange={(e) =>
                                              setEditingTopic({ ...editingTopic, href: e.target.value })
                                            }
                                            placeholder="URL path"
                                            className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                          />
                                          <button
                                            onClick={() => {
                                              updateTopic(
                                                sectionIndex,
                                                topicIndex,
                                                editingTopic.title,
                                                editingTopic.href
                                              )
                                              setEditingTopic(null)
                                            }}
                                            className="rounded-md p-2 hover:bg-accent"
                                          >
                                            <Save className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => setEditingTopic(null)}
                                            className="rounded-md p-2 hover:bg-accent"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <span className="flex-1 text-sm">{topic.title}</span>
                                          <button
                                            onClick={() =>
                                              setEditingTopic({
                                                sectionIndex,
                                                topicIndex,
                                                title: topic.title,
                                                href: topic.href,
                                              })
                                            }
                                            className="rounded-md p-2 hover:bg-accent"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => removeTopic(sectionIndex, topicIndex)}
                                            className="rounded-md p-2 hover:bg-accent text-red-500"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              {newTopic.sectionIndex === sectionIndex ? (
                                <div className="flex items-center gap-2 mt-2">
                                  <input
                                    type="text"
                                    value={newTopic.title}
                                    onChange={(e) =>
                                      setNewTopic({ ...newTopic, title: e.target.value })
                                    }
                                    placeholder="Title"
                                    className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                  />
                                  <input
                                    type="text"
                                    value={newTopic.href}
                                    onChange={(e) =>
                                      setNewTopic({ ...newTopic, href: e.target.value })
                                    }
                                    placeholder="URL path"
                                    className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                  />
                                  <button
                                    onClick={() => {
                                      if (newTopic.title && newTopic.href) {
                                        addTopic(sectionIndex, newTopic.title, newTopic.href)
                                        setNewTopic({ sectionIndex: -1, title: '', href: '' })
                                      }
                                    }}
                                    className="rounded-md p-2 hover:bg-accent"
                                  >
                                    <Save className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setNewTopic({ sectionIndex: -1, title: '', href: '' })
                                    }
                                    className="rounded-md p-2 hover:bg-accent"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setNewTopic({ sectionIndex, title: '', href: '' })
                                  }
                                  className="flex w-full items-center justify-center rounded-md border border-dashed p-2 text-sm text-muted-foreground hover:bg-accent"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Topic
                                </button>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
