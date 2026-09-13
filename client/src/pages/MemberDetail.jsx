import { useParams, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getMember, getMemberScore } from '../api/members'
import { Loading, ErrorMessage, Empty } from '../components/StatusMessage'
import ScoreBadge from '../components/ScoreBadge'

export default function MemberDetail() {
  const { id } = useParams()
  const { data: member, loading, error, refetch } = useApi(() => getMember(id), [id])
  const { data: score } = useApi(() => getMemberScore(id), [id])

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

      <Section title="Attendance">
        {member.attendance.length === 0 ? (
          <Empty label="No attendance records." />
        ) : (
          <SimpleTable
            columns={['Event', 'Status', 'Date']}
            rows={member.attendance.map((a) => [
              a.event.name,
              a.status,
              new Date(a.date).toLocaleDateString(),
            ])}
          />
        )}
      </Section>

      <Section title="Tasks">
        {member.tasks.length === 0 ? (
          <Empty label="No tasks." />
        ) : (
          <SimpleTable
            columns={['Title', 'Status', 'Due Date']}
            rows={member.tasks.map((t) => [
              t.title,
              t.status,
              t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-',
            ])}
          />
        )}
      </Section>

      <Section title="Contributions">
        {member.contributions.length === 0 ? (
          <Empty label="No contributions logged." />
        ) : (
          <SimpleTable
            columns={['Description', 'Impact', 'Date']}
            rows={member.contributions.map((c) => [
              c.description,
              c.impactScore,
              new Date(c.date).toLocaleDateString(),
            ])}
          />
        )}
      </Section>
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

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      {children}
    </div>
  )
}

function SimpleTable({ columns, rows }) {
  return (
    <div className="bg-white border rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
