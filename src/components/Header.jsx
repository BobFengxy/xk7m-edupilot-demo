import { Bell, LogIn } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-[56px] bg-white border-b border-gray-100 flex items-center justify-end px-6 shrink-0 gap-3">
      <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
        <Bell className="w-4.5 h-4.5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm">
        <LogIn className="w-3.5 h-3.5" />
        注册 / 登录
      </button>
    </header>
  )
}
