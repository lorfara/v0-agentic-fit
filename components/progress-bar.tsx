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
    <div className="bg-paper-warm border-b border-border px-10 py-4">
      <div className="flex items-center gap-0 max-w-[680px] mx-auto">
        {steps.map((step, index) => {
          const isDone = step.id < currentStep
          const isActive = step.id === currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1 relative">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute top-[14px] left-1/2 w-full h-px bg-border z-0" />
              )}
              
              {/* Dot */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] relative z-10 transition-all duration-300",
                  isDone && "bg-ink border-ink text-paper-card",
                  isActive && "bg-amber border-amber text-white font-medium",
                  !isDone && !isActive && "bg-paper-card border-[1.5px] border-border text-ink-muted"
                )}
              >
                {isDone ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Label */}
              <div
                className={cn(
                  "text-[10px] text-center leading-tight max-w-16",
                  isDone && "text-ink-soft",
                  isActive && "text-amber-dark font-medium",
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
