"use server"

import { Resend } from "resend"
import { site } from "@/config/site"

// Handles the "Commission a video" form. Runs on the server only, so the API
// keys below never reach the browser.
//
// Environment variables (see .env.example):
//   RESEND_API_KEY          required to actually send email
//   COMMISSION_TO_EMAIL     where requests are delivered (the owner's inbox)
//   COMMISSION_FROM_EMAIL   sender; must be on a domain verified in Resend
//   TURNSTILE_SECRET_KEY    optional; turns on the Cloudflare Turnstile check

export type CommissionState = {
  status: "idle" | "success" | "error"
  message?: string
  errors?: Partial<Record<Field, string>>
  values?: Partial<Record<Field, string>>
}

type Field = "name" | "contact" | "purpose" | "length" | "story" | "deadline" | "budget"

const limits: Record<Field, number> = {
  name: 100,
  contact: 200,
  purpose: 60,
  length: 60,
  story: 4000,
  deadline: 20,
  budget: 60,
}

// Anything submitted faster than this after the page loaded is almost certainly a bot.
const MIN_FILL_MS = 3000

export async function sendCommission(_prev: CommissionState, formData: FormData): Promise<CommissionState> {
  const values = Object.fromEntries(
    (Object.keys(limits) as Field[]).map((k) => [k, String(formData.get(k) ?? "").trim()]),
  ) as Record<Field, string>

  // Spam checks. Bots get a fake "sent" so they don't learn to adapt.
  const honeypot = String(formData.get("website") ?? "")
  const startedAt = Number(formData.get("started_at") ?? 0)
  // started_at is filled in by the browser, so it's missing if JS didn't load; don't punish that.
  if (honeypot || (startedAt && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: "success" }
  }

  const errors: CommissionState["errors"] = {}
  if (!values.contact) errors.contact = "Add an email or Instagram handle so I can reply."
  if (!values.story) errors.story = "Tell me a little about the story."
  for (const [k, max] of Object.entries(limits) as [Field, number][]) {
    if (values[k].length > max) errors[k] = `Keep this under ${max} characters.`
  }
  if (values.purpose && !site.commissions.purposes.includes(values.purpose as never)) errors.purpose = "Pick one of the options."
  if (values.length && !site.commissions.lengths.includes(values.length as never)) errors.length = "Pick one of the options."
  if (values.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(values.deadline)) errors.deadline = "Use the date picker."
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "A couple of things need fixing.", errors, values }
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""))
    if (!ok) {
      return { status: "error", message: "The spam check didn't go through. Tick the box and try again.", values }
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.COMMISSION_TO_EMAIL
  const from = process.env.COMMISSION_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`
  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[commission] Email isn't configured, so here's what would have been sent:\n" + toText(values))
      return { status: "success" }
    }
    console.error("[commission] RESEND_API_KEY or COMMISSION_TO_EMAIL is missing")
    return { status: "error", message: "The form isn't connected yet. Message me on Instagram instead.", values }
  }

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: isEmail(values.contact) ? values.contact : undefined,
    subject: `Commission request: ${values.purpose || "custom video"} from ${values.name || values.contact}`,
    text: toText(values),
  })
  if (error) {
    console.error("[commission] Resend error", error)
    return { status: "error", message: "Something went wrong sending that. Try again in a minute.", values }
  }

  return { status: "success" }
}

function toText(v: Record<Field, string>) {
  return [
    "CUSTOM VIDEO REQUEST",
    `Name: ${v.name || "—"}`,
    `Contact: ${v.contact}`,
    `For: ${v.purpose || "—"}`,
    `Length: ${v.length || "—"}`,
    `Needed by: ${v.deadline || "Flexible"}`,
    `Budget: ${v.budget || "Not given"}`,
    "",
    "Story:",
    v.story,
  ].join("\n")
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

async function verifyTurnstile(token: string) {
  if (!token) return false
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token }),
    })
    const data: { success?: boolean } = await res.json()
    return data.success === true
  } catch (err) {
    console.error("[commission] Turnstile check failed", err)
    return false
  }
}
