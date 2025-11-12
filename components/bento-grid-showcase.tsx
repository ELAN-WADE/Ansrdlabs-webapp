"use client"

import { motion } from "framer-motion"
import { BookOpen, Headphones, FileText, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

const features = [
  {
    title: "Research Library",
    description: "Access 30+ peer-reviewed research papers on African urban development",
    icon: FileText,
    href: "/research",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    title: "Podcast Series",
    description: "50+ episodes exploring real-world challenges",
    icon: Headphones,
    href: "/podcast",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    color: "from-purple-500/20 to-purple-600/20",
  },
  {
    title: "Case Studies",
    description: "15+ in-depth analyses of urban interventions",
    icon: BookOpen,
    href: "/blog",
    span: "col-span-12 md:col-span-6 lg:col-span-4",
    color: "from-amber-500/20 to-amber-600/20",
  },
  {
    title: "Expert Network",
    description: "Connect with leading researchers and practitioners across Africa",
    icon: Users,
    href: "/team",
    span: "col-span-12 md:col-span-6 lg:col-span-6",
    color: "from-green-500/20 to-green-600/20",
  },
  {
    title: "Impact Metrics",
    description: "Track the real-world impact of research-informed interventions",
    icon: TrendingUp,
    href: "/about",
    span: "col-span-12 md:col-span-6 lg:col-span-6",
    color: "from-pink-500/20 to-pink-600/20",
  },
]

export function BentoGridShowcase() {
  return (
    null
  )
}
