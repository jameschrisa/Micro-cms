export interface SidebarItem {
  title: string
  href: string
  description: string
}

export interface SidebarSection {
  title: string
  items: SidebarItem[]
}

export type SidebarItems = SidebarSection[]
