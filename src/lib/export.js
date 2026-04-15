import PptxGenJS from 'pptxgenjs'
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx'
import { saveAs } from 'file-saver'

const BLUE = '2563EB'
const INDIGO = '4F46E5'
const DARK = '111827'
const GRAY = '4B5563'

export async function exportPptx(topic, slides) {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.title = `${topic} — 教学课件`

  for (const s of slides) {
    const slide = pptx.addSlide()
    if (s.type === 'cover') {
      slide.background = { color: BLUE }
      slide.addText(s.title || topic, {
        x: 0.5, y: 2.5, w: 12, h: 1.5, fontSize: 48, bold: true, color: 'FFFFFF', align: 'center', fontFace: '思源黑体, PingFang SC, sans-serif',
      })
      slide.addText(s.subtitle || '高中物理 · AI 生成课件', {
        x: 0.5, y: 4.2, w: 12, h: 0.6, fontSize: 20, color: 'E0E7FF', align: 'center',
      })
    } else if (s.type === 'interactive') {
      slide.background = { color: 'F5F3FF' }
      slide.addText('🎮 互动实验：平抛运动轨迹仿真', {
        x: 0.5, y: 0.5, w: 12, h: 0.7, fontSize: 24, bold: true, color: INDIGO, fontFace: '思源黑体',
      })
      slide.addText('（此页在演示系统中为 Canvas 实时交互动画，双滑块调节初速度 v₀ 与抛出高度 h，实时展示轨迹、速度、位移数据）', {
        x: 0.5, y: 1.5, w: 12, h: 1, fontSize: 14, color: GRAY, italic: true,
      })
      slide.addText('核心公式：', { x: 0.5, y: 3, w: 12, h: 0.4, fontSize: 16, bold: true, color: DARK })
      slide.addText('x = v₀·t       y = ½·g·t²       t = √(2h/g)       v = √(v₀² + (g·t)²)', {
        x: 0.5, y: 3.5, w: 12, h: 0.6, fontSize: 18, color: BLUE, fontFace: 'Cascadia Code, Consolas, monospace',
      })
    } else {
      // Text slide
      slide.background = { color: 'FFFFFF' }
      slide.addShape('rect', { x: 0.5, y: 0.55, w: 0.1, h: 0.5, fill: { color: BLUE }, line: { color: BLUE } })
      slide.addText(s.title || '', {
        x: 0.75, y: 0.5, w: 12, h: 0.7, fontSize: 28, bold: true, color: DARK, fontFace: '思源黑体',
      })
      slide.addText(s.content || '', {
        x: 0.75, y: 1.4, w: 12, h: 5.5, fontSize: 18, color: GRAY, valign: 'top', fontFace: '思源黑体', paraSpaceAfter: 8,
      })
    }

    // Footer
    slide.addText(`${s.id} · ${topic}`, {
      x: 0.5, y: 7.1, w: 12, h: 0.3, fontSize: 10, color: '9CA3AF', align: 'right',
    })
  }

  const safeTopic = topic.replace(/[\\/:*?"<>|]/g, '')
  await pptx.writeFile({ fileName: `${safeTopic}_教学课件.pptx` })
}

export async function exportDocx(topic, slides) {
  const paragraphs = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: `${topic} · 教案`, bold: true, size: 56 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: '高中物理 · Edu-Pilot AI 生成', color: '6B7280', size: 22 })],
    }),
    new Paragraph({ children: [new TextRun('')] }),
  ]

  for (const s of slides) {
    if (s.type === 'cover') continue
    paragraphs.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: `${s.id}. ${s.title}`, bold: true, size: 32, color: BLUE })],
    }))
    if (s.type === 'interactive') {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: '【互动实验】此环节为 Canvas 平抛运动仿真，学生可调节初速度与高度，观察轨迹、速度、位移实时变化。', italics: true, color: '6B7280', size: 24 })],
      }))
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: '核心公式：x = v₀·t；y = ½gt²；t = √(2h/g)；v = √(v₀² + (gt)²)', size: 24 })],
      }))
    } else if (s.content) {
      for (const line of s.content.split('\n')) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
        }))
      }
    }
    paragraphs.push(new Paragraph({ children: [new TextRun('')] }))
  }

  const doc = new Document({ sections: [{ children: paragraphs }] })
  const blob = await Packer.toBlob(doc)
  const safeTopic = topic.replace(/[\\/:*?"<>|]/g, '')
  saveAs(blob, `${safeTopic}_教案.docx`)
}
