"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AppToastProps {
  message: string
  type: 'success' | 'info'
  isVisible: boolean
  onHide: () => void
}

export function AppToast({ message, type, isVisible, onHide }: AppToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-8 right-8 bg-[var(--navy)] text-white py-4 px-[22px] rounded-[10px] text-[15px] font-semibold z-[999] transition-all duration-300 max-w-[340px] leading-snug",
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-20 opacity-0",
        type === 'success' && "border-l-4 border-[var(--green)]",
        type === 'info' && "border-l-4 border-[var(--orange)]"
      )}
      style={{ boxShadow: 'var(--shadow-lg)' }}
    >
      {message}
    </div>
  )
}
