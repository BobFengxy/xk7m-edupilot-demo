import { useState } from 'react'
import { Edit3, Eye, Download, Search, Star, FolderOpen, FileText, Film, File } from 'lucide-react'

const categories = [
  { label: '全部作品', count: 12, icon: FolderOpen },
  { label: '收藏', count: 3, icon: Star },
  { label: 'PPT课件', count: 5, icon: File },
  { label: '教案文档', count: 4, icon: FileText },
  { label: '实验视频', count: 2, icon: Film },
  { label: '草稿', count: 1, icon: Edit3 },
]

const works = [
  { title: '电磁感应与电磁阻尼', type: 'PPT课件', date: '2025-04-12', gradient: 'from-indigo-900 to-slate-900', tag: 'PPT' },
  { title: '牛顿第二定律教案', type: '教案文档', date: '2025-04-10', gradient: 'from-blue-600 to-blue-900', tag: 'Word' },
  { title: '单摆运动实验录制', type: '实验视频', date: '2025-04-08', gradient: 'from-purple-600 to-indigo-900', tag: 'MP4' },
  { title: '力学综合复习PPT', type: 'PPT课件', date: '2025-04-06', gradient: 'from-indigo-900 to-slate-900', tag: 'PPT' },
  { title: '电场与电势教案', type: '教案文档', date: '2025-04-04', gradient: 'from-blue-600 to-blue-900', tag: 'Word' },
  { title: '自由落体运动课件', type: 'PPT课件', date: '2025-04-02', gradient: 'from-indigo-900 to-slate-900', tag: 'PPT' },
  { title: '弹簧振子互动动画', type: '实验视频', date: '2025-03-30', gradient: 'from-purple-600 to-indigo-900', tag: 'HTML5' },
  { title: '万有引力定律课件', type: 'PPT课件', date: '2025-03-28', gradient: 'from-indigo-900 to-slate-900', tag: 'PPT' },
  { title: '动量守恒定律教案', type: '教案文档', date: '2025-03-25', gradient: 'from-blue-600 to-blue-900', tag: 'Word' },
]

export default function Works() {
  const [active, setActive] = useState('全部作品')

  return (
    <div className="h-full overflow-auto p-6 fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">我的作品</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">管理您的课件、教案和教学资源</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="搜索作品..." className="pl-9 pr-4 py-1.5 text-[13px] glass-input rounded-lg w-[220px] focus:outline-none text-slate-700 placeholder:text-slate-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(({ label, count, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`group flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] btn-press cursor-pointer ${
              active === label
                ? 'bg-gradient-to-br from-primary to-indigo-accent text-white shadow-lg shadow-indigo-500/25'
                : 'glass-card text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5 icon-bounce-hover" />
            {label}
            <span className={`text-[11px] ml-1 ${active === label ? 'text-indigo-100' : 'text-slate-400'}`}>({count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {works.map((work, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden lift-hover group cursor-pointer">
            <div className={`bg-gradient-to-br ${work.gradient} h-[140px] p-5 flex flex-col justify-end relative overflow-hidden`}>
              {/* decorative orbit */}
              <span className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full border border-white/20" />
              <span className="pointer-events-none absolute top-10 -right-10 w-20 h-20 rounded-full border border-white/10" />
              <span className="absolute top-3 right-3 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm ring-1 ring-white/30">{work.tag}</span>
              <h3 className="relative text-white font-medium text-[14px]">{work.title}</h3>
              <p className="relative text-white/70 text-[11px] mt-0.5">{work.type}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">{work.date}</span>
              <div className="flex gap-1">
                <button aria-label="编辑" className="p-1.5 text-slate-400 hover:text-indigo-accent hover:bg-indigo-50/70 rounded-lg btn-press cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5 icon-wobble-hover" />
                </button>
                <button aria-label="预览" className="p-1.5 text-slate-400 hover:text-indigo-accent hover:bg-indigo-50/70 rounded-lg btn-press cursor-pointer">
                  <Eye className="w-3.5 h-3.5 icon-pulse-hover" />
                </button>
                <button aria-label="下载" className="p-1.5 text-slate-400 hover:text-indigo-accent hover:bg-indigo-50/70 rounded-lg btn-press cursor-pointer">
                  <Download className="w-3.5 h-3.5 icon-bounce-hover" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
