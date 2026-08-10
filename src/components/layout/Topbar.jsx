import { Menu, Search, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { useTheme } from '../../context/useTheme'
import LogoutButton from './LogoutButton'

export default function Topbar({ onOpenSidebar, onOpenPalette }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 lg:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onOpenPalette}
          className="hidden items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-500 transition hover:border-brand-accent/40 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-accent/40 dark:hover:bg-slate-800 sm:flex"
        >
          <Search size={15} />
          Tìm kiếm nhanh
          <kbd className="rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-600">Ctrl K</kbd>
        </button>
        <button
          onClick={onOpenPalette}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
          aria-label="Tìm kiếm nhanh"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand-accent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-brand-accent"
          aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-accent to-sky-400 text-xs font-semibold text-white shadow-sm">
              {user.username?.slice(0, 2).toUpperCase()}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.username}</p>
              <p className="text-xs text-slate-400">Xin chào bạn quay lại</p>
            </div>
          </div>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}
