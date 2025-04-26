"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toasts: { id: string; title: string; description: string; variant: "default" | "destructive" }[]
  addToast: (toast: { title: string; description: string; variant?: "default" | "destructive" }) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    { id: string; title: string; description: string; variant: "default" | "destructive" }[]
  >([])

  const addToast = React.useCallback(
    ({ title, description, variant = "default" }: { title: string; description: string; variant?: "default" | "destructive" }) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, title, description, variant }])

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    },
    []
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-lg p-4 shadow-lg transition-all animate-in slide-in-from-right-full",
              toast.variant === "destructive" 
                ? "bg-red-500 text-white" 
                : "bg-white border border-gray-200"
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={cn(
                  "font-medium text-sm",
                  toast.variant === "destructive" ? "text-white" : "text-gray-900"
                )}>
                  {toast.title}
                </h3>
                <p className={cn(
                  "text-sm",
                  toast.variant === "destructive" ? "text-white opacity-90" : "text-gray-500"
                )}>
                  {toast.description}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={cn(
                  "ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md",
                  toast.variant === "destructive" 
                    ? "text-white hover:bg-red-600 focus:ring-red-400" 
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <span className="sr-only">닫기</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  }
} 