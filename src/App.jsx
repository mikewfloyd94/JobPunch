import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ManagerDashboard from './pages/manager/Dashboard'
import ContractorPortal from './pages/contractor/Portal'
import LandingPage from './pages/LandingPage'
import { testConnection } from './services/api'
import './styles/App.css'

export default function App() {
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/manager/*" element={<ManagerDashboard />} />
          <Route path="/contractor/*" element={<ContractorPortal />} />
        </Routes>
      </Router>
    </>
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
