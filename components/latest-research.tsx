"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAllResearch } from "@/lib/wordpress-graphql"
import { adaptResearchFromGraphQL, type FrontendResearch } from "@/lib/graphql-adapter"
import { ContentCard } from "@/components/content-card"

export function LatestResearch() {
  const [research, setResearch] = useState<FrontendResearch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResearch() {
      try {
        const data = await fetchAllResearch({ first: 3 })

        if (data && data.length > 0) {
          const adaptedData = data.map(adaptResearchFromGraphQL)
          const uniqueResearch = Array.from(
            new Map(adaptedData.map((item) => [`${item.id}-${item.slug}`, item])).values(),
          )
          setResearch(uniqueResearch.slice(0, 3))
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    loadResearch()
  }, [])

  if (loading) {
    return (
      <section className="border-b border-border/50 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 w-72 rounded-xl bg-card/50" />
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-card/50" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (research.length === 0) {
    return (
      <section className="border-b border-border/50 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground">Latest Research</h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">No research available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    null
  )
}
