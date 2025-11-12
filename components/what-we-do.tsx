"use client"

import { motion } from "framer-motion"
import { Microscope, Radio, Wrench } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const services = [
  {
    icon: Microscope,
    title: "Research & Evidence",
    description: "Rigorous qualitative and quantitative research exploring everyday decisions in African cities.",
    image: "/research-lab-africa.jpg",
    href: "/research",
  },
  {
    icon: Radio,
    title: "Podcast & Storytelling",
    description: "Engaging audio narratives that bring research insights to life through real stories.",
    image: "/podcast-recording-studio.jpg",
    href: "/podcast",
  },
  {
    icon: Wrench,
    title: "Everyday Tools",
    description: "Practical frameworks, templates, and decision-making tools designed for real-world application.",
    image: "/everyday-tools-workspace.jpg",
    href: "/blog",
  },
]

export function WhatWeDo() {
  return (
    <section className="relative overflow-hidden bg-background border border-primary border-b-0 border-r-0 border-l-0 rounded-4xl border-none py-16">
      <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-primary/2 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-accent/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-8 my-3.5 border-solid border-t rounded-4xl border-b border-accent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-block rounded-full bg-accent/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-accent"
          >
            What We Do
          </motion.div>
          <h2 className="font-serif text-4xl font-bold text-foreground lg:text-5xl text-balance">
            Bridging Research & Practice
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            We make insights accessible and actionable through multiple formats
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={service.href} className="block h-full">
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent/50 hover:shadow-xl hover:-translate-y-2 h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover card-image-enhanced transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="relative p-6 bg-primary-foreground">
                    <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 border border-accent/20">
                      <service.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="mb-3 font-serif text-xl font-bold group-hover:text-accent transition-colors text-card-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
