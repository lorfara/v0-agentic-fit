"use client"

import { useState, useCallback } from "react"
import { Navigation } from "@/components/navigation"
import { EvaluatePage } from "@/components/pages/evaluate-page"
import { CoachPage } from "@/components/pages/coach-page"
import { InstructorPage } from "@/components/pages/instructor-page"
import { MvpPage } from "@/components/pages/mvp-page"
import { BuildPlanPage } from "@/components/pages/buildplan-page"
import { AppToast } from "@/components/app-toast"
import type { Page, Role, NavStep, ProjectFormData, EvaluationResponse, Scores, RiskLevel } from "@/lib/types"

// Mock evaluation response
const MOCK_EVALUATION_RESPONSE: EvaluationResponse = {
  agentic_fit: {
    overall_score: "MEDIUM",
    justification: "The project has a clear agentic use case in content synthesis and structured output generation. However, the multi-source ingestion layer and persistent memory add significant architectural complexity that may be difficult to demo reliably in 6 weeks. A focused MVP on single-source ingestion would score HIGH.",
    criteria: [
      { name: "Multi-step reasoning", verdict: "Strong fit", reasoning: "Document ingestion -> synthesis -> structured output is a clear multi-step agentic pipeline." },
      { name: "Tool use / external integrations", verdict: "Partial fit", reasoning: "Google Drive integration is well-defined; Notion and PDF parsing add scope risk." },
      { name: "Persistent memory", verdict: "Weak fit", reasoning: "Career tracking memory is compelling but adds architecture complexity not needed for MVP demo." },
      { name: "Structured output", verdict: "Strong fit", reasoning: "Editable UI output is the core differentiator and maps directly to an agentic structured output pattern." },
    ]
  },
  concerns: [
    {
      rank: 1,
      label: "Data Access",
      source: "Industry Pattern",
      severity: "Critical",
      explanation: "Multi-source ingestion (Drive, Notion, PDFs) is the #1 scope risk for this type of project. Similar proposals consistently underestimated the effort to handle diverse input formats reliably. 2 of 3 similar projects narrowed to a single source for their demo build."
    },
    {
      rank: 2,
      label: "Differentiation",
      source: "Instructor Pattern",
      severity: "Significant",
      explanation: "The 'editable output' angle is your strongest differentiator but similar proposals lost this narrative by trying to also compete on design flexibility and multi-template support. Instructor feedback consistently advised: one opinionated template, focus on synthesis quality over layout variety."
    },
    {
      rank: 3,
      label: "Scope Risk",
      source: "Instructor Pattern",
      severity: "Moderate",
      explanation: "Persistent memory for career tracking is a compelling v2 story but adds architectural complexity flagged as post-demo scope in similar projects. The MVP that shipped strongest was: one document type in -> one structured portfolio out -> fully editable."
    }
  ],
  clarifying_questions: [
    {
      question_number: 1,
      linked_concern: "Data Access",
      question: "Which single document source will you support for your demo — Google Drive, a PDF upload, or something else — and do you have sample documents ready to test with today?"
    },
    {
      question_number: 2,
      linked_concern: "Differentiation",
      question: "What does the editable output look like exactly — is it a rich text editor, a structured form, or something else — and what makes it feel different from pasting Claude output into Notion?"
    },
    {
      question_number: 3,
      linked_concern: "Scope Risk",
      question: "If you had to cut persistent memory entirely for the demo, what would the core demo flow be — and is that still compelling enough to present on Demo Day?"
    }
  ],
  similar_projects: [
    { title: "PortfolioAI — Resume to Portfolio Generator", industry: "CareerTech", description: "An agent that takes a student's resume and LinkedIn profile and generates a structured portfolio page. Focused on content extraction and layout templating. Instructor flagged that single-source input kept scope manageable — multi-source ingestion was deferred to v2." },
    { title: "CaseStudy Builder — PM Portfolio Tool", industry: "CareerTech", description: "Pulled project artifacts from Notion and Jira to auto-generate PM case studies. Hit scope issues when supporting multiple input formats. Strongest demo came from one source -> one clean editable output." },
    { title: "WorkShowcase — UX Portfolio Generator", industry: "CareerTech", description: "Took Figma files and project write-ups to create a shareable UX portfolio. The 'editable output' framing was the right differentiator but time was lost on design customization. Synthesis quality mattered more than layout flexibility for the demo." }
  ]
}

