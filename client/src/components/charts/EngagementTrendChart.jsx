import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { CATEGORICAL, INK } from '../../lib/colors'

export default function EngagementTrendChart({ data }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Engagement trend</h3>
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
            stroke={CATEGORICAL.blue}
            strokeWidth={2}
            dot={{ r: 4, fill: CATEGORICAL.blue, stroke: INK.surface, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
