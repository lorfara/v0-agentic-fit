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
        "rounded-2xl p-5 mb-4",
        variant === "default" && "bg-white border border-[#e5e5e5]",
        variant === "dark" && "bg-[#161616] text-white"
      )}
    >
      <div
        className={cn(
          "text-xs font-semibold uppercase tracking-wider mb-3",
          variant === "default" && "text-[#8a8a8a]",
          variant === "dark" && "text-white/50"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "text-[15px] leading-relaxed",
          variant === "default" && "text-[#4a4a4a]",
          variant === "dark" && "text-white/90"
        )}
      >
        {children}
      </div>
    </div>
  )
}
