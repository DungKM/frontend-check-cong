export function formatCurrency(value) {
  const number = Number(value) || 0
  return number.toLocaleString('vi-VN') + ' đ'
}
