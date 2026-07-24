import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as analyzeApi from '../api/analyzeApi'
import StatCard from '../components/dashboard/StatCard'
import DeductionByKhoaChart from '../components/dashboard/DeductionByKhoaChart'
import DeductionByMonthChart from '../components/dashboard/DeductionByMonthChart'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
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
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Dashboard thống kê</h1>
        <Link to={`/batches/${batchId}/results`} className="text-sm text-indigo-600 hover:underline">
          Xem bảng kết quả chi tiết
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tổng số dòng chi phí" value={summary.tongSoDong.toLocaleString('vi-VN')} />
        <StatCard
          label="Số dòng có cảnh báo"
          value={summary.soDongCanhBao.toLocaleString('vi-VN')}
          accent="text-red-600"
        />
        <StatCard
          label="Số nhóm kết luận"
          value={summary.theoKetLuan.length.toLocaleString('vi-VN')}
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Phân bố theo kết luận đối chiếu</h3>
        <div className="flex flex-wrap gap-3">
          {summary.theoKetLuan.map((item) => {
            const meta = getConclusionMeta(item.ketLuan)
            return (
              <span key={item.ketLuan} className={`rounded px-3 py-1.5 text-sm ${meta.badgeClass}`}>
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
