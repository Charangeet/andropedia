import { Link } from 'react-router-dom'

export function Loading({ label = 'Loading...' }) {
  return <p className="text-mid-gray py-8 text-center text-sm">{label}</p>
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="text-center py-8">
      <p className="text-ember text-sm">
        {error?.response?.data?.error || error?.message || 'Something went wrong.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm text-ink underline decoration-hairline underline-offset-2 hover:text-mid-gray"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function Empty({ label = 'Nothing here yet.' }) {
  return <p className="text-mid-gray py-8 text-center text-sm">{label}</p>
}

export function FirstRun({ title, description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink mb-2">{title}</h2>
      {description && <p className="text-mid-gray max-w-sm mb-6">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="bg-ink text-surface-alt text-sm font-medium px-4 py-2 rounded-buttons hover:bg-ink-soft transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
