""use client"
// Cache invalidation: fixes stale bundle crashes"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowRight, MessageSquare, X } from "lucide-react"
import type { EvaluationResponse } from "@/lib/types"

interface EvalResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNum: number, answer: string) => void
}

type Tab = 'agentic' | 'concerns' | 'similar' | 'questions'

// Reusable Ask the Coach chat interface component
function AskTheCoach({ itemId, context, openingMessage }: { itemId: string; context: string; openingMessage?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const defaultOpening = openingMessage || "I'm focused on this specific point. What would you like to explore?"
  const [messages, setMessages] = useState<Array<{ role: 'coach' | 'user'; text: string }>>([
    { role: 'coach', text: defaultOpening }
  ])
  
  const handleSend = () => {
    if (!inputValue.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: inputValue }])
    setInputValue('')
    // TODO: Add actual AI response logic here
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'coach', text: "That's a great question! Let me help you think through this..." }])
    }, 500)
  }
  
  return (
    <div className="mt-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[13px] font-semibold text-[var(--orange)] hover:text-[var(--orange-hover)] flex items-center gap-1.5"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Ask the Coach
      </button>
      
      {isOpen && (
        <div className="mt-3 bg-white border-2 border-[var(--orange)] rounded-lg overflow-hidden flex flex-col min-h-[300px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[var(--orange)] flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-[var(--text)]">AgenticFit Coach</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[var(--muted)] hover:text-[var(--text)] p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Chat messages area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[180px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div 
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    msg.role === 'coach' 
                      ? "bg-gray-100 text-[var(--text)]" 
                      : "bg-[var(--orange)] text-white"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a follow-up..."
              className="flex-1 py-2 px-3 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--orange)] transition-colors"
            />
            <button 
              onClick={handleSend}
              className="bg-[var(--orange)] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--orange-hover)] transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

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
  if (!data || !data.agentic_fit || !Array.isArray(data.industry_concerns)) {
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
  
  // Map API field names to component names with defaults
  const { agentic_fit, industry_concerns = [], similar_projects = [], clarifying_questions = [] } = data
  const concerns = industry_concerns || []

  // Map overall score to display label and color for the agentic fit content area
  const agenticScoreMap: Record<string, { label: string; color: string }> = {
    HIGH:   { label: 'STRONG FIT', color: '#16a34a' },
    MEDIUM: { label: 'MEDIUM FIT', color: '#a16207' },
    LOW:    { label: 'WEAK FIT',   color: '#dc2626' },
  }
  const agenticScore = agenticScoreMap[agentic_fit?.overall_score?.toUpperCase() || ''] || null

  const tabs = [
    { id: 'agentic' as Tab, label: 'Agentic Fit' },
    { id: 'concerns' as Tab, label: 'Concerns', count: concerns.length },
    { id: 'similar' as Tab, label: 'Similar Projects', count: similar_projects.length },
    { id: 'questions' as Tab, label: 'Questions', count: clarifying_questions.length }
  ]

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="border-b border-[var(--border)] flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-6 py-3 font-semibold text-sm transition-colors relative',
              activeTab === tab.id ? 'text-[var(--text)] border-b-2 border-[var(--orange)]' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
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
              <div
                className="text-[13px] font-bold mb-2 uppercase tracking-wide"
                style={{ color: agenticScore?.color || 'var(--muted)' }}
              >
                {agenticScore?.label || agentic_fit.overall_score}
              </div>
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
                    <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{criterion.reasoning}</div>
                    <AskTheCoach 
                      itemId={`criterion-${index}`} 
                      context={criterion.name}
                      openingMessage={`I can help you think through ${criterion.name?.replace(/[?!.,;:]+$/, '') || criterion.name}. How can I help?`}
                    />
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
              // Find the clarifying question linked to this concern
              const linkedQuestion = clarifying_questions.find(
                (q) => q.linked_concern?.toLowerCase() === concern.label?.toLowerCase()
              )
              const cleanLabel = concern.label?.replace(/[?!.,;:]+$/, '') || ''
              const openingMessage = `I can help you think through ${cleanLabel}. How can I help?`
              return (
                <div key={concern.rank} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]" style={{ borderLeftWidth: '4px', borderLeftColor: style.color }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[var(--blue)] text-white text-xs font-bold flex items-center justify-center">{concern.rank}</span>
                      <span className="text-[15px] font-bold text-[var(--text)]">{concern.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: style.color }}></span>
                      <span className="text-sm font-semibold" style={{ color: style.color }}>{concern.severity}</span>
                    </div>
                  </div>
                  <div className="text-[13px] text-[var(--muted)] mb-2 italic">Source: {concern.source}</div>
                  <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{concern.explanation}</div>
                  <AskTheCoach itemId={`concern-${concern.rank}`} context={concern.label} openingMessage={openingMessage} />
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'similar' && (
          <div className="space-y-3">
            {similar_projects && similar_projects.length > 0 ? (
              similar_projects.map((project) => (
                <div key={project.title} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                  <div className="font-bold text-[var(--text)] mb-1">{project.title}</div>
                  <div className="text-sm text-[var(--muted)] mb-2">{project.industry}</div>
                  <div className="text-sm text-[var(--text)]">{project.description}</div>
                </div>
              ))
            ) : (
              <div className="bg-[var(--bg)] rounded-lg p-6 border-2 border-[var(--border)] text-center">
                <div className="text-[var(--muted)] text-sm">No similar projects found for this evaluation.</div>
              </div>
            )}
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
                  </div>
                </div>
                <div className="text-[13px] text-[var(--muted)] italic mb-3">Linked to: {q.linked_concern}</div>
                <textarea
                  value={questionAnswers[q.question_number] || ''}
                  onChange={(e) => onAnswerChange(q.question_number, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-sm text-[var(--text)] bg-white transition-all outline-none leading-relaxed resize-y min-h-[80px] placeholder:text-[#9ca3af] mb-3"
                />
                <AskTheCoach 
                  itemId={`question-${q.question_number}`} 
                  context={q.question}
                  openingMessage={`I can help you think through ${(q.linked_concern || q.question)?.replace(/[?!.,;:]+$/, '')}. How can I help?`}
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
