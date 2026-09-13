import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getLeaderboard } from '../api/members'
import { ErrorMessage, Empty, FirstRun } from '../components/StatusMessage'
import { TableSkeleton } from '../components/Skeleton'
import ScoreBadge from '../components/ScoreBadge'
import { exportUrl } from '../lib/exportUrl'

export default function Members() {
  const { data: members, loading, error, refetch } = useApi(getLeaderboard, [])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!members) return []
    const q = search.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    )
  }, [members, search])

  if (!loading && !error && members?.length === 0) {
    return (
      <FirstRun
        title="No members yet"
        description="Add your club's first member to start tracking engagement."
        actionLabel="Go to Data Entry"
        actionTo="/data-entry"
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink">Members</h1>
        <div className="flex items-center gap-4">
          <a
            href={exportUrl('/members/leaderboard?format=csv')}
            className="text-sm text-ink underline decoration-hairline underline-offset-2 hover:text-mid-gray whitespace-nowrap"
          >
            Export CSV
          </a>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-canvas rounded-inputs px-3 py-2 text-sm text-ink placeholder:text-mid-gray w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-hairline"
          />
        </div>
      </div>

      {loading && <TableSkeleton columns={4} />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && filtered.length === 0 && <Empty label={`No members match "${search}".`} />}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-paper border border-hairline rounded-cards shadow-subtle overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-mid-gray">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Email</th>
                <th className="px-5 py-3 font-medium">Score</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-hairline hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/members/${m.id}`} className="text-ink font-medium hover:text-mid-gray">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-mid-gray hidden sm:table-cell">{m.email}</td>
                  <td className="px-5 py-3 text-ink tabular-nums">{m.score}</td>
                  <td className="px-5 py-3">
                    <ScoreBadge classification={m.classification} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
