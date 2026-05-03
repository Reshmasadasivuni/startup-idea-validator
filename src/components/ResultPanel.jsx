import { useState, useRef, useEffect } from 'react'
import ScoreCircle from './ScoreCircle'
import SkeletonLoader from './SkeletonLoader'
import EmptyState from './EmptyState'
import { useAuth } from '../context/AuthContext'
import { callAction } from '../api/validateIdea'

/* ── Section configs ──────────────────────────────────── */
const OVERVIEW_EXTRA = [
  {
    key: 'market_opportunity',
    label: 'Market Opportunity',
    icon: '📈',
    headerBg: 'bg-violet-500/10 border-violet-500/20',
    headerText: 'text-violet-400',
    dot: 'bg-violet-400',
    iconBg: 'bg-violet-500/15',
  },
  {
    key: 'competition_insight',
    label: 'Competition Insight',
    icon: '🏆',
    headerBg: 'bg-sky-500/10 border-sky-500/20',
    headerText: 'text-sky-400',
    dot: 'bg-sky-400',
    iconBg: 'bg-sky-500/15',
  },
]

const ANALYSIS_SECTIONS = [
  { key: 'pros', label: 'Pros', icon: '✓', headerBg: 'bg-emerald-500/10 border-emerald-500/20', headerText: 'text-emerald-400', dot: 'bg-emerald-400', iconBg: 'bg-emerald-500/15' },
  { key: 'cons', label: 'Cons', icon: '✕', headerBg: 'bg-rose-500/10 border-rose-500/20', headerText: 'text-rose-400', dot: 'bg-rose-400', iconBg: 'bg-rose-500/15' },
  { key: 'risks', label: 'Risks', icon: '⚠', headerBg: 'bg-amber-500/10 border-amber-500/20', headerText: 'text-amber-400', dot: 'bg-amber-400', iconBg: 'bg-amber-500/15' },
  { key: 'monetization_strategy', label: 'Monetization', icon: '$', headerBg: 'bg-teal-500/10 border-teal-500/20', headerText: 'text-teal-400', dot: 'bg-teal-400', iconBg: 'bg-teal-500/15' },
  { key: 'suggestions', label: 'Suggestions', icon: '💡', headerBg: 'bg-blue-500/10 border-blue-500/20', headerText: 'text-blue-400', dot: 'bg-blue-400', iconBg: 'bg-blue-500/15' },
  { key: 'next_steps', label: 'Next Steps', icon: '→', headerBg: 'bg-indigo-500/10 border-indigo-500/20', headerText: 'text-indigo-400', dot: 'bg-indigo-400', iconBg: 'bg-indigo-500/15' },
]

/* ── Execution difficulty badge ─────────────────────────── */
function difficultyColor(level) {
  if (!level) return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  const l = level.toLowerCase()
  if (l === 'low')    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
  if (l === 'medium') return 'bg-amber-500/10   text-amber-400   border-amber-500/25'
  return 'bg-red-500/10 text-red-400 border-red-500/25'
}

/* ── Verdict color ──────────────────────────────────────── */
function verdictBg(score) {
  if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
  if (score >= 5) return 'bg-amber-500/10   border-amber-500/25   text-amber-300'
  return 'bg-red-500/10 border-red-500/25 text-red-300'
}

/* ── Generic section card ──────────────────────────────── */
function SectionCard({ s, items, delay = 0 }) {
  return (
    <div
      className="glass glass-hover rounded-xl overflow-hidden animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex items-center gap-2.5 px-4 py-2.5 border-b ${s.headerBg}`}>
        <span className={`w-5 h-5 rounded-md ${s.iconBg} flex items-center justify-center text-[11px] font-bold ${s.headerText} shrink-0`}>
          {s.icon}
        </span>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${s.headerText}`}>{s.label}</span>
      </div>
      <ul className="px-4 py-3.5 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={`mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
            <p className="text-xs text-slate-400 leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Copy button ────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function handle() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={handle} className="copy-btn flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-300 px-2.5 py-1.5 rounded-lg transition-all">
      {copied ? (
        <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 16 16"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-emerald-400">Copied!</span></>
      ) : (
        <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16"><rect x="1" y="4" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1h9A1.5 1.5 0 0 1 16 2.5v9A1.5 1.5 0 0 1 14.5 13H13" stroke="currentColor" strokeWidth="1.2"/></svg>Copy result</>
      )}
    </button>
  )
}

