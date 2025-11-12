import { NextResponse } from "next/server"
import { fetchContentStats } from "@/lib/wordpress-graphql"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))

    const statsPromise = fetchContentStats()

    const stats = (await Promise.race([statsPromise, timeoutPromise])) as Awaited<ReturnType<typeof fetchContentStats>>

    return NextResponse.json(stats)
  } catch (error) {
    // Return fallback stats if WordPress API fails or times out
    return NextResponse.json({
      episodes: 0,
      research: 0,
      caseStudies: 0,
      themes: 0,
    })
  }
}
