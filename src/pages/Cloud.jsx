import { useState, useRef, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Folder, FolderOpen, FileText, Image, Film, Upload,
  Plus, MoreHorizontal, HardDrive, Network, Sparkles, Database, Download,
  LayoutGrid, List as ListIcon, CheckSquare, Square, Trash2, FolderInput,
  PlayCircle, X, ChevronRight, Wand2
} from 'lucide-react'
import WpsEditor from '../components/WpsEditor'

const rawFiles = [
  { id: 'f01', name: '平抛运动PPT.pptx', type: 'PPT', size: '6.8 MB', date: '2026-04-14' },
  { id: 'f02', name: '平抛运动教案.docx', type: 'Word', size: '0.4 MB', date: '2026-04-14' },
  { id: 'f03', name: '牛顿第二定律课件.pptx', type: 'PPT', size: '7.3 MB', date: '2026-04-12' },
  { id: 'f04', name: '匀变速直线运动实验.mp4', type: '视频', size: '95 MB', date: '2026-04-10' },
  { id: 'f05', name: '力学单元测试.docx', type: 'Word', size: '0.5 MB', date: '2026-04-08' },
  { id: 'f06', name: '电磁感应PPT.pptx', type: 'PPT', size: '8.2 MB', date: '2026-04-06' },
  { id: 'f07', name: '圆周运动课件.pptx', type: 'PPT', size: '5.1 MB', date: '2026-04-05' },
  { id: 'f08', name: '机械能守恒教案.docx', type: 'Word', size: '0.3 MB', date: '2026-04-03' },
  { id: 'f09', name: '单摆运动视频.mp4', type: '视频', size: '120 MB', date: '2026-04-02' },
  { id: 'f10', name: '受力分析图.png', type: '图片', size: '1.1 MB', date: '2026-04-01' },
  { id: 'f11', name: '高考物理大纲.pdf', type: 'PDF', size: '4.5 MB', date: '2026-03-28' },
  { id: 'f12', name: '物理公式手册.md', type: 'MD', size: '0.1 MB', date: '2026-03-25' },
  { id: 'f13', name: '高三月考模拟卷.docx', type: 'Word', size: '0.8 MB', date: '2026-03-22' },
  { id: 'f14', name: '学生作业-平抛推导.pdf', type: 'PDF', size: '2.1 MB', date: '2026-03-20' },
]

// —— 自动分类规则 ——
// 规则按优先级从上到下匹配，匹配到即停止
const CATEGORIES = ['课件资源', '教案文档', '试卷题库', '实验素材', '学生作业']

function autoCategorize(file) {
  const n = file.name
  if (/作业|答卷|提交/.test(n)) return '学生作业'
  if (/教案|教学设计/.test(n)) return '教案文档'
  if (/测试|试卷|题库|大纲|模拟|月考|习题/.test(n)) return '试卷题库'
  if (/实验|演示|仿真/.test(n) || file.type === '视频' || file.type === '图片') return '实验素材'
  if (file.type === 'PPT' || /课件/.test(n)) return '课件资源'
  if (file.type === 'Word' || file.type === 'MD') return '教案文档'
  return '课件资源'
}

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

const graphEdges = [[1,5],[1,7],[1,8],[2,6],[1,2],[2,3],[1,4],[3,4]]

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
    ctx.clearRect(0, 0, 580, 380)
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1.5
    graphEdges.forEach(([a, b]) => {
      const na = graphNodes.find((n) => n.id === a)
      const nb = graphNodes.find((n) => n.id === b)
      ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke()
    })
    graphNodes.forEach((node) => {
      ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
      ctx.fillStyle = node.color; ctx.fill()
      ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)
    })
  }, [])
  return <canvas ref={canvasRef} style={{ width: '100%', height: 380 }} className="rounded-xl" />
}

