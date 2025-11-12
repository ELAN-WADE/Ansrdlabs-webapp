import type { ResearchNode, EpisodeNode, PostNode } from "@/lib/wordpress-graphql"
import { extractPdfUrlFromGraphQL, extractAudioUrlFromGraphQL, parseKeyFindings } from "@/lib/wordpress-graphql"

export interface FrontendResearch {
  id: string
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  featuredImage: string | null
  type: string
  author: string
  abstract: string
  pdfUrl: string | null
  externalUrl: string | null
  citation: string | null
  keyFindings: string[]
  methods: string[]
  formats: string[]
  series: string[]
  themes: string[] // Added themes from contentThemes taxonomy
}

export interface FrontendEpisode {
  id: string
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  featuredImage: string | null
  episodeNumber: number | null
  duration: string | null
  audioUrl: string | null
  videoUrl: string | null
  showNotes: string | null
  transcript: string | null
  coverImage: string | null
  youtubeVideoId: string | null
  sources: string[]
  formats: string[]
  series: string[]
  themes: string[]
  deckSubtitle: string | null // Added deckSubtitle for episode subtitle
}

export interface FrontendPost {
  id: string
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  featuredImage: string | null
  deckSubtitle: string | null
  estimatedReadTime: string | null
  externalMirror: string | null
  reference: string | null
  pullQuotes: string[]
  author: {
    name: string
    description: string | null
    avatar: string | null
  }
  formats: string[]
  series: string[]
  themes: string[]
}

export function adaptResearchFromGraphQL(node: ResearchNode): FrontendResearch {
  const pdfUrl = extractPdfUrlFromGraphQL(node)
  const keyFindings = parseKeyFindings(node.researches?.keyFindings || null)

  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    date: node.date,
    excerpt: node.content?.substring(0, 200) || "",
    content: node.content || "",
    featuredImage: node.featuredImage?.node?.sourceUrl || null,
    type: Array.isArray(node.researches?.type)
      ? node.researches.type[0] || "Research"
      : node.researches?.type || "Research",
    author: node.researches?.author || "ANSRd Labs",
    abstract: node.researches?.abstract || "",
    pdfUrl,
    externalUrl: node.researches?.externalUrl || null,
    citation: node.researches?.citation || null,
    keyFindings,
    methods: node.methods?.nodes?.map((m) => m.name) || [],
    formats: node.formats?.nodes?.map((f) => f.name) || [],
    series: node.seriesTag?.nodes?.map((s) => s.name) || [],
    themes: node.contentThemes?.nodes?.map((t) => t.name) || [],
  }
}

export function adaptEpisodeFromGraphQL(node: EpisodeNode): FrontendEpisode {
  const audioUrl = extractAudioUrlFromGraphQL(node)

  const sources = node.episodes?.sources
    ? node.episodes.sources
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : []

  const deckSubtitle = extractSubtitleFromContent(node.content)

  return {
    id: node.id,
    slug: node.slug,
    title: node.title.trim(),
    date: node.date,
    excerpt: node.content?.substring(0, 200) || "",
    content: node.content || "",
    featuredImage: node.featuredImage?.node?.sourceUrl || null,
    episodeNumber: node.episodes?.episodeNumber || null,
    duration: node.episodes?.duration || null,
    audioUrl,
    videoUrl: node.episodes?.videoUrl || null,
    showNotes: node.episodes?.showNotes || null,
    transcript: node.episodes?.transcript || null,
    coverImage: node.episodes?.coverImage?.node?.sourceUrl || null,
    youtubeVideoId: node.episodes?.youtubeVideoId || null,
    sources,
    formats: node.formats?.nodes?.map((f) => f.name) || [],
    series: node.seriesTag?.nodes?.map((s) => s.name) || [],
    themes: node.contentThemes?.nodes?.map((t) => t.name) || [],
    deckSubtitle,
  }
}

export function adaptPostFromGraphQL(node: PostNode): FrontendPost {
  const pullQuotes = node.posts?.pullQoutes
    ? node.posts.pullQoutes
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0)
    : []

  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    date: node.date,
    excerpt: node.excerpt || "",
    content: node.content || "",
    featuredImage: node.featuredImage?.node?.sourceUrl || null,
    deckSubtitle: node.posts?.decksubtitle || null,
    estimatedReadTime: node.posts?.estimatedReadTime || null,
    externalMirror: node.posts?.externalMirror || null,
    reference: node.posts?.reference || null,
    pullQuotes,
    author: {
      name: node.author?.node?.name || "ANSRd Labs",
      description: node.author?.node?.description || null,
      avatar: node.author?.node?.avatar?.url || null,
    },
    formats: node.formats?.nodes?.map((f) => f.name) || [],
    series: node.seriesTag?.nodes?.map((s) => s.name) || [],
    themes: node.contentThemes?.nodes?.map((t) => t.name) || [],
  }
}

function extractSubtitleFromContent(content: string | null): string | null {
  if (!content) return null

  // Remove HTML tags and get first paragraph
  const text = content.replace(/<[^>]*>/g, "").trim()
  const firstParagraph = text.split("\n")[0]

  // Return first paragraph if it's not too long (subtitle should be concise)
  if (firstParagraph && firstParagraph.length > 50 && firstParagraph.length < 300) {
    return firstParagraph
  }

  return null
}

export const adaptPodcastFromGraphQL = adaptEpisodeFromGraphQL
