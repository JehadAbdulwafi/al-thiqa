import { Card, CardContent } from "@/components/ui/card"
import { Package, FolderOpen, FileText, Users, Eye } from "lucide-react"

interface StatCard {
  name: string
  value: string
  change: number
  icon: React.ElementType<{ className?: string }>
}

interface StatsCardsProps {
  stats: {
    products: { count: number; change: number }
    collections: { count: number; change: number }
    blogPosts: { count: number; change: number }
    users: { count: number; change: number }
    views: { count: number; change: number }
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      name: "إجمالي المنتجات",
      value: stats.products.count.toLocaleString(),
      change: stats.products.change,
      icon: Package,
    },
    {
      name: "المجموعات",
      value: stats.collections.count.toLocaleString(),
      change: stats.collections.change,
      icon: FolderOpen,
    },
    {
      name: "مقالات المدونة",
      value: stats.blogPosts.count.toLocaleString(),
      change: stats.blogPosts.change,
      icon: FileText,
    },
    {
      name: "المستخدمين",
      value: stats.users.count.toLocaleString(),
      change: stats.users.change,
      icon: Users,
    },
    {
      name: "إجمالي المشاهدات",
      value: stats.views.count.toLocaleString(),
      change: stats.views.change,
      icon: Eye,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.change >= 0
        const isZero = stat.change === 0

        return (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  {!isZero && (
                    <p
                      className={`text-xs mt-1 ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {stat.change} هذا الشهر
                    </p>
                  )}
                  {isZero && (
                    <p className="text-xs text-muted-foreground mt-1">
                      بدون تغيير هذا الشهر
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
