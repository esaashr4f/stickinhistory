import { ArrowUpRightIcon } from "lucide-react"
import { site, type PlaceholderArt } from "@/config/site"
import { getProducts, type Product } from "@/lib/fourthwall"
import { SectionHeading } from "@/components/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export async function Shop() {
  const live = await getProducts()

  return (
    <section id="shop" aria-labelledby="shop-h" className="flex flex-col gap-5">
      <SectionHeading id="shop-h" tag="Printed on demand">Shop</SectionHeading>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {live
          ? live.map((p, i) => <LiveItem key={p.id} product={p} wide={isWide(i, live.length)} />)
          : site.shop.placeholderProducts.map((p, i, all) => (
              <Item key={p.id} name={p.name} price={p.price} href={site.shop.href} wide={isWide(i, all.length)}>
                <ProductArt art={p.art} />
              </Item>
            ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <a href={site.shop.href} target="_blank" rel="noopener" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-[15px]")}>
          Open the shop <ArrowUpRightIcon aria-hidden="true" />
        </a>
        <span className="text-sm text-muted-foreground">Opens the merch store in a new tab.</span>
      </div>
    </section>
  )
}

// On phones the grid has two columns, so an odd last item spans both, as a wide card.
const isWide = (i: number, count: number) => count % 2 === 1 && i === count - 1

function LiveItem({ product, wide }: { product: Product; wide: boolean }) {
  return (
    <Item name={product.name} price={product.price} href={product.href} wide={wide}>
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- Fourthwall serves its own resized CDN images
        <img src={product.image.url} alt={product.image.alt} loading="lazy" className="size-full object-cover" />
      ) : null}
    </Item>
  )
}

function Item({
  name,
  price,
  href,
  wide,
  children,
}: {
  name: string
  price: string
  href: string
  wide: boolean
  children: React.ReactNode
}) {
  return (
    <li className={cn("min-w-0", wide && "col-span-2 sm:col-span-1")}>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="flex h-full flex-col gap-2 rounded-lg bg-card p-3 outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/60"
      >
        <div className={cn("overflow-hidden rounded-md bg-pumice", wide ? "aspect-[2/1] sm:aspect-square" : "aspect-square")}>
          {children}
        </div>
        <span className="text-sm leading-snug font-semibold">{name}</span>
        {price && <span className="font-mono text-[13px] text-muted-foreground">{price}</span>}
      </a>
    </li>
  )
}

function ProductArt({ art }: { art: PlaceholderArt }) {
  const common = { viewBox: "0 0 120 120", className: "block size-full", "aria-hidden": true } as const
  if (art === "tee")
    return (
      <svg {...common}>
        <path d="M30 30 l18 -10 h24 l18 10 l12 22 -14 7 -6 -10 v55 h-56 v-55 l-6 10 -14 -7z" fill="#1d1a17" />
        <text x="60" y="66" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8.5" fill="#f1ede6">I AIN&apos;T DOING</text>
        <text x="60" y="77" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8.5" fill="#f1ede6">THAT SHIT</text>
      </svg>
    )
  if (art === "hoodie")
    return (
      <svg {...common}>
        <path d="M28 34 q32 -22 64 0 l10 22 -12 6 -4 -8 v52 h-52 v-52 l-4 8 -12 -6z" fill="#7c766d" />
        <circle cx="60" cy="62" r="11" fill="#fbf8f2" stroke="#1d1a17" strokeWidth="2" />
        <ellipse cx="56.5" cy="62" rx="1.6" ry="3" fill="#1d1a17" />
        <ellipse cx="63.5" cy="62" rx="1.6" ry="3" fill="#1d1a17" />
      </svg>
    )
  return (
    <svg {...common}>
      <rect x="34" y="36" width="44" height="54" rx="4" fill="#fbf8f2" stroke="#1d1a17" strokeWidth="2.5" />
      <path d="M78 48 q16 0 16 14 t-16 14" fill="none" stroke="#1d1a17" strokeWidth="2.5" />
      <g stroke="#1d1a17" strokeWidth="2" strokeLinecap="round">
        <path d="M44 50 h8" /><path d="M44 63 h8" /><path d="M44 76 h8" />
      </g>
      <g fontFamily="monospace" fontSize="5" fill="#1d1a17">
        <text x="55" y="52">HOUR 1</text><text x="55" y="65">HOUR 3</text><text x="55" y="78">HOUR 6</text>
      </g>
    </svg>
  )
}
