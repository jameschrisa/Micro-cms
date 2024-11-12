import Dexie, { Table } from 'dexie';
import { SidebarItems } from '../types/sidebar';

interface PageContent {
  path: string;
  content: string;
  lastModified: Date;
}

interface SidebarConfig {
  id: string;
  items: SidebarItems;
  lastModified: Date;
}

interface SiteContent {
  id: string;
  content: string;
  lastModified: Date;
}

class DocumentDatabase extends Dexie {
  pageContents!: Table<PageContent>;
  sidebarConfig!: Table<SidebarConfig>;
  siteContent!: Table<SiteContent>;

  constructor() {
    super('R00kDocDB');
    
    this.version(11).stores({
      pageContents: 'path',
      sidebarConfig: 'id',
      siteContent: 'id'
    });

    // Initialize default content if needed
    this.on('ready', async () => {
      const introExists = await this.siteContent.get('intro');
      if (!introExists) {
        await this.siteContent.put({
          id: 'intro',
          content: `# r00k Documentation

Welcome to the comprehensive security and risk management documentation. This platform provides detailed information about:

- About R00K
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
- **Dark Mode**: Optimized for comfortable reading in low-light environments`,
          lastModified: new Date()
        });
      }

      const sidebarExists = await this.sidebarConfig.get('main');
      if (!sidebarExists) {
        await this.sidebarConfig.put({
          id: 'main',
          items: [
            {
              title: "Security Fundamentals",
              items: [
                {
                  title: "Why it's important?",
                  href: "/docs/security/importance",
                  description: "Understanding the critical importance of security in modern systems."
                },
                {
                  title: "Emerging Threats and AI",
                  href: "/docs/security/emerging-threats",
                  description: "Exploring new security challenges in the age of artificial intelligence."
                },
                {
                  title: "Infrastructure Protection",
                  href: "/docs/security/infrastructure",
                  description: "Best practices for protecting critical infrastructure components."
                },
                {
                  title: "Threat Intelligence",
                  href: "/docs/security/threat-intelligence",
                  description: "Leveraging threat intelligence for proactive security measures."
                },
                {
                  title: "Vulnerability Management",
                  href: "/docs/security/vulnerability-management",
                  description: "Systematic approach to managing and mitigating vulnerabilities."
                },
              ],
            },
            {
              title: "Supply Chain Risk Management",
              items: [
                {
                  title: "Supply Chain Vulnerabilities",
                  href: "/docs/risk/vulnerabilities",
                  description: "Identifying and addressing vulnerabilities in supply chain systems."
                },
                {
                  title: "Risk Assessment Fundamentals",
                  href: "/docs/risk/assessment",
                  description: "Core principles and methodologies for assessing supply chain risks."
                },
                {
                  title: "Supply Chain Resilience",
                  href: "/docs/risk/resilience",
                  description: "Building robust and resilient supply chain systems."
                },
                {
                  title: "Third-Party Risk Management",
                  href: "/docs/risk/third-party",
                  description: "Managing risks associated with third-party vendors and partners."
                },
                {
                  title: "Global Threat Landscape",
                  href: "/docs/risk/global-threats",
                  description: "Understanding and navigating global supply chain threats."
                },
              ],
            }
          ],
          lastModified: new Date()
        });
      }
    });
  }

  // Page content methods
  async savePageContent(path: string, content: string): Promise<void> {
    await this.pageContents.put({
      path,
      content,
      lastModified: new Date()
    });
  }

  async getPageContent(path: string): Promise<string | null> {
    const page = await this.pageContents.get(path);
    return page?.content ?? null;
  }

  // Sidebar configuration methods
  async saveSidebarConfig(items: SidebarItems): Promise<void> {
    await this.sidebarConfig.put({
      id: 'main',
      items,
      lastModified: new Date()
    });
  }

  async getSidebarConfig(): Promise<SidebarItems | null> {
    const config = await this.sidebarConfig.get('main');
    return config?.items ?? null;
  }

  // Site content methods
  async getSiteContent(id: string): Promise<string | null> {
    const content = await this.siteContent.get(id);
    return content?.content ?? null;
  }

  async saveSiteContent(id: string, content: string): Promise<void> {
    await this.siteContent.put({
      id,
      content,
      lastModified: new Date()
    });
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await this.pageContents.clear();
    await this.sidebarConfig.clear();
    await this.siteContent.clear();
  }
}

export const db = new DocumentDatabase();
