import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SiteHeader } from './components/layout/site-header'
import { Sidebar } from './components/layout/sidebar'
import { GraphVisualizationPage } from './pages/supply-chain/graph-visualization'
import { AccessControlMonitoringPage } from './pages/access-control/monitoring'
import { NavigationProvider, useNavigation, findAdjacentPages } from './contexts/navigation-context'
import { KeyboardProvider, KeyboardShortcuts } from './contexts/keyboard-context'
import { SidebarProvider } from './contexts/sidebar-context'
import { DocPage } from './components/doc-page'
import { useEffect } from 'react'
import { SidebarItems } from './types/sidebar'

const sidebarItems: SidebarItems = [
  {
    title: "Security Fundamentals",
    items: [
      {
        title: "Why it's important?",
        href: "/docs/security/importance",
      },
      {
        title: "Emerging Threats and AI",
        href: "/docs/security/emerging-threats",
      },
      {
        title: "Infrastructure Protection",
        href: "/docs/security/infrastructure",
      },
      {
        title: "Threat Intelligence",
        href: "/docs/security/threat-intelligence",
      },
      {
        title: "Vulnerability Management",
        href: "/docs/security/vulnerability-management",
      },
    ],
  },
  {
    title: "Supply Chain Risk Management",
    items: [
      {
        title: "Supply Chain Vulnerabilities",
        href: "/docs/risk/vulnerabilities",
      },
      {
        title: "Risk Assessment Fundamentals",
        href: "/docs/risk/assessment",
      },
      {
        title: "Supply Chain Resilience",
        href: "/docs/risk/resilience",
      },
      {
        title: "Third-Party Risk Management",
        href: "/docs/risk/third-party",
      },
      {
        title: "Global Threat Landscape",
        href: "/docs/risk/global-threats",
      },
    ],
  },
  {
    title: "Cybersecurity in Supply Chain",
    items: [
      {
        title: "Supply Chain Cyber Risks",
        href: "/docs/cyber/risks",
      },
      {
        title: "Protecting Supply Chain Data",
        href: "/docs/cyber/data-protection",
      },
      {
        title: "Cyber Attack Vectors",
        href: "/docs/cyber/attack-vectors",
      },
      {
        title: "Cyber Resilience Strategies",
        href: "/docs/cyber/resilience",
      },
      {
        title: "Incident Response",
        href: "/docs/cyber/incident-response",
      },
      {
        title: "Supply Chain Security",
        href: "/docs/cyber/security",
      },
    ],
  },
  {
    title: "Supply Chain Network",
    items: [
      {
        title: "Interactive Graph Visualization",
        href: "/docs/supply-chain/graph-visualization",
      },
      {
        title: "Real-time Dependency Mapping",
        href: "/docs/supply-chain/dependency-mapping",
      },
      {
        title: "Risk Level Indicators",
        href: "/docs/supply-chain/risk-indicators",
      },
      {
        title: "Relationship Strength Analysis",
        href: "/docs/supply-chain/relationship-analysis",
      },
    ],
  },
  {
    title: "Access Control Risk",
    items: [
      {
        title: "Access Control Monitoring",
        href: "/docs/access-control/monitoring",
      },
      {
        title: "Authentication Anomaly Detection",
        href: "/docs/access-control/anomaly-detection",
      },
      {
        title: "Privileged Access Tracking",
        href: "/docs/access-control/privileged-access",
      },
      {
        title: "Access Pattern Analysis",
        href: "/docs/access-control/pattern-analysis",
      },
    ],
  },
  {
    title: "Compliance Management",
    items: [
      {
        title: "Compliance Rate Tracking",
        href: "/docs/compliance/rate-tracking",
      },
      {
        title: "Audit Management",
        href: "/docs/compliance/audit-management",
      },
      {
        title: "Training Status Monitoring",
        href: "/docs/compliance/training-status",
      },
      {
        title: "Regulatory Requirement Mapping",
        href: "/docs/compliance/requirement-mapping",
      },
    ],
  },
  {
    title: "Data Management",
    items: [
      {
        title: "Data Classification",
        href: "/docs/data/classification",
      },
      {
        title: "Storage Distribution Analysis",
        href: "/docs/data/storage-distribution",
      },
      {
        title: "Data Residency Tracking",
        href: "/docs/data/residency-tracking",
      },
      {
        title: "Source Management",
        href: "/docs/data/source-management",
      },
    ],
  },
  {
    title: "Control Management",
    items: [
      {
        title: "Control Implementation Tracking",
        href: "/docs/control/implementation-tracking",
      },
      {
        title: "Effectiveness Monitoring",
        href: "/docs/control/effectiveness-monitoring",
      },
      {
        title: "Distribution Analysis",
        href: "/docs/control/distribution-analysis",
      },
      {
        title: "Compliance Mapping",
        href: "/docs/control/compliance-mapping",
      },
    ],
  },
  {
    title: "Business Continuity",
    items: [
      {
        title: "Asset Criticality Assessment",
        href: "/docs/continuity/asset-criticality",
      },
      {
        title: "Recovery Time Objectives",
        href: "/docs/continuity/rto",
      },
      {
        title: "Recovery Point Objectives",
        href: "/docs/continuity/rpo",
      },
      {
        title: "Impact Analysis",
        href: "/docs/continuity/impact-analysis",
      },
    ],
  },
]

