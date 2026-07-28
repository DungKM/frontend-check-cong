// Preferred column order for the raw XML detail tables (GenericXmlTable), matching the
// order fields naturally appear in a real BHYT XML2/XML3 sample. Types without an entry
// here just fall back to the field order found in the data — still fully functional,
// just not hand-curated.
export const XML_COLUMN_ORDER = {
  XML2: [
    'STT',
    'MA_CSKCB_THUOC',
    'NGAY_TH_YL',
    'DON_VI_TINH',
    'TT_THAU',
    'MA_PTTT',
    'DU_PHONG',
    'MA_THUOC',
    'TEN_THUOC',
    'CACH_DUNG',
    'LIEU_DUNG',
    'DUONG_DUNG',
    'SO_DANG_KY',
    'HAM_LUONG',
    'DANG_BAO_CHE',
    'DON_GIA',
    'SO_LUONG',
    'THANH_TIEN_BV',
    'THANH_TIEN_BH',
    'MUC_HUONG',
    'TYLE_TT_BH',
    'MA_BAC_SI',
    'MA_KHOA',
  ],
  XML3: [
    'STT',
    'NGAY_TH_YL',
    'MA_DICH_VU',
    'TEN_DICH_VU',
    'MA_VAT_TU',
    'TEN_VAT_TU',
    'DON_VI_TINH',
    'SO_LUONG',
    'DON_GIA_BV',
    'DON_GIA_BH',
    'THANH_TIEN_BV',
    'THANH_TIEN_BH',
    'TT_THAU',
    'MUC_HUONG',
    'TYLE_TT_BH',
    'MA_BAC_SI',
    'MA_KHOA',
    'MA_GIUONG',
    'MA_NHOM',
  ],
}

export const XML_TYPE_LABELS = {
  XML1: 'Thông tin hành chính',
  XML2: 'Chi tiết thuốc',
  XML3: 'Chi tiết dịch vụ kỹ thuật / vật tư y tế',
  XML4: 'Chi tiết cận lâm sàng',
  XML5: 'Chi tiết diễn biến bệnh',
  XML7: 'Giấy ra viện',
  XML8: 'Tóm tắt hồ sơ bệnh án',
  XML13: 'Giấy chuyển tuyến',
}

export function orderColumns(xmlType, availableKeys) {
  const preferred = XML_COLUMN_ORDER[xmlType]
  if (!preferred) return availableKeys
  const preferredPresent = preferred.filter((k) => availableKeys.includes(k))
  const rest = availableKeys.filter((k) => !preferred.includes(k))
  return [...preferredPresent, ...rest]
}
