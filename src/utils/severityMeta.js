// Mirrors SEVERITY_THRESHOLDS in backend/services/batchService.js — keep both in sync.
// Severity is by count of distinct mã lỗi predicted for a row (see the "TỔNG CẢNH BÁO"
// legend on ClaimFileDetailPage), not by ketLuan like the flat ResultsPage.
const SEVERITY_THRESHOLDS = { cao: 3, trungBinh: 2, thap: 1 }

export const SEVERITY_LEVELS = [
  { key: 'cao', label: 'Cao', dot: 'bg-red-500', rowClass: 'bg-red-50 dark:bg-red-950/40' },
  { key: 'trungBinh', label: 'Trung bình', dot: 'bg-orange-500', rowClass: 'bg-orange-50 dark:bg-orange-950/40' },
  { key: 'thap', label: 'Thấp', dot: 'bg-yellow-400', rowClass: 'bg-yellow-50 dark:bg-yellow-950/40' },
  { key: 'thongTin', label: 'Thông tin', dot: 'bg-slate-400', rowClass: 'bg-slate-50 dark:bg-slate-800/40' },
]

export function getSeverityBucket(duDoanMaLoi) {
  const count = (duDoanMaLoi || []).length
  if (count >= SEVERITY_THRESHOLDS.cao) return 'cao'
  if (count >= SEVERITY_THRESHOLDS.trungBinh) return 'trungBinh'
  if (count >= SEVERITY_THRESHOLDS.thap) return 'thap'
  return 'thongTin'
}

export function getSeverityRowClass(duDoanMaLoi) {
  return SEVERITY_LEVELS.find((s) => s.key === getSeverityBucket(duDoanMaLoi)).rowClass
}
