"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { sendCommission, type CommissionState } from "@/app/actions"
import { site } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    turnstile?: { reset: (el?: string | HTMLElement) => void }
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const field = "h-11 bg-card text-[15px] md:text-[15px]"

export function CommissionForm() {
  const [state, action, pending] = useActionState(sendCommission, { status: "idle" } satisfies CommissionState)
  const [formKey, setFormKey] = useState(0)
  const [dismissed, setDismissed] = useState<CommissionState | null>(null)
  const done = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === "success") done.current?.focus()
    if (state.status === "error") window.turnstile?.reset()
  }, [state])

  if (state.status === "success" && state !== dismissed) {
    return (
      <div ref={done} tabIndex={-1} role="status" className="flex flex-col gap-3 rounded-md border-l-4 border-primary bg-card p-5 outline-none">
        <strong className="font-heading text-2xl font-semibold">Request sent.</strong>
        <p className="text-muted-foreground">
          Thanks. It&apos;s in my inbox now and I&apos;ll reply within a few days with a quote and some questions.
        </p>
        <div>
          <Button variant="outline" className="h-10 px-4" onClick={() => {
              setDismissed(state)
              setFormKey((k) => k + 1)
            }}>
            Send another
          </Button>
        </div>
      </div>
    )
  }

  const v = (state.status === "error" && state.values) || {}
  const err = (state.status === "error" && state.errors) || {}

  return (
    <form key={formKey} action={action} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Your name" name="name" error={err.name}>
        <Input id="f-name" name="name" autoComplete="name" defaultValue={v.name} className={field} />
      </Field>
      <Field label="Email or Instagram" name="contact" error={err.contact}>
        <Input id="f-contact" name="contact" required placeholder="you@example.com or @handle" defaultValue={v.contact} className={field} aria-invalid={!!err.contact || undefined} aria-describedby={err.contact ? "e-contact" : undefined} />
      </Field>
      <Field label="What it's for" name="purpose" error={err.purpose}>
        <NativeSelect id="f-purpose" name="purpose" defaultValue={v.purpose ?? site.commissions.purposes[0]} className="w-full [&_select]:h-11 [&_select]:bg-card [&_select]:text-[15px]">
          {site.commissions.purposes.map((p) => (
            <NativeSelectOption key={p}>{p}</NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Length" name="length" error={err.length}>
        <NativeSelect id="f-length" name="length" defaultValue={v.length ?? site.commissions.lengths[1]} className="w-full [&_select]:h-11 [&_select]:bg-card [&_select]:text-[15px]">
          {site.commissions.lengths.map((l) => (
            <NativeSelectOption key={l}>{l}</NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field label="The story" name="story" error={err.story} full>
        <Textarea
          id="f-story"
          name="story"
          required
          rows={5}
          defaultValue={v.story}
          placeholder={`For example: a year 9 class is studying the Great Fire of London. A 90-second "you're there" episode as a baker's apprentice on Pudding Lane.`}
          className="min-h-32 bg-card text-[15px] md:text-[15px]"
          aria-invalid={!!err.story || undefined}
          aria-describedby={err.story ? "e-story" : undefined}
        />
      </Field>
      <Field label="Needed by" name="deadline" error={err.deadline}>
        <Input id="f-deadline" name="deadline" type="date" defaultValue={v.deadline} className={field} />
      </Field>
      <Field label="Budget" name="budget" error={err.budget}>
        <Input id="f-budget" name="budget" placeholder="e.g. £250" defaultValue={v.budget} className={field} />
      </Field>

      {/* Spam protection: real people never see or fill this field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input
        type="hidden"
        name="started_at"
        ref={(el) => {
          if (el && !el.value) el.value = String(Date.now())
        }}
      />

      {turnstileSiteKey && (
        <div className="sm:col-span-2">
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="auto" data-size="flexible" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending} className="h-11 px-5 text-[15px]">
          {pending ? "Sending…" : "Send my request"}
        </Button>
        <span role="status" className={cn("text-sm", state.status === "error" ? "text-primary" : "text-muted-foreground")}>
          {state.status === "error" ? state.message : "I reply to every request, usually within a few days."}
        </span>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  error,
  full,
  children,
}: {
  label: string
  name: string
  error?: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", full && "sm:col-span-2")}>
      <Label htmlFor={`f-${name}`} className="text-[13px] font-semibold">
        {label}
      </Label>
      {children}
      {error && (
        <span id={`e-${name}`} className="text-[13px] text-primary">
          {error}
        </span>
      )}
    </div>
  )
}
