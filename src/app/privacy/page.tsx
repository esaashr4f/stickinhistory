import type { Metadata } from "next"
import Link from "next/link"
import { site } from "@/config/site"

export const metadata: Metadata = {
  title: `Privacy · ${site.name}`,
  description: `How ${site.name} handles the details you send through the commission form.`,
}

// Plain-English privacy notice for the commission form. Update the date below
// whenever this changes.
const updated = "14 October 2026"

export default function Privacy() {
  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col gap-8 px-[max(16px,env(safe-area-inset-left))] py-12 pb-[max(3rem,env(safe-area-inset-bottom))]">
      <Link href="/" className="text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground">
        ← Back to {site.name}
      </Link>

      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl leading-none font-extrabold tracking-[-0.03em]">Privacy</h1>
        <p className="text-sm text-muted-foreground">Last updated {updated}</p>
      </header>

      <div className="flex flex-col gap-8 text-pretty [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_section]:flex [&_section]:flex-col [&_section]:gap-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        <p>
          {site.name} is run by one person in the UK. This page explains what happens to the details you give me,
          which only happens if you use the commission form.
        </p>

        <section>
          <h2>What I collect</h2>
          <p>When you send a commission request, I get what you type into the form:</p>
          <ul>
            <li>your name and your email address or Instagram handle</li>
            <li>what the video is for, its length, your deadline and budget</li>
            <li>the story you describe</li>
          </ul>
          <p>Please don’t include anything sensitive, such as health details, that the video doesn’t need.</p>
        </section>

        <section>
          <h2>Why, and on what basis</h2>
          <p>
            Only to reply to you, quote for the video and make it if you go ahead. The legal basis is taking steps
            at your request before we agree a commission, and my legitimate interest in answering enquiries. I
            don’t sell your details, add you to a mailing list or use them for advertising.
          </p>
        </section>

        <section>
          <h2>Who handles it</h2>
          <ul>
            <li>
              <strong>Resend</strong> delivers the form to my inbox as an email. It may process data outside the UK,
              under standard data-protection safeguards.
            </li>
            <li>
              <strong>My email provider</strong> stores the email at {site.email}.
            </li>
            <li>
              <strong>Vercel</strong> hosts this site and keeps short-lived technical logs (like IP addresses) to run
              it and stop abuse.
            </li>
          </ul>
        </section>

        <section>
          <h2>How long I keep it</h2>
          <p>
            If a commission doesn’t go ahead, I delete the request within 12 months. If it does, I keep our
            messages for as long as I need them for the work and for my records, usually up to 6 years for tax.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            This site doesn’t use tracking or advertising cookies. It remembers whether you picked light or dark
            mode in your own browser, and that never leaves your device.
          </p>
        </section>

        <section>
          <h2>Other sites</h2>
          <p>
            The shop, Patreon, Instagram, TikTok and YouTube links go to other companies’ sites, which have their own
            privacy policies. Buying merch or joining Patreon happens there, not here.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            You can ask for a copy of your details, ask me to correct them, or ask me to delete them. Email{" "}
            <a href={`mailto:${site.email}`} className="underline decoration-primary underline-offset-4">
              {site.email}
            </a>{" "}
            and I’ll reply within a month. If you’re unhappy with how I’ve handled your data, you can complain to the{" "}
            <a href="https://ico.org.uk/make-a-complaint/" className="underline decoration-primary underline-offset-4">
              Information Commissioner’s Office
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
