import { Bell, LogIn, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative h-[60px] glass-panel border-l-0 border-r-0 border-t-0 flex items-center justify-between px-6 shrink-0 gap-3 z-20">
      {/* Left — ambient formula marker */}
      <div className="hidden md:flex items-center gap-3 text-slate-500">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-[pulse-dot_2.4s_ease-in-out_infinite]" />
          <span>实时在线</span>
        </div>
        <div className="h-4 w-px bg-slate-300/70" />
        <div className="font-mono text-[12px] text-slate-500 tracking-wide">
          <span className="text-indigo-accent/80">F</span>
          <span> = m</span>
          <span className="text-indigo-accent/80">a</span>
          <span className="mx-2 text-slate-400">·</span>
          <span className="text-indigo-accent/80">E</span>
          <span> = mc²</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search input */}
        <label className="hidden lg:flex glass-input items-center gap-2 h-9 px-3 rounded-xl w-[220px] cursor-text">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            className="bg-transparent outline-none border-none text-[12.5px] text-slate-700 placeholder:text-slate-400 w-full"
            placeholder="搜索课件 / 知识点 / 学生"
          />
          <kbd className="text-[9.5px] text-slate-400 font-mono border border-slate-300/60 rounded px-1 py-[1px] bg-white/60">⌘K</kbd>
        </label>

        <button
          aria-label="通知"
          className="group relative p-2 text-slate-500 hover:text-slate-800 glass-subtle rounded-xl btn-press cursor-pointer"
        >
          <Bell className="w-[18px] h-[18px] icon-wobble-hover" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white/70 breathing-glow" />
        </button>

        <button className="group flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-indigo-accent text-white text-[13px] font-medium rounded-xl btn-press shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer">
          <LogIn className="w-3.5 h-3.5 icon-bounce-hover" />
          <span>注册 / 登录</span>
        </button>
      </div>

      {/* Subtle bottom hairline glow */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />
    </header>
  )
}
