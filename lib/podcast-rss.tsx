export interface PodcastRSSConfig {
  title: string
  description: string
  link: string
  language?: string
  copyright?: string
  author?: string
  email?: string
  image?: {
    url: string
    title: string
    link: string
  }
}

export interface PodcastEpisode {
  title: string
  description: string
  audioUrl: string
  duration: string
  pubDate: Date
  guid: string
  link: string
  image?: string
}

export function generatePodcastRSSFeed(config: PodcastRSSConfig, episodes: PodcastEpisode[]): string {
  const now = new Date().toUTCString()

  const episodesXml = episodes
    .map(
      (episode) => `
    <item>
      <title>${escapeXml(episode.title)}</title>
      <description>${escapeXml(episode.description)}</description>
      <link>${escapeXml(episode.link)}</link>
      <guid isPermaLink="false">${escapeXml(episode.guid)}</guid>
      <pubDate>${episode.pubDate.toUTCString()}</pubDate>
      <itunes:duration>${episode.duration}</itunes:duration>
      ${episode.image ? `<image><url>${escapeXml(episode.image)}</url></image>` : ""}
      <enclosure url="${escapeXml(episode.audioUrl)}" type="audio/mpeg" length="0" />
    </item>
  `,
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${escapeXml(config.link)}</link>
    <description>${escapeXml(config.description)}</description>
    <language>${config.language || "en-us"}</language>
    <copyright>${escapeXml(config.copyright || "")}</copyright>
    <lastBuildDate>${now}</lastBuildDate>
    <itunes:author>${escapeXml(config.author || "")}</itunes:author>
    <itunes:explicit>false</itunes:explicit>
    ${
      config.image
        ? `
    <image>
      <url>${escapeXml(config.image.url)}</url>
      <title>${escapeXml(config.image.title)}</title>
      <link>${escapeXml(config.image.link)}</link>
    </image>
    `
        : ""
    }
    ${
      config.email
        ? `
    <managingEditor>${escapeXml(config.email)}</managingEditor>
    `
        : ""
    }
    ${episodesXml}
  </channel>
</rss>`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function parsePodcastRSSFeed(feedUrl: string) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed")
    }

    const data = await response.json()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data.contents, "text/xml")

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Invalid RSS feed format")
    }

    const channel = xmlDoc.getElementsByTagName("channel")[0]
    const config: PodcastRSSConfig = {
      title: channel?.getElementsByTagName("title")[0]?.textContent || "Podcast",
      description: channel?.getElementsByTagName("description")[0]?.textContent || "",
      link: channel?.getElementsByTagName("link")[0]?.textContent || "",
      language: channel?.getElementsByTagName("language")[0]?.textContent || "en-us",
      copyright: channel?.getElementsByTagName("copyright")[0]?.textContent,
      author: channel?.getElementsByTagName("itunes:author")[0]?.textContent,
      email: channel?.getElementsByTagName("managingEditor")[0]?.textContent,
    }

    const episodes: PodcastEpisode[] = []
    const itemElements = xmlDoc.getElementsByTagName("item")

    for (let i = 0; i < itemElements.length; i++) {
      const item = itemElements[i]
      const title = item.getElementsByTagName("title")[0]?.textContent || "Untitled"
      const description = item.getElementsByTagName("description")[0]?.textContent || ""
      const link = item.getElementsByTagName("link")[0]?.textContent || ""
      const guid = item.getElementsByTagName("guid")[0]?.textContent || link
      const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || new Date().toISOString()
      const duration = item.getElementsByTagName("itunes:duration")[0]?.textContent || "00:00:00"
      const enclosure = item.getElementsByTagName("enclosure")[0]
      const audioUrl = enclosure?.getAttribute("url") || ""

      episodes.push({
        title,
        description: description.replace(/<[^>]*>/g, ""),
        audioUrl,
        duration,
        pubDate: new Date(pubDate),
        guid,
        link,
      })
    }

    return { config, episodes }
  } catch (error) {
    console.error("[v0] Error parsing podcast RSS feed:", error)
    throw error
  }
}
