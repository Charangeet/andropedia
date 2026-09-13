import { useMemo, useState } from 'react'
import { Empty } from './StatusMessage'

const TYPE_STYLES = {
  Attendance: 'bg-blue-50 text-blue-700',
  Task: 'bg-violet-50 text-violet-700',
  Contribution: 'bg-emerald-50 text-emerald-700',
}

export default function Timeline({ items }) {
  const [type, setType] = useState('All')

  const types = useMemo(() => ['All', ...new Set(items.map((i) => i.type))], [items])

  const filtered = useMemo(() => {
    const list = type === 'All' ? items : items.filter((i) => i.type === type)
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [items, type])

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Activity Timeline</h2>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Empty label="No activity in this range." />
      ) : (
        <ol className="bg-white border rounded-lg divide-y">
          {filtered.map((item, i) => (
            <li key={i} className="px-4 py-3 flex items-center gap-3">
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  TYPE_STYLES[item.type] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.type}
              </span>
              <span className="flex-1 text-sm text-gray-800">{item.label}</span>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
