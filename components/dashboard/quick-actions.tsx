import { Button } from "@/components/ui/button"
import { Plus, FileText, Package, FolderOpen, Users, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "إضافة منتج جديد",
    description: "إنشاء منتج جديد وإضافته للمتجر",
    icon: Package,
    href: "/dashboard/products/new",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "إنشاء مجموعة",
    description: "إضافة تصنيف جديد للمنتجات",
    icon: FolderOpen,
    href: "/dashboard/collections/new",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "كتابة مقال",
    description: "إنشاء مقال جديد للمدونة",
    icon: FileText,
    href: "/dashboard/blog/new",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "إضافة مستخدم",
    description: "إنشاء حساب مستخدم جديد",
    icon: Users,
    href: "/dashboard/users/new",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "إنشاء لافتة",
    description: "إضافة لافتة تسويقية جديدة",
    icon: ImageIcon,
    href: "/dashboard/banners/new",
    color: "bg-pink-500 hover:bg-pink-600",
  },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">إجراءات سريعة</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.title} href={action.href} className="w-full">
              <Button
                variant="outline"
                className={`h-auto flex-col gap-2 p-4 w-full items-start ${action.color} text-white hover:text-white border-0`}
              >
                <Icon className="h-6 w-6" />
                <div className="text-right flex-1">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
