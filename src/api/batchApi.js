import axiosClient from './axiosClient'

export function listBatches() {
  return axiosClient.get('/batches').then((res) => res.data.batches)
}
