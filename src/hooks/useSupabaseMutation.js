import { useState } from 'react'

export function useSupabaseMutation(mutationFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const mutate = async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(...args)

      if (result.error) {
        setError(result.error)
        return { error: result.error, data: null }
      }

      setData(result.data)
      return { data: result.data, error: null }
    } catch (err) {
      setError(err)
      console.error('Mutation error:', err)
      return { error: err, data: null }
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error, data }
}
