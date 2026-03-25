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
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="bg-surface border-b border-border px-6 md:px-10 py-5">
      <div className="flex items-center gap-0 max-w-[720px] mx-auto">
        {steps.map((step, index) => {
          const isDone = step.id < currentStep
          const isActive = step.id === currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 flex-1 relative">
              {/* Connector line */}
              {!isLast && (
                <div 
                  className={cn(
                    "absolute top-[14px] left-1/2 w-full h-0.5 z-0 transition-colors",
                    isDone ? "bg-orange" : "bg-border"
                  )} 
                />
              )}
              
              {/* Dot */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold relative z-10 transition-all duration-300",
                  isDone && "bg-orange text-white",
                  isActive && "bg-orange text-white shadow-[0_0_0_4px_rgba(255,107,0,0.2)]",
                  !isDone && !isActive && "bg-surface border-2 border-border text-ink-muted"
                )}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Label */}
              <div
                className={cn(
                  "text-xs text-center leading-tight max-w-20 font-medium",
                  isDone && "text-ink-soft",
                  isActive && "text-orange",
                  !isDone && !isActive && "text-ink-muted"
                )}
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
