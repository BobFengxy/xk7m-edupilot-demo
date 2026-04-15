import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Folder, FolderOpen, FileText, Image, Film, Upload, File,
  Plus, MoreHorizontal, HardDrive, Network, Sparkles, Database, Download
} from 'lucide-react'

const folders = [
  { name: '全部文件', count: 21, open: true },
  { name: '课件资源', count: 8 },
  { name: '教案文档', count: 5 },
  { name: '试卷题库', count: 4 },
  { name: '实验素材', count: 3 },
  { name: '学生作业', count: 1 },
]

const files = [
  { name: '平抛运动PPT.pptx', type: 'PPT', size: '6.8 MB', date: '2026-04-14' },
  { name: '平抛运动教案.docx', type: 'Word', size: '0.4 MB', date: '2026-04-14' },
  { name: '牛顿第二定律课件.pptx', type: 'PPT', size: '7.3 MB', date: '2026-04-12' },
  { name: '匀变速直线运动实验.mp4', type: '视频', size: '95 MB', date: '2026-04-10' },
  { name: '力学单元测试.docx', type: 'Word', size: '0.5 MB', date: '2026-04-08' },
  { name: '电磁感应PPT.pptx', type: 'PPT', size: '8.2 MB', date: '2026-04-06' },
  { name: '圆周运动课件.pptx', type: 'PPT', size: '5.1 MB', date: '2026-04-05' },
  { name: '机械能守恒教案.docx', type: 'Word', size: '0.3 MB', date: '2026-04-03' },
  { name: '单摆运动视频.mp4', type: '视频', size: '120 MB', date: '2026-04-02' },
  { name: '受力分析图.png', type: '图片', size: '1.1 MB', date: '2026-04-01' },
  { name: '高考物理大纲.pdf', type: 'PDF', size: '4.5 MB', date: '2026-03-28' },
  { name: '物理公式手册.md', type: 'MD', size: '0.1 MB', date: '2026-03-25' },
]

const graphNodes = [
  { id: 1, label: '力学', x: 200, y: 150, r: 35, color: '#2563eb' },
  { id: 2, label: '电磁学', x: 400, y: 120, r: 30, color: '#6366f1' },
  { id: 3, label: '光学', x: 350, y: 280, r: 25, color: '#10b981' },
  { id: 4, label: '热力学', x: 150, y: 300, r: 22, color: '#f59e0b' },
  { id: 5, label: '牛顿定律', x: 100, y: 180, r: 20, color: '#3b82f6' },
  { id: 6, label: '电磁感应', x: 480, y: 200, r: 20, color: '#8b5cf6' },
  { id: 7, label: '万有引力', x: 250, y: 80, r: 18, color: '#06b6d4' },
  { id: 8, label: '动量守恒', x: 80, y: 280, r: 18, color: '#0ea5e9' },
]

const graphEdges = [
  [1, 5], [1, 7], [1, 8], [2, 6], [1, 2], [2, 3], [1, 4], [3, 4]
]

