"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowUpRightIcon } from "lucide-react"
import { site } from "@/config/site"
import { Mascot } from "@/components/mascot"
import { TextHighlighter } from "@/components/fancy/text/text-highlighter"
import UnderlineToBackground from "@/components/fancy/text/underline-to-background"

gsap.registerPlugin(ScrollTrigger, useGSAP)

// The page's one orchestrated scroll moment: as the latest-episode title card
// scrolls into view, the red rule draws across, the title words drop in one by
// one, and the narrator steps up from the bottom. It's tied to scroll position
// (scrubbed), so scrolling back up plays it in reverse.
// With reduced motion, or before JS loads, the card is simply shown as-is.
export function EpisodeCard() {
  const ref = useRef<HTMLElement>(null)
  const ep = site.latestEpisode
  const words = [ep.place, ep.year, ep.act]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 30%", scrub: 0.6 },
          })
          .from("[data-ep=rule]", { scaleX: 0, transformOrigin: "left center", ease: "none", duration: 1 })
          .from("[data-ep=word]", { yPercent: 110, opacity: 0, stagger: 0.35, duration: 0.8, ease: "power2.out" }, 0.2)
          .from("[data-ep=mascot]", { yPercent: 40, opacity: 0, duration: 1, ease: "power2.out" }, 0.6)
          .from("[data-ep=blurb]", { opacity: 0, y: 16, duration: 0.6 }, 1.1)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="latest" aria-labelledby="latest-h" className="dark">
      <a
        href={ep.href}
        target="_blank"
        rel="noopener"
        className="group relative grid overflow-hidden rounded-lg border border-border bg-background text-foreground outline-none transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/60 sm:grid-cols-[1fr_auto]"
      >
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <span className="font-mono text-xs tracking-[0.14em] text-primary uppercase">Latest episode</span>
          <h2 id="latest-h" className="flex flex-wrap items-baseline gap-x-3 font-heading text-4xl leading-none font-extrabold uppercase sm:text-5xl">
            {words.map((w, i) => (
              <span key={w} className="flex items-baseline gap-x-3 overflow-hidden py-1">
                {i > 0 && <span aria-hidden="true" className="text-primary">·</span>}
                <span data-ep="word" className="inline-block">{w}</span>
              </span>
            ))}
          </h2>
          <span data-ep="rule" className="block h-0.5 w-full bg-primary" />
          <p data-ep="blurb" className="max-w-[44ch] text-muted-foreground">
            {ep.blurb}{" "}
            <TextHighlighter
              className="px-0.5 text-foreground"
              highlightColor="color-mix(in oklab, var(--primary) 55%, transparent)"
              useInViewOptions={{ once: true, amount: 1 }}
              transition={{ type: "spring", duration: 1, delay: 0.5, bounce: 0 }}
            >
              {ep.punchline}
            </TextHighlighter>
          </p>
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            <UnderlineToBackground targetTextColor="var(--primary-foreground)" className="px-0.5">
              Watch Act I
            </UnderlineToBackground>
            <ArrowUpRightIcon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div data-ep="mascot" className="hidden items-end justify-center px-6 pt-6 sm:flex">
          <Mascot className="w-32" />
        </div>
      </a>
    </section>
  )
}
