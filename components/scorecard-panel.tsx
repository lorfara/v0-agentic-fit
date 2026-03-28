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
    if (val === 'High') return { bg: 'var(--red-bg)', color: 'var(--red)', border: 'var(--red-border)', text: 'HIGH' }
    if (val === 'Medium') return { bg: '#fef08a', color: '#c8a300', border: '#facc15', text: 'MEDIUM' }
    if (val === 'Low') return { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-border)', text: 'LOW' }
    return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)', text: '—' }
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
        <div className="w-full text-xs text-[var(--muted)] leading-relaxed py-2 px-2.5 bg-[var(--bg)] rounded mb-2">
          {rationale}
        </div>
      )}
    </>
  )
}

export function ScorecardPanel({ projectName, scores }: ScorecardPanelProps) {
  const getOverallStyle = (risk: RiskLevel | null) => {
    if (!risk) return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)' }
    if (risk === 'Low') return { bg: 'var(--green-bg)', color: 'var(--green)', border: 'var(--green-border)' }
    if (risk === 'Medium') return { bg: '#fef08a', color: '#c8a300', border: '#facc15' }
    if (risk === 'High') return { bg: 'var(--red-bg)', color: 'var(--red)', border: 'var(--red-border)' }
    return { bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)' }
  }

  const overallStyle = getOverallStyle(scores?.buildRisk || null)

  return (
    <aside className="w-64 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-4 h-fit sticky top-20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
        <BarChart3 size={18} className="text-[var(--orange)]" />
        <h2 className="text-base font-bold text-[var(--text)]">Scorecard</h2>
      </div>

      {/* Content */}
      {!scores ? (
        <div className="text-center py-6">
          <div className="text-[var(--muted)] text-sm mb-4">No project yet</div>
          <div className="text-xs text-[var(--muted)] leading-relaxed mb-4">
            Submit your project idea to get started.
          </div>
          <div 
            className="text-[11px] font-bold py-2 px-2.5 rounded tracking-wide border"
            style={{
              background: 'var(--bg)',
              color: 'var(--muted)',
              border: '1px solid var(--border)'
            }}
          >
            —
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Scores */}
          <ScoreRow 
            label="Agentic Fit" 
            value={scores.agenticFit}
            rationale="Multi-step reasoning requires agentic architecture to break down complex tasks."
          />
          <ScoreRow 
            label="Clear Persona" 
            value={scores.persona}
            rationale="Target audience must be well-defined for AI to provide relevant solutions."
          />
          <ScoreRow 
            label="Clear Pain Point" 
            value={scores.painPoint}
            rationale="The problem statement should be specific and quantifiable."
          />
          <ScoreRow 
            label="Complexity" 
            value={scores.complexity}
            rationale="Project scope should be feasible within the 6-week timeframe."
          />
          <ScoreRow 
            label="MOAT" 
            value={scores.moat}
            rationale="Competitive advantage and unique value proposition must be clear."
          />

          {/* Build Risk */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="text-xs font-bold text-[var(--text-secondary)] mb-2 tracking-wide">6-WEEK BUILD RISK</div>
            <div 
              className="text-center py-3 px-2.5 rounded border"
              style={{
                background: overallStyle.bg,
                color: overallStyle.color,
                border: `1px solid ${overallStyle.border}`
              }}
            >
              <div className="text-sm font-bold uppercase">{scores.buildRisk || '—'}</div>
            </div>
          </div>

          {/* Score Guide */}
          <div className="text-[13px] text-[var(--muted)] leading-relaxed bg-[var(--bg)] rounded-lg p-3 mt-4">
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
      )}
    </aside>
  )
}
