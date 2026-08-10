import { AlertCircle } from 'lucide-react'

export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300">
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500 dark:text-red-400" />
      <span>{message}</span>
    </div>
  )
}
