import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import type { Components } from 'react-markdown'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const components: Partial<Components> = {
    h1: ({ children }) => (
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-') || ''
      return (
        <h2 id={id} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-16">
          {children}
        </h2>
      )
    },
    h3: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-') || ''
      return (
        <h3 id={id} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">
          {children}
        </h3>
      )
    },
    h4: ({ children }) => (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li>{children}</li>,
    a: ({ href, children }) => (
      <a 
        href={href}
        className="font-medium underline underline-offset-4 hover:text-primary"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      const isInline = !className

      if (isInline) {
        return (
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {children}
          </code>
        )
      }

      return (
        <div className="relative">
          {language && (
            <div className="absolute right-4 top-3 text-xs text-muted-foreground">
              {language}
            </div>
          )}
          <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4">
            <code className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm${
              language ? ` language-${language}` : ''
            }`}>
              {children}
            </code>
          </pre>
        </div>
      )
    },
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-border pl-6 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    )
  }

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
