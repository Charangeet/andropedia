const STYLES = {
  Active: 'bg-good-soft text-good',
  'At Risk': 'bg-warning-soft text-warning',
  Inactive: 'bg-critical-soft text-critical',
}

export default function ScoreBadge({ classification }) {
  const style = STYLES[classification] || 'bg-canvas text-mid-gray'
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-badges text-xs font-medium ${style}`}>
      {classification}
    </span>
  )
}
