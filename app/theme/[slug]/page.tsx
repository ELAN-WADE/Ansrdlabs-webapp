import { ThemeArchive } from "@/components/theme-archive"
import { Footer } from "@/components/footer"

export default function ThemePage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-background">
      <ThemeArchive slug={params.slug} />
      <Footer />
    </div>
  )
}
