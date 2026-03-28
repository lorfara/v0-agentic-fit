"use client"

import { Lock, Edit3, ArrowRight, RotateCcw } from "lucide-react"
import { ScorecardPanel } from "@/components/scorecard-panel"
import type { ProjectFormData, Scores, ClarifyingQuestion } from "@/lib/types"

interface CoachPageProps {
  isLocked: boolean
  formData: ProjectFormData
  onFormChange: (data: ProjectFormData) => void
  scores: Scores | null
  clarifyingQuestions: ClarifyingQuestion[]
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNumber: number, answer: string) => void
  onResubmit: () => void
  onSkipToInstructor: () => void
}

export function CoachPage({
  isLocked,
  formData,
  onFormChange,
  scores,
  clarifyingQuestions,
  questionAnswers,
  onAnswerChange,
  onResubmit,
  onSkipToInstructor,
}: CoachPageProps) {
  const updateField = (field: keyof ProjectFormData, value: string) => {
    onFormChange({ ...formData, [field]: value })
  }

  return (
    <div className="page-inner max-w-[1280px] mx-auto py-7 px-6 pb-[60px]">
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight mb-1.5">
          AgenticFit Coach
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Review and refine your full project brief below. Edit any field, then answer the three questions before resubmitting.
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
                    Complete your first evaluation to unlock coaching
                  </strong>
                  Go to the Evaluate page and submit your idea first.
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
                  <Edit3 className="w-5 h-5 text-[var(--orange)]" />
                </div>
                <div>
                  <div className="font-display text-lg font-extrabold text-[var(--text)]">
                    Your Project Brief
                  </div>
                  <div className="text-sm text-[var(--muted)] mt-0.5">
                    All fields are editable — refine anything before resubmitting
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Project Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="c-name">
                      Project Name
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal form-input placeholder:text-[#9ca3af]"
                    />
                  </div>

                  {/* Target Persona */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="c-persona">
                      Target Persona
                    </label>
                    <input
                      id="c-persona"
                      type="text"
                      value={formData.persona}
                      onChange={(e) => updateField('persona', e.target.value)}
                      className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal form-input placeholder:text-[#9ca3af]"
                    />
                  </div>

                  {/* What does it do */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="c-what">
                      What does it do — and why does it matter?
                    </label>
                    <textarea
                      id="c-what"
                      value={formData.what}
                      onChange={(e) => updateField('what', e.target.value)}
                      className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[100px] form-textarea placeholder:text-[#9ca3af]"
                    />
                  </div>

                  {/* Why is it Agentic */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="c-agentic">
                      Why is it Agentic?
                    </label>
                    <textarea
                      id="c-agentic"
                      value={formData.agentic}
                      onChange={(e) => updateField('agentic', e.target.value)}
                      className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
                    />
                  </div>

                  {/* MOAT */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="c-moat">
                      MOAT
                    </label>
                    <textarea
                      id="c-moat"
                      value={formData.moat}
                      onChange={(e) => updateField('moat', e.target.value)}
                      className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="font-display text-[13px] font-bold text-[var(--muted)] uppercase tracking-wider">
                    Clarifying Questions
                  </span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                {/* Clarifying Questions */}
                <div className="space-y-4 mb-6">
                  {clarifyingQuestions.map((q) => (
                    <div 
                      key={q.question_number}
                      className="bg-[var(--bg)] rounded-[10px] p-[16px_18px] border-2 border-[var(--border)]"
                    >
                      <div className="flex items-start gap-3.5 mb-3">
                        <span className="w-7 h-7 rounded-full bg-[var(--blue)] text-white font-display text-[13px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {q.question_number}
                        </span>
                        <div>
                          <div className="text-[15px] font-bold text-[var(--text)] leading-snug mb-1.5">
                            {q.question}
                          </div>
                          <div className="text-[13px] text-[var(--muted)] italic">
                            Linked to: {q.linked_concern}
                          </div>
                        </div>
                      </div>
                      <textarea
                        value={questionAnswers[q.question_number] || ''}
                        onChange={(e) => onAnswerChange(q.question_number, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-sm text-[var(--text)] bg-white transition-all outline-none leading-relaxed resize-y min-h-[80px] form-textarea placeholder:text-[#9ca3af]"
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="text-center flex justify-center gap-3 flex-wrap">
                  <button
                    onClick={onResubmit}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--radius-sm)] font-display text-base font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resubmit for Re-evaluation
                  </button>
                  <button
                    onClick={onSkipToInstructor}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--bg)] hover:border-[#9ca3af]"
                  >
                    Skip to Instructor
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <ScorecardPanel
          projectName={formData.name}
          scores={scores}
        />
      </div>
    </div>
  )
}
