"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowRight, MessageCircle } from "lucide-react"
import type { EvaluationResponse, RiskLevel, ClarifyingQuestion } from "@/lib/types"

interface EvaluationResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNumber: number, answer: string) => void
}

type Tab = 'agentic' | 'concerns' | 'similar' | 'questions'

const SEVERITY_STYLES = {
  Critical: { bg: 'var(--red-bg)', border: 'var(--red-border)', color: 'var(--red)' },
  Significant: { bg: 'var(--yellow-bg)', border: 'var(--yellow-border)', color: 'var(--yellow)' },
  Moderate: { bg: '#f0f7ff', border: '#93c5fd', color: 'var(--blue)' },
}

const VERDICT_STYLES = {
  'Strong fit': { bg: 'var(--green-bg)', border: 'var(--green-border)', color: 'var(--green)' },
  'Partial fit': { bg: 'var(--yellow-bg)', border: 'var(--yellow-border)', color: 'var(--yellow)' },
  'Weak fit': { bg: 'var(--red-bg)', border: 'var(--red-border)', color: 'var(--red)' },
}

const AGENTIC_SCORE_STYLES = {
  HIGH: { bg: 'var(--green-bg)', border: 'var(--green-border)', color: 'var(--green)', label: 'HIGH' },
  MEDIUM: { bg: 'var(--yellow-bg)', border: 'var(--yellow-border)', color: 'var(--yellow)', label: 'MEDIUM' },
  LOW: { bg: 'var(--red-bg)', border: 'var(--red-border)', color: 'var(--red)', label: 'LOW' },
}

