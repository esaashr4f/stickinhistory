import { Suspense } from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { site } from "@/config/site"
import { Mascot } from "@/components/mascot"
import { HeroBackground } from "@/components/hero-background"
import { SplitText } from "@/components/split-text"
import { ThemeToggle } from "@/components/theme"
import { EpisodeCard } from "@/components/episode-card"
import { Shop } from "@/components/shop"
import { SectionHeading } from "@/components/section-heading"
import { CommissionForm } from "@/components/commission-form"
import { MobileNav } from "@/components/mobile-nav"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const column = "mx-auto w-full max-w-[600px] px-[max(16px,env(safe-area-inset-left))]"
const section = "flex scroll-mt-6 flex-col gap-5 border-t border-border pt-10"
const primaryButton = cn(buttonVariants({ size: "lg" }), "h-11 rounded-md px-5 text-base")

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-20 rounded-md bg-background px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {/* The hero is always the dark volcanic panel, whatever the page theme. */}
      <header className="dark relative isolate overflow-hidden bg-background text-foreground">
        <HeroBackground />
        <div className="absolute top-3 right-[max(12px,env(safe-area-inset-right))] z-10">
          <ThemeToggle />
        </div>
        <div className={cn(column, "flex flex-col items-center gap-5 pt-16 pb-12 text-center sm:pt-20 sm:pb-16")}>
          <Mascot className="w-20" running />
          <div className="flex flex-col items-center gap-2">
            <SplitText
              text={site.name}
              className="font-heading text-[clamp(36px,10vw,58px)] leading-none font-extrabold font-stretch-[112%] tracking-[-0.03em] [word-spacing:0.1em] text-balance"
            />
            <p className="text-muted-foreground">{site.tagline}</p>
          </div>
          <p className="max-w-[40ch] text-pretty">{site.description}</p>
          <nav aria-label="Socials" className="-mb-2 flex flex-wrap justify-center gap-x-1">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center px-3 text-[15px] font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* page-content is what the phone nav's glass lens refracts. */}
      <div id="page-content">
        <main id="main" className={cn(column, "flex flex-col gap-12 py-12")}>
          <EpisodeCard />

          <Suspense fallback={null}>
            <Shop className={section} />
          </Suspense>

          <section id="patreon" aria-labelledby="patreon-h" className={section}>
            <SectionHeading id="patreon-h">Support on Patreon</SectionHeading>
            <p>
              Every episode takes hours of research and dozens of drawings. Members keep the series going and get a say in
              where it goes next.
            </p>
            <ul className="flex flex-col">
              {site.patreon.tiers.map((t) => (
                <li key={t.name} className="grid grid-cols-[5.5rem_1fr] gap-x-4 border-b border-border py-3 first:pt-0">
                  <span className="font-semibold tabular-nums">
                    {t.price}
                    <span className="font-normal text-muted-foreground">/mo</span>
                  </span>
                  <span>
                    <span className="font-semibold">{t.name}.</span>{" "}
                    <span className="text-muted-foreground">{t.perk}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <a href={site.patreon.href} target="_blank" rel="noopener" className={primaryButton}>
                Join on Patreon <ArrowUpRightIcon aria-hidden="true" />
              </a>
            </div>
          </section>

          <section id="commission" aria-labelledby="commission-h" className={section}>
            <SectionHeading id="commission-h">Commission a video</SectionHeading>
            <p>
              Want your own stickman story? A birthday, a company’s history, a lesson for a classroom, a moment from your
              family’s past. Tell me about it below.
            </p>
            <dl aria-label="Guide prices" className="flex flex-col">
              {site.commissions.rates.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 first:pt-0">
                  <dt className="text-muted-foreground">{r.label}</dt>
                  <dd className="tabular-nums">{r.price}</dd>
                </div>
              ))}
            </dl>
            <CommissionForm />
          </section>
        </main>

        <footer className={cn(column, "flex flex-col gap-1.5 border-t border-border pt-8 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-muted-foreground")}>
          <p>
            Enquiries:{" "}
            <a href={`mailto:${site.email}`} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary">
              {site.email}
            </a>
          </p>
          <p>{site.name} · Pompeii, 79&nbsp;AD. Part II coming soon.</p>
          <p>Everything shown is historically accurate except the main characters.</p>
        </footer>
      </div>

      <MobileNav />
    </>
  )
}
