import { useState, useEffect } from 'react'

export function useSupabaseQuery(queryFn, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await queryFn()

        if (isMounted) {
          setData(result.data)
          if (result.error) {
            setError(result.error)
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err)
          console.error('Query error:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error }
}
