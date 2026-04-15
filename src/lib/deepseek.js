// DeepSeek API client — demo only, key embedded in frontend bundle (per V2.0 spec)
// Tradeoff: key visible in DevTools. Acceptable for competition demo.

const DEEPSEEK_API_KEY = 'sk-26414a7dddcd45258ba6a8c69a8cd907'
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

async function chatRaw(messages, { model = 'deepseek-chat', temperature = 0.3, max_tokens = 4096, response_format } = {}) {
  const body = { model, messages, temperature, max_tokens }
  if (response_format) body.response_format = response_format

  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`DeepSeek API ${res.status}: ${errText.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export async function chat(messages, opts) {
  return chatRaw(messages, opts)
}

export async function chatJSON(messages, opts = {}) {
  const text = await chatRaw(messages, { ...opts, response_format: { type: 'json_object' } })
  try {
    return JSON.parse(text)
  } catch {
    const m = text.match(/\{[\s\S]*\}/)
    if (m) return JSON.parse(m[0])
    throw new Error(`Invalid JSON from DeepSeek: ${text.slice(0, 200)}`)
  }
}

export async function detectIntent(userInput) {
  const sys = '你是高中物理教学系统意图识别助手。从用户输入中提取教学意图和主题，仅输出JSON。'
  const user = `用户输入："${userInput}"
请输出JSON：{"intent": "lesson_plan|classroom|homework|other", "topic": "提取的教学主题或空字符串"}
intent含义：lesson_plan=备课/课件生成，classroom=出题组卷，homework=作业批改/学情分析，other=其他`
  return chatJSON([{ role: 'system', content: sys }, { role: 'user', content: user }], { temperature: 0.1 })
}

export async function pseudoRAG(topic) {
  const sys = '你是人教版高中物理知识库检索助手。基于内置的人教版教材知识，返回与主题相关的3条知识点条目，仅输出JSON。'
  const user = `主题："${topic}"
输出JSON：{"items": [{"q": "知识点或问题", "content": "50字以内简述", "source": "人教版教材定位，如：必修一 P42"}]}`
  return chatJSON([{ role: 'system', content: sys }, { role: 'user', content: user }], { temperature: 0.3 })
}

export async function clarifyAnswer(questionKey, userAnswer) {
  const sys = '你是高中物理备课助手，对教师回答做一句话简短确认（≤30字）。'
  return chat([
    { role: 'system', content: sys },
    { role: 'user', content: `问题类型：${questionKey}\n教师回答：${userAnswer}` },
  ], { temperature: 0.4, max_tokens: 100 })
}

export async function modifySlideContent(originalContent, modifyRequest) {
  const sys = '你是高中物理课件修改专家。仅根据修改需求调整指定内容，保持风格，直接输出修改后的文本，无解释。'
  const user = `原内容：\n${originalContent}\n\n修改需求：${modifyRequest}`
  return chat([{ role: 'system', content: sys }, { role: 'user', content: user }], { temperature: 0.5 })
}

export async function generateSlides(topic, clarifications, ragContext = '') {
  const sys = '你是高中物理课件生成专家，基于人教版教材生成PPT结构，仅输出JSON。'
  const user = `主题：${topic}
澄清信息：${JSON.stringify(clarifications)}
RAG参考：${ragContext}
输出JSON：{"title":"课件标题","slides":[{"page_num":1,"title":"页面标题","content":"正文要点","type":"cover|text|interactive|summary"}]}
要求：8-10页，含1页type=interactive的平抛运动互动实验页，内容贴合人教版。`
  return chatJSON([{ role: 'system', content: sys }, { role: 'user', content: user }], { max_tokens: 4096 })
}
