import { NavLink } from 'react-router-dom'
import {
  MessageSquare, BookOpen, FolderOpen, ClipboardList,
  BarChart3, Cloud, Sparkles, Clock, User, ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/chat', icon: MessageSquare, label: 'AI 对话中心' },
  { path: '/lesson', icon: BookOpen, label: '教学设计' },
  { path: '/works', icon: FolderOpen, label: '课件管理' },
  { path: '/classroom', icon: ClipboardList, label: '搜题组卷' },
  { path: '/homework', icon: BarChart3, label: '学情分析' },
  { path: '/cloud', icon: Cloud, label: '我的云盘' },
]

const recentChats = [
  '牛顿第二定律课件设计',
  '电磁感应复习教案',
  '力学单元测试组卷',
]

export default function Sidebar() {
  return (
    <aside className="w-[220px] h-full bg-white border-r border-gray-100 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">Edu-Pilot</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto min-h-0">
        <div className="text-[11px] text-gray-400 font-medium px-2 mb-1.5 uppercase tracking-wider">功能导航</div>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all duration-150 ${
                isActive
                  ? 'font-medium'
                  : 'hover:bg-[#e0f2fe]/60'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: '#e0f2fe', color: '#2563eb' }
                : { color: '#4b5563' }
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Recent chats */}
        <div className="text-[11px] text-gray-400 font-medium px-2 mt-5 mb-1.5 uppercase tracking-wider">最近对话</div>
        {recentChats.map((chat, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span className="truncate">{chat}</span>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-gray-800 truncate">物理教师</div>
            <div className="text-[11px] text-gray-400">高中部</div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </aside>
  )
}
