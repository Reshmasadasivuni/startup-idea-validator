const EXAMPLES = [
  'AI tool that turns Notion pages into interactive courses with quizzes.',
  'Subscription service sending personalized book summaries as 5-min audio clips.',
  'Marketplace where local chefs cook and deliver home-style meals nearby.',
  'SaaS platform helping remote teams run async standups with AI summaries.',
]

export default function InputPanel({ idea, setIdea, onValidate, loading }) {
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onValidate()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header badge */}
      <div>
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-Powered Analysis
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
          Validate your<br />
          <span className="gradient-text">startup idea</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Get an honest, structured analysis in seconds.
        </p>
      </div>

      {/* Textarea card */}
      <div className="glass rounded-xl p-1 focus-within:ring-2 focus-within:ring-violet-500/40 transition-all duration-200">
        <textarea
          rows={6}
          value={idea}
          onChange={e => setIdea(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your startup idea in detail...&#10;&#10;e.g. An AI-powered platform that helps freelancers find clients and manage projects automatically."
          className="w-full bg-transparent resize-none px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-[11px] text-slate-600">
            {idea.length > 0 ? `${idea.length} chars` : 'Press Enter to submit'}
          </span>
          <button
            onClick={onValidate}
            disabled={loading || !idea.trim()}
            className="btn-gradient text-white text-xs font-bold px-5 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-violet-500/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3" style={{ animation: 'spinnerRotate 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Analyzing…
              </span>
            ) : 'Validate →'}
          </button>
        </div>
      </div>

      {/* Full-width validate button (visible on mobile) */}
      <button
        onClick={onValidate}
        disabled={loading || !idea.trim()}
        className="btn-gradient w-full text-white text-sm font-bold py-3.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-violet-500/20 lg:hidden"
      >
        {loading ? 'Analyzing…' : 'Validate Idea →'}
      </button>

      {/* Example chips */}
      <div>
        <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
          Example ideas
        </p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setIdea(ex)}
              className="text-left text-xs text-slate-400 px-3.5 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:text-slate-200 hover:border-white/[0.12] transition-all duration-150 leading-relaxed"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
