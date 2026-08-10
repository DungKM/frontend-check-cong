export default function EmptyState({ icon: Icon, title, hint, className = 'py-10' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}>
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400 dark:from-slate-800 dark:to-slate-800/50 dark:text-slate-500">
          <Icon size={22} />
        </span>
      )}
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      {hint && <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  )
}
