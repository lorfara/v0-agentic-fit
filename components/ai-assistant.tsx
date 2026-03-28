"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, User } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  context: {
    type: 'criterion' | 'concern' | 'question'
    title: string
    content: string
  }
}

export function AIAssistant({ isOpen, onClose, context }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && context) {
      // Add initial context message
      const initialMessage = getInitialMessage(context)
      setMessages([{ role: 'assistant', content: initialMessage }])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, context])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getInitialMessage = (ctx: AIAssistantProps['context']): string => {
    switch (ctx.type) {
      case 'criterion':
        return `I can help you understand the "${ctx.title}" criterion better. ${ctx.content}\n\nWhat would you like to know more about?`
      case 'concern':
        return `Let's discuss the "${ctx.title}" concern. ${ctx.content}\n\nHow can I help you address this?`
      case 'question':
        return `I can help you think through this question: "${ctx.title}"\n\n${ctx.content}\n\nWould you like suggestions on how to approach this?`
      default:
        return `How can I help you with "${ctx.title}"?`
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
