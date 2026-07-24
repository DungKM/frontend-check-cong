import { useState } from 'react'
import { useCatalog } from '../../hooks/useCatalog'
import CatalogToolbar from './CatalogToolbar'
import CatalogTable from './CatalogTable'
import ImportPanel from './ImportPanel'
import ImportHistoryPanel from './ImportHistoryPanel'
import CatalogFormPanel from './CatalogFormPanel'
import Pagination from '../common/Pagination'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorBanner from '../common/ErrorBanner'
import * as catalogApi from '../../api/catalogApi'

export default function CatalogView({ type, config }) {
  const { items, total, page, pageSize, q, setQ, setPage, loading, error, refresh } = useCatalog(type)
  const [showImport, setShowImport] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  function openCreateForm() {
    setEditingItem(null)
    setShowForm(true)
  }

  function openEditForm(item) {
    setEditingItem(item)
    setShowForm(true)
  }

  async function handleDelete(item) {
    if (!window.confirm(`Xóa dòng "${item[config.columns[0].key]}"?`)) return
    setDeleteError('')
    try {
      await catalogApi.deleteCatalogItem(type, item._id)
      refresh()
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Xóa thất bại')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{config.title}</h1>
        <p className="text-sm text-slate-500">{config.subtitle}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <CatalogToolbar
          q={q}
          onQChange={setQ}
          searchPlaceholder={config.searchPlaceholder}
          onOpenImport={() => setShowImport(true)}
          onOpenHistory={() => setShowHistory(true)}
          onOpenCreate={openCreateForm}
          onDownloadTemplate={() => catalogApi.downloadTemplate(type)}
        />
        <ErrorBanner message={error || deleteError} />
        {loading ? (
          <LoadingSpinner label="Đang tải danh mục..." />
        ) : (
          <CatalogTable columns={config.columns} items={items} loading={loading} onEdit={openEditForm} onDelete={handleDelete} />
        )}
        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </div>

      {showImport && (
        <ImportPanel
          type={type}
          acceptFileTypes={config.acceptFileTypes}
          onClose={() => setShowImport(false)}
          onImported={refresh}
        />
      )}
      {showHistory && <ImportHistoryPanel type={type} onClose={() => setShowHistory(false)} />}
      {showForm && (
        <CatalogFormPanel
          type={type}
          fields={config.fields}
          item={editingItem}
          onClose={() => setShowForm(false)}
          onSaved={refresh}
        />
      )}
    </div>
  )
}
