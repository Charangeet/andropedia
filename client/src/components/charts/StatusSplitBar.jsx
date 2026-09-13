import { STATUS } from '../../lib/colors'

const SEGMENTS = [
  { key: 'active', label: 'Active', color: STATUS.good },
  { key: 'atRisk', label: 'At Risk', color: STATUS.warning },
  { key: 'inactive', label: 'Inactive', color: STATUS.critical },
]

export default function StatusSplitBar({ active, atRisk, inactive }) {
  const total = active + atRisk + inactive
  const values = { active, atRisk, inactive }

  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
      <h3 className="text-sm font-medium text-ink-soft mb-3">Active vs at-risk vs inactive</h3>

      {total === 0 ? (
        <p className="text-mid-gray text-sm">No members yet.</p>
      ) : (
        <>
          <div className="flex h-6 w-full rounded-small overflow-hidden gap-[2px] bg-canvas">
            {SEGMENTS.map((s) => {
              const pct = (values[s.key] / total) * 100
              if (pct === 0) return null
              return (
                <div
                  key={s.key}
                  style={{ width: `${pct}%`, backgroundColor: s.color }}
                  title={`${s.label}: ${values[s.key]}`}
                />
              )
            })}
          </div>

          <div className="flex gap-6 mt-4 flex-wrap">
            {SEGMENTS.map((s) => (
              <div key={s.key} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-mid-gray">{s.label}</span>
                <span className="font-medium text-ink">{values[s.key]}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
