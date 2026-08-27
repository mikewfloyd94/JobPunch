import { Routes, Route, Link } from 'react-router-dom'
import Assignments from './pages/Assignments'
import Timesheets from './pages/Timesheets'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import '../../styles/contractor/Portal.css'

export default function Portal() {
  return (
    <div className="contractor-layout">
      <nav className="contractor-header">
        <div className="header-content">
          <h2>Contractor Portal</h2>
          <ul className="header-menu">
            <li><Link to="/contractor">Dashboard</Link></li>
            <li><Link to="/contractor/assignments">Assignments</Link></li>
            <li><Link to="/contractor/timesheets">Timesheets</Link></li>
            <li><Link to="/contractor/messages">Messages</Link></li>
            <li><Link to="/contractor/profile">Profile</Link></li>
          </ul>
        </div>
      </nav>

      <main className="contractor-content">
        <Routes>
          <Route index element={<ContractorDashboard />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

function ContractorDashboard() {
  return (
    <div className="contractor-dashboard">
      <h1>Welcome, Contractor</h1>
      <p>Select an option from the menu to manage your work.</p>
    </div>
  )
}
