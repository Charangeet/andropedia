export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-600 mb-1">{label}</span>
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
        className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-md disabled:opacity-50"
      >
        {state.status === 'saving' ? 'Saving...' : label}
      </button>
      {state.status === 'success' && <span className="text-sm text-green-600">Saved.</span>}
      {state.status === 'error' && <span className="text-sm text-red-600">{state.message}</span>}
    </div>
  )
}

export function MemberSelect({ members, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full border rounded-md px-2 py-1.5 text-sm"
    >
      <option value="">Select a member...</option>
      {members.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  )
}
