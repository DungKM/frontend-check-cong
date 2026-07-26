export default function UploadSummaryCard({ result, error }) {
  if (error) {
    return <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
  }
  if (!result) return null

  return (
    <div className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
      Đã đọc {result.rowCount} dòng.
      {result.warnings?.length > 0 && (
        <details className="mt-1 text-amber-700 dark:text-amber-400">
          <summary className="cursor-pointer">{result.warnings.length} cảnh báo</summary>
          <ul className="ml-4 list-disc">
            {result.warnings.slice(0, 20).map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
            {result.warnings.length > 20 && <li>... và {result.warnings.length - 20} cảnh báo khác</li>}
          </ul>
        </details>
      )}
    </div>
  )
}
