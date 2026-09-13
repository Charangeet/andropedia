import { useState } from 'react'
import { createContribution } from '../../api/contributions'
import { Field, SubmitRow, MemberSelect } from './FormControls'

export default function ContributionForm({ members, onSaved }) {
  const [memberId, setMemberId] = useState('')
  const [description, setDescription] = useState('')
  const [impactScore, setImpactScore] = useState(5)
  const [state, setState] = useState({ status: 'idle' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!memberId || !description.trim()) return
    setState({ status: 'saving' })
    try {
      await createContribution({
        memberId: Number(memberId),
        description: description.trim(),
        impactScore: Number(impactScore),
      })
      setState({ status: 'success' })
      setDescription('')
      onSaved?.()
    } catch (err) {
      setState({ status: 'error', message: err?.response?.data?.error || err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper border border-hairline rounded-cards shadow-subtle p-5 space-y-4">
      <h2 className="font-semibold text-ink">Add Contribution</h2>

      <Field label="Member">
        <MemberSelect members={members} value={memberId} onChange={setMemberId} />
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          placeholder="What did they do?"
          className="w-full bg-canvas rounded-inputs px-2.5 py-2 text-sm text-ink placeholder:text-mid-gray focus:outline-none focus:ring-1 focus:ring-hairline"
        />
      </Field>

      <Field label={`Impact score: ${impactScore}`}>
        <input
          type="range"
          min="1"
          max="10"
          value={impactScore}
          onChange={(e) => setImpactScore(e.target.value)}
          className="w-full accent-ink"
        />
      </Field>

      <SubmitRow state={state} label="Add contribution" />
    </form>
  )
}
