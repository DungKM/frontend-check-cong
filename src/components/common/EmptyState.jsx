export default function EmptyState({ icon: Icon, title, hint, className = 'py-10' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 text-center ${className}`}>
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Icon size={20} />
        </span>
      )}
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      {hint && <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  )
}
