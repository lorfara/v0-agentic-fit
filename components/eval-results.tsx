"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react"
import type { EvaluationResponse } from "@/lib/types"

interface EvalResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNum: number, answer: string) => void
}

type Tab = 'agentic' | 'concerns' | 'similar' | 'questions'

const VERDICT_STYLES: Record<string, { bg: string; color: string }> = {
  'Strong fit': { bg: '#ecfdf5', color: '#059669' },
  'Partial fit': { bg: '#fffbeb', color: '#d97706' },
  'Weak fit': { bg: '#fee2e2', color: '#dc2626' }
}

const SEVERITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  'Critical': { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
  'Significant': { bg: '#fef08a', color: '#b45309', border: '#fde047' },
  'Moderate': { bg: '#dbeafe', color: '#0284c7', border: '#bfdbfe' }
}

export function EvalResults({ data, onGoToCoach, questionAnswers, onAnswerChange }: EvalResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('agentic')
  
  // Safety check: if data is invalid or missing critical fields, render error
  if (!data || !data.agentic_fit || !Array.isArray(data.concerns)) {
    return (
      <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden p-6">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600 font-bold">Invalid response data</p>
          <p className="text-sm text-gray-600 mt-1">The evaluation response was incomplete or malformed. Please try again.</p>
        </div>
      </div>
    )
  }
  
  const { agentic_fit, concerns, similar_projects, clarifying_questions } = data

  // Determine banner color based on highest severity
  const highestSeverity = concerns.length > 0 
    ? concerns.reduce((highest, concern) => {
        const severityOrder = { 'Critical': 3, 'Significant': 2, 'Moderate': 1 }
        return (severityOrder[concern.severity as keyof typeof severityOrder] || 0) > 
               (severityOrder[highest.severity as keyof typeof severityOrder] || 0) 
          ? concern 
          : highest
      }).severity
    : 'Moderate'

  const bannerStyles = {
    'Critical': { bg: '#fee2e2', border: '#fca5a5', textBold: '#991b1b', textLight: '#7f1d1d' },
    'Significant': { bg: '#fef3c7', border: '#fcd34d', textBold: '#92400e', textLight: '#78350f' },
    'Moderate': { bg: '#d1fae5', border: '#6ee7b7', textBold: '#065f46', textLight: '#047857' }
  }
  
  const style = bannerStyles[highestSeverity as keyof typeof bannerStyles] || bannerStyles.Moderate

  const tabs = [
    { id: 'agentic' as Tab, label: 'Agentic Fit' },
    { id: 'concerns' as Tab, label: 'Concerns', count: concerns.length },
    { id: 'similar' as Tab, label: 'Similar Projects', count: similar_projects.length },
    { id: 'questions' as Tab, label: 'Questions', count: clarifying_questions.length }
  ]

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="border-b-2 px-6 py-4 flex items-start gap-3" style={{ background: style.bg, borderColor: style.border }}>
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: bannerStyles[highestSeverity as keyof typeof bannerStyles]?.border }} />
        <div>
          <div className="font-bold mb-1" style={{ color: style.textBold }}>High risk of not completing this project as described in 6 weeks.</div>
          <div className="text-sm" style={{ color: style.textLight }}>Review the agentic fit assessment and concerns below. Answer the clarifying questions before strengthening your build.</div>
        </div>
      </div>

      <div className="border-b border-[var(--border)] flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-6 py-3 font-semibold text-sm transition-colors relative',
              activeTab === tab.id ? 'text-[var(--orange)] border-b-2 border-[var(--orange)]' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
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
        {activeTab === 'agentic' && (
          <div className="space-y-4">
            <div className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
              <div className="text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">{agentic_fit.overall_score}</div>
              <p className="text-sm text-[var(--text)]">{agentic_fit.justification}</p>
            </div>
            <div className="space-y-3">
              {agentic_fit.criteria.map((criterion, index) => {
                const style = VERDICT_STYLES[criterion.verdict] || VERDICT_STYLES['Partial fit']
                return (
                  <div key={index} className="rounded-lg p-4" style={{ background: style.bg, borderLeft: `4px solid ${style.color}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[15px] font-bold text-[var(--text)]">{criterion.name}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: style.color }}></span>
                        <span className="text-sm font-semibold" style={{ color: style.color }}>{criterion.verdict}</span>
                      </div>
                    </div>
                    <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">{criterion.reasoning}</div>
                    <button className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask AI about this
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab('concerns')}
                className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full font-display text-sm font-bold cursor-pointer transition-all bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)]"
              >
                Next: View Concerns
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'concerns' && (
          <div className="space-y-3">
            {concerns.map((concern) => {
              const style = SEVERITY_STYLES[concern.severity] || SEVERITY_STYLES.Moderate
              return (
                <div key={concern.rank} className="rounded-[10px] p-[18px_20px]" style={{ background: style.bg, border: `2px solid ${style.border}`, borderLeft: `4px solid ${style.color}` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: style.color }}>{concern.rank}</span>
                    <span className="text-[15px] font-bold text-[var(--text)]">{concern.label}</span>
                    <span className="ml-auto text-xs font-semibold py-0.5 px-2 rounded" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>{concern.severity}</span>
                  </div>
                  <div className="text-sm text-[var(--muted)] mb-2 italic">Source: {concern.source}</div>
                  <div className="text-sm text-[var(--text)] leading-relaxed mb-3">{concern.explanation}</div>
                  <button className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Ask AI about this
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'similar' && (
          <div className="space-y-3">
            {similar_projects.map((project) => (
              <div key={project.title} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                <div className="font-bold text-[var(--text)] mb-1">{project.title}</div>
                <div className="text-sm text-[var(--muted)] mb-2">{project.industry}</div>
                <div className="text-sm text-[var(--text)]">{project.description}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            {clarifying_questions.map((q) => (
              <div key={q.question_number} className="bg-[var(--bg)] rounded-[10px] p-[16px_18px] border-2 border-[var(--border)]">
                <div className="flex items-start gap-3.5 mb-3">
                  <span className="w-7 h-7 rounded-full bg-[var(--blue)] text-white font-display text-[13px] font-black flex items-center justify-center shrink-0 mt-0.5">{q.question_number}</span>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-[var(--text)] leading-snug mb-1.5">{q.question}</div>
                    <div className="text-[13px] text-[var(--muted)] italic mb-2">Linked to: {q.linked_concern}</div>
                    <button className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Ask AI about this
                    </button>
                  </div>
                </div>
                <textarea
                  value={questionAnswers[q.question_number] || ''}
                  onChange={(e) => onAnswerChange(q.question_number, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-sm text-[var(--text)] bg-white transition-all outline-none leading-relaxed resize-y min-h-[80px] placeholder:text-[#9ca3af]"
                />
              </div>
            ))}
            <div className="text-center mt-6">
              <button
                onClick={onGoToCoach}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-display text-base font-extrabold cursor-pointer transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] hover:-translate-y-0.5"
                style={{ boxShadow: '0 4px 14px rgba(232,93,0,0.35)' }}
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
