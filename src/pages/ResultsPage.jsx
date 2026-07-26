import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClipboardCheck, RefreshCw, FileSpreadsheet, LayoutDashboard } from 'lucide-react'
import { useAnalysisResults } from '../hooks/useAnalysisResults'
import ResultsTable from '../components/results/ResultsTable'
import ResultsFilterBar from '../components/results/ResultsFilterBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import PageHeader from '../components/common/PageHeader'
import { useToast } from '../context/useToast'
import * as analyzeApi from '../api/analyzeApi'
import { normalizeText } from '../utils/normalizeText'

const emptyFilters = { ketLuan: '', maKhoa: '', maLoi: '', q: '' }

export default function ResultsPage() {
  const toast = useToast()
  const { batchId } = useParams()
  const { allResults, loading, error, options, refresh } = useAnalysisResults(batchId)
  const [filters, setFilters] = useState(emptyFilters)
  const [exporting, setExporting] = useState(false)
  const [reanalyzing, setReanalyzing] = useState(false)
  const [reanalyzeError, setReanalyzeError] = useState('')

  const filteredResults = useMemo(() => {
    const q = normalizeText(filters.q)
    return allResults.filter((r) => {
      if (filters.ketLuan && r.ketLuan !== filters.ketLuan) return false
      if (filters.maKhoa && r.errorRow?.maKhoa !== filters.maKhoa) return false
      if (filters.maLoi && !(r.duDoanMaLoi || []).some((w) => w.maLoi === filters.maLoi)) return false
      if (q) {
        const maBN = normalizeText(r.errorRow?.maBN)
        const hoTen = normalizeText(r.errorRow?.hoTen)
        if (!maBN.includes(q) && !hoTen.includes(q)) return false
      }
      return true
    })
  }, [allResults, filters])

  async function handleExport() {
    setExporting(true)
    try {
      await analyzeApi.exportExcel(batchId)
      toast.success('Đã xuất file Excel')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xuất Excel thất bại')
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
      toast.success('Đã chạy lại đối chiếu')
    } catch (err) {
      setReanalyzeError(err.response?.data?.message || 'Chạy lại đối chiếu thất bại')
    } finally {
      setReanalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader icon={ClipboardCheck} title="Kết quả đối chiếu">
        <Link
          to={`/batches/${batchId}/dashboard`}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <LayoutDashboard size={16} />
          Xem dashboard
        </Link>
        <button
          onClick={handleReanalyze}
          disabled={reanalyzing}
          title="Chạy lại đối chiếu sau khi cập nhật danh mục (thuốc, dịch vụ, mã lỗi, bác sĩ)"
          className="flex items-center gap-1.5 rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-60 dark:hover:bg-indigo-500/10"
        >
          <RefreshCw size={16} className={reanalyzing ? 'animate-spin' : ''} />
          {reanalyzing ? 'Đang chạy lại...' : 'Chạy lại đối chiếu'}
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          <FileSpreadsheet size={16} />
          {exporting ? 'Đang xuất...' : 'Xuất Excel'}
        </button>
      </PageHeader>

      <ErrorBanner message={error || reanalyzeError} />

      {loading ? (
        <LoadingSpinner label="Đang tải kết quả đối chiếu..." />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ResultsFilterBar filters={filters} onChange={setFilters} options={options} />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filteredResults.length}/{allResults.length} dòng
            </span>
          </div>
          <ResultsTable rows={filteredResults} />
        </>
      )}
    </div>
  )
}
