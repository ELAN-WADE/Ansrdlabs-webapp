"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Send } from "lucide-react"

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-serif text-5xl font-bold text-foreground lg:text-6xl">Get in Touch</h1>
            <p className="mt-6 text-xl leading-relaxed text-foreground-muted">
              Interested in collaboration, consulting, or learning more about our work? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:hello@ansrdlabs.com" className="text-sm text-foreground-muted hover:text-accent">
                        hello@ansrdlabs.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-sm text-foreground-muted">Lagos, Nigeria</p>
                      <p className="text-sm text-foreground-muted">Accra, Ghana</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">Office Hours</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">
                  Monday - Friday: 9:00 AM - 5:00 PM WAT
                  <br />
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-surface p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="mb-2 block text-sm font-medium text-foreground">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Your organization"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Select a subject</option>
                    <option value="research">Research Inquiry</option>
                    <option value="consulting">Consulting Services</option>
                    <option value="training">Training & Workshops</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="media">Media Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-transform hover:scale-105 sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
