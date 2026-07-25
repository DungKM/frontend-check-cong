import axiosClient from './axiosClient'

export function getOverview() {
  return axiosClient.get('/stats/overview').then((res) => res.data)
}
