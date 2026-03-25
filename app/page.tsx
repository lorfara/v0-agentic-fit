"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProgressBar } from "@/components/progress-bar"
import { LoadingCard } from "@/components/loading-card"
import { QuestionCard } from "@/components/question-card"
import { VerdictBanner } from "@/components/verdict-banner"
import { ComparableItem } from "@/components/comparable-item"
import { OutputSection } from "@/components/output-section"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Info, AlertTriangle } from "lucide-react"

const questions = [
  {
    question: "Which specific type of nurse, in which specific setting — ER, ICU, primary care — and what EHR system are they using today?",
    why: "Past pattern: 2 of 3 similar ideas failed to scope the persona tightly enough, leading to scope creep in week 3.",
    placeholder: "Be as specific as you can...",
  },
  {
    question: "How will you get access to real clinical notes or EHR data for testing during a 6-week build — without running into HIPAA constraints?",
    why: "Past pattern: Data access was the #1 blocker for healthcare ideas in the last cohort. Having a plan here changes the feasibility score significantly.",
    placeholder: "Synthetic data? Anonymized examples? A partner clinic?",
  },
  {
    question: "Where exactly does your AI make a decision that a deterministic rule couldn't — and what happens if it gets that decision wrong?",
    why: "This separates agentic ideas from single-prompt ones. If you can answer this clearly, your agentic signal score improves significantly.",
    placeholder: "e.g. It decides which fields are clinically significant vs boilerplate — a rule can't do this because it varies by case type...",
  },
]

const comparables = [
  {
    id: "C1",
    name: "NurseNote AI",
    tag: "Narrow Scope",
    tagType: "narrow" as const,
    outcome: "Cohort 4 · Healthcare · Complexity 5/6",
    lesson: "Started with live EHR integration. Pivoted to synthetic data at week 2 after Epic API access took 6 weeks to approve. Shipped a working demo on synthetic data and got Strong GO on resubmission.",
  },
  {
    id: "C2",
    name: "ClinicalCopilot",
    tag: "Do Not Build",
    tagType: "no" as const,
    outcome: "Cohort 3 · Healthcare · Complexity 6/6",
    lesson: "Attempted real-time EHR writes during patient encounters. HIPAA compliance research consumed 3 of 6 weeks. Never reached a working prototype. No clear pivot path identified early enough.",
  },
  {
    id: "C3",
    name: "MedTranscribe",
    tag: "Strong GO",
    tagType: "go" as const,
    outcome: "Cohort 5 · Healthcare · Complexity 3/6",
    lesson: "Scoped to one task: extracting medication names and dosages from verbal notes. Used MIMIC-III for test data. Clear agentic loop: listen → extract → validate → flag ambiguity. Shipped in 5 weeks.",
  },
]

// Map panel to progress step
const progressMap: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 6,
}

