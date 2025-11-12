"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"
import { NewsletterModal } from "@/components/newsletter-modal"
import Image from "next/image"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newsletterOpen, setNewsletterOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/design-mode/Ansrd%20Labs%202.png"
              alt="ANSRd Labs Logo"
              width={160}
              height={80}
              className="transition-transform group-hover:scale-105 h-10 w-20"
              priority
            />
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            <Link
              href="/podcast"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Podcast
            </Link>
            <Link
              href="/research"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Research
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              What we do
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <GlobalSearch />
            <ThemeToggle />
            <button
              onClick={() => setNewsletterOpen(true)}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
            >
              Subscribe
            </button>
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-accent" />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/50 lg:hidden bg-background/95 backdrop-blur-xl"
            >
              <div className="space-y-1 px-6 py-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                {/* Theme Toggle */}
                <div className="pb-4 mb-4">
                  <GlobalSearch />
                </div>

                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>

                <div className="space-y-1">
                  <Link
                    href="/podcast"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Podcast
                  </Link>
                  <Link
                    href="/research"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Research
                  </Link>
                  <Link
                    href="/services"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    What we do
                  </Link>
                  <Link
                    href="/about"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/blog"
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setNewsletterOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </>
  )
}
