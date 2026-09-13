import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getMember, getMemberScore } from '../api/members'
import { ErrorMessage } from '../components/StatusMessage'
import { StatCardsSkeleton, TableSkeleton } from '../components/Skeleton'
import ScoreBadge from '../components/ScoreBadge'
import Timeline from '../components/Timeline'

export default function MemberDetail() {
  const { id } = useParams()
  const { data: member, loading, error, refetch } = useApi(() => getMember(id), [id])
  const { data: score } = useApi(() => getMemberScore(id), [id])

  const timelineItems = useMemo(() => {
    if (!member) return []
    const attendance = member.attendance.map((a) => ({
      date: a.date,
      type: 'Attendance',
      label: `${a.status === 'present' ? 'Attended' : 'Missed'} ${a.event.name}`,
    }))
    const tasks = member.tasks.map((t) => ({
      date: t.completedDate || t.dueDate || t.id,
      type: 'Task',
      label: `${t.title} — ${t.status.replace('_', ' ')}`,
    }))
    const contributions = member.contributions.map((c) => ({
      date: c.date,
      type: 'Contribution',
      label: `${c.description} (impact ${c.impactScore})`,
    }))
    return [...attendance, ...tasks, ...contributions]
  }, [member])

  if (loading) {
    return (
      <div>
        <StatCardsSkeleton />
        <div className="mt-6">
          <TableSkeleton columns={3} />
        </div>
      </div>
    )
  }
  if (error) return <ErrorMessage error={error} onRetry={refetch} />
  if (!member) return null

  return (
    <div>
      <Link to="/members" className="text-sm text-mid-gray hover:text-ink">
        &larr; Back to Members
      </Link>

      <div className="flex items-start justify-between mt-3 mb-8 gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink break-words">
            {member.name}
          </h1>
          <p className="text-mid-gray break-all">{member.email}</p>
        </div>
        {score && (
          <div className="text-right shrink-0">
            <div className="text-[48px] leading-none font-semibold tracking-[-0.03em] text-ink">
              {score.score}
            </div>
            <div className="mt-2">
              <ScoreBadge classification={score.classification} />
            </div>
          </div>
        )}
      </div>

      {score && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          <Metric label="Attendance Rate" value={`${score.breakdown.attendanceRate}%`} />
          <Metric label="Task Completion" value={`${score.breakdown.taskCompletionRate}%`} />
          <Metric label="Workshop Participation" value={`${score.breakdown.workshopParticipationRate}%`} />
          <Metric label="Contributions" value={score.breakdown.contributionCount} />
        </div>
      )}

      <Timeline items={timelineItems} />
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.03em] text-mid-gray">{label}</dt>
      <dd className="text-[24px] font-semibold tracking-[-0.015em] text-ink mt-1">{value}</dd>
    </div>
  )
}
