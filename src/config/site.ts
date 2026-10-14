// Everything the owner is likely to change lives here.
// Links can also be set per-deployment with NEXT_PUBLIC_* environment variables
// (see .env.example), so you can change them on Vercel without touching code.

export const site = {
  name: "Stick in History",
  tagline: "History, as it happened to you",
  description:
    "Stickman stories from inside history's worst days. Pompeii, 79 AD is out now. Follow along for each new part.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  socials: [
    { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/" },
    { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/" },
    { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://www.youtube.com/" },
  ],

  latestEpisode: {
    place: "Pompeii",
    year: "79 AD",
    act: "Act I",
    blurb: "It's the year 79. You're a slave in Pompeii. The mountain has been grumbling for days. Nobody gives a shit.",
    href: process.env.NEXT_PUBLIC_LATEST_EPISODE_URL ?? "https://www.instagram.com/",
  },

  shop: {
    href: process.env.NEXT_PUBLIC_SHOP_URL ?? "https://fourthwall.com/",
    // Shown when the Fourthwall API isn't connected yet, or fails.
    placeholderProducts: [
      { id: "tee", name: "“I ain't doing that shit” tee", price: "from £22", art: "tee" },
      { id: "hoodie", name: "Pumice-grey hoodie", price: "from £38", art: "hoodie" },
      { id: "mug", name: "Notched-handle mug", price: "from £14", art: "mug" },
    ],
  },

  patreon: {
    href: process.env.NEXT_PUBLIC_PATREON_URL ?? "https://www.patreon.com/",
    tiers: [
      { price: "£3", name: "Citizen", perk: "Every new part 48 hours early." },
      { price: "£7", name: "Senator", perk: "Early access, plus a vote on the next disaster or era." },
      { price: "£15", name: "Emperor", perk: "All of the above, and your name painted on a wall in a future episode." },
    ],
  },

  commissions: {
    rates: [
      { label: "Short, up to 30s", price: "from £120" },
      { label: "Standard, 60–90s", price: "from £250" },
      { label: "Business use", price: "from £450" },
    ],
    purposes: ["Personal gift", "School or teaching", "Business or brand", "Something else"],
    lengths: ["Up to 30 seconds", "60–90 seconds", "Longer, let's talk"],
  },
} as const

export type PlaceholderArt = (typeof site.shop.placeholderProducts)[number]["art"]
