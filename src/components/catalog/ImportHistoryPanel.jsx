import { X } from 'lucide-react'
import { useImportHistory } from '../../hooks/useImportHistory'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBanner from '../common/ErrorBanner'
import { formatDate } from '../../utils/formatDate'

const STATUS_LABEL = {
  processing: 'Đang xử lý',
  success: 'Hoàn tất',
  partial: 'Hoàn tất (có cảnh báo)',
  failed: 'Thất bại',
}

const STATUS_CLASS = {
  processing: 'text-amber-600',
  success: 'text-emerald-600',
  partial: 'text-amber-600',
  failed: 'text-red-600',
}

export default function ImportHistoryPanel({ type, onClose }) {
  const { imports, loading, error } = useImportHistory(type)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Lịch sử nhập dữ liệu</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {loading && <LoadingSpinner label="Đang tải lịch sử..." />}
        <ErrorBanner message={error} />

        {!loading && !error && imports.length === 0 && (
          <p className="rounded-md border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            Chưa có lần nhập nào.
          </p>
        )}

        {!loading && imports.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-3 py-2">Thời gian</th>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2">Người nhập</th>
                <th className="px-3 py-2">Thêm mới</th>
                <th className="px-3 py-2">Cập nhật</th>
                <th className="px-3 py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-3 py-2">{item.fileName}</td>
                  <td className="px-3 py-2">{item.importedBy?.username || '-'}</td>
                  <td className="px-3 py-2">{item.rowsInserted}</td>
                  <td className="px-3 py-2">{item.rowsUpdated}</td>
                  <td className={`px-3 py-2 font-medium ${STATUS_CLASS[item.status] || ''}`}>
                    {STATUS_LABEL[item.status] || item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
