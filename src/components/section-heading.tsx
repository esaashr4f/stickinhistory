export function SectionHeading({ id, tag, children }: { id: string; tag: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b-2 border-foreground pb-2">
      <h2 id={id} className="font-heading text-3xl font-semibold">
        {children}
      </h2>
      <span className="font-mono text-xs tracking-[0.08em] text-primary uppercase">{tag}</span>
    </div>
  )
}
