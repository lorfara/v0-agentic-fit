import { cn } from "@/lib/utils"
import { Check, Zap, X, AlertTriangle, HelpCircle } from "lucide-react"

// --- Types ---

type OverallScore = "HIGH" | "MEDIUM" | "LOW"
type Verdict = "Strong fit" | "Partial fit" | "Weak fit"
type Source = "Instructor Pattern" | "Industry Pattern"
type Severity = "Critical" | "Significant" | "Moderate"

interface Criterion {
  name: string
  verdict: Verdict
  reasoning: string
}

interface AgenticFit {
  overall_score: OverallScore
  justification: string
  criteria: Criterion[]
}

interface IndustryConcern {
  rank: number
  label: string
  source: Source
  explanation: string
  severity: Severity
}

interface ClarifyingQuestion {
  question_number: number
  linked_concern: string
  question: string
}

export interface AnalysisData {
  agentic_fit: AgenticFit
  industry_concerns: IndustryConcern[]
  clarifying_questions: ClarifyingQuestion[]
}

// --- Helpers ---

const scoreConfig: Record<OverallScore, { label: string; bg: string; border: string; iconBg: string; textColor: string; Icon: typeof Check }> = {
  HIGH: {
    label: "Strong Agentic Fit",
    bg: "bg-[#E3F5ED]",
    border: "border-[#00875A]/20",
    iconBg: "bg-[#00875A]",
    textColor: "text-[#00875A]",
    Icon: Check,
  },
  MEDIUM: {
    label: "Partial Agentic Fit",
    bg: "bg-[#FFF0E6]",
    border: "border-[#FF6B00]/20",
    iconBg: "bg-[#FF6B00]",
    textColor: "text-[#FF6B00]",
    Icon: Zap,
  },
  LOW: {
    label: "Weak Agentic Fit",
    bg: "bg-[#FFEBE6]",
    border: "border-[#DE350B]/20",
    iconBg: "bg-[#DE350B]",
    textColor: "text-[#DE350B]",
    Icon: X,
  },
}

const verdictConfig: Record<Verdict, { dot: string; text: string }> = {
  "Strong fit": { dot: "bg-[#00875A]", text: "text-[#00875A]" },
  "Partial fit": { dot: "bg-[#FF6B00]", text: "text-[#FF6B00]" },
  "Weak fit": { dot: "bg-[#DE350B]", text: "text-[#DE350B]" },
}

const severityConfig: Record<Severity, { bg: string; text: string }> = {
  Critical: { bg: "bg-[#FFEBE6]", text: "text-[#DE350B]" },
  Significant: { bg: "bg-[#FFF7E6]", text: "text-[#FF991F]" },
  Moderate: { bg: "bg-[#F5F5F5]", text: "text-[#4a4a4a]" },
}

const sourceConfig: Record<Source, { bg: string; text: string }> = {
  "Instructor Pattern": { bg: "bg-[#EEF2FF]", text: "text-[#4338CA]" },
  "Industry Pattern": { bg: "bg-[#F5F5F5]", text: "text-[#4a4a4a]" },
}

// --- Sub-components ---

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wider text-[#8a8a8a] mb-3">
      {children}
    </div>
  )
}

function AgenticFitSection({ data }: { data: AgenticFit }) {
  const cfg = scoreConfig[data.overall_score]
  const IconComponent = cfg.Icon

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 mb-4">
      <SectionLabel>Agentic Fit</SectionLabel>

      {/* Overall score banner */}
      <div className={cn("rounded-xl p-4 flex items-center gap-4 border mb-4", cfg.bg, cfg.border)}>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white", cfg.iconBg)}>
          <IconComponent className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <div className={cn("text-xs font-semibold uppercase tracking-wider mb-0.5", cfg.textColor)}>
            {data.overall_score} — {cfg.label}
          </div>
          <p className="text-sm text-[#4a4a4a] leading-relaxed">{data.justification}</p>
        </div>
      </div>

      {/* Criteria */}
      <div className="space-y-3">
        {data.criteria.map((criterion, i) => {
          const vc = verdictConfig[criterion.verdict]
          return (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-[#f0f0f0] last:border-0 last:pb-0">
              <div className="mt-1.5 shrink-0">
                <div className={cn("w-2 h-2 rounded-full", vc.dot)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-[#161616]">{criterion.name}</span>
                  <span className={cn("text-xs font-semibold", vc.text)}>{criterion.verdict}</span>
                </div>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{criterion.reasoning}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function IndustryConcernsSection({ concerns }: { concerns: IndustryConcern[] }) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 mb-4">
      <SectionLabel>Industry Concerns</SectionLabel>
      <div className="space-y-4">
        {concerns.map((concern) => {
          const sev = severityConfig[concern.severity]
          const src = sourceConfig[concern.source]
          return (
            <div key={concern.rank} className="flex gap-4 py-4 border-b border-[#f0f0f0] last:border-0 last:pb-0 first:pt-0">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-xs text-[#8a8a8a] font-bold">
                {concern.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-sm font-semibold text-[#161616]">{concern.label}</span>
                  <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold", sev.bg, sev.text)}>
                    {concern.severity}
                  </span>
                  <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold", src.bg, src.text)}>
                    {concern.source}
                  </span>
                </div>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{concern.explanation}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ClarifyingQuestionsSection({ questions }: { questions: ClarifyingQuestion[] }) {
  return (
    <div className="bg-[#161616] rounded-2xl p-5 mb-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
        Clarifying Questions
      </div>
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.question_number} className="flex gap-4 py-4 border-b border-white/10 last:border-0 last:pb-0 first:pt-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white/60" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-[#FF6B00] mb-1">
                Linked to: {q.linked_concern}
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{q.question}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main Export ---

export function AnalysisResult({ data }: { data: AnalysisData }) {
  return (
    <div>
      <AgenticFitSection data={data.agentic_fit} />
      <IndustryConcernsSection concerns={data.industry_concerns} />
      <ClarifyingQuestionsSection questions={data.clarifying_questions} />
    </div>
  )
}
