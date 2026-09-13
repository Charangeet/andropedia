function Bar({ className = '', style }) {
  return <div className={`bg-canvas rounded-small animate-pulse ${className}`} style={style} />
}

export function StatCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Bar className="h-2.5 w-20" />
          <Bar className="h-8 w-14 mt-3" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 240 }) {
  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
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
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle overflow-hidden">
      <div className="bg-surface-alt px-5 py-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Bar key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-t border-hairline px-5 py-3.5 flex gap-4">
          {Array.from({ length: columns }).map((_, c) => (
            <Bar key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
