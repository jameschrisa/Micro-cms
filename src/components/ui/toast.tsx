import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

let toastCount = 0

export const toastStore = {
  listeners: new Set<(toast: Toast) => void>(),
  
  show(message: string, type: 'success' | 'error' = 'success') {
    const toast = { id: ++toastCount, message, type }
    this.listeners.forEach(listener => listener(toast))
  },

  subscribe(listener: (toast: Toast) => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
      return undefined
    }
  }
}

function ToastItem({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`
      flex items-center justify-between gap-2
      px-4 py-2 rounded-lg shadow-lg
      animate-in slide-in-from-top-5
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
    `}>
      <p className="text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastStore.subscribe(toast => {
      setToasts(prev => [...prev, toast])
    })
  }, [])

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
