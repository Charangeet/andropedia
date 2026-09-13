import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { listTasks, updateTask } from '../../api/tasks'
import { Loading, ErrorMessage, Empty } from '../StatusMessage'

export default function TaskCompletionList({ onSaved }) {
  const { data: tasks, loading, error, refetch } = useApi(() => listTasks(), [])
  const [pendingId, setPendingId] = useState(null)

  const open = (tasks || []).filter((t) => t.status !== 'done')

  async function markDone(id) {
    setPendingId(id)
    try {
      await updateTask(id, { status: 'done' })
      refetch()
      onSaved?.()
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
      <h2 className="font-semibold text-ink mb-3">Mark Tasks Complete</h2>

      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && open.length === 0 && <Empty label="All tasks are complete." />}

      {open.length > 0 && (
        <div className="max-h-80 overflow-y-auto -mx-5">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-mid-gray sticky top-0">
              <tr>
                <th className="px-5 py-2 font-medium">Task</th>
                <th className="px-5 py-2 font-medium">Member</th>
                <th className="px-5 py-2 font-medium">Due</th>
                <th className="px-5 py-2" />
              </tr>
            </thead>
            <tbody>
              {open.map((t) => (
                <tr key={t.id} className="border-t border-hairline">
                  <td className="px-5 py-2.5 text-ink">{t.title}</td>
                  <td className="px-5 py-2.5 text-mid-gray">{t.member.name}</td>
                  <td className="px-5 py-2.5 text-mid-gray">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => markDone(t.id)}
                      disabled={pendingId === t.id}
                      className="text-sm text-ink border border-hairline rounded-buttons px-3 py-1 hover:bg-canvas disabled:opacity-50 transition-colors"
                    >
                      {pendingId === t.id ? 'Saving...' : 'Mark done'}
                    </button>
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
