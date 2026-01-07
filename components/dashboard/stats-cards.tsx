import { Card, CardContent } from "@/components/ui/card"
import { Package, FolderOpen, FileText, Users, Eye } from "lucide-react"

interface StatCard {
  name: string
  value: string
  icon: React.ElementType<{ className?: string }>
}

interface StatsCardsProps {
  stats: {
    products: { count: number }
    collections: { count: number }
    blogPosts: { count: number }
    users: { count: number }
    views: { count: number }
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      name: "إجمالي المنتجات",
      value: stats.products.count.toLocaleString(),
      icon: Package,
    },
    {
      name: "المجموعات",
      value: stats.collections.count.toLocaleString(),
      icon: FolderOpen,
    },
    {
      name: "مقالات المدونة",
      value: stats.blogPosts.count.toLocaleString(),
      icon: FileText,
    },
    {
      name: "المستخدمين",
      value: stats.users.count.toLocaleString(),
      icon: Users,
    },
    {
      name: "إجمالي المشاهدات",
      value: stats.views.count.toLocaleString(),
      icon: Eye,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
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
