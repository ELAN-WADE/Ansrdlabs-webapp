import Link from "next/link"
import Image from "next/image"
import { Twitter, Linkedin, Youtube, Mail, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/design-mode/Ansrd%20Labs%202(1).png"
                alt="ANSRd Labs"
                width={180}
                height={60}
                className="h-12 transition-opacity group-hover:opacity-80 w-16"
                priority
              />
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground max-w-xs">
              Understanding everyday decisions in African cities through research, storytelling, and decision science.
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href="https://x.com/ANSRdLABS/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/ansrdio/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/ansrdlabs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@ansrdlabs.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/podcast" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Podcast
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Themes */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">Themes</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/theme/transport"
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Transport
                </Link>
              </li>
              <li>
                <Link href="/theme/trust" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Trust
                </Link>
              </li>
              <li>
                <Link href="/theme/food" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Food
                </Link>
              </li>
              <li>
                <Link
                  href="/theme/dignity"
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Dignity
                </Link>
              </li>
              <li>
                <Link
                  href="/theme/education"
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  Education
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">About</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ANSRd! Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
