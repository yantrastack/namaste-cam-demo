'use client'

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react'
import { MaterialIcon } from '@/components/MaterialIcon'
import { cn } from '@/lib/cn'

interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-9999 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-slide-in"
          >
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-[10px] shadow-lg min-w-70 max-w-100',
                toast.type === 'success' && 'bg-surface-container-lowest border-2 border-green-500/20',
                toast.type === 'error' && 'bg-surface-container-lowest border-2 border-red-500/20',
                toast.type === 'info' && 'bg-surface-container-lowest border-2 border-primary/20'
              )}
            >
              <div
                className={cn(
                  'shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
                  toast.type === 'success' && 'bg-green-100 text-green-600',
                  toast.type === 'error' && 'bg-red-100 text-red-600',
                  toast.type === 'info' && 'bg-primary/10 text-primary'
                )}
              >
                <MaterialIcon
                  name={toast.type === 'success' ? 'check' : toast.type === 'error' ? 'error' : 'info'}
                  className="text-sm"
                />
              </div>
              <p className="text-sm font-medium text-on-surface flex-1">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-secondary hover:text-on-surface transition-colors"
              >
                <MaterialIcon name="close" className="text-base" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slide-out {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  )
}
