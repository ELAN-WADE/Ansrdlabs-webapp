import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rssUrl = searchParams.get("url")

  if (!rssUrl) {
    return NextResponse.json({ error: "RSS URL is required" }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "ANSRd Labs Podcast Player/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: controller.signal,
      redirect: "follow",
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`)
    }

    const rssText = await response.text()

    const enclosureRegex = /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']audio\/[^"']+["']/gi
    const matches = [...rssText.matchAll(enclosureRegex)]

    if (matches.length === 0) {
      const altRegex = /<enclosure[^>]+url=["']([^"']+\.(?:mp3|m4a|wav|ogg))["']/gi
      matches.push(...rssText.matchAll(altRegex))
    }

    if (matches.length === 0) {
      const mediaRegex = /<media:content[^>]+url=["']([^"']+)["'][^>]*type=["']audio\/[^"']+["']/gi
      matches.push(...rssText.matchAll(mediaRegex))
    }

    if (matches.length === 0) {
      const guidRegex = /<guid[^>]*>([^<]+\.mp3)<\/guid>/gi
      matches.push(...rssText.matchAll(guidRegex))
    }

    if (matches.length === 0) {
      return NextResponse.json({ error: "No audio files found in RSS feed" }, { status: 404 })
    }

    const audioUrls = matches.map((match) => match[1])

    return NextResponse.json({
      audioUrl: audioUrls[0],
      allAudioUrls: audioUrls,
      count: audioUrls.length,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { error: "RSS feed request timed out", details: "The request took too long to complete" },
          { status: 504 },
        )
      }
      return NextResponse.json({ error: "Failed to parse RSS feed", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to parse RSS feed", details: "Unknown error" }, { status: 500 })
  }
}
