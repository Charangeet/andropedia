import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getLeaderboard } from '../api/members'
import { Loading, ErrorMessage, Empty } from '../components/StatusMessage'
import ScoreBadge from '../components/ScoreBadge'

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Members</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm w-64"
        />
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && filtered.length === 0 && <Empty label="No members found." />}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link to={`/members/${m.id}`} className="text-blue-600 hover:underline">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{m.email}</td>
                  <td className="px-4 py-2">{m.score}</td>
                  <td className="px-4 py-2">
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
