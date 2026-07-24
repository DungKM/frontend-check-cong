import axiosClient from './axiosClient'

export function uploadClaimXml(files, batchId) {
  const formData = new FormData()
  for (const file of files) formData.append('files', file)
  if (batchId) formData.append('batchId', batchId)
  return axiosClient
    .post('/upload/claim-xml', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data)
}
