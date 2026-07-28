import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import GenericXmlTable from '../components/results/GenericXmlTable'
import ResultsTable from '../components/results/ResultsTable'
import * as batchApi from '../api/batchApi'
import { XML_TYPE_LABELS } from '../config/xmlColumnOrder'
import { normalizeText } from '../utils/normalizeText'
import { SEVERITY_LEVELS, getSeverityBucket } from '../utils/severityMeta'

// Single-record XML types (one hồ sơ = one record) whose date fields double as the
// "Timeline" tab's milestone events — computed client-side from data already fetched
// for those tabs, no dedicated backend endpoint needed.
const TIMELINE_FIELDS = {
  XML1: [
    ['NGAY_VAO', 'Ngày vào (XML1)'],
    ['NGAY_VAO_NOI_TRU', 'Ngày vào nội trú (XML1)'],
    ['NGAY_RA', 'Ngày ra (XML1)'],
  ],
  XML7: [
    ['NGAY_VAO', 'Ngày vào (XML7 - Giấy ra viện)'],
    ['NGAY_CT', 'Ngày chứng từ (XML7)'],
    ['NGAY_RA', 'Ngày ra (XML7 - Giấy ra viện)'],
  ],
  XML8: [
    ['NGAY_VAO', 'Ngày vào (XML8 - Tóm tắt HSBA)'],
    ['NGAY_CT', 'Ngày chứng từ (XML8)'],
    ['NGAY_RA', 'Ngày ra (XML8 - Tóm tắt HSBA)'],
  ],
  XML13: [
    ['NGAY_VAO', 'Ngày vào (XML13 - Giấy chuyển tuyến)'],
    ['NGAY_VAO_NOI_TRU', 'Ngày vào nội trú (XML13)'],
    ['NGAY_RA', 'Ngày ra (XML13 - Giấy chuyển tuyến)'],
  ],
}

const emptyWarningSummary = { tongCanhBao: 0, cao: 0, trungBinh: 0, thap: 0, thongTin: 0 }

// BHYT dates are a fixed-width "YYYYMMDDHHmm" digit string — sorts correctly as plain
// text, just needs separators for display.
function formatBhytDate(value) {
  if (!value || value.length < 8) return value || ''
  const y = value.slice(0, 4)
  const mo = value.slice(4, 6)
  const d = value.slice(6, 8)
  const h = value.slice(8, 10) || '00'
  const mi = value.slice(10, 12) || '00'
  return `${d}/${mo}/${y} ${h}:${mi}`
}

function xmlTypeSort(a, b) {
  return Number(a.replace('XML', '')) - Number(b.replace('XML', ''))
}

