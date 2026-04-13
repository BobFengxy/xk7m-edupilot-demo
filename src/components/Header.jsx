import { Bell, Search, LogIn } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-[52px] bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索课件、知识点、教案..."
            className="pl-9 pr-4 py-1.5 text-[13px] bg-gray-50 border border-gray-200 rounded-lg w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm">
          <LogIn className="w-3.5 h-3.5" />
          注册 / 登录
        </button>
      </div>
    </header>
  )
}
