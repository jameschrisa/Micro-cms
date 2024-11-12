import { Switch } from '@radix-ui/react-switch'
import { useKeyboard } from '../contexts/keyboard-context'
import { useUserRole } from '../contexts/user-role-context'
import { DatabasePanel } from '../components/database-panel'

export function SettingsPage() {
  const { keyboardShortcutsEnabled, setKeyboardShortcutsEnabled } = useKeyboard()
  const { isAdmin } = useUserRole()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your preferences and customize your experience.
        </p>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <label
                htmlFor="keyboard-shortcuts"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable Keyboard Shortcuts
              </label>
              <p className="text-sm text-muted-foreground">
                Toggle keyboard shortcuts for navigation and search.
              </p>
            </div>
            <Switch
              id="keyboard-shortcuts"
              checked={keyboardShortcutsEnabled}
              onCheckedChange={setKeyboardShortcutsEnabled}
              className="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            >
              <span
                className="pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                aria-hidden="true"
              />
            </Switch>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Active Shortcuts</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Search Documentation</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">⌘</kbd>
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">K</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Previous Page</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">⌥</kbd>
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">←</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next Page</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">⌥</kbd>
                <kbd className="px-2 py-1 text-xs bg-muted rounded border">→</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="border rounded-lg p-6">
          <DatabasePanel />
        </div>
      )}
    </div>
  )
}
