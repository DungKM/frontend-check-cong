import { NavLink } from 'react-router-dom'

export default function SidebarNavItem({ to, label, icon: Icon, end, color = 'text-slate-400', onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-brand-accent transition-all ${
              isActive ? 'w-[3px] opacity-100' : 'w-0 opacity-0'
            }`}
          />
          <Icon size={18} className={`shrink-0 transition-opacity ${color} ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
