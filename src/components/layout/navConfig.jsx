import { ClipboardList, FilePlus2, Pill, Stethoscope, AlertTriangle, Settings, UserRound, Layers } from 'lucide-react'

export const navSections = [
  {
    title: 'Điều hành',
    items: [
      { to: '/', label: 'Đợt đối chiếu', icon: ClipboardList, end: true },
      { to: '/upload', label: 'Tạo đối chiếu mới', icon: FilePlus2 },
    ],
  },
  {
    title: 'Dữ liệu',
    items: [
      { to: '/danh-muc/thuoc', label: 'Danh mục thuốc', icon: Pill },
      { to: '/danh-muc/dich-vu', label: 'Danh mục dịch vụ kỹ thuật', icon: Stethoscope },
      { to: '/danh-muc/ma-loi', label: 'Danh mục mã lỗi', icon: AlertTriangle },
      { to: '/danh-muc/bac-si', label: 'Danh mục bác sĩ', icon: UserRound },
      { to: '/danh-muc/ma-nhom', label: 'Danh mục mã nhóm DVKT', icon: Layers },
    ],
  },
  {
    title: 'Hệ thống',
    items: [{ to: '/settings', label: 'Cài đặt', icon: Settings }],
  },
]
