"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react"
import { InlineAIAssistant } from "@/components/inline-ai-assistant"
import type { EvaluationResponse } from "@/lib/types"

type Tab = "agentic" | "concerns" | "similar" | "questions"

interface EvaluationResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNum: number, answer: string) => void
}

const VERDICT_STYLES: Record<string, { bg: string; color: string }> = {
  "Strong fit": { bg: "#ecfdf5", color: "#059669" },
  "Partial fit": { bg: "#fffbeb", color: "#d97706" },
  "Weak fit": { bg: "#fee2e2", color: "#dc2626" },
}

const SEVERITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Critical: { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
  Major: { bg: "#fef08a", color: "#b45309", border: "#fde047" },
  Moderate: { bg: "#dbeafe", color: "#0284c7", border: "#bfdbfe" },
}

export function EvaluationResults({
  data,
  onGoToCoach,
  questionAnswers,
  onAnswerChange,
}: EvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("agentic")
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null)
  const [aiContext, setAiContext] = useState({ type: "criterion" as const, title: "", content: "" })

  const { agentic_fit, concerns, similar_projects, clarifying_questions } = data

  function toggleAssistant(id: string, type: "criterion" | "concern" | "question", title: string, content: string) {
    if (expandedAssistant === id) {
      setExpandedAssistant(null)
    } else {
      setAiContext({ type, title, content })
      setExpandedAssistant(id)
    }
  }

  const tabs = [
    { key: "agentic" as const, label: "Agentic Fit" },
    { key: "concerns" as const, label: "Concerns", count: concerns.length },
    { key: "similar" as const, label: "Similar Projects", count: similar_projects.length },
    { key: "questions" as const, label: "Questions", count: clarifying_questions.length },
  ]

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden" style={{ boxShadow: "var(--shadow)" }}>
      <div className="bg-[#fee2e2] border-b-2 border-[#fca5a5] px-6 py-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-[#991b1b] mb-1">High risk of not completing this project as described in 6 weeks.</div>
          <div className="text-sm text-[#7f1d1d]">Review the agentic fit assessment and concerns below. Answer the clarifying questions before strengthening your build.</div>
        </div>
      </div>

      <div className="border-b border-[var(--border)] flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-3 font-semibold text-sm transition-colors relative",
              activeTab === tab.key ? "text-[var(--orange)] border-b-2 border-[var(--orange)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--orange)] text-white text-xs font-bold">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "agentic" && (
          <div className="space-y-4">
            <div className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
              <div className="text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">MEDIUM</div>
              <p className="text-sm text-[var(--text)]">{agentic_fit.justification}</p>
            </div>
            <div className="space-y-3">
              {agentic_fit.criteria.map((c, i) => {
                const style = VERDICT_STYLES[c.verdict] || VERDICT_STYLES["Partial fit"]
                const aid = `c-${i}`
                return (
                  <div key={i}>
                    <div className="rounded-lg p-4" style={{ background: style.bg, borderLeft: `4px solid ${style.color}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[15px] font-bold text-[var(--text)]">{c.name}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: style.color }} />
                          <span className="text-sm font-semibold" style={{ color: style.color }}>{c.verdict}</span>
                        </div>
                      </div>
                      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">{c.reasoning}</div>
                      <button onClick={() => toggleAssistant(aid, "criterion", c.name, c.reasoning)} className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask AI about this
                      </button>
                    </div>
                    {expandedAssistant === aid && <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === "concerns" && (
          <div className="space-y-3">
            {concerns.map((concern) => {
              const style = SEVERITY_STYLES[concern.severity] || SEVERITY_STYLES.Moderate
              const aid = `concern-${concern.rank}`
              return (
                <div key={concern.rank}>
                  <div className="rounded-[10px] p-[18px_20px]" style={{ background: style.bg, border: `2px solid ${style.border}`, borderLeft: `4px solid ${style.color}` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: style.color }}>{concern.rank}</span>
                      <span className="text-[15px] font-bold text-[var(--text)]">{concern.label}</span>
                      <span className="ml-auto text-xs font-semibold py-0.5 px-2 rounded" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>{concern.severity}</span>
                    </div>
                    <div className="text-sm text-[var(--muted)] mb-2 italic">Source: {concern.source}</div>
                    <div className="text-sm text-[var(--text)] leading-relaxed mb-3">{concern.explanation}</div>
                    <button onClick={() => toggleAssistant(aid, "concern", concern.label, concern.explanation)} className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask AI about this
                    </button>
                  </div>
                  {expandedAssistant === aid && <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === "similar" && (
          <div className="space-y-3">
            {similar_projects.map((p) => (
              <div key={p.title} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                <div className="font-bold text-[var(--text)] mb-1">{p.title}</div>
                <div className="text-sm text-[var(--muted)] mb-2">{p.similarity}</div>
                <div className="text-sm text-[var(--text)]">{p.link}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-4">
            {clarifying_questions.map((q) => {
              const aid = `q-${q.question_number}`
              return (
                <div key={q.question_number}>
                  <div className="bg-[var(--bg)] rounded-[10px] p-[16px_18px] border-2 border-[var(--border)] transition-colors hover:border-[var(--blue)]">
                    <div className="flex items-start gap-3.5 mb-3">
                      <span className="w-7 h-7 rounded-full bg-[var(--blue)] text-white text-[13px] font-black flex items-center justify-center shrink-0 mt-0.5">{q.question_number}</span>
                      <div className="flex-1">
                        <div className="text-[15px] font-bold text-[var(--text)] leading-snug mb-1.5">{q.question}</div>
                        <div className="text-[13px] text-[var(--muted)] italic mb-2">Linked to: {q.linked_concern}</div>
                        <button onClick={() => toggleAssistant(aid, "question", q.question, `Linked to: ${q.linked_concern}`)} className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Ask AI about this
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={questionAnswers[q.question_number] || ""}
                      onChange={(e) => onAnswerChange(q.question_number, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] text-sm text-[var(--text)] bg-white outline-none leading-relaxed resize-y min-h-[80px] placeholder:text-[#9ca3af]"
                    />
                  </div>
                  {expandedAssistant === aid && <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />}
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={onGoToCoach}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-base font-extrabold cursor-pointer transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] hover:-translate-y-0.5"
            style={{ boxShadow: "0 4px 14px rgba(232,93,0,0.35)" }}
          >
            Strengthen Your Build
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
