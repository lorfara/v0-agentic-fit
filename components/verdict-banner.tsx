import { cn } from "@/lib/utils"

type VerdictType = "go" | "narrow" | "no-build"

interface VerdictBannerProps {
  type: VerdictType
  title: string
}

const verdictConfig = {
  go: {
    bg: "bg-[#e8f5e8] border-[#a0cca0]",
    iconBg: "bg-[#2a7c2a]",
    labelColor: "text-[#2a7c2a]",
    icon: "✓",
  },
  narrow: {
    bg: "bg-amber-light border-[#e0c090]",
    iconBg: "bg-amber",
    labelColor: "text-amber-dark",
    icon: "⚡",
  },
  "no-build": {
    bg: "bg-[#fce8e6] border-[#e0a090]",
    iconBg: "bg-red-soft",
    labelColor: "text-red-soft",
    icon: "✕",
  },
}

export function VerdictBanner({ type, title }: VerdictBannerProps) {
  const config = verdictConfig[type]

  return (
    <div className={cn("rounded-[16px] p-6 px-7 mb-5 flex items-center gap-4 border-[1.5px]", config.bg)}>
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-[22px] shrink-0 text-white", config.iconBg)}>
        {config.icon}
      </div>
      <div>
        <div className={cn("font-mono text-[11px] uppercase tracking-[0.1em] mb-1", config.labelColor)}>
          Recommendation
        </div>
        <div className="font-serif text-[22px] text-ink">
          {title}
        </div>
      </div>
    </div>
  )
}
