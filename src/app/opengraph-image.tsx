import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { site } from "@/config/site"

// The preview card shown when the site link is shared (WhatsApp, iMessage,
// Instagram DMs, X, Discord). Generated once at build time.

export const alt = `${site.name}: ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// The mascot standing, with fixed colours (no CSS variables in here).
const mascot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
<g stroke="#efe9df" stroke-width="3" stroke-linecap="round" fill="none">
<path d="M45 86 L40 112"/><path d="M55 86 L60 112"/><path d="M44 55 L33 70"/><path d="M56 55 L64 66"/></g>
<path d="M42 50 Q50 47 58 50 L64 87 Q50 90 36 87 Z" fill="#d8c6a1" stroke="#efe9df" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M39.5 66 Q50 69 60.5 66" stroke="#8a6a3e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<circle cx="50" cy="27" r="20" fill="#fbf8f2" stroke="#efe9df" stroke-width="3"/>
<ellipse cx="43.5" cy="28" rx="3.6" ry="7" fill="#1d1a17"/><ellipse cx="56.5" cy="28" rx="3.6" ry="7" fill="#1d1a17"/>
</svg>`

export default async function Image() {
  const [archivo, workSans] = await Promise.all([
    readFile(join(process.cwd(), "assets/archivo-800.woff")),
    readFile(join(process.cwd(), "assets/work-sans-400.woff")),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "radial-gradient(circle at 75% 110%, #7a2a1e 0%, #3a1d18 35%, #161412 70%)",
          color: "#efe9df",
        }}
      >
        <img src={`data:image/svg+xml,${encodeURIComponent(mascot)}`} width={230} height={276} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontFamily: "Archivo", fontSize: 96, lineHeight: 1, letterSpacing: "-0.03em" }}>{site.name}</div>
          <div style={{ fontFamily: "Work Sans", fontSize: 38, color: "#a69d91" }}>{site.tagline}</div>
          <div style={{ display: "flex", marginTop: 24, height: 4, width: 120, background: "#d4483a" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, style: "normal", weight: 800 },
        { name: "Work Sans", data: workSans, style: "normal", weight: 400 },
      ],
    },
  )
}
