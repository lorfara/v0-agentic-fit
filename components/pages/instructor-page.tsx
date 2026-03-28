"use client"

import { Lock, ArrowRight, CheckCircle, Eye, MessageSquare } from "lucide-react"
import type { Role } from "@/lib/types"

interface StudentSubmission {
  id: string
  name: string
  initials: string
  projectName: string
  submittedAt: string
  status: 'pending' | 'approved' | 'needs_revision'
}

interface InstructorPageProps {
  role: Role
  isLocked: boolean
  isSubmitted: boolean
  projectName: string
  isApproved: boolean
  instructorComments?: string
  onDemoApprove: () => void
  onGoToMvp: () => void
}

// Mock data for instructor view
const MOCK_STUDENTS: StudentSubmission[] = [
  { id: '1', name: 'Lorelei Faria', initials: 'LF', projectName: 'AgenticFit Coach', submittedAt: '2 hours ago', status: 'pending' },
  { id: '2', name: 'Marcus Chen', initials: 'MC', projectName: 'CodeReview AI', submittedAt: '3 hours ago', status: 'pending' },
  { id: '3', name: 'Sarah Kim', initials: 'SK', projectName: 'MeetingMind', submittedAt: '5 hours ago', status: 'pending' },
  { id: '4', name: 'Alex Rivera', initials: 'AR', projectName: 'DataPipeline Pro', submittedAt: '1 day ago', status: 'approved' },
  { id: '5', name: 'Jordan Taylor', initials: 'JT', projectName: 'ContentFlow', submittedAt: '1 day ago', status: 'approved' },
  { id: '6', name: 'Emily Wong', initials: 'EW', projectName: 'DesignAssist', submittedAt: '2 days ago', status: 'pending' },
  { id: '7', name: 'David Park', initials: 'DP', projectName: 'SalesHelper AI', submittedAt: '2 days ago', status: 'approved' },
  { id: '8', name: 'Nina Patel', initials: 'NP', projectName: 'LearnPath', submittedAt: '3 days ago', status: 'approved' },
  { id: '9', name: 'Chris Lee', initials: 'CL', projectName: 'BudgetBuddy', submittedAt: '3 days ago', status: 'approved' },
  { id: '10', name: 'Maya Johnson', initials: 'MJ', projectName: 'RecipeGen', submittedAt: '4 days ago', status: 'pending' },
  { id: '11', name: 'Ryan Smith', initials: 'RS', projectName: 'FitTracker AI', submittedAt: '4 days ago', status: 'approved' },
  { id: '12', name: 'Lisa Chen', initials: 'LC', projectName: 'TravelPlanner', submittedAt: '5 days ago', status: 'approved' },
]

