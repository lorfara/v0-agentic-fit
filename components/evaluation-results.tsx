"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, ArrowRight, MessageSquare } from "lucide-react"
import { InlineAIAssistant } from "@/components/inline-ai-assistant"
import type { EvaluationResponse } from "@/lib/types"

interface EvaluationResultsProps {
  data: EvaluationResponse
  onGoToCoach: () => void
  questionAnswers: Record<number, string>
  onAnswerChange: (questionNum: number, answer: string) => void
}

type Tab = 'agentic' | 'concerns' | 'similar' | 'questions'

interface AIContext {
  type: 'criterion' | 'concern' | 'question'
  title: string
  content: string
}

const VERDICT_STYLES = {
  'Strong fit': { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  'Partial fit': { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'Weak fit': { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' }
}

const SEVERITY_STYLES = {
  'Critical': { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
  'Major': { bg: '#fef08a', color: '#b45309', border: '#fde047' },
  'Moderate': { bg: '#dbeafe', color: '#0284c7', border: '#bfdbfe' }
}

export function EvaluationResults({ data, onGoToCoach, questionAnswers, onAnswerChange }: EvaluationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('agentic')
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null)
  const [aiContext, setAiContext] = useState<AIContext>({ type: 'criterion', title: '', content: '' })

  const { agentic_fit, concerns, similar_projects, clarifying_questions } = data

  const openAIAssistant = (assistantId: string, type: AIContext['type'], title: string, content: string) => {
    setAiContext({ type, title, content })
    setExpandedAssistant(expandedAssistant === assistantId ? null : assistantId)
  }

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
      {/* Warning Banner */}
      <div className="bg-[#fee2e2] border-b-2 border-[#fca5a5] px-6 py-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-[#991b1b] mb-1">High risk of not completing this project as described in 6 weeks.</div>
          <div className="text-sm text-[#7f1d1d]">Review the agentic fit assessment and concerns below. Answer the clarifying questions before strengthening your build.</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] flex">
        {(['agentic', 'concerns', 'similar', 'questions'] as const).map((tab) => {
          const labels = { agentic: 'Agentic Fit', concerns: `Concerns ${concerns.length}`, similar: `Similar Projects ${similar_projects.length}`, questions: `Questions ${clarifying_questions.length}` }
          const counts = { agentic: undefined, concerns: concerns.length, similar: similar_projects.length, questions: clarifying_questions.length }
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3 font-semibold text-sm transition-colors relative',
                activeTab === tab
                  ? 'text-[var(--orange)] border-b-2 border-[var(--orange)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              )}
            >
              {labels[tab as keyof typeof labels]}
              {counts[tab] !== undefined && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--orange)] text-white text-xs font-bold">
                  {counts[tab]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'agentic' && (
          <div className="space-y-4">
            <div className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
              <div className="text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">MEDIUM</div>
              <p className="text-sm text-[var(--text)]">{agentic_fit.justification}</p>
            </div>
            <div className="space-y-3">
              {agentic_fit.criteria.map((criterion, index) => {
                const style = VERDICT_STYLES[criterion.verdict] || VERDICT_STYLES['Partial fit']
                const assistantId = `criterion-${index}`
                return (
                  <div key={index}>
                    <div className="rounded-lg p-4" style={{ background: style.bg, borderLeft: `4px solid ${style.color}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[15px] font-bold text-[var(--text)]">{criterion.name}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: style.color }}></span>
                          <span className="text-sm font-semibold" style={{ color: style.color }}>{criterion.verdict}</span>
                        </div>
                      </div>
                      <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">{criterion.reasoning}</div>
                      <button
                        onClick={() => openAIAssistant(assistantId, 'criterion', criterion.name, criterion.reasoning)}
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
          </div>
        )}

        {activeTab === 'concerns' && (
          <div className="space-y-3">
            {concerns.map((concern) => {
              const style = SEVERITY_STYLES[concern.severity] || SEVERITY_STYLES.Moderate
              const assistantId = `concern-${concern.rank}`
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
                    <button
                      onClick={() => openAIAssistant(assistantId, 'concern', concern.label, concern.explanation)}
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
        )}

        {activeTab === 'similar' && (
          <div className="space-y-3">
            {similar_projects.map((project) => (
              <div key={project.title} className="bg-[var(--bg)] rounded-lg p-4 border-2 border-[var(--border)]">
                <div className="font-bold text-[var(--text)] mb-1">{project.title}</div>
                <div className="text-sm text-[var(--muted)] mb-2">{project.similarity}</div>
                <div className="text-sm text-[var(--text)]">{project.link}</div>
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
                  <div className="bg-[var(--bg)] rounded-[10px] p-[16px_18px] border-2 border-[var(--border)] transition-colors hover:border-[var(--blue)]">
                    <div className="flex items-start gap-3.5 mb-3">
                      <span className="w-7 h-7 rounded-full bg-[var(--blue)] text-white font-display text-[13px] font-black flex items-center justify-center shrink-0 mt-0.5">{q.question_number}</span>
                      <div className="flex-1">
                        <div className="text-[15px] font-bold text-[var(--text)] leading-snug mb-1.5">{q.question}</div>
                        <div className="text-[13px] text-[var(--muted)] italic mb-2">Linked to: {q.linked_concern}</div>
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
                      className="w-full py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-sm text-[var(--text)] bg-white transition-all outline-none leading-relaxed resize-y min-h-[80px] placeholder:text-[#9ca3af]"
                    />
                  </div>
                  {expandedAssistant === assistantId && (
                    <InlineAIAssistant context={aiContext} onClose={() => setExpandedAssistant(null)} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Footer CTA */}
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
    </div>
  )
}
  context: {
    type: 'criterion' | 'concern' | 'question'
    title: string
    content: string
  }
  onClose: () => void
}

export function InlineAIAssistant({ context, onClose }: InlineAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with AI greeting
    const greeting = "I'm focused on this specific point. What would you like to explore?"
    setMessages([{ role: 'assistant', content: greeting }])
  }, [context])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Here's how I'd think about that...\n\nFocus on what makes your approach unique compared to existing solutions. Make sure you can articulate the specific decision-making process your agent will use.",
      "Let me help you dig deeper into that.\n\nConsider how this relates to your target user. What problem does this solve for them specifically? The stronger your connection to user needs, the stronger your project.",
      "That's an important consideration.\n\nI'd recommend thinking about the minimal version first. What's the core thing that needs to work? You can always expand once the foundation is solid.",
      "Great instinct. Here's my take:\n\nBreak this down into steps. What's the first thing that needs to happen? Then the second? Showing clear sequencing will strengthen your evaluation.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))

    const response = generateResponse(userMessage)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setIsTyping(false)
  }

  return (
    <div 
      className="rounded-[10px] p-4 mb-3 bg-[#fff5f3] border-2 border-[#fecdc9]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--orange)]" />
          <span className="text-xs font-semibold text-[#666] uppercase tracking-wide">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#999] hover:text-[#333] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-lg p-3 mb-3 max-h-[200px] overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] text-sm px-3 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-[#f5f5f5] text-[#333]'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up..."
          className="flex-1 px-3 py-2 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#333] placeholder:text-[#999] outline-none focus:border-[var(--orange)] transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-3 py-2 bg-[var(--orange)] text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--orange-hover)] transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
