"use client"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { BrevoNewsletterForm } from "@/components/brevo-newsletter-form"

export function Newsletter() {
  return (
    <section className="relative border-b border-border/50 overflow-hidden py-16">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/5 via-background to-primary/5 p-8 backdrop-blur-sm"
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10"
            >
              <Mail className="h-6 w-6 text-accent" />
            </motion.div>

            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Stay in the Loop</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Get the latest research insights, podcast episodes, and stories from the field delivered to your inbox.
            </p>

            <div className="mt-6">
              <BrevoNewsletterForm className="max-w-md mx-auto" />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
