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
  go: "bg-green-light text-green",
  narrow: "bg-orange-light text-orange",
  no: "bg-red-light text-red",
}

export function ComparableItem({ id, name, tag, tagType, outcome, lesson, isLast }: ComparableItemProps) {
  return (
    <div className={cn("flex gap-4 py-4", !isLast && "border-b border-border")}>
      <div className="shrink-0 w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center font-mono text-xs text-ink-muted font-semibold">
        {id}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-ink mb-1 flex items-center gap-2 flex-wrap">
          {name}
          <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold", tagStyles[tagType])}>
            {tag}
          </span>
        </div>
        <div className="text-xs text-ink-muted mb-1.5 font-medium">
          {outcome}
        </div>
        <div className="text-sm text-ink-soft leading-relaxed">
          {lesson}
        </div>
      </div>
    </div>
  )
}
