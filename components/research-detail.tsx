"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Download,
  Share2,
  Calendar,
  Users,
  MapPin,
  BookOpen,
  Quote,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { extractTerms, type WordPressPost } from "@/lib/wordpress"
import { downloadPDF, sharePDF, generateShareLinks } from "@/lib/pdf-utils"
import { PDFViewer } from "./pdf-viewer"
import { extractResearchData, verifyResearchData } from "@/lib/wordpress-data-extractor"
import { fetchResearchBySlugGraphQL } from "@/lib/wordpress-graphql"
import { adaptResearchFromGraphQL, type FrontendResearch } from "@/lib/graphql-adapter"

interface ResearchData {
  id: number
  title: string
  type: string
  authors: string
  date: string
  theme: string
  themeColor: string
  methods: string[]
  geography: string
  abstract: string
  downloads: number
  pages: number
  pdfUrl: string
  keyFindings: string[]
  methodology: string
  citations: {
    apa: string
    mla: string
    bibtex: string
  }
  relatedContent: Array<{ type: string; title: string; href: string }>
}

const fallbackData: ResearchData = {
  id: 1,
  title: "Mobility Patterns and Livelihood Strategies in Lagos",
  type: "Research Report",
  authors: "Adebayo, O., Chen, L., & Okonkwo, N.",
  date: "January 2025",
  theme: "Transport",
  themeColor: "transport",
  methods: ["Interviews", "Ethnography"],
  geography: "Lagos, Nigeria",
  abstract:
    "A comprehensive study of how transport policy changes affect informal workers' daily routines and income generation strategies. This research examines the ripple effects of motorcycle taxi (okada) bans on urban mobility patterns and economic livelihoods in Lagos.",
  downloads: 234,
  pages: 48,
  pdfUrl: "",
  keyFindings: [
    "Okada bans increased average commute times by 35% for informal workers in affected areas",
    "Workers adapted through multi-modal transport strategies, combining walking, buses, and ride-hailing",
    "Income losses averaged 18% in the first three months post-ban, with gradual recovery through adaptation",
    "Policy implementation varied significantly across neighborhoods, creating uneven impacts",
    "Alternative transport options were insufficient to meet demand in many areas",
  ],
  methodology:
    "This mixed-methods study combined in-depth interviews with 60 informal workers, ethnographic observation of transport hubs, and analysis of mobility data. Fieldwork was conducted over six months across five Lagos neighborhoods with varying levels of okada ban enforcement.",
  citations: {
    apa: "Adebayo, O., Chen, L., & Okonkwo, N. (2025). Mobility Patterns and Livelihood Strategies in Lagos. ANSRd! Labs Research Report.",
    mla: 'Adebayo, Oluwaseun, et al. "Mobility Patterns and Livelihood Strategies in Lagos." ANSRd! Labs, Jan. 2025.',
    bibtex: `@techreport{adebayo2025mobility,
  title={Mobility Patterns and Livelihood Strategies in Lagos},
  author={Adebayo, Oluwaseun and Chen, Li and Okonkwo, Ngozi},
  year={2025},
  institution={ANSRd! Labs}
}`,
  },
  relatedContent: [
    { type: "Podcast", title: "The Hidden Economics of Okada Bans", href: "/podcast/1" },
    { type: "Research", title: "The Psychology of Commuting", href: "/research/6" },
  ],
}

