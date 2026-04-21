import { useState, useMemo } from 'react'
import { Eye, EyeOff, Copy, Download, Check, ChevronDown, ChevronUp, Search, Database, Sparkles } from 'lucide-react'
import { KB_CHAPTERS, chapterKeywords } from '../lib/kb'

const questions = [
  {
    id: 1, type: '选择题', difficulty: '基础', source: '2024全国甲卷',
    question: '一小球以 v₀=10 m/s 的速度水平抛出，不计空气阻力，经 t=2 s 小球速度方向与水平方向的夹角约为：',
    options: ['A. 30°', 'B. 45°', 'C. 63°', 'D. 75°'],
    answer: 'C',
    analysis: 'vx=10 m/s, vy=gt=20 m/s, tanθ=vy/vx=2, θ≈63°',
    tags: ['平抛运动', '运动合成']
  },
  {
    id: 2, type: '计算题', difficulty: '中等', source: '2023全国乙卷',
    question: '某同学从 h=5 m 高度水平抛出一小球，落地时水平射程为 10 m。求：(1) 初速度 v₀；(2) 落地瞬时速度大小。(取 g=10 m/s²)',
    options: [],
    answer: '(1) t=√(2h/g)=1 s, v₀=x/t=10 m/s\n(2) vy=gt=10 m/s, v=√(v₀²+vy²)=10√2≈14.1 m/s',
    analysis: '平抛运动中，水平方向匀速、竖直方向自由落体，分别独立计算再合成。',
    tags: ['平抛运动', '落地速度']
  },
  {
    id: 3, type: '选择题', difficulty: '拔高', source: '2024新课标卷',
    question: '关于平抛运动的下列说法，正确的是：',
    options: ['A. 平抛运动是匀变速运动', 'B. 平抛运动的加速度不变', 'C. 轨迹是抛物线', 'D. 以上均正确'],
    answer: 'D',
    analysis: '平抛运动仅受重力，加速度恒为 g，是匀变速曲线运动，轨迹是抛物线。',
    tags: ['平抛运动', '概念']
  },
  {
    id: 4, type: '选择题', difficulty: '基础', source: '2023北京卷',
    question: '关于匀变速直线运动，下列说法正确的是：',
    options: ['A. 速度方向一定不变', 'B. 加速度大小方向均不变', 'C. 速度一定增大', 'D. 位移方向一定与速度方向相同'],
    answer: 'B',
    analysis: '匀变速直线运动加速度恒定，但速度可增可减，取决于 a 与 v₀ 方向关系。',
    tags: ['匀变速直线运动']
  },
  {
    id: 5, type: '计算题', difficulty: '中等', source: '2024山东卷',
    question: '质量 m=2 kg 物体在水平面上受水平推力 F=10 N，动摩擦因数 μ=0.2，g=10 m/s²。求物体的加速度。',
    options: [],
    answer: 'f=μmg=4 N, 合力=F-f=6 N, a=F合/m=3 m/s²',
    analysis: '用牛顿第二定律，先求摩擦力，再求合力，最后求加速度。',
    tags: ['牛顿第二定律', '摩擦力']
  },
  {
    id: 6, type: '选择题', difficulty: '中等', source: '2024全国甲卷',
    question: '小球做匀速圆周运动，下列说法正确的是：',
    options: ['A. 速度不变', 'B. 加速度为零', 'C. 向心加速度方向指向圆心', 'D. 合外力为零'],
    answer: 'C',
    analysis: '匀速圆周运动速度方向变化，加速度始终指向圆心，合外力不为零。',
    tags: ['圆周运动', '向心力']
  },
  {
    id: 7, type: '实验题', difficulty: '中等', source: '2023江苏卷',
    question: '用打点计时器研究匀变速直线运动，电源频率 50 Hz。已知相邻两计数点间还有 4 个点未画出，则相邻计数点间时间间隔为______s。',
    options: [],
    answer: '0.1 s（5 个时间间隔 × 0.02 s）',
    analysis: '每个点间隔 0.02 s，中间 4 个点 → 5 个时间间隔。',
    tags: ['实验', '打点计时器']
  },
  {
    id: 8, type: '选择题', difficulty: '拔高', source: '2024浙江卷',
    question: '关于机械能守恒定律，下列说法正确的是：',
    options: ['A. 物体只受重力时机械能一定守恒', 'B. 物体受合外力为零时机械能一定守恒', 'C. 物体只受重力和弹力时机械能一定守恒', 'D. 系统内只有重力和弹力做功时系统机械能守恒'],
    answer: 'D',
    analysis: '机械能守恒条件是只有重力和弹力做功（或者说其他力不做功）。',
    tags: ['机械能守恒', '能量']
  },
  {
    id: 9, type: '计算题', difficulty: '拔高', source: '2024新课标卷',
    question: '从 h=20 m 高塔水平抛出小球，初速度 v₀=15 m/s。求：(1) 落地时间；(2) 水平射程；(3) 落地时速度与水平方向的夹角。g=10 m/s²',
    options: [],
    answer: '(1) t=√(2h/g)=2 s\n(2) x=v₀t=30 m\n(3) vy=gt=20 m/s, tanθ=vy/v₀=4/3, θ≈53°',
    analysis: '典型的平抛运动综合题，分解为水平匀速 + 竖直自由落体两个分运动。',
    tags: ['平抛运动', '综合题']
  },
  {
    id: 10, type: '选择题', difficulty: '基础', source: '2023天津卷',
    question: '关于自由落体运动，下列说法正确的是：',
    options: ['A. 加速度随下落时间增大', 'B. 初速度为零，加速度为 g', 'C. 落地速度与下落高度成正比', 'D. 下落时间与物体质量有关'],
    answer: 'B',
    analysis: '自由落体仅受重力，a=g，初速为 0，v=gt，与质量无关。',
    tags: ['自由落体']
  },
]