async function downloadRagPack() {
  const base = import.meta.env.BASE_URL || '/'
  const url = `${base}rag-pack.zip`.replace(/\/\//g, '/')
  const a = document.createElement('a')
  a.href = url
  a.download = 'edu-pilot-rag-pack.zip'
  a.click()
}

const TYPE_COLORS = {
  PDF: 'bg-red-100 text-red-600',
  Word: 'bg-blue-100 text-blue-600',
  PPT: 'bg-orange-100 text-orange-600',
  '视频': 'bg-purple-100 text-purple-600',
  '图片': 'bg-emerald-100 text-emerald-600',
  MD: 'bg-gray-100 text-gray-600',
}

function FileIcon({ type }) {
  if (type === '视频') return <Film className="w-5 h-5" />
  if (type === '图片') return <Image className="w-5 h-5" />
  return <FileText className="w-5 h-5" />
}

// —— 演示引导 ——
const TOUR_STEPS = [
  { target: 'rag-card', title: 'RAG 知识库交付包', desc: '满足赛题「本地知识库」强制要求，支持一键下载部署 Chroma + MiniLM。' },
  { target: 'folder-tree', title: '文件自动分类', desc: '上传时根据文件名关键词和类型自动归类到 5 个标准文件夹。' },
  { target: 'view-toggle', title: '网格/列表视图切换', desc: '网格视图用于浏览，列表视图便于批量选择与管理。' },
  { target: 'rag-card-top-toolbar', title: '批量操作', desc: '按住 Shift 或点击勾选框多选，支持一键移动、删除、下载。' },
  { target: 'wps-card', title: 'WPS 在线编辑', desc: '点击 PPT/Word 卡片即可在 WPS WebOffice 中在线编辑。' },
]

function DemoTour({ onClose }) {
  const [step, setStep] = useState(0)
  const cur = TOUR_STEPS[step]
  const [rect, setRect] = useState(null)

  useEffect(() => {
    const el = document.querySelector(`[data-tour="${cur.target}"]`)
    if (!el) { setRect(null); return }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [cur])

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />
      {rect && (
        <div
          className="absolute rounded-xl ring-4 ring-orange-400 ring-offset-2 transition-all duration-300 pointer-events-none"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
          }}
        />
      )}
      <div
        className="absolute bg-white rounded-xl shadow-2xl p-4 w-80 pointer-events-auto"
        style={
          rect
            ? { top: Math.min(rect.top + rect.height + 12, window.innerHeight - 200), left: Math.min(rect.left, window.innerWidth - 340) }
            : { top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }
        }
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] flex items-center justify-center font-semibold">{step + 1}</div>
          <h4 className="text-[14px] font-semibold text-gray-800">{cur.title}</h4>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[12px] text-gray-600 mb-3 leading-relaxed">{cur.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-400">{step + 1} / {TOUR_STEPS.length}</span>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="px-3 py-1 text-[12px] text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                上一步
              </button>
            )}
            {step < TOUR_STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-3 py-1 text-[12px] bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-1">
                下一步 <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button onClick={onClose} className="px-3 py-1 text-[12px] bg-orange-500 text-white rounded hover:bg-orange-600">
                完成
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cloud() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('files')
  const [highlightRag, setHighlightRag] = useState(false)
  const [editingFile, setEditingFile] = useState(null)
  const [activeCategory, setActiveCategory] = useState('全部文件')
  const [viewMode, setViewMode] = useState('grid')
  const [selected, setSelected] = useState(() => new Set())
  const [tourOpen, setTourOpen] = useState(false)
  const [moveMenu, setMoveMenu] = useState(false)

  useEffect(() => {
    if (searchParams.get('tab') === 'rag') {
      setHighlightRag(true)
      const t = setTimeout(() => setHighlightRag(false), 2500)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  // 给每个文件标注自动分类
  const classifiedFiles = useMemo(
    () => rawFiles.map((f) => ({ ...f, category: autoCategorize(f) })),
    []
  )

  const counts = useMemo(() => {
    const m = { 全部文件: classifiedFiles.length }
    CATEGORIES.forEach((c) => (m[c] = 0))
    classifiedFiles.forEach((f) => (m[f.category] = (m[f.category] || 0) + 1))
    return m
  }, [classifiedFiles])

  const visibleFiles = useMemo(() => {
    if (activeCategory === '全部文件') return classifiedFiles
    return classifiedFiles.filter((f) => f.category === activeCategory)
  }, [classifiedFiles, activeCategory])

  const allChecked = visibleFiles.length > 0 && visibleFiles.every((f) => selected.has(f.id))
  const toggleOne = (id) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }
  const toggleAll = () => {
    if (allChecked) setSelected(new Set())
    else setSelected(new Set(visibleFiles.map((f) => f.id)))
  }
  const clearSelection = () => setSelected(new Set())
  const moveTo = (cat) => {
    // Demo-only: write in-place category; no persistence
    selected.forEach((id) => {
      const f = classifiedFiles.find((x) => x.id === id)
      if (f) f.category = cat
    })
    setMoveMenu(false)
    setSelected(new Set())
  }

  return (
    <div className="flex h-full fade-in-up">
      {/* Folder tree */}
      <div className="w-[200px] bg-white border-r border-gray-100 p-4 shrink-0" data-tour="folder-tree">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-gray-800">我的云盘</span>
          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {['全部文件', ...CATEGORIES].map((name) => {
          const active = activeCategory === name
          return (
            <div
              key={name}
              onClick={() => { setActiveCategory(name); setSelected(new Set()) }}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {active ? <FolderOpen className="w-4 h-4 shrink-0" /> : <Folder className="w-4 h-4 shrink-0" />}
              <span className="text-[12px] flex-1 truncate">{name}</span>
              <span className="text-[10px] text-gray-400">{counts[name] || 0}</span>
            </div>
          )
        })}

        <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-1 text-emerald-700 mb-1">
            <Wand2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">自动分类已启用</span>
          </div>
          <p className="text-[10px] text-emerald-600 leading-relaxed">基于文件名关键词 + 类型自动归类</p>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTourOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors font-medium"
            >
              <PlayCircle className="w-3.5 h-3.5" /> 一键演示
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-3.5 h-3.5" /> 上传文件
            </button>
          </div>
        </div>

        {activeTab === 'files' ? (
          <>
            {/* RAG pack card */}
            <div
              data-tour="rag-card"
              className={`mb-4 p-4 rounded-2xl border transition-all ${
                highlightRag ? 'border-violet-400 bg-gradient-to-r from-violet-50 to-blue-50 ring-4 ring-violet-200' :
                'border-violet-200 bg-gradient-to-r from-violet-50/60 to-blue-50/60'
              }`}
            >
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
                    覆盖高中物理 7 大章节 · 30 个知识点 × 6 维度（教学设计/实验素材/例题/版式/学史），all-MiniLM-L6-v2 + Chroma 一键本地部署，满足赛题「本地知识库 RAG」强制要求。
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadRagPack}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-[12px] rounded-lg hover:bg-violet-700"
                    >
                      <Download className="w-3.5 h-3.5" /> 一键下载 rag-pack.zip
                    </button>
                    <span className="text-[11px] text-gray-400">knowledge.json · build_db.py · start_rag.py · requirements.txt · README.md</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar: category breadcrumb + batch + view toggle */}
            <div data-tour="rag-card-top-toolbar" className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {allChecked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                  全选
                </button>
                <span className="text-[13px] text-gray-800 font-medium">{activeCategory}</span>
                <span className="text-[11px] text-gray-400">{visibleFiles.length} 个文件</span>
                {selected.size > 0 && (
                  <>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <span className="text-[12px] text-blue-600">已选 {selected.size} 项</span>
                    <div className="relative">
                      <button
                        onClick={() => setMoveMenu((v) => !v)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        <FolderInput className="w-3.5 h-3.5" /> 移动到
                      </button>
                      {moveMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 w-32">
                          {CATEGORIES.map((c) => (
                            <button
                              key={c}
                              onClick={() => moveTo(c)}
                              className="w-full text-left px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <Download className="w-3.5 h-3.5" /> 下载
                    </button>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" /> 删除
                    </button>
                    <button onClick={clearSelection} className="px-2.5 py-1.5 text-[12px] text-gray-400 hover:text-gray-600">
                      取消
                    </button>
                  </>
                )}
              </div>
              <div data-tour="view-toggle" className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  title="网格视图"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  title="列表视图"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* File list */}
            {visibleFiles.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-[13px]">
                该分类下暂无文件
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-3">
                {visibleFiles.map((f, i) => {
                  const editable = f.type === 'PPT' || f.type === 'Word'
                  const checked = selected.has(f.id)
                  const tourAttr = i === 0 ? { 'data-tour': 'wps-card' } : {}
                  return (
                    <div
                      key={f.id}
                      {...tourAttr}
                      onClick={() => editable && setEditingFile(f)}
                      className={`relative bg-white rounded-2xl border p-4 hover:shadow-md transition-all group ${
                        checked ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-200'
                      } ${editable ? 'cursor-pointer' : ''}`}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleOne(f.id) }}
                        className={`absolute top-3 left-3 ${checked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                      >
                        {checked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-gray-400" />}
                      </button>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`ml-6 w-10 h-10 rounded-lg ${TYPE_COLORS[f.type] || 'bg-gray-100 text-gray-600'} flex items-center justify-center`}>
                          <FileIcon type={f.type} />
                        </div>
                        <button className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="text-[13px] font-medium text-gray-800 truncate mb-1">{f.name}</h3>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                        <span>{f.size}</span>
                        <span>{f.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{f.category}</span>
                        {editable && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingFile(f) }}
                            className="text-[10px] flex items-center gap-0.5 text-blue-600 hover:underline"
                          >
                            <Sparkles className="w-3 h-3" /> WPS 编辑
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-[36px_1fr_100px_100px_120px_120px_80px] items-center text-[11px] text-gray-400 px-3 py-2 border-b border-gray-100 bg-gray-50">
                  <span />
                  <span>文件名</span>
                  <span>类型</span>
                  <span>分类</span>
                  <span>大小</span>
                  <span>修改时间</span>
                  <span>操作</span>
                </div>
                {visibleFiles.map((f, i) => {
                  const editable = f.type === 'PPT' || f.type === 'Word'
                  const checked = selected.has(f.id)
                  const tourAttr = i === 0 ? { 'data-tour': 'wps-card' } : {}
                  return (
                    <div
                      key={f.id}
                      {...tourAttr}
                      onClick={() => editable && setEditingFile(f)}
                      className={`grid grid-cols-[36px_1fr_100px_100px_120px_120px_80px] items-center px-3 py-2 border-b border-gray-50 last:border-0 text-[12px] hover:bg-blue-50/30 transition-colors ${
                        checked ? 'bg-blue-50/50' : ''
                      } ${editable ? 'cursor-pointer' : ''}`}
                    >
                      <button onClick={(e) => { e.stopPropagation(); toggleOne(f.id) }}>
                        {checked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-gray-300 hover:text-gray-500" />}
                      </button>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded ${TYPE_COLORS[f.type] || 'bg-gray-100 text-gray-600'} flex items-center justify-center shrink-0`}>
                          <FileIcon type={f.type} />
                        </div>
                        <span className="text-gray-800 truncate">{f.name}</span>
                      </div>
                      <span className="text-gray-500">{f.type}</span>
                      <span className="text-gray-500">{f.category}</span>
                      <span className="text-gray-500">{f.size}</span>
                      <span className="text-gray-500">{f.date}</span>
                      <span>
                        {editable && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingFile(f) }}
                            className="text-blue-600 hover:underline"
                          >
                            WPS 编辑
                          </button>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[14px] font-medium text-gray-800 mb-4">知识点关联图谱</h3>
            <KnowledgeGraph />
            <p className="text-[12px] text-gray-400 text-center mt-3">节点大小表示关联资源数量，连线表示知识点关联关系</p>
          </div>
        )}
      </div>

      {editingFile && <WpsEditor file={editingFile} onClose={() => setEditingFile(null)} />}
      {tourOpen && <DemoTour onClose={() => setTourOpen(false)} />}
    </div>
  )
}
