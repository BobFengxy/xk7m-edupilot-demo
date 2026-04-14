import { useState, useEffect, useRef } from 'react'
import {
  Search, BarChart3, BookOpen, ClipboardList, Sparkles,
  Mic, Paperclip, Camera, SendHorizontal, Wifi, Brain,
  Check, Loader2, Eye, ArrowRight, FileText, Save, X,
  Edit3, Wand2, RefreshCw
} from 'lucide-react'

const quickTags = [
  { icon: BookOpen, label: '教学设计' },
  { icon: BarChart3, label: '课件生成' },
  { icon: ClipboardList, label: '搜题组卷' },
  { icon: Sparkles, label: '学情分析' },
]

const quickCommands = [
  '用上传的单摆视频生成受力分析课件',
  '基于高考考纲出一套电磁感应大题',
  '把这份Word教案转化为H5互动版',
  '分析这次月考的班级薄弱知识点',
]

const progressSteps = [
  { icon: '🔍', text: '正在检索本地高考考纲与人教版教材...' },
  { icon: '🧠', text: '正在融合电磁阻尼视频特征与教学目标...' },
  { icon: '📚', text: '正在匹配2024全国甲卷相关真题...' },
  { icon: '✍️', text: '正在排版第4页公式推导与互动微件...' },
  { icon: '🎨', text: '正在生成可交互 Canvas 物理仿真...' },
  { icon: '✅', text: '生成完毕，右侧预览已就绪。' },
]

