const STYLES = {
  Active: 'bg-green-100 text-green-700',
  'At Risk': 'bg-amber-100 text-amber-700',
  Inactive: 'bg-red-100 text-red-700',
}

export default function ScoreBadge({ classification }) {
  const style = STYLES[classification] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {classification}
    </span>
  )
}
