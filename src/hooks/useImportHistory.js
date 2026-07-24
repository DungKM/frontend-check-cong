import { useCallback, useEffect, useState } from 'react'
import * as catalogApi from '../api/catalogApi'

export function useImportHistory(type) {
  const [imports, setImports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await catalogApi.listImportHistory(type)
      setImports(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được lịch sử nhập')
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { imports, loading, error, refresh }
}
