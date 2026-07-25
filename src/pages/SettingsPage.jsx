import { useState } from 'react'
import { UserPlus, Pencil, Trash2, ShieldOff } from 'lucide-react'
import { useUsers } from '../hooks/useUsers'
import { useAuth } from '../auth/useAuth'
import UserFormPanel from '../components/settings/UserFormPanel'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorBanner from '../components/common/ErrorBanner'
import { formatDate } from '../utils/formatDate'
import { getRoleMeta } from '../utils/roleMeta'
import * as userApi from '../api/userApi'

export default function SettingsPage() {
  const { user: currentUser } = useAuth()
  const { items, total, page, pageSize, setPage, loading, error, refresh } = useUsers()
  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [actionError, setActionError] = useState('')

  function openCreateForm() {
    setEditingUser(null)
    setShowForm(true)
  }

  function openEditForm(u) {
    setEditingUser(u)
    setShowForm(true)
  }

  async function handleDelete(u) {
    if (!window.confirm(`Xoá tài khoản "${u.username}"?`)) return
    setActionError('')
    try {
      await userApi.deleteUser(u._id)
      refresh()
    } catch (err) {
      setActionError(err.response?.data?.message || 'Xoá tài khoản thất bại')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Cài đặt</h1>
        <p className="text-sm text-slate-500">Quản lý tài khoản đăng nhập và phân quyền hệ thống.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Tài khoản người dùng</h2>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-1.5 rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            <UserPlus size={16} />
            Tạo tài khoản
          </button>
        </div>

        <ErrorBanner message={error || actionError} />

        {loading ? (
          <LoadingSpinner label="Đang tải danh sách tài khoản..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-2">Tên đăng nhập</th>
                  <th className="px-4 py-2">Vai trò</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2">Ngày tạo</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => {
                  const roleMeta = getRoleMeta(u.role)
                  const isSelf = u._id === currentUser?.id
                  return (
                    <tr key={u._id} className="border-t border-slate-100 transition hover:bg-slate-50">
                      <td className="px-4 py-2 font-medium text-slate-800">
                        {u.username}
                        {isSelf && <span className="ml-2 text-xs font-normal text-slate-400">(bạn)</span>}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${roleMeta.badgeClass}`}>{roleMeta.label}</span>
                      </td>
                      <td className="px-4 py-2">
                        {u.active === false ? (
                          <span className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            <ShieldOff size={12} /> Đã khoá
                          </span>
                        ) : (
                          <span className="rounded border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            Đang hoạt động
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-slate-500">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditForm(u)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-accent"
                            aria-label="Sửa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={isSelf}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Xóa"
                            title={isSelf ? 'Không thể tự xoá tài khoản đang đăng nhập' : 'Xoá'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {items.length === 0 && (
              <p className="p-6 text-center text-slate-400">Chưa có tài khoản nào khác ngoài tài khoản của bạn.</p>
            )}
          </div>
        )}

        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>

      {showForm && <UserFormPanel user={editingUser} onClose={() => setShowForm(false)} onSaved={refresh} />}
    </div>
  )
}
