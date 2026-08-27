import { Routes, Route, Link } from 'react-router-dom'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import '../../styles/manager/Dashboard.css'

export default function Dashboard() {
  return (
    <div className="manager-layout">
      <nav className="manager-sidebar">
        <div className="sidebar-header">
          <h2>Manager Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/manager">Overview</Link></li>
          <li><Link to="/manager/projects">Projects</Link></li>
          <li><Link to="/manager/teams">Teams</Link></li>
          <li><Link to="/manager/reports">Reports</Link></li>
          <li><Link to="/manager/settings">Settings</Link></li>
        </ul>
      </nav>

      <main className="manager-content">
        <Routes>
          <Route index element={<ManagerOverview />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

function ManagerOverview() {
  return (
    <div className="overview">
      <h1>Overview</h1>
      <p>Welcome to the Manager Dashboard. Select an option from the sidebar to get started.</p>
    </div>
  )
}
