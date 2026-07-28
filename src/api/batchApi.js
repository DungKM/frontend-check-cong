import axiosClient from './axiosClient'

export function listBatches({ page = 1, pageSize = 20 } = {}) {
  return axiosClient.get('/batches', { params: { page, pageSize } }).then((res) => res.data)
}

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
