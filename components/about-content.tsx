"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Target, Eye, Compass, ArrowRight } from "lucide-react"
import Image from "next/image"

export function AboutContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-surface to-background py-11">
        <div className="circle-bg absolute -right-20 top-10 h-80 w-80 bg-citrus opacity-20" />
        <div className="circle-bg absolute -left-32 bottom-0 h-96 w-96 bg-education opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-8 flex items-center justify-center gap-4">
              <Image
                src="/images/design-mode/Ansrd%20Labs%202.png"
                alt="ANSRd Labs Logo"
                width={80}
                height={80}
                className="h-20 w-40"
              />
            </div>

            <p className="mt-6 text-xl leading-relaxed text-foreground-muted">
              A social insight studio studying everyday decisions and turning insights into practical tools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who we are */}
      <section className="border-b border-border py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex rounded-lg bg-citrus/10 p-3">
                <Target className="h-8 w-8 text-citrus" />
              </div>
              <h2 className="font-serif text-4xl font-bold text-foreground">Who we are</h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
                ANSRd Labs is a social insight studio that studies everyday decisions—and turns those insights into
                practical tools. We focus on the "micro" choices people make around transport, trust, food, digital
                information, education, and dignity, and how those choices scale into "macro" outcomes for communities
                and cities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/african-researchers-collaborating-in-modern-office.jpg"
                  alt="ANSRd Labs team collaborating"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-citrus/20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-b border-border py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 relative"
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/modern-african-city-with-people-making-decisions.jpg"
                  alt="Vision for African communities"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-education/20 blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="mb-6 inline-flex rounded-lg bg-education/10 p-3">
                <Eye className="h-8 w-8 text-education" />
              </div>
              <h2 className="font-serif text-4xl font-bold text-foreground">Vision</h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
                To elevate the quality of everyday decisions across African communities by turning lived experience and
                social science into practical tools—so individuals, institutions, and cities can choose with dignity,
                safety, and evidence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-border py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex rounded-lg bg-accent/10 p-3">
                <Compass className="h-8 w-8 text-accent" />
              </div>
              <h2 className="font-serif text-4xl font-bold text-foreground">Mission</h2>
              <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
                ANSRd Labs researches how people actually decide in daily life and translates those insights into media,
                toolkits, and pilot interventions. We combine field interviews, ethnography, and lightweight data
                tracking with accessible storytelling (The Decision Playbook) to help citizens, teams, and policymakers
                make better choices under real constraints.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/field-research-interview-in-african-community.jpg"
                  alt="Field research and community engagement"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-surface via-background to-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground">Connect With Us</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
              Interested in collaboration, consulting, or learning more about our work?
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/services"
                className="group flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-all hover:gap-3 hover:shadow-lg hover:shadow-accent/30"
              >
                What We Do
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@ansrd.io"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
