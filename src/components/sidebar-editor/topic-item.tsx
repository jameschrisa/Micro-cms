import { GripVertical, Trash2 } from 'lucide-react'
import { Draggable } from 'react-beautiful-dnd'
import { memo } from 'react'
import { TopicProps } from './types'

export const TopicItem = memo(function TopicItem({ 
  topic, 
  sectionIndex,
  topicIndex,
  onUpdate, 
  onRemove
}: TopicProps) {
  return (
    <Draggable
      draggableId={`topic-${sectionIndex}-${topicIndex}`}
      index={topicIndex}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex flex-col gap-2 p-2 bg-background border rounded-md transition-shadow ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div 
              {...provided.dragHandleProps} 
              className="p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder topic"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 grid grid-cols-[1fr,1fr] gap-2">
              <input
                type="text"
                value={topic.title}
                onChange={(e) => {
                  onUpdate({ ...topic, title: e.target.value })
                }}
                placeholder="Topic Title"
                className="flex h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <input
                type="text"
                value={topic.href}
                onChange={(e) => {
                  onUpdate({ ...topic, href: e.target.value })
                }}
                placeholder="/docs/path"
                className="flex h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-accent rounded-md text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="pl-6 pr-9">
            <input
              type="text"
              value={topic.description}
              onChange={(e) => {
                onUpdate({ ...topic, description: e.target.value })
              }}
              placeholder="Topic description"
              className="w-full h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      )}
    </Draggable>
  )
})
