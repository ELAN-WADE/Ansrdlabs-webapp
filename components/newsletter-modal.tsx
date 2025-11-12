"use client"
import { Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BrevoNewsletterForm } from "@/components/brevo-newsletter-form"

interface NewsletterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl">Stay in the Loop</DialogTitle>
          <DialogDescription className="text-center">
            Get the latest research insights, podcast episodes, and stories from the field delivered to your inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <BrevoNewsletterForm className="w-full" />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </DialogContent>
    </Dialog>
  )
}
