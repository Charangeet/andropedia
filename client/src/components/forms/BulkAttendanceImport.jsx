import { useState } from 'react'
import { bulkImportAttendance } from '../../api/attendance'
import { Field, SubmitRow, selectClass } from './FormControls'

export default function BulkAttendanceImport({ events, onSaved }) {
  const [eventId, setEventId] = useState('')
  const [fileName, setFileName] = useState('')
  const [csvText, setCsvText] = useState('')
  const [state, setState] = useState({ status: 'idle' })
  const [result, setResult] = useState(null)

  const rowCount = csvText ? Math.max(csvText.trim().split('\n').length - 1, 0) : 0

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setCsvText(String(reader.result || ''))
    reader.readAsText(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!eventId || !csvText) return
    setState({ status: 'saving' })
    setResult(null)
    try {
      const data = await bulkImportAttendance({ eventId: Number(eventId), csvText })
      setResult(data)
      setState({ status: 'success' })
      onSaved?.()
    } catch (err) {
      setState({ status: 'error', message: err?.response?.data?.error || err.message })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper border border-hairline rounded-cards shadow-subtle p-5 space-y-4"
    >
      <h2 className="font-semibold text-ink">Bulk Import Attendance</h2>
      <p className="text-mid-gray text-sm">
        Upload a CSV with <code>email,status</code> columns to log attendance for many members at once.
      </p>

      <Field label="Event">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} required className={selectClass}>
          <option value="">Select an event...</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({new Date(ev.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </Field>

      <Field label="CSV file">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          required
          className="w-full text-sm text-ink file:mr-3 file:rounded-buttons file:border-0 file:bg-canvas file:px-3 file:py-1.5 file:text-sm file:text-ink"
        />
        {fileName && (
          <p className="text-mid-gray text-xs mt-1.5">
            {fileName} — {rowCount} row{rowCount === 1 ? '' : 's'}
          </p>
        )}
      </Field>

      <SubmitRow state={state} label="Import" />

      {result && (
        <p className="text-sm text-mid-gray">
          Imported {result.imported}.
          {result.skipped.length > 0 && ` Skipped ${result.skipped.length}: ${result.skipped
            .map((s) => `${s.email} (${s.reason})`)
            .join(', ')}`}
        </p>
      )}
    </form>
  )
}
