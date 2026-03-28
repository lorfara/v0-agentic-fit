"use client"

import { Lock, PartyPopper } from "lucide-react"
import { ScorecardPanel } from "@/components/scorecard-panel"
import type { Scores } from "@/lib/types"

interface BuildWeek {
  week: number
  title: string
  detail: string
  tags: string[]
}

interface BuildPlanPageProps {
  isLocked: boolean
  projectName: string
  scores: Scores | null
  buildPlan: BuildWeek[]
}

const DEFAULT_BUILD_PLAN: BuildWeek[] = [
  {
    week: 1,
    title: 'Foundation & Data Setup',
    detail: 'Set up the project structure, configure the database, and build the data ingestion pipeline. Focus on getting sample data flowing through the system.',
    tags: ['Next.js', 'Supabase', 'Data Pipeline'],
  },
  {
    week: 2,
    title: 'Core AI Integration',
    detail: 'Implement the RAG retrieval system and connect to your LLM provider. Build the basic scoring logic that evaluates submissions.',
    tags: ['RAG', 'OpenAI', 'Vector Store'],
  },
  {
    week: 3,
    title: 'Evaluation UI',
    detail: 'Build the submission form and results display. Focus on a clean, functional interface that shows scores and recommendations.',
    tags: ['React', 'Forms', 'UI Components'],
  },
  {
    week: 4,
    title: 'Coaching Flow',
    detail: 'Implement the iterative coaching loop. Allow users to refine their submissions based on feedback and re-evaluate.',
    tags: ['State Management', 'Iteration Loop'],
  },
  {
    week: 5,
    title: 'Polish & Testing',
    detail: 'Add error handling, loading states, and edge cases. Test with real user scenarios and fix any bugs.',
    tags: ['Testing', 'Error Handling', 'UX Polish'],
  },
  {
    week: 6,
    title: 'Demo Prep & Launch',
    detail: 'Finalize the demo flow, prepare documentation, and deploy to production. Practice your demo presentation.',
    tags: ['Deployment', 'Documentation', 'Demo Prep'],
  },
]

export function BuildPlanPage({
  isLocked,
  projectName,
  scores,
  buildPlan = DEFAULT_BUILD_PLAN,
}: BuildPlanPageProps) {
  return (
    <div className="page-inner max-w-[1280px] mx-auto py-7 px-6 pb-[60px]">
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight mb-1.5">
          Your Personalized 6-Week Build Plan
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Week-by-week roadmap aligned to the class curriculum — what to build first, what to save for later, and what to cut for your MVP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div>
          {isLocked ? (
            <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
              <div className="p-6">
                <div className="text-center py-10 px-6 text-[var(--muted)] text-base">
                  <div className="text-[40px] mb-3">
                    <Lock className="w-10 h-10 mx-auto text-[var(--muted)]" />
                  </div>
                  <strong className="block text-lg font-bold text-[var(--text-secondary)] mb-2">
                    Define your MVP first
                  </strong>
                  A scoped MVP is required before we can generate your build plan.
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Build Weeks */}
              <div className="space-y-3 mb-5">
                {buildPlan.map((week) => (
                  <div 
                    key={week.week}
                    className="bg-[var(--bg)] rounded-[10px] p-[18px_22px] flex gap-[18px] items-start border-2 border-transparent transition-all hover:border-[var(--orange)] hover:bg-[var(--orange-light)]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--orange)] text-white font-display text-[15px] font-black flex items-center justify-center shrink-0">
                      {week.week}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-[var(--text)] mb-1.5">
                        {week.title}
                      </div>
                      <div className="text-sm text-[var(--muted)] leading-relaxed mb-2.5">
                        {week.detail}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {week.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="text-xs font-semibold py-0.5 px-2.5 rounded bg-[var(--orange-light)] text-[var(--orange-hover)] border border-[#ffc49a]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success Banner */}
              <div 
                className="rounded-[10px] p-5 text-center"
                style={{ 
                  background: 'var(--green-bg)', 
                  border: '2px solid var(--green-border)' 
                }}
              >
                <div className="font-display text-[22px] font-black text-[var(--green)] mb-1.5 flex items-center justify-center gap-2">
                  <PartyPopper className="w-6 h-6" />
                  You&apos;re ready to build!
                </div>
                <p className="text-[15px] text-[var(--green)]">
                  Your plan is locked in. Show up to each class knowing exactly what to build.
                </p>
              </div>
            </div>
          )}
        </div>

        <ScorecardPanel
          projectName={projectName}
          scores={scores}
        />
      </div>
    </div>
  )
}
