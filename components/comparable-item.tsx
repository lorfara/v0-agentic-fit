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
  go: "bg-[#E3F5ED] text-[#00875A]",
  narrow: "bg-[#FFF0E6] text-[#FF6B00]",
  no: "bg-[#FFEBE6] text-[#DE350B]",
}

export function ComparableItem({ id, name, tag, tagType, outcome, lesson, isLast }: ComparableItemProps) {
  return (
    <div className={cn("flex gap-4 py-4", !isLast && "border-b border-[#e5e5e5]")}>
      <div className="shrink-0 w-9 h-9 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-xs text-[#8a8a8a] font-semibold">
        {id}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-[#161616] mb-1 flex items-center gap-2 flex-wrap">
          {name}
          <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold", tagStyles[tagType])}>
            {tag}
          </span>
        </div>
        <div className="text-xs text-[#8a8a8a] mb-1.5 font-medium">
          {outcome}
        </div>
        <div className="text-sm text-[#4a4a4a] leading-relaxed">
          {lesson}
        </div>
      </div>
    </div>
  )
}
