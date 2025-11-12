"use client"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { PodcastRSSFeed } from "./podcast-rss-feed"

interface LatestPodcastsRSSProps {
  rssUrl?: string
  maxItems?: number
  showRSSFeed?: boolean
}

export function LatestPodcastsRSS({ rssUrl, maxItems = 3, showRSSFeed = false }: LatestPodcastsRSSProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-2 text-sm text-foreground-muted">Loading podcasts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* RSS Feed Display */}
      {showRSSFeed && rssUrl && (
        <div>
          <h3 className="mb-6 font-serif text-2xl font-bold text-foreground">Latest Episodes</h3>
          <PodcastRSSFeed feedUrl={rssUrl} maxItems={maxItems} />
        </div>
      )}

      {/* Fallback to database podcasts */}
      {!showRSSFeed && (
        <div>
          <h3 className="mb-6 font-serif text-2xl font-bold text-foreground">Latest Episodes</h3>
          <p className="text-foreground-muted">Configure RSS feed URL to display latest episodes.</p>
        </div>
      )}
    </div>
  )
}
