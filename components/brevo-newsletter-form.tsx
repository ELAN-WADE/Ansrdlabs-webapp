"use client"

import { useState, type FormEvent } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"

interface BrevoNewsletterFormProps {
  className?: string
}

export function BrevoNewsletterForm({ className = "" }: BrevoNewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address.")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("success")
        setMessage(data.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Unable to subscribe. Please try again later.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Unable to subscribe. Please try again later.")
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email Address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading" || status === "success"}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            aria-label="Email Address"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "success" && <CheckCircle2 className="h-4 w-4" />}
          {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </button>

        {message && (
          <p
            className={`text-xs text-center ${
              status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
