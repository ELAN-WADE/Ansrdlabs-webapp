"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Loader2, Tag, BookOpen } from "lucide-react"
import { fetchAllEpisodes, fetchContentByTheme, getFormats, getMethods } from "@/lib/wordpress-graphql"
import { adaptEpisodeFromGraphQL, type Episode } from "@/lib/graphql-adapter"

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .trim()
}

export function PodcastArchive() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [themes, setThemes] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [formats, setFormats] = useState<Array<{ name: string; slug: string }>>([])
  const [methods, setMethods] = useState<Array<{ name: string; slug: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const [episodesData, themesData] = await Promise.all([
          fetchAllEpisodes({ first: 100 }),
          fetchContentByTheme({ first: 100 }),
        ])

        const uniqueEpisodesData = Array.from(new Map(episodesData.map((ep) => [ep.id, ep])).values())
        const adaptedEpisodes = uniqueEpisodesData.map(adaptEpisodeFromGraphQL)
        setEpisodes(adaptedEpisodes)

        setThemes(themesData.map((t) => ({ id: t.id, name: t.name, slug: t.slug })))

        const formatsSet = new Set<string>()
        const methodsSet = new Set<string>()

        episodesData.forEach((episode) => {
          getFormats(episode).forEach((f) => formatsSet.add(f))
          if ("methods" in episode) {
            getMethods(episode as any).forEach((m) => methodsSet.add(m))
          }
        })

        setFormats(Array.from(formatsSet).map((f) => ({ name: f, slug: f.toLowerCase().replace(/\s+/g, "-") })))
        setMethods(Array.from(methodsSet).map((m) => ({ name: m, slug: m.toLowerCase().replace(/\s+/g, "-") })))
      } catch (error) {
        setError("Failed to load podcast episodes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesSearch =
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const episodeThemes = episode.themes || []
    const episodeFormats = episode.formats || []
    const episodeMethods = episode.methods || []

    const matchesTheme =
      !selectedTheme || episodeThemes.some((t) => t.toLowerCase().includes(selectedTheme.toLowerCase()))
    const matchesFormat =
      !selectedFormat || episodeFormats.some((f) => f.toLowerCase().replace(/\s+/g, "-") === selectedFormat)
    const matchesMethod =
      !selectedMethod || episodeMethods.some((m) => m.toLowerCase().replace(/\s+/g, "-") === selectedMethod)

    return matchesSearch && matchesTheme && matchesFormat && matchesMethod
  })

  const uniqueFilteredEpisodes = Array.from(new Map(filteredEpisodes.map((episode) => [episode.id, episode])).values())
  const featuredEpisodes = uniqueFilteredEpisodes.slice(0, 3)
  const olderEpisodes = uniqueFilteredEpisodes.slice(3)

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-surface via-background to-surface py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,175,63,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,175,63,0.05),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent backdrop-blur-sm">
              <BookOpen className="h-4 w-4" />
              Podcast Library
            </div>
            <h1 className="font-serif text-6xl font-bold text-foreground">Podcast</h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
              Stories from the field exploring everyday decisions in African cities. Subscribe on your favorite
              platform.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "Episodes", value: episodes.length },
                { label: "Themes", value: themes.length },
                { label: "Series", value: formats.length },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="rounded-xl border border-border/50 bg-surface/50 p-4 backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-foreground-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-12 max-w-4xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-subtle" />
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => {
                  if (window.innerWidth < 1024) {
                    e.target.blur()
                    setIsSearchModalOpen(true)
                  }
                }}
                className="w-full rounded-xl border border-border/50 bg-surface/80 py-4 pl-12 pr-4 text-foreground backdrop-blur-sm placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="mt-6 space-y-4 rounded-xl border border-border/50 bg-surface/80 p-6 backdrop-blur-sm">
              {/* Theme Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag className="h-4 w-4" />
                  Theme
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTheme(null)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedTheme === null
                        ? "bg-accent text-white shadow-lg shadow-accent/20"
                        : "border border-border bg-background text-foreground-muted hover:border-accent/50 hover:bg-surface"
                    }`}
                  >
                    All Themes
                  </button>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.slug)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedTheme === theme.slug
                          ? "bg-accent text-white shadow-lg shadow-accent/20"
                          : "border border-border bg-background text-foreground-muted hover:border-accent/50 hover:bg-surface"
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Filter */}
              {formats.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Filter className="h-4 w-4" />
                    Format
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedFormat(null)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedFormat === null
                          ? "bg-accent text-white shadow-lg shadow-accent/20"
                          : "border border-border bg-background text-foreground-muted hover:border-accent/50 hover:bg-surface"
                      }`}
                    >
                      All Formats
                    </button>
                    {formats.map((format) => (
                      <button
                        key={format.name}
                        onClick={() => setSelectedFormat(format.slug)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          selectedFormat === format.slug
                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                            : "border border-border bg-background text-foreground-muted hover:border-accent/50 hover:bg-surface"
                        }`}
                      >
                        {format.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Methods Filter */}
              {methods.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Filter className="h-4 w-4" />
                    Research Methods
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMethod(null)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedMethod === null
                          ? "bg-accent text-white shadow-lg shadow-accent/20"
                          : "border border-border bg-background text-foreground-muted hover:border-accent/50 hover:bg-surface"
                      }`}
                    >
                      All Methods
                    </button>
                    {methods.map((method) => (
                      <button
                        key={method.name}
                        onClick={() => setSelectedMethod(method.slug)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          selectedMethod === method.slug
                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                            : "border border-border bg-background text-foreground-muted hover:border-accent/50 hover:bg-surface"
                        }`}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
            >
              {error}
            </motion.div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
            <p className="mt-4 text-foreground-muted">Loading episodes...</p>
          </div>
        </section>
      )}

      {/* Featured Episodes */}
      {!loading && featuredEpisodes.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">Latest Episodes</h2>
            <div className="grid gap-8 lg:grid-cols-3">
              <AnimatePresence mode="wait">
                {featuredEpisodes.map((episode, index) => (
                  <motion.article
                    key={`featured-${episode.slug}-${episode.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/podcast/${episode.slug}`}>
                      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-accent/20">
                        <Image
                          src={episode.featuredImage || "/placeholder.svg?height=400&width=600&query=podcast episode"}
                          alt={episode.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-2">
                          {episode.themes && episode.themes.length > 0 && (
                            <>
                              {episode.themes.slice(0, 2).map((theme, themeIndex) => (
                                <span
                                  key={`featured-${episode.slug}-${episode.id}-${theme}-${themeIndex}`}
                                  className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-lg"
                                >
                                  {theme}
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                          {episode.title}
                        </h3>
                        {episode.deckSubtitle && (
                          <p className="mt-2 text-sm leading-relaxed text-foreground-muted line-clamp-2">
                            {episode.deckSubtitle}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Older Episodes */}
      {!loading && olderEpisodes.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">More Episodes</h2>
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {olderEpisodes.map((episode, index) => (
                  <motion.article
                    key={`older-${episode.slug}-${episode.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/podcast/${episode.slug}`}>
                      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-md transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 md:flex-row">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            {episode.themes && episode.themes.length > 0 && (
                              <>
                                {episode.themes.slice(0, 2).map((theme, themeIndex) => (
                                  <span
                                    key={`older-${episode.slug}-${episode.id}-${theme}-${themeIndex}`}
                                    className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                            {episode.title}
                          </h3>
                          {episode.deckSubtitle && (
                            <p className="mt-3 text-sm leading-relaxed text-foreground-muted line-clamp-2">
                              {episode.deckSubtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && uniqueFilteredEpisodes.length === 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <p className="text-lg text-foreground-muted">No episodes found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedTheme(null)
                setSelectedFormat(null)
                setSelectedMethod(null)
              }}
              className="mt-4 text-accent hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
