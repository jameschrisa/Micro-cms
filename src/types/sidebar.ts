export interface SidebarItem {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
}

export type SidebarItems = SidebarItem[];
