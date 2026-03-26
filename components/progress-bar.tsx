import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Your idea" },
  { id: 2, label: "Analyzing" },
  { id: 3, label: "Coach questions" },
  { id: 4, label: "Your answers" },
  { id: 5, label: "Evaluating" },
  { id: 6, label: "Verdict" },
]

interface ProgressBarProps {
  currentStep: number
  onStepClick?: (stepId: number) => void
}

export function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="bg-white border-b border-[#e5e5e5] px-4 md:px-6 py-4">
      <div className="flex items-center gap-0 max-w-[700px] mx-auto">
        {steps.map((step, index) => {
          const isDone = step.id < currentStep
          const isActive = step.id === currentStep
          const isLast = index === steps.length - 1
          const isLoading = step.id === 2 || step.id === 5
          const isClickable = isDone && !isLoading && onStepClick

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1 relative">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute top-3 left-1/2 w-full h-[2px] z-0 transition-colors",
                    isDone ? "bg-[#FF6B00]" : "bg-[#e5e5e5]"
                  )}
                />
              )}

              {/* Dot */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold relative z-10 transition-all",
                  isDone && "bg-[#FF6B00] text-white",
                  isActive && "bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/20",
                  !isDone && !isActive && "bg-white border-2 border-[#e5e5e5] text-[#8a8a8a]",
                  isClickable && "cursor-pointer hover:scale-110 hover:shadow-md",
                  !isClickable && "cursor-default"
                )}
              >
                {isDone ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <span className="text-[11px]">{step.id}</span>
                )}
              </button>

              {/* Label */}
              <div
                className={cn(
                  "text-[11px] text-center leading-tight max-w-16 font-medium",
                  isDone && "text-[#4a4a4a]",
                  isActive && "text-[#FF6B00]",
                  !isDone && !isActive && "text-[#8a8a8a]",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                {step.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
