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
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FF6B00] text-white text-xs font-bold mb-3">
        {number}
      </div>
      <div className="text-base font-semibold text-[#161616] leading-snug mb-3">
        {question}
      </div>
      <div className="text-sm text-[#8a8a8a] mb-4 pl-4 border-l-2 border-[#FFF0E6]">
        {why}
      </div>
      <label className="text-sm font-medium text-[#4a4a4a] mb-2 block">
        Your answer
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] bg-[#f5f5f5] border-0 rounded-xl px-4 py-3 text-base text-[#161616] leading-relaxed resize-y focus:ring-2 focus:ring-[#FF6B00]/20 placeholder:text-[#8a8a8a]/70"
      />
    </div>
  )
}
