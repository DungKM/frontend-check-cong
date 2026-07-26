import { Search } from 'lucide-react'
import { CONCLUSION_META } from '../../utils/conclusionMeta'

export default function ResultsFilterBar({ filters, onChange, options }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.q}
          onChange={(e) => update('q', e.target.value)}
          placeholder="Tìm theo mã BN hoặc họ tên..."
          className="w-56 rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm focus:border-brand-accent focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <select
        value={filters.maLoi}
        onChange={(e) => update('maLoi', e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">Tất cả mã lỗi</option>
        {options.maLoiList.map((item) => (
          <option key={item.maLoi} value={item.maLoi}>
            {item.maLoi} - {item.tenLoi}
          </option>
        ))}
      </select>

      <select
        value={filters.ketLuan}
        onChange={(e) => update('ketLuan', e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">Tất cả kết luận</option>
        {Object.entries(CONCLUSION_META).map(([value, meta]) => (
          <option key={value} value={value}>
            {meta.label}
          </option>
        ))}
      </select>

      <select
        value={filters.maKhoa}
        onChange={(e) => update('maKhoa', e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">Tất cả khoa</option>
        {options.khoaList.map((khoa) => (
          <option key={khoa} value={khoa}>
            {khoa}
          </option>
        ))}
      </select>
    </div>
  )
}
