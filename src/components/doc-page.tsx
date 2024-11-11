import { useEffect, useState } from 'react'
import { ChevronRight, Clock, FileEdit, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
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

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

export function DocPage({ title, description, content, onContentChange }: DocPageProps) {
  const [toc, setToc] = useState<TableOfContentsItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const { previousPage, nextPage } = useNavigation()
  const location = useLocation()

  useEffect(() => {
    // Extract headings from the content after a short delay to ensure content is rendered
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll('h2, h3')
      const items: TableOfContentsItem[] = Array.from(headings).map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1])
      }))
      setToc(items)
    }, 100)

    return () => clearTimeout(timer)
  }, [content])

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
      <div className="flex-1 w-full max-w-3xl mx-auto">
        <Breadcrumb />
        
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
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

      {/* Right sidebar - Table of Contents */}
      <div className="hidden xl:block absolute top-0 right-[calc(-25%-2rem)] w-64">
        <div className="sticky top-16">
          <h4 className="text-sm font-medium mb-4">On This Page</h4>
          <div className="space-y-2">
            {toc.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className={`block text-sm transition-colors hover:text-foreground ${
                  item.level === 2 ? 'text-muted-foreground' : 'pl-4 text-muted-foreground/80'
                }`}
              >
                <div className="flex items-center">
                  {item.level === 3 && <ChevronRight className="mr-1 h-3 w-3" />}
                  {item.text}
                </div>
              </a>
            ))}
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
