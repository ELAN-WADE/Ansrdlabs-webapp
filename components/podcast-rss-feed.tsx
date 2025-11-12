"use client"

import { useEffect, useState } from "react"
import { Loader2, AlertCircle, Download, ExternalLink } from "lucide-react"

interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  enclosure?: {
    url: string
    type: string
    length: string
  }
}

interface PodcastRSSFeedProps {
  feedUrl: string
  maxItems?: number
}

export function PodcastRSSFeed({ feedUrl, maxItems = 10 }: PodcastRSSFeedProps) {
  const [items, setItems] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRSSFeed() {
      try {
        setLoading(true)
        setError(null)

        // Use CORS proxy for RSS feeds
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`
        const response = await fetch(proxyUrl)

        if (!response.ok) {
          throw new Error("Failed to fetch RSS feed")
        }

        const data = await response.json()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data.contents, "text/xml")

        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
          throw new Error("Invalid RSS feed format")
        }

        const items: RSSItem[] = []
        const itemElements = xmlDoc.getElementsByTagName("item")

        for (let i = 0; i < Math.min(itemElements.length, maxItems); i++) {
          const item = itemElements[i]
          const title = item.getElementsByTagName("title")[0]?.textContent || "Untitled"
          const link = item.getElementsByTagName("link")[0]?.textContent || ""
          const description = item.getElementsByTagName("description")[0]?.textContent || ""
          const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || ""
          const enclosure = item.getElementsByTagName("enclosure")[0]

          items.push({
            title,
            link,
            description: description.replace(/<[^>]*>/g, "").substring(0, 200),
            pubDate: new Date(pubDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            enclosure: enclosure
              ? {
                  url: enclosure.getAttribute("url") || "",
                  type: enclosure.getAttribute("type") || "",
                  length: enclosure.getAttribute("length") || "",
                }
              : undefined,
          })
        }

        setItems(items)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load RSS feed")
      } finally {
        setLoading(false)
      }
    }

    if (feedUrl) {
      fetchRSSFeed()
    }
  }, [feedUrl, maxItems])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-2 text-sm text-foreground-muted">Loading podcast feed...</p>
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
        <p className="text-foreground-muted">No podcast episodes found in feed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-border bg-surface p-6 hover:border-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-foreground-muted line-clamp-2">{item.description}</p>
              <p className="mt-3 text-xs text-foreground-subtle">{item.pubDate}</p>
            </div>
            <div className="flex gap-2">
              {item.enclosure && (
                <a
                  href={item.enclosure.url}
                  download
                  className="rounded-lg border border-border bg-background p-2 hover:bg-surface transition-colors"
                  title="Download episode"
                >
                  <Download className="h-4 w-4" />
                </a>
              )}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-background p-2 hover:bg-surface transition-colors"
                title="Open episode"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
