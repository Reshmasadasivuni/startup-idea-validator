import { useEffect, useState } from 'react'

const RADIUS = 46
const CIRC = 2 * Math.PI * RADIUS

function colorForScore(score) {
  if (score >= 8) return {
    stroke: '#34d399',
    glow: '#34d39966',
    text: 'text-emerald-400',
    label: 'Strong',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  }
  if (score >= 5) return {
    stroke: '#fbbf24',
    glow: '#fbbf2466',
    text: 'text-amber-400',
    label: 'Moderate',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  }
  return {
    stroke: '#f87171',
    glow: '#f8717166',
    text: 'text-red-400',
    label: 'Weak',
    badge: 'bg-red-500/10 text-red-400 border-red-500/25',
  }
}

export default function ScoreCircle({ score }) {
  const cfg = colorForScore(score)
  const targetOffset = CIRC - (score / 10) * CIRC

  // Arc animation
  const [offset, setOffset] = useState(CIRC)
  // Count-up animation
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    // Reset on new score
    setOffset(CIRC)
    setDisplayScore(0)

    const arcTimer = setTimeout(() => setOffset(targetOffset), 80)

    // Count up from 0 → score over ~900ms
    let frame = 0
    const totalFrames = 22
    const countTimer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))
      if (frame >= totalFrames) clearInterval(countTimer)
    }, 900 / totalFrames)

    return () => {
      clearTimeout(arcTimer)
      clearInterval(countTimer)
    }
  }, [score, targetOffset])

  return (
    <div className="flex items-center gap-5">
      {/* SVG circle */}
      <div className="relative shrink-0">
        <svg width="108" height="108" viewBox="0 0 108 108" className="-rotate-90">
          {/* Track */}
          <circle cx="54" cy="54" r={RADIUS} stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="none" />
          {/* Arc */}
          <circle
            cx="54" cy="54" r={RADIUS}
            stroke={cfg.stroke}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.1s cubic-bezier(0.34,1.56,0.64,1)',
              filter: `drop-shadow(0 0 7px ${cfg.glow})`,
            }}
          />
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Count-up shimmer strip */}
          <div className="relative overflow-hidden">
            <span className={`text-[2rem] font-black leading-none ${cfg.text}`}>
              {displayScore}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-medium">/10</span>
        </div>
      </div>

      {/* Label */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">
          Viability Score
        </p>
        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
          {cfg.label} Concept
        </span>
      </div>
    </div>
  )
}
