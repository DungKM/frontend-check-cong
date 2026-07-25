const ACCENT_MAP = [
  [/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a'],
  [/[èéẹẻẽêềếệểễ]/g, 'e'],
  [/[ìíịỉĩ]/g, 'i'],
  [/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o'],
  [/[ùúụủũưừứựửữ]/g, 'u'],
  [/[ỳýỵỷỹ]/g, 'y'],
  [/đ/g, 'd'],
]

// Case/accent-insensitive normalize for client-side search (e.g. tìm theo Mã BN/Họ
// tên trên ResultsPage) — không cần gõ dấu vẫn tìm được.
export function normalizeText(value) {
  if (value === null || value === undefined) return ''
  let result = String(value).toLowerCase()
  for (const [pattern, replacement] of ACCENT_MAP) {
    result = result.replace(pattern, replacement)
  }
  return result.replace(/\s+/g, ' ').trim()
}
