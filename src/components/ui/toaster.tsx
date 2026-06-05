'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'default' | 'destructive' | 'success'

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

// Global store (singleton, no context needed)
type Listener = (toasts: ToastData[]) => void
let _toasts: ToastData[] = []
let _listeners: Listener[] = []
let _counter = 0

function notify() {
  _listeners.forEach((l) => l([..._toasts]))
}

export function toast(options: Omit<ToastData, 'id'>) {
  const id = String(++_counter)
  _toasts = [..._toasts, { ...options, id }]
  notify()
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id)
    notify()
  }, 4000)
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>(_toasts)

  React.useEffect(() => {
    _listeners.push(setToasts)
    return () => {
      _listeners = _listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return { toasts, toast }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              _toasts = _toasts.filter((x) => x.id !== t.id)
              notify()
            }
          }}
          className={cn(
            'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg',
            t.variant === 'destructive' &&
              'border-red-200 bg-red-50 text-red-900',
            t.variant === 'success' &&
              'border-green-200 bg-green-50 text-green-900',
            (!t.variant || t.variant === 'default') &&
              'border-border bg-background text-foreground'
          )}
        >
          {t.variant === 'success' && (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          )}
          {t.variant === 'destructive' && (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          )}
          {(!t.variant || t.variant === 'default') && (
            <Info className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
          )}
          <div className="flex-1">
            {t.title && (
              <ToastPrimitive.Title className="text-sm font-semibold">
                {t.title}
              </ToastPrimitive.Title>
            )}
            {t.description && (
              <ToastPrimitive.Description className="text-sm opacity-80 mt-0.5">
                {t.description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 group-hover:opacity-100">
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4 sm:max-w-[380px] sm:flex-col" />
    </ToastPrimitive.Provider>
  )
}
