export default function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Grain / noise layer */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.1 0 0 0 0 0.22 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Wave lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
            <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,480 C240,420 480,560 720,500 C960,440 1200,560 1440,480"
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth="1.25"
          strokeDasharray="4 8"
          style={{ animation: 'wave-line 12s linear infinite' }}
        />
        <path
          d="M0,640 C260,600 520,700 780,640 C1040,580 1260,680 1440,620"
          fill="none"
          stroke="url(#waveGrad2)"
          strokeWidth="1"
          strokeDasharray="2 10"
          style={{ animation: 'wave-line 18s linear infinite reverse' }}
        />
      </svg>

      {/* Atom / orbit cluster — top right */}
      <div
        className="absolute"
        style={{ top: '6%', right: '8%', width: 220, height: 220, opacity: 0.55 }}
      >
        <div
          className="absolute inset-0 rounded-full border border-indigo-400/30"
          style={{ transform: 'rotate(0deg)' }}
        />
        <div
          className="absolute inset-2 rounded-full border border-blue-400/25"
          style={{ transform: 'rotate(60deg) scaleY(0.55)' }}
        />
        <div
          className="absolute inset-4 rounded-full border border-cyan-400/20"
          style={{ transform: 'rotate(-35deg) scaleY(0.35)' }}
        />
        {/* Nucleus */}
        <div
          className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-indigo-500/60"
          style={{ boxShadow: '0 0 18px 4px rgba(99,102,241,0.35)' }}
        />
        {/* Orbiting electrons */}
        <div
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-cyan-400"
          style={{ '--r': '100px', animation: 'orbit-dot 9s linear infinite' }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-indigo-400"
          style={{ '--r': '82px', animation: 'orbit-dot 13s linear infinite reverse' }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-1 h-1 -ml-[2px] -mt-[2px] rounded-full bg-blue-400"
          style={{ '--r': '62px', animation: 'orbit-dot 6.5s linear infinite' }}
        />
      </div>

      {/* Soft orb — bottom left */}
      <div
        className="absolute rounded-full blur-3xl float-slow"
        style={{
          bottom: '-6%',
          left: '-4%',
          width: 420,
          height: 420,
          background:
            'radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.18), rgba(14, 165, 233, 0.08) 45%, transparent 70%)',
        }}
      />

      {/* Soft orb — top center */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          top: '-10%',
          left: '38%',
          width: 520,
          height: 520,
          background:
            'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.16), transparent 65%)',
        }}
      />

      {/* Particle dots scattered */}
      {[
        { top: '22%', left: '12%', s: 3, d: '0s' },
        { top: '68%', left: '24%', s: 2, d: '1.2s' },
        { top: '38%', left: '62%', s: 2.5, d: '0.6s' },
        { top: '82%', left: '74%', s: 2, d: '1.8s' },
        { top: '18%', left: '84%', s: 2.5, d: '0.3s' },
        { top: '55%', left: '46%', s: 2, d: '2.2s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full float-slow"
          style={{
            top: p.top,
            left: p.left,
            width: p.s,
            height: p.s,
            background: 'rgba(79, 70, 229, 0.55)',
            boxShadow: '0 0 10px 2px rgba(99, 102, 241, 0.35)',
            animationDelay: p.d,
          }}
        />
      ))}
    </div>
  )
}
