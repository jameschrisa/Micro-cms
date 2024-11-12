import { useKeyboard } from '../contexts/keyboard-context'
import { useKeyboardNavigation } from '../hooks/use-keyboard-navigation'

interface KeyboardNavigationProps {
  children: React.ReactNode
}

export function KeyboardNavigation({ children }: KeyboardNavigationProps) {
  const { keyboardShortcutsEnabled } = useKeyboard()
  useKeyboardNavigation(keyboardShortcutsEnabled)
  
  return <>{children}</>
}
