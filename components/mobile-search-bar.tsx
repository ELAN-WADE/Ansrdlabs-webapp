"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Loader2, FileText, Play, BookOpen, ChevronDown } from "lucide-react"
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

export function MobileSearchBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState<"all" | "blog" | "podcast" | "research">("all")
  const [totalCounts, setTotalCounts] = useState<ContentCounts>({ blog: 0, podcast: 0, research: 0, total: 0 })
  const [loadingCounts, setLoadingCounts] = useState(false)

  useEffect(() => {
    if (isExpanded && totalCounts.total === 0) {
      fetchTotalCounts()
    }
  }, [isExpanded])

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
      // Silent error handling
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false)
        setQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isExpanded])

  const handleClear = () => {
    setQuery("")
    setResults([])
  }

  const handleClose = () => {
    setIsExpanded(false)
    setQuery("")
    setResults([])
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "podcast":
        return <Play className="h-3 w-3" />
      case "research":
        return <FileText className="h-3 w-3" />
      default:
        return <BookOpen className="h-3 w-3" />
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
      <div className="lg:hidden border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search podcasts, research, blog posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full rounded-full border border-border bg-background/50 py-3 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            />
            {query ? (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              isExpanded && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close search"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              )
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border bg-background overflow-hidden"
            >
              {/* Content Type Filter */}
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-b border-border">
                <button
                  onClick={() => setContentType("all")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
                      <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                        {getCountDisplay(results.length, totalCounts.total, !!query)}
                      </span>
                    )
                  )}
                </button>
                <button
                  onClick={() => setContentType("blog")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
                      <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                        {getCountDisplay(blogCount, totalCounts.blog, !!query)}
                      </span>
                    )
                  )}
                </button>
                <button
                  onClick={() => setContentType("podcast")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
                      <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                        {getCountDisplay(podcastCount, totalCounts.podcast, !!query)}
                      </span>
                    )
                  )}
                </button>
                <button
                  onClick={() => setContentType("research")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
                      <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                        {getCountDisplay(researchCount, totalCounts.research, !!query)}
                      </span>
                    )
                  )}
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {loading && (
                  <div className="py-8 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
                    <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
                  </div>
                )}

                {!loading && query && filteredResults.length === 0 && (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">No results for &quot;{query}&quot;</p>
                  </div>
                )}

                {!loading && !query && (
                  <div className="py-8 text-center">
                    <Search className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">Start typing to search...</p>
                    {!loadingCounts && totalCounts.total > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">{totalCounts.total} items available</p>
                    )}
                  </div>
                )}

                {!loading && filteredResults.length > 0 && (
                  <div className="space-y-2">
                    {filteredResults.map((result, index) => (
                      <Link
                        key={`mobile-search-${result.type}-${result.id}-${result.slug}-${index}`}
                        href={result.url}
                        onClick={handleClose}
                        className="group block rounded-lg border border-transparent p-3 transition-all hover:border-accent/50 hover:bg-muted/50"
                      >
                        <div className="flex gap-3">
                          {result.featuredImage && (
                            <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={result.featuredImage || "/placeholder.svg"}
                                alt={result.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
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
                            <h3 className="font-serif text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-accent line-clamp-2">
                              {result.title}
                            </h3>
                            <p className="line-clamp-2 text-xs text-muted-foreground">{result.excerpt}</p>
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
                )}
              </div>

              {/* Footer */}
              {(query || totalCounts.total > 0) && (
                <div className="border-t border-border p-3 text-xs text-muted-foreground text-center">
                  {query
                    ? `${filteredResults.length} ${filteredResults.length === 1 ? "result" : "results"}`
                    : `${totalCounts.total} items available`}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
