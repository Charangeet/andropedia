import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from 'recharts'
import { INK } from '../../lib/colors'

export default function TrendSparkline({ data }) {
  if (!data || data.length < 2) {
    return <div className="h-12 w-32 flex items-center text-mid-gray text-xs">Not enough history</div>
  }

  return (
    <div className="h-12 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: INK.gridline }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.month}
            formatter={(v) => [v, 'Score']}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke={INK.secondary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
