import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { INK } from '../../lib/colors'

export default function EngagementTrendChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
        <h3 className="text-sm font-medium text-ink-soft mb-3">Engagement trend</h3>
        <p className="text-mid-gray text-sm py-8 text-center">Not enough history yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
      <h3 className="text-sm font-medium text-ink-soft mb-3">Engagement trend</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={INK.gridline} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: INK.muted }}
            axisLine={{ stroke: INK.baseline }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: INK.muted }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: INK.gridline }}
            formatter={(v) => [v, 'Avg engagement']}
          />
          <Line
            type="monotone"
            dataKey="avgEngagement"
            stroke={INK.secondary}
            strokeWidth={2}
            dot={{ r: 4, fill: INK.secondary, stroke: INK.surface, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
