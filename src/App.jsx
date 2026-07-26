import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './auth/ProtectedRoute'
import RequireRole from './auth/RequireRole'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import OverviewPage from './pages/OverviewPage'
import BatchListPage from './pages/BatchListPage'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'
import DrugCatalogPage from './pages/DrugCatalogPage'
import ServiceCatalogPage from './pages/ServiceCatalogPage'
import ErrorCodeCatalogPage from './pages/ErrorCodeCatalogPage'
import DoctorCatalogPage from './pages/DoctorCatalogPage'
import ServiceGroupCatalogPage from './pages/ServiceGroupCatalogPage'
import VatTuCatalogPage from './pages/VatTuCatalogPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/dot-doi-chieu" element={<BatchListPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/batches/:batchId/results" element={<ResultsPage />} />
                <Route path="/batches/:batchId/dashboard" element={<DashboardPage />} />
                <Route element={<RequireRole roles={['admin']} />}>
                  <Route path="/danh-muc/thuoc" element={<DrugCatalogPage />} />
                  <Route path="/danh-muc/dich-vu" element={<ServiceCatalogPage />} />
                  <Route path="/danh-muc/ma-loi" element={<ErrorCodeCatalogPage />} />
                  <Route path="/danh-muc/bac-si" element={<DoctorCatalogPage />} />
                  <Route path="/danh-muc/ma-nhom" element={<ServiceGroupCatalogPage />} />
                  <Route path="/danh-muc/vat-tu" element={<VatTuCatalogPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
