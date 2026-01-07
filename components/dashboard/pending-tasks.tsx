import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface PendingTasksProps {
  unpublishedBlogPosts: number
  unpublishedProducts: number
  inactiveBanners: number
}

export function PendingTasks({
  unpublishedBlogPosts,
  unpublishedProducts,
  inactiveBanners,
}: PendingTasksProps) {
  const tasks = [
    {
      title: "مقالات غير منشورة",
      count: unpublishedBlogPosts,
      href: "/dashboard/blog",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      title: "منتجات غير منشورة",
      count: unpublishedProducts,
      href: "/dashboard/products",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      title: "لافتات غير فعالة",
      count: inactiveBanners,
      href: "/dashboard/banners",
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ]

  const totalTasks =
    unpublishedBlogPosts + unpublishedProducts + inactiveBanners

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>المهام المعلقة</CardTitle>
        <div className="flex items-center gap-2">
          {totalTasks > 0 ? (
            <AlertCircle className="h-5 w-5 text-orange-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <span className="text-sm font-medium">{totalTasks}</span>
        </div>
      </CardHeader>
      <CardContent>
        {totalTasks === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
            <p className="text-sm">جميع المهام مكتملة!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.title}
                href={task.href}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {task.icon}
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.count} عنصر
                    </p>
                  </div>
                </div>
                {task.count > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    {task.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
