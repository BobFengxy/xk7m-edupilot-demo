import { NavLink } from 'react-router-dom'
import {
  MessageSquare, BookOpen, FolderOpen, ClipboardList,
  BarChart3, Cloud, Atom, Clock, User, ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/chat', icon: MessageSquare, label: 'AI 对话中心', hover: 'icon-bounce-hover' },
  { path: '/lesson', icon: BookOpen, label: '教学设计', hover: 'icon-wobble-hover' },
  { path: '/works', icon: FolderOpen, label: '课件管理', hover: 'icon-bounce-hover' },
  { path: '/classroom', icon: ClipboardList, label: '搜题组卷', hover: 'icon-wobble-hover' },
  { path: '/homework', icon: BarChart3, label: '学情分析', hover: 'icon-pulse-hover' },
  { path: '/cloud', icon: Cloud, label: '我的云盘', hover: 'icon-bounce-hover' },
]

const recentChats = [
  '牛顿第二定律课件设计',
  '电磁感应复习教案',
  '力学单元测试组卷',
]

export default function Sidebar() {
  return (
    <aside className="w-[220px] h-full glass-panel flex flex-col shrink-0 relative">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2.5 group cursor-pointer">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-accent flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Atom className="w-5 h-5 text-white icon-spin-hover" strokeWidth={2.2} />
          <span className="absolute inset-0 rounded-xl ring-1 ring-white/40 pointer-events-none" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold text-slate-900 tracking-tight">Edu-Pilot</span>
          <span className="text-[10px] text-slate-500 tracking-[0.14em] uppercase">Physics · AI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto min-h-0">
        <div className="text-[10px] text-slate-500 font-semibold px-2 mb-1.5 uppercase tracking-[0.16em]">功能导航</div>
        {navItems.map(({ path, icon: Icon, label, hover }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-1 cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'nav-item-active font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {!isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[2px] bg-indigo-accent rounded-r-full transition-all duration-300 group-hover:h-5" />
                )}
                <Icon className={`w-4 h-4 shrink-0 nav-icon ${hover}`} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Recent chats */}
        <div className="text-[10px] text-slate-500 font-semibold px-2 mt-5 mb-1.5 uppercase tracking-[0.16em]">最近对话</div>
        {recentChats.map((chat, i) => (
          <div
            key={i}
            className="group flex items-center gap-2 px-3 py-1.5 text-[12px] text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-lg cursor-pointer transition-colors"
          >
            <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400 icon-spin-hover" />
            <span className="truncate">{chat}</span>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/60">
        <div className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/60 cursor-pointer transition-colors">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <User className="w-4 h-4 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-slate-800 truncate">物理教师</div>
            <div className="text-[10px] text-slate-500">高中部</div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </aside>
  )
}
