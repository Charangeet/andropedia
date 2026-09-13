import { useState } from 'react'
import { logAttendance } from '../../api/attendance'
import { Field, SubmitRow, MemberSelect, selectClass } from './FormControls'

export default function AttendanceForm({ members, events, onSaved }) {
  const [memberId, setMemberId] = useState('')
  const [eventId, setEventId] = useState('')
  const [status, setStatus] = useState('present')
  const [state, setState] = useState({ status: 'idle' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!memberId || !eventId) return
    setState({ status: 'saving' })
    try {
      await logAttendance({ memberId: Number(memberId), eventId: Number(eventId), status })
      setState({ status: 'success' })
      onSaved?.()
    } catch (err) {
      setState({ status: 'error', message: err?.response?.data?.error || err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper border border-hairline rounded-cards shadow-subtle p-5 space-y-4">
      <h2 className="font-semibold text-ink">Log Attendance</h2>

      <Field label="Member">
        <MemberSelect members={members} value={memberId} onChange={setMemberId} />
      </Field>

      <Field label="Event">
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
          className={selectClass}
        >
          <option value="">Select an event...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({new Date(ev.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </Field>

      <Field label="Status">
        <div className="flex gap-2">
          {['present', 'absent'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-buttons text-sm font-medium capitalize transition-colors ${
                status === s ? 'bg-ink text-surface-alt' : 'bg-canvas text-mid-gray hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      <SubmitRow state={state} label="Log attendance" />
    </form>
  )
}
