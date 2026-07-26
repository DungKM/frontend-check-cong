export default function StatCard({ label, value, accent = 'text-slate-800 dark:text-slate-100', icon: Icon, iconColor = 'bg-slate-100 text-slate-600', badge }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconColor}`}>
            <Icon size={18} />
          </span>
        )}
        {badge && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{badge}</span>
        )}
      </div>
      <p className={`mt-3 text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
