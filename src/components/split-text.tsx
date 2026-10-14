"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { SplitText as GSAPSplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(GSAPSplitText, useGSAP)

// Adapted from React Bits' SplitText (https://reactbits.dev/text-animations/split-text):
// the headline's letters rise into place once, on load.
//
// To avoid a flash of the full headline before the animation starts, CSS hides
// [data-split] while <html> has the "motion" class (set before paint for anyone
// without reduced-motion). A CSS fallback reveals it anyway if JS never runs.
export function SplitText({
  text,
  as: Tag = "h1",
  className,
  delay = 0.15,
}: {
  text: string
  as?: "h1" | "h2" | "p"
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const reveal = () => {
        el.style.visibility = "visible"
        el.style.animation = "none"
      }
      if (!document.documentElement.classList.contains("motion")) return reveal()

      let split: GSAPSplitText | undefined
      document.fonts.ready.then(() => {
        split = new GSAPSplitText(el, { type: "words,chars", charsClass: "inline-block will-change-transform" })
        reveal()
        gsap.from(split.chars, {
          yPercent: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.035,
          delay,
          onComplete: () => split?.revert(),
        })
      })
      return () => split?.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} data-split="" className={className}>
      {text}
    </Tag>
  )
}
