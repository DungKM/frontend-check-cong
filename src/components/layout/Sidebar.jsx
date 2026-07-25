import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { navSections } from './navConfig'
import SidebarSection from './SidebarSection'

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
        <div className="flex items-center gap-2 px-3">
          <ShieldCheck size={24} className="shrink-0 text-brand-accent" />
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
      </aside>
    </>
  )
}
