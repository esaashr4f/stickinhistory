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
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const column = "mx-auto w-full max-w-[640px] px-[max(16px,env(safe-area-inset-left))]"

export default function Home() {
  return (
    <>
      {/* The hero is always the dark volcanic panel, whatever the page theme. */}
      <header className="dark relative isolate overflow-hidden border-b-2 border-primary bg-background text-foreground">
        <HeroBackground />
        <div className="absolute top-4 right-[max(16px,env(safe-area-inset-right))] z-10">
          <ThemeToggle />
        </div>
        <div className={cn(column, "flex flex-col items-center gap-4 pt-16 pb-14 text-center sm:pt-20 sm:pb-20")}>
          <Mascot className="w-24" running />
          <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{site.tagline}</span>
          <SplitText
            text={site.name}
            className="font-heading text-[clamp(40px,11vw,68px)] leading-none font-extrabold text-balance"
          />
          <p className="max-w-[44ch] text-muted-foreground">{site.description}</p>
          <nav aria-label="Socials" className="flex flex-wrap justify-center gap-2.5 pt-1">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-10 items-center rounded-full border border-border bg-background/40 px-4 text-sm font-medium backdrop-blur-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className={cn(column, "flex flex-col gap-14 py-12 sm:gap-16")}>
        <EpisodeCard />

        <Suspense fallback={null}>
          <Shop />
        </Suspense>

        <section id="patreon" aria-labelledby="patreon-h" className="flex flex-col gap-5">
          <SectionHeading id="patreon-h" tag="Monthly">
            Support on Patreon
          </SectionHeading>
          <p>
            Every episode takes hours of research and dozens of drawings. Members keep the series going and get a say in
            where it goes next.
          </p>
          <ul className="flex flex-col border-t border-border">
            {site.patreon.tiers.map((t) => (
              <li key={t.name} className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-1 border-b border-border py-3.5">
                <span className="row-span-2 font-heading text-[26px] leading-tight font-extrabold">{t.price}</span>
                <span className="font-semibold">{t.name}</span>
                <span className="text-[15px] text-muted-foreground">{t.perk}</span>
              </li>
            ))}
          </ul>
          <div>
            <a href={site.patreon.href} target="_blank" rel="noopener" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-[15px]")}>
              Join on Patreon <ArrowUpRightIcon aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="commission" aria-labelledby="commission-h" className="flex flex-col gap-5">
          <SectionHeading id="commission-h" tag="Limited slots">
            Commission a video
          </SectionHeading>
          <p>
            Want your own stickman story? A birthday, a company&apos;s history, a lesson for a classroom, a moment from
            your family&apos;s past. Tell me about it below.
          </p>
          <dl aria-label="Guide prices" className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border min-[420px]:grid-cols-3">
            {site.commissions.rates.map((r) => (
              <div key={r.label} className="flex flex-col gap-0.5 bg-background p-3">
                <dt className="text-[13px] text-muted-foreground">{r.label}</dt>
                <dd className="font-mono text-[15px]">{r.price}</dd>
              </div>
            ))}
          </dl>
          <CommissionForm />
        </section>
      </main>

      <footer className={cn(column, "flex flex-col items-center gap-2 border-t border-border py-8 text-center text-[13px] text-muted-foreground")}>
        <p>
          {site.name} · Pompeii, 79 AD. Part II coming soon.
        </p>
        <p>
          Enquiries:{" "}
          <a href={`mailto:${site.email}`} className="text-foreground underline decoration-primary underline-offset-4 hover:text-primary">
            {site.email}
          </a>
        </p>
        <p>Everything shown is historically accurate except the main characters.</p>
      </footer>
    </>
  )
}
