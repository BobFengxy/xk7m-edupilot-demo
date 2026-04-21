import { useState, useRef, useEffect } from 'react'
import { Upload, Users, TrendingUp, AlertTriangle, Sparkles, ChevronRight, User, Target, Download, RefreshCw, Layers } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Bar, Radar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const topErrors = [
  { name: '受力分析', pct: 73, color: 'bg-red-500' },
  { name: '加速度方向', pct: 60, color: 'bg-amber-500' },
  { name: '摩擦力判断', pct: 45, color: 'bg-yellow-500' },
]

const students = [
  { name: '张三', score: 92, tags: ['优秀'], avatar: 'bg-blue-500' },
  { name: '李四', score: 78, tags: ['受力分析'], avatar: 'bg-emerald-500' },
  { name: '王五', score: 65, tags: ['受力分析', '加速度'], avatar: 'bg-amber-500' },
  { name: '赵六', score: 58, tags: ['受力分析', '摩擦力', '加速度'], avatar: 'bg-red-500' },
  { name: '钱七', score: 85, tags: ['摩擦力'], avatar: 'bg-purple-500' },
]

const barData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
  datasets: [{
    label: '正确率',
    data: [85, 72, 90, 45, 68, 78, 35, 82, 60, 55],
    backgroundColor: [85, 72, 90, 45, 68, 78, 35, 82, 60, 55].map(v =>
      v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444'
    ),
    borderRadius: 6,
  }]
}

const radarData = {
  labels: ['力学', '电磁学', '光学', '热力学', '原子物理', '实验'],
  datasets: [{
    label: '掌握度',
    data: [85, 65, 78, 72, 60, 88],
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: '#2563eb',
    pointBackgroundColor: '#2563eb',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
  }]
}

// 基于班级共性错误（受力分析 73% / 加速度方向 60% / 摩擦力 45%）生成的分层巩固题
const practicePool = {
  基础: [
    { q: '一个物体受三个共点力作用处于平衡状态，已知 F1=3N，F2=4N，则 F3 的大小范围是？', tag: '受力分析' },
    { q: '在光滑水平面上，质量为 2kg 的物体受到水平拉力 F=6N 的作用，求加速度的大小和方向。', tag: '加速度方向' },
    { q: '质量为 5kg 的物体静止在水平面上，动摩擦因数 μ=0.3，求其受到的摩擦力大小。', tag: '摩擦力' },
    { q: '画出斜面上匀速下滑木块的受力分析图，并标注各力方向。', tag: '受力分析' },
  ],
  提升: [
    { q: '物体沿斜面（倾角 30°）匀速下滑，求动摩擦因数 μ。', tag: '摩擦力' },
    { q: '汽车以 v₀=20m/s 刹车，加速度 a=-4m/s²。求 10s 内位移。（注意“陷阱”）', tag: '加速度方向' },
    { q: '小物块在粗糙水平面以 5m/s 滑出，滑行 6.25m 停下。求动摩擦因数。', tag: '摩擦力' },
  ],
  挑战: [
    { q: '质量 m 的物体放在倾角 θ 的斜面上，斜面以 a 水平向左加速。讨论当 a 变化时物体相对斜面的趋势与摩擦力大小。', tag: '受力分析' },
    { q: '两木块 A(2kg)、B(3kg) 叠放，A 在 B 上。μ_AB=0.5, μ_B地=0.2。对 A 施水平力 F。分析 F 在多大范围内两者可相对静止共同运动。', tag: '受力分析' },
  ],
}

function shufflePractice() {
  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)
  return {
    基础: pick(practicePool.基础, 3),
    提升: pick(practicePool.提升, 2),
    挑战: pick(practicePool.挑战, 2),
  }
}

