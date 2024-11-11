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

class DocumentDatabase extends Dexie {
  pageContents!: Table<PageContent>;
  sidebarConfig!: Table<SidebarConfig>;

  constructor() {
    super('R00kDocDB');
    
    this.version(1).stores({
      pageContents: 'path',
      sidebarConfig: 'id'
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
      id: 'main', // We only have one sidebar config
      items,
      lastModified: new Date()
    });
  }

  async getSidebarConfig(): Promise<SidebarItems | null> {
    const config = await this.sidebarConfig.get('main');
    return config?.items ?? null;
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await this.pageContents.clear();
    await this.sidebarConfig.clear();
  }
}

export const db = new DocumentDatabase();
