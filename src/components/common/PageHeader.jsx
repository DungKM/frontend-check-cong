export default function PageHeader({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-start gap-3.5">
        {Icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent-soft to-indigo-100 text-brand-accent shadow-sm dark:from-indigo-500/15 dark:to-indigo-500/5">
            <Icon size={21} />
          </span>
        )}
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
