const GRAPHQL_ENDPOINT = (() => {
  const graphqlUrl = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL
  const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL

  if (graphqlUrl) {
    return graphqlUrl
  }

  if (apiUrl) {
    return `${apiUrl}/graphql`
  }

  // Return null if no WordPress endpoint is configured
  return null
})()

// ============================================================================
// TypeScript Types matching the GraphQL schema
// ============================================================================

export interface ContentThemeNode {
  id: string
  name: string
  slug: string
}

export interface FeaturedImage {
  node: {
    sourceUrl: string
    altText: string
  }
}

export interface SeriesTag {
  nodes: Array<{
    name: string
    slug: string
  }>
}

export interface Format {
  nodes: Array<{
    name: string
    slug: string
  }>
}

export interface Method {
  nodes: Array<{
    name: string
    slug: string
  }>
}

// Post Types
export interface PostNode {
  id: string
  title: string
  slug: string
  date: string
  excerpt: string
  content: string
  featuredImage: FeaturedImage | null
  author: {
    node: {
      name: string
      description: string | null
      avatar: {
        url: string
      } | null
    }
  } | null
  posts: {
    decksubtitle: string | null
    estimatedReadTime: string | null
    externalMirror: string | null
    reference: string | null
    pullQoutes: string | null
  } | null
  seriesTag: SeriesTag | null
  formats: Format | null
  contentThemes: {
    nodes: Array<{
      name: string
      slug: string
    }>
  }
}

export interface EpisodeNode {
  id: string
  title: string
  slug: string
  date: string
  content: string
  featuredImage: FeaturedImage | null
  episodes: {
    episodeNumber: number | null
    duration: string | null
    audioUrl: string | null
    videoUrl: string | null
    showNotes: string | null
    transcript: string | null
    coverImage: {
      node: {
        sourceUrl: string
        altText: string
      }
    } | null
    youtubeVideoId: string | null
    sources: string | null
  } | null
  seriesTag: SeriesTag | null
  formats: Format | null
  contentThemes: {
    nodes: Array<{
      name: string
      slug: string
    }>
  }
}

export interface ResearchNode {
  id: string
  title: string
  slug: string
  date: string
  content: string
  featuredImage: FeaturedImage | null
  researches: {
    type: string[] | null
    author: string | null
    abstract: string | null
    pdfUpload: {
      node: {
        mediaItemUrl: string
        sourceUrl: string
      }
    } | null
    externalUrl: string | null
    citation: string | null
    keyFindings: string | null
  } | null
  seriesTag: SeriesTag | null
  formats: Format | null
  methods: Method | null
  contentThemes: {
    nodes: Array<{
      name: string
      slug: string
    }>
  }
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
  total?: number
}

export interface ContentThemeResponse {
  contentThemes: {
    nodes: Array<{
      id: string
      name: string
      slug: string
      posts: {
        pageInfo: PageInfo
        nodes: PostNode[]
      }
      episodes: {
        pageInfo: PageInfo
        nodes: EpisodeNode[]
      }
      researches: {
        pageInfo: PageInfo
        nodes: ResearchNode[]
      }
    }>
  }
}

// ============================================================================
// GraphQL Query
// ============================================================================

const GET_CONTENT_THEMES_QUERY = `
  query GetContentThemes($slug: [String], $search: String, $first: Int, $after: String) {
    contentThemes(where: { slug: $slug }) {
      nodes {
        id
        name
        slug
        posts(where: { search: $search }, first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            date
            excerpt
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                name
                description
                avatar {
                  url
                }
              }
            }
            posts {
              decksubtitle
              estimatedReadTime
              externalMirror
              reference
              pullQoutes
            }
            seriesTag {
              nodes {
                name
                slug
              }
            }
            formats {
              nodes {
                name
                slug
              }
            }
            contentThemes {
              nodes {
                name
                slug
              }
            }
          }
        }
        episodes(where: { search: $search }, first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            episodes {
              episodeNumber
              duration
              audioUrl
              videoUrl
              showNotes
              transcript
              coverImage {
                node {
                  sourceUrl
                  altText
                }
              }
              youtubeVideoId
              sources
            }
            seriesTag {
              nodes {
                name
                slug
              }
            }
            formats {
              nodes {
                name
                slug
              }
            }
            contentThemes {
              nodes {
                name
                slug
              }
            }
          }
        }
        researches(where: { search: $search }, first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            researches {
              type
              author
              abstract
              pdfUpload {
                node {
                  mediaItemUrl
                  sourceUrl
                }
              }
              externalUrl
              citation
              keyFindings
            }
            seriesTag {
              nodes {
                name
                slug
              }
            }
            formats {
              nodes {
                name
                slug
              }
            }
            methods {
              nodes {
                name
                slug
              }
            }
            contentThemes {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`

