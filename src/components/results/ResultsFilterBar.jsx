import { CONCLUSION_META } from '../../utils/conclusionMeta'

export default function ResultsFilterBar({ filters, onChange, options }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.maLoi}
        onChange={(e) => update('maLoi', e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
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
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
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
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
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
