"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error) => void
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("[v0] Error caught by boundary:", event.error)
      setHasError(true)
      setError(event.error)
      onError?.(event.error)
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [onError])

  if (hasError) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
            <h2 className="mt-4 font-serif text-xl font-bold text-red-900">Something went wrong</h2>
            <p className="mt-2 text-sm text-red-700">{error?.message || "An unexpected error occurred"}</p>
            <button
              onClick={() => {
                setHasError(false)
                setError(null)
                window.location.reload()
              }}
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      )
    )
  }

  return children
}
