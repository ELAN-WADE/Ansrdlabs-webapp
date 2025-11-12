"use client"

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-6 focus:py-3 focus:text-accent-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
