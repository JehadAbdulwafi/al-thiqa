import { Card, CardContent } from "@/components/ui/card"
import { Package, FolderOpen, TrendingUp, Eye } from "lucide-react"

const stats = [
  {
    name: "إجمالي المنتجات",
    value: "186",
    change: "+12",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    name: "المجموعات",
    value: "6",
    change: "+1",
    changeType: "positive" as const,
    icon: FolderOpen,
  },
  {
    name: "مقالات المدونة",
    value: "24",
    change: "+3",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    name: "الزوار هذا الشهر",
    value: "12,543",
    change: "+18%",
    changeType: "positive" as const,
    icon: Eye,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
