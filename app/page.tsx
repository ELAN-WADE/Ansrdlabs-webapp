"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { LatestPodcasts } from "@/components/latest-podcasts"
import { LatestResearch } from "@/components/latest-research"
import { LatestBlog } from "@/components/latest-blog"
import { WhatWeDo } from "@/components/what-we-do"
import { ThemesShowcase } from "@/components/themes-showcase"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { BentoGridShowcase } from "@/components/bento-grid-showcase"
import { ReadingProgressBar } from "@/components/reading-progress-bar"
import { VisualImpactSection } from "@/components/visual-impact-section"
import { ResearchJourneyHero } from "@/components/research-journey-hero"
import { MobileSearchBar } from "@/components/mobile-search-bar"
import { GlobalSearch } from "@/components/global-search"

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="bg-background">
      <ReadingProgressBar />
      <MobileSearchBar onOpenSearch={() => setSearchOpen(true)} />

      <div className="hidden">
        <GlobalSearch isOpen={searchOpen} onOpenChange={setSearchOpen} />
      </div>

      <Hero />

      <div className="bg-muted/30 hidden md:block">
        <ResearchJourneyHero />
      </div>

      <div className="bg-background">
        <WhatWeDo />
      </div>

      <div className="bg-muted/20 hidden md:block">
        <VisualImpactSection />
      </div>

      <div className="bg-background">
        <BentoGridShowcase />
      </div>

      <div className="bg-muted/30">
        <ThemesShowcase />
      </div>

      <div id="podcasts" className="bg-muted/20">
        <LatestPodcasts />
      </div>

      <div id="research" className="bg-background">
        <LatestResearch />
      </div>

      <div className="bg-muted/30">
        <LatestBlog />
      </div>

      <div className="bg-background">
        <Newsletter />
      </div>

      <Footer />
    </div>
  )
}