function KnowledgeGraph() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = 580 * dpr
    canvas.height = 380 * dpr
    ctx.scale(dpr, dpr)

    // Edges
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1.5
    graphEdges.forEach(([from, to]) => {
      const a = graphNodes.find(n => n.id === from)
      const b = graphNodes.find(n => n.id === to)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    })

    // Nodes
    graphNodes.forEach(node => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
      ctx.fillStyle = node.color + '20'
      ctx.fill()
      ctx.strokeStyle = node.color
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = node.color
      ctx.font = `${node.r > 25 ? 13 : 11}px -apple-system, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)
    })
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: 380 }} className="rounded-xl" />
}

function downloadRagPack() {
  // Demo: generate a JSON descriptor on the fly and download.
  const pack = {
    name: '人教版高中物理 RAG 知识库',
    version: '1.0.0',
    description: '对标人教版高中物理必修一、必修二、选择性必修全册，已完成文本分块与向量化',
    modules: ['教材知识点', '高考考纲', '经典题库', '教学案例', '实验素材'],
    chunks: 1284,
    embedding_dim: 1024,
    deploy: 'pip install -r requirements.txt && python start_rag.py',
    note: '本次下载为演示描述包；完整 Chroma 向量库将通过赛题交付渠道提供。',
  }
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '人教版高中物理RAG知识库_descriptor.json'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Cloud() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('files')
  const [highlightRag, setHighlightRag] = useState(false)

  useEffect(() => {
    if (searchParams.get('tab') === 'rag') {
      setHighlightRag(true)
      const t = setTimeout(() => setHighlightRag(false), 2500)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  return (
    <div className="flex h-full fade-in-up">
      {/* Folder tree */}
      <div className="w-[200px] bg-white border-r border-gray-100 p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-gray-800">我的云盘</span>
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

        <div className="mt-6 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] text-gray-600 font-medium">存储空间</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }} />
          </div>
          <span className="text-[10px] text-gray-400">3.5 GB / 10 GB</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-5 overflow-auto min-h-0 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('files')} className={`px-4 py-1.5 text-[13px] rounded-md transition-all ${activeTab === 'files' ? 'bg-white text-blue-600 font-medium shadow-sm' : 'text-gray-600'}`}>
              文件管理
            </button>
            <button onClick={() => setActiveTab('graph')} className={`px-4 py-1.5 text-[13px] rounded-md transition-all flex items-center gap-1 ${activeTab === 'graph' ? 'bg-white text-blue-600 font-medium shadow-sm' : 'text-gray-600'}`}>
              <Network className="w-3.5 h-3.5" /> 我的教学图谱
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-3.5 h-3.5" /> 上传文件
          </button>
        </div>

        {activeTab === 'files' ? (
          <>
          {/* RAG pack — prominent card */}
          <div className={`mb-4 p-4 rounded-2xl border transition-all ${
            highlightRag ? 'border-violet-400 bg-gradient-to-r from-violet-50 to-blue-50 ring-4 ring-violet-200' :
            'border-violet-200 bg-gradient-to-r from-violet-50/60 to-blue-50/60'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[14px] font-semibold text-gray-800">人教版高中物理 RAG 知识库</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-violet-600 text-white rounded-full">赛题必备</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">可下载 · 可部署</span>
                </div>
                <p className="text-[12px] text-gray-600 mb-2">
                  对标人教版全册，1284 个知识分块，已向量化（1024 维），一键部署到本地 Chroma，满足赛题「本地知识库 RAG」强制要求。
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadRagPack}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-[12px] rounded-lg hover:bg-violet-700"
                  >
                    <Download className="w-3.5 h-3.5" /> 一键下载（演示描述包）
                  </button>
                  <span className="text-[11px] text-gray-400">~12.4 MB · requirements + start_rag.py + chroma_db/</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {files.map((f, i) => {
              const typeColors = {
                PDF: 'bg-red-100 text-red-600',
                Word: 'bg-blue-100 text-blue-600',
                PPT: 'bg-orange-100 text-orange-600',
                '视频': 'bg-purple-100 text-purple-600',
                '图片': 'bg-emerald-100 text-emerald-600',
                MD: 'bg-gray-100 text-gray-600',
              }
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${typeColors[f.type] || 'bg-gray-100 text-gray-600'} flex items-center justify-center`}>
                      {f.type === '视频' ? <Film className="w-5 h-5" /> :
                       f.type === '图片' ? <Image className="w-5 h-5" /> :
                       <FileText className="w-5 h-5" />}
                    </div>
                    <button className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-[13px] font-medium text-gray-800 truncate mb-1">{f.name}</h3>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
                    <span>{f.size}</span>
                    <span>{f.date}</span>
                  </div>
                  {(f.type === 'PPT' || f.type === 'Word') && (
                    <button className="w-full flex items-center justify-center gap-1 py-1.5 text-[11px] text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      <Sparkles className="w-3 h-3" /> AI 编辑
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-medium text-gray-800 mb-4">知识点关联图谱</h3>
            <KnowledgeGraph />
            <p className="text-[12px] text-gray-400 text-center mt-3">节点大小表示关联资源数量，连线表示知识点关联关系</p>
          </div>
        )}
      </div>
    </div>
  )
}
