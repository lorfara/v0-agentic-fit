"use client"

import { BarChart3 } from "lucide-react"
import type { Scores, RiskLevel } from "@/lib/types"

interface ScorecardPanelProps {
  projectName: string
  scores: Scores | null
}

function getBadgeStyle(val: RiskLevel) {
  if (val === "High") return { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" }
  if (val === "Medium") return { bg: "#fef9c3", color: "#a16207", border: "#fde047" }
  return { bg: "#dcfce7", color: "#16a34a", border: "#86efac" }
}

function getOverallStyle(risk: RiskLevel) {
  if (risk === "High") return { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" }
  if (risk === "Medium") return { bg: "#fef9c3", color: "#a16207", border: "#fde047" }
  return { bg: "#dcfce7", color: "#16a34a", border: "#86efac" }
}

const SCORE_ROWS = [
  { key: "agenticFit" as keyof Scores, label: "Agentic Fit" },
  { key: "persona" as keyof Scores, label: "Clear Persona" },
  { key: "painPoint" as keyof Scores, label: "Clear Pain Point" },
  { key: "complexity" as keyof Scores, label: "Complexity" },
  { key: "moat" as keyof Scores, label: "MOAT" },
]

export function ScorecardPanel({ projectName, scores }: ScorecardPanelProps) {
  return (
    <aside className="sticky top-20 w-full bg-white rounded-xl border border-[var(--border)] overflow-hidden" style={{ boxShadow: "var(--shadow)" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--dark)] text-white">
        <BarChart3 size={16} className="text-[var(--orange)]" />
        <h2 className="text-sm font-bold tracking-wide">Scorecard</h2>
      </div>

      <div className="p-4">
        {/* Project name */}
        {scores && projectName && (
          <div className="text-sm font-semibold text-[var(--text)] mb-3">{projectName}</div>
        )}

        {/* Build risk box */}
        {scores ? (
          <div
            className="rounded-lg p-3 mb-4 text-center border"
            style={(() => {
              const s = getOverallStyle(scores.buildRisk)
              return { background: s.bg, borderColor: s.border }
            })()}
          >
            <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-1">6-Week Build Risk</div>
            <div
              className="text-xl font-black"
              style={{ color: getOverallStyle(scores.buildRisk).color }}
            >
              {scores.buildRisk}
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-3 mb-4 text-center border border-[var(--border)] bg-[var(--bg)]">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-1">6-Week Build Risk</div>
            <div className="text-xl font-black text-[var(--muted)]">—</div>
          </div>
        )}

        {/* Score rows */}
        <div className="space-y-2 mb-4">
          {SCORE_ROWS.map(({ key, label }) => {
            const val = scores?.[key] as RiskLevel | undefined
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
                {val ? (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide"
                    style={(() => {
                      const s = getBadgeStyle(val)
                      return { background: s.bg, color: s.color, borderColor: s.border }
                    })()}
                  >
                    {val.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[var(--muted)] text-sm">—</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Score guide */}
        <div className="border-t border-[var(--border)] pt-3 text-[12px] text-[var(--muted)]">
          <div className="font-semibold text-[var(--text-secondary)] mb-2">Score guide:</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#16a34a" }}></span>
              <span>Low = Strong</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#eab308" }}></span>
              <span>Medium = Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#dc2626" }}></span>
              <span>High = Address</span>
            </div>
          </div>

          <div className="font-semibold text-[var(--text-secondary)] mt-3 mb-2">6-Week Build Risk:</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#16a34a" }}></span>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#eab308" }}></span>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#dc2626" }}></span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
