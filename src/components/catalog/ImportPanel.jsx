import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import FileDropInput from '../upload/FileDropInput'
import ErrorBanner from '../common/ErrorBanner'
import * as catalogApi from '../../api/catalogApi'

const POLL_INTERVAL_MS = 1500

const STATUS_LABEL = {
  processing: 'Đang xử lý...',
  success: 'Hoàn tất',
  partial: 'Hoàn tất (có cảnh báo)',
  failed: 'Thất bại',
}

export default function ImportPanel({ type, acceptFileTypes, onClose, onImported }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')
  const pollTimer = useRef(null)
  const importedRef = useRef(false)

  useEffect(() => {
    return () => clearTimeout(pollTimer.current)
  }, [])

  function pollStatus(importId) {
    pollTimer.current = setTimeout(async () => {
      try {
        const data = await catalogApi.getImportStatus(type, importId)
        setProgress(data)
        if (data.status === 'processing') {
          pollStatus(importId)
        } else {
          setUploading(false)
          if (data.status !== 'failed' && !importedRef.current) {
            importedRef.current = true
            onImported?.()
          }
        }
      } catch (err) {
        setUploading(false)
        setError(err.response?.data?.message || 'Không lấy được tiến độ nhập dữ liệu')
      }
    }, POLL_INTERVAL_MS)
  }

  async function handleImport() {
    if (files.length === 0) return
    setUploading(true)
    setError('')
    setProgress(null)
    importedRef.current = false
    try {
      const data = await catalogApi.importCatalog(type, files[0])
      setProgress(data)
      pollStatus(data.importId)
    } catch (err) {
      setUploading(false)
      setError(err.response?.data?.message || 'Nhập dữ liệu thất bại')
    }
  }

  const isDone = progress && progress.status !== 'processing'

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
          Dữ liệu cũ không bị xóa — chỉ thêm dòng mới và cập nhật những dòng đã có (cùng mã, cùng từ ngày). File
          lớn được xử lý nền theo lô — bạn có thể đóng cửa sổ này, việc nhập vẫn tiếp tục, xem lại ở "Lịch sử nhập".
        </p>

        <ErrorBanner message={error} />

        {progress && (
          <div
            className={`mt-3 rounded-md px-3 py-2 text-sm ${
              progress.status === 'failed' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            <div className="font-medium">{STATUS_LABEL[progress.status] || progress.status}</div>
            {!isDone && !progress.rowsParsed && <div>Đang đọc file...</div>}
            {progress.rowsParsed > 0 && (
              <>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((progress.rowsInserted || 0) + (progress.rowsUpdated || 0)) / progress.rowsParsed * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div>
                  {isDone
                    ? `${progress.rowsParsed} dòng`
                    : `${Math.min(
                        100,
                        Math.round(((progress.rowsInserted || 0) + (progress.rowsUpdated || 0)) / progress.rowsParsed * 100)
                      )}% — ${progress.rowsParsed} dòng`}{' '}
                  — thêm mới {progress.rowsInserted || 0}, cập nhật {progress.rowsUpdated || 0}
                  {!isDone && '...'}
                </div>
              </>
            )}
            {progress.warnings?.length > 0 && (
              <details className="mt-1 text-amber-700">
                <summary className="cursor-pointer">{progress.warnings.length} cảnh báo</summary>
                <ul className="ml-4 list-disc">
                  {progress.warnings.slice(0, 20).map((w, idx) => (
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
