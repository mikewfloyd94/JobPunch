import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if Supabase is properly configured
  const isSupabaseConfigured = supabase?.auth !== undefined

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...')
        console.log('[AuthContext] Supabase configured:', isSupabaseConfigured)

        if (!isSupabaseConfigured) {
          console.error('[AuthContext] Supabase not properly configured - missing env variables')
          setUser(null)
          setUserRole(null)
          setLoading(false)
          setError('Supabase not configured')
          return
        }

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        console.log('[AuthContext] getUser returned:', authUser ? `User: ${authUser.email}` : 'null')

        if (authUser) {
          console.log('[AuthContext] User found, fetching role...')
          setUser(authUser)
          await fetchUserRole(authUser.id)
        } else {
          console.log('[AuthContext] No user, setting to null')
          setUser(null)
          setUserRole(null)
        }
      } catch (err) {
        console.error('[AuthContext] Auth initialization error:', err)
        setUser(null)
        setUserRole(null)
      } finally {
        setLoading(false)
        console.log('[AuthContext] Auth initialization complete')
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, authUser) => {
        console.log('[AuthContext] Auth state changed:', event, authUser ? `User: ${authUser.email}` : 'null')
        if (authUser) {
          setUser(authUser)
          await fetchUserRole(authUser.id)
        } else {
          setUser(null)
          setUserRole(null)
        }
        setLoading(false)
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const fetchUserRole = async (userId) => {
    try {
      console.log('[AuthContext] Fetching role for user:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      console.log('[AuthContext] User role fetched:', data?.role)
      setUserRole(data?.role || null)
    } catch (err) {
      console.error('[AuthContext] Error fetching user role:', err)
      setUserRole(null)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setUser(data.user)
      await fetchUserRole(data.user.id)
      return data.user
    } catch (err) {
      const message = err.message || 'Failed to sign in'
      setError(message)
      throw new Error(message)
    }
  }

  const signup = async (email, password, name, role) => {
    try {
      setError(null)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email,
            name,
            role,
            created_at: new Date().toISOString(),
          },
        ])

        if (insertError) throw insertError

        setUser(data.user)
        setUserRole(role)
        return data.user
      }
    } catch (err) {
      const message = err.message || 'Failed to create account'
      setError(message)
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setUser(null)
      setUserRole(null)
    } catch (err) {
      const message = err.message || 'Failed to sign out'
      setError(message)
      throw new Error(message)
    }
  }

  const value = {
    user,
    userRole,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isManager: userRole === 'manager',
    isContractor: userRole === 'contractor',
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
