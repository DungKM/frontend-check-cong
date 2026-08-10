import { useEffect, useState } from 'react'
import { ClipboardList, CheckCircle2, Clock, XCircle, LayoutDashboard, History, PiggyBank, Database } from 'lucide-react'
import * as statsApi from '../api/statsApi'
import StatCard from '../components/dashboard/StatCard'
import CatalogCountsChart from '../components/dashboard/CatalogCountsChart'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import { useAuth } from '../auth/useAuth'
import { formatDateTime } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'
import { getBatchStatusMeta } from '../utils/batchStatusMeta'

// Chỉ admin mới vào được các trang danh mục này (xem navConfig.jsx/App.jsx
// RequireRole), nên bảng tổng hợp số dòng cũng chỉ hiện cho admin trên Tổng quan.
const CATALOG_LINKS = [
  { type: 'drug', label: 'Danh mục thuốc', to: '/danh-muc/thuoc' },
  { type: 'service', label: 'Danh mục dịch vụ kỹ thuật', to: '/danh-muc/dich-vu' },
  { type: 'errorCode', label: 'Danh mục mã lỗi', to: '/danh-muc/ma-loi' },
  { type: 'doctor', label: 'Danh mục bác sĩ', to: '/danh-muc/bac-si' },
  { type: 'serviceGroup', label: 'Danh mục mã nhóm DVKT', to: '/danh-muc/ma-nhom' },
  { type: 'vatTu', label: 'Danh mục vật tư y tế', to: '/danh-muc/vat-tu' },
  { type: 'benefitRate', label: 'Danh mục mức hưởng theo đối tượng', to: '/danh-muc/muc-huong' },
]

function CatalogCountsCard({ counts }) {
  const items = CATALOG_LINKS.map(({ type, label, to }) => ({ type, label, to, value: counts?.[type] ?? 0 }))
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent-soft text-brand-accent dark:bg-indigo-500/10">
            <Database size={14} />
          </span>
          Danh mục dữ liệu
        </h3>
      </div>
      <CatalogCountsChart items={items} />
    </div>
  )
}

function RecentBatchesCard({ batches }) {
  return (
    <div className="card p-4">
      <div className="mb-1 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent-soft text-brand-accent dark:bg-indigo-500/10">
            <History size={14} />
          </span>
          Đợt đối chiếu gần đây
        </h3>
      </div>
      {batches.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Chưa có đợt đối chiếu nào" hint="Tạo đợt đối chiếu mới để bắt đầu theo dõi." className="py-8" />
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {batches.map((b) => {
            const meta = getBatchStatusMeta(b.status)
            const Icon = meta.icon
            const hasSummary = Number(b.analysisSummary?.totalRows || 0) > 0
            const rowCount = hasSummary ? b.analysisSummary.totalRows : b.rowCounts?.claimRows ?? 0
            const timeLabel = b.analyzedAt
              ? `Đối chiếu lúc ${formatDateTime(b.analyzedAt)}`
              : `Tạo lúc ${formatDateTime(b.createdAt)}`
            return (
              <li
                key={b.batchId}
                className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-700 dark:text-slate-200">{timeLabel}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{rowCount.toLocaleString('vi-VN')} dòng chi phí</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {hasSummary && (
                    <span className="hidden items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:inline-flex">
                      {formatCurrency(b.analysisSummary.savedAmount)}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${meta.badgeClass}`}>
                    <Icon size={12} />
                    {meta.label}
                  </span>
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
  const { user } = useAuth()
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

  const hasSavingsData = summary.soDotCoDuLieuChiPhi > 0

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Tổng quan"
        subtitle="Theo dõi tiến độ và hiệu quả của các đợt đối chiếu."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng số đợt đối chiếu"
          value={summary.totalBatches.toLocaleString('vi-VN')}
          icon={ClipboardList}
          iconColor="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
        />
        <StatCard
          label="Đã đối chiếu xong"
          value={summary.daDoiChieu.toLocaleString('vi-VN')}
          accent="text-emerald-600 dark:text-emerald-400"
          icon={CheckCircle2}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
        />
        <StatCard
          label="Đang chờ / đang xử lý"
          value={summary.dangXuLy.toLocaleString('vi-VN')}
          accent="text-blue-600 dark:text-blue-400"
          icon={Clock}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
        />
        <StatCard
          label="Đối chiếu thất bại"
          value={summary.thatBai.toLocaleString('vi-VN')}
          accent="text-red-600 dark:text-red-400"
          icon={XCircle}
          iconColor="bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
        />
      </div>

      {hasSavingsData && (
        <div className="card flex flex-wrap items-center gap-4 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <PiggyBank size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">Chi phí tiết kiệm được nhờ đối chiếu</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.tongTienTietKiem)}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Tính trên {summary.soDotCoDuLieuChiPhi.toLocaleString('vi-VN')}/{summary.daDoiChieu.toLocaleString('vi-VN')} đợt đã có dữ liệu chi tiết
              {summary.soDotThieuDuLieuChiPhi > 0
                ? ` — ${summary.soDotThieuDuLieuChiPhi.toLocaleString('vi-VN')} đợt cũ còn thiếu sẽ tự bổ sung khi chạy lại đối chiếu.`
                : '.'}
            </p>
          </div>
        </div>
      )}

      <RecentBatchesCard batches={summary.recentBatches} />
      {user?.role === 'admin' && <CatalogCountsCard counts={summary.catalogCounts} />}
    </div>
  )
}
