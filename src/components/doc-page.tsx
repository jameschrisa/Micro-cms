import { useState } from 'react'
import { Clock, FileEdit, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from './breadcrumb'
import { useNavigation } from '../contexts/navigation-context'
import { MarkdownContent } from './markdown-content'
import { MarkdownEditor } from './markdown-editor'

interface DocPageProps {
  title: string
  description: string
  content: string
  onContentChange?: (newContent: string) => void
}

export function DocPage({ title, description, content, onContentChange }: DocPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { previousPage, nextPage } = useNavigation()

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent)
    }
  }

  return (
    <div className="relative">
      {/* Main content */}
      <div className="flex-1 w-full max-w-5xl mx-auto">
        <Breadcrumb />
        
        <div>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-2">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground my-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Updated {new Date().toLocaleDateString()}</span>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 hover:text-foreground transition-colors"
          >
            <FileEdit className="h-4 w-4" />
            <span>Edit this page</span>
          </button>
        </div>

        <div className="mt-8 prose prose-invert max-w-none">
          <MarkdownContent content={content} />
        </div>

        {/* Footer navigation */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="flex justify-between text-sm">
            {previousPage ? (
              <div>
                <div className="text-muted-foreground mb-2 flex items-center">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Previous
                </div>
                <Link 
                  to={previousPage.href}
                  className="font-medium hover:text-foreground transition-colors"
                >
                  {previousPage.title}
                </Link>
              </div>
            ) : (
              <div />
            )}
            {nextPage ? (
              <div className="text-right">
                <div className="text-muted-foreground mb-2 flex items-center justify-end">
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
                <Link 
                  to={nextPage.href}
                  className="font-medium hover:text-foreground transition-colors"
                >
                  {nextPage.title}
                </Link>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Markdown Editor */}
      <MarkdownEditor
        content={content}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  )
}