/* ── Locked overlay ─────────────────────────────────────── */
function LockedOverlay({ onUnlock }) {
  return (
    <div className="locked-overlay rounded-xl z-10">
      <div className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center mb-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 20 20">
          <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-xs font-semibold text-slate-300">Sign up to unlock</p>
      <p className="text-[10px] text-slate-500 mt-0.5 mb-3">Free account required</p>
      <button
        onClick={onUnlock}
        className="btn-gradient text-white text-[11px] font-bold px-4 py-2 rounded-lg"
      >
        Sign Up Free →
      </button>
    </div>
  )
}

/* ── Action button with expandable panel ────────────────── */
function ActionButton({ icon, label, sublabel, locked, onLockedClick, onClick, isActive, loading, content }) {
  return (
    <div className="flex flex-col">
      <button
        onClick={locked ? onLockedClick : onClick}
        className={`relative flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 overflow-hidden ${
          isActive
            ? 'bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10'
            : 'glass hover:bg-white/[0.06] hover:border-white/[0.14]'
        }`}
      >
        <span className="text-lg shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${isActive ? 'text-violet-300' : 'text-slate-300'}`}>{label}</p>
          <p className="text-[10px] text-slate-600 truncate">{sublabel}</p>
        </div>
        {locked && (
          <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" viewBox="0 0 16 16">
            <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        )}
        {!locked && !loading && (
          <svg className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 16 16">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {loading && (
          <svg className="w-3.5 h-3.5 text-violet-400 shrink-0" style={{ animation: 'spinnerRotate 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Expanded content */}
      {isActive && content && (
        <div className="animate-expand glass rounded-xl mt-1.5 px-4 py-4 border border-white/[0.06]">
          <pre className="action-content">{content}</pre>
        </div>
      )}
    </div>
  )
}

/* ── Chat flow ──────────────────────────────────────────── */
const CHAT_STARTERS = [
  { label: 'Want to improve this idea?',   action: 'refine',      icon: '✏️' },
  { label: 'Need a monetization plan?',    action: 'pitch',       icon: '💰' },
  { label: 'Who are your competitors?',    action: 'competitors', icon: '🔍' },
  { label: 'How to grow early users?',     action: 'improve',     icon: '📈' },
]

function ChatMessage({ role, content, loading }) {
  return (
    <div className={`animate-bubble-in flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'ai' && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0 mt-0.5 mr-2">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.9"/>
            <circle cx="2" cy="3" r="1" fill="currentColor" opacity="0.5"/>
            <circle cx="10" cy="3" r="1" fill="currentColor" opacity="0.5"/>
            <circle cx="2" cy="9" r="1" fill="currentColor" opacity="0.5"/>
            <circle cx="10" cy="9" r="1" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>
      )}
      <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
        role === 'user'
          ? 'bg-violet-500/20 border border-violet-500/30 text-slate-200'
          : 'glass border border-white/[0.08] text-slate-300'
      }`}>
        {loading ? (
          <div className="flex items-center gap-1.5 py-1">
            {[0, 0.2, 0.4].map(d => (
              <span key={d} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-skeleton" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        ) : (
          <pre className="action-content text-[12px] leading-[1.65]">{content}</pre>
        )}
      </div>
    </div>
  )
}

/* ── Main ResultPanel ───────────────────────────────────── */
export default function ResultPanel({ result, loading, error, idea }) {
  const { isLoggedIn, openAuth } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Action panel state
  const [activeAction, setActiveAction] = useState(null)
  const [actionContent, setActionContent] = useState({})
  const [actionLoading, setActionLoading] = useState(null)

  // Chat state
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (result) {
      setChatMessages([{
        role: 'ai',
        content: `Analysis complete! I found ${result.pros?.length ?? 0} strengths, ${result.risks?.length ?? 0} risks, and a viability score of ${result.score}/10.\n\nWhat would you like to explore next?`,
      }])
      setActiveAction(null)
      setActionContent({})
      setActiveTab('overview')
    }
  }, [result])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const LOCKED_ACTIONS = ['refine', 'pitch', 'improve']

  async function triggerAction(action) {
    if (activeAction === action) {
      setActiveAction(null)
      return
    }
    setActiveAction(action)
    if (actionContent[action]) return // already fetched

    setActionLoading(action)
    try {
      const content = await callAction(idea, action, result?.score)
      setActionContent(prev => ({ ...prev, [action]: content }))
    } catch (err) {
      setActionContent(prev => ({ ...prev, [action]: `Error: ${err.message}` }))
    } finally {
      setActionLoading(null)
    }
  }

  async function sendChatMessage(label, action) {
    if (chatLoading) return

    setChatMessages(prev => [...prev, { role: 'user', content: label }])
    setChatMessages(prev => [...prev, { role: 'ai', content: '', loading: true }])
    setChatLoading(true)

    try {
      const content = await callAction(idea, action, result?.score)
      setChatMessages(prev => {
        const updated = [...prev]
        const loadingIdx = updated.findLastIndex(m => m.loading)
        if (loadingIdx >= 0) updated[loadingIdx] = { role: 'ai', content }
        return updated
      })
    } catch (err) {
      setChatMessages(prev => {
        const updated = [...prev]
        const loadingIdx = updated.findLastIndex(m => m.loading)
        if (loadingIdx >= 0) updated[loadingIdx] = { role: 'ai', content: `Sorry, something went wrong: ${err.message}` }
        return updated
      })
    } finally {
      setChatLoading(false)
    }
  }

  const copyText = result ? [
    `VERDICT: ${result.verdict}`,
    `SCORE: ${result.score}/10`,
    `\nSUMMARY\n${result.summary}`,
    `\nMARKET OPPORTUNITY\n${result.market_opportunity?.map(p => `• ${p}`).join('\n')}`,
    `\nPROS\n${result.pros?.map(p => `• ${p}`).join('\n')}`,
    `\nCONS\n${result.cons?.map(c => `• ${c}`).join('\n')}`,
    `\nRISKS\n${result.risks?.map(r => `• ${r}`).join('\n')}`,
    `\nNEXT STEPS\n${result.next_steps?.map(s => `• ${s}`).join('\n')}`,
  ].join('\n') : ''

  /* ── Tabs config ── */
  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'chat', label: 'AI Chat' },
  ]

  return (
    <div className="flex flex-col h-full">

      {/* ── Panel header bar ── */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex gap-0.5 p-0.5 glass rounded-lg">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              disabled={!result && !loading}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                activeTab === t.id
                  ? 'tab-active'
                  : 'text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed'
              } ${t.id === 'chat' && result && chatMessages.length > 0 ? 'relative' : ''}`}
            >
              {t.label}
              {t.id === 'chat' && result && chatMessages.length > 1 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-500" />
              )}
            </button>
          ))}
        </div>

        {result && <CopyButton text={copyText} />}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-4 glass rounded-xl px-4 py-3.5 border border-rose-500/20 flex items-start gap-3 animate-fade-in shrink-0">
          <span className="text-rose-400 shrink-0">⚠</span>
          <div>
            <p className="text-sm font-medium text-rose-300">{error}</p>
            {error.includes('server') && <code className="text-xs text-rose-500 mt-1 block">npm run server</code>}
          </div>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && <SkeletonLoader />}

      {/* ── Empty state ── */}
      {!loading && !result && !error && <EmptyState />}

      {/* ── OVERVIEW TAB ── */}
      {result && !loading && activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-up">
          {/* Verdict */}
          <div className={`rounded-xl px-5 py-4 border glass ${verdictBg(result.score)}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1.5">Verdict</p>
            <p className="text-sm font-semibold leading-snug">{result.verdict}</p>
          </div>

          {/* Score + Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass glass-hover rounded-xl p-5">
              <ScoreCircle score={result.score} />
              {result.score_reason && (
                <p className="mt-3.5 text-xs text-slate-500 leading-relaxed border-t border-white/[0.06] pt-3.5">
                  {result.score_reason}
                </p>
              )}
            </div>
            <div className="glass glass-hover rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Summary</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{result.summary}</p>
              {result.execution_difficulty && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Execution Difficulty</p>
                  <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border mb-2 ${difficultyColor(result.execution_difficulty.level)}`}>
                    {result.execution_difficulty.level}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{result.execution_difficulty.reason}</p>
                </>
              )}
            </div>
          </div>

          {/* Target Users */}
          <div className="glass glass-hover rounded-xl px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">Target Users</p>
            <div className="flex flex-wrap gap-2">
              {result.target_users?.map((u, i) => (
                <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Market Opportunity + Competition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OVERVIEW_EXTRA.map((s, i) => (
              result[s.key] && <SectionCard key={s.key} s={s} items={result[s.key]} delay={i * 60} />
            ))}
          </div>
        </div>
      )}

      {/* ── ANALYSIS TAB ── */}
      {result && !loading && activeTab === 'analysis' && (
        <div className="space-y-5 animate-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ANALYSIS_SECTIONS.map((s, i) => (
              result[s.key] && <SectionCard key={s.key} s={s} items={result[s.key]} delay={i * 50} />
            ))}
          </div>

          {/* Action buttons section */}
          <div className="pt-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">Go Deeper</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { action: 'competitors', icon: '🔍', label: 'Explore Competitors', sublabel: 'Map the competitive landscape', locked: false },
                { action: 'refine',      icon: '✏️', label: 'Refine Idea',          sublabel: '3 strategic pivots to consider', locked: true },
                { action: 'pitch',       icon: '🎤', label: 'Generate Pitch',       sublabel: '30-second elevator pitch',       locked: true },
                { action: 'improve',     icon: '📈', label: 'Improve Score',        sublabel: 'Tactical changes to rank higher', locked: true },
              ].map(({ action, icon, label, sublabel, locked }) => (
                <div key={action} className="relative">
                  <ActionButton
                    icon={icon}
                    label={label}
                    sublabel={sublabel}
                    locked={locked && !isLoggedIn}
                    onLockedClick={() => openAuth('signup')}
                    onClick={() => triggerAction(action)}
                    isActive={activeAction === action}
                    loading={actionLoading === action}
                    content={actionContent[action]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {result && !loading && activeTab === 'chat' && (
        <div className="flex flex-col gap-3 animate-fade-up">
          {/* Chat history */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {chatMessages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} loading={msg.loading} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick reply chips */}
          {!chatLoading && (
            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2.5">Quick follow-ups</p>
              <div className="flex flex-wrap gap-2">
                {CHAT_STARTERS.map(({ label, action, icon }) => {
                  const needsAuth = LOCKED_ACTIONS.includes(action) && !isLoggedIn
                  return (
                    <button
                      key={action}
                      onClick={() => needsAuth ? openAuth('signup') : sendChatMessage(label, action)}
                      disabled={chatLoading}
                      className={`relative flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg border transition-all duration-150 disabled:opacity-40 ${
                        needsAuth
                          ? 'border-white/[0.08] text-slate-600 hover:text-slate-400 bg-white/[0.02]'
                          : 'border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.14] bg-white/[0.03]'
                      }`}
                    >
                      <span>{icon}</span>
                      {label}
                      {needsAuth && (
                        <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 12 12">
                          <rect x="2" y="5.5" width="8" height="5.5" rx="1" stroke="currentColor" strokeWidth="1"/>
                          <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
