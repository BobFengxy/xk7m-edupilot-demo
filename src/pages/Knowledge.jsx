import { useState } from 'react'
import {
  Folder, FolderOpen, FileText, Image, Film, Upload, Search,
  ChevronRight, File, Plus, MoreHorizontal
} from 'lucide-react'

const folders = [
  { name: '全部资料', count: 24, open: true },
  { name: '力学', count: 8 },
  { name: '电磁学', count: 6 },
  { name: '光学', count: 4 },
  { name: '热力学', count: 3 },
  { name: '高考真题', count: 3 },
]

const files = [
  { name: '人教版高中物理必修三.pdf', type: 'PDF', size: '24.5 MB', color: 'bg-red-100 text-red-600', date: '2025-04-10' },
  { name: '电磁感应教学设计.docx', type: 'Word', size: '1.2 MB', color: 'bg-blue-100 text-blue-600', date: '2025-04-08' },
  { name: '单摆实验视频.mp4', type: '视频', size: '85.3 MB', color: 'bg-purple-100 text-purple-600', date: '2025-04-06' },
  { name: '受力分析示意图.png', type: '图片', size: '0.8 MB', color: 'bg-emerald-100 text-emerald-600', date: '2025-04-05' },
  { name: '2024全国甲卷物理.pdf', type: 'PDF', size: '3.1 MB', color: 'bg-red-100 text-red-600', date: '2025-04-03' },
  { name: '楞次定律PPT.pptx', type: 'PPT', size: '5.7 MB', color: 'bg-orange-100 text-orange-600', date: '2025-04-01' },
]

const ragResults = [
  { text: '法拉第电磁感应定律指出，感应电动势的大小等于穿过回路的磁通量对时间的变化率...', source: '人教版必修3 P138', score: 98 },
  { text: '电磁阻尼是利用涡流产生的磁场对运动导体的阻碍作用...', source: '人教版必修3 P142', score: 92 },
  { text: '楞次定律：感应电流的方向总是使感应电流的磁场阻碍引起感应电流的磁通量的变化...', source: '人教版必修3 P140', score: 87 },
]

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState('电磁感应定律')

  return (
    <div className="flex h-[calc(100vh-52px)] fade-in-up">
      {/* Folder tree */}
      <div className="w-[200px] bg-white border-r border-gray-100 p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-gray-800">资料目录</span>
          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {folders.map((f, i) => (
          <div key={i} className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
            f.open ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}>
            {f.open ? <FolderOpen className="w-4 h-4 shrink-0" /> : <Folder className="w-4 h-4 shrink-0" />}
            <span className="text-[12px] flex-1 truncate">{f.name}</span>
            <span className="text-[10px] text-gray-400">{f.count}</span>
          </div>
        ))}
      </div>

      {/* File grid */}
      <div className="flex-1 p-5 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-gray-800">全部资料 <span className="text-gray-400 text-[13px]">(24)</span></h2>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-3.5 h-3.5" /> 上传资料
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {files.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center`}>
                  {f.type === 'PDF' && <FileText className="w-5 h-5" />}
                  {f.type === 'Word' && <File className="w-5 h-5" />}
                  {f.type === '视频' && <Film className="w-5 h-5" />}
                  {f.type === '图片' && <Image className="w-5 h-5" />}
                  {f.type === 'PPT' && <FileText className="w-5 h-5" />}
                </div>
                <button className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-[13px] font-medium text-gray-800 truncate mb-1">{f.name}</h3>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>{f.size}</span>
                <span>{f.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RAG search panel */}
      <div className="w-[280px] bg-white border-l border-gray-100 p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-3">
          <Search className="w-4 h-4 text-blue-600" />
          <span className="text-[13px] font-medium text-gray-800">RAG 语义检索</span>
        </div>
        <div className="relative mb-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="输入问题检索知识库..."
            className="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          />
        </div>

        <div className="text-[11px] text-gray-400 mb-2">检索结果 · 3条匹配</div>
        <div className="space-y-3">
          {ragResults.map((r, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{r.source}</span>
                <span className="text-[10px] text-emerald-600 font-medium">{r.score}% 匹配</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3">{r.text}</p>
              <button className="mt-2 text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                引用到课件 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
