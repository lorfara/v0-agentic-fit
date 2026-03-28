"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react"
import { InlineAIAssistant } from "@/components/inline-ai-assistant"
import type { EvaluationResponse, RiskLevel } from "@/lib/types"

interface EvaluationResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNumber: number, answer: string) => void
}

type Tab = 'agentic' | 'concerns' | 'similar' | 'questions'

interface AIContext {
  type: 'criterion' | 'concern' | 'question'
  title: string
  content: string
}

const SEVERITY_STYLES = {
  Critical: { bg: 'var(--red-bg)', border: 'var(--red-border)', color: 'var(--red)' },
  Significant: { bg: '#fef3c7', border: '#fcd34d', color: '#d97706' },
  Moderate: { bg: '#f0f7ff', border: '#93c5fd', color: 'var(--blue)' },
}

const VERDICT_STYLES = {
  'Strong fit': { bg: 'var(--green-bg)', border: 'var(--green-border)', color: 'var(--green)', dot: 'bg-[var(--green)]' },
  'Partial fit': { bg: '#fef3c7', border: '#fcd34d', color: '#d97706', dot: 'bg-[#eab308]' },
  'Weak fit': { bg: 'var(--red-bg)', border: 'var(--red-border)', color: 'var(--red)', dot: 'bg-[var(--red)]' },
}

const AGENTIC_SCORE_STYLES = {
  HIGH: { bg: 'var(--green-bg)', border: 'var(--green-border)', color: 'var(--green)', label: 'HIGH' },
  MEDIUM: { bg: '#fef08a', border: '#facc15', color: '#c8a300', label: 'MEDIUM' },
  LOW: { bg: 'var(--red-bg)', border: 'var(--red-border)', color: 'var(--red)', label: 'LOW' },
}

