import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Projects from './pages/Projects'
import Teams from './pages/Teams'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { useAuth } from '../../context/AuthContext'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { fetchProjects, fetchPunchItems, query, createPunchItem, createMessage } from '../../services/api'
import '../../styles/manager/Dashboard.css'

export default function Dashboard() {
  const [theme, setTheme] = useState('light')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showPunchModal, setShowPunchModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState(null)

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
          <Route index element={
            <ManagerOverview
              onAddPunch={() => setShowPunchModal(true)}
              onAddMessage={() => setShowMessageModal(true)}
              onJobSelect={setSelectedJobId}
            />
          } />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Routes>

        {showPunchModal && (
          <PunchModal
            onClose={() => setShowPunchModal(false)}
            selectedJobId={selectedJobId}
          />
        )}
        {showMessageModal && (
          <MessageModal
            onClose={() => setShowMessageModal(false)}
            selectedJobId={selectedJobId}
          />
        )}
      </main>
    </div>
  )
}

function TopNav({ userName, onThemeToggle, currentTheme, onLogout }) {
  return (
    <div className="top-nav">
      <div className="nav-left">
        <h2>Welcome back</h2>
        <p className="user-name">{userName?.split('@')[0] || 'Manager'}</p>
      </div>
      <div className="nav-right">
        <button className="nav-icon-btn" onClick={onThemeToggle} title="Toggle theme">
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="nav-icon-btn logout-icon" onClick={onLogout} title="Sign Out">
          🚪
        </button>
      </div>
    </div>
  )
}

function ManagerOverview({ onAddPunch, onAddMessage, onJobSelect }) {
  const { data: projects, loading: projectsLoading } = useSupabaseQuery(
    () => fetchProjects(),
    []
  )

  const { data: punchItems, loading: punchLoading } = useSupabaseQuery(
    () => fetchPunchItems(),
    []
  )

  const getTodaysPunchItems = () => {
    if (!punchItems) return []
    const today = new Date().toDateString()
    return punchItems
      .filter(p => p.status === 'open' && new Date(p.created_at).toDateString() === today)
      .slice(0, 5)
  }

  const getOpenPunchItems = () => {
    if (!punchItems) return []
    return punchItems
      .filter(p => p.status === 'open')
      .slice(0, 10)
  }

  const activeJobs = projects?.filter(p => p.status !== 'completed') || []

  return (
    <div className="overview-mobile">
      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <button className="action-btn action-punch" onClick={onAddPunch}>
          <span className="action-icon">✓</span>
          <span className="action-label">Punch Item</span>
        </button>
        <button className="action-btn action-message" onClick={onAddMessage}>
          <span className="action-icon">💬</span>
          <span className="action-label">Message</span>
        </button>
        <button className="action-btn action-change">
          <span className="action-icon">📋</span>
          <span className="action-label">Change Order</span>
        </button>
      </div>

      {/* Today Section */}
      {getTodaysPunchItems().length > 0 && (
        <section className="today-section">
          <h2 className="section-header">
            <span className="section-icon">📅</span>
            Today's Tasks
          </h2>
          <div className="today-items">
            {getTodaysPunchItems().map((item) => {
              const project = projects?.find(p => p.id === item.project_id)
              return (
                <div key={item.id} className="today-item">
                  <div className="item-dot" />
                  <div className="item-content">
                    <p className="item-job">{project?.name}</p>
                    <p className="item-description">{item.description}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status-badge status-${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Active Jobs Section - Large Cards */}
      <section className="jobs-section">
        <h2 className="section-header">
          <span className="section-icon">🏢</span>
          Active Jobs
        </h2>
        {projectsLoading ? (
          <div className="loading-state">Loading jobs...</div>
        ) : activeJobs.length > 0 ? (
          <div className="jobs-grid">
            {activeJobs.map((job) => {
              const jobPunchItems = punchItems?.filter(p => p.project_id === job.id && p.status === 'open') || []
              return (
                <div
                  key={job.id}
                  className="job-card-large"
                  onClick={() => onJobSelect(job.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="job-card-top">
                    <h3 className="job-card-title">{job.name}</h3>
                    <span className={`status-badge status-${job.status?.toLowerCase() || 'active'}`}>
                      {job.status || 'Active'}
                    </span>
                  </div>

                  <div className="job-card-metrics">
                    <div className="metric">
                      <span className="metric-value">{jobPunchItems.length}</span>
                      <span className="metric-label">Open Items</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">—</span>
                      <span className="metric-label">Messages</span>
                    </div>
                  </div>

                  {job.address && (
                    <p className="job-card-location">📍 {job.address}</p>
                  )}

                  {job.description && (
                    <p className="job-card-desc">{job.description}</p>
                  )}

                  <div className="job-card-action">
                    Tap for details →
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No active jobs</p>
            <p className="empty-hint">Create a project to get started</p>
          </div>
        )}
      </section>

      {/* Open Punch Items - Quick View */}
      {getOpenPunchItems().length > 0 && (
        <section className="punch-section">
          <h2 className="section-header">
            <span className="section-icon">⚠️</span>
            Open Punch Items
          </h2>
          <div className="punch-quick-list">
            {getOpenPunchItems().map((item) => {
              const project = projects?.find(p => p.id === item.project_id)
              return (
                <div key={item.id} className="punch-quick-item">
                  <div className="punch-dot open" />
                  <div className="punch-content">
                    <p className="punch-job">{project?.name}</p>
                    <p className="punch-desc">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function PunchModal({ onClose, selectedJobId }) {
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState(selectedJobId || '')
  const [loading, setLoading] = useState(false)
  const { data: projects } = useSupabaseQuery(() => fetchProjects(), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim() || !projectId) return

    setLoading(true)
    try {
      await createPunchItem({
        project_id: projectId,
        description: description.trim(),
        status: 'open',
      })
      onClose()
      setDescription('')
      setProjectId(selectedJobId || '')
    } catch (error) {
      console.error('Failed to create punch item:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Punch Item</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Job</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="form-input"
            >
              <option value="">Select a job</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be fixed?"
              required
              className="form-input form-textarea"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !description.trim() || !projectId}
            className="form-submit"
          >
            {loading ? 'Adding...' : 'Add Punch Item'}
          </button>
        </form>
      </div>
    </div>
  )
}

function MessageModal({ onClose, selectedJobId }) {
  const [message, setMessage] = useState('')
  const [projectId, setProjectId] = useState(selectedJobId || '')
  const [loading, setLoading] = useState(false)
  const { data: projects } = useSupabaseQuery(() => fetchProjects(), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || !projectId) return

    setLoading(true)
    try {
      await createMessage({
        project_id: projectId,
        text: message.trim(),
        created_at: new Date().toISOString(),
      })
      onClose()
      setMessage('')
      setProjectId(selectedJobId || '')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Send Message</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Job</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="form-input"
            >
              <option value="">Select a job</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              required
              className="form-input form-textarea"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim() || !projectId}
            className="form-submit"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
