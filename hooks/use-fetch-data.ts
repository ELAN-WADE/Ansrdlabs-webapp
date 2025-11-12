"use client"

import { useState, useEffect, useCallback } from "react"

interface UseFetchDataOptions {
  retries?: number
  retryDelay?: number
  onError?: (error: Error) => void
}

interface UseFetchDataState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  retry: () => Promise<void>
}

export function useFetchData<T>(fetchFn: () => Promise<T>, options: UseFetchDataOptions = {}): UseFetchDataState<T> {
  const { retries = 3, retryDelay = 1000, onError } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)
      setRetryCount(0)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)

      if (retryCount < retries) {
        setRetryCount(retryCount + 1)
        setTimeout(() => {
          fetchData()
        }, retryDelay * Math.pow(2, retryCount))
      }
    } finally {
      setLoading(false)
    }
  }, [fetchFn, retries, retryDelay, retryCount, onError])

  useEffect(() => {
    fetchData()
  }, [fetchFn])

  const retry = useCallback(async () => {
    setRetryCount(0)
    await fetchData()
  }, [fetchData])

  return { data, loading, error, retry }
}
