import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Layers, AlertTriangle, Wallet } from 'lucide-react'
import * as statsApi from '../api/statsApi'
import StatCard from '../components/dashboard/StatCard'
import DeductionByMonthChart from '../components/dashboard/DeductionByMonthChart'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'
import { getConclusionMeta } from '../utils/conclusionMeta'
import { getBatchStatusMeta } from '../utils/batchStatusMeta'

function TopErrorsCard({ items }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Top mã lỗi thường gặp</h3>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Chưa có dữ liệu.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.maLoi}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-slate-700">
                  {item.maLoi} <span className="font-normal text-slate-500">· {item.tenLoi}</span>
                </span>
                <span className="shrink-0 text-slate-500">{item.count.toLocaleString('vi-VN')}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-brand-accent transition-all"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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

  const tongTienCanhBao = summary.theoThang.reduce((sum, m) => sum + (m.tongTienCanhBao || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Tổng quan</h1>
        <p className="text-sm text-slate-500">Thống kê xuyên suốt tất cả các đợt đối chiếu.</p>
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
          value={formatCurrency(tongTienCanhBao)}
          accent="text-amber-600"
          icon={Wallet}
          iconColor="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Phân bố theo kết luận đối chiếu</h3>
        <div className="flex flex-wrap gap-3">
          {summary.theoKetLuan.map((item) => {
            const meta = getConclusionMeta(item.ketLuan)
            return (
              <span key={item.ketLuan} className={`rounded px-3 py-1.5 text-sm ${meta.badgeClass}`}>
                {meta.label}: {item.count.toLocaleString('vi-VN')}
              </span>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DeductionByMonthChart data={summary.theoThang} />
        <TopErrorsCard items={summary.topMaLoi} />
      </div>

      <RecentBatchesCard batches={summary.recentBatches} />
    </div>
  )
}
