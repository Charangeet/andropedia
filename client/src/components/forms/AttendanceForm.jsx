import { useState } from 'react'
import { logAttendance } from '../../api/attendance'
import { Field, SubmitRow, MemberSelect } from './FormControls'

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
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 space-y-3">
      <h2 className="font-medium">Log Attendance</h2>

      <Field label="Member">
        <MemberSelect members={members} value={memberId} onChange={setMemberId} />
      </Field>

      <Field label="Event">
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
          className="w-full border rounded-md px-2 py-1.5 text-sm"
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
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="status"
              value="present"
              checked={status === 'present'}
              onChange={() => setStatus('present')}
            />
            Present
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="status"
              value="absent"
              checked={status === 'absent'}
              onChange={() => setStatus('absent')}
            />
            Absent
          </label>
        </div>
      </Field>

      <SubmitRow state={state} label="Log attendance" />
    </form>
  )
}