export default function Classroom() {
  const [showAnswers, setShowAnswers] = useState(false)
  const [expanded, setExpanded] = useState({})
  const [chapter, setChapter] = useState(KB_CHAPTERS[2].chapter) // 曲线运动 默认
  const [pointId, setPointId] = useState('all')
  const [search, setSearch] = useState('')

  const currentChapter = KB_CHAPTERS.find((c) => c.chapter === chapter) || KB_CHAPTERS[0]
  const currentPoint = currentChapter.points.find((p) => p.id === pointId)

  const filtered = useMemo(() => {
    let list = questions
    if (chapter && chapter !== 'all') {
      const keys = chapterKeywords(chapter)
      list = list.filter((q) => keys.some((k) => q.tags.some((t) => t.includes(k)) || q.question.includes(k)))
    }
    if (currentPoint) {
      const pt = currentPoint.title.replace(/（.*?）/g, '')
      list = list.filter((q) => q.tags.some((t) => t.includes(pt.slice(0, 2))) || q.question.includes(pt.slice(0, 2)))
    }
    if (search.trim()) {
      const s = search.trim()
      list = list.filter((q) => q.question.includes(s) || q.tags.some((t) => t.includes(s)) || q.source.includes(s))
    }
    return list
  }, [chapter, currentPoint, search])

  return (
    <div className="flex h-full fade-in-up">
      {/* Left config */}
      <div className="w-[290px] glass-panel border-t-0 border-b-0 border-l-0 p-5 shrink-0 overflow-y-auto">
        <h2 className="text-[15px] font-semibold text-slate-800 mb-4 tracking-tight">组卷配置</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-[11px] text-violet-600 bg-violet-50 border border-violet-100 rounded-lg px-2 py-1.5">
            <Database className="w-3.5 h-3.5" />
            章节与知识点由本地 RAG 知识库（30 知识点）提供
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">章节（来自 KB）</label>
            <select
              value={chapter}
              onChange={(e) => { setChapter(e.target.value); setPointId('all') }}
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {KB_CHAPTERS.map((c) => (
                <option key={c.chapter} value={c.chapter}>{c.chapter}（{c.points.length}个知识点）</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">知识点</label>
            <select
              value={pointId}
              onChange={(e) => setPointId(e.target.value)}
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">全部知识点</option>
              {currentChapter.points.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">题目数量</label>
            <input type="number" value={10} className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">班级水平</label>
            <select className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option>中等偏上</option>
              <option>基础</option>
              <option>拔高</option>
            </select>
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">题型选择</label>
            <div className="flex flex-wrap gap-2">
              {['选择题', '填空题', '计算题', '实验题'].map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-[12px] text-gray-600">
                  <input type="checkbox" defaultChecked className="accent-blue-600 w-3.5 h-3.5" />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-2 block">难度分布</label>
            <div className="space-y-2">
              {[
                { label: '基础', pct: 60, color: 'bg-emerald-500' },
                { label: '中等', pct: 30, color: 'bg-amber-500' },
                { label: '拔高', pct: 10, color: 'bg-red-500' },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 w-8">{d.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full animate-progress`} style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-500 w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <button className="group w-full py-2.5 bg-gradient-to-br from-primary to-indigo-accent text-white text-[13px] font-semibold rounded-xl btn-press shadow-lg shadow-indigo-500/25 mt-2 cursor-pointer flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 icon-spin-hover" />
            生成试卷
          </button>
        </div>
      </div>

      {/* Right questions */}
      <div className="flex-1 p-5 overflow-y-auto min-h-0 min-w-0">
        {/* Keyword search (per 合作人反馈) */}
        <div className="mb-4 glass-card rounded-2xl p-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-1 icon-pulse-hover" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="输入关键词精准搜题（知识点、题型、年份、来源）..."
            className="flex-1 text-[13px] text-slate-700 placeholder-slate-400 bg-transparent outline-none"
          />
          <button className="px-3 py-1.5 text-[12px] bg-gradient-to-br from-primary to-indigo-accent text-white rounded-lg btn-press shadow-md shadow-indigo-500/25 cursor-pointer">搜题</button>
        </div>

        <div className="mb-3 flex items-center gap-2 text-[12px] text-gray-500 flex-wrap">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">KB · {chapter}</span>
          {currentPoint && <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full">知识点: {currentPoint.title}</span>}
          {search && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">关键词: {search}</span>}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-gray-800">题目列表 <span className="text-gray-400 text-[13px]">({filtered.length}题)</span></h2>
          <div className="flex gap-2">
            <button onClick={() => setShowAnswers(!showAnswers)} className="group flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-slate-600 glass-card rounded-lg btn-press cursor-pointer">
              {showAnswers ? <EyeOff className="w-3.5 h-3.5 icon-pulse-hover" /> : <Eye className="w-3.5 h-3.5 icon-pulse-hover" />}
              {showAnswers ? '隐藏答案' : '显示答案'}
            </button>
            <button className="group flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-slate-600 glass-card rounded-lg btn-press cursor-pointer">
              <Copy className="w-3.5 h-3.5 icon-wobble-hover" /> 复制全部
            </button>
            <button className="group flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-white bg-gradient-to-br from-primary to-indigo-accent rounded-lg btn-press shadow-lg shadow-indigo-500/25 cursor-pointer">
              <Download className="w-3.5 h-3.5 icon-bounce-hover" /> 导出试卷
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center text-slate-400 text-[13px]">
              当前筛选下题库为空，请切换章节/知识点或清空搜索关键词
            </div>
          )}
          {filtered.map((q) => (
            <div key={q.id} className="glass-card rounded-xl p-5 lift-hover">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-[12px] flex items-center justify-center font-medium">{q.id}</span>
                <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{q.type}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                  q.difficulty === '基础' ? 'bg-emerald-50 text-emerald-600' :
                  q.difficulty === '中等' ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>{q.difficulty}</span>
                <span className="text-[11px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{q.source}</span>
              </div>
              <p className="text-[13px] text-gray-800 leading-relaxed mb-3">{q.question}</p>
              {q.options.length > 0 && (
                <div className="space-y-1.5 mb-3 ml-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`text-[12px] p-2 rounded-lg ${
                      showAnswers && opt.startsWith(q.answer) ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600'
                    }`}>{opt}</div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {q.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>

              {showAnswers && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button onClick={() => setExpanded({ ...expanded, [q.id]: !expanded[q.id] })} className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700">
                    {expanded[q.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expanded[q.id] ? '收起解析' : '查看解析'}
                  </button>
                  {expanded[q.id] && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg slide-in">
                      <div className="text-[12px] text-blue-700 font-medium mb-1">答案：{q.answer}</div>
                      <div className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-line">{q.analysis}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
