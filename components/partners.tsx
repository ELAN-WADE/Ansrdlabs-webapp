"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  { name: "World Bank", logo: "/world-bank-logo.png" },
  { name: "Gates Foundation", logo: "/gates-foundation-logo.jpg" },
  { name: "USAID", logo: "/usaid-logo.jpg" },
  { name: "African Development Bank", logo: "/images/partner-4.png" },
  { name: "UN Habitat", logo: "/un-habitat-logo.jpg" },
  { name: "Mastercard Foundation", logo: "/mastercard-foundation-logo.jpg" },
]

export function Partners() {
  console.log("[v0] Partners component rendering")

  return (
    <section className="relative border-b border-border/50 py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Trusted by Leading Organizations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Partnering with global institutions to drive evidence-based change
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex items-center justify-center rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-card"
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={180}
                height={60}
                className="h-12 w-auto object-contain opacity-60 transition-opacity group-hover:opacity-100 dark:brightness-0 dark:invert"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
