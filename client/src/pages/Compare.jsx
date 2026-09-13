import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { getCompare } from '../api/analytics'
import { ErrorMessage } from '../components/StatusMessage'
import { StatCardsSkeleton, TableSkeleton } from '../components/Skeleton'
import DateRangeFilter from '../components/DateRangeFilter'

function monthsAgoISO(months) {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}
function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Compare() {
  const [rangeA, setRangeA] = useState({ from: monthsAgoISO(6), to: monthsAgoISO(3) })
  const [rangeB, setRangeB] = useState({ from: monthsAgoISO(3), to: todayISO() })

  const params = {
    fromA: rangeA.from,
    toA: rangeA.to,
    fromB: rangeB.from,
    toB: rangeB.to,
  }

  const { data, loading, error, refetch } = useApi(
    () => getCompare(params),
    [rangeA.from, rangeA.to, rangeB.from, rangeB.to]
  )

  return (
    <div>
      <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink mb-6">Compare Periods</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.03em] text-mid-gray mb-2">Period A</p>
          <DateRangeFilter value={rangeA} onChange={setRangeA} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.03em] text-mid-gray mb-2">Period B</p>
          <DateRangeFilter value={rangeB} onChange={setRangeB} />
        </div>
      </div>

      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {loading && (
        <>
          <StatCardsSkeleton />
          <div className="mt-6">
            <TableSkeleton columns={4} />
          </div>
        </>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <WindowSummary label="Period A" summary={data.windowA} />
            <WindowSummary label="Period B" summary={data.windowB} />
          </div>

          <div className="bg-paper border border-hairline rounded-cards shadow-subtle overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt text-left text-mid-gray">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">A</th>
                  <th className="px-5 py-3 font-medium">B</th>
                  <th className="px-5 py-3 font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {data.members.map((m) => (
                  <tr key={m.id} className="border-t border-hairline">
                    <td className="px-5 py-3 text-ink font-medium">{m.name}</td>
                    <td className="px-5 py-3 text-mid-gray tabular-nums">{m.scoreA}</td>
                    <td className="px-5 py-3 text-mid-gray tabular-nums">{m.scoreB}</td>
                    <td
                      className={`px-5 py-3 tabular-nums font-medium ${
                        m.delta > 0 ? 'text-good' : m.delta < 0 ? 'text-critical' : 'text-mid-gray'
                      }`}
                    >
                      {m.delta > 0 ? '+' : ''}
                      {m.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function WindowSummary({ label, summary }) {
  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
      <h3 className="text-sm font-medium text-ink-soft mb-3">{label}</h3>
      <dl className="grid grid-cols-2 gap-4">
        <Stat label="Avg Engagement" value={summary.avgEngagement} />
        <Stat label="Active" value={summary.active} />
        <Stat label="At Risk" value={summary.atRisk} />
        <Stat label="Inactive" value={summary.inactive} />
      </dl>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.03em] text-mid-gray">{label}</dt>
      <dd className="text-[20px] font-semibold tracking-[-0.015em] text-ink mt-1">{value}</dd>
    </div>
  )
}
