import { Search, Upload, History, Plus, Download } from 'lucide-react'

export default function CatalogToolbar({ q, onQChange, searchPlaceholder, onOpenImport, onOpenHistory, onOpenCreate, onDownloadTemplate }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
      <div className="relative w-full max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-accent focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onDownloadTemplate}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download size={16} />
          Tải file mẫu
        </button>
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <History size={16} />
          Lịch sử nhập
        </button>
        <button
          onClick={onOpenImport}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Upload size={16} />
          Nhập file
        </button>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 rounded-md bg-brand-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} />
          Thêm mới
        </button>
      </div>
    </div>
  )
}
