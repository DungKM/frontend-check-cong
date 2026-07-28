import { Link } from 'react-router-dom'
import { Plus, ClipboardList } from 'lucide-react'
import { useBatches } from '../hooks/useBatches'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import Pagination from '../components/common/Pagination'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { formatDate } from '../utils/formatDate'
import { getBatchStatusMeta } from '../utils/batchStatusMeta'

export default function BatchListPage() {
  const { batches, total, page, pageSize, setPage, loading, error } = useBatches()

  return (
    <div className="space-y-4">
      <PageHeader icon={ClipboardList} title="Lịch sử đối chiếu" subtitle="Toàn bộ các đợt đối chiếu đã tạo, mới nhất trước.">
        <Link
          to="/upload"
          className="flex items-center gap-1.5 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          Tạo đối chiếu mới
        </Link>
      </PageHeader>

      <ErrorBanner message={error} />
      {loading && <LoadingSpinner label="Đang tải danh sách đợt đối chiếu..." />}

      {!loading && !error && batches.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            icon={ClipboardList}
            title="Chưa có đợt đối chiếu nào"
            hint='Bấm "Tạo đối chiếu mới" để bắt đầu.'
            className="py-14"
          />
        </div>
      )}

      {!loading && batches.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2">Số dòng chi phí</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {batches.map((batch) => {
                  const meta = getBatchStatusMeta(batch.status)
                  const Icon = meta.icon
                  return (
                    <tr key={batch.batchId} className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                      <td className="px-4 py-2">{formatDate(batch.createdAt)}</td>
                      <td className="px-4 py-2">{(batch.rowCounts?.claimRows ?? 0).toLocaleString('vi-VN')}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium ${meta.badgeClass}`}>
                          <Icon size={12} className={batch.status === 'analyzing' ? 'animate-spin' : ''} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {batch.status === 'analyzed' ? (
                          <div className="flex justify-end gap-3">
                            <Link to={`/batches/${batch.batchId}/files`} className="text-brand-accent hover:underline">
                              Xem kết quả
                            </Link>
                            <Link to={`/batches/${batch.batchId}/dashboard`} className="text-brand-accent hover:underline">
                              Dashboard
                            </Link>
                          </div>
                        ) : (
                          <Link to="/upload" className="text-brand-accent hover:underline">
                            Tiếp tục
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
