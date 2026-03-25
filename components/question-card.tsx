"use client"

import { Textarea } from "@/components/ui/textarea"

interface QuestionCardProps {
  number: number
  question: string
  why: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export function QuestionCard({ number, question, why, placeholder, value, onChange }: QuestionCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 px-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange text-white text-sm font-semibold mb-3">
        {number}
      </div>
      <div className="text-base font-semibold text-ink leading-snug mb-3">
        {question}
      </div>
      <div className="text-sm text-ink-muted mb-4 pl-4 border-l-2 border-orange-light">
        {why}
      </div>
      <label className="text-sm font-medium text-ink-soft mb-2 block">
        Your answer
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] bg-surface-muted border-0 rounded-xl px-4 py-3 text-base text-ink leading-relaxed resize-y focus:ring-2 focus:ring-orange/20 focus-visible:ring-orange/20 placeholder:text-ink-muted/60"
      />
    </div>
  )
}
