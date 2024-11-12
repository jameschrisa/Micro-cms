import { useEffect, useState } from "react"
import { DocPage } from "../../components/doc-page"
import { db } from "../../services/db"
import { useSidebar } from "../../contexts/sidebar-context"
import { useLocation } from "react-router-dom"

export function AccessControlMonitoringPage() {
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
        description: "Monitor and manage access control across your organization's systems and resources."
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
# ${pageInfo?.title || 'Access Control Monitoring'}

Learn how to effectively monitor and manage access control across your organization's systems and resources.

## Overview

Access control monitoring is a critical component of security management that helps ensure:

- Only authorized users have access to sensitive resources
- Access patterns are tracked and analyzed for anomalies
- Compliance with security policies and regulations
- Quick detection and response to unauthorized access attempts

## Key Features

### Real-time Monitoring

Our access control monitoring system provides real-time visibility into:

- Active user sessions
- Authentication attempts
- Resource access patterns
- Privilege escalations
- Policy violations

### Anomaly Detection

The system automatically identifies suspicious activities such as:

- Unusual login times or locations
- Multiple failed authentication attempts
- Unexpected privilege escalations
- Abnormal resource access patterns
- Unauthorized configuration changes

### Automated Response

Configure automated responses to security events:

- Account lockouts after failed attempts
- Alert notifications to security teams
- Session termination for suspicious activity
- Temporary access restrictions
- Automated incident ticketing

## Best Practices

### Regular Auditing

- Review access logs daily
- Analyze authentication patterns weekly
- Audit user permissions monthly
- Update access policies quarterly
- Conduct comprehensive reviews annually

### Policy Enforcement

- Implement least privilege access
- Require multi-factor authentication
- Set strong password policies
- Define clear access request procedures
- Document all policy exceptions

### Incident Response

- Establish clear escalation procedures
- Define incident severity levels
- Document response protocols
- Train response teams regularly
- Review and update procedures quarterly
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
      title={pageInfo?.title || 'Access Control Monitoring'}
      description={pageInfo?.description || ''}
      content={content}
      onContentChange={async (newContent) => {
        await db.savePageContent(location.pathname, newContent)
        setContent(newContent)
      }}
    />
  )
}