export function EvaluationResults({ data, onGoToCoach, questionAnswers, onAnswerChange }: EvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('agentic')
  const { agentic_fit, concerns, similar_projects, clarifying_questions } = data

  // Determine build risk based on concerns
  const buildRisk: RiskLevel = concerns.some(c => c.severity === 'Critical') 
    ? 'High'
    : concerns.some(c => c.severity === 'Significant') 
      ? 'Medium' 
      : 'Low'

  const riskConfig = {
    High: {
      bg: 'var(--red-bg)',
      border: 'var(--red-border)',
      iconBg: 'var(--red)',
      title: 'High risk of not completing this project as described in 6 weeks.',
      body: 'Review the agentic fit assessment and concerns below. Answer the clarifying questions before strengthening your build.'
    },
    Medium: {
      bg: 'var(--yellow-bg)',
      border: 'var(--yellow-border)',
      iconBg: 'var(--yellow)',
      title: 'Moderate 6-week build risk — a few things need sharpening before you commit.',
      body: 'Review the concerns below and answer the clarifying questions to lock in your scope.'
    },
    Low: {
      bg: 'var(--green-bg)',
      border: 'var(--green-border)',
      iconBg: 'var(--green)',
      title: 'This project looks feasible for a 6-week build.',
      body: 'A few things can still make your demo stronger — review the notes below.'
    }
  }[buildRisk]

  const agenticStyle = AGENTIC_SCORE_STYLES[agentic_fit.overall_score] || AGENTIC_SCORE_STYLES.MEDIUM

  const tabs: { id: Tab; label: string; count?: number; countBg?: string }[] = [
    { id: 'agentic', label: 'Agentic Fit' },
    { id: 'concerns', label: 'Concerns', count: concerns.length, countBg: 'var(--red)' },
    { id: 'similar', label: 'Similar Projects', count: similar_projects.length, countBg: 'var(--navy)' },
    { id: 'questions', label: 'Questions', count: clarifying_questions.length, countBg: 'var(--blue)' },
  ]

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="p-6 pt-0">
        {/* Risk Alert Banner */}
        <div 
          className="rounded-[10px] p-[18px_20px] mt-6 mb-5 flex items-start gap-3.5"
          style={{ 
            background: riskConfig.bg, 
            border: `2px solid ${riskConfig.border}` 
          }}
        >
          <div 
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: riskConfig.iconBg }}
          >
            <AlertTriangle className="w-[17px] h-[17px] text-white" />
          </div>
          <div>
            <div 
              className="font-display text-base font-black mb-1"
              style={{ color: riskConfig.iconBg }}
            >
              {riskConfig.title}
            </div>
            <div className="text-sm text-[var(--text)] leading-relaxed">
              {riskConfig.body}
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b-2 border-[var(--border)] mb-5 gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center py-3 px-4 font-display text-sm font-bold border-b-[3px] border-transparent cursor-pointer transition-all whitespace-nowrap -mb-0.5",
                activeTab === tab.id 
                  ? "text-[var(--orange)] border-b-[var(--orange)]" 
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span 
                  className="ml-1.5 text-[11px] font-bold text-white py-0.5 px-[7px] rounded-[10px]"
                  style={{ background: tab.countBg }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'agentic' && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span 
                className="text-xs font-bold py-1 px-3.5 rounded-[20px] uppercase tracking-wider"
                style={{
                  background: agenticStyle.bg,
                  color: agenticStyle.color,
                  border: `1px solid ${agenticStyle.border}`
                }}
              >
                {agenticStyle.label}
              </span>
              <span className="text-sm text-[var(--muted)]">Overall Agentic Fit Score</span>
            </div>
            
            <div 
              className="text-[15px] text-[var(--text)] leading-relaxed mb-4 p-[14px_18px] bg-[var(--bg)] rounded-lg"
              style={{ borderLeft: '3px solid var(--orange)' }}
            >
              {agentic_fit.justification}
            </div>

            {/* Criteria */}
            <div className="space-y-2">
              {agentic_fit.criteria.map((criterion, index) => {
                const style = VERDICT_STYLES[criterion.verdict] || VERDICT_STYLES['Partial fit']
                return (
                  <div 
                    key={index}
                    className="rounded-lg p-[14px_16px]"
                    style={{ 
                      background: style.bg, 
                      border: `1.5px solid ${style.border}`,
                      borderLeft: `4px solid ${style.color}`
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-sm font-bold text-[var(--text)]">{criterion.name}</div>
                      <span 
                        className="text-xs font-semibold"
                        style={{ color: style.color }}
                      >
                        {criterion.verdict}
                      </span>
                    </div>
                    <div className="text-[13px] text-[var(--muted)] leading-relaxed">
                      {criterion.reasoning}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab('concerns')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)]"
              >
                Next: View Concerns
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'concerns' && (
          <div>
            <div className="text-sm text-[var(--muted)] mb-4">
              Identified from instructor feedback patterns and industry trends in past cohorts
            </div>

            <div className="space-y-3">
              {concerns.map((concern) => {
                const style = SEVERITY_STYLES[concern.severity] || SEVERITY_STYLES.Moderate
                return (
                  <div 
                    key={concern.rank}
                    className="rounded-[10px] p-[18px_20px]"
                    style={{ 
                      background: style.bg, 
                      border: `2px solid ${style.border}`,
                      borderLeft: `4px solid ${style.color}`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                        style={{ background: style.color }}
                      >
                        {concern.rank}
                      </span>
                      <span className="text-[15px] font-bold text-[var(--text)]">
                        {concern.label}
                      </span>
                      <span 
                        className="ml-auto text-xs font-semibold py-0.5 px-2 rounded"
                        style={{ 
                          background: style.bg, 
                          color: style.color,
                          border: `1px solid ${style.border}`
                        }}
                      >
                        {concern.severity}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--muted)] mb-2 italic">
                      Source: {concern.source}
                    </div>
                    <div className="text-sm text-[var(--text)] leading-relaxed">
                      {concern.explanation}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab('similar')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)]"
              >
                Next: Similar Projects
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'similar' && (
          <div>
            <div className="text-sm text-[var(--muted)] mb-4">
              From previous cohorts in the same industry
            </div>

            <div className="space-y-3">
              {similar_projects.map((project, index) => (
                <div 
                  key={index}
                  className="bg-[var(--bg)] rounded-[10px] p-[18px_20px] border-2 border-[var(--border)] transition-colors hover:border-[var(--orange)]"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[var(--orange)] text-white font-display text-[13px] font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-[15px] font-bold text-[var(--text)]">
                        {project.title}
                      </span>
                    </div>
                    <span className="text-xs font-semibold py-0.5 px-2.5 rounded-[20px] bg-[var(--orange-light)] text-[var(--orange-hover)] border border-[#ffc49a] whitespace-nowrap">
                      {project.industry}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--muted)] leading-relaxed">
                    {project.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab('questions')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)]"
              >
                Next: Answer Questions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <div className="text-sm text-[var(--muted)] mb-4">
              Answer these to strengthen your build — your responses feed into the coaching round
            </div>

            <div className="space-y-4">
              {clarifying_questions.map((q) => (
                <div 
                  key={q.question_number}
                  className="bg-[var(--bg)] rounded-[10px] p-[16px_18px] border-2 border-[var(--border)] transition-colors hover:border-[var(--blue)]"
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

            <div className="text-center mt-6">
              <button
                onClick={onGoToCoach}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--radius-sm)] font-display text-base font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)] hover:-translate-y-0.5"
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
