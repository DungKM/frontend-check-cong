import axiosClient from './axiosClient'

export function listUsers({ page = 1, pageSize = 20 } = {}) {
  return axiosClient.get('/users', { params: { page, pageSize } }).then((res) => res.data)
}

export function createUser(values) {
  return axiosClient.post('/users', values).then((res) => res.data)
}

export function updateUser(id, values) {
  return axiosClient.patch(`/users/${id}`, values).then((res) => res.data)
}

export function deleteUser(id) {
  return axiosClient.delete(`/users/${id}`).then((res) => res.data)
}
