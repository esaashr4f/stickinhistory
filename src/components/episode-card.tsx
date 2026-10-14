"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowUpRightIcon } from "lucide-react"
import { site } from "@/config/site"
import { Mascot } from "@/components/mascot"
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
    <section ref={ref} id="latest" aria-labelledby="latest-h">
      <a
        href={ep.href}
        target="_blank"
        rel="noopener"
        className="group grid overflow-hidden rounded-xl bg-card text-card-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/60 sm:grid-cols-[1fr_auto]"
      >
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <span className="text-sm text-muted-foreground">Latest episode</span>
          {/* Each dot stays with the word before it, so lines only break after a dot. */}
          <h2 id="latest-h" className="text-[clamp(28px,8vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em] uppercase">
            {words.map((w, i) => (
              <span key={w}>
                <span className="inline-block overflow-hidden align-bottom whitespace-nowrap">
                  <span data-ep="word" className="inline-block">
                    {w}
                    {i < words.length - 1 && <span className="text-primary">{"\u00a0·"}</span>}
                  </span>
                </span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h2>
          <span data-ep="rule" className="block h-px w-full bg-primary" />
          <p data-ep="blurb" className="max-w-[44ch] text-pretty text-muted-foreground">{ep.blurb}</p>
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            <UnderlineToBackground targetTextColor="var(--primary-foreground)" className="px-0.5">
              Watch Act I
            </UnderlineToBackground>
            <ArrowUpRightIcon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div data-ep="mascot" className="hidden items-end justify-center px-8 pt-8 sm:flex">
          <Mascot className="w-24" />
        </div>
      </a>
    </section>
  )
}
