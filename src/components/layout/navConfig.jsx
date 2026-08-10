import {
  LayoutDashboard,
  FilePlus2,
  Pill,
  Stethoscope,
  AlertTriangle,
  Settings,
  UserRound,
  Layers,
  Boxes,
  Percent,
} from 'lucide-react'

// items with no `roles` are visible to everyone; otherwise the user's role must be
// included — see Sidebar.jsx's filtering and auth/RequireRole.jsx's route guarding.
// `color` tints the item's icon so mỗi nhóm danh mục dễ nhận ra bằng màu, không chỉ
// bằng icon/tên — giữ nguyên khi item active, chỉ dải nhấn bên trái mới báo "đang ở đây".
export const navSections = [
  {
    title: 'Điều hành',
    items: [
      { to: '/', label: 'Tổng quan', icon: LayoutDashboard, end: true, color: 'text-blue-400' },
      { to: '/upload', label: 'Tạo đối chiếu mới', icon: FilePlus2, color: 'text-brand-accent' },
    ],
  },
  {
    title: 'Danh mục chi phí',
    items: [
      { to: '/danh-muc/thuoc', label: 'Danh mục thuốc', icon: Pill, roles: ['admin'], color: 'text-rose-400' },
      { to: '/danh-muc/dich-vu', label: 'Danh mục dịch vụ kỹ thuật', icon: Stethoscope, roles: ['admin'], color: 'text-sky-400' },
      { to: '/danh-muc/vat-tu', label: 'Danh mục vật tư y tế', icon: Boxes, roles: ['admin'], color: 'text-teal-400' },
    ],
  },
  {
    title: 'Quy tắc đối chiếu',
    items: [
      { to: '/danh-muc/ma-loi', label: 'Danh mục mã lỗi', icon: AlertTriangle, roles: ['admin'], color: 'text-amber-400' },
      { to: '/danh-muc/bac-si', label: 'Danh mục bác sĩ', icon: UserRound, roles: ['admin'], color: 'text-violet-400' },
      { to: '/danh-muc/ma-nhom', label: 'Danh mục mã nhóm DVKT', icon: Layers, roles: ['admin'], color: 'text-indigo-400' },
      { to: '/danh-muc/muc-huong', label: 'Danh mục mức hưởng theo đối tượng', icon: Percent, roles: ['admin'], color: 'text-emerald-400' },
    ],
  },
  {
    title: 'Hệ thống',
    items: [{ to: '/settings', label: 'Cài đặt', icon: Settings, roles: ['admin'], color: 'text-slate-400' }],
  },
]
