import axiosClient from './axiosClient'

export function listBatches({ page = 1, pageSize = 20 } = {}) {
  return axiosClient.get('/batches', { params: { page, pageSize } }).then((res) => res.data)
}
