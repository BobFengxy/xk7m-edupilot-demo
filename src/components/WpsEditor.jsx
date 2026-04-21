import { useEffect, useState, useRef } from 'react'
import {
  X, Save, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Table, Share2, Download, ChevronDown, FileText, Presentation
} from 'lucide-react'
import { getEditorSource } from '../lib/wps'

const MOCK_CONTENT = {
  PPT: [
    { title: '封面页', body: '平抛运动\n—— 高中物理必修二 第五章' },
    { title: '学习目标', body: '1. 理解平抛运动的定义与特点\n2. 掌握分运动独立性原理\n3. 会用 v₀ 与 h 推导飞行时间、射程' },
    { title: '实验探究', body: '描迹法研究平抛运动：\n· 斜槽末端必须水平\n· 每次同一位置释放小球\n· 描点后用 y=½g(x/v₀)² 求 v₀' },
    { title: '例题精讲', body: '【例】h=20m，v₀=10m/s\n求：落地时间 t = √(2h/g) = 2s\n水平射程 x = v₀·t = 20m\n落地速度 v = √(v₀²+g²t²) ≈ 22.4 m/s' },
    { title: '课堂小结', body: '平抛 = 水平匀速 + 竖直自由落体\n轨迹为抛物线\n飞行时间只由 h 决定' },
  ],
  Word: `平抛运动·教案

一、教学目标
  1. 理解平抛运动的定义与运动特征
  2. 掌握水平、竖直分运动的独立性
  3. 能推导并应用 x=v₀t、y=½gt²、t=√(2h/g)

二、教学重难点
  重点：运动的分解思想
  难点：末速度方向与位移方向不一致

三、教学过程（45min）
  1. 情境导入（5min）：篮球投篮慢动作视频
  2. 概念建构（10min）：小组讨论"水平方向受不受力？"
  3. 实验探究（15min）：描迹法 + Canvas 仿真
  4. 例题精讲（10min）：船与岛相遇问题
  5. 课堂小结（5min）：思维导图

四、板书设计
  平抛运动
    水平：匀速  v=v₀
    竖直：自由落体  v_y=gt,  y=½gt²
    飞行时间  t=√(2h/g)
    水平射程  x=v₀·t

五、作业布置
  课本 P88 习题 3、5、7`,
}

function MockToolbar({ fileType }) {
  const groups = [
    [Bold, Italic, Underline],
    [AlignLeft, AlignCenter, AlignRight],
    [List, ImageIcon, Table],
  ]
  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-200 bg-gray-50 text-gray-600 text-[12px]">
      <button className="px-2 py-1 hover:bg-white rounded flex items-center gap-1">
        文件 <ChevronDown className="w-3 h-3" />
      </button>
      <button className="px-2 py-1 hover:bg-white rounded flex items-center gap-1">
        开始 <ChevronDown className="w-3 h-3" />
      </button>
      <button className="px-2 py-1 hover:bg-white rounded flex items-center gap-1">
        插入 <ChevronDown className="w-3 h-3" />
      </button>
      <button className="px-2 py-1 hover:bg-white rounded flex items-center gap-1">
        设计 <ChevronDown className="w-3 h-3" />
      </button>
      <div className="w-px h-5 bg-gray-300 mx-2" />
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center">
          {group.map((Ico, i) => (
            <button key={i} className="p-1.5 hover:bg-white rounded text-gray-500">
              <Ico className="w-3.5 h-3.5" />
            </button>
          ))}
          {gi < groups.length - 1 && <div className="w-px h-4 bg-gray-300 mx-1" />}
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-[11px] text-gray-400">{fileType === 'PPT' ? 'WPS 演示' : 'WPS 文字'}</span>
      </div>
    </div>
  )
}

function MockPptBody({ slides }) {
  const [active, setActive] = useState(0)
  return (
    <div className="flex flex-1 min-h-0 bg-gray-100">
      <div className="w-36 bg-white border-r border-gray-200 overflow-y-auto p-2 shrink-0">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-full mb-2 p-2 text-left text-[10px] border-2 rounded ${
              i === active ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-[9px] text-gray-400 mb-1">{i + 1}</div>
            <div className="truncate font-medium text-gray-700">{s.title}</div>
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div className="bg-white shadow-xl rounded-sm w-full max-w-3xl aspect-video p-8 flex flex-col">
          <div className="h-1 w-12 bg-orange-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{slides[active].title}</h1>
          <div
            contentEditable
            suppressContentEditableWarning
            className="flex-1 text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap outline-none focus:bg-orange-50/30 rounded px-2"
          >
            {slides[active].body}
          </div>
        </div>
      </div>
    </div>
  )
}

function MockWordBody({ content }) {
  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
      <div className="mx-auto max-w-3xl bg-white shadow-sm min-h-full p-12">
        <div
          contentEditable
          suppressContentEditableWarning
          className="whitespace-pre-wrap text-[14px] leading-7 text-gray-800 font-serif outline-none focus:bg-blue-50/20 rounded"
        >
          {content}
        </div>
      </div>
    </div>
  )
}

export default function WpsEditor({ file, onClose }) {
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState(null)
  const [saved, setSaved] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    if (!file) return
    setLoading(true)
    getEditorSource(file).then((res) => {
      setSource(res)
      setLoading(false)
    })
  }, [file])

  if (!file) return null

  const isPpt = file.type === 'PPT'
  const isWord = file.type === 'Word'
  const canEdit = isPpt || isWord

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 fade-in-up">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {isPpt ? <Presentation className="w-4 h-4 text-orange-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
            <span className="text-[13px] font-medium text-gray-800">{file.name}</span>
            <span className="text-[10px] px-2 py-0.5 bg-orange-600 text-white rounded-full">WPS WebOffice</span>
            {source?.mode === 'mock' && (
              <span className="text-[10px] px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">演示模式</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 text-[12px] bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-3.5 h-3.5" />
              {saved ? '已保存' : '保存'}
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 text-[12px] text-gray-600 hover:bg-white rounded">
              <Share2 className="w-3.5 h-3.5" /> 分享
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 text-[12px] text-gray-600 hover:bg-white rounded">
              <Download className="w-3.5 h-3.5" /> 下载
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px]">
            正在打开 WPS WebOffice ...
          </div>
        ) : !canEdit ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
            <FileText className="w-10 h-10 text-gray-300" />
            <span className="text-[13px]">当前文件类型（{file.type}）暂不支持 WebOffice 在线编辑</span>
            <span className="text-[11px] text-gray-400">请下载到本地使用对应应用打开</span>
          </div>
        ) : source.mode === 'wps' ? (
          <iframe
            ref={iframeRef}
            src={source.url}
            title="WPS WebOffice"
            className="flex-1 w-full border-0"
            allow="fullscreen; clipboard-read; clipboard-write"
          />
        ) : (
          <>
            <MockToolbar fileType={file.type} />
            {isPpt ? (
              <MockPptBody slides={MOCK_CONTENT.PPT} />
            ) : (
              <MockWordBody content={MOCK_CONTENT.Word} />
            )}
          </>
        )}

        {/* Status bar */}
        <div className="px-4 py-1 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-400 flex items-center justify-between">
          <span>
            {source?.mode === 'mock'
              ? '前端 Mock 渲染 · 配置 WPS_CONFIG.appId 后自动切换为真实 WebOffice'
              : '已连接 WPS WebOffice 服务'}
          </span>
          <span>{file.size} · {file.date}</span>
        </div>
      </div>
    </div>
  )
}
