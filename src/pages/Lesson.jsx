import { useState } from 'react'
import {
  Check, ChevronLeft, ChevronRight, Download, Eye, Sparkles,
  GripVertical, Gamepad2, Film, ArrowRight, BookOpen,
  FileText, RotateCcw, MessageSquare, Loader2
} from 'lucide-react'

const steps = [
  { id: 1, label: '输入主题', status: 'done' },
  { id: 2, label: '澄清需求', status: 'done' },
  { id: 3, label: '生成中', status: 'done' },
  { id: 4, label: 'PPT预览', status: 'active' },
]

const slides = [
  { id: 1, title: '封面', type: 'cover' },
  { id: 2, title: '教学目标', type: 'text' },
  { id: 3, title: '概念导入', type: 'text' },
  { id: 4, title: '互动实验', type: 'interactive', icon: '🎮' },
  { id: 5, title: '实验演示', type: 'video', icon: '🎬' },
  { id: 6, title: '公式推导', type: 'text' },
  { id: 7, title: '例题精讲', type: 'text' },
  { id: 8, title: '课堂练习', type: 'interactive', icon: '🎮' },
  { id: 9, title: '知识小结', type: 'text' },
  { id: 10, title: '课后作业', type: 'text' },
  { id: 11, title: '拓展阅读', type: 'text' },
  { id: 12, title: '致谢', type: 'cover' },
]

const knowledgeItems = [
  { q: '电磁阻尼与涡流的关系？', source: '人教版必修3 P142' },
  { q: '法拉第电磁感应定律', source: '人教版必修3 P138' },
  { q: '楞次定律的应用场景', source: '2024全国甲卷 T21' },
]

const examPoints = [
  { name: '电磁感应定律', freq: '高频', color: 'text-red-500 bg-red-50' },
  { name: '楞次定律', freq: '高频', color: 'text-red-500 bg-red-50' },
  { name: '涡流与电磁阻尼', freq: '中频', color: 'text-amber-500 bg-amber-50' },
  { name: '自感与互感', freq: '低频', color: 'text-blue-500 bg-blue-50' },
]

