import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center dark:bg-slate-950">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-brand-accent dark:bg-indigo-500/10">
        <Compass size={30} />
      </span>
      <div>
        <p className="text-sm font-semibold text-brand-accent">Lỗi 404</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">Không tìm thấy trang</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.</p>
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
      >
        <Home size={16} />
        Quay về trang chủ
      </Link>
    </div>
  )
}
