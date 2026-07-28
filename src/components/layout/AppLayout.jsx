import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ChatWidget from './ChatWidget'
import CommandPalette from '../common/CommandPalette'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />
        <main className="px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
      {/* Tạm ẩn ChatWidget theo yêu cầu — bật lại bằng cách bỏ comment dòng dưới. */}
      {/* <ChatWidget /> */}
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  )
}
