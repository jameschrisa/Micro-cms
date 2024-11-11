import { useState, useRef, useEffect } from 'react'
import { FileEdit, Save, X, Eye, Edit2, Keyboard } from 'lucide-react'
import { MarkdownContent } from './markdown-content'
import { MarkdownToolbar, markdownActions } from './markdown-toolbar'
import { db } from '../services/db'

interface MarkdownEditorProps {
  content: string
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
}

export function MarkdownEditor({ content: initialContent, isOpen, onClose, onSave }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [preview, setPreview] = useState(false)
  const [showKeyboardHint, setShowKeyboardHint] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currentPath = window.location.pathname

  // Load saved content on mount
  useEffect(() => {
    const loadSavedContent = async () => {
      const savedContent = await db.getPageContent(currentPath)
      if (savedContent) {
        setContent(savedContent)
      } else if (initialContent) {
        // If no saved content exists but we have initial content, save it
        await db.savePageContent(currentPath, initialContent)
      }
    }
    loadSavedContent()
  }, [currentPath, initialContent])

  // Debounced content saving
  const saveContent = async (newContent: string) => {
    if (saveTimeout) {
      window.clearTimeout(saveTimeout)
    }

    const timeout = window.setTimeout(async () => {
      await db.savePageContent(currentPath, newContent)
    }, 1000) // Save after 1 second of no typing

    setSaveTimeout(timeout)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? e.metaKey : e.ctrlKey

      // Toggle preview mode with Cmd/Ctrl + P
      if (cmdKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setPreview(prev => !prev)
        return
      }

      if (!textareaRef.current || preview) return

      if (cmdKey) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)

        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault()
            handleFormat('bold', selectedText, start, end)
            break
          case 'i':
            e.preventDefault()
            handleFormat('italic', selectedText, start, end)
            break
          case 'k':
            e.preventDefault()
            handleFormat('link', selectedText, start, end)
            break
          case '1':
            if (!e.shiftKey) {
              e.preventDefault()
              handleFormat('h1', selectedText, start, end)
            }
            break
          case '2':
            if (!e.shiftKey) {
              e.preventDefault()
              handleFormat('h2', selectedText, start, end)
            }
            break
          case '3':
            if (!e.shiftKey) {
              e.preventDefault()
              handleFormat('h3', selectedText, start, end)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [content, preview])

  if (!isOpen) return null

  const handleFormat = (action: string, selectedText: string, start: number, end: number) => {
    const { prefix, suffix, defaultText } = markdownActions[action]
    const newText = selectedText
      ? prefix + selectedText + suffix
      : prefix + (defaultText || '') + suffix

    const newContent = 
      content.substring(0, start) + 
      newText + 
      content.substring(end)

    setContent(newContent)
    saveContent(newContent)

    // Set cursor position after update
    requestAnimationFrame(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.focus()
        const newCursorPos = start + prefix.length + (selectedText || defaultText || '').length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }
    })
  }

  const handleToolbarAction = (action: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    handleFormat(action, selectedText, start, end)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    saveContent(newContent)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 z-50 grid gap-4 rounded-lg border bg-background shadow-lg">
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-2">
            <FileEdit className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Edit Documentation</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowKeyboardHint(!showKeyboardHint)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <Keyboard className="h-4 w-4" />
              </button>
              {showKeyboardHint && (
                <div className="absolute right-0 mt-2 w-64 p-4 rounded-md border bg-popover text-popover-foreground shadow-md">
                  <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Toggle Preview</span>
                      <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border">⌘ P</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Bold</span>
                      <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border">⌘ B</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Italic</span>
                      <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border">⌘ I</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Link</span>
                      <kbd className="px-2 py-0.5 text-xs font-mono bg-muted rounded border">⌘ K</kbd>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setPreview(!preview)}
              className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${
                preview
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-input hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {preview ? (
                <>
                  <Edit2 className="h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={() => {
                onSave(content)
                onClose()
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6">
          {!preview && <MarkdownToolbar onAction={handleToolbarAction} />}
        </div>

        <div className="grid px-6 pb-6" style={{ height: 'calc(100vh - 12rem)' }}>
          {preview ? (
            <div className="overflow-auto rounded-md border bg-card p-6">
              <div className="prose prose-invert max-w-none">
                <MarkdownContent content={content} />
              </div>
            </div>
          ) : (
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                className="h-full w-full resize-none rounded-md border bg-transparent p-4 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter markdown content..."
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  lineHeight: '1.5',
                  tabSize: 2
                }}
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                Press Tab to indent
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
