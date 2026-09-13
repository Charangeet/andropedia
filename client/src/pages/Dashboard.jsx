import { useApi } from '../hooks/useApi'
import { getSummary } from '../api/analytics'
import { Loading, ErrorMessage } from '../components/StatusMessage'

export default function Dashboard() {
  const { data: summary, loading, error, refetch } = useApi(getSummary, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {summary && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Total Members" value={summary.totalMembers} />
          <Stat label="Avg Engagement" value={summary.avgEngagement} />
          <Stat label="Active" value={summary.active} />
          <Stat label="At Risk / Inactive" value={summary.atRisk + summary.inactive} />
        </dl>
      )}
      <p className="text-sm text-gray-400 mt-6">Charts and trends land in Phase 3.</p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-2xl font-semibold mt-1">{value}</dd>
    </div>
  )
}
