"use client"
import Link from "next/link"
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
} from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAllThemes } from "@/lib/wordpress-graphql"
import Image from "next/image"

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
  transport: "text-[#3b82f6] bg-[#3b82f6]/10 hover:bg-[#3b82f6]/15 border-[#3b82f6]/20",
  trust: "text-[#8b5cf6] bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/15 border-[#8b5cf6]/20",
  food: "text-[#f59e0b] bg-[#f59e0b]/10 hover:bg-[#f59e0b]/15 border-[#f59e0b]/20",
  dignity: "text-[#ec4899] bg-[#ec4899]/10 hover:bg-[#ec4899]/15 border-[#ec4899]/20",
  education: "text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/15 border-[#10b981]/20",
  health: "text-[#06b6d4] bg-[#06b6d4]/10 hover:bg-[#06b6d4]/15 border-[#06b6d4]/20",
  housing: "text-[#f97316] bg-[#f97316]/10 hover:bg-[#f97316]/15 border-[#f97316]/20",
  governance: "text-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/15 border-[#6366f1]/20",
  environment: "text-[#22c55e] bg-[#22c55e]/10 hover:bg-[#22c55e]/15 border-[#22c55e]/20",
  economy: "text-[#eab308] bg-[#eab308]/10 hover:bg-[#eab308]/15 border-[#eab308]/20",
  culture: "text-[#a855f7] bg-[#a855f7]/10 hover:bg-[#a855f7]/15 border-[#a855f7]/20",
}

const themeImages: Record<string, string> = {
  transport: "/african-public-transport-bus.jpg",
  trust: "/digital-trust-mobile-payment-africa.jpg",
  food: "/african-food-market-vendors.jpg",
  dignity: "/african-community-dignity-respect.jpg",
  education: "/african-students-learning-in-classroom-with-books-.jpg",
  health: "/african-healthcare-workers-and-patients-in-modern-.jpg",
}

export function ThemesShowcase() {
  const [themes, setThemes] = useState<
    Array<{ id: number; name: string; slug: string; count: number; description?: string }>
  >([])
  const [loading, setLoading] = useState(true)

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

  const fallbackThemes = [
    {
      id: 1,
      name: "Transport",
      slug: "transport",
      count: 24,
      description: "How people move through cities and the systems that enable or constrain mobility.",
    },
    {
      id: 2,
      name: "Trust",
      slug: "trust",
      count: 18,
      description: "Building confidence in institutions, services, and digital platforms.",
    },
    {
      id: 3,
      name: "Food",
      slug: "food",
      count: 21,
      description: "Food security, nutrition, and the economics of everyday meals.",
    },
    {
      id: 4,
      name: "Dignity",
      slug: "dignity",
      count: 15,
      description: "Respect, agency, and the human experience in urban systems.",
    },
    {
      id: 5,
      name: "Education",
      slug: "education",
      count: 19,
      description: "Learning, skill development, and access to knowledge.",
    },
    {
      id: 6,
      name: "Health",
      slug: "health",
      count: 17,
      description: "Healthcare access, wellness, and public health in urban environments.",
    },
    {
      id: 7,
      name: "Housing",
      slug: "housing",
      count: 14,
      description: "Shelter, affordability, and the right to adequate housing.",
    },
    {
      id: 8,
      name: "Governance",
      slug: "governance",
      count: 12,
      description: "Public administration, civic engagement, and institutional effectiveness.",
    },
    {
      id: 9,
      name: "Environment",
      slug: "environment",
      count: 16,
      description: "Sustainability, climate adaptation, and urban ecology.",
    },
    {
      id: 10,
      name: "Economy",
      slug: "economy",
      count: 20,
      description: "Livelihoods, markets, and economic opportunity in cities.",
    },
    {
      id: 11,
      name: "Culture",
      slug: "culture",
      count: 13,
      description: "Identity, heritage, and the cultural fabric of urban life.",
    },
  ]

  const displayThemes = themes.length > 0 ? themes : fallbackThemes

  const featuredThemes = displayThemes.slice(0, 4)

  return (
    null
  )
}
