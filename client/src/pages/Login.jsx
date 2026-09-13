import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Field, SubmitRow } from '../components/forms/FormControls'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [state, setState] = useState({ status: 'idle' })

  async function handleSubmit(e) {
    e.preventDefault()
    setState({ status: 'saving' })
    try {
      await login(password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setState({ status: 'error', message: err?.response?.data?.error || err.message })
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink mb-1">Coordinator Login</h1>
      <p className="text-mid-gray mb-8 text-sm">
        Log in to edit club data. Dashboards and RSVP/check-in stay open to everyone.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-paper border border-hairline rounded-cards shadow-subtle p-5 space-y-4"
      >
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full bg-canvas rounded-inputs px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-hairline"
          />
        </Field>
        <SubmitRow state={state} label="Log in" />
      </form>
    </div>
  )
}
