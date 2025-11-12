"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAllPosts } from "@/lib/wordpress-graphql"
import { adaptPostFromGraphQL, type FrontendPost } from "@/lib/graphql-adapter"
import { ContentCard } from "@/components/content-card"

export function LatestBlog() {
  const [articles, setArticles] = useState<FrontendPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchAllPosts({ first: 3 })
        if (data && data.length > 0) {
          const adapted = data.map(adaptPostFromGraphQL)
          const uniqueArticles = Array.from(
            new Map(adapted.map((article) => [`${article.id}-${article.slug}`, article])).values(),
          )
          setArticles(uniqueArticles)
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  if (loading) {
    return (
      <section className="border-b border-border/50 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 w-72 rounded-xl bg-card/50" />
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-card/50" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (articles.length === 0) {
    return (
      <section className="border-b border-border/50 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl font-bold text-foreground">Latest Articles</h2>
          <p className="mt-6 text-lg text-muted-foreground">No articles available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    null
  )
}
