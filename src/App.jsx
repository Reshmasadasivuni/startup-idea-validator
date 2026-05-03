import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen dot-grid">
        {/* Ambient glow blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-64 -right-64 w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, #4f46e5, transparent 70%)' }}
          />
        </div>

        <Navbar />

        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Global auth modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  )
}
