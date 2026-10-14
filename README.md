# Stick in History

The link-in-bio site for the stickman history channel: shop, Patreon and commissions on one page.

Built with Next.js (App Router), TypeScript, Tailwind and shadcn/ui, with Lenis for smooth scrolling,
GSAP for the scroll animation and split-text headline, a Paper shader for the hero background, and
liquid-glass-js for the phone navigation bar.

## Running it on your computer

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev                  # open http://localhost:3000
```

Without any keys the site still works: the shop shows the products listed in `src/config/site.ts`, and in `npm run dev`
commission requests are printed in the terminal instead of emailed.

## Where to change things

| What | Where |
| --- | --- |
| Name, tagline, enquiries email, social links, latest episode, shop products, Patreon tiers, prices, form options | `src/config/site.ts` |
| Links per deployment, keys | environment variables (see `.env.example`) |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| The mascot | `src/components/mascot.tsx` |
| Page layout and copy | `src/app/page.tsx` |
| Privacy notice (update the date when you change it) | `src/app/privacy/page.tsx` |

## How each part works

- **Shop** (`src/lib/fourthwall.ts`): if `FOURTHWALL_STOREFRONT_TOKEN` is set, products come from the
  [Fourthwall Storefront API](https://docs.fourthwall.com/storefront/overview) and are refreshed about once
  an hour. Otherwise (the default) the products in `site.ts` show, each linking to its own Fourthwall
  product page; photos are in `public/products/`.
- **Patreon**: a link to `NEXT_PUBLIC_PATREON_URL`.
- **Commission form** (`src/app/actions.ts`): a server action validates the request and emails it to
  `site.email` (or `COMMISSION_TO_EMAIL` if set) with [Resend](https://resend.com). Spam protection is a hidden honeypot field plus a
  "filled in too fast" check; add Turnstile keys to also show Cloudflare's checkbox. If the visitor gives an
  email address, hitting Reply in your inbox replies to them.
- **Hero background** (`src/components/hero-background.tsx`): Paper's `MeshGradient` shader (about 8 kB). It's
  only downloaded once the page is idle, pauses when the hero is offscreen, and is skipped (a static image,
  `public/hero-ash.svg`, shows instead) for reduced motion, data saver, low-power phones and no WebGL.
  Colours, speed and grain are props on `<Gradient>` in that file.
- **Phone nav bar** (`src/components/mobile-nav.tsx`): Shop / Patreon / Commission links that appear once the
  hero scrolls away, on screens under 640px. Capable phones get a liquid-glass lens behind it; everyone else
  (including reduced motion or reduced transparency) gets a plain frosted bar.
- **Animation**: one scroll-linked moment on the latest-episode card (`src/components/episode-card.tsx`)
  and the headline letters on load (`src/components/split-text.tsx`, adapted from React Bits).
- **Fancy Components** (`src/components/fancy/`, from [fancycomponents.dev](https://www.fancycomponents.dev)):
  the hover fill on "Watch Act I". Add more with `npx shadcn add @fancy/<name>`; files marked
  "Local change" were tweaked for reduced motion and Next.js.

## Installed for later

Unused packages aren't sent to visitors, so these cost nothing until a component imports them.

- `@react-three/fiber` (React Three Fiber) and `@shadergradient/react`: 3D scenes and animated gradients.
- `@paper-design/shaders-react`: besides the hero's `MeshGradient`, it has `LiquidMetal` (the Liquid Logo
  effect) and other shaders.
- `awesome-design-md` (dev tool): `npx awesome-design-md` copies a ready-made DESIGN.md into the project.


## Deploying to Vercel

1. Import this GitHub repo at [vercel.com/new](https://vercel.com/new). The defaults are right.
2. Add the variables from `.env.example` under Settings > Environment Variables.
3. Deploy. After changing a variable, redeploy for it to take effect.

## Checks

```bash
npm run lint
npm run build
```
