import { Search as SearchIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useKeyboard } from "../contexts/keyboard-context"

export function Search() {
  const { isSearchOpen, setIsSearchOpen } = useKeyboard()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsSearchOpen])

  return (
    <div className="relative w-full" ref={searchRef}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search documentation..."
        className="flex h-10 w-full rounded-md border border-input bg-background/50 pl-10 pr-12 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => setIsSearchOpen(true)}
        onFocus={() => setIsSearchOpen(true)}
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-md border border-border bg-popover/95 shadow-lg backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent Searches</p>
                <div className="text-sm text-muted-foreground/80">No recent searches</div>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick Links</p>
                <div className="grid gap-1">
                  <button className="flex w-full items-center rounded-sm px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    Supply Chain Network
                  </button>
                  <button className="flex w-full items-center rounded-sm px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    Access Control Risk
                  </button>
                  <button className="flex w-full items-center rounded-sm px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                    Compliance Management
                  </button>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Jump to</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">↵</kbd>
                </div>
                <div className="flex items-center gap-2">
                  <span>Close</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
