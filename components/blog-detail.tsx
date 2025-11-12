"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Share2, ChevronRight, Loader2, Quote, ExternalLink } from "lucide-react"
import { fetchPostBySlugGraphQL, formatDate, fetchAllPosts } from "@/lib/wordpress-graphql"
import { adaptPostFromGraphQL, type FrontendPost } from "@/lib/graphql-adapter"
import { Badge } from "@/components/ui/badge"
import { BrevoNewsletterForm } from "@/components/brevo-newsletter-form"

interface BlogData {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  theme: string
  themeColor: string
  relatedContent: Array<{ type: string; title: string; href: string }>
}

// Fallback data
const fallbackData: BlogData = {
  id: 1,
  title: "Why Scarcity Mindset Matters for Urban Policy",
  excerpt:
    "Decision science research shows how resource constraints shape everyday choices in ways policymakers often overlook.",
  content: `When people operate under conditions of scarcity—whether time, money, or cognitive bandwidth—their decision-making fundamentally changes. This isn't just an academic observation; it has profound implications for how we design urban policies and services.

## The Psychology of Scarcity

Research in behavioral economics has shown that scarcity creates a "tunneling" effect. When you're worried about making rent, you focus intensely on that immediate problem, often at the expense of long-term planning. This isn't a character flaw—it's a predictable cognitive response to resource constraints.

In our fieldwork across Lagos, Accra, and Nairobi, we've observed this pattern repeatedly. A motorcycle taxi driver banned from certain routes doesn't just lose income—they lose the mental space to plan for their children's education or invest in their business.

## Policy Implications

Traditional policy design often assumes people have the time, information, and cognitive resources to navigate complex systems. But when you're operating under scarcity, even simple tasks become overwhelming.

Consider a subsidy program that requires multiple documents, office visits, and waiting periods. For someone juggling multiple informal jobs, the transaction costs may exceed the benefit. The policy "works" on paper but fails in practice.

## Designing for Reality

Better policy design starts with understanding these constraints:

1. **Reduce friction**: Make processes as simple as possible
2. **Respect time**: Minimize waiting and multiple visits
3. **Provide clear information**: Reduce cognitive load
4. **Build in flexibility**: Recognize that people's circumstances vary

## Moving Forward

The scarcity mindset isn't something to overcome—it's a reality to design around. When we build systems that work for people under constraint, we build systems that work better for everyone.

Our research continues to explore how urban policies can better account for the cognitive and practical realities of everyday decision-making. The goal isn't just better policy—it's policy that actually works for the people it's meant to serve.`,
  author: "Dr. Amina Okafor",
  date: "Jan 12, 2025",
  readTime: "6 min read",
  theme: "Policy & Governance",
  themeColor: "dignity",
  relatedContent: [
    { type: "Research", title: "Mobility Patterns and Livelihood Strategies in Lagos", href: "/research/1" },
    { type: "Podcast", title: "The Hidden Economics of Okada Bans", href: "/podcast/1" },
    { type: "Article", title: "The Value of Information in Education Choices", href: "/blog/5" },
  ],
}

