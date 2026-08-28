import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function PrivateRoute({ children, requiredRole = null }) {
  const { user, loading, userRole } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
