"use client"

import { useEffect, useState } from "react"
import { X, Check } from "lucide-react"

interface EvaluationLoadingProps {
  onCancel: () => void
}

const LOAD_STEPS = [
  'Reading your project brief',
  'Searching similar past projects in your industry',
  'Assessing Agentic AI fit across 4 criteria',
  'Identifying top concerns from instructor feedback patterns',
  'Generating clarifying questions linked to each concern',
]

type StepState = 'pending' | 'active' | 'done'

export function EvaluationLoading({ onCancel }: EvaluationLoadingProps) {
  const [stepStates, setStepStates] = useState<StepState[]>(
    LOAD_STEPS.map(() => 'pending')
  )

  useEffect(() => {
    let step = 0
    
    // Set first step to active
    setStepStates(states => {
      const newStates = [...states]
      newStates[0] = 'active'
      return newStates
    })

    const timer = setInterval(() => {
      setStepStates(states => {
        const newStates = [...states]
        // Mark current as done
        newStates[step] = 'done'
        step++
        // Mark next as active if exists
        if (step < LOAD_STEPS.length) {
          newStates[step] = 'active'
        }
        return newStates
      })

      if (step >= LOAD_STEPS.length) {
        clearInterval(timer)
      }
    }, 800)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="p-10">
        <div className="font-display text-[17px] font-extrabold text-[var(--text)] mb-1.5">
          Analyzing your idea...
        </div>
        <div className="text-sm text-[var(--muted)] mb-7">
          Comparing against past cohort projects in your industry
        </div>

        <div className="flex flex-col gap-3.5 mb-8">
          {LOAD_STEPS.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 text-sm font-medium transition-all duration-300 ${
                stepStates[index] === 'pending' 
                  ? 'opacity-0 translate-y-1.5 text-[var(--muted)]'
                  : stepStates[index] === 'active'
                    ? 'opacity-100 translate-y-0 text-[var(--text)] font-semibold'
                    : 'opacity-100 translate-y-0 text-[var(--muted)]'
              }`}
              style={{
                transitionDelay: stepStates[index] === 'pending' ? '0ms' : `${index * 50}ms`
              }}
            >
              <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
                {stepStates[index] === 'active' ? (
                  <div 
                    className="w-3.5 h-3.5 border-2 border-[rgba(232,93,0,0.2)] border-t-[var(--orange)] rounded-full animate-spin-slow"
                  />
                ) : stepStates[index] === 'done' ? (
                  <Check className="w-3.5 h-3.5 text-[var(--green)]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)] mx-1" />
                )}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--bg)] hover:border-[#9ca3af]"
        >
          <X className="w-[13px] h-[13px]" />
          Stop & go back
        </button>
      </div>
    </div>
  )
}
