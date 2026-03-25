import { cn } from "@/lib/utils"

type TagType = "go" | "narrow" | "no"

interface ComparableItemProps {
  id: string
  name: string
  tag: string
  tagType: TagType
  outcome: string
  lesson: string
  isLast?: boolean
}

const tagStyles = {
  go: "bg-[#e8f5e8] text-[#2a7c2a]",
  narrow: "bg-amber-light text-amber-dark",
  no: "bg-[#fce8e6] text-red-soft",
}

export function ComparableItem({ id, name, tag, tagType, outcome, lesson, isLast }: ComparableItemProps) {
  return (
    <div className={cn("flex gap-3.5 py-3.5", !isLast && "border-b border-border-soft")}>
      <div className="shrink-0 w-9 h-9 rounded-lg bg-paper-warm border border-border flex items-center justify-center font-mono text-[11px] text-ink-muted font-medium">
        {id}
      </div>
      <div>
        <div className="text-sm font-medium text-ink mb-0.5 flex items-center gap-2 flex-wrap">
          {name}
          <span className={cn("inline-block px-2 py-0.5 rounded font-mono text-[10px] font-medium tracking-[0.04em]", tagStyles[tagType])}>
            {tag}
          </span>
        </div>
        <div className="text-xs text-ink-muted mb-1">
          {outcome}
        </div>
        <div className="text-[13px] text-ink-soft leading-snug">
          {lesson}
        </div>
      </div>
    </div>
  )
}
