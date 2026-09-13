import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loading } from './StatusMessage'

export default function RequireAuth() {
  const { authenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading label="Checking session..." />
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <Outlet />
}
