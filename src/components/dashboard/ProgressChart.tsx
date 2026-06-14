'use client'

import type {
  TooltipProps} from 'recharts';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { EmptyState } from '../shared/EmptyState'

interface HistoryRecord {
  date: string // format e.g. "Jan", "Feb" or "2026-06"
  total: number
}

interface ProgressChartProps {
  history: HistoryRecord[]
}

export function ProgressChart({ history }: ProgressChartProps) {
  if (history.length === 0) {
    return (
      <div className="bg-card border border-border p-6 rounded-3xl h-[340px] flex items-center justify-center glassmorphism">
        <EmptyState
          title="No History Yet"
          description="Take the carbon footprint questionnaire to log your first data point."
        />
      </div>
    )
  }

  // Sort history chronologically if needed, and map labels
  const data = history.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('default', {
      month: 'short',
      year: '2-digit',
    }),
  }))

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<number, string>) => {
    if (active && payload?.length) {
      const value = payload[0]?.value
      return (
        <div className="bg-card border border-border p-3 rounded-xl shadow-lg text-xs leading-none">
          <span className="font-semibold text-muted-foreground block mb-1.5">
            {payload[0]?.payload.formattedDate}
          </span>
          <span className="font-bold text-primary">
            {value ? Number(value).toFixed(1) : 0} t CO₂e
          </span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glassmorphism flex flex-col justify-between h-[340px]">
      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Footprint Over Time
        </h3>
        <p className="text-xs text-muted-foreground">
          Historical reduction trend of your annual carbon footprint.
        </p>
      </div>

      <div className="flex-1 w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(128,128,128,0.6)', fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(128,128,128,0.6)', fontSize: 10, fontWeight: 600 }}
              unit="t"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
