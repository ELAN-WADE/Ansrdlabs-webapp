"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Share2,
  Clock,
  Calendar,
  Tag,
  Loader2,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { fetchEpisodeBySlugGraphQL, formatDate } from "@/lib/wordpress-graphql"
import { adaptEpisodeFromGraphQL, type FrontendEpisode } from "@/lib/graphql-adapter"
import { sharePDF, generateShareLinks } from "@/lib/pdf-utils"
import { Badge } from "@/components/ui/badge"

interface PodcastData {
  id: number
  title: string
  description: string
  duration: string
  theme: string
  themeColor: string
  image: string
  date: string
  audioUrl: string
  videoUrl?: string
  showNotes: string
  transcript: Array<{ time: string; text: string; seconds: number }>
  sources: Array<{ title: string; url: string }>
  relatedContent: Array<{ type: string; title: string; href: string }>
}

const fallbackData: PodcastData = {
  id: 1,
  title: "The Hidden Economics of Okada Bans",
  description: "Exploring how motorcycle taxi bans reshape urban mobility and livelihoods in Lagos.",
  duration: "42 min",
  theme: "Transport",
  themeColor: "transport",
  image: "/podcast-setup.png",
  date: "Jan 15, 2025",
  audioUrl: "",
  videoUrl: "",
  showNotes:
    "In this episode, we dive deep into the economic ripple effects of Lagos's motorcycle taxi (okada) bans. Through interviews with riders, passengers, and policy experts, we explore how these regulations reshape daily life, income strategies, and urban mobility patterns.\n\nKey topics covered:\n• The history of okada regulation in Lagos\n• Economic impact on informal workers\n• Alternative mobility strategies\n• Policy implications and recommendations",
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .trim()
}

