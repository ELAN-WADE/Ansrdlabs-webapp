// Simple in-memory cache with TTL (Time To Live)
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private store = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttlSeconds = 300): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)

    if (!entry) {
      return null
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.store.clear()
  }

  delete(key: string): void {
    this.store.delete(key)
  }
}

export const cache = new Cache()

// Cache key generators
export const cacheKeys = {
  researchPapers: (page = 1) => `research_papers_${page}`,
  podcastEpisodes: (page = 1) => `podcast_episodes_${page}`,
  blogPosts: (page = 1) => `blog_posts_${page}`,
  taxonomy: (taxonomy: string) => `taxonomy_${taxonomy}`,
  post: (slug: string, type: string) => `post_${type}_${slug}`,
  themes: "themes",
  series: "series",
  stats: "stats",
}
