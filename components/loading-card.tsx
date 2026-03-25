import { Loader2 } from "lucide-react"

interface LoadingCardProps {
  status: string
  title: string
}

export function LoadingCard({ status, title }: LoadingCardProps) {
  return (
    <div className="bg-surface border border-border rounded-3xl p-12 text-center shadow-sm">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-full bg-orange-light flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-orange animate-spin-slow" />
        </div>
      </div>
      <div className="font-mono text-xs text-ink-muted tracking-wide uppercase mb-2">
        {status}
      </div>
      <div className="text-xl font-semibold text-ink">
        {title}
      </div>
    </div>
  )
}
