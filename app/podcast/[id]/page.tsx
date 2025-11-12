import { PodcastDetail } from "@/components/podcast-detail"
import { Footer } from "@/components/footer"

export default function PodcastDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-background">
      <PodcastDetail id={params.id} />
      <Footer />
    </div>
  )
}
