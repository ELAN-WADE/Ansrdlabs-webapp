"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, Search, Filter, BookOpen, Tag } from "lucide-react"
import { fetchAllPosts, fetchContentByTheme, getFormats, getMethods } from "@/lib/wordpress-graphql"
import { adaptPostFromGraphQL, type Post } from "@/lib/graphql-adapter"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function BlogArchive() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null) // Declare the variable here

  const [articles, setArticles] = useState<Post[]>([])
  const [themes, setThemes] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [formats, setFormats] = useState<Array<{ name: string; slug: string }>>([])
  const [methods, setMethods] = useState<Array<{ name: string; slug: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [postsData, themesData] = await Promise.all([
          fetchAllPosts({ first: 100 }),
          fetchContentByTheme({ first: 100 }),
        ])

        const uniquePostsData = Array.from(new Map(postsData.map((post) => [post.id, post])).values())

        const adaptedPosts = uniquePostsData.map(adaptPostFromGraphQL)
        setArticles(adaptedPosts)

        setThemes(themesData.map((t) => ({ id: t.id, name: t.name, slug: t.slug })))

        const formatsSet = new Set<string>()
        const methodsSet = new Set<string>()

        postsData.forEach((post) => {
          getFormats(post).forEach((f) => formatsSet.add(f))
          if ("methods" in post) {
            getMethods(post as any).forEach((m) => methodsSet.add(m))
          }
        })

        setFormats(Array.from(formatsSet).map((f) => ({ name: f, slug: f.toLowerCase().replace(/\s+/g, "-") })))
        setMethods(Array.from(methodsSet).map((m) => ({ name: m, slug: m.toLowerCase().replace(/\s+/g, "-") })))
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const articleThemes = article.themes || []
    const articleFormats = article.formats || []
    const articleMethods = article.methods || []

    const matchesTheme =
      !selectedTheme || articleThemes.some((t) => t.toLowerCase().includes(selectedTheme.toLowerCase()))
    const matchesFormat =
      !selectedFormat || articleFormats.some((f) => f.toLowerCase().replace(/\s+/g, "-") === selectedFormat)
    const matchesMethod =
      !selectedMethod || articleMethods.some((m) => m.toLowerCase().replace(/\s+/g, "-") === selectedMethod)

    return matchesSearch && matchesTheme && matchesFormat && matchesMethod
  })

  const uniqueFilteredArticles = Array.from(new Map(filteredArticles.map((article) => [article.id, article])).values())

  return (
    <div className="min-h-screen bg-background">
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
              Blog & Insights
            </div>
            <h1 className="font-serif text-6xl font-bold text-foreground">Blog</h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
              Insights, analysis, and stories exploring decision science and everyday life in African cities.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "Articles", value: articles.length },
                { label: "Themes", value: themes.length },
                { label: "Formats", value: formats.length },
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-surface p-6">
                  <div className="aspect-video w-full rounded-lg bg-surface-elevated" />
                  <div className="mt-4 h-4 w-20 rounded bg-surface-elevated" />
                  <div className="mt-4 h-6 w-full rounded bg-surface-elevated" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-surface-elevated" />
                </div>
              ))}
            </div>
          ) : uniqueFilteredArticles.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTheme}-${selectedSeries}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {uniqueFilteredArticles.map((article, index) => (
                  <motion.article
                    key={`blog-${article.slug}-${article.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative"
                  >
                    <Link href={`/blog/${article.slug}`}>
                      <div className="relative h-full overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
                        {article.featuredImage && (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={article.featuredImage || "/placeholder.svg"}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                          </div>
                        )}

                        <div className="p-6">
                          {article.themes && article.themes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {article.themes.slice(0, 2).map((theme, themeIndex) => (
                                <Badge
                                  key={`blog-${article.slug}-${article.id}-${theme}-${themeIndex}`}
                                  variant="secondary"
                                  className="bg-accent/10 text-accent border-accent/20"
                                >
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                            {article.title}
                          </h3>

                          {article.deckSubtitle && (
                            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground-muted">
                              {article.deckSubtitle}
                            </p>
                          )}

                          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4 text-xs text-foreground-subtle">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(article.date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.estimatedReadTime ? `${article.estimatedReadTime} min read` : "5 min read"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <BookOpen className="mx-auto h-16 w-16 text-foreground-subtle" />
              <p className="mt-4 text-lg text-foreground-muted">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedTheme(null)
                  setSelectedFormat(null)
                  setSelectedMethod(null)
                  setSearchQuery("")
                  setSelectedSeries(null) // Reset selectedSeries here
                }}
                className="mt-4 text-sm text-accent hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
