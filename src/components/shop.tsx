import { ArrowUpRightIcon, ImageIcon } from "lucide-react"
import { site } from "@/config/site"
import { getProducts } from "@/lib/fourthwall"
import { SectionHeading } from "@/components/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  name: string
  colour?: string
  price: string
  href: string
  image?: { url: string; alt: string }
}

export async function Shop({ className }: { className?: string }) {
  const live = await getProducts()
  const items: Item[] =
    live ?? site.shop.products.map((p) => ({ ...p, href: site.shop.href }))

  return (
    <section id="shop" aria-labelledby="shop-h" className={className}>
      <SectionHeading id="shop-h">Shop</SectionHeading>
      <ul className={cn("grid gap-x-3 gap-y-5", items.length % 3 === 0 ? "grid-cols-3" : "grid-cols-2")}>
        {items.map((p) => (
          <li key={p.id} className="min-w-0">
            <a
              href={p.href}
              target="_blank"
              rel="noopener"
              className="group flex flex-col gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
            >
              <div className="aspect-square overflow-hidden rounded-md bg-muted">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Fourthwall serves its own resized CDN images
                  <img
                    src={p.image.url}
                    alt={p.image.alt}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  // Placeholder until real product photos are in.
                  <div className="flex size-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="size-5 opacity-60" aria-hidden="true" />
                    <span className="text-xs">Photo soon</span>
                  </div>
                )}
              </div>
              <span className="text-sm leading-snug font-medium text-pretty group-hover:underline group-hover:underline-offset-4">
                {p.name}
              </span>
              {(p.colour || p.price) && (
                <span className="-mt-1 text-sm text-muted-foreground tabular-nums">
                  {[p.colour, p.price].filter(Boolean).join(" · ")}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
      <div>
        <a href={site.shop.href} target="_blank" rel="noopener" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-md px-5 text-base")}>
          Open the shop <ArrowUpRightIcon aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
