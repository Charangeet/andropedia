import { useState } from 'react'

const PRESETS = [
  { label: 'All time', months: null },
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Custom', months: 'custom' },
]

function monthsAgoISO(months) {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

export default function DateRangeFilter({ value, onChange }) {
  const [preset, setPreset] = useState('All time')

  function selectPreset(p) {
    setPreset(p.label)
    if (p.months === null) {
      onChange({ from: null, to: null })
    } else if (p.months === 'custom') {
      onChange({ from: value.from || monthsAgoISO(1), to: value.to || todayISO() })
    } else {
      onChange({ from: monthsAgoISO(p.months), to: todayISO() })
    }
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRESETS.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => selectPreset(p)}
          className={`px-3 py-1.5 rounded-md text-sm border ${
            preset === p.label
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {p.label}
        </button>
      ))}
      {preset === 'Custom' && (
        <div className="flex items-center gap-2 text-sm">
          <input
            type="date"
            value={value.from || ''}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            className="border rounded-md px-2 py-1"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={value.to || ''}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            className="border rounded-md px-2 py-1"
          />
        </div>
      )}
    </div>
  )
}
