import {
  fetchPosts,
  fetchPostBySlug,
  fetchTaxonomy,
  fetchStats,
  type FetchPostsParams,
  type WordPressPost,
  type WordPressTaxonomy,
  type WordPressStats,
} from "./wordpress"
import { cache, cacheKeys } from "./cache"

export async function fetchPostsCached(params: FetchPostsParams = {}): Promise<WordPressPost[]> {
  const page = params.page || 1
  const type = params.type || "posts"
  const cacheKey = `${type}_page_${page}`

  // Try to get from cache first
  const cached = cache.get<WordPressPost[]>(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch from WordPress
  const data = await fetchPosts(params)

  // Cache for 5 minutes
  cache.set(cacheKey, data, 300)

  return data
}

export async function fetchPostBySlugCached(
  slug: string,
  type: "posts" | "episodes" | "research" = "posts",
): Promise<WordPressPost | null> {
  const cacheKey = cacheKeys.post(slug, type)

  // Try to get from cache first
  const cached = cache.get<WordPressPost | null>(cacheKey)
  if (cached !== undefined) {
    return cached
  }

  // Fetch from WordPress
  const data = await fetchPostBySlug(slug, type)

  // Cache for 10 minutes
  cache.set(cacheKey, data, 600)

  return data
}

export async function fetchTaxonomyCached(
  taxonomy: string,
  params: { per_page?: number; parent?: number } = {},
): Promise<WordPressTaxonomy[]> {
  const cacheKey = cacheKeys.taxonomy(taxonomy)

  // Try to get from cache first
  const cached = cache.get<WordPressTaxonomy[]>(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch from WordPress
  const data = await fetchTaxonomy(taxonomy, params)

  // Cache for 1 hour (taxonomies don't change often)
  cache.set(cacheKey, data, 3600)

  return data
}

export async function fetchThemesCached(): Promise<WordPressTaxonomy[]> {
  return fetchTaxonomyCached("theme")
}

export async function fetchSeriesCached(): Promise<WordPressTaxonomy[]> {
  return fetchTaxonomyCached("series")
}

export async function fetchPodcastEpisodesCached(
  params: Omit<FetchPostsParams, "type"> = {},
): Promise<WordPressPost[]> {
  return fetchPostsCached({ ...params, type: "episodes" })
}

export async function fetchResearchPapersCached(params: Omit<FetchPostsParams, "type"> = {}): Promise<WordPressPost[]> {
  return fetchPostsCached({ ...params, type: "research" })
}

export async function fetchBlogPostsCached(params: Omit<FetchPostsParams, "type"> = {}): Promise<WordPressPost[]> {
  return fetchPostsCached({ ...params, type: "posts" })
}

export async function fetchStatsCached(): Promise<WordPressStats> {
  const cacheKey = cacheKeys.stats

  // Try to get from cache first
  const cached = cache.get<WordPressStats>(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch from WordPress
  const data = await fetchStats()

  // Cache for 1 hour
  cache.set(cacheKey, data, 3600)

  return data
}

// Utility function to clear all caches
export function clearAllCaches(): void {
  cache.clear()
}

// Utility function to clear specific cache
export function clearCache(key: string): void {
  cache.delete(key)
}
