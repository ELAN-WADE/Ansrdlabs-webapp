import { BlogDetail } from "@/components/blog-detail"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="bg-background px-9">
      {/* The id parameter can be either a slug or WordPress ID - fetchPostBySlugGraphQL handles both */}
      <BlogDetail id={params.id} />
      <Footer />
    </div>
  )
}
