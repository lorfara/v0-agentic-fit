"use client"

import { Menu, Heart, User } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white px-4 md:px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-[#161616]" />
        </button>
        <div className="flex items-center">
          <span className="text-lg font-bold tracking-tight text-[#FF6B00]">
            AGENTICFIT
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="h-10 px-4 flex items-center gap-2 rounded-full border border-gray-200 hover:border-gray-300 transition-colors text-sm font-medium text-[#161616] bg-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Ask AI
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
          <Heart className="w-5 h-5 text-[#161616]" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
          <User className="w-5 h-5 text-[#161616]" />
        </button>
      </div>
    </header>
  )
}
