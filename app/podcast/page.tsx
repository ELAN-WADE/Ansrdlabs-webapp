import { PodcastArchive } from "@/components/podcast-archive"
import { PodcastRSSSection } from "@/components/podcast-rss-section"
import { Footer } from "@/components/footer"

export default function PodcastPage() {
  return (
    <div className="bg-background">
      <PodcastArchive />
      <PodcastRSSSection />
      <Footer />
    </div>
  )
}
