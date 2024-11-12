import { useEffect, useState } from "react"
import { DocPage } from "../../components/doc-page"
import { db } from "../../services/db"
import { useSidebar } from "../../contexts/sidebar-context"
import { useLocation } from "react-router-dom"

export function GraphVisualizationPage() {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { items } = useSidebar()

  // Find the current page title from navigation
  const pageInfo = items.reduce<{ title: string; description: string } | undefined>((found, section) => {
    if (found) return found
    const topic = section.items.find(item => item.href === location.pathname)
    if (topic) {
      return {
        title: topic.title,
        description: "Visualize and interact with your supply chain network using interactive graph visualization tools."
      }
    }
    return undefined
  }, undefined)

  useEffect(() => {
    const loadContent = async () => {
      const savedContent = await db.getPageContent(location.pathname)
      if (savedContent) {
        setContent(savedContent)
      } else {
        // Initialize with default content if none exists
        const defaultContent = `
# ${pageInfo?.title || 'Interactive Graph Visualization'}

Learn how to visualize and interact with your supply chain network using our interactive graph visualization tools.

## Overview

The interactive graph visualization provides a comprehensive view of your vendor relationships
and supply chain network. This powerful tool allows you to:

- Visualize complex vendor relationships in an intuitive graph format
- Interact with nodes to explore detailed vendor information
- Analyze connection patterns and dependencies
- Identify potential risks and vulnerabilities in your supply chain

## Key Features

### Dynamic Node Interaction

Click on any node to view detailed information about a specific vendor. The graph will
highlight direct connections and dependencies, making it easy to understand relationships
and potential impact points.

### Risk Level Visualization

Nodes are color-coded based on risk levels:

- Green: Low risk
- Yellow: Medium risk
- Orange: High risk
- Red: Critical risk

### Relationship Strength Indicators

Connection lines between nodes vary in thickness based on the strength and importance
of the relationship. Thicker lines indicate stronger or more critical relationships.

## Getting Started

To begin using the interactive graph visualization:

1. Navigate to the Supply Chain Dashboard
2. Select the "Network View" option
3. Use the filter panel to customize your view
4. Click and drag nodes to rearrange the visualization
5. Use the zoom controls to focus on specific areas

## Best Practices

- Regularly update vendor information to maintain accuracy
- Use filters to focus on specific regions or risk levels
- Export visualizations for reporting and documentation
- Share insights with stakeholders using the collaboration tools
`
        await db.savePageContent(location.pathname, defaultContent)
        setContent(defaultContent)
      }
      setIsLoading(false)
    }
    loadContent()
  }, [location.pathname, pageInfo?.title])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-2/3 bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
        <div className="h-4 w-4/6 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <DocPage
      title={pageInfo?.title || 'Interactive Graph Visualization'}
      description={pageInfo?.description || ''}
      content={content}
      onContentChange={async (newContent) => {
        await db.savePageContent(location.pathname, newContent)
        setContent(newContent)
      }}
    />
  )
}