const GET_POST_BY_ID_OR_SLUG_QUERY = `
  query GetPost($id: ID!, $idType: PostIdType!) {
    post(id: $id, idType: $idType) {
      id
      title
      slug
      date
      excerpt
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
        }
      }
      posts {
        decksubtitle
        estimatedReadTime
        externalMirror
        reference
        pullQoutes
      }
      seriesTag {
        nodes {
          name
          slug
        }
      }
      formats {
        nodes {
          name
          slug
        }
      }
      contentThemes {
        nodes {
          name
          slug
        }
      }
    }
  }
`

const GET_EPISODE_BY_ID_OR_SLUG_QUERY = `
  query GetEpisode($id: ID!, $idType: EpisodeIdType!) {
    episode(id: $id, idType: $idType) {
      id
      title
      slug
      date
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      episodes {
        episodeNumber
        duration
        audioUrl
        videoUrl
        showNotes
        transcript
        coverImage {
          node {
            sourceUrl
            altText
          }
        }
        youtubeVideoId
        sources
      }
      seriesTag {
        nodes {
          name
          slug
        }
      }
      formats {
        nodes {
          name
          slug
        }
      }
      contentThemes {
        nodes {
          name
          slug
        }
      }
    }
  }
`

const GET_RESEARCH_BY_ID_OR_SLUG_QUERY = `
  query GetResearch($id: ID!, $idType: ResearchIdType!) {
    research(id: $id, idType: $idType) {
      id
      title
      slug
      date
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      researches {
        type
        author
        abstract
        pdfUpload {
          node {
            mediaItemUrl
            sourceUrl
          }
        }
        externalUrl
        citation
        keyFindings
      }
      seriesTag {
        nodes {
          name
          slug
        }
      }
      formats {
        nodes {
          name
          slug
        }
      }
      methods {
        nodes {
          name
          slug
        }
      }
      contentThemes {
        nodes {
          name
          slug
        }
      }
    }
  }
`

const GET_ALL_THEMES_QUERY = `
  query GetAllThemes {
    contentThemes(first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        description
        count
      }
    }
  }
`

function isWordPressNodeId(str: string): boolean {
  // WordPress node IDs are base64 encoded and typically contain ":" when decoded
  // Example: cG9zdDo4MA== decodes to "post:80"
  try {
    if (str.includes("==") || str.includes("=")) {
      const decoded = Buffer.from(str, "base64").toString("utf-8")
      return decoded.includes(":")
    }
  } catch {
    return false
  }
  return false
}

export function decodeNodeId(nodeId: string): string {
  try {
    const decoded = Buffer.from(nodeId, "base64").toString("utf-8")
    return decoded.split(":")[1] || nodeId
  } catch (error) {
    return nodeId
  }
}

export async function fetchPostBySlugGraphQL(idOrSlug: string): Promise<PostNode | null> {
  interface PostResponse {
    post: PostNode | null
  }

  const idType = isWordPressNodeId(idOrSlug) ? "ID" : "SLUG"

  const data = await fetchGraphQL<PostResponse>(GET_POST_BY_ID_OR_SLUG_QUERY, {
    id: idOrSlug,
    idType,
  })

  return data?.post || null
}

export async function fetchEpisodeBySlugGraphQL(idOrSlug: string): Promise<EpisodeNode | null> {
  interface EpisodeResponse {
    episode: EpisodeNode | null
  }

  const idType = isWordPressNodeId(idOrSlug) ? "ID" : "SLUG"

  const data = await fetchGraphQL<EpisodeResponse>(GET_EPISODE_BY_ID_OR_SLUG_QUERY, {
    id: idOrSlug,
    idType,
  })

  return data?.episode || null
}

export async function fetchResearchBySlugGraphQL(idOrSlug: string): Promise<ResearchNode | null> {
  interface ResearchResponse {
    research: ResearchNode | null
  }

  const idType = isWordPressNodeId(idOrSlug) ? "ID" : "SLUG"

  const data = await fetchGraphQL<ResearchResponse>(GET_RESEARCH_BY_ID_OR_SLUG_QUERY, {
    id: idOrSlug,
    idType,
  })

  return data?.research || null
}

// Core Fetch Function
export async function fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T | null> {
  if (!GRAPHQL_ENDPOINT) {
    return null
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const json = await response.json()

    if (json.errors) {
      return null
    }

    return json.data as T
  } catch (error) {
    return null
  }
}

// Content Fetching Functions
export interface FetchContentParams {
  slug?: string[]
  search?: string
  first?: number
  after?: string
}

export async function fetchContentByTheme(params: FetchContentParams = {}) {
  const { slug, search, first = 10, after } = params

  const data = await fetchGraphQL<ContentThemeResponse>(GET_CONTENT_THEMES_QUERY, {
    slug,
    search,
    first,
    after,
  })

  return data?.contentThemes.nodes || []
}

export async function fetchAllPosts(params: Omit<FetchContentParams, "slug"> = {}) {
  const data = await fetchContentByTheme(params)
  return data.flatMap((theme) => theme.posts.nodes)
}

