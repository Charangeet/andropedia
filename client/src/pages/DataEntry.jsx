import { useApi } from '../hooks/useApi'
import { listMembers } from '../api/members'
import { listEvents } from '../api/events'
import { ErrorMessage } from '../components/StatusMessage'
import { ChartSkeleton, TableSkeleton } from '../components/Skeleton'
import AttendanceForm from '../components/forms/AttendanceForm'
import ContributionForm from '../components/forms/ContributionForm'
import TaskCompletionList from '../components/forms/TaskCompletionList'

export default function DataEntry() {
  const { data: members, loading: membersLoading, error: membersError, refetch } = useApi(
    () => listMembers(),
    []
  )
  const { data: events, loading: eventsLoading } = useApi(() => listEvents(), [])

  if (membersLoading || eventsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton height={140} />
        <ChartSkeleton height={140} />
        <div className="lg:col-span-2">
          <TableSkeleton columns={4} />
        </div>
      </div>
    )
  }
  if (membersError) return <ErrorMessage error={membersError} onRetry={refetch} />

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Data Entry</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Log club activity here — it feeds straight into engagement scores.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceForm members={members || []} events={events || []} />
        <ContributionForm members={members || []} />
        <div className="lg:col-span-2">
          <TaskCompletionList />
        </div>
      </div>
    </div>
  )
}
