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

  const getBadgeStyle = (val: RiskLevel | null) => {
    if (!val) return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)', text: '—' }
    switch (val) {
      case 'High': 
        return { bg: 'var(--red-bg)', color: 'var(--red)', border: 'var(--red-border)', text: 'HIGH' }
      case 'Medium': 
        return { bg: '#fef08a', color: '#c8a300', border: '#facc15', text: 'MEDIUM' }
      case 'Low': 
        return { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-border)', text: 'LOW' }
      default: 
        return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)', text: '—' }
    }
  }

  const style = getBadgeStyle(value)

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
        {value ? (
          <span 
            className="text-[11px] font-bold py-1 px-2.5 rounded-full tracking-wide uppercase"
            style={{ 
              background: style.bg, 
              color: style.color,
              border: `1px solid ${style.border}`
            }}
          >
            {style.text}
          </span>
        ) : (
          <span 
            className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--muted)]"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            &mdash;
          </span>
        )}
      </div>
      {isOpen && (
        <div className="w-full text-xs text-[var(--muted)] leading-relaxed py-2 px-2.5 bg-[var(--bg)] rounded-md border-l-2 border-[var(--border)] mt-0.5 mb-3">
          {rationale}
        </div>
      )}
    </>
  )
}

export function ScorecardPanel({ projectName, scores }: ScorecardPanelProps) {
  const getOverallStyle = (risk: RiskLevel | null) => {
    if (!risk) return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)' }
    switch (risk) {
      case 'Low': return { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-border)' }
      case 'Medium': return { bg: '#fef08a', color: '#c8a300', border: '#facc15' }
      case 'High': return { bg: 'var(--red-bg)', color: 'var(--red)', border: 'var(--red-border)' }
      default: return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)' }
    }
  }

  const overallStyle = getOverallStyle(scores?.buildRisk || null)

  const rationales = {
    agenticFit: "RAG retrieval + multi-step scoring + iterative coaching loop = genuine agentic pipeline. Each step feeds the next. Cannot be done in a single prompt.",
    persona: "Bootcamp students with a 6-week build constraint and a job-search motivation. Tight and specific \u2014 every major agentic bootcamp produces this exact student.",
    painPoint: "Instructor feedback is slow, generic, and arrives too late. AgenticFit moves expert-level validation to week 1, when it can still change the outcome.",
    complexity: "RAG + scoring + coaching loop is buildable in 6 weeks if scope is locked to one output schema. Risk is trying to ship the build plan generator simultaneously.",
    moat: "Thin at launch, compounding over time. Real lock-in comes from instructor adoption \u2014 once their evaluation framework is embedded, the tool becomes proprietary to their course."
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
            className="text-center p-4 rounded-[10px] mb-[18px]"
            style={{ 
              background: overallStyle.bg, 
              border: `2px solid ${overallStyle.border}` 
            }}
          >
            <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1.5">
              6-Week Build Risk
            </div>
            <div 
              className="font-display text-xl font-black"
              style={{ color: overallStyle.color }}
            >
              {scores?.buildRisk || '\u2014'}
            </div>
          </div>

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

          <div className="h-px bg-[var(--border)] my-4" />

          {/* Score Guide */}
          <div className="text-[13px] text-[var(--muted)] leading-relaxed bg-[var(--bg)] rounded-lg p-3">
            <div className="font-semibold text-[var(--text-secondary)] mb-2.5">Score guide:</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] flex-shrink-0"></span>
                <span>Low = Strong</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: '#eab308'}}></span>
                <span>Medium = Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--red)] flex-shrink-0"></span>
                <span>High = Address</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <div className="font-semibold text-[var(--text-secondary)] mb-2.5">6-Week Build Risk:</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)] flex-shrink-0"></span>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: '#eab308'}}></span>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--red)] flex-shrink-0"></span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
