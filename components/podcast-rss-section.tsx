"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Play, Youtube } from "lucide-react"
import Image from "next/image"

interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  link: string
  pubDate: string
}

export function PodcastRSSSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    async function fetchYouTubeRSS() {
      try {
        setLoading(true)

        const response = await fetch("/api/youtube-rss")
        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.error?.includes("not configured")) {
            setIsConfigured(false)
            return
          }
          throw new Error(errorData.error || "Failed to fetch YouTube feed")
        }

        const data = await response.json()
        setVideos(data.videos || [])
        setIsConfigured(true)
      } catch (err) {
        setIsConfigured(false)
      } finally {
        setLoading(false)
      }
    }

    fetchYouTubeRSS()
  }, [])

  if (loading || !isConfigured || videos.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Youtube className="h-4 w-4" />
            YouTube Channel
          </div>
          <h2 className="font-serif text-4xl font-bold text-foreground">Watch on YouTube</h2>
          <p className="mt-4 text-lg text-foreground-muted">
            Subscribe to our channel for video episodes and behind-the-scenes content
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <motion.a
              key={video.id}
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group overflow-hidden rounded-xl border border-border bg-background shadow-md transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
            >
              <div className="relative aspect-video overflow-hidden bg-surface-elevated">
                <Image
                  src={video.thumbnail || "/placeholder.svg?height=360&width=640&query=youtube video"}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-full bg-accent p-4 shadow-2xl shadow-accent/50">
                    <Play className="h-8 w-8 fill-white text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
                  <Youtube className="inline h-3 w-3" /> YouTube
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold leading-tight text-foreground line-clamp-2 transition-colors group-hover:text-accent">
                  {video.title}
                </h3>
                <p className="mt-2 text-xs text-foreground-subtle">{video.pubDate}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={`https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "UCYourChannelID"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/40"
          >
            <Youtube className="h-5 w-5" />
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  )
}
