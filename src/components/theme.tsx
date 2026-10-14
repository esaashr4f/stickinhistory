"use client"

import { useSyncExternalStore } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

// Dark is the default. A visitor's choice is remembered in localStorage.
// The inline script runs before first paint so there's no flash of the wrong theme.
const STORAGE_KEY = "theme"

// It also adds "motion" for visitors who haven't asked for reduced motion (see split-text.tsx).
export const themeScript = `(function(d){try{if(localStorage.getItem("${STORAGE_KEY}")==="light")d.classList.remove("dark")}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("motion")})(document.documentElement)`

const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const isDark = () => document.documentElement.classList.contains("dark")

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => true)

  function toggle() {
    const next = !isDark()
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
    } catch {}
    listeners.forEach((fn) => fn())
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {dark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  )
}
