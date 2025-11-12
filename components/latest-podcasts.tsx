"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAllEpisodes } from "@/lib/wordpress-graphql"
import { adaptEpisodeFromGraphQL, type FrontendEpisode } from "@/lib/graphql-adapter"
import { ContentCard } from "@/components/content-card"

export function LatestPodcasts() {
  const [podcasts, setPodcasts] = useState<FrontendEpisode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPodcasts() {
      try {
        const data = await fetchAllEpisodes({ first: 3 })
        if (data && data.length > 0) {
          const adapted = data.map(adaptEpisodeFromGraphQL)
          const uniquePodcasts = Array.from(new Map(adapted.map((item) => [`${item.id}-${item.slug}`, item])).values())
          setPodcasts(uniquePodcasts.slice(0, 3))
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    loadPodcasts()
  }, [])

  if (loading) {
    return (
      <section className="border-b border-border/50 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 w-72 rounded-xl bg-muted/50" />
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted/50" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (podcasts.length === 0) {
    return (
      <section className="border-b border-border/50 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground">Latest Episodes</h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">No episodes available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    null
  )
}
