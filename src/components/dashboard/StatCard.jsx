export default function StatCard({ label, value, accent = 'text-slate-800', icon: Icon, iconColor = 'bg-slate-100 text-slate-600', badge }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconColor}`}>
            <Icon size={18} />
          </span>
        )}
        {badge && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{badge}</span>
        )}
      </div>
      <p className={`mt-3 text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}
