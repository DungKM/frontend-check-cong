import { useState } from 'react'
import { X } from 'lucide-react'
import FileDropInput from '../upload/FileDropInput'
import ErrorBanner from '../common/ErrorBanner'
import * as catalogApi from '../../api/catalogApi'

export default function ImportPanel({ type, acceptFileTypes, onClose, onImported }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleImport() {
    if (files.length === 0) return
    setUploading(true)
    setError('')
    setResult(null)
    try {
      const data = await catalogApi.importCatalog(type, files[0])
      setResult(data)
      onImported?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Nhập dữ liệu thất bại')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Nhập dữ liệu danh mục</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <FileDropInput
          label="File Excel/CSV"
          files={files}
          disabled={uploading}
          accept={acceptFileTypes}
          hint="Kéo thả file Excel/CSV vào đây, hoặc bấm để chọn file"
          onChange={setFiles}
        />
        <p className="mt-2 text-xs text-slate-400">
          Dữ liệu cũ không bị xóa — chỉ thêm dòng mới và cập nhật những dòng đã có (cùng mã, cùng từ ngày).
        </p>

        <ErrorBanner message={error} />

        {result && (
          <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Đã đọc {result.rowsParsed} dòng — thêm mới {result.rowsInserted}, cập nhật {result.rowsUpdated}.
            {result.warnings?.length > 0 && (
              <details className="mt-1 text-amber-700">
                <summary className="cursor-pointer">{result.warnings.length} cảnh báo</summary>
                <ul className="ml-4 list-disc">
                  {result.warnings.slice(0, 20).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Đóng
          </button>
          <button
            onClick={handleImport}
            disabled={files.length === 0 || uploading}
            className="rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Đang nhập...' : 'Nhập dữ liệu'}
          </button>
        </div>
      </div>
    </div>
  )
}
