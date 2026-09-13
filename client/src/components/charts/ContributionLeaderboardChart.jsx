import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts'
import { INK } from '../../lib/colors'

export default function ContributionLeaderboardChart({ data }) {
  return (
    <div className="bg-paper border border-hairline rounded-cards shadow-subtle p-5">
      <h3 className="text-sm font-medium text-ink-soft mb-3">Top contributors</h3>
      {data.length === 0 ? (
        <p className="text-mid-gray text-sm">No contributions logged in this range.</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 32, left: 8, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke={INK.gridline} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fontSize: 12, fill: INK.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: INK.gridline }} />
            <Bar dataKey="totalImpact" name="Impact score" fill={INK.secondary} radius={[0, 4, 4, 0]} maxBarSize={20}>
              <LabelList dataKey="totalImpact" position="right" style={{ fontSize: 12, fill: INK.secondary }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
