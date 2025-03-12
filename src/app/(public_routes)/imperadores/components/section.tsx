interface SectionProps {
  title: string
  children: React.ReactNode
}

export const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="mb-8 rounded-xl border border-yellow-400/30 bg-black/50 p-8 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-yellow-400">{title}</h2>
      {children}
    </div>
  )
}
