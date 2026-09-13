import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { CATEGORICAL, INK } from '../../lib/colors'

function truncate(str, n = 14) {
  return str.length > n ? `${str.slice(0, n - 1)}…` : str
}

export default function AttendanceChart({ data }) {
  const chartData = data.map((e) => ({ ...e, shortName: truncate(e.name) }))

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Attendance by event</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barGap={2}>
          <CartesianGrid vertical={false} stroke={INK.gridline} />
          <XAxis
            dataKey="shortName"
            tick={{ fontSize: 11, fill: INK.muted }}
            axisLine={{ stroke: INK.baseline }}
            tickLine={false}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12, fill: INK.muted }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 8, borderColor: INK.gridline }}
            labelFormatter={(_label, payload) => payload?.[0]?.payload?.name}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="present" name="Present" fill={CATEGORICAL.blue} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="absent" name="Absent" fill={CATEGORICAL.orange} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
