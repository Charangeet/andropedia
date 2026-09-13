import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { useApi } from '../hooks/useApi'
import { listEvents } from '../api/events'
import { ErrorMessage, Empty } from '../components/StatusMessage'
import { TableSkeleton } from '../components/Skeleton'

export default function Events() {
  const { data: events, loading, error, refetch } = useApi(() => listEvents(), [])
  const [qrEvent, setQrEvent] = useState(null)

  return (
    <div>
      <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink mb-6">Events</h1>

      {loading && <TableSkeleton columns={3} />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && events?.length === 0 && <Empty label="No events yet." />}

      {!loading && !error && events?.length > 0 && (
        <div className="bg-paper border border-hairline rounded-cards shadow-subtle overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-mid-gray">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-t border-hairline">
                  <td className="px-5 py-3 text-ink font-medium">{ev.name}</td>
                  <td className="px-5 py-3 text-mid-gray">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-mid-gray capitalize">{ev.type}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setQrEvent(ev)}
                      className="text-sm text-ink underline decoration-hairline underline-offset-2 hover:text-mid-gray"
                    >
                      Show check-in QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {qrEvent && <QrModal event={qrEvent} onClose={() => setQrEvent(null)} />}
    </div>
  )
}

function QrModal({ event, onClose }) {
  const canvasRef = useRef(null)
  const url = `${window.location.origin}/checkin/${event.checkinToken}`

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 220 })
    }
  }, [url])

  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-cards shadow-subtle p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-ink mb-4">{event.name}</h3>
        <canvas ref={canvasRef} className="mx-auto mb-4" />
        <p className="text-mid-gray text-xs break-all mb-4">{url}</p>
        <button
          type="button"
          onClick={onClose}
          className="bg-ink text-surface-alt text-sm font-medium px-4 py-2 rounded-buttons hover:bg-ink-soft transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
