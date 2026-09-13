import { useMemo, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { getSummary, getEngagementTrend, getAttendanceByEvent } from '../api/analytics'
import { listContributions } from '../api/contributions'
import { ErrorMessage } from '../components/StatusMessage'
import { StatCardsSkeleton, ChartSkeleton } from '../components/Skeleton'
import DateRangeFilter from '../components/DateRangeFilter'
import EngagementTrendChart from '../components/charts/EngagementTrendChart'
import AttendanceChart from '../components/charts/AttendanceChart'
import StatusSplitBar from '../components/charts/StatusSplitBar'
import ContributionLeaderboardChart from '../components/charts/ContributionLeaderboardChart'

export default function Dashboard() {
  const [range, setRange] = useState({ from: null, to: null })

  const {
    data: summary,
    error: summaryError,
    refetch: refetchSummary,
  } = useApi(() => getSummary(rangeParams(range)), [range.from, range.to])

  const { data: trend } = useApi(() => getEngagementTrend({ months: 6 }), [])

  const { data: attendance } = useApi(
    () => getAttendanceByEvent(rangeParams(range)),
    [range.from, range.to]
  )

  const { data: contributions } = useApi(() => listContributions(), [])

  const topContributors = useMemo(() => {
    if (!contributions) return []
    const from = range.from ? new Date(range.from) : null
    const to = range.to ? new Date(range.to) : null
    const totals = new Map()
    for (const c of contributions) {
      const date = new Date(c.date)
      if (from && date < from) continue
      if (to && date > to) continue
      const key = c.member.id
      const entry = totals.get(key) || { name: c.member.name, totalImpact: 0 }
      entry.totalImpact += c.impactScore
      totals.set(key, entry)
    }
    return [...totals.values()].sort((a, b) => b.totalImpact - a.totalImpact).slice(0, 5)
  }, [contributions, range])

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {summaryError && <ErrorMessage error={summaryError} onRetry={refetchSummary} />}

      <div className="mb-6">
        {summary ? (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Total Members" value={summary.totalMembers} />
            <Stat label="Avg Engagement" value={summary.avgEngagement} />
            <Stat label="Active" value={summary.active} />
            <Stat label="At Risk / Inactive" value={summary.atRisk + summary.inactive} />
          </dl>
        ) : (
          !summaryError && <StatCardsSkeleton />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trend ? <EngagementTrendChart data={trend} /> : <ChartSkeleton />}
        {attendance ? <AttendanceChart data={attendance} /> : <ChartSkeleton height={260} />}
        {summary ? (
          <StatusSplitBar active={summary.active} atRisk={summary.atRisk} inactive={summary.inactive} />
        ) : (
          <ChartSkeleton height={80} />
        )}
        {contributions ? (
          <ContributionLeaderboardChart data={topContributors} />
        ) : (
          <ChartSkeleton height={160} />
        )}
      </div>
    </div>
  )
}

function rangeParams(range) {
  const params = {}
  if (range.from) params.from = range.from
  if (range.to) params.to = range.to
  return params
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-2xl font-semibold mt-1">{value}</dd>
    </div>
  )
}
