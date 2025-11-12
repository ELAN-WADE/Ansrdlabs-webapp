"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Microscope,
  Podcast,
  FileText,
  Lightbulb,
  Users,
  ArrowRight,
  CheckCircle,
  Bus,
  Shield,
  Utensils,
  Smartphone,
  GraduationCap,
  Heart,
  Target,
  Compass,
  Mail,
} from "lucide-react"
import Image from "next/image"

const services = [
  {
    icon: Microscope,
    title: "Field & desk research",
    description:
      "We map how people actually decide under time, money, and information pressure, and identify the frictions that shape behavior.",
  },
  {
    icon: Podcast,
    title: "The Decision Playbook (podcast)",
    description: "A weekly, story-driven show translating research into actions listeners can use the same day.",
  },
  {
    icon: FileText,
    title: "Briefs & explainers",
    description:
      'Two-page decision maps, consequence diagrams, and "what works" checklists for teams, journalists, and policymakers.',
  },
  {
    icon: Lightbulb,
    title: "Civic prototypes",
    description:
      "Lightweight pilots (e.g., safer-trip checklists, food-swap guides, group verification scripts) that reduce risk and save time.",
  },
]

const principles = [
  {
    title: "Evidence over echo",
    description: "Decision quality tracks information quality.",
  },
  {
    title: "Small frictions, significant effects",
    description: "Make the wiser option the easier default.",
  },
  {
    title: "Micro → macro",
    description: "Trace how household decisions aggregate into market signals and policy needs.",
  },
  {
    title: "Respect the day",
    description: "Assume people are rational under constraint; design for real lives, not ideal schedules.",
  },
]

const focusAreas = [
  {
    icon: Bus,
    title: "Transport",
    description: "Mobility choices under cost, time pressure, and safety risk.",
    color: "text-citrus",
    bgColor: "bg-citrus/10",
  },
  {
    icon: Shield,
    title: "Trust",
    description: "How relationships and institutions shape who/what we believe.",
    color: "text-education",
    bgColor: "bg-education/10",
  },
  {
    icon: Utensils,
    title: "Food",
    description: "Plate-level trade-offs (fullness, nutrition, dignity) and their health impacts.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Smartphone,
    title: "Digital information",
    description: "Raising verification norms in WhatsApp groups and online communities.",
    color: "text-citrus",
    bgColor: "bg-citrus/10",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Everyday barriers to learning and practical supports that compound.",
    color: "text-education",
    bgColor: "bg-education/10",
  },
  {
    icon: Heart,
    title: "Dignity",
    description: "The quiet costs people pay (or refuse to pay) to be respected in daily life.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

const outputs = [
  "Decision Playbooks: One-page tools (e.g., the 10-Second Check, Affordance Scan, and RED-15 pre-ride safety routine).",
  "Field Notes & Briefs: Short reads summarizing a problem, the lived incentives, and workable levers.",
  "Workshop Kits: Slide decks and facilitation guides for schools, teams, and community groups.",
  "Podcast + Show Notes: Stories, humor, and annotated references for easy sharing.",
]

const audiences = [
  "Community organizations, schools, and city programs",
  "Newsrooms and creators translating research for the public",
  "Product and policy teams designing for real-world use",
  "Listeners who want clear, humane guidance for everyday decisions",
]

export function ServicesContent() {
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
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-serif text-5xl font-bold text-foreground lg:text-6xl">What We Do</h1>
            <p className="mt-6 text-xl leading-relaxed text-foreground-muted">
              Turning everyday decisions into practical tools through research, storytelling, and civic prototypes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-border py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg hover:border-accent"
              >
                <div className="mb-4 inline-flex rounded-lg bg-citrus/10 p-3">
                  <service.icon className="h-6 w-6 text-citrus" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-foreground">{service.title}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="border-b border-border py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex rounded-lg bg-accent/10 p-3">
              <Target className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground">Our approach</h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
              People do not decide in a vacuum. Choices are made within affordances—what an environment actually allows
              at the moment you must act. We document those constraints and design tiny, repeatable habits that shift
              outcomes without shaming the user.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Working Principles */}
      <section className="border-b border-border py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <div className="mb-6 inline-flex rounded-lg bg-education/10 p-3">
              <Compass className="h-8 w-8 text-education" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground">Working principles</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="mb-2 font-serif text-xl font-bold text-foreground">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="border-b border-border py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground">Focus areas</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
              The everyday decisions that shape lives and communities.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:shadow-lg hover:border-accent"
              >
                <div className={`mb-4 inline-flex rounded-lg ${area.bgColor} p-3`}>
                  <area.icon className={`h-6 w-6 ${area.color}`} />
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-foreground">{area.title}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outputs */}
      <section className="border-b border-border py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-4xl font-bold text-foreground">Outputs you can use</h2>
              <div className="mt-8 space-y-4">
                {outputs.map((output, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-citrus" />
                    <p className="text-foreground-muted leading-relaxed">{output}</p>
                  </motion.div>
                ))}
              </div>
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
                  src="/decision-making-tools-and-playbook-materials.jpg"
                  alt="Decision Playbook tools and outputs"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-b border-border py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <div className="mb-6 inline-flex rounded-lg bg-citrus/10 p-3">
              <Users className="h-8 w-8 text-citrus" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground">Who we serve</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {audiences.map((audience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-6"
              >
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <p className="text-foreground leading-relaxed">{audience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-24 bg-gradient-to-br from-background via-surface to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex rounded-lg bg-accent/10 p-3">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground">Connect</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
              Ready to collaborate or learn more about our work?
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@ansrd.io"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-all hover:gap-3 hover:shadow-lg hover:shadow-accent/30"
              >
                Email Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/podcast"
                className="rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                Listen to The Decision Playbook
              </Link>
            </div>
            <p className="mt-6 text-sm text-foreground-muted">
              Subscribe to <span className="font-semibold">The Researcher's Notes</span> newsletter for weekly insights
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
