import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, CheckCircle2, User, Lock, AlertTriangle, TrendingUp } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import ErrorBanner from '../components/common/ErrorBanner'

const FEATURES = [
  'Tự động đối chiếu hồ sơ XML với danh mục thuốc, dịch vụ kỹ thuật, mã lỗi',
  'Phát hiện sớm rủi ro bị từ chối, giảm trừ trước khi gửi cổng giám định',
  'Dashboard thống kê trực quan theo khoa, theo tháng',
]

const CHART_BARS = [38, 62, 45, 80, 55, 70, 48]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#16234a] via-brand-navy to-[#0a1024] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-brand-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-24 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/15">
            <ShieldCheck size={24} className="text-brand-accent" />
          </span>
          <div>
            <p className="text-sm font-semibold">Đối chiếu BHYT</p>
            <p className="text-xs text-slate-400">Gửi cổng giám định</p>
          </div>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold leading-snug">
              Đối chiếu lỗi giảm trừ BHYT nhanh chóng, chính xác
            </h2>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Tiền cảnh báo theo tháng</p>
                <p className="text-lg font-semibold text-white">408.519.620 đ</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <TrendingUp size={13} />
                Đã kiểm soát
              </span>
            </div>

            <div className="flex h-20 items-end gap-2">
              {CHART_BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-brand-accent to-sky-400"
                  style={{ height: `${h}%`, opacity: 0.55 + (i / CHART_BARS.length) * 0.45 }}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-400" />
                1.926 dòng cảnh báo
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                34 đợt đã đối chiếu
              </span>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} Đối chiếu BHYT</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="mb-1 text-xl font-semibold text-slate-800 dark:text-slate-100">
            Đối chiếu lỗi giảm trừ BHYT
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Đăng nhập để tiếp tục</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <ErrorBanner message={error} />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
