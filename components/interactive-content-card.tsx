"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, BookOpen, Headphones, FileText } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface ContentItem {
  id: string
  type: "podcast" | "research" | "article"
  title: string
  description: string
  duration?: string
  readTime?: string
  href: string
}

interface InteractiveContentCardProps {
  category: string
  items: ContentItem[]
  color: string
}

export function InteractiveContentCard({ category, items, color }: InteractiveContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "podcast":
        return <Headphones className="h-5 w-5" />
      case "research":
        return <FileText className="h-5 w-5" />
      case "article":
        return <BookOpen className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  return (
    <motion.div
      layout
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      style={{ containerType: "inline-size" }}
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{category}</h3>
            <p className="text-sm text-muted-foreground">{items.length} items</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-border"
          >
            <div className="p-6 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} className="block p-4 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1" style={{ color }}>
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {item.duration && <span>{item.duration}</span>}
                          {item.readTime && <span>{item.readTime}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
