import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'

interface MarkdownToolbarProps {
  onAction: (action: string) => void
}

interface ToolbarButton {
  icon: React.ComponentType<any>
  label: string
  action: string
  shortcut?: string
  markdown: {
    prefix: string
    suffix: string
    defaultText?: string
  }
}

const buttons: ToolbarButton[] = [
  {
    icon: Bold,
    label: 'Bold',
    action: 'bold',
    shortcut: '⌘+B',
    markdown: { prefix: '**', suffix: '**', defaultText: 'bold text' }
  },
  {
    icon: Italic,
    label: 'Italic',
    action: 'italic',
    shortcut: '⌘+I',
    markdown: { prefix: '_', suffix: '_', defaultText: 'italic text' }
  },
  {
    icon: Link,
    label: 'Link',
    action: 'link',
    shortcut: '⌘+K',
    markdown: { prefix: '[', suffix: '](url)', defaultText: 'link text' }
  },
  {
    icon: Code,
    label: 'Code Block',
    action: 'code',
    shortcut: '⌘+⇧+C',
    markdown: { prefix: '```\n', suffix: '\n```', defaultText: 'code' }
  },
  {
    icon: Quote,
    label: 'Quote',
    action: 'quote',
    shortcut: '⌘+⇧+.',
    markdown: { prefix: '> ', suffix: '', defaultText: 'quote' }
  },
  {
    icon: List,
    label: 'Bullet List',
    action: 'bullet',
    shortcut: '⌘+⇧+8',
    markdown: { prefix: '- ', suffix: '', defaultText: 'list item' }
  },
  {
    icon: ListOrdered,
    label: 'Numbered List',
    action: 'number',
    shortcut: '⌘+⇧+7',
    markdown: { prefix: '1. ', suffix: '', defaultText: 'list item' }
  },
  {
    icon: Heading1,
    label: 'Heading 1',
    action: 'h1',
    shortcut: '⌘+1',
    markdown: { prefix: '# ', suffix: '', defaultText: 'heading' }
  },
  {
    icon: Heading2,
    label: 'Heading 2',
    action: 'h2',
    shortcut: '⌘+2',
    markdown: { prefix: '## ', suffix: '', defaultText: 'heading' }
  },
  {
    icon: Heading3,
    label: 'Heading 3',
    action: 'h3',
    shortcut: '⌘+3',
    markdown: { prefix: '### ', suffix: '', defaultText: 'heading' }
  },
]

export function MarkdownToolbar({ onAction }: MarkdownToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-t-md border-b">
      {buttons.map((button) => (
        <div key={button.action} className="relative group">
          <button
            onClick={() => onAction(button.action)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
            title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
          >
            <button.icon className="h-4 w-4" />
          </button>
          <div className="absolute opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1.5 text-xs bg-popover text-popover-foreground rounded-md shadow-md whitespace-nowrap z-50 transition-all duration-200 ease-out">
            <div className="flex items-center gap-2">
              <span className="font-medium">{button.label}</span>
              {button.shortcut && (
                <span className="text-muted-foreground border border-border rounded px-1 py-0.5 text-[10px] font-mono">
                  {button.shortcut}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-popover border-r border-b border-border"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const markdownActions = buttons.reduce((acc, button) => {
  acc[button.action] = button.markdown
  return acc
}, {} as Record<string, { prefix: string; suffix: string; defaultText?: string }>)

export const shortcuts = buttons.reduce((acc, button) => {
  if (button.shortcut) {
    acc[button.action] = button.shortcut
  }
  return acc
}, {} as Record<string, string>)
