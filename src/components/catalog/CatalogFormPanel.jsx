import { useState } from 'react'
import { X } from 'lucide-react'
import ErrorBanner from '../common/ErrorBanner'
import * as catalogApi from '../../api/catalogApi'

function toDateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function buildInitialValues(fields, item) {
  const values = {}
  for (const field of fields) {
    const raw = item?.[field.key]
    values[field.key] = field.type === 'date' ? toDateInputValue(raw) : (raw ?? '')
  }
  return values
}

export default function CatalogFormPanel({ type, fields, item, onClose, onSaved }) {
  const [values, setValues] = useState(() => buildInitialValues(fields, item))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(item)

  function update(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await catalogApi.updateCatalogItem(type, item._id, values)
      } else {
        await catalogApi.createCatalogItem(type, values)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu dữ liệu thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">{isEdit ? 'Sửa dòng danh mục' : 'Thêm dòng danh mục'}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={values[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  required={field.required}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                >
                  <option value="">-- Chọn --</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={values[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={values[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  required={field.required}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <ErrorBanner message={error} />

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  )
}
