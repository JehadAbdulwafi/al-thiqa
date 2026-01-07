import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Clock, CheckCircle } from "lucide-react"

export function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>حالة النظام</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">قاعدة البيانات</p>
              <p className="text-xs text-muted-foreground">
                آخر تحديث: {new Date().toLocaleString("ar-SA")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1">
            <CheckCircle className="h-3 w-3 text-green-800" />
            <span className="text-xs font-medium text-green-800">متصل</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">نظام التخزين</p>
              <p className="text-xs text-muted-foreground">
                Supabase Storage
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1">
            <CheckCircle className="h-3 w-3 text-green-800" />
            <span className="text-xs font-medium text-green-800">نشط</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">الخادم</p>
              <p className="text-xs text-muted-foreground">
                جميع الأنظمة تعمل بشكل طبيعي
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1">
            <CheckCircle className="h-3 w-3 text-green-800" />
            <span className="text-xs font-medium text-green-800">ممتاز</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
