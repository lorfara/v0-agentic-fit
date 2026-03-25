import { cn } from "@/lib/utils"

interface OutputSectionProps {
  label: string
  children: React.ReactNode
  variant?: "default" | "dark"
}

export function OutputSection({ label, children, variant = "default" }: OutputSectionProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 mb-4",
        variant === "default" && "bg-surface border border-border shadow-sm",
        variant === "dark" && "bg-ink text-white"
      )}
    >
      <div
        className={cn(
          "text-xs font-semibold uppercase tracking-wider mb-3",
          variant === "default" && "text-ink-muted",
          variant === "dark" && "text-white/50"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "text-base leading-relaxed",
          variant === "default" && "text-ink-soft",
          variant === "dark" && "text-white/90"
        )}
      >
        {children}
      </div>
    </div>
  )
}
