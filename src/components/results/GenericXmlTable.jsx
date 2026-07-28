import { useMemo, useRef } from 'react'
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { AlertTriangle } from 'lucide-react'
import { orderColumns } from '../../config/xmlColumnOrder'

// Which field actually carries the code being reconciled, for each XML type that gets
// a `_hasWarning` flag — the ⚠️ renders inline next to this field's value instead of in
// its own column. XML3 lines are either a dịch vụ or a vật tư line (never both), so pick
// whichever code field is actually filled in on that row.
function getWarningField(xmlType, row) {
  if (xmlType === 'XML2') return 'MA_THUOC'
  if (xmlType === 'XML3') return row.MA_VAT_TU ? 'MA_VAT_TU' : 'MA_DICH_VU'
  return null
}

// Renders raw XML1..XML13 records (arbitrary field names, straight from the source XML)
// as a virtualized table — columns are inferred from the data itself, optionally
// re-ordered via xmlColumnOrder.js to match the field order of a real sample.
export default function GenericXmlTable({ rows, xmlType }) {
  const parentRef = useRef(null)

  const columns = useMemo(() => {
    const keys = orderColumns(
      xmlType,
      Object.keys(rows[0] || {}).filter((k) => k !== '_hasWarning')
    )
    const hasWarningFlag = rows.some((r) => '_hasWarning' in r)

    return keys.map((key) => ({
      accessorKey: key,
      header: key,
      size: 140,
      cell: ({ row }) => {
        const value = row.original[key]
        const isWarningField = hasWarningFlag && row.original._hasWarning && key === getWarningField(xmlType, row.original)
        if (!isWarningField) return value
        return (
          <span className="inline-flex items-center gap-1">
            {value}
            <AlertTriangle size={14} className="shrink-0 text-red-500" />
          </span>
        )
      },
    }))
  }, [rows, xmlType])

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() })
  const tableRows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
    measureElement: (element) => element.getBoundingClientRect().height,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0 ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end : 0

  return (
    <div
      ref={parentRef}
      className="max-h-[65vh] overflow-auto rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <table className="w-full table-auto border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-white text-left text-xs uppercase tracking-wide text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="whitespace-nowrap px-4 py-2.5 font-medium"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} colSpan={columns.length} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = tableRows[virtualRow.index]
            return (
              <tr
                key={row.id}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={row.original._hasWarning ? 'bg-red-50 dark:bg-red-950/30' : ''}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="max-w-[28rem] break-words px-4 py-2 align-top">
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
      {rows.length === 0 && (
        <p className="p-6 text-center text-slate-400 dark:text-slate-500">Không có dữ liệu</p>
      )}
    </div>
  )
}
