import { useCallback, useEffect, useMemo, useState } from 'react'
import * as analyzeApi from '../api/analyzeApi'
import * as catalogApi from '../api/catalogApi'

export function useAnalysisResults(batchId) {
  const [allResults, setAllResults] = useState([])
  const [errorCodeCatalog, setErrorCodeCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await analyzeApi.getResults(batchId)
      setAllResults(data.results)
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được kết quả đối chiếu')
    } finally {
      setLoading(false)
    }
  }, [batchId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    catalogApi
      .listCatalog('errorCode', { pageSize: 500 })
      .then((data) => setErrorCodeCatalog(data.items))
      .catch(() => setErrorCodeCatalog([]))
  }, [])

  const options = useMemo(() => {
    const khoaSet = new Set()
    for (const r of allResults) {
      if (r.errorRow?.maKhoa) khoaSet.add(r.errorRow.maKhoa)
    }
    const maLoiList = [...errorCodeCatalog]
      .sort((a, b) => a.maLoi.localeCompare(b.maLoi))
      .map((item) => ({ maLoi: item.maLoi, tenLoi: item.tenLoi }))
    return { khoaList: [...khoaSet].sort(), maLoiList }
  }, [allResults, errorCodeCatalog])

  return { allResults, loading, error, options, refresh }
}
