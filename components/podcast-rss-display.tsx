"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Play, Loader2, AlertCircle } from "lucide-react"
import { fetchAndParseRSS, formatRSSDate, stripRSSHtml, type RSSFeed } from "@/lib/rss-parser"

interface PodcastRSSDisplayProps {
  feedUrl: string
  title?: string
  maxItems?: number
}

export function PodcastRSSDisplay({ feedUrl, title = "Latest Episodes", maxItems = 5 }: PodcastRSSDisplayProps) {
  const [feed, setFeed] = useState<RSSFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true)
        setError(null)

        const parsedFeed = await fetchAndParseRSS(feedUrl)

        if (!parsedFeed) {
          setError("Failed to load podcast feed")
          return
        }

        setFeed(parsedFeed)
      } catch (err) {
        setError("Error loading podcast feed")
      } finally {
        setLoading(false)
      }
    }

    loadFeed()
  }, [feedUrl])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !feed) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-foreground-muted" />
          <p className="text-foreground-muted">{error || "Unable to load podcast feed"}</p>
        </div>
      </div>
    )
  }

  const displayItems = feed.items.slice(0, maxItems)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-foreground-muted">{feed.title}</p>
      </div>

      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <motion.div
            key={item.guid || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg border border-border bg-surface p-4 hover:border-accent transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent">
                <Play className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-2">{item.title}</h3>
                <p className="mt-1 text-sm text-foreground-muted line-clamp-2">{stripRSSHtml(item.description)}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground-subtle">
                  <span>{formatRSSDate(item.pubDate)}</span>
                  {item.duration && <span>{item.duration}</span>}
                  {item.episodeNumber && <span>Episode {item.episodeNumber}</span>}
                </div>
              </div>

              {item.enclosure && (
                <a
                  href={item.enclosure.url}
                  download
                  className="flex-shrink-0 rounded-lg bg-accent p-2 text-white hover:scale-110 transition-transform"
                  title="Download episode"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {feed.items.length > maxItems && (
        <a
          href={feed.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-accent hover:underline"
        >
          View all episodes →
        </a>
      )}
    </div>
  )
}
