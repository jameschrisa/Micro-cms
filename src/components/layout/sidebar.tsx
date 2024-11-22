import { ScrollArea } from "@radix-ui/react-scroll-area"
import { NavLink } from "react-router-dom"
import { ChevronRight, Settings } from "lucide-react"
import { useState } from "react"
import { SidebarEditor } from "../sidebar-editor"
import { useSidebar } from "../../contexts/sidebar-context"
import { useAuth } from "../../contexts/auth-context"

interface SidebarProps {
  isLoggedIn?: boolean
}

export function Sidebar({ isLoggedIn = false }: SidebarProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { items } = useSidebar()
  const { user } = useAuth()
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>(() => {
    // Initialize first three sections as expanded
    return items.reduce((acc, section, index) => {
      acc[section.title] = index < 3
      return acc
    }, {} as { [key: string]: boolean })
  })

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }))
  }

  return (
    <>
      <div className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-border md:sticky md:block">
        <ScrollArea className="py-6 pr-6 lg:py-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-sm font-medium">Navigation</h4>
            {user?.role === 'admin' && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md p-1 hover:bg-accent"
                title="Edit Navigation"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="w-full">
            {items.map((section, index) => {
              const isExpanded = expandedSections[section.title]
              
              return (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-accent/50 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight 
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                        isExpanded ? 'transform rotate-90' : ''
                      }`}
                    />
                    <span className="text-foreground/90 text-left">{section.title}</span>
                  </button>
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isExpanded 
                        ? 'grid-rows-[1fr] opacity-100' 
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-1 pl-6 pt-1">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                              `block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50 ${
                                isActive 
                                  ? "bg-accent text-accent-foreground font-medium" 
                                  : "text-muted-foreground hover:text-foreground"
                              }`
                            }
                          >
                            {item.title}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
      {isEditing && <SidebarEditor onClose={() => setIsEditing(false)} />}
    </>
  )
}
