import { cn } from "@/lib/utils"
import { Check, Zap, X } from "lucide-react"

type VerdictType = "go" | "narrow" | "no-build"

interface VerdictBannerProps {
  type: VerdictType
  title: string
}

const verdictConfig = {
  go: {
    bg: "bg-[#E3F5ED] border-[#00875A]/20",
    iconBg: "bg-[#00875A]",
    labelColor: "text-[#00875A]",
    Icon: Check,
  },
  narrow: {
    bg: "bg-[#FFF0E6] border-[#FF6B00]/20",
    iconBg: "bg-[#FF6B00]",
    labelColor: "text-[#FF6B00]",
    Icon: Zap,
  },
  "no-build": {
    bg: "bg-[#FFEBE6] border-[#DE350B]/20",
    iconBg: "bg-[#DE350B]",
    labelColor: "text-[#DE350B]",
    Icon: X,
  },
}

export function VerdictBanner({ type, title }: VerdictBannerProps) {
  const config = verdictConfig[type]
  const IconComponent = config.Icon

  return (
    <div className={cn("rounded-2xl p-5 mb-4 flex items-center gap-4 border", config.bg)}>
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white", config.iconBg)}>
        <IconComponent className="w-6 h-6" strokeWidth={2.5} />
      </div>
      <div>
        <div className={cn("text-xs font-semibold uppercase tracking-wider mb-0.5", config.labelColor)}>
          Recommendation
        </div>
        <div className="text-xl font-bold text-[#161616] tracking-tight">
          {title}
        </div>
      </div>
    </div>
  )
}
