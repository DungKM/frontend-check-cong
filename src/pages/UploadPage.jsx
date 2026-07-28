import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2 } from 'lucide-react'
import FileDropInput from '../components/upload/FileDropInput'
import ClaimFilesSummaryTable from '../components/upload/ClaimFilesSummaryTable'
import ErrorBanner from '../components/common/ErrorBanner'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PageHeader from '../components/common/PageHeader'
import { useToast } from '../context/useToast'
import * as uploadApi from '../api/uploadApi'
import * as batchApi from '../api/batchApi'

const initialSlot = { files: [], uploading: false, result: null, error: '' }

export default function UploadPage() {
  const toast = useToast()
  const [batchId, setBatchId] = useState(null)
  const [claim, setClaim] = useState(initialSlot)
  const [claimFiles, setClaimFiles] = useState(null)
  const navigate = useNavigate()

  async function handleClaimFiles(files) {
    setClaim({ files, uploading: true, result: null, error: '' })
    setClaimFiles(null)
    try {
      const result = await uploadApi.uploadClaimXml(files, batchId)
      setBatchId(result.batchId)
      setClaim({ files, uploading: false, result, error: '' })
      const summary = await batchApi.getClaimFiles(result.batchId)
      setClaimFiles(summary)
      toast.success('Tải file thành công')
    } catch (err) {
      setClaim({ files, uploading: false, result: null, error: err.response?.data?.message || 'Tải file thất bại' })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FilePlus2}
        title="Tạo đợt đối chiếu mới"
        subtitle="Nạp file hồ sơ giám định (XML/ZIP) gửi cổng BHYT — hệ thống sẽ tự đối chiếu với danh mục thuốc, dịch vụ kỹ thuật và mã lỗi đã có sẵn."
      />

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <FileDropInput
          label="Hồ sơ giám định (XML/ZIP)"
          multiple
          accept=".xml,.zip"
          hint="Kéo thả file XML/ZIP hồ sơ giám định vào đây, hoặc bấm để chọn file (có thể chọn nhiều file)"
          files={claim.files}
          disabled={claim.uploading}
          onChange={handleClaimFiles}
        />
        <ErrorBanner message={claim.error} />
        {claim.uploading && <LoadingSpinner label="Đang tải file lên..." />}
        {!claim.uploading && claim.result && !claimFiles && <LoadingSpinner label="Đang tải danh sách hồ sơ..." />}
        {claimFiles && (
          <ClaimFilesSummaryTable
            files={claimFiles}
            onRowClick={(fileName) => navigate(`/batches/${batchId}/files/${encodeURIComponent(fileName)}`)}
          />
        )}
      </div>
    </div>
  )
}
