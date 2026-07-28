import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LayoutDashboard, Layers, AlertTriangle, ListChecks, ClipboardList } from 'lucide-react'
import * as analyzeApi from '../api/analyzeApi'
import StatCard from '../components/dashboard/StatCard'
import DeductionByKhoaChart from '../components/dashboard/DeductionByKhoaChart'
import DeductionByMonthChart from '../components/dashboard/DeductionByMonthChart'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import PageHeader from '../components/common/PageHeader'
import { getConclusionMeta } from '../utils/conclusionMeta'

export default function DashboardPage() {
  const { batchId } = useParams()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    analyzeApi
      .getSummary(batchId)
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Không tải được thống kê')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [batchId])

  if (loading) return <LoadingSpinner label="Đang tải thống kê..." />
  if (error) return <ErrorBanner message={error} />
  if (!summary) return null

  return (
    <div className="space-y-6">
      <PageHeader icon={LayoutDashboard} title="Dashboard thống kê">
        <Link
          to={`/batches/${batchId}/files`}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ClipboardList size={16} />
          Xem bảng kết quả chi tiết
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng số dòng chi phí"
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
          label="Số nhóm kết luận"
          value={summary.theoKetLuan.length.toLocaleString('vi-VN')}
          icon={ListChecks}
          iconColor="bg-indigo-100 text-indigo-600"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Phân bố theo kết luận đối chiếu</h3>
        <div className="flex flex-wrap gap-3">
          {summary.theoKetLuan.map((item) => {
            const meta = getConclusionMeta(item.ketLuan)
            return (
              <span key={item.ketLuan} className={`rounded-full px-3 py-1.5 text-sm font-medium ${meta.badgeClass}`}>
                {meta.label}: {item.count}
              </span>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DeductionByKhoaChart data={summary.theoKhoa} />
        <DeductionByMonthChart data={summary.theoThang} />
      </div>
    </div>
  )
}
