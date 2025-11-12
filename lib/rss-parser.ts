/**
 * RSS Feed Parser for Podcasts and YouTube
 * Handles parsing and transforming RSS feeds into usable data
 */

export interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  guid?: string
  enclosure?: {
    url: string
    type: string
    length: string
  }
  image?: string
  duration?: string
  episodeNumber?: number
}

export interface RSSFeed {
  title: string
  link: string
  description: string
  image?: string
  items: RSSItem[]
}

/**
 * Parse RSS XML string into structured data
 */
export function parseRSSFeed(xmlString: string): RSSFeed | null {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, "text/xml")

    // Check for parsing errors
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      return null
    }

    // Extract channel info
    const channel = xmlDoc.getElementsByTagName("channel")[0]
    if (!channel) {
      return null
    }

    const feed: RSSFeed = {
      title: channel.getElementsByTagName("title")[0]?.textContent || "Unknown Feed",
      link: channel.getElementsByTagName("link")[0]?.textContent || "",
      description: channel.getElementsByTagName("description")[0]?.textContent || "",
      image: channel.getElementsByTagName("image")[0]?.getElementsByTagName("url")[0]?.textContent,
      items: [],
    }

    // Extract items
    const items = channel.getElementsByTagName("item")
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const enclosure = item.getElementsByTagName("enclosure")[0]

      const rssItem: RSSItem = {
        title: item.getElementsByTagName("title")[0]?.textContent || "Untitled",
        link: item.getElementsByTagName("link")[0]?.textContent || "",
        description: item.getElementsByTagName("description")[0]?.textContent || "",
        pubDate: item.getElementsByTagName("pubDate")[0]?.textContent || new Date().toISOString(),
        guid: item.getElementsByTagName("guid")[0]?.textContent,
        enclosure: enclosure
          ? {
              url: enclosure.getAttribute("url") || "",
              type: enclosure.getAttribute("type") || "",
              length: enclosure.getAttribute("length") || "",
            }
          : undefined,
        duration: item.getElementsByTagName("duration")[0]?.textContent,
        episodeNumber: Number.parseInt(item.getElementsByTagName("episodeNumber")[0]?.textContent || "0") || undefined,
      }

      feed.items.push(rssItem)
    }

    return feed
  } catch (error) {
    return null
  }
}

/**
 * Fetch and parse RSS feed from URL
 */
export async function fetchAndParseRSS(feedUrl: string): Promise<RSSFeed | null> {
  try {
    const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${feedUrl}`

    const response = await fetch(corsProxyUrl, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    if (!response.ok) {
      return null
    }

    const xmlString = await response.text()
    return parseRSSFeed(xmlString)
  } catch (error) {
    return null
  }
}

/**
 * Parse YouTube RSS feed (special handling for YouTube format)
 */
export async function parseYouTubeRSS(channelId: string): Promise<RSSFeed | null> {
  const youtubeRssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  return fetchAndParseRSS(youtubeRssUrl)
}

/**
 * Format RSS item date to readable format
 */
export function formatRSSDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return dateString
  }
}

/**
 * Extract plain text from HTML description
 */
export function stripRSSHtml(html: string): string {
  if (!html) return ""
  return (
    html
      .replace(/<[^>]*>/g, "")
      .trim()
      .substring(0, 200) + "..."
  )
}
