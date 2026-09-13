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
