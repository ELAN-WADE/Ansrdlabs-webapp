"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Loader2, AlertCircle } from "lucide-react"
import { parseYouTubeRSS, formatRSSDate, type RSSFeed } from "@/lib/rss-parser"

interface YouTubeRSSDisplayProps {
  channelId: string
  title?: string
  maxVideos?: number
}

export function YouTubeRSSDisplay({ channelId, title = "Latest Videos", maxVideos = 6 }: YouTubeRSSDisplayProps) {
  const [feed, setFeed] = useState<RSSFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true)
        setError(null)

        const parsedFeed = await parseYouTubeRSS(channelId)

        if (!parsedFeed) {
          setError("Failed to load YouTube feed")
          return
        }

        setFeed(parsedFeed)
      } catch (err) {
        setError("Error loading YouTube feed")
      } finally {
        setLoading(false)
      }
    }

    loadFeed()
  }, [channelId])

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
          <p className="text-foreground-muted">{error || "Unable to load YouTube feed"}</p>
        </div>
      </div>
    )
  }

  const displayVideos = feed.items.slice(0, maxVideos)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-foreground-muted">{feed.title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayVideos.map((item, index) => {
          // Extract video ID from YouTube link
          const videoId = item.link?.split("v=")[1] || item.guid?.split("yt:video:")[1]
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

          return (
            <motion.a
              key={item.guid || index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border border-border hover:border-accent transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-surface">
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/youtube-video-thumbnail.png"
                  }}
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                  <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-foreground-muted">{formatRSSDate(item.pubDate)}</p>
              </div>
            </motion.a>
          )
        })}
      </div>

      {feed.items.length > maxVideos && (
        <a
          href={feed.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-accent hover:underline"
        >
          View all videos →
        </a>
      )}
    </div>
  )
}
