"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FileText, Download, Calendar, Search, Filter, BookOpen, Tag } from "lucide-react"
import { fetchAllResearch, fetchContentByTheme, getFormats, getMethods } from "@/lib/wordpress-graphql"
import type { ResearchNode } from "@/lib/wordpress-graphql"

export function ResearchArchive() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)

  const [research, setResearch] = useState<ResearchNode[]>([])
  const [themes, setThemes] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [methods, setMethods] = useState<Array<{ name: string; slug: string }>>([])
  const [formats, setFormats] = useState<Array<{ name: string; slug: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const [researchData, themesData] = await Promise.all([
          fetchAllResearch({ first: 100 }),
          fetchContentByTheme({ first: 100 }),
        ])

        const uniqueResearch = Array.from(new Map(researchData.map((paper) => [paper.id, paper])).values())

        setResearch(uniqueResearch)
        setThemes(themesData.map((t) => ({ id: t.id, name: t.name, slug: t.slug })))

        const methodsSet = new Set<string>()
        const formatsSet = new Set<string>()

        uniqueResearch.forEach((paper) => {
          getMethods(paper).forEach((m) => methodsSet.add(m))
          getFormats(paper).forEach((f) => formatsSet.add(f))
        })

        setMethods(Array.from(methodsSet).map((m) => ({ name: m, slug: m.toLowerCase().replace(/\s+/g, "-") })))
        setFormats(Array.from(formatsSet).map((f) => ({ name: f, slug: f.toLowerCase().replace(/\s+/g, "-") })))
      } catch (error) {
        setError("Failed to load research data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredResearch = research.filter((paper) => {
    const titleText = paper.title || ""
    const excerptText = paper.content?.replace(/<[^>]*>/g, "") || ""

    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerptText.toLowerCase().includes(searchQuery.toLowerCase())

    const paperThemes = paper.contentThemes?.nodes?.map((t) => t.name) || []
    const paperMethods = getMethods(paper)
    const paperFormats = getFormats(paper)

    const matchesTheme = !selectedTheme || paperThemes.some((t) => t.toLowerCase().includes(selectedTheme))
    const matchesMethod = !selectedMethod || paperMethods.some((m) => m.toLowerCase().includes(selectedMethod))
    const matchesFormat = !selectedFormat || paperFormats.some((f) => f.toLowerCase().includes(selectedFormat))

    return matchesSearch && matchesTheme && matchesMethod && matchesFormat
  })

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
              Research Library
            </div>
            <h1 className="font-serif text-6xl font-bold text-foreground">Research</h1>
            <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
              Evidence-based insights exploring everyday decisions in African cities. All research is freely available
              for download.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "Papers", value: research.length },
                { label: "Themes", value: themes.length },
                { label: "Methods", value: methods.length },
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
                placeholder="Search research papers..."
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

              {/* Format Filter */}
              {formats.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4" />
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
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border bg-surface p-6">
                  <div className="h-4 w-20 rounded bg-surface-elevated" />
                  <div className="mt-4 h-6 w-full rounded bg-surface-elevated" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-surface-elevated" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-surface-elevated" />
                    <div className="h-3 w-full rounded bg-surface-elevated" />
                    <div className="h-3 w-2/3 rounded bg-surface-elevated" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResearch.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTheme}-${selectedMethod}-${selectedFormat}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredResearch.map((paper, index) => {
                  const paperThemes = paper.contentThemes?.nodes?.map((t) => t.name) || []
                  const paperMethods = getMethods(paper)
                  const paperFormats = getFormats(paper)

                  return (
                    <motion.article
                      key={`research-${paper.slug}-${paper.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative"
                    >
                      <Link href={`/research/${paper.slug}`}>
                        <div className="relative h-full overflow-hidden rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          <div className="relative">
                            {paper.researches?.coverImage?.node?.mediaItemUrl && (
                              <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                                <Image
                                  src={paper.researches.coverImage.node.mediaItemUrl || "/placeholder.svg"}
                                  alt={paper.title || "Research cover"}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            )}

                            {paperThemes.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-2">
                                {paperThemes.slice(0, 2).map((theme, themeIndex) => (
                                  <span
                                    key={`research-${paper.slug}-${paper.id}-${theme}-${themeIndex}`}
                                    className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-white"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                            )}

                            <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
                              {paper.title || "Untitled Research"}
                            </h3>

                            <div className="mt-6 space-y-2 border-t border-border pt-4">
                              {paperFormats.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                                  <Tag className="h-3 w-3" />
                                  <span>{paperFormats.join(", ")}</span>
                                </div>
                              )}
                              {paperMethods.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                                  <Filter className="h-3 w-3" />
                                  <span>{paperMethods.join(", ")}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(paper.date).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-white hover:border-accent">
                              <Download className="h-4 w-4" />
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <FileText className="mx-auto h-16 w-16 text-foreground-subtle" />
              <p className="mt-4 text-lg text-foreground-muted">No research found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedTheme(null)
                  setSelectedMethod(null)
                  setSelectedFormat(null)
                  setSearchQuery("")
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