export default function ClaimFileDetailPage() {
  const { batchId, fileName: encodedFileName } = useParams()
  const fileName = decodeURIComponent(encodedFileName)

  const [xmlTypes, setXmlTypes] = useState([])
  const [errorCount, setErrorCount] = useState(0)
  const [warningSummary, setWarningSummary] = useState(emptyWarningSummary)
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaError, setMetaError] = useState('')

  const [activeTab, setActiveTab] = useState(null)
  const [rowsByTab, setRowsByTab] = useState({})
  const [tabLoading, setTabLoading] = useState(false)
  const [tabError, setTabError] = useState('')
  const [errorFilters, setErrorFilters] = useState({ q: '', maLoi: '', mucDo: '' })

  useEffect(() => {
    let cancelled = false
    setMetaLoading(true)
    batchApi
      .getClaimFileXmlTypes(batchId, fileName)
      .then((data) => {
        if (cancelled) return
        setXmlTypes(data.xmlTypes)
        setErrorCount(data.errorCount)
        setWarningSummary(data.warningSummary || emptyWarningSummary)
        const sorted = [...data.xmlTypes].sort((a, b) => xmlTypeSort(a.xmlType, b.xmlType))
        setActiveTab(sorted[0]?.xmlType || 'ERRORS')
      })
      .catch((err) => {
        if (!cancelled) setMetaError(err.response?.data?.message || 'Không tải được danh sách loại XML')
      })
      .finally(() => {
        if (!cancelled) setMetaLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [batchId, fileName])

  const tabs = useMemo(() => {
    const xmlTabs = [...xmlTypes].sort((a, b) => xmlTypeSort(a.xmlType, b.xmlType)).map((t) => ({
      key: t.xmlType,
      label: t.xmlType,
      badge: t.count,
    }))
    return [
      ...xmlTabs,
      { key: 'ERRORS', label: 'Danh sách lỗi', badge: errorCount },
      { key: 'TIMELINE', label: 'Timeline' },
    ]
  }, [xmlTypes, errorCount])

  const timelineTypes = useMemo(
    () => Object.keys(TIMELINE_FIELDS).filter((t) => xmlTypes.some((x) => x.xmlType === t)),
    [xmlTypes]
  )

  // XML1 doubles as the header card's MA_LK/MA_BN/HO_TEN — fetch it as soon as we know
  // the file has one, regardless of which tab is active, and cache it in rowsByTab like
  // any other tab so clicking the XML1 tab later doesn't re-fetch.
  useEffect(() => {
    if (!xmlTypes.some((t) => t.xmlType === 'XML1') || rowsByTab.XML1) return
    batchApi
      .getClaimFileXmlRows(batchId, fileName, 'XML1')
      .then((rows) => setRowsByTab((prev) => ({ ...prev, XML1: rows })))
      .catch(() => {})
  }, [xmlTypes, batchId, fileName, rowsByTab.XML1])

  useEffect(() => {
    if (!activeTab) return
    if (activeTab === 'TIMELINE') {
      const missing = timelineTypes.filter((t) => !rowsByTab[t])
      if (missing.length === 0) return
      setTabLoading(true)
      setTabError('')
      Promise.all(missing.map((t) => batchApi.getClaimFileXmlRows(batchId, fileName, t).then((rows) => [t, rows])))
        .then((pairs) => {
          setRowsByTab((prev) => ({ ...prev, ...Object.fromEntries(pairs) }))
        })
        .catch((err) => setTabError(err.response?.data?.message || 'Không tải được dữ liệu Timeline'))
        .finally(() => setTabLoading(false))
      return
    }

    if (rowsByTab[activeTab]) return
    setTabLoading(true)
    setTabError('')
    batchApi
      .getClaimFileXmlRows(batchId, fileName, activeTab)
      .then((rows) => setRowsByTab((prev) => ({ ...prev, [activeTab]: rows })))
      .catch((err) => setTabError(err.response?.data?.message || 'Không tải được dữ liệu'))
      .finally(() => setTabLoading(false))
  }, [activeTab, batchId, fileName, rowsByTab, timelineTypes])

  const timelineEvents = useMemo(() => {
    if (activeTab !== 'TIMELINE') return []
    const events = []
    for (const type of timelineTypes) {
      const record = (rowsByTab[type] || [])[0]
      if (!record) continue
      for (const [field, label] of TIMELINE_FIELDS[type]) {
        if (record[field]) events.push({ label, value: record[field] })
      }
    }
    return events.sort((a, b) => a.value.localeCompare(b.value))
  }, [activeTab, rowsByTab, timelineTypes])

  const errorMaLoiOptions = useMemo(() => {
    const byMaLoi = new Map()
    for (const r of rowsByTab.ERRORS || []) {
      for (const w of r.duDoanMaLoi || []) {
        if (!byMaLoi.has(w.maLoi)) byMaLoi.set(w.maLoi, w.tenLoi)
      }
    }
    return [...byMaLoi.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([maLoi, tenLoi]) => ({ maLoi, tenLoi }))
  }, [rowsByTab.ERRORS])

  const filteredErrorRows = useMemo(() => {
    const q = normalizeText(errorFilters.q)
    return (rowsByTab.ERRORS || []).filter((r) => {
      if (errorFilters.maLoi && !(r.duDoanMaLoi || []).some((w) => w.maLoi === errorFilters.maLoi)) return false
      if (errorFilters.mucDo && getSeverityBucket(r.duDoanMaLoi) !== errorFilters.mucDo) return false
      if (q) {
        const maChiPhi = normalizeText(r.errorRow?.maChiPhi)
        const tenChiPhi = normalizeText(r.errorRow?.tenChiPhi)
        if (!maChiPhi.includes(q) && !tenChiPhi.includes(q)) return false
      }
      return true
    })
  }, [rowsByTab.ERRORS, errorFilters])

  const header = rowsByTab.XML1?.[0] || {}

  return (
    <div className="space-y-4">
      <Link
        to={`/batches/${batchId}/files`}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft size={16} />
        Quay lại danh sách file
      </Link>

      <ErrorBanner message={metaError} />

      {metaLoading ? (
        <LoadingSpinner label="Đang tải thông tin file..." />
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs text-slate-400 dark:text-slate-500">{fileName}</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-semibold">MA_LK:</span> {header.MA_LK || '-'}
              <span className="mx-3 text-slate-300 dark:text-slate-700">|</span>
              <span className="font-semibold">MA_BN:</span> {header.MA_BN || '-'}
              <span className="mx-3 text-slate-300 dark:text-slate-700">|</span>
              <span className="font-semibold">HO_TEN:</span> {header.HO_TEN || '-'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Tổng cảnh báo</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{warningSummary.tongCanhBao}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                {SEVERITY_LEVELS.map((s) => (
                  <span key={s.key} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                    {s.label} {warningSummary[s.key]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-t-md px-3 py-2 text-sm font-medium ${
                  activeTab === tab.key
                    ? 'border-b-2 border-brand-accent text-brand-accent'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
                {tab.badge > 0 && (
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <ErrorBanner message={tabError} />

          {tabLoading ? (
            <LoadingSpinner label="Đang tải dữ liệu..." />
          ) : activeTab === 'TIMELINE' ? (
            <ul className="space-y-2 rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              {timelineEvents.map((event, idx) => (
                <li key={idx} className="flex justify-between border-b border-slate-100 pb-2 text-sm last:border-0 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">{event.label}</span>
                  <span className="font-medium">{formatBhytDate(event.value)}</span>
                </li>
              ))}
              {timelineEvents.length === 0 && (
                <li className="text-center text-slate-400 dark:text-slate-500">Không có mốc thời gian nào</li>
              )}
            </ul>
          ) : activeTab === 'ERRORS' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={errorFilters.q}
                    onChange={(e) => setErrorFilters((prev) => ({ ...prev, q: e.target.value }))}
                    placeholder="Tìm theo mã chi phí hoặc tên chi phí..."
                    className="w-64 rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm focus:border-brand-accent focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <select
                  value={errorFilters.maLoi}
                  onChange={(e) => setErrorFilters((prev) => ({ ...prev, maLoi: e.target.value }))}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">Tất cả mã lỗi</option>
                  {errorMaLoiOptions.map((item) => (
                    <option key={item.maLoi} value={item.maLoi}>
                      {item.maLoi} - {item.tenLoi}
                    </option>
                  ))}
                </select>
                <select
                  value={errorFilters.mucDo}
                  onChange={(e) => setErrorFilters((prev) => ({ ...prev, mucDo: e.target.value }))}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">Tất cả mức độ</option>
                  {SEVERITY_LEVELS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} ({warningSummary[s.key]})
                    </option>
                  ))}
                </select>
                <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  {filteredErrorRows.length}/{(rowsByTab.ERRORS || []).length} dòng
                </span>
              </div>
              <ResultsTable rows={filteredErrorRows} colorBy="severity" />
            </div>
          ) : (
            <>
              {XML_TYPE_LABELS[activeTab] && (
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {activeTab} - {XML_TYPE_LABELS[activeTab]}
                </p>
              )}
              <GenericXmlTable rows={rowsByTab[activeTab] || []} xmlType={activeTab} />
            </>
          )}
        </>
      )}
    </div>
  )
}
