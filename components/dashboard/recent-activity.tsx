import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, FileText, Package, User } from "lucide-react"
import Link from "next/link"

interface ActivityItem {
  id: number
  action: string
  resourceType: string | null
  resourceId: string | null
  details: string | null
  createdAt: Date
  userName: string | null
  userEmail: string
}

interface RecentActivityProps {
  activity: ActivityItem[]
}

function getActionBadge(action: string) {
  switch (action) {
    case "CREATE":
      return <Badge className="bg-green-100 text-green-800 border-green-300">إنشاء</Badge>
    case "UPDATE":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">تحديث</Badge>
    case "DELETE":
      return <Badge className="bg-red-100 text-red-800 border-red-300">حذف</Badge>
    default:
      return <Badge>{action}</Badge>
  }
}

function getResourceIcon(resourceType: string | null) {
  switch (resourceType) {
    case "PRODUCT":
      return <Package className="h-4 w-4 text-muted-foreground" />
    case "BLOG_POST":
      return <FileText className="h-4 w-4 text-muted-foreground" />
    case "USER":
      return <User className="h-4 w-4 text-muted-foreground" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

function getResourceLink(resourceType: string | null, resourceId: string | null) {
  if (!resourceType || !resourceId) return null

  switch (resourceType) {
    case "PRODUCT":
      return `/dashboard/products/${resourceId}/edit`
    case "BLOG_POST":
      return `/dashboard/blog/${resourceId}`
    case "USER":
      return `/dashboard/users/${resourceId}/edit`
    default:
      return null
  }
}

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>النشاط الأخير</CardTitle>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">لا يوجد نشاط حديث</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.map((item) => {
              const resourceLink = getResourceLink(item.resourceType, item.resourceId)
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">{getResourceIcon(item.resourceType)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getActionBadge(item.action)}
                      {item.resourceType && (
                        <span className="text-xs text-muted-foreground">
                          {item.resourceType === "PRODUCT" && "منتج"}
                          {item.resourceType === "BLOG_POST" && "مقال"}
                          {item.resourceType === "USER" && "مستخدم"}
                          {item.resourceType === "COLLECTION" && "مجموعة"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">{item.userName || item.userEmail}</span>
                      {item.details && (
                        <span className="text-muted-foreground"> - {item.details}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString("ar-SA")}
                      {resourceLink && (
                        <>
                          {" "}
                          <Link
                            href={resourceLink}
                            className="text-primary hover:underline"
                          >
                            عرض
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
