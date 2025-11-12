"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [stats, setStats] = useState({
    episodes: 0,
    research: 0,
    caseStudies: 0,
    themes: 11,
  })

  const images = [
    "/hero-african-city-street.jpg",
    "/african-urban-journey-research.jpg",
    "/african-public-transport-bus.jpg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        // Silent error handling for production
      }
    }
    loadStats()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-background bg-geometric-shapes" aria-label="Hero section">
      <div
        className="absolute -left-32 top-20 h-[350px] w-[350px] bg-accent/8 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-40 top-40 h-[400px] w-[400px] bg-accent/6 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <motion.div style={{ opacity }} className="relative z-20 mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left flex flex-col justify-center order-2 lg:order-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-foreground lg:text-6xl text-balance"
            >
              We study everyday choices and turn research into{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                tools people can use
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance"
            >
              {
                " From transport to trust, food to dignity, digital info to education —we map how tiny decisions scale into citywide outcomes, and we design simple habits that raise the floor for everyone"
              }
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Link
                href="/podcast"
                className="group flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-lg transition-all hover:gap-3 hover:bg-accent/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="View latest podcast episodes"
              >
                Latest podcast
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/research"
                className="rounded-full border-2 bg-background/50 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-background/80 hover:border-accent/50 border-amber-400 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="View latest research papers"
              >
                Latest research
              </Link>
            </motion.div>
          </motion.div>

          {/* Right column - Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2 flex flex-col items-center"
          >
            <div
              className="relative w-full h-[400px] lg:h-[450px] overflow-hidden rounded-3xl shadow-2xl"
              role="region"
              aria-label="Image carousel showcasing African urban research"
              aria-live="polite"
            >
              {images.map((image, index) => (
                <motion.div
                  key={image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                  aria-hidden={index !== currentImageIndex}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`African urban research insights ${index + 1}`}
                    fill
                    className="object-cover object-center card-image-enhanced"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    quality={85}
                  />
                </motion.div>
              ))}
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 w-full grid grid-cols-4 gap-4 mb-6"
              role="region"
              aria-label="Platform statistics"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" aria-label={`${stats.episodes} episodes`}>
                  {stats.episodes}+
                </div>
                <div className="text-xs text-muted-foreground">Episodes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" aria-label={`${stats.research} research papers`}>
                  {stats.research}+
                </div>
                <div className="text-xs text-muted-foreground">Research Papers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" aria-label={`${stats.caseStudies} case studies`}>
                  {stats.caseStudies}+
                </div>
                <div className="text-xs text-muted-foreground">Case Studies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" aria-label={`${stats.themes} themes`}>
                  {stats.themes}+
                </div>
                <div className="text-xs text-muted-foreground">Themes</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
