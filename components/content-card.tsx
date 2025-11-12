"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, FileText, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface ContentCardProps {
  type: "blog" | "podcast" | "research"
  id: string
  slug: string
  title: string
  excerpt?: string
  date: string
  featuredImage?: string | null
  themes?: string[]
  duration?: string | null
  readTime?: string | null
  format?: string | null
  index?: number
}

export function ContentCard({
  type,
  id,
  slug,
  title,
  excerpt,
  date,
  featuredImage,
  themes = [],
  duration,
  readTime,
  format,
  index = 0,
}: ContentCardProps) {
  const href = `/${type}/${slug}`
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const getIcon = () => {
    switch (type) {
      case "podcast":
        return <Play className="h-4 w-4" />
      case "research":
        return <FileText className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getMetaInfo = () => {
    if (type === "podcast" && duration) return duration
    if (type === "blog" && readTime) return readTime
    if (type === "research" && format) return format
    return null
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={href} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2">
          {/* Image Section */}
          {featuredImage && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={featuredImage || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 card-image-enhanced"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

              {/* Floating Icon for Podcast */}
              {type === "podcast" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-accent p-6 shadow-2xl shadow-accent/50 backdrop-blur-sm"
                  >
                    <Play className="h-8 w-8 fill-accent-foreground text-accent-foreground" />
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Themes */}
            {themes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {themes.slice(0, 2).map((theme) => (
                  <Badge
                    key={theme}
                    variant="secondary"
                    className="bg-accent/10 text-accent border-accent/20 font-medium"
                  >
                    {theme}
                  </Badge>
                ))}
                {themes.length > 2 && (
                  <Badge variant="outline" className="border-border/50 text-muted-foreground">
                    +{themes.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Title */}
            <h3 className="font-serif text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-accent line-clamp-3">
              {title}
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {excerpt
                  .replace(/<[^>]*>/g, "")
                  .replace(/&hellip;/g, "...")
                  .replace(/&nbsp;/g, " ")
                  .trim()}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {getIcon()}
                {formattedDate}
              </span>
              {getMetaInfo() && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {getMetaInfo()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Accent Border on Hover */}
          <div className="absolute inset-0 rounded-2xl border-2 border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        </div>
      </Link>
    </motion.article>
  )
}
