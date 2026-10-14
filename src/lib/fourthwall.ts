import { cacheLife } from "next/cache"

// Pulls products from the Fourthwall Storefront API.
// Docs: https://docs.fourthwall.com/storefront/overview
// Needs FOURTHWALL_STOREFRONT_TOKEN (Fourthwall admin > Settings > For Developers).
// Returns null when the token is missing or the request fails, so the page
// can fall back to the placeholder products and a link to the shop.

const API = "https://storefront-api.fourthwall.com/v1"

export type Product = {
  id: string
  name: string
  price: string
  image?: { url: string; alt: string }
  href: string
}

type Money = { value: number; currency: string }
type ApiProduct = {
  id: string
  name: string
  slug: string
  state?: { type?: string }
  images?: { url: string }[]
  variants?: { unitPrice?: Money }[]
}

function formatPrice(prices: Money[]) {
  if (prices.length === 0) return ""
  const lowest = prices.reduce((a, b) => (b.value < a.value ? b : a))
  const amount = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: lowest.currency,
    minimumFractionDigits: lowest.value % 1 === 0 ? 0 : 2,
  }).format(lowest.value)
  const allSame = prices.every((p) => p.value === lowest.value)
  return allSame ? amount : `from ${amount}`
}

export async function getProducts(limit = 6): Promise<Product[] | null> {
  "use cache"
  cacheLife("hours")

  const token = process.env.FOURTHWALL_STOREFRONT_TOKEN
  const collection = process.env.FOURTHWALL_COLLECTION ?? "all"
  const shopUrl = (process.env.NEXT_PUBLIC_SHOP_URL ?? "").replace(/\/$/, "")
  if (!token) return null

  try {
    const res = await fetch(
      `${API}/collections/${encodeURIComponent(collection)}/products?storefront_token=${encodeURIComponent(token)}&size=${limit}`,
    )
    if (!res.ok) {
      console.error(`Fourthwall API responded ${res.status}`)
      return null
    }
    const data: { results?: ApiProduct[] } = await res.json()
    const products = (data.results ?? [])
      .filter((p) => p.state?.type !== "HIDDEN")
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: formatPrice((p.variants ?? []).flatMap((v) => (v.unitPrice ? [v.unitPrice] : []))),
        image: p.images?.[0] ? { url: p.images[0].url, alt: p.name } : undefined,
        href: shopUrl ? `${shopUrl}/products/${p.slug}` : "#shop",
      }))
    return products.length > 0 ? products : null
  } catch (err) {
    console.error("Fourthwall API request failed", err)
    return null
  }
}
