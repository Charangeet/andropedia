import { useApi } from '../hooks/useApi'
import { listAuditLog } from '../api/auditLog'
import { ErrorMessage, Empty } from '../components/StatusMessage'
import { TableSkeleton } from '../components/Skeleton'

export default function AuditLog() {
  const { data: entries, loading, error, refetch } = useApi(() => listAuditLog({ limit: 100 }), [])

  return (
    <div>
      <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink mb-6">Audit Log</h1>

      {loading && <TableSkeleton columns={5} />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && entries?.length === 0 && <Empty label="No activity recorded yet." />}

      {!loading && !error && entries?.length > 0 && (
        <div className="bg-paper border border-hairline rounded-cards shadow-subtle overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-mid-gray">
              <tr>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Entity</th>
                <th className="px-5 py-3 font-medium">Summary</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-hairline">
                  <td className="px-5 py-3 text-mid-gray whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-ink capitalize">{e.actor}</td>
                  <td className="px-5 py-3 text-mid-gray capitalize">{e.action}</td>
                  <td className="px-5 py-3 text-mid-gray">{e.entityType}</td>
                  <td className="px-5 py-3 text-ink">{e.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
