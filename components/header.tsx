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
