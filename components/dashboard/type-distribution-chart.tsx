"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"

type DataPoint = {
  type: string
  count: number
}

const COLORS = {
  Buy: "hsl(var(--primary))",
  Rent: "hsl(var(--chart-2))",
}

export function TypeDistributionChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">No data available</div>
    )
  }

  const formattedData = data.map((item) => ({
    name: item.type,
    value: item.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="hsl(var(--primary))"
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "hsl(var(--muted))"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
