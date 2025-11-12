"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Rss, ExternalLink, Calendar, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail?: string
  category?: string
}

interface RSSFeedCardProps {
  feedUrl: string
  title: string
  description?: string
  maxItems?: number
}

export function RSSFeedCard({ feedUrl, title, description, maxItems = 5 }: RSSFeedCardProps) {
  const [items, setItems] = useState<RSSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRSS() {
      try {
        setLoading(true)
        setError(null)

        // Use RSS2JSON API or similar service to parse RSS
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=YOUR_API_KEY&count=${maxItems}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch RSS feed")
        }

        const data = await response.json()

        if (data.status === "ok") {
          setItems(data.items)
        } else {
          throw new Error(data.message || "Failed to parse RSS feed")
        }
      } catch (err) {
        console.error("[v0] RSS feed error:", err)
        setError("Failed to load RSS feed")
      } finally {
        setLoading(false)
      }
    }

    fetchRSS()
  }, [feedUrl, maxItems])

  if (loading) {
    return (
      <Card className="border-border/50 bg-surface/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-accent" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border/50 bg-surface/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5 text-accent" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-surface/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-accent" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg border border-border/50 bg-background p-4 transition-all hover:border-accent/50 hover:bg-surface"
              >
                <div className="flex gap-4">
                  {item.thumbnail && (
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-sm font-semibold leading-tight text-foreground group-hover:text-accent">
                        {item.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-foreground-subtle" />
                    </div>
                    {item.description && (
                      <p className="line-clamp-2 text-xs text-foreground-muted">
                        {item.description.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-foreground-subtle">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