export function EvaluationResults({ data, onGoToCoach, questionAnswers, onAnswerChange }: EvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('agentic')
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null)
  const [aiContext, setAiContext] = useState<AIContext>({ type: 'criterion', title: '', content: '' })
  
  const { agentic_fit, concerns, similar_projects, clarifying_questions } = data

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
      bg: '#fef3c7',
      border: '#fcd34d',
      iconBg: '#d97706',
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

  const openAIAssistant = (assistantId: string, type: AIContext['type'], title: string, content: string) => {
    setAiContext({ type, title, content })
    setExpandedAssistant(expandedAssistant === assistantId ? null : assistantId)
  }

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="p-6">
        {/* Risk Alert Banner */}
        <div 
          className="rounded-[10px] p-[18px_20px] mb-5 flex items-start gap-3.5"
          style={{ 
            background: riskConfig.bg, 
            border: `2px solid ${riskConfig.border}`
          }}
        >
          <AlertTriangle size={20} style={{ color: riskConfig.iconBg }} className="mt-0.5 flex-shrink-0" />
          <div>
            <div style={{ color: riskConfig.iconBg }} className="font-bold mb-1">{riskConfig.title}</div>
            <div className="text-sm" style={{ color: riskConfig.iconBg }}>
              {riskConfig.body}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-semibold border-b-2 transition-all",
                activeTab === tab.id
                  ? "border-[var(--orange)] text-[var(--orange)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span 
                  className="ml-2 text-xs font-bold py-0.5 px-1.5 rounded-full text-white"
                  style={{ background: tab.countBg }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'agentic' && (
            <div className="space-y-5">
              <div 
                className="rounded-lg p-4"
                style={{ 
                  background: agenticStyle.bg, 
                  border: `2px solid ${agenticStyle.border}`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[15px] font-bold" style={{ color: agenticStyle.color }}>
                    {agentic_fit.overall_score} Overall Agentic Fit Score
                  </span>
                </div>
                <p className="text-sm text-[var(--text)]">{agentic_fit.summary}</p>
              </div>

              {/* Criteria Cards */}
              <div className="space-y-3">
                {agentic_fit.criteria.map((criterion, index) => {
                  const style = VERDICT_STYLES[criterion.verdict] || VERDICT_STYLES['Partial fit']
                  const assistantId = `criterion-${index}`
                  return (
                    <div key={index}>
                      <div 
                        className="rounded-lg p-4"
                        style={{ 
                          background: style.bg, 
                          borderLeft: `4px solid ${style.color}`
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[15px] font-bold text-[var(--text)]">{criterion.name}</div>
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: style.color }}
                            ></span>
                            <span 
                              className="text-sm font-semibold"
                              style={{ color: style.color }}
                            >
                              {criterion.verdict}
                            </span>
                          </div>
                        </div>
                        <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">
                          {criterion.reasoning}
                        </div>
                        <button 
                          onClick={() => openAIAssistant(assistantId, 'criterion', criterion.name, criterion.reasoning)}
                          className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Ask AI about this
                        </button>
                      </div>
                      {expandedAssistant === assistantId && (
                        <InlineAIAssistant
                          context={aiContext}
                          onClose={() => setExpandedAssistant(null)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'concerns' && (
            <div className="space-y-3">
              {concerns.map((concern) => {
                const style = SEVERITY_STYLES[concern.severity] || SEVERITY_STYLES.Moderate
                const assistantId = `concern-${concern.rank}`
                return (
                  <div key={concern.rank}>
                    <div 
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
                            background: 'transparent',
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
                      <div className="text-sm text-[var(--text)] leading-relaxed mb-3">
                        {concern.explanation}
                      </div>
                      <button 
                        onClick={() => openAIAssistant(assistantId, 'concern', concern.label, concern.explanation)}
                        className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask AI about this
                      </button>
                    </div>
                    {expandedAssistant === assistantId && (
                      <InlineAIAssistant
                        context={aiContext}
                        onClose={() => setExpandedAssistant(null)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'similar' && (
            <div className="space-y-3">
              {similar_projects.map((project) => (
                <div key={project.name} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                  <div className="font-bold text-[var(--text)] mb-1">{project.name}</div>
                  <div className="text-sm text-[var(--muted)]">{project.description}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              {clarifying_questions.map((q) => {
                const assistantId = `question-${q.question_number}`
                return (
                  <div key={q.question_number}>
                    <div 
                      className="bg-[var(--bg)] rounded-[10px] p-[16px_18px] border-2 border-[var(--border)] transition-colors hover:border-[var(--blue)]"
                    >
                      <div className="flex items-start gap-3.5 mb-3">
                        <span className="w-7 h-7 rounded-full bg-[var(--blue)] text-white font-display text-[13px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {q.question_number}
                        </span>
                        <div className="flex-1">
                          <div className="text-[15px] font-bold text-[var(--text)] leading-snug mb-1.5">
                            {q.question}
                          </div>
                          <div className="text-[13px] text-[var(--muted)] italic mb-2">
                            Linked to: {q.linked_concern}
                          </div>
                          <button 
                            onClick={() => openAIAssistant(assistantId, 'question', q.question, `This question is linked to the "${q.linked_concern}" concern.`)}
                            className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Ask AI about this
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={questionAnswers[q.question_number] || ''}
                        onChange={(e) => onAnswerChange(q.question_number, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-sm text-[var(--text)] bg-white transition-all outline-none leading-relaxed resize-y min-h-[80px] form-textarea placeholder:text-[#9ca3af]"
                      />
                    </div>
                    {expandedAssistant === assistantId && (
                      <InlineAIAssistant
                        context={aiContext}
                        onClose={() => setExpandedAssistant(null)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="text-center mt-8">
          <button
            onClick={onGoToCoach}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-display text-base font-extrabold cursor-pointer transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] hover:-translate-y-0.5"
            style={{ boxShadow: '0 4px 14px rgba(232,93,0,0.35)' }}
          >
            Next: View Concerns
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

