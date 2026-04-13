import { BookOpen, ClipboardList, CheckSquare, BarChart3, ArrowRight } from 'lucide-react'

const agents = [
  {
    icon: BookOpen,
    name: '备课智能体',
    desc: '多轮意图澄清、RAG知识融合、多模态课件生成全流程自动化备课',
    tags: ['意图理解', 'RAG检索', 'PPT生成', '教案生成'],
    gradient: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: ClipboardList,
    name: '出题智能体',
    desc: '基于考纲与知识点，智能搜题、自动组卷、生成针对性练习题',
    tags: ['考纲对齐', '智能组卷', '难度控制', '题型多样'],
    gradient: 'from-emerald-600 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: CheckSquare,
    name: '批改智能体',
    desc: 'OCR智能识别 + AI自动批改，精准标注错误类型与失分原因',
    tags: ['OCR识别', '自动评分', '错误分类', '批注反馈'],
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
  },
  {
    icon: BarChart3,
    name: '学情分析智能体',
    desc: '班级学情统计、学生个性化分析、自动生成巩固练习与教学建议',
    tags: ['班级画像', '个性分析', '薄弱诊断', '补偿课件'],
    gradient: 'from-violet-600 to-purple-600',
    bg: 'bg-violet-50',
  },
]

export default function Agents() {
  return (
    <div className="p-6 fade-in-up">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-800">智能体中心</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">四大核心教学智能体，覆盖全教学流程</p>
      </div>

      <div className="grid grid-cols-2 gap-5 max-w-4xl">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <div key={agent.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className={`bg-gradient-to-r ${agent.gradient} p-5 flex items-center gap-4`}>
                <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm shrink-0">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-[16px]">{agent.name}</h3>
                  <p className="text-white/70 text-[12px] mt-0.5 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {agent.tags.map((tag) => (
                    <span key={tag} className={`text-[11px] px-2.5 py-1 rounded-full ${agent.bg} font-medium`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 text-gray-700 text-[13px] font-medium rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                  开始使用 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming soon */}
      <div className="mt-6 max-w-4xl">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-dashed border-gray-300 text-center">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="text-[14px] font-medium text-gray-600 mb-1">更多智能体即将上线</h3>
          <p className="text-[12px] text-gray-400">数字人授课智能体、学科拓展智能体等正在开发中...</p>
        </div>
      </div>
    </div>
  )
}
