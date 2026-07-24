import { useCallback, useEffect, useState } from 'react'
import * as batchApi from '../api/batchApi'

export function useBatches() {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await batchApi.listBatches()
      setBatches(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách đợt đối chiếu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { batches, loading, error, refresh }
}
