import { useState, useRef, useEffect } from 'react'
import { Upload, Users, TrendingUp, AlertTriangle, Sparkles, ChevronRight, User, Target } from 'lucide-react'
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

const practiceQuestions = [
  { q: '一个物体受三个共点力作用处于平衡状态，已知F1=3N，F2=4N，则F3的大小范围是？', diff: '基础', tag: '受力分析' },
  { q: '物体沿斜面匀速下滑，画出其受力分析图并求摩擦力。', diff: '中等', tag: '摩擦力' },
  { q: '在光滑水平面上，质量为2kg的物体受到水平拉力F=6N的作用，求加速度的大小和方向。', diff: '基础', tag: '加速度方向' },
]

export default function Homework() {
  const [uploaded, setUploaded] = useState(false)
  const [activeTab, setActiveTab] = useState('class')

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
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[12px] text-gray-500">学生数</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">30</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[12px] text-gray-500">平均分</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">78<span className="text-[14px] text-gray-400">/100</span></div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-[12px] text-gray-500">高考风险警告</span>
          </div>
          <div className="text-[14px] font-medium text-red-500">3个高频考点薄弱</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-[13px] rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 font-medium shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
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
          <div className="bg-white rounded-xl p-5 border border-gray-100">
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
          <div className="bg-white rounded-xl p-5 border border-gray-100">
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
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-lg shadow-blue-200/40">
          <div className="rounded-2xl bg-white p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-gray-800 mb-0.5">将共性错题转化为下节课复习大纲</div>
              <div className="text-[12px] text-gray-500">携带 73% 受力分析、60% 加速度方向 错题数据，一键生成针对性补救课件，打通「测-评-练-教」闭环</div>
            </div>
            <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[13px] font-medium rounded-xl hover:opacity-90 transition-opacity shrink-0">
              生成补救课件 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        </>
      )}

      {activeTab === 'student' && (
        <div className="grid grid-cols-2 gap-5 slide-in">
          <div className="space-y-3">
            {students.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer">
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
          <div className="bg-white rounded-xl p-5 border border-gray-100">
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
        <div className="max-w-2xl slide-in">
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-[13px] text-gray-600">基于班级共性错误自动生成巩固练习</span>
          </div>
          <div className="space-y-3">
            {practiceQuestions.map((q, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-[11px] flex items-center justify-center font-medium">{i + 1}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    q.diff === '基础' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>{q.diff}</span>
                  <span className="text-[11px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">针对: {q.tag}</span>
                </div>
                <p className="text-[13px] text-gray-800 leading-relaxed">{q.q}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[12px] rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-3.5 h-3.5" /> 导出练习题
          </button>
        </div>
      )}
    </div>
  )
}
