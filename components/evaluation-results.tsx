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
  'Critical': { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5', textColor: '#b91c1c' },
  'Major': { bg: '#fef08a', color: '#b45309', border: '#fde047', textColor: '#9a3412' },
  'Moderate': { bg: '#dbeafe', color: '#0284c7', border: '#bfdbfe', textColor: '#0c4a6e' }
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
    }
  }

  const generateResponse = (userMessage: string, ctx: AIAssistantProps['context']): string => {
    // Simulated AI responses based on context
    const responses: Record<string, string[]> = {
      criterion: [
        "Based on the evaluation criteria, here's what you should focus on:\n\n1. **Strengthen your reasoning chain** - Make sure each step in your pipeline clearly depends on the previous output.\n\n2. **Document your multi-step flow** - Instructors look for explicit handoffs between agents or processing stages.\n\n3. **Show state management** - Demonstrate how context carries through your pipeline.",
        "Great question! The key to scoring well on this criterion is demonstrating clear agentic behavior. Your project shows promise in document ingestion and synthesis. To strengthen it further, consider:\n\n- Mapping out each decision point where the agent chooses between actions\n- Showing how the output of one step informs the next\n- Adding a feedback loop where user input refines the output",
      ],
      concern: [
        "This is a common concern we see in capstone projects. Here are some strategies to address it:\n\n1. **Scope reduction** - Focus on one data source for your MVP demo\n2. **Clear prioritization** - Define what's must-have vs nice-to-have\n3. **Risk mitigation** - Have a backup plan if your primary approach hits blockers\n\nWould you like me to help you draft a more focused scope?",
        "I understand this concern can feel overwhelming. Let me break it down:\n\n**Why this matters:** Instructors have seen similar projects struggle with this exact issue. The ones that succeeded made tough scoping decisions early.\n\n**What you can do:**\n- Pick your single strongest use case\n- Build depth, not breadth\n- Save the full vision for v2\n\nWant me to help you identify your strongest use case?",
      ],
      question: [
        "Here's how I'd approach answering this question:\n\n**Start with specifics** - Name the exact source (e.g., 'Google Drive PDFs') rather than keeping options open.\n\n**Show readiness** - Mention you have sample documents ready to test.\n\n**Address the why** - Explain why this source makes sense for your target persona.\n\nWould you like me to help draft a response?",
        "This question is designed to test your focus. Here's what the instructor is really asking:\n\n1. Have you made a clear decision?\n2. Do you understand the tradeoffs?\n3. Are you ready to execute?\n\n**Tip:** A confident, specific answer scores better than a flexible, open-ended one. What's your current thinking on this?",
      ],
    }

    const contextResponses = responses[ctx.type] || responses.criterion
    const randomIndex = Math.floor(Math.random() * contextResponses.length)
    
    // Add some variation based on user message
    if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('how')) {
      return contextResponses[0]
    }
    return contextResponses[randomIndex]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = generateResponse(userMessage, context)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setIsTyping(false)
  }

  const handleClose = () => {
    setMessages([])
    setInput('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[var(--card)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--navy)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--orange)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-display font-bold text-base">AI Assistant</div>
              <div className="text-white/60 text-xs">Helping with: {context.title}</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === 'assistant' 
                    ? 'bg-[var(--orange)]' 
                    : 'bg-[var(--navy)]'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'assistant'
                    ? 'bg-[var(--bg)] text-[var(--text)]'
                    : 'bg-[var(--orange)] text-white'
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--orange)] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[var(--bg)] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 px-4 py-3 bg-[var(--card)] border-2 border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--orange)] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 bg-[var(--orange)] text-white rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--orange-hover)] transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
