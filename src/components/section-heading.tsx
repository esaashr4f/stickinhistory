export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-semibold tracking-[-0.02em] text-balance">
      {children}
    </h2>
  )
}
