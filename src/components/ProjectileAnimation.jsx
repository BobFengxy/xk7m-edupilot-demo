import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, History } from 'lucide-react'

const G = 9.8
const SCALE = 40 // pixels per meter

export default function ProjectileAnimation({ compact = false }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const stateRef = useRef({ t: 0, playing: true, trail: [] })

  const [v0, setV0] = useState(10)
  const [h0, setH0] = useState(5)
  const [playing, setPlaying] = useState(true)
  const [showReplay, setShowReplay] = useState(false)

  const tFlight = Math.sqrt((2 * h0) / G)
  const range = v0 * tFlight
  const t = Math.min(stateRef.current.t, tFlight)
  const x = v0 * t
  const y = h0 - 0.5 * G * t * t
  const vx = v0
  const vy = G * t

  useEffect(() => {
    stateRef.current = { t: 0, playing: true, trail: [] }
    setPlaying(true)
    setShowReplay(false)
  }, [v0, h0])

  useEffect(() => {
    stateRef.current.playing = playing
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = compact ? 560 : 780
    const H = compact ? 320 : 420
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.scale(dpr, dpr)

    const originX = 80
    const originY = H - 60

    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const s = stateRef.current
      if (s.playing) {
        const tFlightLocal = Math.sqrt((2 * h0) / G)
        s.t += dt
        if (s.t >= tFlightLocal) {
          s.t = tFlightLocal
          s.playing = false
          setPlaying(false)
          setShowReplay(true)
        }
        const xm = v0 * s.t
        const ym = h0 - 0.5 * G * s.t * s.t
        s.trail.push({ x: xm, y: ym })
      }

      ctx.clearRect(0, 0, W, H)

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#f0f9ff')
      bg.addColorStop(1, '#e0e7ff')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Ground
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, originY)
      ctx.lineTo(W, originY)
      ctx.stroke()

      // Grid (1m gridlines)
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 0.5
      for (let i = 0; i < 20; i++) {
        const gx = originX + i * SCALE
        if (gx > W) break
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, originY); ctx.stroke()
      }
      for (let i = 1; i < 15; i++) {
        const gy = originY - i * SCALE
        if (gy < 0) break
        ctx.beginPath(); ctx.moveTo(originX, gy); ctx.lineTo(W, gy); ctx.stroke()
      }

      // Axis labels
      ctx.fillStyle = '#64748b'
      ctx.font = '11px -apple-system, sans-serif'
      ctx.fillText('0', originX - 12, originY + 14)
      ctx.fillText('x/m', W - 30, originY - 6)
      ctx.save()
      ctx.translate(originX - 30, 20)
      ctx.fillText('y/m', 0, 0)
      ctx.restore()

      // Launch platform
      ctx.fillStyle = '#475569'
      const platformY = originY - h0 * SCALE
      ctx.fillRect(originX - 30, platformY, 30, originY - platformY)

      // Trail
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.beginPath()
      stateRef.current.trail.forEach((p, i) => {
        const px = originX + p.x * SCALE
        const py = originY - p.y * SCALE
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()

      // Predicted full trajectory (light)
      const tMax = Math.sqrt((2 * h0) / G)
      ctx.strokeStyle = '#93c5fd'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      for (let ti = 0; ti <= tMax + 0.01; ti += 0.05) {
        const xm = v0 * ti
        const ym = h0 - 0.5 * G * ti * ti
        const px = originX + xm * SCALE
        const py = originY - ym * SCALE
        if (ti === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Ball
      const curXm = v0 * stateRef.current.t
      const curYm = Math.max(0, h0 - 0.5 * G * stateRef.current.t * stateRef.current.t)
      const bx = originX + curXm * SCALE
      const by = originY - curYm * SCALE
      ctx.fillStyle = '#2563eb'
      ctx.beginPath()
      ctx.arc(bx, by, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#1e40af'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Velocity vectors
      if (stateRef.current.t > 0.01 && stateRef.current.t < tMax) {
        const vxPx = vx * 4
        const vyPx = G * stateRef.current.t * 4
        // vx (horizontal, cyan)
        drawArrow(ctx, bx, by, bx + vxPx, by, '#06b6d4')
        // vy (vertical, amber)
        drawArrow(ctx, bx, by, bx, by + vyPx, '#f59e0b')
      }

      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [v0, h0, compact])

  const handleReset = () => {
    stateRef.current = { t: 0, playing: true, trail: [] }
    setPlaying(true)
    setShowReplay(false)
  }

  const handleReplay = () => {
    stateRef.current = { t: 0, playing: true, trail: [] }
    setPlaying(true)
    setShowReplay(false)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 flex items-center justify-between">
        <span className="text-white font-medium text-[13px]">🎮 互动实验：平抛运动轨迹仿真</span>
        <span className="text-[10px] text-white/70 bg-white/15 px-2 py-0.5 rounded-full">Canvas · 人教版必修一</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-2 bg-slate-50">
        <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
      </div>
      <div className="px-4 py-2 bg-white border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 text-[11px]">
          <label className="flex items-center gap-2 flex-1">
            <span className="text-gray-500 w-14 shrink-0">初速度 v₀</span>
            <input type="range" min="0" max="20" step="0.5" value={v0} onChange={(e) => setV0(Number(e.target.value))} className="flex-1 accent-blue-600" />
            <span className="font-mono text-blue-600 w-12 text-right">{v0.toFixed(1)} m/s</span>
          </label>
          <label className="flex items-center gap-2 flex-1">
            <span className="text-gray-500 w-14 shrink-0">高度 h</span>
            <input type="range" min="0.5" max="10" step="0.1" value={h0} onChange={(e) => setH0(Number(e.target.value))} className="flex-1 accent-violet-600" />
            <span className="font-mono text-violet-600 w-12 text-right">{h0.toFixed(1)} m</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying(!playing)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? '暂停' : '播放'}
          </button>
          <button onClick={handleReset} className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
            <RotateCcw className="w-3 h-3" /> 重置
          </button>
          {showReplay && (
            <button onClick={handleReplay} className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-violet-100 text-violet-600 rounded-md hover:bg-violet-200">
              <History className="w-3 h-3" /> 轨迹回放
            </button>
          )}
          <div className="flex-1 flex items-center justify-end gap-3 text-[10px] font-mono">
            <span className="text-cyan-600">vₓ={vx.toFixed(1)}</span>
            <span className="text-amber-600">vᵧ={vy.toFixed(1)}</span>
            <span className="text-blue-600">x={x.toFixed(2)}m</span>
            <span className="text-violet-600">y={y.toFixed(2)}m</span>
            <span className="text-emerald-600">t={t.toFixed(2)}s</span>
            <span className="text-gray-500">落地t={tFlight.toFixed(2)}s</span>
            <span className="text-gray-500">射程={range.toFixed(2)}m</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 3) return
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  const ang = Math.atan2(dy, dx)
  const head = 6
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - head * Math.cos(ang - Math.PI / 6), y2 - head * Math.sin(ang - Math.PI / 6))
  ctx.lineTo(x2 - head * Math.cos(ang + Math.PI / 6), y2 - head * Math.sin(ang + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}
