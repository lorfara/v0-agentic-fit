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
    <div className="bg-paper-card border-[1.5px] border-border rounded-[16px] p-5 px-[22px] mb-4 shadow-[0_2px_12px_rgba(26,24,20,0.08)] focus-within:border-amber transition-colors">
      <div className="font-mono text-[11px] text-amber uppercase tracking-[0.08em] mb-2">
        Question {String(number).padStart(2, '0')}
      </div>
      <div className="text-[15px] font-medium text-ink leading-snug mb-3.5">
        {question}
      </div>
      <div className="text-xs text-ink-muted italic mb-3.5 pl-3 border-l-2 border-border">
        {why}
      </div>
      <label className="text-[13px] font-medium text-ink-soft mb-1.5 block">
        Your answer
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[70px] bg-paper-card border-[1.5px] border-border rounded-[10px] px-4 py-3.5 text-[15px] text-ink leading-relaxed resize-y focus:border-amber focus:ring-0 focus-visible:ring-0 placeholder:text-ink-muted/60"
      />
    </div>
  )
}
