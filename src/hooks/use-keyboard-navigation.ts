import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigation } from '../contexts/navigation-context'

export function useKeyboardNavigation(enabled: boolean) {
  const navigate = useNavigate()
  const { previousPage, nextPage } = useNavigation()

  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      // Navigation shortcuts (Alt + Arrow keys)
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowLeft':
            if (previousPage) {
              event.preventDefault()
              navigate(previousPage.href)
            }
            break
          case 'ArrowRight':
            if (nextPage) {
              event.preventDefault()
              navigate(nextPage.href)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate, previousPage, nextPage, enabled])
}
