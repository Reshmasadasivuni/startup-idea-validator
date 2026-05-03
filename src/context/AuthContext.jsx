import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('signin') // 'signin' | 'signup'

  const openAuth = useCallback((mode = 'signin') => {
    setModalMode(mode)
    setShowModal(true)
  }, [])

  const closeAuth = useCallback(() => setShowModal(false), [])

  const login = useCallback((email, _password) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    setUser({ name, email })
    setShowModal(false)
    return { ok: true }
  }, [])

  const signup = useCallback((name, email, _password) => {
    setUser({ name, email })
    setShowModal(false)
    return { ok: true }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, showModal, modalMode, openAuth, closeAuth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
