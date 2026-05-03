import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, isLoggedIn, openAuth, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.196 4V10L7 13L1.804 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">
            Startup <span className="gradient-text">Validator</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1 mr-2">
            {[{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  pathname === to
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-300 hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuth('signin')}
                className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="btn-gradient text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-md shadow-violet-500/20"
              >
                Sign up free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
