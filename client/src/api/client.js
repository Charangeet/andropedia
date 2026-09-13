import axios from 'axios'

// Dev uses the Vite proxy; production points at the deployed API via VITE_API_URL.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
})

export default client
