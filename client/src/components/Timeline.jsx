import { useMemo, useState } from 'react'
import { Empty } from './StatusMessage'

export default function Timeline({ items }) {
  const [type, setType] = useState('All')

  const types = useMemo(() => ['All', ...new Set(items.map((i) => i.type))], [items])

  const filtered = useMemo(() => {
    const list = type === 'All' ? items : items.filter((i) => i.type === type)
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [items, type])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-semibold text-ink">Activity Timeline</h2>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-canvas rounded-inputs px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-hairline"
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
        <ol className="bg-paper border border-hairline rounded-cards shadow-subtle divide-y divide-hairline overflow-hidden">
          {filtered.map((item, i) => (
            <li key={i} className="px-5 py-3.5 flex items-center gap-3">
              <span className="shrink-0 px-2 py-0.5 rounded-badges text-xs font-medium bg-canvas text-ink-soft">
                {item.type}
              </span>
              <span className="flex-1 text-sm text-ink">{item.label}</span>
              <span className="text-xs text-mid-gray shrink-0">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
