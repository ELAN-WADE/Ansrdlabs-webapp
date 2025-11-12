"use client"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle, Play } from "lucide-react"
import Image from "next/image"

interface YouTubeItem {
  id: string
  title: string
  description: string
  thumbnail: string
  link: string
  pubDate: string
}

interface YouTubeRSSFeedProps {
  channelId: string
  maxItems?: number
}

export function YouTubeRSSFeed({ channelId, maxItems = 6 }: YouTubeRSSFeedProps) {
  const [items, setItems] = useState<YouTubeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchYouTubeRSS() {
      try {
        setLoading(true)
        setError(null)

        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`

        const response = await fetch(proxyUrl)

        if (!response.ok) {
          throw new Error("Failed to fetch YouTube feed")
        }

        const data = await response.json()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data.contents, "text/xml")

        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
          throw new Error("Invalid YouTube feed format")
        }

        const items: YouTubeItem[] = []
        const entryElements = xmlDoc.getElementsByTagName("entry")

        for (let i = 0; i < Math.min(entryElements.length, maxItems); i++) {
          const entry = entryElements[i]
          const title = entry.getElementsByTagName("title")[0]?.textContent || "Untitled"
          const link = entry.getElementsByTagName("link")[0]?.getAttribute("href") || ""
          const description = entry.getElementsByTagName("summary")[0]?.textContent || ""
          const pubDate = entry.getElementsByTagName("published")[0]?.textContent || ""
          const thumbnail = entry.getElementsByTagName("media:thumbnail")[0]?.getAttribute("url") || ""
          const videoId = entry.getElementsByTagName("yt:videoId")[0]?.textContent || ""

          items.push({
            id: videoId,
            title,
            description: description.substring(0, 150),
            thumbnail,
            link,
            pubDate: new Date(pubDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          })
        }

        setItems(items)
        console.log("[v0] Loaded YouTube feed with", items.length, "videos")
      } catch (err) {
        console.error("[v0] Error loading YouTube feed:", err)
        setError(err instanceof Error ? err.message : "Failed to load YouTube feed")
      } finally {
        setLoading(false)
      }
    }

    if (channelId) {
      fetchYouTubeRSS()
    }
  }, [channelId, maxItems])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-2 text-sm text-foreground-muted">Loading YouTube videos...</p>
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

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-foreground-muted">No YouTube videos found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-accent/50 hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-surface-elevated">
            {item.thumbnail && (
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-12 w-12 fill-white text-white" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-serif font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {item.title}
            </h3>
            <p className="mt-2 text-xs text-foreground-subtle">{item.pubDate}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
