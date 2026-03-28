"use client"

import { ProjectForm } from "@/components/project-form"
import { EvaluationLoading } from "@/components/evaluation-loading"
import { EvalResults } from "@/components/eval-results"
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
  rawApiResponse?: string | null
  apiError?: string | null
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
  rawApiResponse,
  apiError,
}: EvaluatePageProps) {
  const showForm = !isLoading && !evaluationResponse
  const showLoading = isLoading
  const showResults = !isLoading && evaluationResponse

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-6 pb-16">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight mb-1">
          Project Evaluation
        </h1>
        <p className="text-[15px] text-[var(--muted)] leading-relaxed">
          Describe your capstone idea. Answer the clarifying questions to strengthen and focus your build.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
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
            <EvalResults
              data={evaluationResponse}
              onGoToCoach={onGoToCoach}
              questionAnswers={questionAnswers}
              onAnswerChange={onAnswerChange}
            />
          )}

          {/* API Error Display */}
          {apiError && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="font-bold text-red-700 mb-2">API Error:</div>
              <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono">{apiError}</pre>
            </div>
          )}

          {/* Raw API Response Display */}
          {rawApiResponse && (
            <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <div className="font-bold text-gray-700 mb-2">Raw API Response:</div>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-[400px] overflow-y-auto">{rawApiResponse}</pre>
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
