export const CONCLUSION_META = {
  LECH_DU_LIEU: {
    label: 'Lệch dữ liệu',
    badgeClass: 'bg-red-100 text-red-800 border border-red-300',
    rowClass: 'bg-red-50',
  },
  KHONG_TIM_THAY: {
    label: 'Không tìm thấy trong danh mục',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
    rowClass: 'bg-amber-50',
  },
  KHONG_LIEN_QUAN_DANH_MUC: {
    label: 'Không liên quan danh mục',
    badgeClass: 'bg-slate-200 text-slate-700 border border-slate-300',
    rowClass: 'bg-slate-50',
  },
}

export function getConclusionMeta(ketLuan) {
  return (
    CONCLUSION_META[ketLuan] || {
      label: ketLuan || '(không rõ)',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300',
      rowClass: '',
    }
  )
}
