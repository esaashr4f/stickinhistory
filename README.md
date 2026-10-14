# Stick in History

The link-in-bio site for the stickman history channel: shop, Patreon and commissions on one page.

Built with Next.js (App Router), TypeScript, Tailwind and shadcn/ui, with Lenis for smooth scrolling,
GSAP for the scroll animation and split-text headline, and Vanta.js for the hero fog.

## Running it on your computer

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev                  # open http://localhost:3000
```

Without any keys the site still works: the shop shows placeholder products, and in `npm run dev`
commission requests are printed in the terminal instead of emailed.

## Where to change things

| What | Where |
| --- | --- |
| Name, tagline, social links, latest episode, Patreon tiers, prices, form options | `src/config/site.ts` |
| Links per deployment, keys | environment variables (see `.env.example`) |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| The mascot | `src/components/mascot.tsx` |
| Page layout and copy | `src/app/page.tsx` |

## How each part works

- **Shop** (`src/lib/fourthwall.ts`): if `FOURTHWALL_STOREFRONT_TOKEN` is set, products come from the
  [Fourthwall Storefront API](https://docs.fourthwall.com/storefront/overview) and are refreshed about once
  an hour. Otherwise the three placeholder products show, all linking to `NEXT_PUBLIC_SHOP_URL`.
- **Patreon**: a link to `NEXT_PUBLIC_PATREON_URL`.
- **Commission form** (`src/app/actions.ts`): a server action validates the request and emails it to
  `COMMISSION_TO_EMAIL` with [Resend](https://resend.com). Spam protection is a hidden honeypot field plus a
  "filled in too fast" check; add Turnstile keys to also show Cloudflare's checkbox. If the visitor gives an
  email address, hitting Reply in your inbox replies to them.
- **Hero fog** (`src/components/hero-background.tsx`): Vanta and three.js are only downloaded once the page
  is idle, stop drawing when the hero is offscreen, and are skipped (a static image, `public/hero-ash.svg`,
  shows instead) for reduced motion, data saver, low-power phones and browsers without WebGL.
- **Animation**: one scroll-linked moment on the latest-episode card (`src/components/episode-card.tsx`)
  and the headline letters on load (`src/components/split-text.tsx`, adapted from React Bits).
- **Fancy Components** (`src/components/fancy/`, from [fancycomponents.dev](https://www.fancycomponents.dev)):
  the inside-jokes marquee under the hero (jokes are in `site.ts`), the highlighter on the episode punchline,
  and the hover fill on "Watch Act I". Add more with `npx shadcn add @fancy/<name>`; files marked
  "Local change" were tweaked for reduced motion and Next.js.

## Deploying to Vercel

1. Import this GitHub repo at [vercel.com/new](https://vercel.com/new). The defaults are right.
2. Add the variables from `.env.example` under Settings > Environment Variables.
3. Deploy. After changing a variable, redeploy for it to take effect.

## Checks

```bash
npm run lint
npm run build
```
