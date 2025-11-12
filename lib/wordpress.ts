const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL
const WP_RSS_URL = process.env.NEXT_PUBLIC_WP_RSS_URL
const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL

// Check if WordPress API is properly configured - removed placeholder check
const isWordPressConfigured = !!(WP_API_URL && WP_API_URL.trim() && !WP_API_URL.includes("localhost"))
const isGraphQLConfigured = !!(WP_GRAPHQL_URL && WP_GRAPHQL_URL.trim() && !WP_GRAPHQL_URL.includes("localhost"))

// ============================================================================
// TypeScript Types - REST API
// ============================================================================

export interface WordPressPost {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  modified: string
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  theme?: number[]
  series?: number[]
  format?: number[]
  methods?: number[]
  geography?: number[]
  audience?: number[]
  decision_science?: number[]
  acf?: {
    audio_url?: string
    video_url?: string
    duration?: string
    transcript?: string
    show_notes?: string
    sources?: string
    pdf_url?: string
    pdfUpload?: {
      ID?: number
      url?: string
      mediaItemUrl?: string
    }
    authors?: string
    abstract?: string
    citation?: string
    doi?: string
    pages?: number
    downloads?: number
    research_type?: string
    key_findings?: string[]
    related_content?: Array<{ type: string; title: string; href: string }>
  }
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
      media_details?: {
        width: number
        height: number
      }
    }>
    author?: Array<{
      id: number
      name: string
      avatar_urls: Record<string, string>
      description?: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
        taxonomy: string
        description?: string
        count?: number
      }>
    >
  }
}

export interface WordPressTaxonomy {
  id: number
  name: string
  slug: string
  count: number
  description?: string
  taxonomy?: string
  parent?: number
  meta?: any
}

export interface WordPressStats {
  episodes: number
  research: number
  caseStudies: number
  blogPosts: number
}

export interface FetchPostsParams {
  type?: "posts" | "episodes" | "research"
  per_page?: number
  page?: number
  categories?: string
  tags?: string
  theme?: string
  series?: string
  format?: string
  methods?: string
  geography?: string
  audience?: string
  decision_science?: string
  search?: string
  _embed?: boolean
  orderby?: "date" | "title" | "modified"
  order?: "asc" | "desc"
}

// ============================================================================
// TypeScript Types - GraphQL
// ============================================================================

