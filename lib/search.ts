import { fetchAllPosts, fetchAllEpisodes, fetchAllResearch } from "@/lib/wordpress-graphql"
import { adaptPostFromGraphQL, adaptEpisodeFromGraphQL, adaptResearchFromGraphQL } from "@/lib/graphql-adapter"
import type { FrontendPost, FrontendEpisode, FrontendResearch } from "@/lib/graphql-adapter"

export type SearchResult = {
  type: "blog" | "podcast" | "research"
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  featuredImage: string | null
  themes: string[]
  url: string
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim()
}

function convertToSearchResult(
  item: FrontendPost | FrontendEpisode | FrontendResearch,
  type: "blog" | "podcast" | "research",
): SearchResult {
  const baseUrl = type === "blog" ? "/blog" : `/${type}`

  return {
    type,
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: stripHtml(item.excerpt || item.content?.substring(0, 200) || ""),
    date: item.date,
    featuredImage: item.featuredImage,
    themes: item.themes || [],
    url: `${baseUrl}/${item.slug}`,
  }
}

export async function searchAllContent(query: string, contentType?: "blog" | "podcast" | "research" | "all") {
  const searchQuery = query.toLowerCase().trim()

  try {
    const results: SearchResult[] = []

    // Fetch all content types in parallel
    const [posts, episodes, research] = await Promise.all([
      contentType === "blog" || contentType === "all" || !contentType ? fetchAllPosts({ first: 100 }) : [],
      contentType === "podcast" || contentType === "all" || !contentType ? fetchAllEpisodes({ first: 100 }) : [],
      contentType === "research" || contentType === "all" || !contentType ? fetchAllResearch({ first: 100 }) : [],
    ])

    // Process blog posts
    if (posts.length > 0) {
      const adaptedPosts = posts.map(adaptPostFromGraphQL)
      const filteredPosts = searchQuery
        ? adaptedPosts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(searchQuery)
            const excerptMatch = stripHtml(post.excerpt || "")
              .toLowerCase()
              .includes(searchQuery)
            const contentMatch = stripHtml(post.content || "")
              .toLowerCase()
              .includes(searchQuery)
            const themeMatch = post.themes?.some((theme: any) =>
              (typeof theme === "string" ? theme : theme.name).toLowerCase().includes(searchQuery),
            )

            return titleMatch || excerptMatch || contentMatch || themeMatch
          })
        : adaptedPosts

      results.push(...filteredPosts.map((post) => convertToSearchResult(post, "blog")))
    }

    // Process podcast episodes
    if (episodes.length > 0) {
      const adaptedEpisodes = episodes.map(adaptEpisodeFromGraphQL)
      const filteredEpisodes = searchQuery
        ? adaptedEpisodes.filter((episode) => {
            const titleMatch = episode.title.toLowerCase().includes(searchQuery)
            const excerptMatch = stripHtml(episode.excerpt || "")
              .toLowerCase()
              .includes(searchQuery)
            const contentMatch = stripHtml(episode.content || "")
              .toLowerCase()
              .includes(searchQuery)
            const themeMatch = episode.themes?.some((theme) => theme.toLowerCase().includes(searchQuery))

            return titleMatch || excerptMatch || contentMatch || themeMatch
          })
        : adaptedEpisodes

      results.push(...filteredEpisodes.map((episode) => convertToSearchResult(episode, "podcast")))
    }

    // Process research papers
    if (research.length > 0) {
      const adaptedResearch = research.map(adaptResearchFromGraphQL)
      const filteredResearch = searchQuery
        ? adaptedResearch.filter((paper) => {
            const titleMatch = paper.title.toLowerCase().includes(searchQuery)
            const abstractMatch = stripHtml(paper.abstract || "")
              .toLowerCase()
              .includes(searchQuery)
            const contentMatch = stripHtml(paper.content || "")
              .toLowerCase()
              .includes(searchQuery)
            const themeMatch = paper.themes?.some((theme) => theme.toLowerCase().includes(searchQuery))
            const authorMatch = paper.author.toLowerCase().includes(searchQuery)

            return titleMatch || abstractMatch || contentMatch || themeMatch || authorMatch
          })
        : adaptedResearch

      results.push(...filteredResearch.map((paper) => convertToSearchResult(paper, "research")))
    }

    // Sort by relevance (title matches first, then by date)
    return results.sort((a, b) => {
      if (searchQuery) {
        const aTitle = a.title.toLowerCase().includes(searchQuery)
        const bTitle = b.title.toLowerCase().includes(searchQuery)

        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    return []
  }
}
