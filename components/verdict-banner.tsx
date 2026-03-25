import { cn } from "@/lib/utils"
import { Check, Zap, X } from "lucide-react"

type VerdictType = "go" | "narrow" | "no-build"

interface VerdictBannerProps {
  type: VerdictType
  title: string
}

const verdictConfig = {
  go: {
    bg: "bg-green-light border-green/30",
    iconBg: "bg-green",
    labelColor: "text-green",
    Icon: Check,
  },
  narrow: {
    bg: "bg-orange-light border-orange/30",
    iconBg: "bg-orange",
    labelColor: "text-orange",
    Icon: Zap,
  },
  "no-build": {
    bg: "bg-red-light border-red/30",
    iconBg: "bg-red",
    labelColor: "text-red",
    Icon: X,
  },
}

export function VerdictBanner({ type, title }: VerdictBannerProps) {
  const config = verdictConfig[type]
  const IconComponent = config.Icon

  return (
    <div className={cn("rounded-2xl p-6 px-7 mb-5 flex items-center gap-5 border", config.bg)}>
      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg", config.iconBg)}>
        <IconComponent className="w-7 h-7" strokeWidth={2.5} />
      </div>
      <div>
        <div className={cn("text-xs font-semibold uppercase tracking-wider mb-1", config.labelColor)}>
          Recommendation
        </div>
        <div className="text-2xl font-bold text-ink tracking-tight">
          {title}
        </div>
      </div>
    </div>
  )
}
