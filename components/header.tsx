import { Sparkles, User } from "lucide-react"

export function Header() {
  return (
    <header className="bg-surface px-6 md:px-10 py-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-semibold text-ink tracking-tight">
          Agentic<span className="text-orange">Fit</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-ink-soft transition-colors text-sm font-medium text-ink">
          <Sparkles className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
        <button className="w-10 h-10 rounded-full border border-border hover:border-ink-soft transition-colors flex items-center justify-center">
          <User className="w-5 h-5 text-ink-muted" />
        </button>
      </div>
    </header>
  )
}
