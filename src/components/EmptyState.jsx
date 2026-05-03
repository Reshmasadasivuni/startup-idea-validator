import { useState, useEffect } from 'react'

const PHRASES = [
  'AI is ready to analyze your idea…',
  'Get VC-level feedback in seconds…',
  'Discover your market opportunity…',
  'Uncover risks before they find you…',
]

function useTypingEffect(phrases, typeSpeed = 55, deleteSpeed = 28, pause = 2200) {
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    if (waiting) return
    const current = phrases[phraseIdx]

    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }

    if (deleting && charIdx === 0) {
      setDeleting(false)
      setPhraseIdx(i => (i + 1) % phrases.length)
      return
    }

    const t = setTimeout(() => {
      setCharIdx(i => deleting ? i - 1 : i + 1)
      setText(current.slice(0, deleting ? charIdx - 1 : charIdx + 1))
    }, deleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(t)
  }, [charIdx, deleting, phraseIdx, phrases, typeSpeed, deleteSpeed, pause, waiting])

  return text
}

/* Fake blurred preview cards */
function FakeCard({ className, children }) {
  return (
    <div
      className={`absolute glass rounded-xl p-3 select-none pointer-events-none ${className}`}
      style={{ filter: 'blur(1.5px)', opacity: 0.45 }}
    >
      {children}
    </div>
  )
}

function FakeRow({ w = 'w-full', light = false }) {
  return <div className={`h-2 ${w} rounded-full mb-1.5 ${light ? 'bg-white/10' : 'bg-white/[0.07]'}`} />
}

export default function EmptyState() {
  const text = useTypingEffect(PHRASES)

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[520px] overflow-hidden select-none">

      {/* ── Background blobs ── */}
      <div className="blob blob-1" style={{ top: '-60px', left: '-80px' }} />
      <div className="blob blob-2" style={{ bottom: '-60px', right: '-60px' }} />

      {/* ── Floating blurred preview cards ── */}
      <FakeCard className="w-44 top-8 left-2 float-card-1">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded bg-emerald-500/25" />
          <div className="h-2 w-12 bg-white/10 rounded-full" />
        </div>
        <FakeRow w="w-full" />
        <FakeRow w="w-4/5" />
        <FakeRow w="w-3/4" />
        <FakeRow w="w-full" light />
      </FakeCard>

      <FakeCard className="w-40 top-12 right-0 float-card-2">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded bg-violet-500/30" />
          <div className="h-2 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="flex items-end gap-1.5 mb-2">
          <div className="text-2xl font-black text-violet-400/40">7</div>
          <div className="text-xs text-white/15 pb-0.5">/10</div>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full w-[70%] bg-violet-500/30 rounded-full" />
        </div>
      </FakeCard>

      <FakeCard className="w-48 bottom-10 left-0 float-card-3">
        <div className="h-2 w-20 bg-white/10 rounded-full mb-2.5" />
        <div className="flex flex-wrap gap-1 mb-2">
          {[28, 36, 24].map(w => (
            <div key={w} className="h-4 rounded-full bg-white/[0.07]" style={{ width: w }} />
          ))}
        </div>
        <FakeRow w="w-full" />
        <FakeRow w="w-5/6" />
      </FakeCard>

      <FakeCard className="w-36 bottom-14 right-2 float-card-2" style={{ filter: 'blur(2px)', opacity: 0.3 }}>
        <FakeRow w="w-3/4" />
        <FakeRow w="w-full" />
        <FakeRow w="w-2/3" />
      </FakeCard>

      {/* ── Glowing AI Orb ── */}
      <div className="relative z-10 mb-8">
        {/* Expanding rings */}
        <div className="orb-ring" style={{ animationDelay: '0s' }} />
        <div className="orb-ring" style={{ animationDelay: '0.8s' }} />
        <div className="orb-ring" style={{ animationDelay: '1.6s' }} />

        {/* Core orb */}
        <div
          className="orb-core relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)' }}
        >
          {/* Inner glow */}
          <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          {/* Icon */}
          <svg className="relative w-8 h-8 text-white" fill="none" viewBox="0 0 32 32">
            {/* Sparkle / neural node icon */}
            <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.9" />
            <circle cx="6"  cy="8"  r="2.5" fill="currentColor" opacity="0.5" />
            <circle cx="26" cy="8"  r="2.5" fill="currentColor" opacity="0.5" />
            <circle cx="6"  cy="24" r="2.5" fill="currentColor" opacity="0.5" />
            <circle cx="26" cy="24" r="2.5" fill="currentColor" opacity="0.5" />
            <circle cx="16" cy="4"  r="2"   fill="currentColor" opacity="0.4" />
            <circle cx="16" cy="28" r="2"   fill="currentColor" opacity="0.4" />
            <line x1="16" y1="12" x2="8"  y2="9.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="16" y1="12" x2="24" y2="9.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="16" y1="20" x2="8"  y2="22.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="16" y1="20" x2="24" y2="22.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="16" y1="12" x2="16" y2="6"  stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1="16" y1="20" x2="16" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          </svg>
        </div>
      </div>

      {/* ── Typing text ── */}
      <div className="relative z-10 text-center mb-7">
        <p className="text-sm font-mono text-slate-300 h-5">
          {text}
          <span className="cursor-blink ml-0.5 text-violet-400">|</span>
        </p>
        <p className="mt-1.5 text-xs text-slate-600">
          Describe your idea on the left to get started
        </p>
      </div>

      {/* ── Feature pills ── */}
      <div className="relative z-10 flex flex-wrap justify-center gap-2">
        {[
          { label: 'Market Opportunity', color: 'border-violet-500/25 text-violet-400/70' },
          { label: 'Competition Analysis', color: 'border-blue-500/25 text-blue-400/70' },
          { label: 'Viability Score', color: 'border-indigo-500/25 text-indigo-400/70' },
          { label: 'Action Plan',     color: 'border-sky-500/25   text-sky-400/70' },
          { label: 'Monetization',    color: 'border-purple-500/25 text-purple-400/70' },
        ].map(({ label, color }) => (
          <span
            key={label}
            className={`text-[11px] font-medium px-3 py-1 rounded-full border glass ${color} animate-skeleton`}
            style={{ animationDuration: `${1.8 + Math.random() * 0.8}s` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
