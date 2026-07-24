import { Menu } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import LogoutButton from './LogoutButton'

export default function Topbar({ onOpenSidebar }) {
  const { user } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <button
        onClick={onOpenSidebar}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Mở menu"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm text-slate-500">Xin chào, {user.username}</span>}
        <LogoutButton />
      </div>
    </header>
  )
}
