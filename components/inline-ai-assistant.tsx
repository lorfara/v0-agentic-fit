"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface InlineAIAssistantProps {
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
