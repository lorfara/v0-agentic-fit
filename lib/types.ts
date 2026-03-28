// Page types
export type Page = 'evaluate' | 'coach' | 'instructor' | 'mvp' | 'buildplan'
export type Role = 'student' | 'instructor'
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type Severity = 'Critical' | 'Significant' | 'Moderate'

// Scores type - null means roadmap feature (show dash state)
export interface Scores {
  agenticFit: RiskLevel | null
  persona: RiskLevel | null
  painPoint: RiskLevel | null
  complexity: RiskLevel | null
  moat: RiskLevel | null
  buildRisk: RiskLevel | null
}

// Agentic Fit types
export interface AgenticCriterion {
  name: string
  verdict: 'Strong fit' | 'Partial fit' | 'Weak fit'
  reasoning: string
}

export interface AgenticFit {
  overall_score: 'HIGH' | 'MEDIUM' | 'LOW'
  justification: string
  criteria: AgenticCriterion[]
}

// Concern type
export interface Concern {
  rank: number
  label: string
  source: string
  severity: Severity
  explanation: string
}

// Similar project type
export interface SimilarProject {
  project_name: string
  student_name: string
  similarity_reason: string
}

// Clarifying question type
export interface ClarifyingQuestion {
  question_number: number
  linked_concern: string
  question: string
  answer?: string
}

// Full evaluation response (matches n8n API response)
export interface EvaluationResponse {
  agentic_fit: AgenticFit
  industry_concerns: Concern[]  // API returns "industry_concerns", not "concerns"
  clarifying_questions: ClarifyingQuestion[]
  similar_projects?: SimilarProject[]  // May not always be returned
}

// Project form data
export interface ProjectFormData {
  name: string
  persona: string
  what: string
  agentic: string
  moat: string
}

// App state
export interface AppState {
  role: Role
  currentPage: Page
  round: number
  scores: Scores | null
  projectData: ProjectFormData
  evaluationResponse: EvaluationResponse | null
  evaluated: boolean
  instructorApproved: boolean
  mvpDefined: boolean
  instructorComments?: string
}

// Navigation step
export interface NavStep {
  id: Page
  label: string
  badge: number
  locked: boolean
  done: boolean
}
