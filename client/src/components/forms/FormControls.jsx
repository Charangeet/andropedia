export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-mid-gray mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export function SubmitRow({ state, label }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button
        type="submit"
        disabled={state.status === 'saving'}
        className="bg-ink text-surface-alt text-sm font-medium px-4 py-2 rounded-buttons disabled:opacity-50 hover:bg-ink-soft transition-colors"
      >
        {state.status === 'saving' ? 'Saving...' : label}
      </button>
      {state.status === 'success' && <span className="text-sm text-good">Saved.</span>}
      {state.status === 'error' && <span className="text-sm text-ember">{state.message}</span>}
    </div>
  )
}

const selectClass =
  'w-full bg-canvas rounded-inputs px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-hairline'

export function MemberSelect({ members, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required className={selectClass}>
      <option value="">Select a member...</option>
      {members.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  )
}

export { selectClass }