export default function Home() {
  const [currentPanel, setCurrentPanel] = useState(1)
  const [idea, setIdea] = useState("")
  const [answers, setAnswers] = useState(["", "", ""])
  const [ideaError, setIdeaError] = useState(false)

  const currentStep = progressMap[currentPanel] || currentPanel

  const updateAnswer = (index: number, value: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }

  const goTo = (panel: number) => {
    if (panel === 2) {
      if (!idea.trim()) {
        setIdeaError(true)
        return
      }
      setIdeaError(false)
      setCurrentPanel(2)
      // After loading, show questions
      setTimeout(() => {
        setCurrentPanel(3)
        window.scrollTo(0, 0)
      }, 2400)
    } else if (panel === 4) {
      setCurrentPanel(4)
      // After loading, show verdict
      setTimeout(() => {
        setCurrentPanel(5)
        window.scrollTo(0, 0)
      }, 2800)
    } else {
      setCurrentPanel(panel)
      window.scrollTo(0, 0)
    }
  }

  // Reset error when idea changes
  useEffect(() => {
    if (ideaError && idea.trim()) {
      setIdeaError(false)
    }
  }, [idea, ideaError])

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <ProgressBar currentStep={currentStep} />

      <main className="max-w-[680px] mx-auto px-5 py-10 pb-20">
        {/* Panel 1: Idea Input */}
        {currentPanel === 1 && (
          <div className="animate-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-amber mb-2.5">
              Step 1 of 6
            </div>
            <h1 className="font-serif text-[28px] leading-tight text-ink mb-2.5 tracking-[-0.5px]">
              {"What's your project idea?"}
            </h1>
            <p className="text-[15px] text-ink-soft leading-relaxed mb-7">
              {"Give us a rough description — 2 to 3 sentences is enough. You don't need to have it figured out yet. That's what we're here for."}
            </p>

            <label className="text-[13px] font-medium text-ink-soft mb-1.5 block">
              Describe your idea
            </label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. I want to build an AI tool that helps ER nurses reduce the time they spend on documentation after each patient visit. It would listen to their verbal notes, extract the key clinical details, and auto-fill the relevant fields in their EHR system."
              className={`min-h-[110px] bg-paper-card border-[1.5px] rounded-[10px] px-4 py-3.5 text-[15px] text-ink leading-relaxed resize-y focus:ring-0 focus-visible:ring-0 placeholder:text-ink-muted/60 transition-colors ${
                ideaError ? "border-red-soft" : "border-border focus:border-amber"
              }`}
            />
            <p className="text-xs text-ink-muted mt-1.5">
              {"This is your starting point, not your final submission. Be honest about what you're thinking — vague is fine."}
            </p>

            <div className="inline-flex items-center gap-1.5 bg-paper-warm border border-border rounded-md px-2.5 py-1.5 font-mono text-[10px] text-ink-muted tracking-[0.04em] mt-5">
              <AlertTriangle className="w-3 h-3" />
              Calibrated for 6–8 week student builds, not production systems
            </div>

            <div className="flex gap-3 items-center mt-6">
              <Button
                onClick={() => goTo(2)}
                className="bg-ink text-white hover:bg-[#2d2a24] px-7 py-3 h-auto text-sm font-medium rounded-[10px] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(26,24,20,0.08)]"
              >
                Analyze my idea →
              </Button>
            </div>
          </div>
        )}

        {/* Panel 2: Loading (Retrieval) */}
        {currentPanel === 2 && (
          <div className="animate-fade-up">
            <LoadingCard
              status="Searching 200 past cohort projects"
              title="Finding similar ideas and their outcomes..."
            />
          </div>
        )}

        {/* Panel 3: Questions */}
        {currentPanel === 3 && (
          <div className="animate-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-amber mb-2.5">
              Step 3 of 6 — coaching questions
            </div>
            <h1 className="font-serif text-[28px] leading-tight text-ink mb-2.5 tracking-[-0.5px]">
              Before you go further
            </h1>
            <p className="text-[15px] text-ink-soft leading-relaxed mb-7">
              Based on similar past projects, these are the three gaps most likely to weaken your submission. Answer them honestly — the evaluator will use your answers.
            </p>

            {/* Context Badge */}
            <div className="bg-teal-light border border-[#a0d4cc] rounded-[10px] p-3 px-4 flex items-start gap-2.5 mb-6">
              <div className="w-5 h-5 bg-teal rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-[13px] text-teal leading-snug">
                <strong className="font-semibold">3 similar past projects retrieved.</strong> Two of them hit data access issues in week 4. One pivoted scope at week 2 and shipped successfully. These questions target those patterns.
              </div>
            </div>

            {questions.map((q, index) => (
              <QuestionCard
                key={index}
                number={index + 1}
                question={q.question}
                why={q.why}
                placeholder={q.placeholder}
                value={answers[index]}
                onChange={(value) => updateAnswer(index, value)}
              />
            ))}

            <div className="flex gap-3 items-center mt-6">
              <Button
                onClick={() => goTo(4)}
                className="bg-ink text-white hover:bg-[#2d2a24] px-7 py-3 h-auto text-sm font-medium rounded-[10px] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(26,24,20,0.08)]"
              >
                Submit my answers →
              </Button>
              <Button
                onClick={() => goTo(1)}
                variant="outline"
                className="border-[1.5px] border-border text-ink-soft hover:border-ink-soft hover:text-ink px-7 py-3 h-auto text-sm font-medium rounded-[10px] bg-transparent"
              >
                ← Edit idea
              </Button>
            </div>
          </div>
        )}

        {/* Panel 4: Loading (Evaluation) */}
        {currentPanel === 4 && (
          <div className="animate-fade-up">
            <LoadingCard
              status="Running full evaluation"
              title="Applying rubric to your full submission..."
            />
          </div>
        )}

        {/* Panel 5: Verdict */}
        {currentPanel === 5 && (
          <div className="animate-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-amber mb-2.5">
              Step 6 of 6 — evaluation complete
            </div>

            {/* Idea Recap */}
            <div className="bg-paper-warm border border-border rounded-[10px] p-3.5 px-4 text-sm text-ink-soft leading-relaxed mb-6 italic">
              <strong className="not-italic text-[11px] font-mono uppercase tracking-[0.06em] text-ink-muted block mb-1.5">
                Your idea
              </strong>
              <span>
                {idea || "An AI tool that helps ER nurses reduce documentation time after patient visits — listens to verbal notes, extracts clinical details, and auto-fills EHR fields."}
              </span>
            </div>

            <VerdictBanner type="narrow" title="Proceed with narrower scope" />

            {/* Rationale */}
            <OutputSection label="Rationale">
              {"This is a genuinely agentic problem — the system needs to listen, classify clinical significance, make field-mapping decisions, and handle variation across case types. The agentic signal is clear. However, the data access plan for a 6-week build is underspecified. Healthcare integrations with real EHR systems (Epic, Cerner) require months of API access negotiation. The idea is strong but needs a scoped-down MVP that sidesteps live EHR integration entirely."}
            </OutputSection>

            {/* MVP */}
            <OutputSection label="MVP suggestion — achievable in 6 weeks" variant="dark">
              Build a voice-to-structured-note tool using synthetic clinical scenarios. Skip EHR integration entirely — output a formatted JSON summary that <em>could</em> map to Epic fields, but demonstrate via a simple UI. Source test data from publicly available anonymized clinical note datasets (MIMIC-III). This proves the core AI capability — the extraction and classification logic — without the operational complexity of real EHR access.
            </OutputSection>

            {/* Comparables */}
            <OutputSection label="Similar past projects that influenced this verdict">
              {comparables.map((c, index) => (
                <ComparableItem
                  key={c.id}
                  {...c}
                  isLast={index === comparables.length - 1}
                />
              ))}
            </OutputSection>

            {/* Risk Flags */}
            <OutputSection label="Risk flags">
              <div className="flex flex-wrap gap-2 mb-2.5">
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-medium tracking-[0.04em] bg-[#fce8e6] text-red-soft">
                  {"🏥 Regulated domain"}
                </span>
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-medium tracking-[0.04em] bg-amber-light text-amber-dark">
                  {"⚠ Data access complexity"}
                </span>
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-medium tracking-[0.04em] bg-amber-light text-amber-dark">
                  {"⚠ EHR integration scope"}
                </span>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed mt-2.5">
                Healthcare projects in this cohort have a 66% rate of scope-related pivots. This is not a reason to abandon the idea — {"it's"} a reason to define the MVP boundary precisely before Week 1 starts.
              </p>
            </OutputSection>

            <div className="flex gap-3 items-center mt-6">
              <Button
                onClick={() => goTo(1)}
                className="bg-ink text-white hover:bg-[#2d2a24] px-7 py-3 h-auto text-sm font-medium rounded-[10px] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(26,24,20,0.08)]"
              >
                Evaluate another idea →
              </Button>
              <Button
                variant="outline"
                className="border-[1.5px] border-border text-ink-soft hover:border-ink-soft hover:text-ink px-7 py-3 h-auto text-sm font-medium rounded-[10px] bg-transparent"
              >
                Export as PDF
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="bg-paper-warm border border-border rounded-[10px] p-3 px-4 text-xs text-ink-muted leading-relaxed mt-6">
              {"⚠ This evaluation is calibrated for an 8-week student build, not a production deployment. The AI may hallucinate. Use this as a starting point for discussion with your instructor, not a final verdict."}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
