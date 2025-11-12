"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Loader2, FileText, Play, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { searchAllContent, type SearchResult } from "@/lib/search"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ContentCounts {
  blog: number
  podcast: number
  research: number
  total: number
}

interface GlobalSearchProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function GlobalSearch({ isOpen: externalIsOpen, onOpenChange }: GlobalSearchProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState<"all" | "blog" | "podcast" | "research">("all")
  const [totalCounts, setTotalCounts] = useState<ContentCounts>({ blog: 0, podcast: 0, research: 0, total: 0 })
  const [loadingCounts, setLoadingCounts] = useState(false)

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen

  useEffect(() => {
    if (isOpen && totalCounts.total === 0) {
      fetchTotalCounts()
    }
  }, [isOpen])

  const fetchTotalCounts = async () => {
    setLoadingCounts(true)
    try {
      const allResults = await searchAllContent("", "all")
      const counts = {
        blog: allResults.filter((r) => r.type === "blog").length,
        podcast: allResults.filter((r) => r.type === "podcast").length,
        research: allResults.filter((r) => r.type === "research").length,
        total: allResults.length,
      }
      setTotalCounts(counts)
    } catch (error) {
      // Silent error handling for production
    } finally {
      setLoadingCounts(false)
    }
  }

  const performSearch = useCallback(async (searchQuery: string, type: typeof contentType) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchAllContent(searchQuery, type)
      setResults(searchResults)
    } catch (error) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query, contentType)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, contentType, performSearch])

  // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "podcast":
        return <Play className="h-4 w-4" />
      case "research":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "podcast":
        return "Podcast"
      case "research":
        return "Research"
      default:
        return "Blog"
    }
  }

  const filteredResults = results.filter((result) => contentType === "all" || result.type === contentType)

  const blogCount = results.filter((r) => r.type === "blog").length
  const podcastCount = results.filter((r) => r.type === "podcast").length
  const researchCount = results.filter((r) => r.type === "research").length

  const getCountDisplay = (filtered: number, total: number, hasQuery: boolean) => {
    if (!hasQuery) {
      return total > 0 ? total : null
    }
    return filtered > 0 ? `${filtered}` : null
  }

  return (
    <>
      {externalIsOpen === undefined && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono sm:inline">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-[10%] z-50 w-full max-w-3xl -translate-x-1/2 rounded-2xl border border-border bg-card shadow-2xl max-h-[85vh] flex flex-col mx-4 sm:mx-0"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-border p-4">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles, podcasts, and research..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm sm:text-base"
                />
                {loading && <Loader2 className="h-5 w-5 animate-spin text-accent flex-shrink-0" />}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content Type Filter */}
              <div className="flex gap-2 border-b border-border p-3 sm:p-4 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setContentType("all")}
                  className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    contentType === "all"
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All
                  {loadingCounts ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    getCountDisplay(results.length, totalCounts.total, !!query) && (
                      <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs">
                        {getCountDisplay(results.length, totalCounts.total, !!query)}
                      </span>
                    )
                  )}
                </button>
                <button
                  onClick={() => setContentType("blog")}
                  className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    contentType === "blog"
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Blog
                  {loadingCounts ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    getCountDisplay(blogCount, totalCounts.blog, !!query) && (
                      <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs">
                        {getCountDisplay(blogCount, totalCounts.blog, !!query)}
                      </span>
                    )
                  )}
                </button>
                <button
                  onClick={() => setContentType("podcast")}
                  className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    contentType === "podcast"
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Podcast
                  {loadingCounts ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    getCountDisplay(podcastCount, totalCounts.podcast, !!query) && (
                      <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs">
                        {getCountDisplay(podcastCount, totalCounts.podcast, !!query)}
                      </span>
                    )
                  )}
                </button>
                <button
                  onClick={() => setContentType("research")}
                  className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    contentType === "research"
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Research
                  {loadingCounts ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    getCountDisplay(researchCount, totalCounts.research, !!query) && (
                      <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs">
                        {getCountDisplay(researchCount, totalCounts.research, !!query)}
                      </span>
                    )
                  )}
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto p-2">
                {query && !loading && filteredResults.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">0 results for &quot;{query}&quot;</p>
                  </div>
                )}

                {!query && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">Start typing to search...</p>
                    {!loadingCounts && totalCounts.total > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {totalCounts.total} items available ({totalCounts.blog} blog, {totalCounts.podcast} podcast,{" "}
                        {totalCounts.research} research)
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {filteredResults.map((result, index) => (
                    <Link
                      key={`search-result-${result.type}-${result.id}-${result.slug}-${index}`}
                      href={result.url}
                      onClick={() => setIsOpen(false)}
                      className="group block rounded-lg border border-transparent p-3 sm:p-4 transition-all hover:border-accent/50 hover:bg-muted/50"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {result.featuredImage && (
                          <div className="relative h-16 w-20 sm:h-16 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={result.featuredImage || "/placeholder.svg"}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                              {getIcon(result.type)}
                              {getTypeLabel(result.type)}
                            </Badge>
                            {result.themes.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {result.themes[0]}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-serif text-base sm:text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-accent line-clamp-2">
                            {result.title}
                          </h3>
                          <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">{result.excerpt}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border p-3 sm:p-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>
                    {query
                      ? `${filteredResults.length} ${filteredResults.length === 1 ? "result" : "results"}`
                      : `${totalCounts.total} items available`}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
