import { useCallback, useEffect, useState } from 'react'
import * as userApi from '../api/userApi'

export function useUsers() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await userApi.listUsers({ page, pageSize })
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, total, page, pageSize, setPage, loading, error, refresh }
}
