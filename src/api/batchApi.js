import axiosClient from './axiosClient'

export function getClaimFiles(batchId) {
  return axiosClient.get(`/batches/${batchId}/claim-files`).then((res) => res.data)
}

export function getClaimFileXmlTypes(batchId, fileName) {
  return axiosClient
    .get(`/batches/${batchId}/claim-files/${encodeURIComponent(fileName)}/xml-types`)
    .then((res) => res.data)
}

export function getClaimFileXmlRows(batchId, fileName, xmlType) {
  return axiosClient
    .get(`/batches/${batchId}/claim-files/${encodeURIComponent(fileName)}/xml/${xmlType}`)
    .then((res) => res.data.rows)
}

export async function exportClaimFileErrors(batchId, fileName) {
  const res = await axiosClient.get(
    `/batches/${batchId}/claim-files/${encodeURIComponent(fileName)}/errors/export`,
    { responseType: 'blob' }
  )
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = `danh-sach-loi-${fileName}.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
