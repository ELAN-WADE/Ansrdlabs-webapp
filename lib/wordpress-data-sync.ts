"use client"

import { type WordPressPost, extractPdfUrl, extractFeaturedImage, extractAuthorName, extractTerms } from "./wordpress"

/**
 * Comprehensive data sync layer that transforms WordPress REST API data
 * into frontend-ready formats with proper error handling and fallbacks
 */

export interface SyncedResearchData {
  id: number
  slug: string
  title: string
  abstract: string
  content: string
  authors: string
  date: string
  pdfUrl: string | null
  featuredImage: string | null
  theme: string
  methods: string[]
  geography: string[]
  downloads: number
  pages: number
  keyFindings: string[]
  citations: {
    apa: string
    mla: string
    bibtex: string
  }
}

export interface SyncedPodcastData {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  audioUrl: string | null
  duration: string
  episodeNumber: number
  date: string
  featuredImage: string | null
  series: string[]
  transcript: string | null
  showNotes: string | null
  sources: string | null
}

export interface SyncedArticleData {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  featuredImage: string | null
  author: string | null
  theme: string
  readTime: string
}

/**
 * Sync research post data from WordPress to frontend format
 */
export function syncResearchData(post: WordPressPost): SyncedResearchData {
  const themes = extractTerms(post, "theme")
  const methods = extractTerms(post, "methods")
  const geography = extractTerms(post, "geography")
  const pdfUrl = extractPdfUrl(post)
  const featuredImage = extractFeaturedImage(post)

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    abstract: stripHtml(post.excerpt?.rendered || ""),
    content: post.content.rendered,
    authors: post.acf?.authors || "ANSRd! Labs Research Team",
    date: new Date(post.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    pdfUrl: pdfUrl,
    featuredImage: featuredImage,
    theme: themes[0]?.name || "General",
    methods: methods.map((m) => m.name),
    geography: geography.map((g) => g.name),
    downloads: post.acf?.downloads || 0,
    pages: post.acf?.pages || 0,
    keyFindings: Array.isArray(post.acf?.key_findings) ? post.acf.key_findings : [],
    citations: {
      apa: `ANSRd! Labs. (${new Date(post.date).getFullYear()}). ${post.title.rendered}. ANSRd! Labs Research Report.`,
      mla: `ANSRd! Labs. "${post.title.rendered}." ANSRd! Labs, ${new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}.`,
      bibtex: `@techreport{ansrd${new Date(post.date).getFullYear()},\n  title={${post.title.rendered}},\n  author={ANSRd! Labs},\n  year={${new Date(post.date).getFullYear()}},\n  institution={ANSRd! Labs}\n}`,
    },
  }
}

/**
 * Sync podcast episode data from WordPress to frontend format
 */
export function syncPodcastData(post: WordPressPost): SyncedPodcastData {
  const series = extractTerms(post, "series")
  const featuredImage = extractFeaturedImage(post)

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: stripHtml(post.excerpt?.rendered || ""),
    content: post.content.rendered,
    audioUrl: post.acf?.audio_url || null,
    duration: post.acf?.duration || "0:00",
    episodeNumber: Number.parseInt(post.acf?.episode_number || "0") || 0,
    date: new Date(post.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    featuredImage: featuredImage,
    series: series.map((s) => s.name),
    transcript: post.acf?.transcript || null,
    showNotes: post.acf?.show_notes || null,
    sources: post.acf?.sources || null,
  }
}

/**
 * Sync article/blog post data from WordPress to frontend format
 */
export function syncArticleData(post: WordPressPost): SyncedArticleData {
  const themes = extractTerms(post, "theme")
  const author = extractAuthorName(post)
  const featuredImage = extractFeaturedImage(post)

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: stripHtml(post.excerpt?.rendered || ""),
    content: post.content.rendered,
    date: new Date(post.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    featuredImage: featuredImage,
    author: author,
    theme: themes[0]?.name || "General",
    readTime: post.acf?.estimated_read_time || "5 min read",
  }
}

/**
 * Helper function to strip HTML tags from content
 */
function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").trim()
}

/**
 * Validate synced data has required fields
 */
export function validateSyncedData(data: any, type: "research" | "podcast" | "article"): boolean {
  const requiredFields: Record<string, string[]> = {
    research: ["id", "title", "slug", "abstract"],
    podcast: ["id", "title", "slug", "audioUrl"],
    article: ["id", "title", "slug", "content"],
  }

  const required = requiredFields[type] || []
  const missing = required.filter((field) => !data[field])

  if (missing.length > 0) {
    return false
  }

  return true
}
