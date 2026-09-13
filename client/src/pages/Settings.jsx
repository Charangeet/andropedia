import { useMemo, useState } from 'react'
import { useApi } from '../hooks/useApi'
import { getWeights, updateWeights } from '../api/settings'
import { Field, SubmitRow } from '../components/forms/FormControls'
import { ErrorMessage, Loading } from '../components/StatusMessage'

const FIELDS = [
  { key: 'attendance', label: 'Attendance' },
  { key: 'taskCompletion', label: 'Task Completion' },
  { key: 'workshopParticipation', label: 'Workshop Participation' },
  { key: 'contribution', label: 'Contribution' },
]

export default function Settings() {
  const { data: weights, loading, error, refetch } = useApi(getWeights, [])

  if (loading) return <Loading label="Loading settings..." />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />
  if (!weights) return null

  return <WeightsForm initial={weights} />
}

function WeightsForm({ initial }) {
  const [values, setValues] = useState({
    attendance: initial.attendance,
    taskCompletion: initial.taskCompletion,
    workshopParticipation: initial.workshopParticipation,
    contribution: initial.contribution,
  })
  const [state, setState] = useState({ status: 'idle' })

  const sum = useMemo(() => Object.values(values).reduce((a, b) => a + Number(b || 0), 0), [values])

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setState({ status: 'saving' })
    try {
      await updateWeights({
        attendance: Number(values.attendance),
        taskCompletion: Number(values.taskCompletion),
        workshopParticipation: Number(values.workshopParticipation),
        contribution: Number(values.contribution),
      })
      setState({ status: 'success' })
    } catch (err) {
      setState({ status: 'error', message: err?.response?.data?.error || err.message })
    }
  }

  return (
    <div>
      <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-ink mb-1">Engagement Weights</h1>
      <p className="text-mid-gray mb-8">
        Adjust how much each factor contributes to a member's engagement score. Values are normalized
        automatically, so they don't need to add up to exactly 1.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-paper border border-hairline rounded-cards shadow-subtle p-5 space-y-5 max-w-lg"
      >
        {FIELDS.map(({ key, label }) => {
          const normalized = sum > 0 ? Math.round((values[key] / sum) * 1000) / 10 : 0
          return (
            <Field key={key} label={`${label}: ${normalized}%`}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={values[key]}
                onChange={(e) => setField(key, e.target.value)}
                className="w-full accent-ink"
              />
            </Field>
          )
        })}

        <SubmitRow state={state} label="Save weights" />
      </form>
    </div>
  )
}
