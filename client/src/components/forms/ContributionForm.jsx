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
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 space-y-3">
      <h2 className="font-medium">Add Contribution</h2>

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
          className="w-full border rounded-md px-2 py-1.5 text-sm"
        />
      </Field>

      <Field label={`Impact score: ${impactScore}`}>
        <input
          type="range"
          min="1"
          max="10"
          value={impactScore}
          onChange={(e) => setImpactScore(e.target.value)}
          className="w-full"
        />
      </Field>

      <SubmitRow state={state} label="Add contribution" />
    </form>
  )
}
