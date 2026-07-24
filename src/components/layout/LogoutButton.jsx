import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

export default function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      Đăng xuất
    </button>
  )
}