export async function fetchAllEpisodes(params: Omit<FetchContentParams, "slug"> = {}) {
  const data = await fetchContentByTheme(params)
  return data.flatMap((theme) => theme.episodes.nodes)
}

export const fetchAllPodcasts = fetchAllEpisodes

export async function fetchAllResearch(params: Omit<FetchContentParams, "slug"> = {}) {
  const data = await fetchContentByTheme(params)
  return data.flatMap((theme) => theme.researches.nodes)
}

export async function fetchPostsByTheme(themeSlug: string, params: Omit<FetchContentParams, "slug"> = {}) {
  const data = await fetchContentByTheme({ ...params, slug: [themeSlug] })
  return data[0]?.posts.nodes || []
}

export async function fetchEpisodesByTheme(themeSlug: string, params: Omit<FetchContentParams, "slug"> = {}) {
  const data = await fetchContentByTheme({ ...params, slug: [themeSlug] })
  return data[0]?.episodes.nodes || []
}

export async function fetchResearchByTheme(themeSlug: string, params: Omit<FetchContentParams, "slug"> = {}) {
  const data = await fetchContentByTheme({ ...params, slug: [themeSlug] })
  return data[0]?.researches.nodes || []
}

// Single Item Fetching
export async function fetchPostBySlug(idOrSlug: string): Promise<PostNode | null> {
  return fetchPostBySlugGraphQL(idOrSlug)
}

export async function fetchEpisodeBySlug(idOrSlug: string): Promise<EpisodeNode | null> {
  return fetchEpisodeBySlugGraphQL(idOrSlug)
}

export async function fetchResearchBySlug(idOrSlug: string): Promise<ResearchNode | null> {
  return fetchResearchBySlugGraphQL(idOrSlug)
}

// Helper Functions
export function extractFeaturedImageUrl(item: PostNode | EpisodeNode | ResearchNode): string | null {
  return item.featuredImage?.node.sourceUrl || null
}

export function extractFeaturedImageAlt(item: PostNode | EpisodeNode | ResearchNode): string {
  return item.featuredImage?.node.altText || item.title
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getSeriesTags(item: PostNode | EpisodeNode | ResearchNode): string[] {
  return item.seriesTag?.nodes.map((tag) => tag.name) || []
}

export function getFormats(item: PostNode | EpisodeNode | ResearchNode): string[] {
  return item.formats?.nodes.map((format) => format.name) || []
}

export function getMethods(item: ResearchNode): string[] {
  return item.methods?.nodes.map((method) => method.name) || []
}

export function extractPdfUrlFromGraphQL(research: ResearchNode): string | null {
  if (!research.researches?.pdfUpload?.node) {
    return null
  }

  const pdfNode = research.researches.pdfUpload.node

  if (pdfNode.mediaItemUrl) {
    return pdfNode.mediaItemUrl
  }

  if (pdfNode.sourceUrl) {
    return pdfNode.sourceUrl
  }

  return null
}

export function extractAudioUrlFromGraphQL(episode: EpisodeNode): string | null {
  if (episode.episodes?.audioUrl) {
    return episode.episodes.audioUrl
  }

  if (episode.content) {
    const audioUrlMatch = episode.content.match(/https?:\/\/[^\s<>"]+\.(?:mp3|m4a|wav|ogg)/i)
    if (audioUrlMatch) {
      return audioUrlMatch[0]
    }
  }

  return null
}

export function parseKeyFindings(keyFindingsHtml: string | null): string[] {
  if (!keyFindingsHtml) return []

  // Remove HTML tags and extract text content
  const text = keyFindingsHtml.replace(/<[^>]*>/g, " ").trim()

  // Split by common list patterns
  const findings = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.match(/^(ul|li|p|data-)/))

  return findings
}

// Stats Fetching Function
export async function fetchContentStats() {
  if (!GRAPHQL_ENDPOINT) {
    return {
      episodes: 0,
      research: 0,
      caseStudies: 0,
      themes: 0,
    }
  }

  try {
    const [episodes, researches, posts, themes] = await Promise.all([
      fetchAllEpisodes({ first: 10 }).catch(() => []),
      fetchAllResearch({ first: 10 }).catch(() => []),
      fetchAllPosts({ first: 10 }).catch(() => []),
      fetchContentByTheme({ first: 10 }).catch(() => []),
    ])

    return {
      episodes: episodes.length,
      research: researches.length,
      caseStudies: posts.length,
      themes: themes.length,
    }
  } catch (error) {
    return {
      episodes: 0,
      research: 0,
      caseStudies: 0,
      themes: 0,
    }
  }
}

export async function fetchAllThemes() {
  interface ThemesResponse {
    contentThemes: {
      nodes: Array<{
        id: string
        databaseId: string
        name: string
        slug: string
        description: string | null
        count: number
      }>
    }
  }

  const data = await fetchGraphQL<ThemesResponse>(GET_ALL_THEMES_QUERY)
  return data?.contentThemes.nodes || []
}
