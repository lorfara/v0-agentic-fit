"use client"

import { Lock, CheckCircle, ArrowRight } from "lucide-react"
import { ScorecardPanel } from "@/components/scorecard-panel"
import type { Scores } from "@/lib/types"

interface MvpFormData {
  description: string
  features: string
  notBuilding: string
}

interface MvpPageProps {
  isLocked: boolean
  projectName: string
  scores: Scores | null
  mvpData: MvpFormData
  onMvpChange: (data: MvpFormData) => void
  onGeneratePlan: () => void
}

export function MvpPage({
  isLocked,
  projectName,
  scores,
  mvpData,
  onMvpChange,
  onGeneratePlan,
}: MvpPageProps) {
  const updateField = (field: keyof MvpFormData, value: string) => {
    onMvpChange({ ...mvpData, [field]: value })
  }

  return (
    <div className="page-inner max-w-[1280px] mx-auto py-7 px-6 pb-[60px]">
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight mb-1.5">
          Define Your MVP
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Lock in exactly what you&apos;re building — and what you&apos;re not. A tight MVP unlocks your personalized week-by-week build plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div>
          {isLocked ? (
            <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
              <div className="p-6">
                <div className="text-center py-10 px-6 text-[var(--muted)] text-base">
                  <div className="text-[40px] mb-3">
                    <Lock className="w-10 h-10 mx-auto text-[var(--muted)]" />
                  </div>
                  <strong className="block text-lg font-bold text-[var(--text-secondary)] mb-2">
                    Instructor approval required
                  </strong>
                  Get your idea approved by your instructor before defining your MVP.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
              {/* Header */}
              <div className="py-5 px-6 border-b border-[var(--border)] flex items-center gap-3.5">
                <div 
                  className="w-10 h-10 rounded-[10px] bg-[var(--orange-light)] flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <CheckCircle className="w-5 h-5 text-[var(--orange)]" />
                </div>
                <div>
                  <div className="font-display text-lg font-extrabold text-[var(--text)]">
                    MVP Definition
                  </div>
                  <div className="text-sm text-[var(--muted)] mt-0.5">
                    Be specific — this generates your build plan
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* MVP Description */}
                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="mvp-desc">
                    In 2-3 sentences, what is your MVP?
                  </label>
                  <span className="text-[13px] text-[var(--muted)]">
                    The minimum version you can demo on day 1 of marathon week
                  </span>
                  <textarea
                    id="mvp-desc"
                    value={mvpData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="e.g. A web tool where bootcamp students enter their project idea and receive an instant feasibility scorecard..."
                    className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
                  />
                </div>

                {/* Core Features */}
                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="mvp-features">
                    3 core features you WILL build
                  </label>
                  <textarea
                    id="mvp-features"
                    value={mvpData.features}
                    onChange={(e) => updateField('features', e.target.value)}
                    placeholder="1. Evaluation scorecard with 4 dimensions&#10;2. 3-round resubmission flow&#10;3. Instructor review interface"
                    className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
                  />
                </div>

                {/* What you're NOT building */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="mvp-not">
                    What you are explicitly NOT building
                  </label>
                  <span className="text-[13px] text-[var(--muted)]">
                    This is as important as what you are building
                  </span>
                  <textarea
                    id="mvp-not"
                    value={mvpData.notBuilding}
                    onChange={(e) => updateField('notBuilding', e.target.value)}
                    placeholder="e.g. No user auth in v1, no mobile app, no admin analytics dashboard..."
                    className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-sm text-[var(--muted)]">
                    Completing this unlocks your personalized 6-week build plan
                  </span>
                  <button
                    onClick={onGeneratePlan}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--radius-sm)] font-display text-base font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)] hover:-translate-y-0.5"
                    style={{ boxShadow: '0 4px 14px rgba(232,93,0,0.35)' }}
                  >
                    Generate My Build Plan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <ScorecardPanel
          projectName={projectName}
          scores={scores}
        />
      </div>
    </div>
  )
}
