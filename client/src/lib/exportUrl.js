const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'

export function exportUrl(path) {
  return `${baseURL}${path}`
}