export function BlogDetail({ id }: { id: string }) {
  const [article, setArticle] = useState<FrontendPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<FrontendPost[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true)
        setError(null)
        const post = await fetchPostBySlugGraphQL(id)

        if (post) {
          const adaptedPost = adaptPostFromGraphQL(post)
          setArticle(adaptedPost)

          const allPosts = await fetchAllPosts({ first: 10 })
          const related = allPosts
            .filter((p) => p.id !== post.id)
            .filter((p) => {
              const postSeries = p.seriesTag?.nodes?.map((s) => s.name) || []
              const postFormats = p.formats?.nodes?.map((f) => f.name) || []
              const currentSeries = adaptedPost.series
              const currentFormats = adaptedPost.formats

              return (
                postSeries.some((s) => currentSeries.includes(s)) || postFormats.some((f) => currentFormats.includes(f))
              )
            })
            .slice(0, 3)
            .map(adaptPostFromGraphQL)

          setRelatedPosts(related)
        } else {
          setError("Article not found. Please check the URL or try again later.")
        }
      } catch (error) {
        setError("Failed to load article. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [id])

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const title = article?.title || ""
    const text = article?.deckSubtitle || article?.excerpt || ""

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      const shareMenu = document.createElement("div")
      shareMenu.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      shareMenu.innerHTML = `
        <div class="bg-surface rounded-lg p-6 max-w-sm w-full mx-4 border border-border">
          <h3 class="text-lg font-semibold mb-4 text-foreground">Share Article</h3>
          <div class="space-y-2">
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors text-foreground">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X (Twitter)
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors text-foreground">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Share on Facebook
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors text-foreground">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Share on LinkedIn
            </a>
            <button onclick="navigator.clipboard.writeText('${url}').then(() => { this.innerHTML = '<svg class=\\"h-5 w-5\\" fill=\\"none\\" stroke=\\"currentColor\\" viewBox=\\"0 0 24 24\\"><path strokeLinecap=\\"round\\" strokeLinejoin=\\"round\\" strokeWidth=\\"2\\" d=\\"M5 13l4 4L19 7\\"/></svg> Copied!'; setTimeout(() => this.closest('div').remove(), 1000); })" class="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors text-foreground w-full text-left">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              Copy Link
            </button>
          </div>
          <button onclick="this.closest('div').parentElement.remove()" class="mt-4 w-full p-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-foreground">
            Close
          </button>
        </div>
      `
      shareMenu.onclick = (e) => {
        if (e.target === shareMenu) shareMenu.remove()
      }
      document.body.appendChild(shareMenu)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
          <p className="mt-4 text-foreground-muted">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h2>
          <p className="text-foreground-muted mb-6">{error || "The article you're looking for doesn't exist."}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {article.featuredImage && (
        <div className="relative h-[500px] w-full overflow-hidden">
          <Image
            src={article.featuredImage || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={95}
            unoptimized={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap gap-2">
              {article.themes.map((theme) => (
                <Badge key={theme} variant="default" className="bg-accent text-accent-foreground">
                  {theme}
                </Badge>
              ))}
              {article.series.map((series) => (
                <Badge key={series} variant="secondary">
                  {series}
                </Badge>
              ))}
              {article.formats.map((format) => (
                <Badge key={format} variant="outline">
                  {format}
                </Badge>
              ))}
            </div>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground lg:text-5xl">
              {article.title}
            </h1>
            {article.deckSubtitle && (
              <div className="mt-4 text-xl leading-relaxed text-foreground-muted italic border-l-4 border-accent pl-4">
                {article.deckSubtitle}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar || "/placeholder.svg"}
                    alt={article.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <User className="h-4 w-4" />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.date)}</span>
              </div>
              {article.estimatedReadTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.estimatedReadTime} min read</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
              >
                <Share2 className="h-4 w-4" />
                Share Article
              </button>
              {article.externalMirror && (
                <a
                  href={article.externalMirror}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
                >
                  <ExternalLink className="h-4 w-4" />
                  Read on Medium
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div
                className="prose prose-lg prose-invert max-w-none 
                [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:leading-relaxed [&_p]:text-foreground-muted [&_p]:mb-4 [&_p]:text-base
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
                [&_li]:text-foreground-muted [&_li]:leading-relaxed
                [&_a]:text-accent [&_a]:underline [&_a]:transition-colors hover:[&_a]:text-accent/80
                [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground-muted [&_blockquote]:my-6
                [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full
                [&_strong]:text-foreground [&_strong]:font-semibold
                [&_em]:italic [&_em]:text-foreground-muted
                [&_code]:bg-surface-elevated [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-accent
                [&_pre]:bg-surface-elevated [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
                [&_th]:border [&_th]:border-border [&_th]:bg-surface [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground
                [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-foreground-muted"
              >
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>

              {article.pullQuotes.length > 0 && (
                <div className="mt-12 space-y-6">
                  {article.pullQuotes.map((quote, index) => (
                    <div key={index} className="border-l-4 border-accent bg-surface-elevated p-6 rounded-r-lg">
                      <Quote className="h-6 w-6 text-accent mb-2" />
                      <p className="text-lg italic text-foreground leading-relaxed">{quote}</p>
                    </div>
                  ))}
                </div>
              )}

              {article.reference && (
                <div className="mt-12 rounded-lg border border-border bg-surface p-6">
                  <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">References</h3>
                  <div
                    className="prose prose-sm prose-invert max-w-none text-foreground-muted
                      [&_p]:mb-2 [&_p]:leading-relaxed
                      [&_a]:text-accent [&_a]:underline hover:[&_a]:text-accent/80
                      [&_br]:my-1"
                    dangerouslySetInnerHTML={{
                      __html: article.reference
                        .replace(/<p>/g, '<div class="mb-2">')
                        .replace(/<\/p>/g, "</div>")
                        .replace(/<br\s*\/?>/g, '<br class="my-1" />'),
                    }}
                  />
                </div>
              )}
            </motion.article>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border border-border bg-gradient-to-br from-accent/10 to-accent/5 p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <ExternalLink className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">Stay Updated</h3>
                  <p className="mb-4 text-xs leading-relaxed text-foreground-muted">
                    Get research insights and stories delivered to your inbox.
                  </p>

                  <BrevoNewsletterForm className="w-full" />

                  <p className="mt-3 text-xs text-foreground-subtle">We respect your privacy. Unsubscribe anytime.</p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-6">
                  <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">About the Author</h3>
                  <div className="flex items-start gap-3">
                    {article.author.avatar && (
                      <Image
                        src={article.author.avatar || "/placeholder.svg"}
                        alt={article.author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{article.author.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
                        {article.author.description ||
                          `${article.author.name} is a researcher at ANSRd Labs, specializing in decision science and urban policy.`}
                      </p>
                    </div>
                  </div>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface p-6">
                    <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">Related Articles</h3>
                    <div className="space-y-3">
                      {relatedPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-all hover:border-accent hover:bg-surface-elevated"
                        >
                          <div>
                            {post.series.length > 0 && (
                              <span className="text-xs text-foreground-subtle">{post.series[0]}</span>
                            )}
                            <h4 className="mt-0.5 text-sm font-medium leading-tight text-foreground line-clamp-2">
                              {post.title}
                            </h4>
                          </div>
                          <ChevronRight className="h-4 w-4 flex-shrink-0 text-foreground-subtle" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  )
}
