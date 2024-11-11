import { MainNav } from "./main-nav"
import { Search } from "../search"
import { UserNav } from "../user-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex items-center gap-4 ml-auto">
          <div className="w-full md:w-[240px]">
            <Search />
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
