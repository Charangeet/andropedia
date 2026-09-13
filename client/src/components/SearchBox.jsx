import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { search } from '../api/search'

export default function SearchBox() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(() => {
      search(q).then(setResults).catch(() => setResults(null))
    }, 250)
    return () => clearTimeout(timer)
  }, [q])

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const hasResults =
    results && (results.members.length + results.events.length + results.projects.length > 0)

  function go(type, id) {
    setOpen(false)
    setQ('')
    if (type === 'member') navigate(`/members/${id}`)
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search..."
        className="bg-canvas rounded-inputs px-3 py-1.5 text-sm text-ink placeholder:text-mid-gray w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-hairline"
      />
      {open && results && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-paper border border-hairline rounded-cards shadow-subtle p-2 z-50">
          {!hasResults && <p className="text-mid-gray text-sm px-2 py-3">No matches.</p>}
          <ResultGroup label="Members" items={results.members} onSelect={(id) => go('member', id)} />
          <ResultGroup label="Events" items={results.events} onSelect={() => setOpen(false)} />
          <ResultGroup label="Projects" items={results.projects} onSelect={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

function ResultGroup({ label, items, onSelect }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-xs uppercase tracking-[0.03em] text-mid-gray px-2 py-1">{label}</p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className="w-full text-left px-2 py-1.5 rounded-nested text-sm text-ink hover:bg-canvas transition-colors truncate"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
