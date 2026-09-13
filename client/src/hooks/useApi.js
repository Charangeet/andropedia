import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs an async fetcher on mount (and whenever deps change), exposing
 * { data, loading, error, refetch } so pages don't each hand-roll this.
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(() => {
    setLoading(true)
    setError(null)
    fetcherRef
      .current()
      .then((result) => setData(result))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, refetch: run }
}
