import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import '../styles/LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isManager, isContractor, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-top">
          <h1>JobPunch</h1>
          {isAuthenticated && (
            <button className="logout-button" onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>
        <p>Construction Management Made Simple</p>
      </header>

      <main className="landing-main">
        {isAuthenticated ? (
          <section className="portal-grid">
            {isManager && (
              <div className="portal-card">
                <h2>Manager Dashboard</h2>
                <p>
                  Manage projects, teams, and resources with comprehensive
                  oversight and analytics.
                </p>
                <Link to="/manager" className="portal-link">
                  Enter Dashboard
                </Link>
              </div>
            )}

            {isContractor && (
              <div className="portal-card">
                <h2>Contractor Portal</h2>
                <p>
                  Track assignments, submit timesheets, and communicate with
                  project managers.
                </p>
                <Link to="/contractor" className="portal-link">
                  Enter Portal
                </Link>
              </div>
            )}
          </section>
        ) : (
          <section className="portal-grid">
            <div className="portal-card">
              <h2>Manager Dashboard</h2>
              <p>
                Manage projects, teams, and resources with comprehensive
                oversight and analytics.
              </p>
              <Link to="/signup?role=manager" className="portal-link">
                Sign Up as Manager
              </Link>
            </div>

            <div className="portal-card">
              <h2>Contractor Portal</h2>
              <p>
                Track assignments, submit timesheets, and communicate with
                project managers.
              </p>
              <Link to="/signup?role=contractor" className="portal-link">
                Sign Up as Contractor
              </Link>
            </div>

            <div className="auth-footer-cards">
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign In</Link>
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
