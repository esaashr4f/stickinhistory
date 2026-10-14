"use client"

import { useEffect, useRef, useState } from "react"
import type { LiquidGlass } from "liquid-glass-js"

// Phones only: a floating bar with quick links to the three things people come
// for. It appears once the hero has scrolled away.
//
// On capable phones it sits on a liquid-glass lens (liquid-glass-js), which
// refracts a clone of the page content. Everywhere else, including reduced
// motion and reduced transparency, it's a plain frosted bar.

const links = [
  { href: "#shop", label: "Shop" },
  { href: "#patreon", label: "Patreon" },
  { href: "#commission", label: "Commission" },
]

// The library builds these elements but doesn't list them in its types.
type GlassInternals = { lensEl: HTMLElement; glassEl: HTMLElement }

function canUseGlass() {
  const mq = (q: string) => window.matchMedia(q).matches
  if (mq("(prefers-reduced-motion: reduce)") || mq("(prefers-reduced-transparency: reduce)")) return false
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return false
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return false
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) return false
  return true
}

export function MobileNav() {
  const bar = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [glassOn, setGlassOn] = useState(false)

  // Show the bar once the hero is fully out of view.
  useEffect(() => {
    const hero = document.querySelector("header")
    if (!hero) return
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting))
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  // Put the glass lens behind the bar while it's shown on a phone.
  useEffect(() => {
    const el = bar.current
    const content = document.getElementById("page-content")
    if (!shown || !el || !content) return
    if (!window.matchMedia("(max-width: 639px)").matches || !canUseGlass()) return

    let glass: LiquidGlass | null = null
    let cancelled = false
    let settle = 0

    const place = () => {
      if (!glass) return
      const r = el.getBoundingClientRect()
      glass.set({ width: Math.round(r.width), height: Math.round(r.height), radius: Math.round(r.height / 2) })
      glass.moveTo(r.left, r.top)
    }
    // The lens shows a snapshot of the page, so re-take it whenever scrolling stops.
    const onScroll = () => {
      window.clearTimeout(settle)
      settle = window.setTimeout(() => glass?.refresh(), 200)
    }

    import("liquid-glass-js").then(({ LiquidGlass }) => {
      if (cancelled) return
      const r = el.getBoundingClientRect()
      glass = new LiquidGlass({
        background: content,
        draggable: false,
        zIndex: 40,
        x: r.left,
        y: r.top,
        width: Math.round(r.width),
        height: Math.round(r.height),
        radius: Math.round(r.height / 2),
        scale: 28,
        depth: 18,
        curvature: 3,
        chroma: 0.08,
        blur: 2.5,
        glow: 0.08,
        edge: 0.55,
        tint: 0.4,
        tintColor: getComputedStyle(document.body).backgroundColor,
      })
      // The cloned page is decoration: keep keyboard focus and screen readers out of it.
      ;(glass as unknown as GlassInternals).lensEl.inert = true
      setGlassOn(true)
      // The bar slides up as it appears; line the lens up again once it has landed.
      window.setTimeout(place, 320)
      window.addEventListener("resize", place)
      window.addEventListener("scroll", onScroll, { passive: true })
    })

    return () => {
      cancelled = true
      window.clearTimeout(settle)
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", onScroll)
      glass?.destroy()
      setGlassOn(false)
    }
  }, [shown])

  return (
    <nav
      ref={bar}
      aria-label="Jump to"
      inert={!shown}
      className={[
        "fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-1/2 z-50 flex h-14 w-[min(360px,calc(100vw-32px))] -translate-x-1/2 items-center justify-around rounded-full px-2 transition-[opacity,translate] duration-300 sm:hidden",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        glassOn
          ? "bg-transparent"
          : "border border-border bg-background/80 shadow-[0_8px_30px_rgb(0_0_0/0.25),0_2px_6px_rgb(0_0_0/0.2)] backdrop-blur-md",
      ].join(" ")}
    >
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="flex min-h-11 items-center rounded-full px-4 text-[15px] font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        >
          {l.label}
        </a>
      ))}
    </nav>
  )
}
