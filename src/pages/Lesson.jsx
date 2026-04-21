import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Check, ChevronLeft, ChevronRight, Download, Eye, Sparkles,
  GripVertical, Gamepad2, Film, BookOpen,
  FileText, RotateCcw, MessageSquare, Loader2, SendHorizontal,
  History, Wand2, X
} from 'lucide-react'
import ProjectileAnimation from '../components/ProjectileAnimation'
import { pseudoRAG, modifySlideContent, clarifyAnswer } from '../lib/deepseek'
import { exportPptx, exportDocx } from '../lib/export'

const defaultSlides = (topic) => [
  { id: 1, title: topic || '平抛运动', subtitle: '高中物理 · 必修一 · 运动的合成与分解', type: 'cover', content: '' },
  { id: 2, title: '教学目标', type: 'text', content: '1. 理解平抛运动是匀变速曲线运动，掌握其水平方向匀速、竖直方向自由落体的合运动规律\n2. 能用运动的合成与分解方法分析平抛运动\n3. 会推导水平位移、竖直位移、落地时间与速度的表达式' },
  { id: 3, title: '概念导入', type: 'text', content: '将物体以一定初速度水平抛出，只在重力作用下的运动称为平抛运动。现实生活中：投篮、炮弹出膛、跳台跳水起跳后的运动，均可近似看作平抛运动。' },
  { id: 4, title: '互动实验', type: 'interactive', icon: '🎮', content: '' },
  { id: 5, title: '实验演示', type: 'text', content: '频闪照片实验：水平方向上，小球每隔相等时间通过相等距离——匀速直线运动；竖直方向上，小球通过的距离逐渐增大，与自由落体一致。' },
  { id: 6, title: '公式推导', type: 'text', content: '水平方向：x = v₀·t\n竖直方向：y = ½·g·t²\n落地时间：t = √(2h/g)\n水平射程：x = v₀·√(2h/g)\n合速度大小：v = √(v₀² + (g·t)²)' },
  { id: 7, title: '例题精讲', type: 'text', content: '例：小球以 10 m/s 水平抛出，离地 5 m。求：\n(1) 落地时间 t = √(2·5/9.8) ≈ 1.01 s\n(2) 水平射程 x = 10 × 1.01 ≈ 10.1 m\n(3) 落地瞬时速度竖直分量 vy = g·t ≈ 9.9 m/s' },
  { id: 8, title: '课堂练习', type: 'interactive', icon: '🎮', content: '' },
  { id: 9, title: '知识小结', type: 'text', content: '平抛运动 = 水平匀速 + 竖直自由落体\n两个分运动相互独立，同时进行\n轨迹为抛物线的一部分\n运动合成与分解是分析曲线运动的核心方法' },
  { id: 10, title: '课后作业', type: 'text', content: '教材 P42 练习题 3、5、7\n思考题：若空气阻力不可忽略，平抛运动的轨迹与射程会发生什么变化？' },
  { id: 11, title: '拓展阅读', type: 'text', content: '斜抛运动、抛体运动一般情况、空气阻力对抛体的影响（2024 全国甲卷 T21 关联考点）' },
  { id: 12, title: '致谢', type: 'cover', subtitle: 'Edu-Pilot · AI 生成课件', content: '' },
]

const examPoints = [
  { name: '平抛运动规律应用', freq: '高频', color: 'text-red-500 bg-red-50' },
  { name: '运动的合成与分解', freq: '高频', color: 'text-red-500 bg-red-50' },
  { name: '抛体运动轨迹分析', freq: '中频', color: 'text-amber-500 bg-amber-50' },
  { name: '匀变速曲线运动', freq: '低频', color: 'text-blue-500 bg-blue-50' },
]

