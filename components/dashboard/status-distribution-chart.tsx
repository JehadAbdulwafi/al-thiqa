"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

type DataPoint = {
  status: string
  count: number
}

export function StatusDistributionChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">No data available</div>
    )
  }

  const formattedData = data.map((item) => ({
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : "Unknown",
    count: item.count || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="status" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Inquiries" />
      </BarChart>
    </ResponsiveContainer>
  )
}
