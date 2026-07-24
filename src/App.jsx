import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import BatchListPage from './pages/BatchListPage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'
import DrugCatalogPage from './pages/DrugCatalogPage'
import ServiceCatalogPage from './pages/ServiceCatalogPage'
import ErrorCodeCatalogPage from './pages/ErrorCodeCatalogPage'
import DoctorCatalogPage from './pages/DoctorCatalogPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<BatchListPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/batches/:batchId/results" element={<ResultsPage />} />
            <Route path="/batches/:batchId/dashboard" element={<DashboardPage />} />
            <Route path="/danh-muc/thuoc" element={<DrugCatalogPage />} />
            <Route path="/danh-muc/dich-vu" element={<ServiceCatalogPage />} />
            <Route path="/danh-muc/ma-loi" element={<ErrorCodeCatalogPage />} />
            <Route path="/danh-muc/bac-si" element={<DoctorCatalogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
