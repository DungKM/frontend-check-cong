import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { navSections } from '../layout/navConfig'
import { useAuth } from '../../auth/useAuth'
import { normalizeText } from '../../utils/normalizeText'

export default function CommandPalette({ onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const items = useMemo(
    () =>
      navSections.flatMap((section) =>
        section.items
          .filter((item) => !item.roles || item.roles.includes(user?.role))
          .map((item) => ({ ...item, section: section.title }))
      ),
    [user]
  )

  const filtered = useMemo(() => {
    const q = normalizeText(query)
    if (!q) return items
    return items.filter((item) => normalizeText(item.label).includes(q))
  }, [items, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function go(item) {
    if (!item) return
    navigate(item.to)
    onClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm trang, danh mục..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          <kbd className="hidden shrink-0 rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-400 sm:block dark:border-slate-600">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-slate-400">Không tìm thấy kết quả phù hợp.</p>
          )}
          {filtered.map((item, idx) => {
            const Icon = item.icon
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  idx === activeIndex
                    ? 'bg-indigo-50 text-brand-accent dark:bg-indigo-500/10'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                <span className="shrink-0 text-xs text-slate-400">{item.section}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
