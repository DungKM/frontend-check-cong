import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Layers, AlertTriangle, Wallet } from 'lucide-react'
import * as statsApi from '../api/statsApi'
import StatCard from '../components/dashboard/StatCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'
import { getBatchStatusMeta } from '../utils/batchStatusMeta'

function RecentBatchesCard({ batches }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Đợt đối chiếu gần đây</h3>
        <Link to="/dot-doi-chieu" className="text-xs font-medium text-brand-accent hover:underline">
          Xem tất cả
        </Link>
      </div>
      {batches.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Chưa có đợt đối chiếu nào.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {batches.map((b) => {
            const meta = getBatchStatusMeta(b.status)
            const Icon = meta.icon
            return (
              <li key={b.batchId} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-700">{formatDate(b.createdAt)}</p>
                  <p className="text-xs text-slate-500">{b.rowCounts?.claimRows ?? 0} dòng chi phí</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${meta.badgeClass}`}>
                    <Icon size={12} />
                    {meta.label}
                  </span>
                  {b.status === 'analyzed' && (
                    <Link to={`/batches/${b.batchId}/dashboard`} className="text-brand-accent hover:underline">
                      Dashboard
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function OverviewPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    statsApi
      .getOverview()
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Không tải được thống kê tổng quan')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <LoadingSpinner label="Đang tải thống kê tổng quan..." />
  if (error) return <ErrorBanner message={error} />
  if (!summary) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Tổng quan</h1>
        <p className="text-sm text-slate-500">Thống kê nhanh xuyên suốt tất cả các đợt đối chiếu.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng số đợt đối chiếu"
          value={summary.totalBatches.toLocaleString('vi-VN')}
          icon={ClipboardList}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          label="Tổng số dòng đã phân tích"
          value={summary.tongSoDong.toLocaleString('vi-VN')}
          icon={Layers}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Số dòng có cảnh báo"
          value={summary.soDongCanhBao.toLocaleString('vi-VN')}
          accent="text-red-600"
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600"
        />
        <StatCard
          label="Tổng tiền cảnh báo"
          value={formatCurrency(summary.tongTienCanhBao)}
          accent="text-amber-600"
          icon={Wallet}
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      <RecentBatchesCard batches={summary.recentBatches} />
    </div>
  )
}
