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
    name: 'PM Job Application Copilot',
    persona: 'Senior PM (6-12 years experience) transitioning roles in AI-saturated job market. Persona: Marta – Senior AI Product Manager in Transition. Role: Senior AI Product Manager. Experience: 8 years in product, 3 years in AI-driven products. Situation: Recently impacted by restructuring, actively applying for new AI PM roles.',
    what: 'Senior PMs transitioning to AI-focused roles face a unique challenge: generic AI assistants like ChatGPT can summarize job descriptions but cannot perform the nuanced strategic reasoning required to position a candidate\'s experience against role-specific implicit expectations. Job descriptions are vague and buzzword-heavy, making it difficult to identify true skill gaps. The PM Job Application Copilot solves this through multi-step reasoning: it decomposes job descriptions into structured skill requirements, compares nuanced job descriptions and resume-to-job alignment, identifies skill gaps, and iteratively improves the application positioning narrative — all tailored to the intentional narrowness of high-quality, vertically specialized Career Intelligence for Senior AI PMs.',
    agentic: 'This problem requires multi-step reasoning across ambiguous inputs: Step 1: Parse job description and extract structured skill requirements, seniority level, and implicit role expectations. Step 2: Map extracted requirements against the candidate\'s experience, highlighting both explicit matches and gaps. Step 3: Generate a strategic positioning narrative that frames the candidate\'s AI experience as the primary strength. Step 4: Iteratively refine based on feedback, adjusting the narrative to emphasize areas of concern. Step 5: Track response patterns to inform future application strategies. These steps cannot be reliably handled by predefined rules or single-prompt interactions.',
    moat: 'Why better than ChatGPT? The system decomposes job descriptions into structured skill requirements, compares nuanced job descriptions against resumes to identify gaps, and iteratively improves applications by tracking response patterns — providing system design thinking rather than just prompting. Why better than incumbent tools? The key lever is intentional narrowness. Instead of a generic job tool, this is a high-quality, vertically specialized Career Intelligence System for Senior AI PMs. Potential to expand beyond MVP scope with tailored upskilling plans, interview prep voice agent, and expansion to other verticals.'
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
  const [rawApiResponse, setRawApiResponse] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  
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

  // Scores are derived from real API response only — no mock values
  const calculateScores = (_data: ProjectFormData, _round: number): Scores => {
    return {
      agenticFit: null,
      persona: null,
      painPoint: null,
      complexity: null,
      moat: null,
      buildRisk: null,
    }
  }

  // Handlers
  const handlePageChange = (page: Page) => {
    const step = navSteps.find(s => s.id === page)
    if (step && !step.locked) {
      setCurrentPage(page)
    }
  }

  // Evaluate project directly via n8n webhook (CORS enabled)
  const handleEvaluate = async () => {
    setIsLoading(true)
    setRawApiResponse(null)
    setApiError(null)
    
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://loreleifara.app.n8n.cloud/webhook/31cf455f-5074-4b84-ad91-a8571323154d'
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectName: formData.name,
          targetPersona: formData.persona,
          projectDescription: formData.what,
          whyAgentic: formData.agentic,
          moat: formData.moat
        })
      })
      
      const rawText = await response.text()
      console.log('[v0] Raw API Response:', rawText)
      console.log('[v0] Response Status:', response.status)
      setRawApiResponse(rawText)
      
      // Parse the JSON response
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${rawText}`)
      }
      
      try {
        // n8n returns [{"output": "...json string..."}] format
        const outerArray = JSON.parse(rawText)
        console.log('[v0] Parsed outer array:', outerArray)
        
        // Get the first item and extract the output field
        if (!Array.isArray(outerArray) || outerArray.length === 0) {
          throw new Error('Response is not an array or is empty')
        }
        
        const firstItem = outerArray[0]
        if (!firstItem || typeof firstItem.output !== 'string') {
          throw new Error('Response missing output field')
        }
        
        // Parse the output string as JSON to get the actual evaluation data
        const evaluationData = JSON.parse(firstItem.output) as EvaluationResponse
        console.log('[v0] Parsed evaluation data:', evaluationData)
        
        // Check if response has an error property
        if (evaluationData && typeof evaluationData === 'object' && 'error' in evaluationData) {
          throw new Error((evaluationData as { error: string }).error)
        }
        
        // Derive scores from the evaluation data for the scorecard
        // Only populate Agentic Fit from API - other fields are roadmap features
        const mapOverallScoreToRisk = (score: string): 'Low' | 'Medium' | 'High' => {
          if (score === 'HIGH') return 'Low'  // HIGH agentic fit = LOW risk
          if (score === 'MEDIUM') return 'Medium'
          return 'High'  // LOW agentic fit = HIGH risk
        }
        
        const derivedScores: Scores = {
          agenticFit: mapOverallScoreToRisk(evaluationData.agentic_fit?.overall_score || 'LOW'),
          // These fields are roadmap features - leave as null/undefined to show dash state
          persona: null as unknown as 'Low' | 'Medium' | 'High',
          painPoint: null as unknown as 'Low' | 'Medium' | 'High',
          complexity: null as unknown as 'Low' | 'Medium' | 'High',
          moat: null as unknown as 'Low' | 'Medium' | 'High',
          buildRisk: null as unknown as 'Low' | 'Medium' | 'High',
        }
        setScores(derivedScores)
        
        // Set the evaluation response from the actual API
        setEvaluationResponse(evaluationData)
        setEvaluated(true)
        showToast('Evaluation complete — review your results below', 'success')
      } catch (parseError) {
        console.log('[v0] Response parsing error:', parseError)
        console.log('[v0] Raw response was:', rawText)
        // Show the raw response so user can debug
        setRawApiResponse(rawText)
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
      }
    } catch (error) {
      console.error('[v0] API Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setApiError(errorMessage)
      showToast('Failed to evaluate — check the error message below', 'info')
    } finally {
      setIsLoading(false)
    }
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
          rawApiResponse={rawApiResponse}
          apiError={apiError}
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
