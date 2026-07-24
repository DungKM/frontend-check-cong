import { Pencil, Trash2 } from 'lucide-react'

export default function CatalogTable({ columns, items, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-2">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row._id} className="border-t border-slate-100">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {col.render ? col.render(row) : (row[col.key] ?? '')}
                </td>
              ))}
              <td className="px-4 py-2">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(row)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-accent"
                    aria-label="Sửa"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && items.length === 0 && (
        <p className="p-6 text-center text-slate-400">Chưa có dữ liệu. Hãy nhập file hoặc thêm dòng mới để bắt đầu.</p>
      )}
    </div>
  )
}
