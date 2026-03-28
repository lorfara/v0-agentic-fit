"use client"

import { ProjectForm } from "@/components/project-form"
import { EvaluationLoading } from "@/components/evaluation-loading"
import { EvaluationResults } from "@/components/evaluation-results"
import { ScorecardPanel } from "@/components/scorecard-panel"
import type { ProjectFormData, EvaluationResponse, Scores } from "@/lib/types"

interface EvaluatePageProps {
  formData: ProjectFormData
  onFormChange: (data: ProjectFormData) => void
  onSubmit: () => void
  isLoading: boolean
  onCancelLoading: () => void
  evaluationResponse: EvaluationResponse | null
  scores: Scores | null
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNumber: number, answer: string) => void
}

export function EvaluatePage({
  formData,
  onFormChange,
  onSubmit,
  isLoading,
  onCancelLoading,
  evaluationResponse,
  scores,
  onGoToCoach,
  questionAnswers,
  onAnswerChange,
}: EvaluatePageProps) {
  const showForm = !isLoading && !evaluationResponse
  const showLoading = isLoading
  const showResults = !isLoading && evaluationResponse

  return (
    <div className="page-inner max-w-[1280px] mx-auto py-7 px-6 pb-[60px]">
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight mb-1.5">
          Project Evaluation
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Describe your capstone idea. Answer the clarifying questions to strengthen and focus your build.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div>
          {showForm && (
            <ProjectForm
              data={formData}
              onChange={onFormChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          )}

          {showLoading && (
            <EvaluationLoading onCancel={onCancelLoading} />
          )}

          {showResults && evaluationResponse && (
            <EvaluationResults
              data={evaluationResponse}
              onGoToCoach={onGoToCoach}
              questionAnswers={questionAnswers}
              onAnswerChange={onAnswerChange}
            />
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
