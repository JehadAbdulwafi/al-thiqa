
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentViews = [
  {
    id: "1",
    product: "أريكة مودرن بيج",
    category: "غرف المعيشة",
    views: 156,
    status: "منشور",
  },
  {
    id: "2",
    product: "طاولة قهوة رخام",
    category: "غرف المعيشة",
    views: 124,
    status: "منشور",
  },
  {
    id: "3",
    product: "كرسي طعام مخمل",
    category: "غرف الطعام",
    views: 98,
    status: "مسودة",
  },
  {
    id: "4",
    product: "سرير ملكي فاخر",
    category: "غرف النوم",
    views: 87,
    status: "منشور",
  },
  {
    id: "5",
    product: "خزانة خشبية",
    category: "غرف النوم",
    views: 65,
    status: "منشور",
  },
]

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نشاط المنتجات الأخير</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">المجموعة</TableHead>
              <TableHead className="text-right">المشاهدات</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentViews.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.product}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell>{item.views}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "منشور" ? "default" : "secondary"}>{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