export default function Chat() {
  const [input, setInput] = useState('')
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progressIndex, setProgressIndex] = useState(0)
  const [messages, setMessages] = useState([])
  const [hoveredElement, setHoveredElement] = useState(null)
  const [inlinePopover, setInlinePopover] = useState(null)

  useEffect(() => {
    if (!generating) return
    if (progressIndex >= progressSteps.length - 1) {
      const t = setTimeout(() => setGenerating(false), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setProgressIndex(progressIndex + 1), 900)
    return () => clearTimeout(t)
  }, [generating, progressIndex])

  const handleSend = (text) => {
    const content = text ?? input
    if (!content.trim()) return
    setMessages([...messages, { role: 'user', text: content }])
    setInput('')
    setWorkspaceOpen(true)
    setGenerating(true)
    setProgressIndex(0)
  }

  // Workspace mode (split view)
  if (workspaceOpen) {
    return (
      <div className="flex h-[calc(100vh-56px)] fade-in-up">
        {/* Left: chat thread */}
        <div className="w-[42%] min-w-[380px] flex flex-col border-r border-gray-100 bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-[13px] font-medium text-gray-800">AI 教研对话</span>
            </div>
            <button
              onClick={() => { setWorkspaceOpen(false); setMessages([]); setGenerating(false); setProgressIndex(0) }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="返回首页"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {generating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                  {progressSteps.slice(0, progressIndex + 1).map((step, i) => {
                    const isCurrent = i === progressIndex
                    const isDone = i < progressIndex
                    return (
                      <div key={i} className="flex items-center gap-2 text-[12px] fade-in-up">
                        <span className="text-base">{step.icon}</span>
                        <span className={isDone ? 'text-gray-400' : 'text-gray-700 font-medium'}>
                          {step.text}
                        </span>
                        {isCurrent && i < progressSteps.length - 1 && (
                          <Loader2 className="w-3 h-3 text-blue-500 animate-spin ml-auto" />
                        )}
                        {(isDone || i === progressSteps.length - 1) && (
                          <Check className="w-3 h-3 text-emerald-500 ml-auto" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {!generating && messages.length > 0 && (
              <div className="flex justify-start fade-in-up">
                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-gray-50 text-gray-700 border border-gray-100 text-[13px]">
                  课件已生成，右侧可实时预览。您可以：<br/>
                  • 在预览图中<span className="text-blue-600">点击任意文字/公式</span>直接改写<br/>
                  • 继续在下方对话发起多轮修改<br/>
                  满意后点击右上角 <span className="text-emerald-600 font-medium">「保存到云盘」</span>。
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="继续对话修改课件..."
                className="w-full resize-none text-[13px] text-gray-700 placeholder-gray-400 bg-transparent outline-none min-h-[40px]"
                rows={2}
              />
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={generating}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: preview workspace */}
        <div className="flex-1 flex flex-col bg-bg-base min-w-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-[13px] font-medium text-gray-800">实时预览工作台</span>
              {!generating && messages.length > 0 && (
                <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">已生成</span>
              )}
            </div>
            {!generating && messages.length > 0 && (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <RefreshCw className="w-3.5 h-3.5" /> 重新生成
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
                  <Save className="w-3.5 h-3.5" /> 保存到云盘
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-6 overflow-auto flex items-start justify-center">
            {generating ? (
              /* Generating skeleton with pulse */
              <div className="w-full max-w-[760px] aspect-[16/10] rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="text-[14px] font-medium text-gray-800 mb-1">AI 正在生成课件</div>
                  <div className="text-[12px] text-gray-500">{progressSteps[progressIndex]?.text}</div>
                  <div className="mt-5 flex gap-1 justify-center">
                    {progressSteps.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all ${
                        i <= progressIndex ? 'w-8 bg-blue-500' : 'w-4 bg-gray-200'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Generated slide preview */
              <div className="w-full max-w-[760px] slide-in">
                <div className="aspect-[16/10] bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-full p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-600 rounded-full" />
                      <h3
                        className={`text-lg font-semibold text-gray-800 cursor-pointer rounded px-1 -mx-1 transition-all relative ${hoveredElement === 'title' ? 'ring-2 ring-blue-300 bg-blue-50/30' : 'hover:ring-2 hover:ring-blue-200'}`}
                        onMouseEnter={() => setHoveredElement('title')}
                        onMouseLeave={() => setHoveredElement(null)}
                        onClick={() => setInlinePopover('title')}
                      >
                        电磁感应与电磁阻尼
                      </h3>
                    </div>
                    <div className="flex-1 flex gap-6">
                      <div className="flex-1 space-y-3">
                        <div
                          className={`p-4 bg-blue-50 rounded-xl cursor-pointer transition-all relative ${hoveredElement === 'formula' ? 'ring-2 ring-blue-300' : 'hover:ring-2 hover:ring-blue-200'}`}
                          onMouseEnter={() => setHoveredElement('formula')}
                          onMouseLeave={() => setHoveredElement(null)}
                          onClick={() => setInlinePopover('formula')}
                        >
                          <div className="text-[13px] font-medium text-blue-700 mb-2">核心知识点</div>
                          <div className="text-[12px] text-gray-600 leading-relaxed">
                            法拉第电磁感应定律：感应电动势的大小等于磁通量变化率
                          </div>
                          <div className="mt-2 p-2 bg-white rounded-lg text-center">
                            <span className="text-[14px] font-mono text-gray-800">ε = -dΦ/dt = -NΔΦ/Δt</span>
                          </div>
                          {hoveredElement === 'formula' && (
                            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                              <Edit3 className="w-2.5 h-2.5" /> 点击改写
                            </div>
                          )}
                        </div>
                        <div
                          className={`p-4 bg-amber-50 rounded-xl cursor-pointer transition-all ${hoveredElement === 'tip' ? 'ring-2 ring-blue-300' : 'hover:ring-2 hover:ring-blue-200'}`}
                          onMouseEnter={() => setHoveredElement('tip')}
                          onMouseLeave={() => setHoveredElement(null)}
                          onClick={() => setInlinePopover('tip')}
                        >
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
                </div>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500 justify-center">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    共 12 页
                  </div>
                  <span>·</span>
                  <span>鼠标悬停任意元素可直接改写</span>
                  <span>·</span>
                  <button className="text-blue-600 hover:underline flex items-center gap-0.5">
                    查看全部 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Inline toolbar popover */}
                {inlinePopover && (
                  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 flex items-center gap-2 fade-in-up z-50">
                    <span className="text-[12px] text-gray-500 pl-2 pr-1 border-r border-gray-200">所指即所改</span>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                      <Wand2 className="w-3.5 h-3.5" /> 重写这段
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100">
                      简化难度
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100">
                      换个案例
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                      加动画
                    </button>
                    <button onClick={() => setInlinePopover(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Clean homepage
  return (
    <div className="min-h-full flex flex-col items-center px-6 pt-16 pb-8 fade-in-up">
      {/* Greeting */}
      <div className="w-full max-w-[720px] text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200/60">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1.5 tracking-tight">您好，我是您的教研合伙人</h1>
        <p className="text-[13px] text-gray-500">支持文字、语音、图片、视频多模态输入，懂老师的教学思路</p>
      </div>

      {/* Quick tags */}
      <div className="flex gap-2.5 mb-6 flex-wrap justify-center">
        {quickTags.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="w-full max-w-[720px] mb-5">
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.05)] p-4 border border-gray-100">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="需要我帮您做什么？输入教学需求，或上传资料开始备课..."
            className="w-full resize-none text-[14px] text-gray-700 placeholder-gray-400 outline-none min-h-[64px] leading-relaxed"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3" /> 已联网
              </span>
              <span className="flex items-center gap-1 text-[11px] text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                <Brain className="w-3 h-3" /> 深度推理
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="语音">
                <Mic className="w-4.5 h-4.5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="文件">
                <Paperclip className="w-4.5 h-4.5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="图片">
                <Camera className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => handleSend()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                title="发送"
              >
                <SendHorizontal className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick commands */}
      <div className="w-full max-w-[720px]">
        <div className="flex gap-2 flex-wrap justify-center">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSend(cmd)}
              className="px-4 py-2 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