export interface FeaturedImage {
  node: {
    sourceUrl: string
    altText: string
    mediaDetails: {
      width: number
      height: number
    }
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

export interface PostNode {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  featuredImage: FeaturedImage | null
  seriesTag: SeriesTag
  formats: Format
  postFields: {
    decksubtitle: string | null
    estimatedReadTime: string | null
    externalMirror: string | null
    reference: string | null
    pullQoutes: string | null
  }
}

export interface EpisodeNode {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  featuredImage: FeaturedImage | null
  seriesTag: SeriesTag
  formats: Format
  episodeFields: {
    episodeNumber: number | null
    duration: string | null
    audioUrl: string | null
  }
}

export interface ResearchNode {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  featuredImage: FeaturedImage | null
  seriesTag: SeriesTag
  formats: Format
  methods: Method
  researchFields: {
    type: string | null
    author: string | null
    abstract: string | null
    pdfUpload: {
      mediaItemUrl: string
    } | null
    externalUrl: string | null
    citation: string | null
    keyFindings: string | null
  }
}

export interface ContentThemeNode {
  id: string
  name: string
  slug: string
  description: string | null
  posts: {
    nodes: PostNode[]
    pageInfo: PageInfo
  }
  episodes: {
    nodes: EpisodeNode[]
    pageInfo: PageInfo
  }
  researches: {
    nodes: ResearchNode[]
    pageInfo: PageInfo
  }
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

export interface ContentThemeResponse {
  contentTheme: ContentThemeNode
}

export interface FetchContentParams {
  first?: number
  after?: string
}

// ============================================================================
// Core Fetch Functions - REST API
// ============================================================================

export async function fetchPosts(params: FetchPostsParams = {}): Promise<WordPressPost[]> {
  if (!isWordPressConfigured) {
    console.log("[v0] WordPress API not configured, using fallback data")
    return []
  }

  const { type = "posts", per_page = 10, _embed = true, ...rest } = params

  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    _embed: _embed.toString(),
    ...Object.fromEntries(Object.entries(rest).filter(([_, v]) => v != null)),
  })

  const endpoint = type === "posts" ? "posts" : type

  try {
    const response = await fetch(`${WP_API_URL}/${endpoint}?${queryParams}`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error(`[v0] Failed to fetch ${type}: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    console.log(`[v0] Successfully fetched ${data.length} ${type}`)
    return data as WordPressPost[]
  } catch (error) {
    console.error(`[v0] Error fetching ${type}:`, error)
    return []
  }
}

export async function fetchPostBySlug(
  slug: string,
  type: "posts" | "episodes" | "research" = "posts",
): Promise<WordPressPost | null> {
  if (!isWordPressConfigured) {
    console.log("[v0] WordPress API not configured")
    return null
  }

  const endpointMap: Record<string, string> = {
    posts: "posts",
    episodes: "episodes",
    research: "research",
  }

  const endpoint = endpointMap[type] || type

  try {
    let url = `${WP_API_URL}/${endpoint}?slug=${slug}&_embed=true`
    console.log(`[v0] Fetching ${type} by slug: ${slug} from ${url}`)

    let response = await fetch(url, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      console.error(`[v0] Failed to fetch ${type} ${slug}: ${response.status} ${response.statusText}`)
      return null
    }

    const posts = (await response.json()) as WordPressPost[]

    // If no results by slug, try by ID
    if (posts.length === 0 && !isNaN(Number(slug))) {
      console.log(`[v0] No ${type} found with slug: ${slug}, trying by ID...`)
      url = `${WP_API_URL}/${endpoint}/${slug}?_embed=true`
      console.log(`[v0] Fetching ${type} by ID: ${slug} from ${url}`)

      response = await fetch(url, {
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        console.error(`[v0] Failed to fetch ${type} by ID ${slug}: ${response.status}`)
        return null
      }

      const post = (await response.json()) as WordPressPost
      console.log(`[v0] Successfully fetched ${type} by ID: ${post.title.rendered}`)
      return post
    }

    if (posts.length === 0) {
      console.warn(`[v0] No ${type} found with slug: ${slug}`)
      return null
    }

    console.log(`[v0] Successfully fetched ${type} by slug: ${posts[0].title.rendered}`)
    return posts[0]
  } catch (error) {
    console.error(`[v0] Error fetching ${type} ${slug}:`, error)
    return null
  }
}

// ============================================================================
// GraphQL Functions
// ============================================================================

async function graphqlFetch<T>(query: string, variables?: Record<string, any>): Promise<T | null> {
  if (!isGraphQLConfigured) {
    console.log("[v0] WordPress GraphQL endpoint not configured")
    return null
  }

  try {
    const response = await fetch(WP_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      console.error(`[v0] GraphQL request failed: ${response.status}`)
      return null
    }

    const { data, errors } = await response.json()

    if (errors) {
      console.warn("[v0] GraphQL errors (this is normal if custom fields aren't registered):", errors)
      // Return data even if there are errors, as some fields might still be available
      if (data) {
        return data as T
      }
      return null
    }

    return data as T
  } catch (error) {
    console.error("[v0] GraphQL fetch error:", error)
    return null
  }
}

export async function fetchAllPosts(params: FetchContentParams = {}): Promise<PostNode[]> {
  const { first = 10, after } = params

  const query = `
    query GetAllPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after) {
        nodes {
          id
          slug
          title
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
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
          postFields {
            decksubtitle
            estimatedReadTime
            externalMirror
            reference
            pullQoutes
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `

  const data = await graphqlFetch<{ posts: { nodes: PostNode[] } }>(query, { first, after })
  return data?.posts?.nodes || []
}

export async function fetchAllEpisodes(params: FetchContentParams = {}): Promise<EpisodeNode[]> {
  const { first = 10, after } = params

  const query = `
    query GetAllEpisodes($first: Int!, $after: String) {
      episodes(first: $first, after: $after) {
        nodes {
          id
          slug
          title
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
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
          episodeFields {
            episodeNumber
            duration
            audioUrl
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `

  const data = await graphqlFetch<{ episodes: { nodes: EpisodeNode[] } }>(query, { first, after })
  return data?.episodes?.nodes || []
}

export async function fetchAllResearch(params: FetchContentParams = {}): Promise<ResearchNode[]> {
  const { first = 10, after } = params

  const query = `
    query GetAllResearch($first: Int!, $after: String) {
      researches(first: $first, after: $after) {
        nodes {
          id
          slug
          title
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
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
          researchFields {
            type
            author
            abstract
            pdfUpload {
              mediaItemUrl
            }
            externalUrl
            citation
            keyFindings
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `

  const data = await graphqlFetch<{ researches: { nodes: ResearchNode[] } }>(query, { first, after })
  return data?.researches?.nodes || []
}

export async function fetchPostsByTheme(themeSlug: string, params: FetchContentParams = {}): Promise<PostNode[]> {
  const { first = 10, after } = params

  const query = `
    query GetPostsByTheme($slug: ID!, $first: Int!, $after: String) {
      contentTheme(id: $slug, idType: SLUG) {
        posts(first: $first, after: $after) {
          nodes {
            id
            slug
            title
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
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
            postFields {
              decksubtitle
              estimatedReadTime
            }
          }
        }
      }
    }
  `

  const data = await graphqlFetch<ContentThemeResponse>(query, { slug: themeSlug, first, after })
  return data?.contentTheme?.posts?.nodes || []
}

export async function fetchEpisodesByTheme(themeSlug: string, params: FetchContentParams = {}): Promise<EpisodeNode[]> {
  const { first = 10, after } = params

  const query = `
    query GetEpisodesByTheme($slug: ID!, $first: Int!, $after: String) {
      contentTheme(id: $slug, idType: SLUG) {
        episodes(first: $first, after: $after) {
          nodes {
            id
            slug
            title
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            seriesTag {
              nodes {
                name
                slug
              }
            }
            episodeFields {
              episodeNumber
              duration
              audioUrl
            }
          }
        }
      }
    }
  `

  const data = await graphqlFetch<ContentThemeResponse>(query, { slug: themeSlug, first, after })
  return data?.contentTheme?.episodes?.nodes || []
}

export async function fetchResearchByTheme(
  themeSlug: string,
  params: FetchContentParams = {},
): Promise<ResearchNode[]> {
  const { first = 10, after } = params

  const query = `
    query GetResearchByTheme($slug: ID!, $first: Int!, $after: String) {
      contentTheme(id: $slug, idType: SLUG) {
        researches(first: $first, after: $after) {
          nodes {
            id
            slug
            title
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            methods {
              nodes {
                name
                slug
              }
            }
            researchFields {
              type
              author
              abstract
            }
          }
        }
      }
    }
  `

  const data = await graphqlFetch<ContentThemeResponse>(query, { slug: themeSlug, first, after })
  return data?.contentTheme?.researches?.nodes || []
}

export async function fetchPostBySlugGraphQL(slug: string): Promise<PostNode | null> {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        slug
        title
        excerpt
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
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
        postFields {
          decksubtitle
          estimatedReadTime
          externalMirror
          reference
          pullQoutes
        }
      }
    }
  `

  const data = await graphqlFetch<{ post: PostNode }>(query, { slug })
  return data?.post || null
}

export async function fetchEpisodeBySlugGraphQL(slug: string): Promise<EpisodeNode | null> {
  const query = `
    query GetEpisodeBySlug($slug: ID!) {
      episode(id: $slug, idType: SLUG) {
        id
        slug
        title
        excerpt
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        seriesTag {
          nodes {
            name
            slug
          }
        }
        episodeFields {
          episodeNumber
          duration
          audioUrl
        }
      }
    }
  `

  const data = await graphqlFetch<{ episode: EpisodeNode }>(query, { slug })
  return data?.episode || null
}

export async function fetchResearchBySlugGraphQL(slug: string): Promise<ResearchNode | null> {
  const query = `
    query GetResearchBySlug($slug: ID!) {
      research(id: $slug, idType: SLUG) {
        id
        slug
        title
        excerpt
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        methods {
          nodes {
            name
            slug
          }
        }
        researchFields {
          type
          author
          abstract
          pdfUpload {
            mediaItemUrl
          }
          externalUrl
          citation
          keyFindings
        }
      }
    }
  `

  const data = await graphqlFetch<{ research: ResearchNode }>(query, { slug })
  return data?.research || null
}

// ============================================================================
// GraphQL Helper Functions
// ============================================================================

export function extractFeaturedImageUrl(item: PostNode | EpisodeNode | ResearchNode): string {
  return item.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=400&width=600"
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getSeriesTags(item: PostNode | EpisodeNode | ResearchNode): string[] {
  return item.seriesTag?.nodes?.map((tag) => tag.name) || []
}

export function getFormats(item: PostNode | EpisodeNode | ResearchNode): string[] {
  return item.formats?.nodes?.map((format) => format.name) || []
}

export function getMethods(item: ResearchNode): string[] {
  return item.methods?.nodes?.map((method) => method.name) || []
}

// ============================================================================
// Taxonomy Functions - REST API
// ============================================================================

export async function fetchTaxonomy(
  taxonomy: string,
  params: { per_page?: number; parent?: number } = {},
): Promise<WordPressTaxonomy[]> {
  if (!isWordPressConfigured) {
    console.log(`[v0] WordPress API not configured, skipping taxonomy ${taxonomy}`)
    return []
  }

  const { per_page = 100, parent } = params

  const queryParams = new URLSearchParams({
    per_page: per_page.toString(),
    ...(parent !== undefined && { parent: parent.toString() }),
  })

  try {
    const response = await fetch(`${WP_API_URL}/${taxonomy}?${queryParams}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log(
          `[v0] Taxonomy ${taxonomy} not found on WordPress site - this is normal if the taxonomy isn't registered`,
        )
      } else {
        console.error(`[v0] Failed to fetch taxonomy ${taxonomy}: ${response.status}`)
      }
      return []
    }

    const data = await response.json()
    console.log(`[v0] Successfully fetched ${data.length} ${taxonomy} terms`)
    return data as WordPressTaxonomy[]
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.log(`[v0] Taxonomy ${taxonomy} endpoint not available - this is expected if not registered`)
    } else {
      console.error(`[v0] Error fetching taxonomy ${taxonomy}:`, error)
    }
    return []
  }
}

export async function fetchThemes() {
  return fetchTaxonomy("theme")
}

export async function fetchSeries() {
  return fetchTaxonomy("series")
}

export async function fetchFormats() {
  return fetchTaxonomy("format")
}

export async function fetchMethods() {
  return fetchTaxonomy("methods")
}

export async function fetchGeography(parent?: number) {
  return fetchTaxonomy("geography", { parent })
}

export async function fetchAudience() {
  return fetchTaxonomy("audience")
}

export async function fetchDecisionScience() {
  return fetchTaxonomy("decision_science")
}

// ============================================================================
// Content Type Specific Functions - REST API
// ============================================================================

export async function fetchPodcastEpisodes(params: Omit<FetchPostsParams, "type"> = {}) {
  return fetchPosts({ ...params, type: "episodes" })
}

export async function fetchResearchPapers(params: Omit<FetchPostsParams, "type"> = {}) {
  return fetchPosts({ ...params, type: "research" })
}

export async function fetchBlogPosts(params: Omit<FetchPostsParams, "type"> = {}) {
  return fetchPosts({ ...params, type: "posts" })
}

// ============================================================================
// Stats & Analytics
// ============================================================================

export async function fetchStats(): Promise<WordPressStats> {
  if (!isWordPressConfigured) {
    console.log("[v0] WordPress API not configured, returning zero stats")
    return { episodes: 0, research: 0, caseStudies: 0, blogPosts: 0 }
  }

  try {
    const [episodes, research, caseStudies, blogPosts] = await Promise.all([
      fetch(`${WP_API_URL}/episodes?per_page=1`).then((r) => r.headers.get("X-WP-Total") || "0"),
      fetch(`${WP_API_URL}/research?per_page=1`).then((r) => r.headers.get("X-WP-Total") || "0"),
      fetch(`${WP_API_URL}/posts?per_page=1&categories=case-studies`).then((r) => r.headers.get("X-WP-Total") || "0"),
      fetch(`${WP_API_URL}/posts?per_page=1`).then((r) => r.headers.get("X-WP-Total") || "0"),
    ])

    const stats = {
      episodes: Number.parseInt(episodes),
      research: Number.parseInt(research),
      caseStudies: Number.parseInt(caseStudies),
      blogPosts: Number.parseInt(blogPosts),
    }

    console.log("[v0] Fetched stats:", stats)
    return stats
  } catch (error) {
    console.error("[v0] Failed to fetch stats:", error)
    return { episodes: 0, research: 0, caseStudies: 0, blogPosts: 0 }
  }
}

// ============================================================================
// RSS Feed Integration
// ============================================================================

export async function fetchRSSFeed() {
  if (!WP_RSS_URL || WP_RSS_URL.includes("your-wordpress-site.com")) {
    console.log("[v0] WordPress RSS URL not configured")
    return null
  }

  try {
    const response = await fetch(WP_RSS_URL, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch RSS feed:", response.status)
      return null
    }

    const xml = await response.text()
    console.log("[v0] Successfully fetched RSS feed")
    return xml
  } catch (error) {
    console.error("[v0] Error fetching RSS feed:", error)
    return null
  }
}

// ============================================================================
// Helper Functions - REST API
// ============================================================================

export function extractFeaturedImage(post: WordPressPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null
}

export function extractAuthorName(post: WordPressPost): string | null {
  return post._embedded?.author?.[0]?.name || null
}

export function extractTerms(post: WordPressPost, taxonomy: string): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.["wp:term"]?.flat() || []
  return terms.filter((term) => term.taxonomy === taxonomy)
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export function extractPdfUrl(post: WordPressPost): string | null {
  console.log("[v0] Extracting PDF from post:", post.title.rendered)
  console.log("[v0] ACF data available:", !!post.acf)

  // Try multiple ACF field names for PDF
  if (post.acf?.pdfUpload?.mediaItemUrl) {
    console.log("[v0] Found PDF at pdfUpload.mediaItemUrl:", post.acf.pdfUpload.mediaItemUrl)
    return post.acf.pdfUpload.mediaItemUrl
  }
  if (post.acf?.pdfUpload?.url) {
    console.log("[v0] Found PDF at pdfUpload.url:", post.acf.pdfUpload.url)
    return post.acf.pdfUpload.url
  }
  if (post.acf?.pdf_url) {
    console.log("[v0] Found PDF at pdf_url:", post.acf.pdf_url)
    return post.acf.pdf_url
  }

  // Check if pdfUpload is a direct URL string
  if (typeof post.acf?.pdfUpload === "string") {
    console.log("[v0] Found PDF as direct string:", post.acf.pdfUpload)
    return post.acf.pdfUpload
  }

  // Check if pdfUpload is a number (attachment ID) - we need to construct the URL
  if (typeof post.acf?.pdfUpload === "number") {
    console.log("[v0] Found PDF as attachment ID:", post.acf.pdfUpload)
    // We'll need to fetch the media item separately or use the ID
    return null
  }

  console.log("[v0] No PDF URL found in ACF fields")
  return null
}

export function extractAudioUrl(post: WordPressPost): string | null {
  console.log("[v0] Extracting audio from post:", post.title.rendered)
  console.log("[v0] ACF data available:", !!post.acf)

  // Try multiple ACF field names for audio
  if (post.acf?.audio_url) {
    console.log("[v0] Found audio at audio_url:", post.acf.audio_url)
    return post.acf.audio_url
  }

  if (post.acf?.audioUrl) {
    console.log("[v0] Found audio at audioUrl:", post.acf.audioUrl)
    return post.acf.audioUrl
  }

  // Check if audio_file is available
  if (post.acf?.audio_file) {
    if (typeof post.acf.audio_file === "string") {
      console.log("[v0] Found audio as direct string:", post.acf.audio_file)
      return post.acf.audio_file
    }
    if (typeof post.acf.audio_file === "object" && post.acf.audio_file.url) {
      console.log("[v0] Found audio at audio_file.url:", post.acf.audio_file.url)
      return post.acf.audio_file.url
    }
  }

  console.log("[v0] No audio URL found in ACF fields")
  return null
}

export function extractAbstract(post: WordPressPost): string | null {
  if (post.acf?.abstract) {
    return post.acf.abstract
  }

  // Fallback to excerpt if no abstract
  if (post.excerpt?.rendered) {
    return stripHtml(post.excerpt.rendered)
  }

  return null
}

export function extractResearchFields(post: WordPressPost) {
  return {
    abstract: extractAbstract(post),
    pdfUrl: extractPdfUrl(post),
    authors: post.acf?.authors || post.acf?.author || null,
    citation: post.acf?.citation || null,
    doi: post.acf?.doi || post.acf?.external_url || null,
    researchType: post.acf?.research_type || post.acf?.type || null,
    keyFindings: post.acf?.key_findings || post.acf?.keyFindings || null,
  }
}

export function extractPodcastFields(post: WordPressPost) {
  return {
    audioUrl: extractAudioUrl(post),
    videoUrl: post.acf?.video_url || post.acf?.videoUrl || null,
    duration: post.acf?.duration || null,
    transcript: post.acf?.transcript || null,
    showNotes: post.acf?.show_notes || post.acf?.showNotes || null,
    sources: post.acf?.sources || null,
    episodeNumber: post.acf?.episode_number || post.acf?.episodeNumber || null,
  }
}
