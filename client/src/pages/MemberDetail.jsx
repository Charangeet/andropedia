import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getMember, getMemberScore } from '../api/members'
import { Loading, ErrorMessage } from '../components/StatusMessage'
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

  if (loading) return <Loading />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />
  if (!member) return null

  return (
    <div>
      <Link to="/members" className="text-sm text-blue-600 hover:underline">
        &larr; Back to Members
      </Link>

      <div className="flex items-center justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{member.name}</h1>
          <p className="text-gray-500">{member.email}</p>
        </div>
        {score && (
          <div className="text-right">
            <div className="text-3xl font-semibold">{score.score}</div>
            <ScoreBadge classification={score.classification} />
          </div>
        )}
      </div>

      {score && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
    <div className="bg-white border rounded-lg p-4">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-xl font-semibold mt-1">{value}</dd>
    </div>
  )
}
