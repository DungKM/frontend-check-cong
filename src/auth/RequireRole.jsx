import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RequireRole({ roles }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