function cleanShowNotes(html: string): string {
  if (!html) return ""

  const cleaned = html
    // Remove Simple Podcast sections
    .replace(/<div[^>]*class="[^"]*ssp-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    // Remove Share section with embed codes
    .replace(/<div[^>]*class="[^"]*share[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    // Remove "Download file | Play in new window" text and metadata
    .replace(/Download file \| Play in new window.*?(?=<|$)/gi, "")
    .replace(/Duration:.*?Recorded on.*?\d{4}/gi, "")
    // Remove blockquote embed codes
    .replace(/<blockquote[^>]*class="wp-embedded-content"[^>]*>[\s\S]*?<\/blockquote>/gi, "")
    // Remove iframe embed codes
    .replace(/<iframe[^>]*class="wp-embedded-content"[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<iframe[^>]*sandbox="allow-scripts"[^>]*>[\s\S]*?<\/iframe>/gi, "")
    // Remove script tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove RSS Feed section and links
    .replace(/RSS Feed.*?https?:\/\/ansrdlabs\.com\/feed\/podcast\/[^\s<]*/gi, "")
    .replace(/RSS Feed/gi, "")
    // Remove Share links and embed codes
    .replace(/Share.*?Link.*?https?:\/\/ansrdlabs\.com\/episodes\/[^\s<]*/gi, "")
    .replace(/Share.*?Embed[\s\S]*?<blockquote/gi, "<blockquote")
    .replace(/\|\s*Duration:.*$/gim, "")
    .replace(/\|\s*Play in new window.*$/gim, "")
    // Remove empty paragraphs and divs
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<div>\s*<\/div>/gi, "")
    .replace(/<span>\s*<\/span>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim()

  return cleaned
}

function extractSubtitleFromContent(content: string): string | null {
  if (!content) return null

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "").trim()

  // The subtitle is typically the first paragraph or sentence
  // Split by double line breaks or periods followed by space
  const paragraphs = text.split(/\n\n+/)

  if (paragraphs.length > 0 && paragraphs[0].length > 20 && paragraphs[0].length < 500) {
    return paragraphs[0].trim()
  }

  return null
}

export function PodcastDetail({ id }: { id: string }) {
  const [podcast, setPodcast] = useState<FrontendEpisode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [activeTab, setActiveTab] = useState<"notes" | "transcript" | "sources">("notes")
  const [sharing, setSharing] = useState(false)
  const [shareLinks, setShareLinks] = useState<ReturnType<typeof generateShareLinks> | null>(null)
  const [actualAudioUrl, setActualAudioUrl] = useState<string | null>(null)
  const [audioLoading, setAudioLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    async function loadPodcast() {
      try {
        setLoading(true)
        setError(null)
        const episode = await fetchEpisodeBySlugGraphQL(id)

        if (episode) {
          const podcastData = adaptEpisodeFromGraphQL(episode)
          if (!podcastData.deckSubtitle && episode.content) {
            podcastData.deckSubtitle = extractSubtitleFromContent(episode.content)
          }
          setPodcast(podcastData)
        } else {
          setPodcast({
            id: "1",
            slug: "fallback",
            title: fallbackData.title,
            date: fallbackData.date,
            excerpt: fallbackData.description,
            content: fallbackData.description,
            featuredImage: fallbackData.image,
            episodeNumber: 1,
            duration: fallbackData.duration,
            audioUrl: fallbackData.audioUrl,
            videoUrl: fallbackData.videoUrl,
            showNotes: fallbackData.showNotes,
            transcript: null,
            coverImage: null,
            youtubeVideoId: null,
            sources: [],
            formats: [],
            series: [fallbackData.theme],
            themes: [fallbackData.theme],
          })
        }
      } catch (error) {
        setError("Failed to load podcast. Please try again later.")
        setPodcast({
          id: "1",
          slug: "fallback",
          title: fallbackData.title,
          date: fallbackData.date,
          excerpt: fallbackData.description,
          content: fallbackData.description,
          featuredImage: fallbackData.image,
          episodeNumber: 1,
          duration: fallbackData.duration,
          audioUrl: fallbackData.audioUrl,
          videoUrl: fallbackData.videoUrl,
          showNotes: fallbackData.showNotes,
          transcript: null,
          coverImage: null,
          youtubeVideoId: null,
          sources: [],
          formats: [],
          series: [fallbackData.theme],
          themes: [fallbackData.theme],
        })
      } finally {
        setLoading(false)
      }
    }

    loadPodcast()
  }, [id])

  useEffect(() => {
    if (podcast) {
      const links = generateShareLinks(typeof window !== "undefined" ? window.location.href : "", podcast.title)
      setShareLinks(links)
    }
  }, [podcast])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  useEffect(() => {
    async function parseRSSFeed() {
      if (!podcast?.audioUrl) return

      const isDirectAudio = /\.(mp3|m4a|wav|ogg)(\?.*)?$/i.test(podcast.audioUrl)

      if (isDirectAudio) {
        setActualAudioUrl(podcast.audioUrl)
        return
      }

      if (
        podcast.audioUrl.includes(".rss") ||
        podcast.audioUrl.includes("feeds.") ||
        podcast.audioUrl.includes("/feed/")
      ) {
        setAudioLoading(true)
        try {
          const response = await fetch(`/api/parse-rss?url=${encodeURIComponent(podcast.audioUrl)}`)

          if (!response.ok) {
            const errorData = await response.json()
            setError(`Could not load audio: ${errorData.error || "RSS feed parsing failed"}`)
            setAudioLoading(false)
            return
          }

          const data = await response.json()

          if (data.audioUrl) {
            setActualAudioUrl(data.audioUrl)
          } else {
            setError("Could not find audio file in RSS feed")
          }
        } catch (error) {
          setError("Failed to load audio from RSS feed")
        } finally {
          setAudioLoading(false)
        }
      } else {
        setActualAudioUrl(podcast.audioUrl)
      }
    }

    parseRSSFeed()
  }, [podcast?.audioUrl])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        if (!actualAudioUrl) {
          setError("Audio file not available")
          return
        }
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            setError("Failed to play audio. Please try again.")
            setIsPlaying(false)
          })
      }
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleShare = async () => {
    if (!podcast) return

    setSharing(true)
    try {
      const result = await sharePDF(podcast.title, typeof window !== "undefined" ? window.location.href : "")
      if (result?.message) {
        alert(result.message)
      }
    } catch (error) {
    } finally {
      setSharing(false)
    }
  }

  const handleDownload = () => {
    if (!actualAudioUrl) {
      setError("Audio file not available for download")
      return
    }

    const a = document.createElement("a")
    a.href = actualAudioUrl
    a.download = `${podcast?.title?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "podcast"}.mp3`
    a.target = "_blank"
    a.rel = "noopener noreferrer"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (loading || !podcast) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
          <p className="mt-4 text-foreground-muted">Loading episode...</p>
        </div>
      </div>
    )
  }

  const episodeImage = podcast.coverImage || podcast.featuredImage || "/podcast-setup.png"

  const videoEmbedUrl = podcast.youtubeVideoId
    ? `https://www.youtube.com/embed/${podcast.youtubeVideoId}`
    : podcast.videoUrl

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  const displayTitle = podcast?.title?.trim() || ""

  return (
    <div className="min-h-screen bg-background">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border bg-red-50 p-4"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-accent/5 via-background to-background">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative aspect-[4/3] max-h-[400px] overflow-hidden rounded-3xl border border-border/50 shadow-2xl shadow-accent/10">
                <Image src={episodeImage || "/placeholder.svg"} alt={podcast.title} fill className="object-cover" />
              </div>

              {podcast.audioUrl && (
                <div className="rounded-2xl border border-border/50 bg-surface/80 p-6 backdrop-blur-xl">
                  {actualAudioUrl ? (
                    <audio ref={audioRef} src={actualAudioUrl} />
                  ) : audioLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-accent" />
                      <span className="ml-2 text-sm text-foreground-muted">Loading audio...</span>
                    </div>
                  ) : null}

                  <div className="mb-6">
                    <div className="relative h-2 w-full overflow-visible rounded-full bg-surface-elevated shadow-inner">
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-accent via-accent to-accent/90 shadow-sm"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${progressPercentage}%`,
                        }}
                        transition={{ duration: 0.1, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-accent shadow-lg shadow-accent/50 ring-4 ring-background cursor-pointer hover:scale-125 transition-transform z-10"
                        initial={{ left: "0%" }}
                        animate={{
                          left: `${progressPercentage}%`,
                          scale: isPlaying ? [1, 1.15, 1] : 1,
                        }}
                        transition={{
                          left: { duration: 0.1, ease: "linear" },
                          scale: {
                            duration: 0.6,
                            repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                            ease: "easeInOut",
                          },
                        }}
                        style={{ marginLeft: "-8px" }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        disabled={!actualAudioUrl}
                        aria-label="Seek audio"
                      />
                    </div>
                    <div className="mt-3 flex justify-between text-sm font-medium text-foreground-subtle">
                      <span>{formatTime(currentTime)}</span>
                      <span>{duration > 0 ? formatTime(duration) : podcast.duration || "0:00"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={skipBackward}
                        className="rounded-full p-3 transition-all hover:bg-surface-elevated hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Skip backward 15 seconds"
                        disabled={!actualAudioUrl}
                      >
                        <SkipBack className="h-5 w-5" />
                      </button>
                      <button
                        onClick={togglePlay}
                        className="rounded-full bg-accent p-5 shadow-lg shadow-accent/25 transition-all hover:scale-110 hover:shadow-xl hover:shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={isPlaying ? "Pause" : "Play"}
                        disabled={!actualAudioUrl || audioLoading}
                      >
                        {audioLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                        ) : isPlaying ? (
                          <Pause className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 fill-white text-white" />
                        )}
                      </button>
                      <button
                        onClick={skipForward}
                        className="rounded-full p-3 transition-all hover:bg-surface-elevated hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Skip forward 15 seconds"
                        disabled={!actualAudioUrl}
                      >
                        <SkipForward className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-accent" />
                      <div className="relative h-2.5 w-32 overflow-hidden rounded-full bg-surface-elevated shadow-inner">
                        <div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-150 rounded-full shadow-sm"
                          style={{ width: `${volume * 100}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="Volume"
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground-subtle w-12 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {actualAudioUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface/80 px-4 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10 hover:scale-105 active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    Download Audio
                  </button>
                )}
                {!actualAudioUrl && audioLoading && (
                  <button
                    disabled
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface/80 px-4 py-3 text-sm font-medium backdrop-blur-sm opacity-50 cursor-not-allowed"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </button>
                )}
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/50 bg-surface/80 px-4 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sharing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {podcast.themes && podcast.themes.length > 0 && (
                  <>
                    {podcast.themes.map((theme) => (
                      <span
                        key={theme}
                        className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"
                      >
                        <Tag className="h-4 w-4" />
                        {theme}
                      </span>
                    ))}
                  </>
                )}
                {podcast.series.map((series) => (
                  <Badge key={series} variant="outline" className="border-accent/30 text-accent">
                    {series}
                  </Badge>
                ))}
                {podcast.formats.map((format) => (
                  <Badge key={format} variant="secondary">
                    {format}
                  </Badge>
                ))}
                {(podcast.duration || duration > 0) && (
                  <span className="flex items-center gap-2 text-sm text-foreground-subtle">
                    <Clock className="h-4 w-4" />
                    {duration > 0 ? formatTime(duration) : podcast.duration}
                  </span>
                )}
                <span className="flex items-center gap-2 text-sm text-foreground-subtle">
                  <Calendar className="h-4 w-4" />
                  {formatDate(podcast.date)}
                </span>
              </div>

              {podcast.episodeNumber && (
                <div className="mb-2 text-sm font-medium text-accent">Episode {podcast.episodeNumber}</div>
              )}

              <h1 className="font-serif text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                {displayTitle}
              </h1>

              {podcast.deckSubtitle && (
                <div className="mt-6 border-l-4 border-accent pl-6 text-xl leading-relaxed text-foreground-muted italic">
                  {podcast.deckSubtitle}
                </div>
              )}

              {podcast.excerpt && podcast.excerpt !== podcast.deckSubtitle && (
                <div className="mt-4 text-lg leading-relaxed text-foreground-muted">
                  {stripHtmlTags(podcast.excerpt)}
                </div>
              )}

              {videoEmbedUrl && (
                <div className="mt-10">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                    <Play className="h-4 w-4 text-accent" />
                    Watch Video
                  </h3>
                  <div className="aspect-video overflow-hidden rounded-2xl border border-border/50 shadow-xl">
                    <iframe
                      src={videoEmbedUrl}
                      title={podcast.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex gap-6 border-b border-border/50">
            <button
              onClick={() => setActiveTab("notes")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "notes"
                  ? "border-b-2 border-accent text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Show Notes
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "transcript"
                  ? "border-b-2 border-accent text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab("sources")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "sources"
                  ? "border-b-2 border-accent text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Sources
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {activeTab === "notes" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg prose-invert max-w-none"
                >
                  {podcast.showNotes ? (
                    <div
                      className="prose prose-lg prose-invert max-w-none [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:text-foreground-muted [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:text-foreground-muted [&_li]:leading-relaxed [&_a]:text-accent [&_a]:underline hover:[&_a]:text-accent/80 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_strong]:text-foreground [&_strong]:font-semibold [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: cleanShowNotes(podcast.showNotes) }}
                    />
                  ) : (
                    <p className="text-foreground-muted">Show notes not available for this episode.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "transcript" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-invert max-w-none"
                >
                  {podcast.transcript ? (
                    <div
                      className="whitespace-pre-line leading-relaxed text-foreground-muted"
                      dangerouslySetInnerHTML={{ __html: podcast.transcript }}
                    />
                  ) : (
                    <p className="text-sm text-foreground-muted">Transcript not available for this episode.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "sources" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {podcast.sources && podcast.sources.length > 0 ? (
                    podcast.sources.map((source, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border/50 bg-surface/80 p-4 transition-all hover:border-accent/50 hover:bg-surface"
                      >
                        <p className="text-foreground leading-relaxed">{source.title}</p>
                        <a href={source.url} className="text-accent underline">
                          Link
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-foreground-muted">No sources available for this episode.</p>
                  )}
                </motion.div>
              )}
            </div>

            <div>
              {shareLinks && (
                <div className="rounded-xl border border-border bg-surface p-6">
                  <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Share</h3>
                  <div className="space-y-2">
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Twitter
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </a>
                    <a
                      href={shareLinks.email}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
