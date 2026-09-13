import { useMemo, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { getSummary, getEngagementTrend, getAttendanceByEvent, getWatchlist } from '../api/analytics'
import { listContributions } from '../api/contributions'
import { ErrorMessage, FirstRun } from '../components/StatusMessage'
import { StatCardsSkeleton, ChartSkeleton } from '../components/Skeleton'
import DateRangeFilter from '../components/DateRangeFilter'
import EngagementTrendChart from '../components/charts/EngagementTrendChart'
import AttendanceChart from '../components/charts/AttendanceChart'
import StatusSplitBar from '../components/charts/StatusSplitBar'
import ContributionLeaderboardChart from '../components/charts/ContributionLeaderboardChart'
import WatchlistCard from '../components/WatchlistCard'

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
  const { data: watchlist } = useApi(getWatchlist, [])

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

  if (summary && summary.totalMembers === 0) {
    return (
      <FirstRun
        title="No club data yet"
        description="Add your first members, events, and activity to see engagement analytics here."
        actionLabel="Go to Data Entry"
        actionTo="/data-entry"
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink">Dashboard</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {summaryError && <ErrorMessage error={summaryError} onRetry={refetchSummary} />}

      <div className="mb-8">
        {summary ? (
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Stat label="Total Members" value={summary.totalMembers} />
            <Stat label="Avg Engagement" value={summary.avgEngagement} />
            <Stat label="Active" value={summary.active} tone="good" />
            <Stat label="At Risk / Inactive" value={summary.atRisk + summary.inactive} tone="warning" />
          </dl>
        ) : (
          !summaryError && <StatCardsSkeleton />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        {watchlist ? <WatchlistCard data={watchlist} /> : <ChartSkeleton height={160} />}
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

const TONE_COLOR = { good: 'text-good', warning: 'text-warning' }

function Stat({ label, value, tone }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.03em] text-mid-gray">{label}</dt>
      <dd className={`text-[36px] font-semibold tracking-[-0.02em] mt-1 ${tone ? TONE_COLOR[tone] : 'text-ink'}`}>
        {value}
      </dd>
    </div>
  )
}
