// 知识库章节与知识点索引（前端精简版，与 rag-pack/knowledge.json 章节/标题对齐）
// 仅用于 UI 联动，完整文本内容由 rag-pack 的 Chroma 本地服务提供。

export const KB_CHAPTERS = [
  {
    chapter: '运动的描述',
    points: [
      { id: 'K-01-01', title: '参考系与质点' },
      { id: 'K-01-02', title: '位移与路程' },
      { id: 'K-01-03', title: '速度与加速度' },
      { id: 'K-01-04', title: '匀变速直线运动规律' },
    ],
  },
  {
    chapter: '牛顿运动定律',
    points: [
      { id: 'K-02-01', title: '牛顿第一定律（惯性定律）' },
      { id: 'K-02-02', title: '牛顿第二定律' },
      { id: 'K-02-03', title: '牛顿第三定律' },
      { id: 'K-02-04', title: '共点力的平衡' },
      { id: 'K-02-05', title: '超重与失重' },
    ],
  },
  {
    chapter: '曲线运动',
    points: [
      { id: 'K-03-01', title: '曲线运动与速度方向' },
      { id: 'K-03-02', title: '运动的合成与分解' },
      { id: 'K-03-03', title: '平抛运动' },
      { id: 'K-03-04', title: '研究平抛物体的运动（实验）' },
      { id: 'K-03-05', title: '圆周运动' },
      { id: 'K-03-06', title: '向心力与向心加速度' },
    ],
  },
  {
    chapter: '万有引力与航天',
    points: [
      { id: 'K-04-01', title: '开普勒三定律' },
      { id: 'K-04-02', title: '万有引力定律' },
      { id: 'K-04-03', title: '卫星运动与宇宙速度' },
    ],
  },
  {
    chapter: '机械能',
    points: [
      { id: 'K-05-01', title: '功与功率' },
      { id: 'K-05-02', title: '动能定理' },
      { id: 'K-05-03', title: '势能' },
      { id: 'K-05-04', title: '机械能守恒定律' },
    ],
  },
  {
    chapter: '静电场',
    points: [
      { id: 'K-06-01', title: '库仑定律' },
      { id: 'K-06-02', title: '电场强度' },
      { id: 'K-06-03', title: '电势与电势差' },
      { id: 'K-06-04', title: '电容器' },
    ],
  },
  {
    chapter: '动量守恒定律',
    points: [
      { id: 'K-07-01', title: '动量与冲量' },
      { id: 'K-07-02', title: '动量守恒定律' },
      { id: 'K-07-03', title: '碰撞' },
    ],
  },
]

// 把知识点标题简化成标签关键词集（用于和题库 tags 做模糊匹配）
export function pointKeywords(pointTitle) {
  return pointTitle
    .replace(/（.*?）/g, '')
    .replace(/[（）()·。]/g, '')
    .split(/与|和/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// 根据章节名返回精简关键词（做题库过滤）
export function chapterKeywords(chapterName) {
  const map = {
    运动的描述: ['运动', '参考系', '位移', '速度', '加速度', '匀变速'],
    牛顿运动定律: ['牛顿', '惯性', '平衡', '超重', '失重', '摩擦'],
    曲线运动: ['平抛', '曲线', '圆周', '向心'],
    万有引力与航天: ['万有引力', '卫星', '开普勒', '宇宙'],
    机械能: ['机械能', '动能', '势能', '功', '功率'],
    静电场: ['电场', '电势', '库仑', '电容'],
    动量守恒定律: ['动量', '冲量', '碰撞'],
  }
  return map[chapterName] || [chapterName]
}
