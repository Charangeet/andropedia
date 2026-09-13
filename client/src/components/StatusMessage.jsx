export function Loading({ label = 'Loading...' }) {
  return <p className="text-gray-500 py-8 text-center">{label}</p>
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="text-center py-8">
      <p className="text-red-600">
        {error?.response?.data?.error || error?.message || 'Something went wrong.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm text-blue-600 underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function Empty({ label = 'Nothing here yet.' }) {
  return <p className="text-gray-400 py-8 text-center">{label}</p>
}
