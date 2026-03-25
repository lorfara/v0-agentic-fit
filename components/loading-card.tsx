import { Loader2 } from "lucide-react"

interface LoadingCardProps {
  status: string
  title: string
}

export function LoadingCard({ status, title }: LoadingCardProps) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-10 text-center shadow-sm">
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-[#FF6B00] animate-spin" />
        </div>
      </div>
      <div className="text-xs text-[#8a8a8a] tracking-wide uppercase mb-2 font-medium">
        {status}
      </div>
      <div className="text-xl font-semibold text-[#161616]">
        {title}
      </div>
    </div>
  )
}
