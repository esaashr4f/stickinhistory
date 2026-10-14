"use client"

import { useEffect, useRef } from "react"
import type { VantaEffect } from "vanta/dist/vanta.fog.min"

// A slow charcoal-and-red fog behind the hero, drawn with Vanta.js.
//
// It's the heaviest thing on the page, so it is careful:
// - The static image (public/hero-ash.svg) always renders first and stays as the fallback.
// - Vanta and three.js are only downloaded after the page has settled (idle time).
// - It's skipped entirely for reduced motion, data saver, low-power devices and no WebGL.
// - It stops rendering when the hero is scrolled offscreen or the tab is hidden.

function shouldAnimate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }
  if (nav.connection?.saveData) return false
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return false
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) return false
  try {
    const canvas = document.createElement("canvas")
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return false
  } catch {
    return false
  }
  return true
}

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !shouldAnimate()) return

    let effect: VantaEffect | null = null
    let cancelled = false
    let onScreen = true

    const pause = () => effect && cancelAnimationFrame(effect.req)
    const resume = () => {
      if (!effect) return
      cancelAnimationFrame(effect.req)
      effect.animationLoop()
    }
    const sync = () => (onScreen && !document.hidden ? resume() : pause())

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    observer.observe(el)
    document.addEventListener("visibilitychange", sync)

    async function start() {
      const [THREE, { default: FOG }] = await Promise.all([
        import("three"),
        import("vanta/dist/vanta.fog.min"),
      ])
      if (cancelled || !el) return
      effect = FOG({
        el,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        highlightColor: 0x6b2a20,
        midtoneColor: 0x3a1d18,
        lowlightColor: 0x1f1c19,
        baseColor: 0x161412,
        blurFactor: 0.7,
        speed: 0.6,
        zoom: 0.8,
      })
      el.dataset.ready = "true"
      sync()
    }

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(() => void start())

    return () => {
      cancelled = true
      cancelIdle(handle)
      observer.disconnect()
      document.removeEventListener("visibilitychange", sync)
      effect?.destroy()
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG, nothing for next/image to optimise */}
      <img src="/hero-ash.svg" alt="" className="absolute inset-0 size-full object-cover" />
      <div
        ref={ref}
        className="absolute inset-0 opacity-0 transition-opacity duration-[1500ms] data-[ready=true]:opacity-100"
      />
    </div>
  )
}
