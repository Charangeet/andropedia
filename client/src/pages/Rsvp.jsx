import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { listEvents } from '../api/events'
import { listMembers } from '../api/members'
import { submitRsvp } from '../api/rsvps'
import { MemberSelect } from '../components/forms/FormControls'
import { ErrorMessage, Empty } from '../components/StatusMessage'
import { TableSkeleton } from '../components/Skeleton'

const RESPONSES = ['yes', 'maybe', 'no']

export default function Rsvp() {
  const { data: members, loading: membersLoading } = useApi(() => listMembers(), [])
  const {
    data: events,
    loading: eventsLoading,
    error,
    refetch,
  } = useApi(() => listEvents({ from: new Date().toISOString() }), [])
  const [memberId, setMemberId] = useState('')
  const [savedByEvent, setSavedByEvent] = useState({})

  async function respond(eventId, response) {
    if (!memberId) return
    await submitRsvp({ memberId: Number(memberId), eventId, response })
    setSavedByEvent((prev) => ({ ...prev, [eventId]: response }))
  }

  const loading = membersLoading || eventsLoading

  return (
    <div className="max-w-2xl">
      <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink mb-1">RSVP</h1>
      <p className="text-mid-gray mb-8 text-sm">Let us know if you're coming to an upcoming event.</p>

      <div className="mb-6 max-w-xs">
        <MemberSelect members={members || []} value={memberId} onChange={setMemberId} />
      </div>

      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {loading && <TableSkeleton columns={2} />}
      {!loading && !error && events?.length === 0 && <Empty label="No upcoming events." />}

      {!loading && !error && events?.length > 0 && (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="bg-paper border border-hairline rounded-cards shadow-subtle p-4 flex items-center justify-between gap-4 flex-wrap"
            >
              <div>
                <p className="font-medium text-ink">{ev.name}</p>
                <p className="text-mid-gray text-sm">{new Date(ev.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {RESPONSES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={!memberId}
                    onClick={() => respond(ev.id, r)}
                    className={`px-3 py-1.5 rounded-buttons text-sm font-medium capitalize transition-colors disabled:opacity-40 ${
                      savedByEvent[ev.id] === r
                        ? 'bg-ink text-surface-alt'
                        : 'bg-canvas text-mid-gray hover:text-ink'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
