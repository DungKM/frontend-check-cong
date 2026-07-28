import { useMemo, useRef } from 'react'
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { formatCurrency } from '../../utils/formatCurrency'
import { getConclusionMeta } from '../../utils/conclusionMeta'
import { getSeverityRowClass } from '../../utils/severityMeta'

const columns = [
  { id: 'stt', header: 'STT', size: 60, cell: ({ row }) => row.index + 1 },
  { accessorKey: 'maBN', header: 'Mã BN', size: 100 },
  { accessorKey: 'hoTen', header: 'Họ tên', size: 160 },
  { accessorKey: 'maKhoa', header: 'Khoa', size: 90 },
  { accessorKey: 'maChiPhi', header: 'Mã chi phí', size: 100 },
  { accessorKey: 'tenChiPhi', header: 'Tên chi phí', size: 220 },
  {
    accessorKey: 'deNghi',
    header: 'Đề nghị',
    size: 120,
    cell: (info) => formatCurrency(info.getValue()),
  },
  {
    id: 'duDoanMaLoi',
    header: 'Mã lỗi dự đoán',
    size: 200,
    cell: ({ row }) => {
      const items = row.original.duDoanMaLoi || []
      if (items.length === 0) return <span className="text-slate-400 dark:text-slate-500">-</span>
      return (
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {items.map((item, idx) => (
            <li key={idx} className="py-1 first:pt-0 last:pb-0">
              <span className="font-medium">{item.maLoi}</span> - {item.tenLoi}
            </li>
          ))}
        </ul>
      )
    },
  },
  {
    id: 'chiTietLech',
    header: 'Chi tiết lệch',
    size: 320,
    cell: ({ row }) => {
      const diffs = row.original.chiTietLech || []
      if (diffs.length === 0) return <span className="text-slate-400 dark:text-slate-500">-</span>
      return (
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {diffs.map((d, idx) => (
            <li key={idx} className="py-1 first:pt-0 last:pb-0">
              <span className="font-medium">{d.truong}:</span> XML=&quot;{d.giaTriXML}&quot; vs
              Danh mục=&quot;{d.giaTriDanhMuc}&quot;
            </li>
          ))}
        </ul>
      )
    },
  },
  {
    id: 'ghiChu',
    header: 'Ghi chú',
    size: 260,
    cell: ({ row }) => {
      const notes = row.original.ghiChu || []
      if (notes.length === 0) return null
      return (
        <ul className="list-disc space-y-1 pl-4 text-slate-500 dark:text-slate-400">
          {notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      )
    },
  },
]

export default function ResultsTable({ rows, colorBy = 'ketLuan' }) {
  const parentRef = useRef(null)

  const flatData = useMemo(
    () =>
      rows.map((r) => ({
        ...r.errorRow,
        ketLuan: r.ketLuan,
        chiTietLech: r.chiTietLech,
        duDoanMaLoi: r.duDoanMaLoi,
        ghiChu: r.ghiChu,
      })),
    [rows]
  )

  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableRows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
    measureElement: (element) => element.getBoundingClientRect().height,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0

  return (
    <div ref={parentRef} className="max-h-[70vh] overflow-auto rounded-md border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-100 text-left text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap border border-slate-300 px-3 py-2 font-semibold dark:border-slate-700"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} colSpan={columns.length} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = tableRows[virtualRow.index]
            const rowClass =
              colorBy === 'severity'
                ? getSeverityRowClass(row.original.duDoanMaLoi)
                : getConclusionMeta(row.original.ketLuan).rowClass
            return (
              <tr
                key={row.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={`align-top ${rowClass}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-slate-200 px-3 py-2 dark:border-slate-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom }} colSpan={columns.length} />
            </tr>
          )}
        </tbody>
      </table>
      {flatData.length === 0 && (
        <p className="p-6 text-center text-slate-400 dark:text-slate-500">Không có dòng nào khớp bộ lọc</p>
      )}
    </div>
  )
}
