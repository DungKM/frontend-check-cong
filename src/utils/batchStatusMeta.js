import { CheckCircle2, Loader2, Clock, XCircle } from 'lucide-react'

export const BATCH_STATUS_META = {
  uploaded: {
    label: 'Đã tải file, chưa đối chiếu',
    badgeClass: 'bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    icon: Clock,
  },
  analyzing: {
    label: 'Đang đối chiếu...',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    icon: Loader2,
  },
  analyzed: {
    label: 'Đã đối chiếu',
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Đối chiếu thất bại',
    badgeClass: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    icon: XCircle,
  },
}

export function getBatchStatusMeta(status) {
  return (
    BATCH_STATUS_META[status] || {
      label: status || '(không rõ)',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: Clock,
    }
  )
}
