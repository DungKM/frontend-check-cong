import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react'

// Per-file breakdown table shown right after an XML/ZIP upload (and reused as-is on
// ClaimFilesPage) — one row per uploaded file, click a row to open its XML tab detail
// view. tongCanhBao/mucCao read 0 until "Chạy đối chiếu" has run for the batch.
export default function ClaimFilesSummaryTable({ files, onRowClick }) {
  const successCount = files.filter((f) => f.status === 'success').length
  const errorCount = files.length - successCount

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-3 text-sm font-medium">
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircle2 size={14} /> {successCount} thành công
        </span>
        {errorCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-red-700 dark:bg-red-500/10 dark:text-red-400">
            <XCircle size={14} /> {errorCount} lỗi
          </span>
        )}
      </p>
      <div className="card overflow-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2.5 font-medium">Tên file</th>
              <th className="px-4 py-2.5 font-medium">Trạng thái</th>
              <th className="px-4 py-2.5 font-medium">Mã liên kết</th>
              <th className="px-4 py-2.5 font-medium">Tên bệnh nhân</th>
              <th className="px-4 py-2.5 text-right font-medium">Tổng cảnh báo</th>
              <th className="px-4 py-2.5 text-right font-medium">Mức cao</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((f) => (
              <tr
                key={f.fileName}
                onClick={() => onRowClick(f.fileName)}
                className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-3">{f.fileName}</td>
                <td className="px-4 py-3">
                  {f.status === 'success' ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={16} /> Thành công
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400" title={f.errorMessage}>
                      <XCircle size={16} /> Lỗi
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{f.maLK || '-'}</td>
                <td className="px-4 py-3">{f.hoTen || '-'}</td>
                <td className="px-4 py-3 text-right font-medium">{f.tongCanhBao}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600 dark:text-red-400">{f.mucCao}</td>
                <td className="px-4 py-3 text-slate-400 dark:text-slate-500">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {files.length === 0 && (
          <p className="p-6 text-center text-slate-400 dark:text-slate-500">Chưa có file nào</p>
        )}
      </div>
    </div>
  )
}