function convertWordPressToResearch(post: WordPressPost): ResearchData {
  const extracted = extractResearchData(post)
  const verification = verifyResearchData(extracted)

  if (!verification.valid) {
    console.warn("[v0] Research data validation errors:", verification.errors)
  }

  const themes = extractTerms(post, "theme")

  return {
    id: extracted.id,
    title: extracted.title,
    type: extracted.type,
    authors: extracted.authors,
    date: new Date(extracted.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    theme: themes[0]?.name || "General",
    themeColor: themes[0]?.slug?.toLowerCase().replace(/\s+/g, "-") || "accent",
    methods: extractTerms(post, "methods").map((m) => m.name),
    geography:
      extractTerms(post, "geography")
        .map((g) => g.name)
        .join(", ") || "Global",
    abstract: extracted.abstract,
    downloads: post.acf?.downloads || 0,
    pages: post.acf?.pages || 0,
    pdfUrl: extracted.pdfUrl || "",
    keyFindings: extracted.keyFindings,
    methodology: extracted.content,
    citations: {
      apa:
        extracted.citation ||
        `ANSRd! Labs. (${new Date(extracted.date).getFullYear()}). ${extracted.title}. ANSRd! Labs Research Report.`,
      mla:
        extracted.citation ||
        `ANSRd! Labs. "${extracted.title}." ANSRd! Labs, ${new Date(extracted.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}.`,
      bibtex: `@techreport{ansrd${new Date(extracted.date).getFullYear()},\n  title={${extracted.title}},\n  author={${extracted.authors}},\n  year={${new Date(extracted.date).getFullYear()}},\n  institution={ANSRd! Labs}\n}`,
    },
    relatedContent: post.acf?.related_content || [],
  }
}

function convertGraphQLToResearch(frontendData: FrontendResearch): ResearchData {
  return {
    id: Number.parseInt(frontendData.id.replace(/\D/g, "")) || 1,
    title: frontendData.title,
    type: frontendData.type,
    authors: frontendData.author,
    date: new Date(frontendData.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    theme: frontendData.series[0] || "General",
    themeColor: frontendData.series[0]?.toLowerCase().replace(/\s+/g, "-") || "accent",
    methods: frontendData.methods,
    geography: frontendData.geography || "Global",
    abstract: frontendData.abstract,
    downloads: frontendData.downloads || 0,
    pages: frontendData.pages || 0,
    pdfUrl: frontendData.pdfUrl || "",
    keyFindings: frontendData.keyFindings,
    methodology: frontendData.content,
    citations: {
      apa:
        frontendData.citation ||
        `ANSRd Labs. (${new Date(frontendData.date).getFullYear()}). ${frontendData.title}. ANSRd Labs Research Report.`,
      mla:
        frontendData.citation ||
        `ANSRd Labs. "${frontendData.title}." ANSRd Labs, ${new Date(frontendData.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}.`,
      bibtex: `@techreport{ansrd${new Date(frontendData.date).getFullYear()},\n  title={${frontendData.title}},\n  author={${frontendData.author}},\n  year={${new Date(frontendData.date).getFullYear()}},\n  institution={ANSRd Labs}\n}`,
    },
    relatedContent: [],
  }
}

export function ResearchDetail({ id }: { id: string }) {
  const [research, setResearch] = useState<ResearchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "findings" | "methodology">("overview")
  const [citationFormat, setCitationFormat] = useState<"apa" | "mla" | "bibtex">("apa")
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [shareLinks, setShareLinks] = useState<ReturnType<typeof generateShareLinks> | null>(null)
  const [taxonomies, setTaxonomies] = useState<{ themes: string[]; formats: string[]; methods: string[] }>({
    themes: [],
    formats: [],
    methods: [],
  })

  useEffect(() => {
    async function loadResearch() {
      try {
        setLoading(true)

        const graphqlData = await fetchResearchBySlugGraphQL(id)

        if (graphqlData) {
          const themes = graphqlData.contentThemes?.nodes?.map((t) => t.name) || []
          const formats = graphqlData.formats?.nodes?.map((f) => f.name) || []
          const methods = graphqlData.methods?.nodes?.map((m) => m.name) || []
          setTaxonomies({ themes, formats, methods })

          const frontendData = adaptResearchFromGraphQL(graphqlData)
          const researchData = convertGraphQLToResearch(frontendData)
          setResearch(researchData)
        } else {
          setResearch(fallbackData)
        }
      } catch (error) {
        setResearch(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    loadResearch()
  }, [id])

  useEffect(() => {
    if (research) {
      const links = generateShareLinks(typeof window !== "undefined" ? window.location.href : "", research.title)
      setShareLinks(links)
    }
  }, [research])

  const copyCitation = () => {
    if (research) {
      navigator.clipboard.writeText(research.citations[citationFormat])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = async () => {
    if (!research?.pdfUrl) {
      alert("PDF not available for download")
      return
    }

    setDownloading(true)
    try {
      const result = await downloadPDF(research.pdfUrl, `${research.title}.pdf`)
    } catch (error) {
      alert("Unable to download PDF. Please try again or right-click the PDF viewer to save.")
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!research) return

    setSharing(true)
    try {
      const result = await sharePDF(research.title, typeof window !== "undefined" ? window.location.href : "")
      if (result?.message) {
        alert(result.message)
      }
    } catch (error) {
    } finally {
      setSharing(false)
    }
  }

  if (loading || !research) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
          <p className="mt-4 text-foreground-muted">Loading research...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {taxonomies.themes && taxonomies.themes.length > 0 && (
                <>
                  {taxonomies.themes.map((theme) => (
                    <span
                      key={theme}
                      className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-white"
                    >
                      {theme}
                    </span>
                  ))}
                </>
              )}
              <span className="text-sm text-foreground-subtle">{research.type}</span>
              <span className="flex items-center gap-1 text-sm text-foreground-subtle">
                <Calendar className="h-4 w-4" />
                {research.date}
              </span>
              <span className="text-sm text-foreground-subtle">{research.pages} pages</span>
              {taxonomies.formats && taxonomies.formats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {taxonomies.formats.map((format) => (
                    <span
                      key={format}
                      className="inline-block rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-foreground-muted"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              )}
              {taxonomies.methods && taxonomies.methods.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {taxonomies.methods.map((method) => (
                    <span
                      key={method}
                      className="inline-block rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-foreground-muted"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              {research.title}
            </h1>

            {research.abstract && (
              <div className="mt-4 text-xl leading-relaxed text-foreground-muted italic border-l-4 border-accent pl-4">
                {research.abstract.substring(0, 300)}
                {research.abstract.length > 300 && "..."}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{research.authors}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{research.geography}</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{research.downloads} downloads</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading || !research.pdfUrl}
                className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </section>

      {/* PDF Viewer */}
      {research.pdfUrl && (
        <section className="border-b border-border bg-background py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <PDFViewer url={research.pdfUrl} title={research.title} onError={() => setPdfError(true)} />
          </div>
        </section>
      )}

      {/* Content Tabs */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="mb-8 flex gap-6 border-b border-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-b-2 border-accent text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("findings")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "findings"
                  ? "border-b-2 border-accent text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Key Findings
            </button>
            <button
              onClick={() => setActiveTab("methodology")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "methodology"
                  ? "border-b-2 border-accent text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Methodology
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Abstract</h2>
                  <p className="leading-relaxed text-foreground-muted">{research.abstract}</p>

                  <div className="mt-8">
                    <h3 className="mb-4 font-serif text-xl font-semibold text-foreground">Research Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {research.methods.map((method) => (
                        <span
                          key={method}
                          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "findings" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Key Findings</h2>
                  <div className="space-y-4">
                    {research.keyFindings.map((finding, index) => (
                      <div key={index} className="flex gap-4 rounded-lg border border-border bg-surface p-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="flex-1 leading-relaxed text-foreground-muted">{finding}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "methodology" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Methodology</h2>
                  <div className="rounded-lg border border-border bg-surface p-6">
                    <BookOpen className="mb-4 h-8 w-8 text-accent" />
                    <p className="leading-relaxed text-foreground-muted">{research.methodology}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Citation Tool */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Quote className="h-5 w-5 text-accent" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">Cite This Work</h3>
                </div>
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={() => setCitationFormat("apa")}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      citationFormat === "apa"
                        ? "bg-accent text-white"
                        : "border border-border bg-background text-foreground-muted hover:bg-surface-elevated"
                    }`}
                  >
                    APA
                  </button>
                  <button
                    onClick={() => setCitationFormat("mla")}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      citationFormat === "mla"
                        ? "bg-accent text-white"
                        : "border border-border bg-background text-foreground-muted hover:bg-surface-elevated"
                    }`}
                  >
                    MLA
                  </button>
                  <button
                    onClick={() => setCitationFormat("bibtex")}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      citationFormat === "bibtex"
                        ? "bg-accent text-white"
                        : "border border-border bg-background text-foreground-muted hover:bg-surface-elevated"
                    }`}
                  >
                    BibTeX
                  </button>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground-muted">
                    {research.citations[citationFormat]}
                  </p>
                </div>
                <button
                  onClick={copyCitation}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Citation
                    </>
                  )}
                </button>
              </div>

              {/* Share Links */}
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

              {/* Related Content */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Related Content</h3>
                <div className="space-y-3">
                  {research.relatedContent.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-all hover:border-accent hover:bg-surface-elevated"
                    >
                      <div>
                        <span className="text-xs text-foreground-subtle">{item.type}</span>
                        <h4 className="mt-0.5 text-sm font-medium leading-tight text-foreground">{item.title}</h4>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-foreground-subtle" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
