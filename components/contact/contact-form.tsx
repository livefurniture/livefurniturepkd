"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageCircle, CheckCircle2, RefreshCw, Send, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { COMPANY, whatsappUrl } from "@/lib/site-data"

const inputBase =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")

    // Format formatted WhatsApp message with full details
    const lines = [
      "*Live Furniture Website Enquiry*",
      "----------------------------------",
      `👤 *Name:* ${formData.name.trim()}`,
      `📞 *Phone:* ${formData.phone.trim()}`,
      `✉️ *Email:* ${formData.email.trim()}`,
      formData.subject.trim() ? `🏷️ *Subject:* ${formData.subject.trim()}` : null,
      "----------------------------------",
      "💬 *Requirement / Message:*",
      formData.message.trim(),
    ].filter(Boolean) as string[]

    const fullMessage = lines.join("\n")
    const targetUrl = whatsappUrl(fullMessage)
    setLastWhatsAppUrl(targetUrl)

    // Redirect to WhatsApp
    setTimeout(() => {
      setStatus("sent")
      if (typeof window !== "undefined") {
        const opened = window.open(targetUrl, "_blank", "noopener,noreferrer")
        if (!opened) {
          // If popup is blocked by browser, redirect current tab
          window.location.href = targetUrl
        }
      }
    }, 400)
  }

  function handleReset() {
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    })
    setStatus("idle")
    setLastWhatsAppUrl("")
  }

  return (
    <Reveal>
      <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="sent-state"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-foreground">
                Enquiry Ready on WhatsApp!
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Your enquiry details have been forwarded to WhatsApp for instant direct communication with our manufacturing team.
              </p>

              {lastWhatsAppUrl && (
                <div className="mt-6 flex flex-col items-center gap-3 w-full sm:w-auto">
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Open WhatsApp Chat Again</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground pt-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Send another enquiry</span>
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="form-state"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-foreground">Send an enquiry</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Fill in your details below. Submitting will redirect your enquiry directly to our WhatsApp.
                  </p>
                </div>
                <span className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputBase}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Phone number <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 8137 841 836"
                    className={inputBase}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email address <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={inputBase}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Subject / Project type
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Bulk Cot supply / Showroom display order"
                    className={inputBase}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Message / Requirement details <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the products, quantities, dimensions, or custom requirements you need..."
                    className={`${inputBase} resize-none`}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <motion.button
                  type="submit"
                  disabled={status !== "idle"}
                  whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                  whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-70 sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  {status === "idle" && "Submit & Enquire on WhatsApp"}
                  {status === "sending" && "Redirecting to WhatsApp..."}
                </motion.button>

                <p className="text-[11px] text-muted-foreground text-center sm:text-right">
                  Redirects directly to WhatsApp ({COMPANY.whatsappFormatted})
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}
