import { Link } from 'react-router-dom'
import '../styles/LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>JobPunch</h1>
        <p>Construction Management Made Simple</p>
      </header>

      <main className="landing-main">
        <section className="portal-grid">
          <div className="portal-card">
            <h2>Manager Dashboard</h2>
            <p>Manage projects, teams, and resources with comprehensive oversight and analytics.</p>
            <Link to="/manager" className="portal-link">Enter Dashboard</Link>
          </div>

          <div className="portal-card">
            <h2>Contractor Portal</h2>
            <p>Track assignments, submit timesheets, and communicate with project managers.</p>
            <Link to="/contractor" className="portal-link">Enter Portal</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
