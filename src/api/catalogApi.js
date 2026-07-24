import axiosClient from './axiosClient'

export function listCatalog(type, { q, page = 1, pageSize = 20 } = {}) {
  const params = { page, pageSize }
  if (q) params.q = q
  return axiosClient.get(`/catalogs/${type}`, { params }).then((res) => res.data)
}

export function importCatalog(type, file) {
  const formData = new FormData()
  formData.append('file', file)
  return axiosClient
    .post(`/catalogs/${type}/import`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}

export function listImportHistory(type) {
  return axiosClient.get(`/catalogs/${type}/imports`).then((res) => res.data)
}

export function createCatalogItem(type, values) {
  return axiosClient.post(`/catalogs/${type}`, values).then((res) => res.data)
}

export function updateCatalogItem(type, id, values) {
  return axiosClient.patch(`/catalogs/${type}/${id}`, values).then((res) => res.data)
}

export function deleteCatalogItem(type, id) {
  return axiosClient.delete(`/catalogs/${type}/${id}`).then((res) => res.data)
}

export async function downloadTemplate(type) {
  const res = await axiosClient.get(`/catalogs/${type}/template`, { responseType: 'blob' })
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = `mau-${type}.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
