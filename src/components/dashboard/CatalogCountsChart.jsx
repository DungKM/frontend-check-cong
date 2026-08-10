import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const BLUE = '#2a78d6'
const GRID = '#e1e0d9'
const MUTED = '#898781'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { label, value } = payload[0].payload
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-slate-500 dark:text-slate-400">{value.toLocaleString('vi-VN')} dòng</p>
    </div>
  )
}

// Mỗi thanh đại diện 1 loại danh mục (nominal, không phải chuỗi số liệu khác nhau)
// nên dùng chung 1 màu — không tô màu theo giá trị hay theo thứ tự, tránh tốn kênh
// màu vào việc chiều dài thanh đã thể hiện rồi. minPointSize giữ cho các danh mục
// nhỏ (VD: mã lỗi, 19 dòng) vẫn có 1 vạch đủ nhìn thấy cạnh danh mục lớn nhất
// (21.089 dòng) — chênh lệch hơn 1000 lần nếu vẽ đúng tỉ lệ sẽ ra 1 vạch 0px.
export default function CatalogCountsChart({ items }) {
  const navigate = useNavigate()
  const data = [...items].sort((a, b) => b.value - a.value)
  const height = Math.max(220, data.length * 42)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
        barCategoryGap="28%"
      >
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: MUTED, fontSize: 12 }}
          axisLine={{ stroke: GRID }}
          tickLine={false}
          tickFormatter={(v) => v.toLocaleString('vi-VN')}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={168}
          tick={{ fill: MUTED, fontSize: 12 }}
          axisLine={{ stroke: GRID }}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(42,120,214,0.06)' }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22} minPointSize={3} cursor="pointer" onClick={(row) => navigate(row.to)}>
          {data.map((row) => (
            <Cell key={row.type} fill={BLUE} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => v.toLocaleString('vi-VN')}
            style={{ fill: MUTED, fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
