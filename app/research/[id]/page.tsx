import { ResearchDetail } from "@/components/research-detail"
import { Footer } from "@/components/footer"

export default function ResearchDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-background">
      <ResearchDetail id={params.id} />
      <Footer />
    </div>
  )
}
