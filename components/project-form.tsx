"use client"

import { Zap, ArrowRight } from "lucide-react"
import type { ProjectFormData } from "@/lib/types"

interface ProjectFormProps {
  data: ProjectFormData
  onChange: (data: ProjectFormData) => void
  onSubmit: () => void
  isLoading?: boolean
}

export function ProjectForm({ data, onChange, onSubmit, isLoading }: ProjectFormProps) {
  const updateField = (field: keyof ProjectFormData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
      {/* Header */}
      <div className="py-5 px-6 border-b border-[var(--border)] flex items-center gap-3.5">
        <div 
          className="w-10 h-10 rounded-[10px] bg-[var(--orange-light)] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <Zap className="w-5 h-5 text-[var(--orange)]" />
        </div>
        <div>
          <div className="font-display text-lg font-extrabold text-[var(--text)]">
            Submit Your Idea
          </div>
          <div className="text-sm text-[var(--muted)] mt-0.5">
            All fields are optional — fill in as much as you know
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="f-name">
              Project Name
            </label>
            <span className="text-[13px] text-[var(--muted)]">
              What are you calling it?
            </span>
            <input
              id="f-name"
              type="text"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. AgenticFit Coach"
              className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal form-input placeholder:text-[#9ca3af]"
            />
          </div>

          {/* Target Persona */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="f-persona">
              Target Persona
            </label>
            <span className="text-[13px] text-[var(--muted)]">
              Who is this for?
            </span>
            <input
              id="f-persona"
              type="text"
              value={data.persona}
              onChange={(e) => updateField('persona', e.target.value)}
              placeholder="e.g. Job-seeking bootcamp students"
              className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal form-input placeholder:text-[#9ca3af]"
            />
          </div>

          {/* What does it do */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="f-what">
              What does it do — and why does it matter?
            </label>
            <span className="text-[13px] text-[var(--muted)]">
              Describe the problem and your solution
            </span>
            <textarea
              id="f-what"
              value={data.what}
              onChange={(e) => updateField('what', e.target.value)}
              placeholder="e.g. Helps students evaluate capstone ideas before investing weeks of build time..."
              className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
            />
          </div>

          {/* Why is it Agentic */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="f-agentic">
              Why is it Agentic?
            </label>
            <span className="text-[13px] text-[var(--muted)]">
              What multi-step reasoning does it perform?
            </span>
            <textarea
              id="f-agentic"
              value={data.agentic}
              onChange={(e) => updateField('agentic', e.target.value)}
              placeholder="e.g. Searches vector store of past projects, applies scoring framework, iterates on feedback loops..."
              className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
            />
          </div>

          {/* MOAT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[15px] font-bold text-[var(--text)]" htmlFor="f-moat">
              MOAT
            </label>
            <span className="text-[13px] text-[var(--muted)]">
              What makes this hard to copy?
            </span>
            <textarea
              id="f-moat"
              value={data.moat}
              onChange={(e) => updateField('moat', e.target.value)}
              placeholder="e.g. Built on cohort-specific project history — not generic AI advice..."
              className="py-3 px-4 border-2 border-[var(--border)] rounded-[var(--radius-sm)] font-sans text-base text-[var(--text)] bg-white transition-all outline-none leading-normal resize-y min-h-[90px] form-textarea placeholder:text-[#9ca3af]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-[var(--muted)]">
            Fields are optional — fill in as much as you know
          </span>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[var(--radius-sm)] font-display text-base font-extrabold cursor-pointer border-2 border-transparent transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)] hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
            style={{ boxShadow: isLoading ? 'none' : '0 4px 14px rgba(232,93,0,0.35)' }}
          >
            <Zap className="w-[17px] h-[17px]" />
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
