import { useState } from 'react'
import {
  Search, BarChart3, BookOpen, ClipboardList, Sparkles,
  Mic, Paperclip, Camera, SendHorizontal, Wifi, Brain,
  Zap, Play, Atom
} from 'lucide-react'

const quickTags = [
  { icon: Search, label: '资源检索', color: 'blue' },
  { icon: BarChart3, label: '课件生成', color: 'indigo' },
  { icon: BookOpen, label: '教学设计', color: 'emerald' },
  { icon: ClipboardList, label: '搜题组卷', color: 'amber' },
  { icon: Sparkles, label: '学情分析', color: 'violet' },
]

const quickCommands = [
  '用上传的单摆视频生成受力分析课件',
  '基于高考考纲出一套电磁感应大题',
  '把这份Word教案转化为H5互动版',
  '分析这次月考的班级薄弱知识点',
]

const recommendations = [
  { title: '电磁阻尼互动仿真', desc: 'H5交互式物理动画', tag: 'H5动画', gradient: 'from-violet-600 to-indigo-700', wide: false },
  { title: '2025高考物理冲刺课件包', desc: '覆盖全部力学考点', tag: '热门', gradient: 'from-blue-600 to-cyan-600', wide: true },
  { title: '班级积分排行榜', desc: '实时学习进度追踪', tag: '新功能', gradient: 'from-emerald-600 to-teal-600', wide: false },
  { title: '抛体运动轨迹测算器', desc: 'Canvas交互模拟', tag: 'H5动画', gradient: 'from-orange-500 to-red-500', wide: false },
  { title: '物理受力分析助手', desc: 'AI智能解题', tag: '推荐', gradient: 'from-pink-500 to-rose-500', wide: false },
]

export default function Chat() {
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState('hot')

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-8 fade-in-up">
      {/* Banner */}
      <div className="w-full max-w-[720px] rounded-2xl bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 p-8 mb-6 text-center relative overflow-hidden">
        <div className="absolute top-4 right-6 opacity-20">
          <Atom className="w-24 h-24 text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-1">您好，我是您的全模态教研合伙人</h1>
        <p className="text-[13px] text-gray-500">支持文字、语音、图片、视频多模态输入，智能理解您的教学意图</p>
      </div>

      {/* Quick tags */}
      <div className="flex gap-2.5 mb-5 flex-wrap justify-center">
        {quickTags.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium bg-${color}-50 text-${color}-600 hover:bg-${color}-100 transition-colors border border-${color}-100`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="w-full max-w-[720px] mb-4">
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-4 breathing-glow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="需要我帮您做什么？输入教学需求，或上传资料开始备课..."
            className="w-full resize-none text-[14px] text-gray-700 placeholder-gray-400 outline-none min-h-[60px] leading-relaxed"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1 text-[11px] text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3" /> 已联网
              </span>
              <span className="flex items-center gap-1 text-[11px] text-violet-500 bg-violet-50 px-2 py-1 rounded-full">
                <Brain className="w-3 h-3" /> 深度推理
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <Mic className="w-4.5 h-4.5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <Paperclip className="w-4.5 h-4.5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <Camera className="w-4.5 h-4.5" />
              </button>
              <button className="p-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                <SendHorizontal className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick commands */}
      <div className="w-full max-w-[720px] mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[12px] text-gray-500 font-medium">高频指令</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => setInput(cmd)}
              className="px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="w-full max-w-[720px]">
        <div className="flex gap-4 mb-4">
          {['hot', 'h5'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] font-medium pb-1 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab === 'hot' ? '热门推荐' : 'H5动画'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {recommendations.map((item, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                item.wide ? 'col-span-2' : ''
              }`}
            >
              <div className={`bg-gradient-to-br ${item.gradient} p-5 min-h-[120px] flex flex-col justify-end relative`}>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <h3 className="text-white font-medium text-[14px] mb-0.5">{item.title}</h3>
                <p className="text-white/70 text-[12px]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
