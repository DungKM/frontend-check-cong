import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { navSections } from './navConfig'
import SidebarSection from './SidebarSection'
import { getRoleMeta } from '../../utils/roleMeta'

export default function Sidebar({ open, onNavigate }) {
  const { user } = useAuth()
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(user?.role)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onNavigate} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-6 overflow-y-auto bg-brand-navy px-3 py-5 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-3 pb-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent/15">
            <ShieldCheck size={22} className="text-brand-accent" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Đối chiếu BHYT</p>
            <p className="truncate text-xs text-slate-400">Gửi cổng giám định</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          {visibleSections.map((section) => (
            <SidebarSection key={section.title} title={section.title} items={section.items} onNavigate={onNavigate} />
          ))}
        </div>

        {user && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent text-sm font-semibold text-white">
              {user.username?.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.username}</p>
              <p className="truncate text-xs text-slate-400">{getRoleMeta(user.role).label}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
