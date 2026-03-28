"use client"

import { useState } from "react"
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react"
import { InlineAIAssistant } from "@/components/inline-ai-assistant"
import type { EvaluationResponse } from "@/lib/types"

type Tab = "agentic" | "concerns" | "similar" | "questions"

interface AIContext {
  type: "criterion" | "concern" | "question"
  title: string
  content: string
}

interface EvaluationResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNumber: number, answer: string) => void
}

const VERDICT_STYLES: Record<string, { bg: string; color: string }> = {
  "Strong fit": { bg: "#f0fdf4", color: "#16a34a" },
  "Partial fit": { bg: "#fffbeb", color: "#d97706" },
  "Weak fit": { bg: "#fef2f2", color: "#dc2626" },
}

const SEVERITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Critical: { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
  Significant: { bg: "#fffbeb", color: "#d97706", border: "#fcd34d" },
  Moderate: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
}

const OVERALL_LABEL: Record<string, { bg: string; color: string; border: string }> = {
  HIGH: { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
  MEDIUM: { bg: "#fef9c3", color: "#a16207", border: "#fde047" },
  LOW: { bg: "#f0fdf4", color: "#16a34a", border: "#86efac" },
}

export function EvaluationResults({ data, onGoToCoach, questionAnswers, onAnswerChange }: EvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("agentic")
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null)
  const [aiContext, setAiContext] = useState<AIContext>({ type: "criterion", title: "", content: "" })

  const { agentic_fit, concerns, similar_projects, clarifying_questions } = data

  const hasBuildRisk = agentic_fit.overall_score === "MEDIUM" || agentic_fit.overall_score === "HIGH"

  function openAssistant(id: string, type: AIContext["type"], title: string, content: string) {
    if (expandedAssistant === id) {
      setExpandedAssistant(null)
    } else {
      setAiContext({ type, title, content })
      setExpandedAssistant(id)
    }
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "agentic", label: "Agentic Fit" },
    { id: "concerns", label: "Concerns", count: concerns.length },
    { id: "similar", label: "Similar Projects", count: similar_projects.length },
    { id: "questions", label: "Questions", count: clarifying_questions.length },
  ]

  return (
    <div className="bg-white rounded-xl border border-[var(--border)]" style={{ boxShadow: "var(--shadow)" }}>
      {/* Build risk banner */}
      {hasBuildRisk && (
        <div className="mx-4 mt-4 rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-[#dc2626] text-[15px] mb-1">
              High risk of not completing this project as described in 6 weeks.
            </div>
            <div className="text-sm text-[#666]">
              Review the agentic fit assessment and concerns below. Answer the clarifying questions before strengthening your build.
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] mt-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-[var(--orange)] text-[var(--orange)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                activeTab === tab.id ? "bg-[var(--orange)] text-white" : "bg-[#e5e5e5] text-[#666]"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Agentic Fit Tab */}
        {activeTab === "agentic" && (
          <div>
            {/* Overall score badge */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full border tracking-wide"
                style={(() => {
                  const s = OVERALL_LABEL[agentic_fit.overall_score] || OVERALL_LABEL.MEDIUM
                  return { background: s.bg, color: s.color, borderColor: s.border }
                })()}
              >
                {agentic_fit.overall_score}
              </span>
              <span className="text-sm text-[var(--muted)]">Overall Agentic Fit Score</span>
            </div>

            {/* Justification */}
            <div className="text-sm text-[var(--text)] leading-relaxed mb-4 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              {agentic_fit.justification}
            </div>

            {/* Criteria cards */}
            <div className="space-y-3">
              {agentic_fit.criteria.map((criterion, index) => {
                const style = VERDICT_STYLES[criterion.verdict] || VERDICT_STYLES["Partial fit"]
                const assistantId = `criterion-${index}`
                return (
                  <div key={index}>
                    <div
                      className="rounded-lg p-4"
                      style={{ background: style.bg, borderLeft: `4px solid ${style.color}` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[15px] font-bold text-[var(--text)]">{criterion.name}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: style.color }}></span>
                          <span className="text-sm font-semibold" style={{ color: style.color }}>{criterion.verdict}</span>
                        </div>
                      </div>
                      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">{criterion.reasoning}</div>
                      <button
                        onClick={() => openAssistant(assistantId, "criterion", criterion.name, criterion.reasoning)}
                        className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask AI about this
                      </button>
                    </div>
                    {expandedAssistant === assistantId && (
                      <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Next CTA */}
            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab("concerns")}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] transition-all"
                style={{ boxShadow: "0 4px 14px rgba(232,93,0,0.3)" }}
              >
                Next: View Concerns
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Concerns Tab */}
        {activeTab === "concerns" && (
          <div className="space-y-3">
            {concerns.map((concern) => {
              const style = SEVERITY_STYLES[concern.severity] || SEVERITY_STYLES.Moderate
              const assistantId = `concern-${concern.rank}`
              return (
                <div key={concern.rank}>
                  <div
                    className="rounded-lg p-4"
                    style={{ background: style.bg, borderLeft: `4px solid ${style.color}` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                        style={{ background: style.color }}
                      >
                        {concern.rank}
                      </span>
                      <span className="text-[15px] font-bold text-[var(--text)]">{concern.label}</span>
                      <span
                        className="ml-auto text-[11px] font-bold py-0.5 px-2 rounded border"
                        style={{ background: style.bg, color: style.color, borderColor: style.border }}
                      >
                        {concern.severity}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mb-2 italic">Source: {concern.source}</div>
                    <div className="text-sm text-[var(--text)] leading-relaxed mb-3">{concern.explanation}</div>
                    <button
                      onClick={() => openAssistant(assistantId, "concern", concern.label, concern.explanation)}
                      className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask AI about this concern
                    </button>
                  </div>
                  {expandedAssistant === assistantId && (
                    <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Similar Projects Tab */}
        {activeTab === "similar" && (
          <div className="space-y-3">
            {similar_projects.map((project) => (
              <div key={project.title} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                <div className="font-bold text-[var(--text)] mb-1">{project.title}</div>
                <div className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wide font-semibold">{project.industry}</div>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            {clarifying_questions.map((q) => {
              const assistantId = `question-${q.question_number}`
              return (
                <div key={q.question_number}>
                  <div className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--dark)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {q.question_number}
                      </span>
                      <div className="flex-1">
                        <div className="text-[15px] font-bold text-[var(--text)] leading-snug mb-1">{q.question}</div>
                        <div className="text-[13px] text-[var(--muted)] italic mb-2">Linked to: {q.linked_concern}</div>
                        <button
                          onClick={() => openAssistant(assistantId, "question", q.question, `Linked to: ${q.linked_concern}`)}
                          className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Ask AI about this
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={questionAnswers[q.question_number] || ""}
                      onChange={(e) => onAnswerChange(q.question_number, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full py-2.5 px-3 border border-[var(--border)] rounded-lg text-sm text-[var(--text)] bg-white outline-none leading-relaxed resize-y min-h-[80px] placeholder:text-[#9ca3af] focus:border-[var(--orange)] transition-colors"
                    />
                  </div>
                  {expandedAssistant === assistantId && (
                    <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />
                  )}
                </div>
              )
            })}

            <div className="text-center mt-4">
              <button
                onClick={onGoToCoach}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] transition-all"
                style={{ boxShadow: "0 4px 14px rgba(232,93,0,0.3)" }}
              >
                Strengthen Your Build
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
