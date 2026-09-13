import { Link } from 'react-router-dom'
import ScoreBadge from './ScoreBadge'

export default function WatchlistCard({ data }) {
  const worsening = data?.worsening || []
  const missedRecent = data?.missedRecent || []

  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
      <h3 className="text-sm font-medium text-ink-soft mb-3">Watchlist</h3>

      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.03em] text-mid-gray mb-2">Trending down</p>
        {worsening.length === 0 ? (
          <p className="text-mid-gray text-sm">No one has slipped recently.</p>
        ) : (
          <ul className="space-y-2">
            {worsening.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <Link to={`/members/${m.id}`} className="text-ink hover:text-mid-gray truncate">
                  {m.name}
                </Link>
                <ScoreBadge classification={m.currentClassification} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.03em] text-mid-gray mb-2">Missed recent events</p>
        {missedRecent.length === 0 ? (
          <p className="text-mid-gray text-sm">Everyone showed up recently.</p>
        ) : (
          <ul className="space-y-2">
            {missedRecent.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <Link to={`/members/${m.id}`} className="text-ink hover:text-mid-gray truncate">
                  {m.name}
                </Link>
                <span className="text-mid-gray text-xs">
                  missed last {m.missedCount} event{m.missedCount === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
