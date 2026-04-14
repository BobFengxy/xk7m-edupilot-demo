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
          <input placeholder="搜索作品..." className="pl-9 pr-4 py-1.5 text-[13px] bg-white border border-gray-200 rounded-lg w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(({ label, count, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all ${
              active === label
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`text-[11px] ml-1 ${active === label ? 'text-blue-200' : 'text-gray-400'}`}>({count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {works.map((work, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
            <div className={`bg-gradient-to-br ${work.gradient} h-[140px] p-5 flex flex-col justify-end relative`}>
              <span className="absolute top-3 right-3 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{work.tag}</span>
              <h3 className="text-white font-medium text-[14px]">{work.title}</h3>
              <p className="text-white/60 text-[11px] mt-0.5">{work.type}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{work.date}</span>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
