import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { SectionProps } from './types'
import { TopicItem } from './topic-item'

export function SectionItem({ 
  section, 
  sectionIndex, 
  isExpanded, 
  onToggle, 
  onUpdate, 
  onRemove,
  provided 
}: SectionProps) {
  const handleAddTopic = () => {
    onUpdate({
      ...section,
      items: [
        ...section.items,
        {
          title: 'New Topic',
          href: `/docs/new-topic-${Date.now()}`,
          description: 'Enter a description for this topic'
        }
      ]
    })
  }

  const handleRemoveTopic = (topicIndex: number) => {
    const newItems = [...section.items]
    newItems.splice(topicIndex, 1)
    onUpdate({
      ...section,
      items: newItems
    })
  }

  const handleUpdateTopic = (topicIndex: number, newTopic: typeof section.items[0]) => {
    const newItems = [...section.items]
    newItems[topicIndex] = newTopic
    onUpdate({
      ...section,
      items: newItems
    })
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="border rounded-lg p-4 space-y-4 bg-card"
    >
      <div className="flex items-center gap-2">
        <div {...provided.dragHandleProps}>
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
        </div>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          onClick={onToggle}
          className="p-2 hover:bg-accent rounded-md"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-accent rounded-md text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isExpanded && (
        <>
          <Droppable droppableId={`section-${sectionIndex}-topics`} type={`${sectionIndex}`}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4 pl-7"
              >
                {section.items.map((topic, topicIndex) => (
                  <Draggable
                    key={`topic-${sectionIndex}-${topicIndex}`}
                    draggableId={`topic-${sectionIndex}-${topicIndex}`}
                    index={topicIndex}
                  >
                    {(provided) => (
                      <TopicItem
                        topic={topic}
                        sectionIndex={sectionIndex}
                        topicIndex={topicIndex}
                        onUpdate={(newTopic) => handleUpdateTopic(topicIndex, newTopic)}
                        onRemove={() => handleRemoveTopic(topicIndex)}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            onClick={handleAddTopic}
            className="ml-7 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 px-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </button>
        </>
      )}
    </div>
  )
}
