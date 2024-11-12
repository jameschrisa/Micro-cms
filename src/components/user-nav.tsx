import { CircleUserRound, Settings, LogOut, Bell, Shield, Key } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return

    const menuItems = menuItemRefs.current.filter(Boolean)
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement)

    const handleArrowKey = (nextIndex: number) => {
      event.preventDefault()
      const targetIndex = (nextIndex + menuItems.length) % menuItems.length
      menuItems[targetIndex]?.focus()
    }

    switch (event.key) {
      case 'ArrowDown':
        handleArrowKey(currentIndex + 1)
        break
      case 'ArrowUp':
        handleArrowKey(currentIndex - 1)
        break
      case 'Home':
        event.preventDefault()
        menuItems[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        menuItems[menuItems.length - 1]?.focus()
        break
    }
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    navigate('/settings')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === 'ArrowDown' && isOpen && menuItemRefs.current[0]?.focus()}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <CircleUserRound className="h-5 w-5 mr-2" />
        <span>Profile</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border border-border bg-popover/95 p-1 shadow-lg backdrop-blur-sm animate-in fade-in-0 zoom-in-95"
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-3 p-3">
            <CircleUserRound className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">admin@example.com</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>

          <div className="h-px bg-border my-1" />
          
          <button 
            ref={el => menuItemRefs.current[0] = el}
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
            role="menuitem"
          >
            <Bell className="mr-3 h-4 w-4" />
            <span>Notifications</span>
          </button>

          <button 
            ref={el => menuItemRefs.current[1] = el}
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
            role="menuitem"
          >
            <Shield className="mr-3 h-4 w-4" />
            <span>Security</span>
          </button>

          <button 
            ref={el => menuItemRefs.current[2] = el}
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
            role="menuitem"
            onClick={handleSettingsClick}
          >
            <Settings className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </button>

          <div className="h-px bg-border my-1" />

          <button 
            ref={el => menuItemRefs.current[3] = el}
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-red-500 hover:text-red-500 transition-colors"
            role="menuitem"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  )
}
