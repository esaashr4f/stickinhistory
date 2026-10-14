// Everything the owner is likely to change lives here.
// Links can also be set per-deployment with NEXT_PUBLIC_* environment variables
// (see .env.example), so you can change them on Vercel without touching code.

export const site = {
  name: "Stick in History",
  tagline: "History, as it happened to you",
  description:
    "Stickman stories from inside history’s worst days. Pompeii, 79\u00a0AD is out now. Follow along for each new part.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stickinhistory.com",
  // Shown in the footer for general enquiries. Commission requests are sent here
  // too, unless COMMISSION_TO_EMAIL is set.
  email: "info@stickinhistory.com",

  socials: [
    { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/stickinhistory" },
    { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://www.tiktok.com/@stickinhistory" },
    { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://www.youtube.com/@StickIsInHistory" },
  ],

  latestEpisode: {
    place: "Pompeii",
    year: "79\u00a0AD",
    act: "Act I",
    blurb: "It’s the year 79. You’re a slave in Pompeii. The mountain has been grumbling for days. Nobody gives a shit.",
    href: process.env.NEXT_PUBLIC_LATEST_EPISODE_URL ?? "https://www.instagram.com/",
  },

  shop: {
    href: process.env.NEXT_PUBLIC_SHOP_URL ?? "https://stick-in-history-shop.fourthwall.com/en-gbp",
    // The shop's products. Each one links to its page in the Fourthwall shop.
    // Photos live in public/products/.
    products: [
      {
        id: "vesuvius-tee-black",
        name: "Mount Vesuvius T-Shirt",
        colour: "Black",
        price: "£25",
        href: "https://stick-in-history-shop.fourthwall.com/en-gbp/products/mount-vesuvius-t-shirt",
        image: { url: "/products/vesuvius-tee-black.webp", alt: "Black T-shirt: two stickmen in Roman clothes giving the finger in front of an erupting Vesuvius, with the words “I beat Mount Vesuvius, bitch”" },
      },
      {
        id: "vesuvius-tee-white",
        name: "Mount Vesuvius T-Shirt",
        colour: "White",
        price: "£25",
        href: "https://stick-in-history-shop.fourthwall.com/en-gbp/products/mount-vesuvius-t-shirt-2",
        image: { url: "/products/vesuvius-tee-white.webp", alt: "White T-shirt: two stickmen in Roman clothes giving the finger in front of an erupting Vesuvius, with the words “I beat Mount Vesuvius, bitch”" },
      },
    ],
  },

  patreon: {
    href: process.env.NEXT_PUBLIC_PATREON_URL ?? "https://www.patreon.com/StickinHistory",
    tiers: [
      { price: "£3", name: "Citizen", perk: "Every new part 24 hours early." },
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
    lengths: ["Up to 30 seconds", "60–90 seconds", "Longer, let’s talk"],
  },
} as const
