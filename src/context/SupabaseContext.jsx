import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/config/supabase'
import { testConnection } from '@/services/api'

const SupabaseContext = createContext(null)

export function SupabaseProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        const { connected, error: connectionError } = await testConnection()
        setIsConnected(connected)
        if (connectionError) {
          setError(connectionError)
        }
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  return (
    <SupabaseContext.Provider value={{ isConnected, isLoading, error, supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider')
  }
  return context
}