export function InstructorPage({
  role,
  isLocked,
  isSubmitted,
  projectName,
  isApproved,
  instructorComments,
  onDemoApprove,
  onGoToMvp,
}: InstructorPageProps) {
  const pendingCount = MOCK_STUDENTS.filter(s => s.status === 'pending').length
  const approvedCount = MOCK_STUDENTS.filter(s => s.status === 'approved').length

  return (
    <div className="page-inner max-w-[1280px] mx-auto py-7 px-6 pb-[60px]">
      <div className="mb-6">
        <h1 className="font-display text-[26px] font-black text-[var(--text)] tracking-tight mb-1.5">
          Instructor Review
        </h1>
        {role === 'instructor' && (
          <p className="text-base text-[var(--muted)] leading-relaxed">
            Review and approve student capstone submissions
          </p>
        )}
      </div>

      {/* Student View */}
      {role === 'student' && (
        <div>
          {isLocked && !isSubmitted ? (
            <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
              <div className="p-6">
                <div className="text-center py-10 px-6 text-[var(--muted)] text-base">
                  <div className="text-[40px] mb-3">
                    <Lock className="w-10 h-10 mx-auto text-[var(--muted)]" />
                  </div>
                  <strong className="block text-lg font-bold text-[var(--text-secondary)] mb-2">
                    Submit your evaluations first
                  </strong>
                  Complete at least one evaluation round, then submit for instructor review.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden mb-5" style={{ boxShadow: 'var(--shadow)' }}>
              {/* Header */}
              <div className="py-5 px-6 border-b border-[var(--border)] flex items-center justify-between">
                <div className="font-display text-lg font-extrabold text-[var(--text)]">
                  Submitted for Review
                </div>
                <span className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-[20px] text-[13px] font-bold border ${
                  isApproved 
                    ? 'bg-[var(--green-bg)] text-[var(--green)] border-[var(--green-border)]' 
                    : 'bg-[var(--yellow-bg)] text-[var(--yellow)] border-[var(--yellow-border)]'
                }`}>
                  {isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Project Name */}
                <div className="bg-[var(--bg)] rounded-[10px] p-[18px_22px] mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                      Project Submitted
                    </div>
                    <div className="text-lg font-bold text-[var(--text)]">
                      {projectName || '—'}
                    </div>
                  </div>
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg border-2 border-[var(--border)] text-sm font-bold text-[var(--muted)] bg-white cursor-not-allowed opacity-50 tracking-wide"
                  >
                    Feedback
                  </button>
                </div>

                {/* Instructor Feedback */}
                {isApproved && instructorComments && (
                  <div 
                    className="rounded-[0_10px_10px_0] p-[18px_22px] mb-5"
                    style={{ 
                      background: 'var(--orange-light)', 
                      borderLeft: '4px solid var(--orange)' 
                    }}
                  >
                    <div className="text-[13px] font-bold text-[var(--orange-hover)] uppercase tracking-wider mb-2">
                      Instructor Comments
                    </div>
                    <p className="text-[15px] text-[var(--text)] leading-relaxed">
                      {instructorComments}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-sm text-[var(--muted)]">
                    {isApproved ? 'Your project has been approved!' : 'Waiting for instructor response...'}
                  </span>
                  {isApproved && (
                    <button
                      onClick={onGoToMvp}
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--orange)] text-white border-[var(--orange)] hover:bg-[var(--orange-hover)] hover:border-[var(--orange-hover)]"
                    >
                      Define Your MVP
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Demo Button */}
                {!isApproved && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
                    <button
                      onClick={onDemoApprove}
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-[18px] rounded-[var(--radius-sm)] font-display text-sm font-extrabold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--bg)] hover:border-[#9ca3af]"
                    >
                      Demo: Simulate Instructor Approval
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructor View */}
      {role === 'instructor' && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              className="bg-[var(--card)] rounded-[var(--radius)] p-[20px_22px]"
              style={{ boxShadow: 'var(--shadow)', borderLeft: '4px solid var(--orange)' }}
            >
              <div className="font-display text-4xl font-black text-[var(--orange)] leading-none mb-1">
                {MOCK_STUDENTS.length}
              </div>
              <div className="text-sm font-semibold text-[var(--muted)]">
                Students submitted
              </div>
            </div>
            <div 
              className="bg-[var(--card)] rounded-[var(--radius)] p-[20px_22px]"
              style={{ boxShadow: 'var(--shadow)', borderLeft: '4px solid var(--yellow)' }}
            >
              <div className="font-display text-4xl font-black text-[var(--yellow)] leading-none mb-1">
                {pendingCount}
              </div>
              <div className="text-sm font-semibold text-[var(--muted)]">
                Pending review
              </div>
            </div>
            <div 
              className="bg-[var(--card)] rounded-[var(--radius)] p-[20px_22px]"
              style={{ boxShadow: 'var(--shadow)', borderLeft: '4px solid var(--green)' }}
            >
              <div className="font-display text-4xl font-black text-[var(--green)] leading-none mb-1">
                {approvedCount}
              </div>
              <div className="text-sm font-semibold text-[var(--muted)]">
                Approved
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="py-5 px-6 border-b border-[var(--border)] flex items-center justify-between">
              <div className="font-display text-lg font-extrabold text-[var(--text)]">
                Student Submissions
              </div>
              <div className="text-sm text-[var(--muted)]">
                Cohort 9 - Agentic AI Bootcamp
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3.5">
                {MOCK_STUDENTS.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center gap-4 p-[18px_22px] rounded-[10px] bg-[var(--bg)] border-2 border-[var(--border)] transition-all hover:border-[var(--orange)] hover:bg-[var(--orange-light)]"
                  >
                    <div className="w-11 h-11 rounded-full bg-[var(--navy)] text-white font-display text-base font-black flex items-center justify-center shrink-0">
                      {student.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold text-[var(--text)]">
                        {student.name}
                      </div>
                      <div className="text-[13px] text-[var(--muted)]">
                        {student.projectName} - {student.submittedAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      <button className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[var(--radius-sm)] font-display text-[13px] font-bold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--bg)] hover:border-[#9ca3af]">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      {student.status === 'pending' ? (
                        <button className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[var(--radius-sm)] font-display text-[13px] font-bold cursor-pointer border-2 transition-all leading-none whitespace-nowrap bg-[var(--green)] text-white border-[var(--green)] hover:bg-[#085e30]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-[20px] text-xs font-bold bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)]">
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
