import {
  fetchAllResearch,
  fetchAllEpisodes,
  fetchAllPosts,
  fetchResearchBySlugGraphQL,
  fetchEpisodeBySlugGraphQL,
  fetchPostBySlugGraphQL,
  type ResearchNode,
  type EpisodeNode,
  type PostNode,
} from "./wordpress"

export interface SyncedResearchData {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  thumbnail: string
  pdfUrl: string
  authors: string
  abstract: string
  methods: string[]
  type: string
  keyFindings: string
}

export interface SyncedEpisodeData {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  thumbnail: string
  audioUrl: string
  duration: string
  episodeNumber: number | null
}

export interface SyncedPostData {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  thumbnail: string
  readTime: string | null
}

export function syncResearchData(node: ResearchNode): SyncedResearchData {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt,
    date: node.date,
    thumbnail: node.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=400&width=600",
    pdfUrl: node.researchFields?.pdfUpload?.mediaItemUrl || node.researchFields?.externalUrl || "",
    authors: node.researchFields?.author || "ANSRd! Labs",
    abstract: node.researchFields?.abstract || node.excerpt,
    methods: node.methods?.nodes?.map((m) => m.name) || [],
    type: node.researchFields?.type || "Research Report",
    keyFindings: node.researchFields?.keyFindings || "",
  }
}

export function syncEpisodeData(node: EpisodeNode): SyncedEpisodeData {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt,
    date: node.date,
    thumbnail: node.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=400&width=600",
    audioUrl: node.episodeFields?.audioUrl || "",
    duration: node.episodeFields?.duration || "45 min",
    episodeNumber: node.episodeFields?.episodeNumber || null,
  }
}

export function syncPostData(node: PostNode): SyncedPostData {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt,
    date: node.date,
    thumbnail: node.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=400&width=600",
    readTime: node.postFields?.estimatedReadTime || null,
  }
}

export async function fetchAndSyncAllResearch() {
  try {
    const nodes = await fetchAllResearch({ first: 100 })
    return nodes.map(syncResearchData)
  } catch (error) {
    return []
  }
}

export async function fetchAndSyncAllEpisodes() {
  try {
    const nodes = await fetchAllEpisodes({ first: 100 })
    return nodes.map(syncEpisodeData)
  } catch (error) {
    return []
  }
}

export async function fetchAndSyncAllPosts() {
  try {
    const nodes = await fetchAllPosts({ first: 100 })
    return nodes.map(syncPostData)
  } catch (error) {
    return []
  }
}

export async function fetchAndSyncResearchBySlug(slug: string) {
  try {
    const node = await fetchResearchBySlugGraphQL(slug)
    if (node) {
      return syncResearchData(node)
    }
    return null
  } catch (error) {
    return null
  }
}

export async function fetchAndSyncEpisodeBySlug(slug: string) {
  try {
    const node = await fetchEpisodeBySlugGraphQL(slug)
    if (node) {
      return syncEpisodeData(node)
    }
    return null
  } catch (error) {
    return null
  }
}

export async function fetchAndSyncPostBySlug(slug: string) {
  try {
    const node = await fetchPostBySlugGraphQL(slug)
    if (node) {
      return syncPostData(node)
    }
    return null
  } catch (error) {
    return null
  }
}
