import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileDropInput({ label, multiple = false, files, onChange, disabled, accept = '.xlsx,.xls', hint }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(fileList) {
    const list = Array.from(fileList || [])
    if (list.length === 0) return
    onChange(multiple ? list : [list[0]])
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!disabled) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-500'
            : isDragging
              ? 'border-brand-accent bg-brand-accent-soft text-brand-accent scale-[1.01] dark:bg-indigo-500/10 dark:text-indigo-300'
              : 'border-slate-300 text-slate-500 hover:border-brand-accent/60 hover:bg-slate-50/50 hover:text-brand-accent dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {files && files.length > 0 ? (
          <ul className="space-y-1 text-left">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="truncate">{file.name}</span>
                <span className="ml-2 shrink-0 text-slate-400 dark:text-slate-500">{formatSize(file.size)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={28} className="opacity-70" />
            <span>
              {hint || `Kéo thả file vào đây, hoặc bấm để chọn file${multiple ? ' (có thể chọn nhiều file)' : ''}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
