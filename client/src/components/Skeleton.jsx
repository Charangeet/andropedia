function Bar({ className = '', style }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} style={style} />
}

export function StatCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-4">
          <Bar className="h-3 w-20" />
          <Bar className="h-7 w-12 mt-2" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 240 }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <Bar className="h-3 w-32 mb-4" />
      <div className="flex items-end gap-2" style={{ height }}>
        {[60, 85, 45, 95, 70, 55, 80].map((h, i) => (
          <Bar key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 6, columns = 4 }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2.5 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Bar key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-t px-4 py-3 flex gap-4">
          {Array.from({ length: columns }).map((_, c) => (
            <Bar key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
