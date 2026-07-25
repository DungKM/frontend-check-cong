import {
  LayoutDashboard,
  ClipboardList,
  FilePlus2,
  Pill,
  Stethoscope,
  AlertTriangle,
  Settings,
  UserRound,
  Layers,
  Boxes,
} from 'lucide-react'

// items with no `roles` are visible to everyone; otherwise the user's role must be
// included — see Sidebar.jsx's filtering and auth/RequireRole.jsx's route guarding.
export const navSections = [
  {
    title: 'Điều hành',
    items: [
      { to: '/', label: 'Tổng quan', icon: LayoutDashboard, end: true },
      { to: '/dot-doi-chieu', label: 'Đợt đối chiếu', icon: ClipboardList },
      { to: '/upload', label: 'Tạo đối chiếu mới', icon: FilePlus2 },
    ],
  },
  {
    title: 'Dữ liệu',
    items: [
      { to: '/danh-muc/thuoc', label: 'Danh mục thuốc', icon: Pill, roles: ['admin'] },
      { to: '/danh-muc/dich-vu', label: 'Danh mục dịch vụ kỹ thuật', icon: Stethoscope, roles: ['admin'] },
      { to: '/danh-muc/ma-loi', label: 'Danh mục mã lỗi', icon: AlertTriangle, roles: ['admin'] },
      { to: '/danh-muc/bac-si', label: 'Danh mục bác sĩ', icon: UserRound, roles: ['admin'] },
      { to: '/danh-muc/ma-nhom', label: 'Danh mục mã nhóm DVKT', icon: Layers, roles: ['admin'] },
      { to: '/danh-muc/vat-tu', label: 'Danh mục vật tư y tế', icon: Boxes, roles: ['admin'] },
    ],
  },
  {
    title: 'Hệ thống',
    items: [{ to: '/settings', label: 'Cài đặt', icon: Settings, roles: ['admin'] }],
  },
]
