import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

export default function PrivateRoute({ children, requiredRole = null }) {
  const { user, loading, userRole } = useAuth()

  // Debug logging
  useEffect(() => {
    console.log('[PrivateRoute] Auth state:', {
      user: user ? `User: ${user.email}` : 'null',
      loading,
      userRole,
      requiredRole,
      shouldRedirect: !user,
    })
  }, [user, loading, userRole, requiredRole])

  if (loading) {
    console.log('[PrivateRoute] Showing loading state')
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (!user) {
    console.log('[PrivateRoute] No user found, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('[PrivateRoute] Role mismatch:', {
      userRole,
      requiredRole,
      redirecting: 'to /',
    })
    return <Navigate to="/" replace />
  }

  console.log('[PrivateRoute] Access granted for:', userRole)
  return children
}