export default function Homework() {
  const [uploaded, setUploaded] = useState(false)
  const [activeTab, setActiveTab] = useState('class')
  const [practice, setPractice] = useState(() => shufflePractice())

  const tabs = [
    { id: 'class', label: '班级分析' },
    { id: 'student', label: '学生详情' },
    { id: 'practice', label: '巩固练习' },
  ]

  if (!uploaded) {
    return (
      <div className="h-full overflow-auto p-6 fade-in-up">
        <h1 className="text-lg font-semibold text-gray-800 mb-2">学情分析</h1>
        <p className="text-[13px] text-gray-500 mb-6">上传作业进行智能批改与学情分析</p>
        <div className="max-w-lg mx-auto mt-12">
          <div
            onClick={() => setUploaded(true)}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-[14px] text-gray-600 font-medium mb-1">拖拽上传作业图片或PDF</p>
            <p className="text-[12px] text-gray-400">支持 JPG、PNG、PDF 格式，可批量上传</p>
          </div>
          <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-blue-700 mb-1">需要我帮您自动批改吗？</div>
              <p className="text-[12px] text-gray-600">上传后 AI 将主动发起 OCR 识别、评分、共性错误归因，并生成学情雷达图。</p>
            </div>
            <button onClick={() => setUploaded(true)} className="shrink-0 px-3 py-1.5 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors">确认批改</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6 fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">学情分析</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">高二(3)班 · 力学单元测试 · AI批改完成</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] text-gray-500">学生数</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">30</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] text-gray-500">平均分</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">78<span className="text-[14px] text-gray-400">/100</span></div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-[12px] text-gray-500">高考风险警告</span>
          </div>
          <div className="text-[14px] font-medium text-red-500">3个高频考点薄弱</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 glass-subtle p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-[13px] rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-indigo-accent font-semibold shadow-md shadow-indigo-500/10'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'class' && (
        <>
        <div className="grid grid-cols-2 gap-5 slide-in mb-5">
          {/* Top errors */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-800 mb-4">Top 3 共性错误</h3>
            <div className="space-y-3">
              {topErrors.map((e, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-gray-700">{i + 1}. {e.name}</span>
                    <span className="text-[12px] text-red-500 font-medium">{e.pct}% 出错</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${e.color} rounded-full animate-progress`} style={{ width: `${e.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-1.5 text-[12px] text-blue-700 font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5" /> 建议下节课重点讲解
              </div>
              <p className="text-[12px] text-gray-600">受力分析、加速度方向判断</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-gray-800 mb-4">各题正确率</h3>
            <div className="h-[240px]">
              <Bar data={barData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } } },
                  x: { ticks: { font: { size: 11 } } }
                }
              }} />
            </div>
          </div>
        </div>

        {/* 终极闭环 CTA: 错题转课件 */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-xl shadow-indigo-500/25">
          <div className="rounded-2xl glass-card p-5 flex items-center gap-4 border-none">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-accent flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 group">
              <Sparkles className="w-6 h-6 text-white icon-spin-hover" />
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/40" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-slate-900 mb-0.5 tracking-tight">将共性错题转化为下节课复习大纲</div>
              <div className="text-[12px] text-slate-500">携带 73% 受力分析、60% 加速度方向 错题数据，一键生成针对性补救课件，打通「测-评-练-教」闭环</div>
            </div>
            <button className="group flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-br from-primary to-indigo-accent text-white text-[13px] font-semibold rounded-xl btn-press shadow-lg shadow-indigo-500/30 shrink-0 cursor-pointer">
              生成补救课件 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
        </>
      )}

      {activeTab === 'student' && (
        <div className="grid grid-cols-2 gap-5 slide-in">
          <div className="space-y-3">
            {students.map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-4 lift-hover cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${s.avatar} flex items-center justify-center`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-gray-800">{s.name}</span>
                      <span className={`text-[14px] font-bold ${
                        s.score >= 80 ? 'text-emerald-600' : s.score >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>{s.score}分</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {s.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          tag === '优秀' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="text-[14px] font-medium text-gray-800">知识点掌握度</h3>
            </div>
            <div className="h-[280px]">
              <Radar data={radarData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { r: { beginAtZero: true, max: 100, ticks: { font: { size: 10 }, stepSize: 20 }, pointLabels: { font: { size: 11 } } } }
              }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="max-w-3xl slide-in">
          <div className="flex items-start justify-between mb-4 glass-card rounded-xl p-4" style={{ background: 'linear-gradient(120deg, rgba(245,243,255,0.85), rgba(239,246,255,0.75))' }}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-violet-600 icon-spin-hover" />
                <span className="text-[13px] font-semibold text-slate-900 tracking-tight">分层巩固练习 · 学情驱动</span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                基于本次月考共性错误（受力分析 73% · 加速度方向 60% · 摩擦力 45%）自动生成三级题目
              </p>
            </div>
            <button
              onClick={() => setPractice(shufflePractice())}
              className="group flex items-center gap-1 px-3 py-1.5 text-[12px] text-violet-700 bg-white/80 border border-violet-200 rounded-xl btn-press shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 icon-spin-hover" /> 换一批
            </button>
          </div>

          {[
            { tier: '基础', label: '基础巩固', hint: '薄弱点 ≥ 60% 的学生优先完成', iconCls: 'text-emerald-600', badgeCls: 'bg-emerald-50 text-emerald-600', dotCls: 'bg-emerald-600' },
            { tier: '提升', label: '能力提升', hint: '60-80 分段学生进阶练习', iconCls: 'text-amber-600', badgeCls: 'bg-amber-50 text-amber-600', dotCls: 'bg-amber-600' },
            { tier: '挑战', label: '高考挑战', hint: '优秀生挑战真题改编难度', iconCls: 'text-red-600', badgeCls: 'bg-red-50 text-red-600', dotCls: 'bg-red-600' },
          ].map(({ tier, label, hint, iconCls, badgeCls, dotCls }) => (
            <div key={tier} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Layers className={`w-4 h-4 ${iconCls}`} />
                <h3 className="text-[13px] font-semibold text-gray-800">{label}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeCls}`}>{practice[tier].length} 题</span>
                <span className="text-[11px] text-gray-400">{hint}</span>
              </div>
              <div className="space-y-2">
                {practice[tier].map((q, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 lift-hover">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-medium ${dotCls}`}>{i + 1}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badgeCls}`}>{tier}</span>
                      <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">针对: {q.tag}</span>
                    </div>
                    <p className="text-[13px] text-gray-800 leading-relaxed">{q.q}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-3.5 h-3.5" /> 导出练习题
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-[12px] rounded-lg hover:bg-gray-50">
              推送到学生端
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
