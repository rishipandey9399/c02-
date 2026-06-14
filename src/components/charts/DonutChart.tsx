'use client'

import type { TooltipProps } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CATEGORY_METADATA } from '@/lib/carbon/categories'

interface DonutChartProps {
  data: {
    transport: number
    diet: number
    energy: number
    flights: number
    goods: number
  }
}

export function DonutChart({ data }: DonutChartProps) {
  const chartData = [
    {
      name: CATEGORY_METADATA.transport.label,
      value: data.transport,
      color: CATEGORY_METADATA.transport.color,
    },
    {
      name: CATEGORY_METADATA.diet.label,
      value: data.diet,
      color: CATEGORY_METADATA.diet.color,
    },
    {
      name: CATEGORY_METADATA.energy.label,
      value: data.energy,
      color: CATEGORY_METADATA.energy.color,
    },
    {
      name: CATEGORY_METADATA.flights.label,
      value: data.flights,
      color: CATEGORY_METADATA.flights.color,
    },
    {
      name: CATEGORY_METADATA.goods.label,
      value: data.goods,
      color: CATEGORY_METADATA.goods.color,
    },
  ].filter((item) => item.value > 0)

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0)

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<number, string>) => {
    if (active && payload?.length) {
      const item = payload[0]!
      const percent = (((item.value!) / total) * 100).toFixed(1)
      return (
        <div className="bg-card border border-border p-3 rounded-xl shadow-lg text-xs leading-none">
          <span className="font-semibold text-foreground block mb-1.5">{item.name}</span>
          <span className="flex items-center gap-1.5 font-bold" style={{ color: item.payload?.color as string }}>
            {(item.value!).toFixed(1)} t CO₂e ({percent}%)
          </span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="relative w-full h-[280px]" role="img" aria-label="Donut chart showing carbon emissions breakdown by category">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Screen Reader accessible data fallback */}
      <div className="sr-only">
        <table>
          <caption>Carbon footprint category breakdown table</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Emissions (t CO₂e/yr)</th>
              <th scope="col">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.value.toFixed(1)}t</td>
                <td>{total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
