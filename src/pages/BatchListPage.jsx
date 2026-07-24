import { Link } from 'react-router-dom'
import { useBatches } from '../hooks/useBatches'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import { formatDate } from '../utils/formatDate'

const STATUS_LABEL = {
  uploaded: 'Đã tải file, chưa đối chiếu',
  analyzing: 'Đang đối chiếu...',
  analyzed: 'Đã đối chiếu',
  failed: 'Đối chiếu thất bại',
}

export default function BatchListPage() {
  const { batches, loading, error } = useBatches()

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Lịch sử đối chiếu</h1>
        <Link
          to="/upload"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Tạo đối chiếu mới
        </Link>
      </div>

      <ErrorBanner message={error} />
      {loading && <LoadingSpinner label="Đang tải danh sách đợt đối chiếu..." />}

      {!loading && !error && batches.length === 0 && (
        <p className="rounded-md border border-slate-200 bg-white p-6 text-center text-slate-500">
          Chưa có đợt đối chiếu nào. Bấm "Tạo đối chiếu mới" để bắt đầu.
        </p>
      )}

      {!loading && batches.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Số dòng chi phí</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.batchId} className="border-t border-slate-100">
                  <td className="px-4 py-2">{formatDate(batch.createdAt)}</td>
                  <td className="px-4 py-2">{batch.rowCounts?.claimRows ?? 0}</td>
                  <td className="px-4 py-2">{STATUS_LABEL[batch.status] || batch.status}</td>
                  <td className="px-4 py-2 text-right">
                    {batch.status === 'analyzed' ? (
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/batches/${batch.batchId}/results`}
                          className="text-indigo-600 hover:underline"
                        >
                          Xem kết quả
                        </Link>
                        <Link
                          to={`/batches/${batch.batchId}/dashboard`}
                          className="text-indigo-600 hover:underline"
                        >
                          Dashboard
                        </Link>
                      </div>
                    ) : (
                      <Link to="/upload" className="text-indigo-600 hover:underline">
                        Tiếp tục
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
