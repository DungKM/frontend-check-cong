import { useCallback, useEffect, useState } from 'react'
import * as catalogApi from '../api/catalogApi'

export function useCatalog(type) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await catalogApi.listCatalog(type, { q, page, pageSize })
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh mục')
    } finally {
      setLoading(false)
    }
  }, [type, q, page, pageSize])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    setPage(1)
  }, [q])

  return { items, total, page, pageSize, q, setQ, setPage, loading, error, refresh }
}
