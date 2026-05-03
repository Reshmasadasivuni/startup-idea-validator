import { Link } from 'react-router-dom'

const STEPS = [
  {
    num: '01',
    title: 'Describe your idea',
    body: 'Write a short description of your startup concept — what it does and who it serves.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    num: '02',
    title: 'AI analyzes it',
    body: 'Groq\'s LLaMA 3.3 70B model runs a structured VC-level analysis on your idea instantly.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    num: '03',
    title: 'Review the breakdown',
    body: 'Get pros, cons, risks, suggestions, target users, a viability score, and a final verdict.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
]

const FIELDS = [
  { icon: '✓', label: 'Pros', desc: 'Key strengths of the concept', color: 'text-emerald-400' },
  { icon: '✕', label: 'Cons', desc: 'Real limitations to address', color: 'text-rose-400' },
  { icon: '⚠', label: 'Risks', desc: 'Practical execution risks', color: 'text-amber-400' },
  { icon: '💡', label: 'Suggestions', desc: 'Concrete next steps', color: 'text-blue-400' },
  { icon: '🎯', label: 'Target Users', desc: 'Who your customers are', color: 'text-violet-400' },
  { icon: '📊', label: 'Viability Score', desc: 'Rated 1–10 with reasoning', color: 'text-indigo-400' },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          About this tool
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-4">
          Honest feedback for your<br />
          <span className="gradient-text">startup ideas</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
          Startup Validator uses AI to give you the kind of direct, structured feedback a VC would
          give — without the gatekeeping or the bias.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-12 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">How it works</h2>
        <div className="space-y-3">
          {STEPS.map(s => (
            <div key={s.num} className={`glass rounded-xl p-5 flex items-start gap-4 border ${s.bg}`}>
              <span className={`text-2xl font-black ${s.color} shrink-0`}>{s.num}</span>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">{s.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What you get */}
      <div className="mb-12 animate-fade-up" style={{ animationDelay: '160ms' }}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">What you get</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FIELDS.map(f => (
            <div key={f.label} className="glass glass-hover rounded-xl p-4">
              <span className={`text-xl mb-2 block ${f.color}`}>{f.icon}</span>
              <p className="text-sm font-semibold text-white mb-0.5">{f.label}</p>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="mb-12 animate-fade-up glass rounded-xl p-6" style={{ animationDelay: '240ms' }}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React 18', 'Vite', 'Tailwind CSS', 'Express.js', 'Groq API', 'LLaMA 3.3 70B', 'React Router'].map(t => (
            <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center animate-fade-up" style={{ animationDelay: '320ms' }}>
        <Link
          to="/"
          className="btn-gradient inline-flex items-center gap-2 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-violet-500/20"
        >
          Try it now →
        </Link>
        <p className="mt-3 text-xs text-slate-600">Free to use. No sign-up required.</p>
      </div>
    </div>
  )
}
