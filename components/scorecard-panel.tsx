"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Scores, RiskLevel } from "@/lib/types"
import { BarChart3 } from "lucide-react"

interface ScorecardPanelProps {
  projectName: string
  scores: Scores | null
}

interface ScoreRowProps {
  label: string
  value: RiskLevel | null
  rationale: string
}

function ScoreRow({ label, value, rationale }: ScoreRowProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getBadgeClass = (val: RiskLevel | null) => {
    if (!val) return "badge-empty"
    switch (val) {
      case 'High': return "badge-high"
      case 'Medium': return "badge-medium"
      case 'Low': return "badge-low"
      default: return "badge-empty"
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1">
        <span 
          className={cn(
            "text-sm font-semibold text-[var(--text-secondary)] cursor-pointer flex items-center gap-1.5 hover:text-[var(--orange)]",
            isOpen && "text-[var(--orange)]"
          )}
          onClick={() => setIsOpen(!isOpen)}
          title="Click for rationale"
        >
          {label}
          <span 
            className={cn(
              "text-sm text-[var(--muted)] transition-transform inline-block",
              isOpen && "rotate-90"
            )}
          >
            &rsaquo;
          </span>
        </span>
        <span 
          className={cn(
            "text-xs font-bold py-1 px-3 rounded-[20px] tracking-wide uppercase border",
            getBadgeClass(value)
          )}
        >
          {value || '—'}
        </span>
      </div>
      {isOpen && (
        <div className="w-full text-xs text-[var(--muted)] leading-relaxed py-2 px-2.5 bg-[var(--bg)] rounded-md border-l-2 border-[var(--border)] mt-0.5 mb-1">
          {rationale}
        </div>
      )}
    </>
  )
}

export function ScorecardPanel({ projectName, scores }: ScorecardPanelProps) {
  const getOverallClass = (risk: RiskLevel | null) => {
    if (!risk) return ""
    switch (risk) {
      case 'Low': return "excellent"
      case 'Medium': return "needs-work"
      case 'High': return "not-ready"
      default: return ""
    }
  }

  const getOverallValueColor = (risk: RiskLevel | null) => {
    if (!risk) return "var(--muted)"
    switch (risk) {
      case 'Low': return "var(--green)"
      case 'Medium': return "var(--yellow)"
      case 'High': return "var(--red)"
      default: return "var(--muted)"
    }
  }

  const rationales = {
    agenticFit: "RAG retrieval + multi-step scoring + iterative coaching loop = genuine agentic pipeline. Each step feeds the next. Cannot be done in a single prompt.",
    persona: "Bootcamp students with a 6-week build constraint and a job-search motivation. Tight and specific — every major agentic bootcamp produces this exact student.",
    painPoint: "Instructor feedback is slow, generic, and arrives too late. AgenticFit moves expert-level validation to week 1, when it can still change the outcome.",
    complexity: "RAG + scoring + coaching loop is buildable in 6 weeks if scope is locked to one output schema. Risk is trying to ship the build plan generator simultaneously.",
    moat: "Thin at launch, compounding over time. Real lock-in comes from instructor adoption — once their evaluation framework is embedded, the tool becomes proprietary to their course."
  }

  return (
    <div className="sticky top-20" role="complementary" aria-label="Your current scores">
      <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
        {/* Header */}
        <div className="bg-[var(--navy)] py-[18px] px-5 flex items-center gap-2.5">
          <BarChart3 className="w-[18px] h-[18px] text-[var(--orange-mid)]" />
          <h3 className="font-display text-base font-extrabold text-white">Scorecard</h3>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Project Name */}
          <div 
            className={cn(
              "text-[15px] font-bold text-[var(--text)] mb-4 pb-3.5 border-b border-[var(--border)] min-h-[22px]",
              !projectName && "text-[var(--muted)] italic font-normal"
            )}
          >
            {projectName || "No project yet"}
          </div>

          {/* Overall Risk Box */}
          <div 
            className={cn(
              "text-center p-4 rounded-[10px] mb-[18px] border-2 border-[var(--border)] bg-[var(--bg)] overall-box",
              getOverallClass(scores?.buildRisk || null)
            )}
          >
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5">
              6-Week Build Risk
            </div>
            <div 
              className="font-display text-xl font-black"
              style={{ color: getOverallValueColor(scores?.buildRisk || null) }}
            >
              {scores?.buildRisk || '—'}
            </div>
          </div>

          <div className="h-px bg-[var(--border)] my-[18px]" />

          {/* Score Rows */}
          <ScoreRow 
            label="Agentic Fit" 
            value={scores?.agenticFit || null} 
            rationale={rationales.agenticFit}
          />
          <ScoreRow 
            label="Clear Persona" 
            value={scores?.persona || null} 
            rationale={rationales.persona}
          />
          <ScoreRow 
            label="Clear Pain Point" 
            value={scores?.painPoint || null} 
            rationale={rationales.painPoint}
          />
          <ScoreRow 
            label="Complexity" 
            value={scores?.complexity || null} 
            rationale={rationales.complexity}
          />
          <ScoreRow 
            label="MOAT" 
            value={scores?.moat || null} 
            rationale={rationales.moat}
          />

          <div className="h-px bg-[var(--border)] my-[18px]" />

          {/* Hint */}
          <div className="text-[13px] text-[var(--muted)] leading-relaxed bg-[var(--bg)] rounded-lg p-3 mt-1">
            <strong className="text-[var(--text-secondary)]">Score guide:</strong><br />
            <span className="text-[var(--green)]">Low</span> = Strong &nbsp;&middot;&nbsp; 
            <span className="text-[var(--yellow)]">Medium</span> = Review &nbsp;&middot;&nbsp; 
            <span className="text-[var(--red)]">High</span> = Address
          </div>
        </div>
      </div>
    </div>
  )
}
