import type { Metadata, Viewport } from "next"
import { Archivo, Work_Sans } from "next/font/google"
import { site } from "@/config/site"
import { themeScript } from "@/components/theme"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

// Heavy, slightly wide display face for the wordmark and the episode title.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
})

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_GB",
  },
}

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#161412" },
    { media: "(prefers-color-scheme: light)", color: "#f1ede6" },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`dark ${archivo.variable} ${workSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
