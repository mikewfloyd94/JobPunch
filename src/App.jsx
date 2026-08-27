import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ManagerDashboard from './pages/manager/Dashboard'
import ContractorPortal from './pages/contractor/Portal'
import LandingPage from './pages/LandingPage'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import PrivateRoute from './components/PrivateRoute'
import { testConnection } from './services/api'
import './styles/App.css'
import './styles/Loading.css'

function AppContent() {
  const [dbStatus, setDbStatus] = useState('checking')
  const [dbError, setDbError] = useState(null)

  useEffect(() => {
    const checkConnection = async () => {
      const { connected, error } = await testConnection()
      if (connected) {
        setDbStatus('connected')
        console.log('✓ Supabase connection successful')
      } else {
        setDbStatus('error')
        setDbError(error?.message)
        console.error('✗ Supabase connection failed:', error?.message)
      }
    }

    checkConnection()
  }, [])

  return (
    <>
      <DBStatusIndicator status={dbStatus} error={dbError} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/manager/*"
            element={
              <PrivateRoute requiredRole="manager">
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/contractor/*"
            element={
              <PrivateRoute requiredRole="contractor">
                <ContractorPortal />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function DBStatusIndicator({ status, error }) {
  if (status === 'checking') return null

  const statusClass = `db-indicator db-${status}`
  const statusText =
    status === 'connected'
      ? 'Database Connected'
      : `Database Error: ${error}`

  return <div className={statusClass} title={statusText} />
}
