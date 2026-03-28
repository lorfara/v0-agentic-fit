"use client"

import { cn } from "@/lib/utils"
import type { Page, Role, NavStep } from "@/lib/types"

interface NavigationProps {
  currentPage: Page
  role: Role
  userName: string
  userInitials: string
  steps: NavStep[]
  onPageChange: (page: Page) => void
  onRoleChange: (role: Role) => void
}

export function Navigation({
  currentPage,
  role,
  userName,
  userInitials,
  steps,
  onPageChange,
  onRoleChange,
}: NavigationProps) {
  return (
    <nav 
      className="bg-[var(--navy)] h-14 flex items-center px-6 sticky top-0 z-[200]"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="font-display text-[20px] font-black text-white tracking-tight whitespace-nowrap mr-8 shrink-0">
        Agentic<span className="text-[var(--orange-mid)]">Fit</span>
      </div>

      {/* Nav Links */}
      <div className="flex items-stretch h-14 flex-1" role="menubar">
        {steps.map((step) => (
          <button
            key={step.id}
            role="menuitem"
            tabIndex={step.locked ? -1 : 0}
            onClick={() => onPageChange(step.id)}
            className={cn(
              "flex items-center gap-2 px-4 text-[14px] font-semibold cursor-pointer border-b-[3px] border-transparent transition-all whitespace-nowrap select-none relative",
              "text-white/60 hover:text-white hover:bg-white/[0.06]",
              currentPage === step.id && "text-white border-b-[var(--orange-mid)]",
              step.locked && "opacity-50 cursor-pointer hover:bg-white/[0.06] hover:text-white/80"
            )}
          >
            {step.label}
            <span 
              className={cn(
                "w-5 h-5 text-[11px] font-bold rounded-full flex items-center justify-center",
                "bg-[var(--orange)] text-white"
              )}
            >
              {step.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* User Greeting */}
        <div className="text-sm font-semibold text-white/85 whitespace-nowrap">
          Hi, {userName}!
        </div>

        {/* Role Toggle */}
        <div 
          className="flex bg-white/10 rounded-full overflow-hidden border border-white/15"
          role="group"
          aria-label="Switch role"
        >
          <button
            onClick={() => onRoleChange('student')}
            aria-pressed={role === 'student'}
            className={cn(
              "py-1.5 px-3.5 text-[13px] font-bold cursor-pointer border-none transition-all tracking-wide",
              role === 'student' 
                ? "bg-[var(--orange)] text-white rounded-full"
                : "bg-transparent text-white/60"
            )}
          >
            Student
          </button>
          <button
            onClick={() => onRoleChange('instructor')}
            aria-pressed={role === 'instructor'}
            className={cn(
              "py-1.5 px-3.5 text-[13px] font-bold cursor-pointer border-none transition-all tracking-wide",
              role === 'instructor'
                ? "bg-[var(--orange)] text-white rounded-full"
                : "bg-transparent text-white/60"
            )}
          >
            Instructor
          </button>
        </div>

        {/* User Avatar */}
        <div 
          className="w-8 h-8 rounded-full bg-[var(--orange)] text-white font-display text-[13px] font-black flex items-center justify-center shrink-0 border-2 border-white/20"
          aria-hidden="true"
        >
          {userInitials}
        </div>
      </div>
    </nav>
  )
}