const clarifyQuestions = [
  { key: 'objective', q: '本节课的教学目标与重难点？', suggestions: ['理解平抛运动规律', '掌握运动合成与分解', '兼顾能力培养'] },
  { key: 'duration', q: '课时时长？', suggestions: ['1 课时', '2 课时', '3 课时'] },
  { key: 'level', q: '班级水平？', suggestions: ['基础班', '中等班', '拔高班'] },
  { key: 'style', q: '课件风格偏好？', suggestions: ['严谨推导', '生活案例导入', '高考真题引路'] },
  { key: 'animation', q: '是否保留平抛运动互动动画？', suggestions: ['保留', '不保留'] },
]

const stepLabels = ['输入主题', '澄清需求', '生成中', 'PPT预览']

export default function Lesson() {
  const [searchParams] = useSearchParams()
  const urlTopic = searchParams.get('topic') || ''

  const [stage, setStage] = useState(urlTopic ? 2 : 1)
  const [topic, setTopic] = useState(urlTopic || '平抛运动')
  const [slides, setSlides] = useState(() => defaultSlides(urlTopic || '平抛运动'))
  const [currentSlide, setCurrentSlide] = useState(4)

  // Step 2 state
  const [clarifyIdx, setClarifyIdx] = useState(0)
  const [clarifyMsgs, setClarifyMsgs] = useState([])
  const [clarifyInput, setClarifyInput] = useState('')
  const [clarifyBusy, setClarifyBusy] = useState(false)

  // Step 4 state
  const [showTrace, setShowTrace] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [difficulty, setDifficulty] = useState(50)
  const [versions, setVersions] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [globalInput, setGlobalInput] = useState('')
  const [globalBusy, setGlobalBusy] = useState(false)

  // RAG panel
  const [ragItems, setRagItems] = useState([])
  const [ragLoading, setRagLoading] = useState(false)

  // Load pseudo-RAG on topic
  useEffect(() => {
    if (!topic) return
    setRagLoading(true)
    pseudoRAG(topic)
      .then(r => setRagItems(r?.items || []))
      .catch(() => setRagItems([]))
      .finally(() => setRagLoading(false))
  }, [topic])

  // Init clarify dialog when entering step 2
  useEffect(() => {
    if (stage === 2 && clarifyMsgs.length === 0) {
      setClarifyMsgs([
        { role: 'ai', text: `您好！我来帮您备「${topic}」这节课，先确认几个细节。` },
        { role: 'ai', text: clarifyQuestions[0].q, suggestions: clarifyQuestions[0].suggestions },
      ])
    }
  }, [stage, topic, clarifyMsgs.length])

  const steps = useMemo(() => stepLabels.map((label, i) => ({
    id: i + 1, label,
    status: stage > i + 1 ? 'done' : stage === i + 1 ? 'active' : 'pending',
  })), [stage])

  const submitClarify = async (ans) => {
    if (!ans.trim() || clarifyBusy) return
    setClarifyBusy(true)
    const q = clarifyQuestions[clarifyIdx]
    const msgs = [...clarifyMsgs, { role: 'user', text: ans }]
    setClarifyMsgs(msgs)
    setClarifyInput('')
    try {
      const conf = await clarifyAnswer(q.key, ans)
      msgs.push({ role: 'ai', text: conf || '好的，已记录。' })
    } catch {
      msgs.push({ role: 'ai', text: '好的，已记录。' })
    }
    const next = clarifyIdx + 1
    if (next < clarifyQuestions.length) {
      const nq = clarifyQuestions[next]
      msgs.push({ role: 'ai', text: nq.q, suggestions: nq.suggestions })
      setClarifyMsgs([...msgs])
      setClarifyIdx(next)
    } else {
      msgs.push({ role: 'ai', text: '✅ 全部需求已确认，开始生成课件...' })
      setClarifyMsgs([...msgs])
      setStage(3)
      setTimeout(() => setStage(4), 3000)
    }
    setClarifyBusy(false)
  }

  const acceptAllDefaults = () => {
    setStage(3)
    setTimeout(() => setStage(4), 2500)
  }

  const pushVersion = (note) => {
    setVersions(v => [
      ...v,
      { time: new Date().toLocaleTimeString('zh-CN', { hour12: false }), slides: JSON.parse(JSON.stringify(slides)), note },
    ].slice(-5))
  }

  const handleLocalModify = async (request) => {
    if (!request.trim() || aiBusy) return
    const slide = slides[currentSlide - 1]
    if (!slide?.content) {
      setAiInput('')
      return
    }
    setAiBusy(true)
    pushVersion(`第 ${currentSlide} 页 · ${request.slice(0, 16)}`)
    try {
      const modified = await modifySlideContent(slide.content, request)
      setSlides(s => s.map((x, i) => i === currentSlide - 1 ? { ...x, content: modified } : x))
    } catch (e) {
      console.error(e)
    }
    setAiBusy(false)
    setAiInput('')
  }

  const handleGlobalModify = async () => {
    if (!globalInput.trim() || globalBusy) return
    setGlobalBusy(true)
    pushVersion(`全局 · ${globalInput.slice(0, 16)}`)
    try {
      const updated = await Promise.all(slides.map(async (s) => {
        if (s.type === 'text' && s.content) {
          try {
            const m = await modifySlideContent(s.content, globalInput)
            return { ...s, content: m }
          } catch { return s }
        }
        return s
      }))
      setSlides(updated)
    } catch (e) { console.error(e) }
    setGlobalBusy(false)
    setGlobalInput('')
  }

  const revertTo = (idx) => {
    const v = versions[idx]
    if (!v) return
    setSlides(v.slides)
    setVersions(versions.slice(0, idx))
    setShowHistory(false)
  }

  const slide = slides[currentSlide - 1]

  return (
    <div className="flex h-full fade-in-up">
      {/* Left sidebar - Steps */}
      <div className="w-[200px] bg-white border-r border-gray-100 p-4 shrink-0 overflow-y-auto">
        <div className="text-[12px] text-gray-400 font-medium mb-4 uppercase tracking-wider">备课流程</div>
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-3 mb-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0 ${
                step.status === 'done' ? 'bg-emerald-500 text-white' :
                step.status === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                'bg-gray-200 text-gray-500'
              }`}>
                {step.status === 'done' ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 h-8 my-1 ${step.status === 'done' ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className={`pt-1 text-[13px] ${
              step.status === 'active' ? 'text-blue-600 font-medium' :
              step.status === 'done' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {step.label}
              {step.status === 'active' && <div className="text-[11px] text-blue-400 mt-0.5">当前步骤</div>}
            </div>
          </div>
        ))}

        <div className="mt-6 p-3 bg-gray-50 rounded-xl">
          <div className="text-[11px] text-gray-400 font-medium mb-2">当前备课信息</div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between"><span className="text-gray-500">学科</span><span className="text-gray-800 font-medium">高中物理</span></div>
            <div className="flex justify-between"><span className="text-gray-500">主题</span><span className="text-gray-800 font-medium truncate max-w-[90px]">{topic}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">阶段</span><span className="text-gray-800 font-medium">{stepLabels[stage - 1]}</span></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-bg-base">
        {stage === 1 && <Step1 topic={topic} setTopic={setTopic} onNext={() => setStage(2)} />}
        {stage === 2 && (
          <Step2
            topic={topic}
            msgs={clarifyMsgs}
            input={clarifyInput}
            setInput={setClarifyInput}
            busy={clarifyBusy}
            onSubmit={submitClarify}
            onAcceptDefaults={acceptAllDefaults}
            currentQuestion={clarifyQuestions[clarifyIdx]}
            progress={clarifyIdx + 1}
            total={clarifyQuestions.length}
          />
        )}
        {stage === 3 && <Step3 />}
        {stage === 4 && (
          <Step4Preview
            topic={topic}
            slides={slides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            slide={slide}
            showTrace={showTrace}
            setShowTrace={setShowTrace}
            showAIChat={showAIChat}
            setShowAIChat={setShowAIChat}
            aiInput={aiInput}
            setAiInput={setAiInput}
            aiBusy={aiBusy}
            onLocalModify={handleLocalModify}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            versions={versions}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            onRevert={revertTo}
            ragItems={ragItems}
          />
        )}
      </div>

      {/* Right sidebar - Knowledge + global modify */}
      <div className="w-[260px] bg-white border-l border-gray-100 p-4 overflow-y-auto shrink-0">
        <div className="flex items-center gap-1.5 mb-4">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="text-[13px] font-medium text-gray-800">RAG 知识库</span>
          {ragLoading && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
        </div>
        <div className="space-y-2 mb-6">
          {ragItems.length > 0 ? ragItems.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
              <div className="text-[12px] text-gray-700 group-hover:text-blue-700 mb-1 font-medium">{item.q}</div>
              {item.content && <div className="text-[11px] text-gray-500 mb-1 line-clamp-2">{item.content}</div>}
              <div className="text-[10px] text-gray-400">{item.source}</div>
            </div>
          )) : (
            <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-400">
              {ragLoading ? '正在检索人教版教材...' : '输入主题后自动检索'}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="text-[12px] font-medium text-gray-700 mb-3">考纲高频考点</div>
          <div className="space-y-1.5">
            {examPoints.map((point, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[12px] text-gray-600">{point.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${point.color}`}>{point.freq}</span>
              </div>
            ))}
          </div>
        </div>

        {stage === 4 && (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-[12px] font-medium text-gray-700 mb-2">全局修改</div>
            <textarea
              value={globalInput}
              onChange={(e) => setGlobalInput(e.target.value)}
              placeholder="如：把所有页面的字体调大；把所有案例换成高考真题"
              className="w-full text-[11px] p-2 border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              rows={3}
            />
            <button
              onClick={handleGlobalModify}
              disabled={globalBusy || !globalInput.trim()}
              className="w-full mt-2 py-1.5 text-[11px] font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1"
            >
              {globalBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              {globalBusy ? '修改中...' : '应用到全部'}
            </button>
          </div>
        )}
      </div>

      {/* History modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90vw] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span className="text-[14px] font-medium text-gray-800">修改历史</span>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            {versions.length === 0 ? (
              <div className="text-[12px] text-gray-400 text-center py-6">暂无修改记录</div>
            ) : (
              <div className="space-y-2">
                {versions.map((v, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-blue-50 transition-colors">
                    <div>
                      <div className="text-[12px] text-gray-700 font-medium">{v.note}</div>
                      <div className="text-[11px] text-gray-400">{v.time}</div>
                    </div>
                    <button onClick={() => revertTo(i)} className="px-3 py-1 text-[11px] text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg">
                      回退到此版本
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Step1({ topic, setTopic, onNext }) {
  return (
    <div className="flex-1 p-8 overflow-auto flex items-center justify-center">
      <div className="relative w-full max-w-[560px] glass-card rounded-2xl p-7 overflow-hidden">
        {/* decorative orbit */}
        <div className="pointer-events-none absolute -top-14 -right-14 w-44 h-44 rounded-full border border-indigo-300/30" />
        <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full border border-indigo-300/20" />
        <div className="relative flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-accent flex items-center justify-center shadow-lg shadow-indigo-500/25 group">
            <BookOpen className="w-4.5 h-4.5 text-white icon-wobble-hover" />
          </div>
          <h2 className="text-[17px] font-semibold text-slate-900 tracking-tight">输入教学主题</h2>
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="如：平抛运动"
          className="relative w-full px-4 py-3 text-[14px] glass-input rounded-xl outline-none text-slate-800 placeholder:text-slate-400"
        />
        <label className="relative flex items-center gap-2 mt-4 text-[13px] text-slate-600 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
          生成互动动画（平抛运动 Canvas 仿真）
        </label>
        <button
          onClick={() => topic.trim() && onNext()}
          className="group relative mt-5 w-full py-2.5 bg-gradient-to-br from-primary to-indigo-accent text-white text-[14px] font-semibold rounded-xl btn-press shadow-lg shadow-indigo-500/25 cursor-pointer flex items-center justify-center gap-1.5"
        >
          下一步 · 澄清需求
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}

function Step2({ topic, msgs, input, setInput, busy, onSubmit, onAcceptDefaults, currentQuestion, progress, total }) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-5 py-3 glass-panel border-l-0 border-r-0 border-t-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-accent icon-spin-hover" />
          <span className="text-[13px] font-semibold text-slate-800 tracking-tight">多轮对话澄清需求 · 「{topic}」</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono">进度 {progress}/{total}</span>
          <button onClick={onAcceptDefaults} className="px-3 py-1 text-[11px] text-emerald-700 bg-emerald-50/80 border border-emerald-200/70 rounded-lg btn-press cursor-pointer">
            一键默认确认
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} fade-in-up`}>
            <div className="max-w-[75%]">
              <div className={`px-4 py-2.5 rounded-2xl text-[13px] ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-indigo-accent text-white shadow-lg shadow-indigo-500/25'
                  : 'glass-card text-slate-700'
              }`}>
                {m.text}
              </div>
              {m.suggestions && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => onSubmit(s)}
                      disabled={busy}
                      className="px-2.5 py-1 text-[11px] text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 rounded-full"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span className="text-[12px] text-gray-500">AI 确认中...</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(input) }}
            placeholder={currentQuestion?.q || '回答当前问题...'}
            disabled={busy}
            className="flex-1 px-3 py-2 text-[13px] border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
          />
          <button
            onClick={() => onSubmit(input)}
            disabled={busy || !input.trim()}
            className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40"
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Step3() {
  const nodes = ['RAG 检索', '备课方案', 'PPT 渲染', '动画生成']
  const [i, setI] = useState(0)
  useEffect(() => {
    if (i >= nodes.length - 1) return
    const t = setTimeout(() => setI(i + 1), 700)
    return () => clearTimeout(t)
  }, [i])
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <div className="text-[14px] font-medium text-gray-800 mb-4">AI 正在生成课件</div>
        <div className="space-y-2">
          {nodes.map((n, idx) => (
            <div key={n} className="flex items-center gap-2 text-[12px] justify-center min-w-[200px]">
              {idx < i ? <Check className="w-3.5 h-3.5 text-emerald-500" /> :
               idx === i ? <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" /> :
               <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
              <span className={idx <= i ? 'text-gray-800' : 'text-gray-400'}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step4Preview({
  topic, slides, currentSlide, setCurrentSlide, slide,
  showTrace, setShowTrace, showAIChat, setShowAIChat,
  aiInput, setAiInput, aiBusy, onLocalModify,
  difficulty, setDifficulty,
  versions, showHistory, setShowHistory, onRevert, ragItems,
}) {
  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[12px] px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5" />
            生成完成
          </div>
          <span className="text-[13px] text-gray-800 font-medium">{topic} — 教学课件</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHistory(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <History className="w-3.5 h-3.5" /> 历史版本 {versions.length > 0 && <span className="text-blue-600">({versions.length})</span>}
          </button>
          <button onClick={() => exportPptx(topic, slides)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-3.5 h-3.5" /> 下载PPT
          </button>
          <button onClick={() => exportDocx(topic, slides)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <FileText className="w-3.5 h-3.5" /> 下载教案
          </button>
          <button onClick={() => setShowTrace(!showTrace)} className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors ${showTrace ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'}`}>
            <Eye className="w-3.5 h-3.5" /> 知识溯源
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Thumbnails */}
        <div className="w-[150px] bg-white border-r border-gray-100 p-3 overflow-y-auto shrink-0">
          {slides.map((s) => (
            <div
              key={s.id}
              onClick={() => setCurrentSlide(s.id)}
              className={`mb-2 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                currentSlide === s.id ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className={`aspect-[16/10] flex flex-col items-center justify-center text-center p-2 relative ${
                s.type === 'cover' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' :
                s.type === 'interactive' ? 'bg-gradient-to-br from-violet-50 to-purple-50' :
                'bg-white'
              }`}>
                {s.icon && <span className="text-lg mb-0.5">{s.icon}</span>}
                <span className={`text-[10px] ${s.type === 'cover' ? 'text-white' : 'text-gray-600'}`}>{s.title}</span>
                {s.type === 'interactive' && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                    <Gamepad2 className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50">
                <GripVertical className="w-3 h-3 text-gray-300" />
                <span className="text-[10px] text-gray-400">{s.id}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main preview */}
        <div className="flex-1 p-6 flex flex-col items-center min-w-0 min-h-0 overflow-auto">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))} className="p-1.5 hover:bg-white rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <span className="text-[13px] text-gray-600 font-medium">{currentSlide} / {slides.length}</span>
            <button onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))} className="p-1.5 hover:bg-white rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-white rounded-lg">
              <button onClick={() => setShowAIChat(!showAIChat)} className="flex items-center gap-1.5 text-[12px] text-violet-600 hover:bg-violet-50 px-2 py-1 rounded-md">
                <Sparkles className="w-3.5 h-3.5" /> 圈选修改
              </button>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[11px] text-gray-400">难度:</span>
              <span className="text-[11px] text-blue-500">基础</span>
              <input type="range" min="0" max="100" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-24 h-1.5 accent-blue-600" />
              <span className="text-[11px] text-red-500">拔高</span>
            </div>
          </div>

          <div className="w-full max-w-[780px] aspect-[16/10] bg-white rounded-xl shadow-lg overflow-hidden relative slide-in">
            {slide?.type === 'interactive' ? (
              <ProjectileAnimation />
            ) : slide?.type === 'cover' ? (
              <div className="h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center p-10">
                <div className="w-14 h-14 mb-4 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{slide.title}</h2>
                <p className="text-white/70 text-[14px] mb-6">{slide.subtitle || '高中物理 · AI 生成课件'}</p>
              </div>
            ) : (
              <div className="h-full p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">{slide?.title}</h3>
                </div>
                <div className="flex-1 text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{slide?.content}</div>
              </div>
            )}

            {showTrace && (
              <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl p-4 w-[220px]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[12px] font-medium text-blue-600">知识溯源</span>
                </div>
                <div className="space-y-2">
                  {ragItems.slice(0, 2).map((item, i) => (
                    <div key={i} className="p-2 bg-blue-50 rounded-lg border-l-2 border-blue-400">
                      <div className="text-[11px] text-blue-700 font-medium">{item.source}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{item.content || item.q}</div>
                    </div>
                  ))}
                  {ragItems.length === 0 && (
                    <div className="text-[11px] text-gray-400">暂无 RAG 检索结果</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {showAIChat && (
            <div className="w-full max-w-[780px] mt-4 bg-white rounded-xl shadow-lg p-4 slide-in">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-[13px] font-medium text-violet-700">局部修改 · 第 {currentSlide} 页</span>
                {aiBusy && <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin ml-auto" />}
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {['简化这个公式推导', '增加一个生活案例', '把内容改得更简洁', '加个高考真题'].map(s => (
                  <button key={s} onClick={() => onLocalModify(s)} disabled={aiBusy} className="px-3 py-1 text-[11px] bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 disabled:opacity-40">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onLocalModify(aiInput) }}
                  placeholder="输入修改意见（如：加一个投篮例子）"
                  disabled={aiBusy}
                  className="flex-1 px-3 py-2 text-[12px] border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-100 disabled:bg-gray-50"
                />
                <button onClick={() => onLocalModify(aiInput)} disabled={aiBusy || !aiInput.trim()} className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40">
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
