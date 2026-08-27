import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ManagerDashboard from './pages/manager/Dashboard'
import ContractorPortal from './pages/contractor/Portal'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />
        <Route path="/contractor/*" element={<ContractorPortal />} />
      </Routes>
    </Router>
  )
}
