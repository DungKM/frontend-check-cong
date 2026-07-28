import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Files } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import ClaimFilesSummaryTable from '../components/upload/ClaimFilesSummaryTable'
import * as batchApi from '../api/batchApi'

export default function ClaimFilesPage() {
  const { batchId } = useParams()
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    batchApi
      .getClaimFiles(batchId)
      .then((data) => {
        if (!cancelled) setFiles(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Không tải được danh sách file')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [batchId])

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Files}
        title="Hồ sơ đã tải"
        subtitle={`Đợt đối chiếu ${batchId} — bấm vào 1 dòng để xem chi tiết theo từng loại XML`}
      />

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingSpinner label="Đang tải danh sách file..." />
      ) : (
        <ClaimFilesSummaryTable
          files={files}
          onRowClick={(fileName) => navigate(`/batches/${batchId}/files/${encodeURIComponent(fileName)}`)}
        />
      )}
    </div>
  )
}
