"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Play, FileText, BookOpen, Calendar, Filter, Loader2, Search } from "lucide-react"
import Image from "next/image"
import { fetchAllResearch, fetchAllPodcasts } from "@/lib/wordpress-graphql"
import { adaptResearchFromGraphQL, adaptPodcastFromGraphQL } from "@/lib/graphql-adapter"

type ContentItem = {
  id: string
  title: string
  excerpt: string
  slug: string
  date: string
  featuredImage?: string
  format?: string
  themes?: string[]
  methods?: string[]
}

export function ThemeArchive({ slug }: { slug: string }) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<"all" | "podcast" | "research" | "blog">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [researchData, podcastData] = await Promise.all([fetchAllResearch(), fetchAllPodcasts()])

        const uniqueResearchData = Array.from(new Map(researchData.map((r) => [r.id, r])).values())
        const uniquePodcastData = Array.from(new Map(podcastData.map((p) => [p.id, p])).values())

        const researchItems: ContentItem[] = uniqueResearchData.map((r) => {
          const adapted = adaptResearchFromGraphQL(r)
          return {
            id: adapted.id,
            title: adapted.title,
            excerpt: adapted.abstract || adapted.excerpt || "",
            slug: adapted.slug,
            date: adapted.date,
            featuredImage: adapted.featuredImage,
            format: "research",
            themes: adapted.series,
            methods: adapted.methods,
          }
        })

        const podcastItems: ContentItem[] = uniquePodcastData.map((p) => {
          const adapted = adaptPodcastFromGraphQL(p)
          return {
            id: adapted.id,
            title: adapted.title,
            excerpt: adapted.excerpt || "",
            slug: adapted.slug,
            date: adapted.date,
            featuredImage: adapted.featuredImage,
            format: "podcast",
            themes: adapted.series,
            methods: [],
          }
        })

        const allContent = [...researchItems, ...podcastItems].filter((item) =>
          item.themes?.some((theme) => theme.toLowerCase().includes(slug.toLowerCase())),
        )

        setContent(allContent)
      } catch (error) {
        console.error("[v0] Error loading theme archive:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  const currentTheme = {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: "Explore our research and insights on this theme.",
    slug: slug,
    count: content.length,
  }

  const filteredContent = content.filter((item) => {
    const matchesType = selectedType === "all" || item.format === selectedType

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesType && matchesSearch
  })

  const getTypeIcon = (type: string | undefined) => {
    if (!type) return FileText

    switch (type.toLowerCase()) {
      case "podcast":
      case "episode":
        return Play
      case "research":
      case "brief":
      case "report":
        return FileText
      case "blog":
      case "post":
      case "article":
        return BookOpen
      default:
        return FileText
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-accent/5 via-background to-background py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-6 py-2.5 backdrop-blur-sm">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Theme</span>
            </div>
            <h1 className="font-serif text-5xl font-bold text-foreground lg:text-6xl">{currentTheme.name}</h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground-muted">{currentTheme.description}</p>

            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{content.length}</div>
                <div className="text-sm text-foreground-subtle">Total Items</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-12 max-w-4xl space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-subtle" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface/50 py-3 pl-12 pr-4 backdrop-blur-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Filter className="h-4 w-4 text-foreground-subtle" />
              {[
                { value: "all", label: "All Content" },
                { value: "podcast", label: "Podcasts" },
                { value: "research", label: "Research" },
                { value: "blog", label: "Articles" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSelectedType(value as any)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    selectedType === value
                      ? "bg-accent text-white shadow-lg shadow-accent/25"
                      : "border border-border bg-surface/50 text-foreground-muted backdrop-blur-sm hover:border-accent/50 hover:bg-surface"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {filteredContent.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item, index) => {
                const Icon = getTypeIcon(item.format)
                const formatDisplay = item.format || "Article"

                return (
                  <motion.article
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <Link href={`/${formatDisplay.toLowerCase()}/${item.slug}`}>
                      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
                        {item.featuredImage && (
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={item.featuredImage || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                          </div>
                        )}

                        <div className="p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                              <Icon className="h-3 w-3" />
                              {formatDisplay}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-foreground-subtle">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="mb-2 font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent">
                            {item.title}
                          </h3>

                          <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">{item.excerpt}</p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.themes && item.themes.length > 0 && (
                              <>
                                {item.themes.slice(0, 2).map((theme) => (
                                  <span
                                    key={theme}
                                    className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </>
                            )}
                            {item.methods && item.methods.length > 0 && (
                              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground-muted">
                                {item.methods[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                )
              })}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface/50 p-12 backdrop-blur-sm">
                <FileText className="mx-auto mb-4 h-12 w-12 text-foreground-subtle" />
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">No content found</h3>
                <p className="text-sm text-foreground-muted">Try adjusting your filters or search query.</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
