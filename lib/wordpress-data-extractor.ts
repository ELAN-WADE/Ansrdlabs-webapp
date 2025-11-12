import type { WordPressPost } from "./wordpress"

export interface ExtractedResearchData {
  id: number
  title: string
  slug: string
  type: string
  authors: string
  abstract: string
  pdfUrl: string | null
  doi: string | null
  citation: string | null
  keyFindings: string[]
  date: string
  content: string
  excerpt: string
  featuredImage: string | null
}

export interface ExtractedPodcastData {
  id: number
  title: string
  slug: string
  episodeNumber: number
  duration: string
  audioUrl: string | null
  videoUrl: string | null
  showNotes: string
  transcript: Array<{ time: string; text: string; seconds: number }>
  sources: Array<{ title: string; url: string }>
  date: string
  content: string
  excerpt: string
  featuredImage: string | null
}

export interface ExtractedArticleData {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  featuredImage: string | null
}

/**
 * Extract research data from WordPress post with all ACF fields
 */
export function extractResearchData(post: WordPressPost): ExtractedResearchData {
  // Extract PDF URL from multiple possible ACF field locations
  let pdfUrl: string | null = null
  if (post.acf?.pdfUpload?.mediaItemUrl) {
    pdfUrl = post.acf.pdfUpload.mediaItemUrl
  } else if (post.acf?.pdfUpload?.url) {
    pdfUrl = post.acf.pdfUpload.url
  } else if (post.acf?.pdf_url) {
    pdfUrl = post.acf.pdf_url as string
  }

  // Extract featured image
  let featuredImage: string | null = null
  if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    featuredImage = post._embedded["wp:featuredmedia"][0].source_url
  }

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    type: post.acf?.research_type || "Research Report",
    authors: post.acf?.authors || "ANSRd! Labs Research Team",
    abstract: post.excerpt?.rendered || post.acf?.abstract || "",
    pdfUrl,
    doi: post.acf?.doi || null,
    citation: post.acf?.citation || null,
    keyFindings: Array.isArray(post.acf?.key_findings) ? post.acf.key_findings : [],
    date: post.date,
    content: post.content?.rendered || "",
    excerpt: post.excerpt?.rendered || "",
    featuredImage,
  }
}

/**
 * Extract podcast data from WordPress post with all ACF fields
 */
export function extractPodcastData(post: WordPressPost): ExtractedPodcastData {
  // Extract audio URL from ACF fields
  let audioUrl: string | null = null
  if (post.acf?.audio_url) {
    audioUrl = post.acf.audio_url as string
  }

  // Extract video URL
  let videoUrl: string | null = null
  if (post.acf?.video_url) {
    videoUrl = post.acf.video_url as string
  }

  // Extract featured image
  let featuredImage: string | null = null
  if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    featuredImage = post._embedded["wp:featuredmedia"][0].source_url
  }

  // Parse transcript if it's a string
  let transcript: Array<{ time: string; text: string; seconds: number }> = []
  if (post.acf?.transcript) {
    if (typeof post.acf.transcript === "string") {
      // Try to parse as JSON if it's a string
      try {
        transcript = JSON.parse(post.acf.transcript)
      } catch {
        transcript = []
      }
    } else if (Array.isArray(post.acf.transcript)) {
      transcript = post.acf.transcript
    }
  }

  // Parse sources if it's a string
  let sources: Array<{ title: string; url: string }> = []
  if (post.acf?.sources) {
    if (typeof post.acf.sources === "string") {
      // Parse line-separated sources (Label - URL format)
      sources = post.acf.sources
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [title, url] = line.split(" - ").map((s) => s.trim())
          return { title: title || line, url: url || "#" }
        })
    } else if (Array.isArray(post.acf.sources)) {
      sources = post.acf.sources
    }
  }

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    episodeNumber: post.acf?.episode_number || 0,
    duration: post.acf?.duration || "0:00",
    audioUrl,
    videoUrl,
    showNotes: post.acf?.show_notes || post.content?.rendered || "",
    transcript,
    sources,
    date: post.date,
    content: post.content?.rendered || "",
    excerpt: post.excerpt?.rendered || "",
    featuredImage,
  }
}

/**
 * Extract article data from WordPress post
 */
export function extractArticleData(post: WordPressPost): ExtractedArticleData {
  // Extract featured image
  let featuredImage: string | null = null
  if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    featuredImage = post._embedded["wp:featuredmedia"][0].source_url
  }

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    content: post.content?.rendered || "",
    excerpt: post.excerpt?.rendered || "",
    date: post.date,
    featuredImage,
  }
}

/**
 * Verify all required fields are present in extracted data
 */
export function verifyResearchData(data: ExtractedResearchData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title) errors.push("Missing title")
  if (!data.authors) errors.push("Missing authors")
  if (!data.abstract) errors.push("Missing abstract")
  if (!data.pdfUrl) errors.push("Missing PDF URL")

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Verify all required fields are present in podcast data
 */
export function verifyPodcastData(data: ExtractedPodcastData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title) errors.push("Missing title")
  if (!data.audioUrl) errors.push("Missing audio URL")

  return {
    valid: errors.length === 0,
    errors,
  }
}
