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
import { AlertTriangle, ArrowRight, ArrowLeft, FileDown, Sparkles, Info } from "lucide-react"
import { AnalysisResult, type AnalysisData } from "@/components/analysis-result"

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

const progressMap: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 6,
}

// Maps progress step id → panel number (only for navigable steps)
const stepToPanel: Record<number, number> = {
  1: 1,
  3: 3,
  4: 3,
  6: 5,
}

export default function Home() {
  const [currentPanel, setCurrentPanel] = useState(1)
  const [idea, setIdea] = useState("")
  const [answers, setAnswers] = useState(["", "", ""])
  const [ideaError, setIdeaError] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const currentStep = progressMap[currentPanel] || currentPanel

  const updateAnswer = (index: number, value: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }

  const handleStepClick = (stepId: number) => {
    const panel = stepToPanel[stepId]
    if (panel !== undefined) {
      setCurrentPanel(panel)
      window.scrollTo(0, 0)
    }
  }

  const goTo = async (panel: number) => {
    if (panel === 2) {
      if (!idea.trim()) {
        setIdeaError(true)
        return
      }
      setIdeaError(false)
      setCurrentPanel(2)
      setIsAnalyzing(true)
      setAnalysisError(null)

      // Send idea to webhook via API route and wait for response
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectDescription: idea }),
        })

        const data = await response.json()

        if (!response.ok || data?.error) {
          throw new Error(data?.error || "Failed to analyze idea")
        }

        setAnalysisResult(data as AnalysisData)
      } catch (error) {
        console.error("Failed to send to webhook:", error)
        setAnalysisError("Failed to analyze your idea. Please try again.")
      } finally {
        setIsAnalyzing(false)
        setCurrentPanel(3)
        window.scrollTo(0, 0)
      }
    } else if (panel === 4) {
      setCurrentPanel(4)
      setTimeout(() => {
        setCurrentPanel(5)
        window.scrollTo(0, 0)
      }, 2800)
    } else {
      setCurrentPanel(panel)
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    if (ideaError && idea.trim()) {
      setIdeaError(false)
    }
  }, [idea, ideaError])

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

      <main className="max-w-[680px] mx-auto px-4 py-8 pb-16">
        {/* Panel 1: Idea Input */}
        {currentPanel === 1 && (
          <div className="animate-fade-up">
            <h1 className="text-3xl md:text-[40px] font-bold text-[#161616] mb-2 tracking-tight leading-tight">
              {"What's your project idea"}<span className="text-[#FF6B00]">.</span>
            </h1>
            <p className="text-base text-[#4a4a4a] leading-relaxed mb-6">
              {"Give us a rough description — 2 to 3 sentences is enough. Inclue a Project Description, Target Persona and your MOAT.  \n"}
            </p>

            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 shadow-sm mb-5">
              <label className="text-sm font-semibold text-[#161616] mb-2 block">
                Describe your idea
              </label>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. I want to build an AI tool that helps ER nurses reduce the time they spend on documentation after each patient visit..."
                className={`min-h-[120px] bg-[#f5f5f5] border-0 rounded-xl px-4 py-3 text-base text-[#161616] leading-relaxed resize-y focus:ring-2 placeholder:text-[#8a8a8a]/70 ${
                  ideaError ? "ring-2 ring-[#DE350B]/50" : "focus:ring-[#FF6B00]/20"
                }`}
              />
              <p className="text-sm text-[#8a8a8a] mt-3">
                {"This is your starting point, not your final submission."}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#FFF7E6] border border-[#FF991F]/20 rounded-full px-4 py-2 text-sm text-[#4a4a4a] mb-6">
              <AlertTriangle className="w-4 h-4 text-[#FF991F]" />
              <span>Calibrated for 6-8 week student builds</span>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => goTo(2)}
                className="bg-[#FF6B00] hover:bg-[#E55D00] text-white px-6 py-2.5 h-auto text-sm font-semibold rounded-full transition-all flex items-center gap-2"
              >
                Analyze my idea
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Panel 2: Loading */}
        {currentPanel === 2 && (
          <div className="animate-fade-up">
            <LoadingCard
              status="Searching 200 past cohort projects"
              title="Finding similar ideas..."
            />
          </div>
        )}

        {/* Panel 3: Questions */}
        {currentPanel === 3 && (
          <div className="animate-fade-up">
            <h1 className="text-3xl md:text-[40px] font-bold text-[#161616] mb-2 tracking-tight leading-tight">
              Before you go further<span className="text-[#FF6B00]">.</span>
            </h1>
            <p className="text-base text-[#4a4a4a] leading-relaxed mb-6">
              Based on similar past projects, answer these questions honestly.
            </p>

            {/* Analysis Result Display */}
            {analysisError && (
              <div className="bg-[#FFEBE6] border border-[#DE350B]/20 rounded-2xl p-4 flex items-start gap-3 mb-5">
                <div className="w-8 h-8 bg-[#DE350B] rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm text-[#161616] leading-relaxed">
                  <strong className="font-semibold text-[#DE350B]">Analysis failed.</strong>{" "}
                  {analysisError}
                </div>
              </div>
            )}

            {analysisResult && !analysisError && (
              <AnalysisResult data={analysisResult} />
            )}

            <div className="bg-[#E3F5ED] border border-[#00875A]/20 rounded-2xl p-4 flex items-start gap-3 mb-5">
              <div className="w-8 h-8 bg-[#00875A] rounded-full flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm text-[#161616] leading-relaxed">
                <strong className="font-semibold text-[#00875A]">3 similar past projects retrieved.</strong>{" "}
                Two hit data access issues in week 4. These questions target those patterns.
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

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => goTo(4)}
                className="bg-[#FF6B00] hover:bg-[#E55D00] text-white px-6 py-2.5 h-auto text-sm font-semibold rounded-full transition-all flex items-center gap-2"
              >
                Submit my answers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Panel 4: Loading */}
        {currentPanel === 4 && (
          <div className="animate-fade-up">
            <LoadingCard
              status="Running full evaluation"
              title="Applying rubric to your submission..."
            />
          </div>
        )}

        {/* Panel 5: Verdict */}
        {currentPanel === 5 && (
          <div className="animate-fade-up">
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-4 text-sm text-[#4a4a4a] leading-relaxed mb-5">
              <div className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider mb-1">
                Your idea
              </div>
              <p className="italic">
                {idea || "An AI tool that helps ER nurses reduce documentation time after patient visits."}
              </p>
            </div>

            <VerdictBanner type="narrow" title="Proceed with narrower scope" />

            <OutputSection label="Rationale">
              {"This is a genuinely agentic problem — the system needs to listen, classify clinical significance, make field-mapping decisions, and handle variation across case types. However, the data access plan for a 6-week build is underspecified. Healthcare integrations with real EHR systems require months of API access negotiation."}
            </OutputSection>

            <OutputSection label="MVP suggestion — achievable in 6 weeks" variant="dark">
              Build a voice-to-structured-note tool using synthetic clinical scenarios. Skip EHR integration entirely — output a formatted JSON summary that <em className="text-[#FF6B00] not-italic font-medium">could</em> map to Epic fields, but demonstrate via a simple UI.
            </OutputSection>

            <OutputSection label="Similar past projects">
              {comparables.map((c, index) => (
                <ComparableItem
                  key={c.id}
                  {...c}
                  isLast={index === comparables.length - 1}
                />
              ))}
            </OutputSection>

            <OutputSection label="Risk flags">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFEBE6] text-[#DE350B]">
                  Regulated domain
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7E6] text-[#FF991F]">
                  Data access complexity
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7E6] text-[#FF991F]">
                  EHR integration scope
                </span>
              </div>
              <p className="text-[15px] text-[#4a4a4a] leading-relaxed mt-3">
                Healthcare projects have a 66% rate of scope-related pivots.
              </p>
            </OutputSection>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={() => goTo(1)}
                className="bg-[#FF6B00] hover:bg-[#E55D00] text-white px-6 py-2.5 h-auto text-sm font-semibold rounded-full transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Evaluate another idea
              </Button>
              <Button
                variant="outline"
                className="border border-[#e5e5e5] text-[#161616] hover:bg-[#f5f5f5] px-5 py-2.5 h-auto text-sm font-semibold rounded-full bg-white flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export as PDF
              </Button>
            </div>

            <div className="bg-[#FFF7E6] border border-[#FF991F]/20 rounded-2xl p-4 text-sm text-[#4a4a4a] leading-relaxed mt-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF991F] shrink-0 mt-0.5" />
              <span>
                This evaluation is calibrated for an 8-week student build, not a production deployment.
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
