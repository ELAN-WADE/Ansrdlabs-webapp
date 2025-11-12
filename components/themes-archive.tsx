"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Bus,
  Shield,
  Utensils,
  Heart,
  GraduationCap,
  Home,
  Building2,
  Leaf,
  DollarSign,
  Palette,
  HeartPulse,
  Search,
} from "lucide-react"
import { fetchAllThemes } from "@/lib/wordpress-graphql"
import { Input } from "@/components/ui/input"

const themeIcons: Record<string, any> = {
  transport: Bus,
  trust: Shield,
  food: Utensils,
  dignity: Heart,
  education: GraduationCap,
  health: HeartPulse,
  housing: Home,
  governance: Building2,
  environment: Leaf,
  economy: DollarSign,
  culture: Palette,
}

const themeColors: Record<string, string> = {
  transport: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-600 dark:text-blue-400",
  trust: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-600 dark:text-purple-400",
  food: "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-600 dark:text-amber-400",
  dignity: "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-600 dark:text-pink-400",
  education: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-600 dark:text-green-400",
  health: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
  housing: "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-600 dark:text-orange-400",
  governance: "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  environment: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  economy: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
  culture: "from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-600 dark:text-violet-400",
}

const themeImages: Record<string, string> = {
  transport: "/african-public-transport-bus.jpg",
  trust: "/digital-trust-mobile-payment-africa.jpg",
  food: "/african-food-market-vendors.jpg",
  dignity: "/african-community-dignity-respect.jpg",
  education: "/african-students-learning-in-classroom-with-books-.jpg",
  health: "/african-healthcare-workers-and-patients-in-modern-.jpg",
}

export function ThemesArchive() {
  const [themes, setThemes] = useState<
    Array<{ id: number; name: string; slug: string; count: number; description?: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAllThemes()
      .then((data) => {
        const transformedThemes = data.map((theme) => ({
          id: Number.parseInt(theme.databaseId || "0"),
          name: theme.name || "",
          slug: theme.slug || "",
          count: theme.count || 0,
          description: theme.description || `Explore ${theme.name?.toLowerCase()} content`,
        }))
        setThemes(transformedThemes)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const filteredThemes = themes.filter(
    (theme) =>
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-serif text-5xl font-bold text-foreground lg:text-6xl text-balance">
              Explore All Themes
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground text-balance">
              Dive deep into the key themes that shape everyday life in African cities. Each theme represents a lens
              through which we examine decisions, systems, and outcomes.
            </p>

            {/* Search Bar */}
            <div className="mt-10 mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base rounded-full border-2 focus:border-accent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredThemes.map((theme, index) => {
                const Icon = themeIcons[theme.slug] || Bus
                const colorClasses =
                  themeColors[theme.slug] || "from-accent/20 to-accent/20 border-accent/30 text-accent"
                const imageUrl = themeImages[theme.slug]

                return (
                  <motion.div
                    key={theme.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/theme/${theme.slug}`}
                      className="group block h-full rounded-2xl border-2 bg-card overflow-hidden transition-all hover:border-accent/50 hover:shadow-2xl hover:-translate-y-2"
                    >
                      {imageUrl ? (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={theme.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className={`inline-flex rounded-xl p-3 bg-gradient-to-br border ${colorClasses}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`relative aspect-[4/3] bg-gradient-to-br border-b-2 ${colorClasses}`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="h-20 w-20 opacity-20" />
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <div className={`inline-flex rounded-xl p-3 bg-card border ${colorClasses}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="mb-3 font-serif text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {theme.name}
                        </h3>
                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {theme.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="text-sm font-semibold text-muted-foreground">
                            {theme.count} {theme.count === 1 ? "item" : "items"}
                          </div>
                          <div className="text-sm font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {!loading && filteredThemes.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No themes found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
