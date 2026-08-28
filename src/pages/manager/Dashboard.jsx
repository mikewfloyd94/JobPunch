import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { useAuth } from '../../context/AuthContext'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { fetchProjects, fetchPunchItems, query } from '../../services/api'
import '../../styles/manager/Dashboard.css'

export default function Dashboard() {
  const [theme, setTheme] = useState('light')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="manager-layout" data-theme={theme}>
      <nav className="manager-sidebar">
        <div className="sidebar-header">
          <h2>JobPunch</h2>
          <p className="sidebar-subtitle">Manager Portal</p>
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
        <TopNav
          userName={user?.email}
          onThemeToggle={toggleTheme}
          currentTheme={theme}
          onLogout={handleLogout}
        />

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

function TopNav({ userName, onThemeToggle, currentTheme, onLogout }) {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <h2>Welcome, {userName?.split('@')[0] || 'Manager'}</h2>
      </div>
      <div className="nav-right">
        <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="logout-btn" onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  )
}

function ManagerOverview() {
  const { data: projects, loading: projectsLoading, error: projectsError } = useSupabaseQuery(
    () => fetchProjects(),
    []
  )

  const { data: punchItems, loading: punchLoading, error: punchError } = useSupabaseQuery(
    () => fetchPunchItems(),
    []
  )

  const { data: changeOrders, loading: ordersLoading, error: ordersError } = useSupabaseQuery(
    () => query('change_orders', { order: { column: 'created_at', ascending: false } }),
    []
  )

  return (
    <div className="overview-container">
      {/* Jobs Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Active Jobs</h2>
        {projectsLoading ? (
          <div className="loading">Loading jobs...</div>
        ) : projectsError ? (
          <div className="error">Error loading jobs: {projectsError.message}</div>
        ) : projects && projects.length > 0 ? (
          <div className="jobs-list">
            {projects.map((project) => (
              <div key={project.id} className="job-card">
                <div className="job-header">
                  <h3 className="job-name">{project.name}</h3>
                  <span className={`status-badge status-${project.status?.toLowerCase() || 'active'}`}>
                    {project.status || 'Active'}
                  </span>
                </div>
                {project.description && (
                  <p className="job-description">{project.description}</p>
                )}
                {project.address && (
                  <p className="job-location">📍 {project.address}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No active jobs. Create your first project to get started.</div>
        )}
      </section>

      {/* Punch Items Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Open Punch Items</h2>
        {punchLoading ? (
          <div className="loading">Loading punch items...</div>
        ) : punchError ? (
          <div className="error">Error loading punch items: {punchError.message}</div>
        ) : punchItems && punchItems.filter(p => p.status === 'open' || p.status !== 'completed').length > 0 ? (
          <div className="punch-items-list">
            {punchItems
              .filter(p => p.status === 'open' || p.status !== 'completed')
              .slice(0, 10)
              .map((item) => {
                const project = projects?.find(p => p.id === item.project_id)
                return (
                  <div key={item.id} className="punch-item-card">
                    <div className="punch-item-header">
                      <h4 className="punch-item-title">{item.description || 'Untitled'}</h4>
                      <span className={`status-badge status-${item.status?.toLowerCase() || 'open'}`}>
                        {item.status || 'Open'}
                      </span>
                    </div>
                    {project && (
                      <p className="punch-item-project">
                        <strong>Project:</strong> {project.name}
                      </p>
                    )}
                    {item.assigned_to && (
                      <p className="punch-item-assignee">
                        <strong>Assigned:</strong> {item.assigned_to}
                      </p>
                    )}
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="empty-state">No open punch items.</div>
        )}
      </section>

      {/* Change Orders Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Change Orders</h2>
        {ordersLoading ? (
          <div className="loading">Loading change orders...</div>
        ) : ordersError ? (
          <div className="error">Error loading change orders: {ordersError.message}</div>
        ) : changeOrders && changeOrders.filter(o => o.status === 'pending' || o.status === 'approved').length > 0 ? (
          <div className="change-orders-list">
            {changeOrders
              .filter(o => o.status === 'pending' || o.status === 'approved')
              .slice(0, 10)
              .map((order) => {
                const project = projects?.find(p => p.id === order.project_id)
                return (
                  <div key={order.id} className="change-order-card">
                    <div className="change-order-header">
                      <h4 className="change-order-title">{order.title || 'Change Order'}</h4>
                      <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    {project && (
                      <p className="change-order-project">
                        <strong>Project:</strong> {project.name}
                      </p>
                    )}
                    {order.description && (
                      <p className="change-order-description">{order.description}</p>
                    )}
                    {order.amount && (
                      <p className="change-order-amount">
                        <strong>Amount:</strong> ${parseFloat(order.amount).toFixed(2)}
                      </p>
                    )}
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="empty-state">No pending change orders.</div>
        )}
      </section>
    </div>
  )
}
