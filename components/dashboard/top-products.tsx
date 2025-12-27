import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const topProducts = [
  { name: "أريكة مودرن بيج", views: 1243, badge: "الأكثر مبيعاً" },
  { name: "طاولة قهوة رخام", views: 1124 },
  { name: "كرسي مكتبي جلد", views: 982, badge: "جديد" },
  { name: "سرير ملكي فاخر", views: 876 },
  { name: "خزانة خشبية", views: 654 },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>المنتجات الأكثر مشاهدة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.views} مشاهدة</p>
              </div>
              {product.badge && (
                <Badge variant="secondary" className="text-xs">
                  {product.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
