import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-slate-600">
      <h1 className="text-2xl font-semibold">404 - Không tìm thấy trang</h1>
      <Link to="/" className="text-indigo-600 hover:underline">
        Quay về trang chủ
      </Link>
    </div>
  )
}
