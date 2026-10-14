import { cn } from "@/lib/utils"

// The narrator: round plain head, two tall oval eyes, thin limbs, a beige
// rope-belted tunic, and the notched broom handle used to measure the pumice.
// Lines use the page's foreground colour so he stays visible on charcoal.
//
// `running`: he runs in from the left, eyes on where he's going, then stops and
// looks at you. No broom; he's fleeing. The animation is CSS only (globals.css)
// and is skipped for reduced motion, which leaves him standing still.
export function Mascot({ className, running = false }: { className?: string; running?: boolean }) {
  return (
    <svg viewBox="0 0 100 120" className={cn("h-auto overflow-visible", running && "mascot-run", className)} aria-hidden="true">
      <g className="mascot-body">
        <g stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path className="mascot-leg-l" d="M45 86 L40 112" />
          <path className="mascot-leg-r" d="M55 86 L60 112" />
          <path className="mascot-arm-l" d="M44 55 L33 70" />
          <path className="mascot-arm-r" d="M56 55 L64 66" />
        </g>
        {/* tunic */}
        <path
          d="M42 50 Q50 47 58 50 L64 87 Q50 90 36 87 Z"
          fill="#d8c6a1"
          stroke="var(--foreground)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* rope belt and knot */}
        <path d="M39.5 66 Q50 69 60.5 66" stroke="#8a6a3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M47 67.5 l-2 8 M48.5 67.8 l1 8" stroke="#8a6a3e" strokeWidth="1.8" strokeLinecap="round" />
        {/* head */}
        <circle cx="50" cy="27" r="20" fill="var(--bone)" stroke="var(--foreground)" strokeWidth="3" />
        <g className="mascot-eyes">
          <ellipse cx="43.5" cy="28" rx="3.6" ry="7" fill="var(--ink)" />
          <ellipse cx="56.5" cy="28" rx="3.6" ry="7" fill="var(--ink)" />
        </g>
        {/* notched broom handle */}
        {!running && (
          <g>
            <path d="M62 64 L88 108" stroke="#8a5a32" strokeWidth="3.2" strokeLinecap="round" />
            <g stroke="var(--foreground)" strokeWidth="1.4" strokeLinecap="round">
              <path d="M68.5 72 l3 -1.8" />
              <path d="M72.5 79 l3 -1.8" />
              <path d="M76.5 86 l3 -1.8" />
            </g>
            <path d="M84 104 l9 -5 5 9 -11 4 z" fill="#6f6a63" stroke="var(--foreground)" strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  )
}
