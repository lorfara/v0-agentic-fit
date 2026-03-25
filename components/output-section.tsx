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
        "rounded-[16px] p-[22px] px-6 mb-4",
        variant === "default" && "bg-paper-card border border-border-soft shadow-[0_2px_12px_rgba(26,24,20,0.08)]",
        variant === "dark" && "bg-ink text-white"
      )}
    >
      <div
        className={cn(
          "font-mono text-[11px] uppercase tracking-[0.08em] mb-2.5",
          variant === "default" && "text-ink-muted",
          variant === "dark" && "text-white/40"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "text-[15px] leading-relaxed",
          variant === "default" && "text-ink-soft",
          variant === "dark" && "text-white/85"
        )}
      >
        {children}
      </div>
    </div>
  )
}
