import { formatDate } from '../utils/formatDate'
import { formatCurrency } from '../utils/formatCurrency'

const MUC_DO_LABEL = {
  CANH_BAO: 'Cảnh báo',
  TU_CHOI: 'Từ chối',
  NGHIEM_TRONG: 'Nghiêm trọng',
}

export const CATALOG_CONFIGS = {
  drug: {
    title: 'Danh mục thuốc',
    subtitle: 'Danh mục thuốc bệnh viện dùng để đối chiếu mã chi phí trong hồ sơ giám định XML',
    searchPlaceholder: 'Tìm theo mã thuốc hoặc tên thuốc...',
    acceptFileTypes: '.xlsx,.xls,.csv',
    columns: [
      { key: 'maThuoc', header: 'Mã thuốc' },
      { key: 'tenThuoc', header: 'Tên thuốc' },
      { key: 'donViTinh', header: 'Đơn vị tính' },
      { key: 'hamLuong', header: 'Hàm lượng' },
      { key: 'soDangKy', header: 'Số đăng ký' },
      { key: 'donGiaBH', header: 'Đơn giá BH', render: (row) => formatCurrency(row.donGiaBH) },
      { key: 'ttThau', header: 'TT thầu' },
      { key: 'tuNgay', header: 'Từ ngày', render: (row) => formatDate(row.tuNgay) },
      { key: 'denNgay', header: 'Đến ngày', render: (row) => formatDate(row.denNgay) || 'Còn hiệu lực' },
    ],
    fields: [
      { key: 'maThuoc', label: 'Mã thuốc', type: 'text', required: true },
      { key: 'tenThuoc', label: 'Tên thuốc', type: 'text', required: true },
      { key: 'donViTinh', label: 'Đơn vị tính', type: 'text' },
      { key: 'hamLuong', label: 'Hàm lượng', type: 'text' },
      { key: 'soDangKy', label: 'Số đăng ký', type: 'text' },
      { key: 'donGiaBH', label: 'Đơn giá BH', type: 'number' },
      { key: 'ttThau', label: 'TT thầu', type: 'text' },
      { key: 'tuNgay', label: 'Từ ngày', type: 'date', required: true },
      { key: 'denNgay', label: 'Đến ngày', type: 'date' },
      { key: 'maCSKCB', label: 'Mã CSKCB', type: 'text' },
    ],
  },
  service: {
    title: 'Danh mục dịch vụ kỹ thuật',
    subtitle: 'Danh mục DVKT phê duyệt dùng để đối chiếu mã chi phí trong hồ sơ giám định XML',
    searchPlaceholder: 'Tìm theo mã hoặc tên dịch vụ...',
    acceptFileTypes: '.xlsx,.xls,.csv',
    columns: [
      { key: 'maTuongDuong', header: 'Mã tương đương' },
      { key: 'tenDvktPheDuyet', header: 'Tên DVKT phê duyệt' },
      { key: 'donGia', header: 'Đơn giá', render: (row) => formatCurrency(row.donGia) },
      { key: 'tuNgay', header: 'Từ ngày', render: (row) => formatDate(row.tuNgay) },
      { key: 'denNgay', header: 'Đến ngày', render: (row) => formatDate(row.denNgay) || 'Còn hiệu lực' },
    ],
    fields: [
      { key: 'maTuongDuong', label: 'Mã tương đương', type: 'text', required: true },
      { key: 'tenDvktPheDuyet', label: 'Tên DVKT phê duyệt', type: 'text', required: true },
      { key: 'donGia', label: 'Đơn giá', type: 'number' },
      { key: 'tuNgay', label: 'Từ ngày', type: 'date', required: true },
      { key: 'denNgay', label: 'Đến ngày', type: 'date' },
      { key: 'maCSKCB', label: 'Mã CSKCB', type: 'text' },
    ],
  },
  errorCode: {
    title: 'Danh mục mã lỗi',
    subtitle: 'Danh mục mã lỗi/cảnh báo dùng để dự đoán khả năng bị từ chối khi gửi cổng giám định',
    searchPlaceholder: 'Tìm theo mã lỗi hoặc tên lỗi...',
    acceptFileTypes: '.xlsx,.xls,.csv',
    columns: [
      { key: 'maLoi', header: 'Mã lỗi' },
      { key: 'tenLoi', header: 'Tên lỗi' },
      { key: 'dienGiai', header: 'Diễn giải' },
      { key: 'mucDo', header: 'Mức độ', render: (row) => MUC_DO_LABEL[row.mucDo] || row.mucDo },
    ],
    fields: [
      { key: 'maLoi', label: 'Mã lỗi', type: 'text', required: true },
      { key: 'tenLoi', label: 'Tên lỗi', type: 'text', required: true },
      { key: 'dienGiai', label: 'Diễn giải', type: 'textarea' },
      {
        key: 'mucDo',
        label: 'Mức độ',
        type: 'select',
        options: Object.entries(MUC_DO_LABEL).map(([value, label]) => ({ value, label })),
      },
      { key: 'ghiChu', label: 'Ghi chú', type: 'textarea' },
    ],
  },
  doctor: {
    title: 'Danh mục bác sĩ',
    subtitle: 'Danh mục bác sĩ được duyệt (theo mã CCHN) dùng để đối chiếu Mã bác sĩ trong hồ sơ giám định XML',
    searchPlaceholder: 'Tìm theo họ tên hoặc mã CCHN...',
    acceptFileTypes: '.xlsx,.xls,.csv',
    columns: [
      { key: 'hoTen', header: 'Họ tên' },
      { key: 'maCCHN', header: 'Mã CCHN' },
    ],
    fields: [
      { key: 'hoTen', label: 'Họ tên', type: 'text', required: true },
      { key: 'maCCHN', label: 'Mã CCHN', type: 'text', required: true },
    ],
  },
}
