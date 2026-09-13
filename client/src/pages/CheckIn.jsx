import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getEventByToken, checkinToEvent } from '../api/events'
import { listMembers } from '../api/members'
import { MemberSelect } from '../components/forms/FormControls'
import { ErrorMessage, Loading } from '../components/StatusMessage'

export default function CheckIn() {
  const { token } = useParams()
  const { data: event, loading, error } = useApi(() => getEventByToken(token), [token])
  const { data: members } = useApi(() => listMembers(), [])
  const [memberId, setMemberId] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleCheckin(e) {
    e.preventDefault()
    if (!memberId) return
    setStatus('saving')
    try {
      await checkinToEvent(token, Number(memberId))
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (loading) return <Loading label="Loading event..." />
  if (error) return <ErrorMessage error={error} />
  if (!event) return null

  return (
    <div className="max-w-sm mx-auto mt-12 text-center">
      <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink mb-1">{event.name}</h1>
      <p className="text-mid-gray mb-8 text-sm">{new Date(event.date).toLocaleDateString()}</p>

      {status === 'done' ? (
        <p className="text-good font-medium">You're checked in. See you there!</p>
      ) : (
        <form
          onSubmit={handleCheckin}
          className="bg-paper border border-hairline rounded-cards shadow-subtle p-5 space-y-4 text-left"
        >
          <MemberSelect members={members || []} value={memberId} onChange={setMemberId} />
          <button
            type="submit"
            disabled={!memberId || status === 'saving'}
            className="w-full bg-ink text-surface-alt text-sm font-medium px-4 py-2 rounded-buttons disabled:opacity-50 hover:bg-ink-soft transition-colors"
          >
            {status === 'saving' ? 'Checking in...' : 'Check in'}
          </button>
          {status === 'error' && <p className="text-ember text-sm">Something went wrong. Try again.</p>}
        </form>
      )}
    </div>
  )
}
