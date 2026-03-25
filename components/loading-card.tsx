interface LoadingCardProps {
  status: string
  title: string
}

export function LoadingCard({ status, title }: LoadingCardProps) {
  return (
    <div className="bg-paper-card border border-border-soft rounded-[16px] p-10 text-center shadow-[0_2px_12px_rgba(26,24,20,0.08)]">
      <div className="flex gap-2 justify-center mb-5">
        <span className="w-2 h-2 bg-amber rounded-full animate-pulse-dot" />
        <span className="w-2 h-2 bg-amber rounded-full animate-pulse-dot-delay-1" />
        <span className="w-2 h-2 bg-amber rounded-full animate-pulse-dot-delay-2" />
      </div>
      <div className="font-mono text-xs text-ink-muted tracking-[0.05em] mb-2">
        {status}
      </div>
      <div className="font-serif text-xl text-ink">
        {title}
      </div>
    </div>
  )
}
