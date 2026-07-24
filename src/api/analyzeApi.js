import axiosClient from './axiosClient'

export function runAnalyze(batchId) {
  return axiosClient.post('/analyze', { batchId }).then((res) => res.data)
}

export function getResults(batchId, filters = {}) {
  const params = {}
  if (filters.ketLuan) params.ketLuan = filters.ketLuan
  if (filters.maKhoa) params.maKhoa = filters.maKhoa
  if (filters.loaiGiamTru) params.loaiGiamTru = filters.loaiGiamTru
  return axiosClient.get(`/analyze/${batchId}`, { params }).then((res) => res.data)
}

export function getSummary(batchId) {
  return axiosClient.get(`/analyze/${batchId}/summary`).then((res) => res.data)
}

export async function exportExcel(batchId) {
  const res = await axiosClient.get(`/analyze/${batchId}/export`, { responseType: 'blob' })
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = `doi-chieu-${batchId}.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