export default function Lesson() {
  const [currentSlide, setCurrentSlide] = useState(4)
  const [difficulty, setDifficulty] = useState(50)
  const [showTrace, setShowTrace] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiMessages] = useState([
    { role: 'user', text: '这一页太干了，能加个互动案例吗？' },
    { role: 'ai', text: '已为您添加电磁阻尼的交互式仿真微件，学生可以拖拽磁场强度滑块观察阻尼效果变化。' },
  ])

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
                <div className={`w-0.5 h-8 my-1 ${
                  step.status === 'done' ? 'bg-emerald-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
            <div className={`pt-1 text-[13px] ${
              step.status === 'active' ? 'text-blue-600 font-medium' :
              step.status === 'done' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {step.label}
              {step.status === 'active' && (
                <div className="text-[11px] text-blue-400 mt-0.5">当前步骤</div>
              )}
            </div>
          </div>
        ))}

        {/* Current info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-xl">
          <div className="text-[11px] text-gray-400 font-medium mb-2">当前备课信息</div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-gray-500">学科</span>
              <span className="text-gray-800 font-medium">高中物理</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">章节</span>
              <span className="text-gray-800 font-medium">电磁感应</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">课时</span>
              <span className="text-gray-800 font-medium">2课时</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">班级</span>
              <span className="text-gray-800 font-medium">高二(3)班</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - PPT Preview */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-bg-base">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[12px] px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
              生成完成
            </div>
            <span className="text-[13px] text-gray-800 font-medium">电磁感应与电磁阻尼 — 教学课件</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> 下载PPT
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-3.5 h-3.5" /> 下载教案
            </button>
            <button
              onClick={() => setShowTrace(!showTrace)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors ${
                showTrace
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> 知识溯源
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> 重新备课
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Slide thumbnails */}
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
                  s.type === 'video' ? 'bg-gradient-to-br from-purple-50 to-pink-50' :
                  'bg-white'
                }`}>
                  {s.icon && (
                    <span className="text-lg mb-0.5">{s.icon}</span>
                  )}
                  <span className={`text-[10px] ${s.type === 'cover' ? 'text-white' : 'text-gray-600'}`}>
                    {s.title}
                  </span>
                  {s.type === 'interactive' && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                  {s.type === 'video' && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                      <Film className="w-2.5 h-2.5 text-white" />
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
            {/* Navigation */}
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="text-[13px] text-gray-600 font-medium">{currentSlide} / {slides.length}</span>
              <button onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-white rounded-lg">
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="flex items-center gap-1.5 text-[12px] text-violet-600 hover:bg-violet-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> 圈选修改
                </button>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-[11px] text-gray-400">难度:</span>
                <span className="text-[11px] text-blue-500">基础</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-24 h-1.5 accent-blue-600"
                />
                <span className="text-[11px] text-red-500">拔高</span>
              </div>
            </div>

            {/* Slide content */}
            <div className="w-full max-w-[780px] aspect-[16/10] bg-white rounded-xl shadow-lg overflow-hidden relative slide-in">
              {slide?.type === 'interactive' ? (
                /* Interactive physics simulation */
                <div className="h-full flex flex-col">
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-[14px]">互动实验：电磁阻尼仿真</span>
                    </div>
                    <span className="text-[11px] text-white/70 bg-white/15 px-2 py-0.5 rounded-full">Canvas交互</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800 p-6 flex items-center justify-center relative">
                    {/* Simulated physics canvas */}
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-48 h-48 border-2 border-cyan-400/40 rounded-lg flex items-center justify-center relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="absolute w-full h-px bg-cyan-400/20" style={{ transform: `rotate(${i * 36}deg)` }} />
                            ))}
                          </div>
                          <div className="w-8 h-24 bg-gradient-to-b from-red-500 to-blue-500 rounded-sm shadow-lg shadow-cyan-400/20"
                            style={{ transform: `translateX(${(difficulty - 50) * 0.3}px)` }}
                          />
                          <div className="absolute -left-2 -right-2 top-1/2 h-16 -translate-y-1/2 border border-dashed border-yellow-400/30 rounded" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="text-[11px] text-cyan-300/70">磁场强度 B</div>
                          <div className="text-[18px] text-cyan-300 font-mono">{(difficulty / 100 * 2).toFixed(1)} T</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] text-yellow-300/70">阻尼力 F</div>
                          <div className="text-[18px] text-yellow-300 font-mono">{(difficulty / 100 * 5.2).toFixed(1)} N</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[11px] text-emerald-300/70">涡流 I</div>
                          <div className="text-[18px] text-emerald-300 font-mono">{(difficulty / 100 * 3.8).toFixed(1)} A</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-[11px] text-gray-400">拖拽滑块调整磁场强度</span>
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : slide?.type === 'cover' ? (
                <div className="h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center p-10">
                  <div className="w-14 h-14 mb-4 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">电磁感应与电磁阻尼</h2>
                  <p className="text-white/70 text-[14px] mb-6">高中物理 · 必修三 · 第四章</p>
                  <div className="flex gap-3">
                    <span className="text-[12px] text-white/60 bg-white/10 px-3 py-1 rounded-full">2课时</span>
                    <span className="text-[12px] text-white/60 bg-white/10 px-3 py-1 rounded-full">高二年级</span>
                    <span className="text-[12px] text-white/60 bg-white/10 px-3 py-1 rounded-full">AI生成</span>
                  </div>
                </div>
              ) : (
                <div className="h-full p-8 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-800">{slide?.title}</h3>
                  </div>
                  <div className="flex-1 flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <div className="text-[13px] font-medium text-blue-700 mb-2">核心知识点</div>
                        <div className="text-[12px] text-gray-600 leading-relaxed">
                          法拉第电磁感应定律：感应电动势的大小等于磁通量变化率
                        </div>
                        <div className="mt-2 p-2 bg-white rounded-lg text-center">
                          <span className="text-[14px] font-mono text-gray-800">ε = -dΦ/dt = -NΔΦ/Δt</span>
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl">
                        <div className="text-[13px] font-medium text-amber-700 mb-1">重点提示</div>
                        <div className="text-[12px] text-gray-600">
                          负号表示感应电动势方向遵循楞次定律
                        </div>
                      </div>
                    </div>
                    <div className="w-[200px] shrink-0">
                      <div className="h-full bg-gradient-to-b from-indigo-50 to-purple-50 rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2">
                          <span className="text-4xl">🧲</span>
                        </div>
                        <span className="text-[11px] text-gray-500 text-center">示意图：磁通量变化</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Knowledge trace overlay */}
              {showTrace && (
                <div className="absolute inset-0 bg-black/5 pointer-events-none">
                  <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl p-4 w-[220px] pointer-events-auto">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[12px] font-medium text-blue-600">知识溯源</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded-lg border-l-2 border-blue-400">
                        <div className="text-[11px] text-blue-700 font-medium">人教版必修3 P142</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">"电磁阻尼是利用涡流..."</div>
                      </div>
                      <div className="p-2 bg-amber-50 rounded-lg border-l-2 border-amber-400">
                        <div className="text-[11px] text-amber-700 font-medium">2024全国甲卷 T21</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">高考真题关联考点</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI chat floating */}
            {showAIChat && (
              <div className="w-full max-w-[780px] mt-4 bg-white rounded-xl shadow-lg p-4 slide-in">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span className="text-[13px] font-medium text-violet-700">局部修改 · 第{currentSlide}页</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <button className="px-3 py-1 text-[11px] bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors">拆成两页</button>
                  <button className="px-3 py-1 text-[11px] bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors">换个案例</button>
                  <button className="px-3 py-1 text-[11px] bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors">增加动画</button>
                  <button className="px-3 py-1 text-[11px] bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors">简化公式</button>
                </div>
                <div className="space-y-2 mb-3">
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[12px] ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {msg.role === 'ai' && <span className="text-emerald-500 mr-1">✅</span>}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="输入修改意见..."
                    className="flex-1 px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300"
                  />
                  <button className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar - Knowledge */}
      <div className="w-[260px] bg-white border-l border-gray-100 p-4 overflow-y-auto shrink-0">
        <div className="flex items-center gap-1.5 mb-4">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="text-[13px] font-medium text-gray-800">知识库问答</span>
        </div>
        <div className="space-y-2 mb-6">
          {knowledgeItems.map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
              <div className="text-[12px] text-gray-700 group-hover:text-blue-700 mb-1">{item.q}</div>
              <div className="text-[10px] text-gray-400">{item.source}</div>
            </div>
          ))}
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

        <div className="border-t border-gray-100 pt-4">
          <div className="text-[12px] font-medium text-gray-700 mb-3">当前备课信息</div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="text-[11px] text-blue-600 space-y-1">
              <div>主题：电磁感应与电磁阻尼</div>
              <div>目标：理解法拉第定律，掌握楞次定律应用</div>
              <div>重难点：涡流在工业中的应用</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
