import { useContext } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { ToastContext } from '../../context/ToastContext'

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }

const STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  info: 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
}

export default function ToastContainer() {
  const ctx = useContext(ToastContext)
  if (!ctx || ctx.toasts.length === 0) return null
  const { toasts, dismiss } = ctx

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info
        return (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-lg transition ${STYLES[t.type] || STYLES.info}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Đóng thông báo">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
