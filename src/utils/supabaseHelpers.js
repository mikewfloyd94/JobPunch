// Helper functions for Supabase operations

export function formatError(error) {
  if (!error) return null
  if (typeof error === 'string') return error
  if (error.message) return error.message
  return 'An unknown error occurred'
}

export function isErrorResponse(response) {
  return response && response.error && !response.data
}

export function handleSupabaseError(error, defaultMessage = 'Operation failed') {
  const message = formatError(error)
  console.error(defaultMessage, message)
  return message || defaultMessage
}

export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }
  throw lastError
}
