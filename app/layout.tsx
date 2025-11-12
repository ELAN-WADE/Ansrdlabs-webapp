import type React from "react"
import type { Metadata } from "next"
import { Nunito, Roboto } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { AudioPlayerProvider } from "@/components/audio-player-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { SkipToContent } from "@/components/skip-to-content"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ansrdlabs.com"),
  title: {
    default: "ANSRd! Labs — Research, Insights & Decision Science",
    template: "%s | ANSRd! Labs",
  },
  description:
    "Premium research platform exploring Transport, Trust, Food, Dignity, and Education through podcasts, research papers, and articles in African cities.",
  keywords: [
    "research",
    "African cities",
    "transport",
    "trust",
    "food security",
    "dignity",
    "education",
    "podcasts",
    "decision science",
    "urban planning",
  ],
  authors: [{ name: "ANSRd! Labs" }],
  creator: "ANSRd! Labs",
  publisher: "ANSRd! Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "Next.js",
  applicationName: "ANSRd! Labs",
  referrer: "origin-when-cross-origin",
  category: "Research & Education",
  classification: "Research Platform",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "ANSRd! Labs — Research, Insights & Decision Science",
    description:
      "Premium research platform exploring Transport, Trust, Food, Dignity, and Education through podcasts, research papers, and articles in African cities.",
    url: "https://ansrdlabs.com",
    siteName: "ANSRd! Labs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ANSRd! Labs - Research Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANSRd! Labs — Research, Insights & Decision Science",
    description:
      "Premium research platform exploring Transport, Trust, Food, Dignity, and Education through podcasts, research papers, and articles in African cities.",
    images: ["/og-image.png"],
    creator: "@ansrdlabs",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://ansrdlabs.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${roboto.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AudioPlayerProvider>
            <SkipToContent />
            <Navigation />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
          </AudioPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
