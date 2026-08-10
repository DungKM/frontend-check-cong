import SidebarNavItem from './SidebarNavItem'

export default function SidebarSection({ title, items, onNavigate }) {
  return (
    <div className="space-y-1.5">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <SidebarNavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  )
}
