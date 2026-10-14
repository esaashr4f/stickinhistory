"use client"

import { useEffect, useState, type ComponentType } from "react"
import type { MeshGradientProps } from "@paper-design/shaders-react"

// A slow charcoal-and-ember mesh gradient behind the hero, drawn with Paper's
// MeshGradient shader (plain WebGL, no three.js, so it's light on phones).
//
// - The static image (public/hero-ash.svg) always renders first and stays as the fallback.
// - The shader is only downloaded after the page has settled (idle time).
// - It's skipped for reduced motion, data saver, low-power devices and no WebGL.
// - Paper pauses it by itself when the hero is offscreen or the tab is hidden.

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
    if (!canvas.getContext("webgl2")) return false
  } catch {
    return false
  }
  return true
}

export function HeroBackground() {
  const [Gradient, setGradient] = useState<ComponentType<MeshGradientProps> | null>(null)

  useEffect(() => {
    if (!shouldAnimate()) return
    let cancelled = false
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(() => {
      import("@/components/mesh-gradient").then((m) => {
        if (!cancelled) setGradient(() => m.MeshGradient)
      })
    })
    return () => {
      cancelled = true
      cancelIdle(handle)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG, nothing for next/image to optimise */}
      <img src="/hero-ash.svg" alt="" className="absolute inset-0 size-full object-cover" />
      {Gradient && (
        <Gradient
          className="absolute inset-0 size-full animate-in duration-1000 fade-in"
          colors={["#161412", "#3a1d18", "#7a2a1e", "#211c19"]}
          distortion={0.85}
          swirl={0.35}
          grainOverlay={0.12}
          speed={0.25}
          // A soft gradient doesn't need full retina resolution; cap the work for phones.
          minPixelRatio={1}
          maxPixelCount={1280 * 720}
        />
      )}
    </div>
  )
}
