import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAnalysisResults } from '../hooks/useAnalysisResults'
import ResultsTable from '../components/results/ResultsTable'
import ResultsFilterBar from '../components/results/ResultsFilterBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import * as analyzeApi from '../api/analyzeApi'

const emptyFilters = { ketLuan: '', maKhoa: '', maLoi: '' }

export default function ResultsPage() {
  const { batchId } = useParams()
  const { allResults, loading, error, options, refresh } = useAnalysisResults(batchId)
  const [filters, setFilters] = useState(emptyFilters)
  const [exporting, setExporting] = useState(false)
  const [reanalyzing, setReanalyzing] = useState(false)
  const [reanalyzeError, setReanalyzeError] = useState('')

  const filteredResults = useMemo(() => {
    return allResults.filter((r) => {
      if (filters.ketLuan && r.ketLuan !== filters.ketLuan) return false
      if (filters.maKhoa && r.errorRow?.maKhoa !== filters.maKhoa) return false
      if (filters.maLoi && !(r.duDoanMaLoi || []).some((w) => w.maLoi === filters.maLoi)) return false
      return true
    })
  }, [allResults, filters])

  async function handleExport() {
    setExporting(true)
    try {
      await analyzeApi.exportExcel(batchId)
    } finally {
      setExporting(false)
    }
  }

  async function handleReanalyze() {
    setReanalyzing(true)
    setReanalyzeError('')
    try {
      await analyzeApi.runAnalyze(batchId)
      await refresh()
    } catch (err) {
      setReanalyzeError(err.response?.data?.message || 'Chạy lại đối chiếu thất bại')
    } finally {
      setReanalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Kết quả đối chiếu</h1>
          <Link to={`/batches/${batchId}/dashboard`} className="text-sm text-indigo-600 hover:underline">
            Xem dashboard thống kê
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            title="Chạy lại đối chiếu sau khi cập nhật danh mục (thuốc, dịch vụ, mã lỗi, bác sĩ)"
            className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-60"
          >
            {reanalyzing ? 'Đang chạy lại...' : 'Chạy lại đối chiếu'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </button>
        </div>
      </div>

      <ErrorBanner message={error || reanalyzeError} />

      {loading ? (
        <LoadingSpinner label="Đang tải kết quả đối chiếu..." />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ResultsFilterBar filters={filters} onChange={setFilters} options={options} />
            <span className="text-sm text-slate-500">
              {filteredResults.length}/{allResults.length} dòng
            </span>
          </div>
          <ResultsTable rows={filteredResults} />
        </>
      )}
    </div>
  )
}
