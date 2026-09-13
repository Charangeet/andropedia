import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, login as apiLogin, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession()
      .then((s) => setAuthenticated(s.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false))
  }, [])

  async function login(password) {
    await apiLogin(password)
    setAuthenticated(true)
  }

  async function logout() {
    await apiLogout()
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
