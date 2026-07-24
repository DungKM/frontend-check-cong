import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileDropInput from '../components/upload/FileDropInput'
import UploadSummaryCard from '../components/upload/UploadSummaryCard'
import ErrorBanner from '../components/common/ErrorBanner'
import * as uploadApi from '../api/uploadApi'
import * as analyzeApi from '../api/analyzeApi'

const initialSlot = { files: [], uploading: false, result: null, error: '' }

export default function UploadPage() {
  const [batchId, setBatchId] = useState(null)
  const [claim, setClaim] = useState(initialSlot)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const navigate = useNavigate()

  async function handleClaimFiles(files) {
    setClaim({ files, uploading: true, result: null, error: '' })
    try {
      const result = await uploadApi.uploadClaimXml(files, batchId)
      setBatchId(result.batchId)
      setClaim({ files, uploading: false, result, error: '' })
    } catch (err) {
      setClaim({ files, uploading: false, result: null, error: err.response?.data?.message || 'Tải file thất bại' })
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true)
    setAnalyzeError('')
    try {
      await analyzeApi.runAnalyze(batchId)
      navigate(`/batches/${batchId}/results`)
    } catch (err) {
      setAnalyzeError(err.response?.data?.message || 'Chạy đối chiếu thất bại')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Tạo đợt đối chiếu mới</h1>
        <p className="text-sm text-slate-500">
          Nạp file hồ sơ giám định (XML/ZIP) gửi cổng BHYT — hệ thống sẽ tự đối chiếu với danh mục thuốc, dịch vụ kỹ
          thuật và mã lỗi đã có sẵn.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <FileDropInput
          label="Hồ sơ giám định (XML/ZIP)"
          multiple
          accept=".xml,.zip"
          hint="Kéo thả file XML/ZIP hồ sơ giám định vào đây, hoặc bấm để chọn file (có thể chọn nhiều file)"
          files={claim.files}
          disabled={claim.uploading}
          onChange={handleClaimFiles}
        />
        <UploadSummaryCard result={claim.result} error={claim.error} />
      </div>

      <ErrorBanner message={analyzeError} />

      <button
        onClick={handleAnalyze}
        disabled={!claim.result || claim.uploading || analyzing}
        className="w-full rounded-md bg-brand-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {analyzing ? 'Đang chạy đối chiếu...' : 'Chạy đối chiếu'}
      </button>
    </div>
  )
}
