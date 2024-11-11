import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Breadcrumb() {
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)

  // Convert path segments to readable titles
  const formatTitle = (path: string) => {
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        // Skip 'docs' in the breadcrumb display
        if (path === 'docs') return null

        const href = `/${paths.slice(0, index + 1).join('/')}`
        const isLast = index === paths.length - 1

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="text-foreground font-medium">
                {formatTitle(path)}
              </span>
            ) : (
              <Link
                to={href}
                className="hover:text-foreground transition-colors"
              >
                {formatTitle(path)}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