const introContent = `
# r00k Documentation

Welcome to the comprehensive security and risk management documentation. This platform provides detailed information about:

- Security Fundamentals
- Supply Chain Risk Management
- Cybersecurity in Supply Chain
- Supply Chain Network Visualization
- Access Control Risk Management
- Compliance Management
- Data Management
- Control Management
- Business Continuity

Use the sidebar navigation to explore detailed documentation for each topic.

## Getting Started

Choose a topic from the sidebar to begin exploring our documentation. Each section provides in-depth information, practical examples, and best practices.

## Documentation Features

- **Interactive Navigation**: Use the sidebar to browse through different topics
- **Search Functionality**: Quickly find specific information using the search bar
- **Keyboard Shortcuts**: Navigate efficiently using keyboard shortcuts
- **Edit Capability**: Authorized users can edit and improve documentation
- **Dark Mode**: Optimized for comfortable reading in low-light environments
`

function NavigationUpdater() {
  const location = useLocation()
  const { setPreviousPage, setNextPage } = useNavigation()

  useEffect(() => {
    const { previous, next } = findAdjacentPages(sidebarItems, location.pathname)
    setPreviousPage(previous)
    setNextPage(next)
  }, [location.pathname, setPreviousPage, setNextPage])

  return null
}

// Mock authentication state - in a real app, this would come from your auth system
const isLoggedIn = true

function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container flex-1">
        <div className="grid grid-cols-[220px_1fr] gap-6 lg:grid-cols-[240px_1fr]">
          <Sidebar isLoggedIn={isLoggedIn} />
          <main className="relative py-6 lg:gap-10 lg:py-8">
            <div className="mx-auto w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
      <KeyboardShortcuts />
    </div>
  )
}

function Introduction() {
  return (
    <DocPage
      title="r00k Documentation"
      description="Comprehensive security and risk management documentation platform."
      content={introContent}
      onContentChange={(newContent: string) => {
        console.log('Content updated:', newContent)
        // Here you would typically save the content to your backend
      }}
    />
  )
}

function AppRoutes() {
  return (
    <>
      <NavigationUpdater />
      <Routes>
        <Route
          path="/"
          element={
            <DocsLayout>
              <Introduction />
            </DocsLayout>
          }
        />
        <Route
          path="/docs/supply-chain/graph-visualization"
          element={
            <DocsLayout>
              <GraphVisualizationPage />
            </DocsLayout>
          }
        />
        <Route
          path="/docs/access-control/monitoring"
          element={
            <DocsLayout>
              <AccessControlMonitoringPage />
            </DocsLayout>
          }
        />
        <Route
          path="/docs/*"
          element={
            <DocsLayout>
              <Introduction />
            </DocsLayout>
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <NavigationProvider>
        <KeyboardProvider>
          <SidebarProvider initialItems={sidebarItems}>
            <AppRoutes />
          </SidebarProvider>
        </KeyboardProvider>
      </NavigationProvider>
    </Router>
  )
}