export default function Home() {
  // Core state
  const [currentPage, setCurrentPage] = useState<Page>('evaluate')
  const [role, setRole] = useState<Role>('student')
  
  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    name: 'AgenticFit Coach',
    persona: 'Bootcamp students in cohort-based AI and PM courses building a capstone project to land a job at an AI-first company',
    what: 'Every major agentic AI bootcamp requires a capstone, but no tool exists to help students validate whether their idea is feasible before they start building. Feedback from instructors is slow, generic, or arrives too late — often in marathon week when nothing can be fixed. AgenticFit Coach solves this: submit an idea, get an instant scorecard grounded in real past cohort projects in the same industry, the top 3 concerns flagged by instructor feedback patterns, and clarifying questions to sharpen the build before a single line of code is written.',
    agentic: 'AgenticFit requires a multi-step pipeline where each step depends on the output of the previous one — this cannot be done in a single prompt. Step 1: RAG retrieval of similar past proposals from a vector store. Step 2: 5-dimension scoring across Agentic Fit, Persona, Pain Point, Complexity, and MOAT. Step 3: concern identification from instructor feedback patterns. Step 4: clarifying questions linked to each specific concern. Step 5: 6-week build risk synthesis. The coaching loop is iterative and state-dependent — student answers update the evaluation.',
    moat: 'The MOAT is honest: thin at launch, compounding over time. At cohort 1, the RAG retrieval has limited signal. By cohort 3+, the concern patterns become accurate and curriculum-specific. The real lock-in is instructor adoption — once an instructor embeds their evaluation framework, the tool becomes proprietary to their course.'
  })
  
  // MVP state
  const [mvpData, setMvpData] = useState({
    description: '',
    features: '',
    notBuilding: ''
  })
  
  // Evaluation state
  const [isLoading, setIsLoading] = useState(false)
  const [evaluationResponse, setEvaluationResponse] = useState<EvaluationResponse | null>(null)
  const [scores, setScores] = useState<Scores | null>(null)
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({})
  
  // Progress state
  const [evaluated, setEvaluated] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [instructorApproved, setInstructorApproved] = useState(false)
  const [mvpDefined, setMvpDefined] = useState(false)
  const [instructorComments, setInstructorComments] = useState('')
  
  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'info' as 'success' | 'info', isVisible: false })

  const showToast = useCallback((message: string, type: 'success' | 'info') => {
    setToast({ message, type, isVisible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }, [])

  // Navigation steps
  const navSteps: NavStep[] = [
    { id: 'evaluate', label: 'Evaluate', badge: 1, locked: false, done: evaluated },
    { id: 'coach', label: 'AgenticFit Coach', badge: 2, locked: !evaluated, done: submitted },
    { id: 'instructor', label: 'Instructor Review', badge: 3, locked: !submitted, done: instructorApproved },
    { id: 'mvp', label: 'Define MVP', badge: 4, locked: !instructorApproved, done: mvpDefined },
    { id: 'buildplan', label: 'Build Plan', badge: 5, locked: !mvpDefined, done: false },
  ]

  // Calculate scores based on mock evaluation response (matching the screenshots)
  const calculateScores = (_data: ProjectFormData, round: number): Scores => {
    // Round 1: Initial evaluation matching MEDIUM overall score from mock response
    if (round === 1) {
      return {
        agenticFit: 'Medium',
        persona: 'Low',
        painPoint: 'Low',
        complexity: 'Medium',
        moat: 'Low',
        buildRisk: 'High'
      }
    }
    // Round 2+: Improved scores after coaching
    return {
      agenticFit: 'Low',
      persona: 'Low',
      painPoint: 'Low',
      complexity: 'Low',
      moat: 'Low',
      buildRisk: 'Low'
    }
  }

  // Handlers
  const handlePageChange = (page: Page) => {
    const step = navSteps.find(s => s.id === page)
    if (step && !step.locked) {
      setCurrentPage(page)
    }
  }

  const handleEvaluate = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 5500))
    
    const newScores = calculateScores(formData, 1)
    setScores(newScores)
    setEvaluationResponse(MOCK_EVALUATION_RESPONSE)
    setEvaluated(true)
    setIsLoading(false)
    showToast('Evaluation complete — review your results below', 'success')
  }

  const handleCancelLoading = () => {
    setIsLoading(false)
    showToast('Analysis stopped — edit your idea and try again', 'info')
  }

  const handleGoToCoach = () => {
    setCurrentPage('coach')
    window.scrollTo(0, 0)
  }

  const handleResubmit = () => {
    const newScores = calculateScores(formData, 2)
    setScores(newScores)
    showToast('Re-evaluation complete — your scores have been updated', 'success')
  }

  const handleSkipToInstructor = () => {
    setSubmitted(true)
    setCurrentPage('instructor')
    window.scrollTo(0, 0)
    showToast('Submitted for instructor review', 'success')
  }

  const handleDemoApprove = () => {
    setInstructorApproved(true)
    setInstructorComments('Strong foundation — the RAG retrieval and scoring pipeline are well-defined. Focus your MVP on the single-round evaluation flow first. The iterative coaching loop can come in v2. Looking forward to seeing your demo!')
    showToast('Your project has been approved!', 'success')
  }

  const handleGoToMvp = () => {
    setCurrentPage('mvp')
    window.scrollTo(0, 0)
  }

  const handleGeneratePlan = () => {
    setMvpDefined(true)
    setCurrentPage('buildplan')
    window.scrollTo(0, 0)
    showToast('Your build plan has been generated!', 'success')
  }

  const handleAnswerChange = (questionNumber: number, answer: string) => {
    setQuestionAnswers(prev => ({ ...prev, [questionNumber]: answer }))
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navigation
        currentPage={currentPage}
        role={role}
        userName="Lorelei"
        userInitials="LF"
        steps={navSteps}
        onPageChange={handlePageChange}
        onRoleChange={setRole}
      />

      {currentPage === 'evaluate' && (
        <EvaluatePage
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleEvaluate}
          isLoading={isLoading}
          onCancelLoading={handleCancelLoading}
          evaluationResponse={evaluationResponse}
          scores={scores}
          onGoToCoach={handleGoToCoach}
          questionAnswers={questionAnswers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {currentPage === 'coach' && (
        <CoachPage
          isLocked={!evaluated}
          formData={formData}
          onFormChange={setFormData}
          scores={scores}
          clarifyingQuestions={evaluationResponse?.clarifying_questions || []}
          questionAnswers={questionAnswers}
          onAnswerChange={handleAnswerChange}
          onResubmit={handleResubmit}
          onSkipToInstructor={handleSkipToInstructor}
        />
      )}

      {currentPage === 'instructor' && (
        <InstructorPage
          role={role}
          isLocked={!evaluated}
          isSubmitted={submitted}
          projectName={formData.name}
          isApproved={instructorApproved}
          instructorComments={instructorComments}
          onDemoApprove={handleDemoApprove}
          onGoToMvp={handleGoToMvp}
        />
      )}

      {currentPage === 'mvp' && (
        <MvpPage
          isLocked={!instructorApproved}
          projectName={formData.name}
          scores={scores}
          mvpData={mvpData}
          onMvpChange={setMvpData}
          onGeneratePlan={handleGeneratePlan}
        />
      )}

      {currentPage === 'buildplan' && (
        <BuildPlanPage
          isLocked={!mvpDefined}
          projectName={formData.name}
          scores={scores}
          buildPlan={[]}
        />
      )}

      <AppToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onHide={hideToast}
      />
    </div>
  )
}
