import { useState } from 'react'
import { Eye, EyeOff, Copy, Download, Check, ChevronDown, ChevronUp, Search } from 'lucide-react'

const questions = [
  {
    id: 1, type: '选择题', difficulty: '基础', source: '2024全国甲卷',
    question: '如图所示，一根长直导线与矩形线圈ABCD在同一平面内，导线中通有恒定电流I。当线圈以v的速度向右平移时，下列说法正确的是：',
    options: ['A. 线圈中感应电流方向为ABCDA', 'B. 线圈中感应电流方向为ADCBA', 'C. 线圈中无感应电流', 'D. 线圈AB边和CD边中感应电动势大小相等'],
    answer: 'B',
    analysis: '由于磁场不均匀，AB边和CD边切割磁力线时产生的感应电动势不等，因此线圈中存在感应电流。根据楞次定律判断电流方向为ADCBA。',
    tags: ['电磁感应', '楞次定律']
  },
  {
    id: 2, type: '计算题', difficulty: '中等', source: '2023全国乙卷',
    question: '一个匝数为N=100的矩形线圈，面积S=0.02m²，在磁感应强度B=0.5T的匀强磁场中，绕垂直于磁场的轴以角速度ω=100πrad/s匀速转动。求：(1) 感应电动势的最大值；(2) 从线圈平面与磁场平行时开始计时，写出感应电动势随时间变化的表达式。',
    options: [],
    answer: '(1) εm = NBAω = 100×0.5×0.02×100π = 100π ≈ 314V\n(2) ε = 100πcos(100πt) V',
    analysis: '从线圈平面与磁场平行时开始计时，此时磁通量变化率最大，对应余弦函数。',
    tags: ['交流电', '电磁感应定律']
  },
  {
    id: 3, type: '选择题', difficulty: '拔高', source: '2024新课标卷',
    question: '关于电磁阻尼和电磁驱动，下列说法正确的是：',
    options: ['A. 电磁阻尼利用了安培力做正功', 'B. 电磁驱动利用了涡流效应', 'C. 电磁阻尼中感应电流的磁场总是阻碍导体的运动', 'D. 电磁驱动中导体的转速等于磁场的转速'],
    answer: 'C',
    analysis: '电磁阻尼中安培力做负功，阻碍导体运动。电磁驱动中导体转速小于磁场转速，否则不会产生感应电流。',
    tags: ['电磁阻尼', '涡流']
  },
]

export default function Classroom() {
  const [showAnswers, setShowAnswers] = useState(false)
  const [expanded, setExpanded] = useState({})

  return (
    <div className="flex h-full fade-in-up">
      {/* Left config */}
      <div className="w-[280px] bg-white border-r border-gray-100 p-5 shrink-0 overflow-y-auto">
        <h2 className="text-[15px] font-semibold text-gray-800 mb-4">组卷配置</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">章节主题</label>
            <select className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option>电磁感应</option>
              <option>力学</option>
              <option>光学</option>
            </select>
          </div>

          <div>
            <label className="text-[12px] text-gray-600 font-medium mb-1.5 block">所属章节</label>
            <select className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option>第四章 电磁感应</option>
              <option>4.1 法拉第电磁感应定律</option>
              <option>4.2 楞次定律</option>
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

          <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity mt-2">
            生成试卷
          </button>
        </div>
      </div>

      {/* Right questions */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* Keyword search (per 合作人反馈) */}
        <div className="mb-4 bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400 ml-1" />
          <input
            placeholder="输入关键词精准搜题（知识点、题型、年份、来源）..."
            className="flex-1 text-[13px] text-gray-700 placeholder-gray-400 bg-transparent outline-none"
          />
          <button className="px-3 py-1 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">搜题</button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-gray-800">题目列表 <span className="text-gray-400 text-[13px]">({questions.length}题)</span></h2>
          <div className="flex gap-2">
            <button onClick={() => setShowAnswers(!showAnswers)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showAnswers ? '隐藏答案' : '显示答案'}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Copy className="w-3.5 h-3.5" /> 复制全部
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Download className="w-3.5 h-3.5" /> 导出试卷
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
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
