"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Linkedin, Twitter, Filter } from "lucide-react"

const teamMembers = [
  {
    name: "Dr. Amina Okafor",
    role: "Founder & Director",
    expertise: ["Decision Science", "Urban Policy", "Transport"],
    bio: "Behavioral economist specializing in decision-making under scarcity. PhD from MIT.",
    image: "/team-amina.jpg",
    email: "amina@ansrdlabs.com",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Kwame Mensah",
    role: "Senior Researcher",
    expertise: ["Qualitative Research", "Transport", "Trust"],
    bio: "Ethnographer with 10+ years studying informal systems in African cities.",
    image: "/team-kwame.jpg",
    email: "kwame@ansrdlabs.com",
    linkedin: "#",
  },
  {
    name: "Fatima Ibrahim",
    role: "Research Lead - Digital Trust",
    expertise: ["Fintech", "Trust", "Survey Design"],
    bio: "Expert in digital financial services and trust-building in emerging markets.",
    image: "/team-fatima.jpg",
    email: "fatima@ansrdlabs.com",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Dr. Chen Li",
    role: "Data Scientist",
    expertise: ["Data Analysis", "GIS", "Transport"],
    bio: "Quantitative researcher specializing in mobility data and spatial analysis.",
    image: "/team-chen.jpg",
    email: "chen@ansrdlabs.com",
    linkedin: "#",
  },
  {
    name: "Ngozi Okonkwo",
    role: "Field Coordinator",
    expertise: ["Ethnography", "Community Engagement", "Food"],
    bio: "Coordinates fieldwork and builds relationships with communities across Nigeria.",
    image: "/team-ngozi.jpg",
    email: "ngozi@ansrdlabs.com",
  },
  {
    name: "James Kamau",
    role: "Research Associate",
    expertise: ["Mixed Methods", "Education", "Dignity"],
    bio: "Early-career researcher focused on education access and dignity in urban systems.",
    image: "/team-james.jpg",
    email: "james@ansrdlabs.com",
    linkedin: "#",
  },
]

const roles = ["All", "Leadership", "Researcher", "Coordinator"]
const themes = ["All", "Transport", "Trust", "Food", "Dignity", "Education"]

export function TeamContent() {
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedTheme, setSelectedTheme] = useState("All")

  const filteredTeam = teamMembers.filter((member) => {
    const matchesRole =
      selectedRole === "All" ||
      member.role.toLowerCase().includes(selectedRole.toLowerCase()) ||
      (selectedRole === "Leadership" && member.role.includes("Director"))
    const matchesTheme = selectedTheme === "All" || member.expertise.includes(selectedTheme)
    return matchesRole && matchesTheme
  })

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
            <h1 className="font-serif text-5xl font-bold text-foreground lg:text-6xl">Our Team</h1>
            <p className="mt-6 text-xl leading-relaxed text-foreground-muted">
              A diverse group of researchers, analysts, and storytellers committed to understanding everyday decisions
              in African cities.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-8 max-w-3xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Filter className="h-4 w-4 text-foreground-subtle" />
              <span className="text-sm text-foreground-subtle">Role:</span>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    selectedRole === role
                      ? "bg-foreground text-background"
                      : "border border-border bg-surface text-foreground-muted hover:bg-surface-elevated"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Filter className="h-4 w-4 text-foreground-subtle" />
              <span className="text-sm text-foreground-subtle">Expertise:</span>
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    selectedTheme === theme
                      ? "bg-foreground text-background"
                      : "border border-border bg-surface text-foreground-muted hover:bg-surface-elevated"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {filteredTeam.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTeam.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-border-hover hover:shadow-lg"
                >
                  <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-surface-elevated">
                    <div className="flex h-full items-center justify-center text-6xl font-bold text-foreground-subtle">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">{member.name}</h3>
                  <p className="mt-1 text-sm text-accent">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{member.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-foreground-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-3 border-t border-border pt-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-foreground-muted transition-colors hover:text-foreground"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted transition-colors hover:text-foreground"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted transition-colors hover:text-foreground"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-foreground-muted">No team members found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
