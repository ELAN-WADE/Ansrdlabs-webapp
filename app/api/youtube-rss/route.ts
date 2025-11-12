import { NextResponse } from "next/server"

export async function GET() {
  try {
    const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID

    if (!channelId) {
      return NextResponse.json({ error: "YouTube channel ID not configured" }, { status: 500 })
    }

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NextJS/14.0)",
      },
    })

    if (!response.ok) {
      throw new Error(`YouTube RSS feed returned ${response.status}`)
    }

    const xmlText = await response.text()

    const videos: Array<{
      id: string
      title: string
      description: string
      thumbnail: string
      link: string
      pubDate: string
    }> = []

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    const entries = xmlText.match(entryRegex) || []

    for (let i = 0; i < Math.min(entries.length, 6); i++) {
      const entry = entries[i]

      const titleMatch = entry.match(/<title>(.*?)<\/title>/)
      const linkMatch = entry.match(/<link href="(.*?)"/)
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      const thumbnailMatch = entry.match(/<media:thumbnail url="(.*?)"/)
      const descriptionMatch = entry.match(/<media:description>(.*?)<\/media:description>/)

      if (titleMatch && linkMatch && videoIdMatch) {
        const pubDate = publishedMatch ? new Date(publishedMatch[1]) : new Date()

        videos.push({
          id: videoIdMatch[1],
          title: titleMatch[1],
          description: (descriptionMatch?.[1] || "").substring(0, 150),
          thumbnail: thumbnailMatch?.[1] || "",
          link: linkMatch[1],
          pubDate: pubDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        })
      }
    }

    return NextResponse.json({ videos })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch YouTube feed" },
      { status: 500 },
    )
  }
}
