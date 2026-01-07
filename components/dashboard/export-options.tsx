"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet } from "lucide-react"
import { useRouter } from "next/navigation"

export function ExportOptions() {
  const router = useRouter()

  const handleExport = async (type: "products" | "analytics") => {
    try {
      const response = await fetch(`/api/export/${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${type}-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>تصدير البيانات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">تصدير المنتجات</p>
              <p className="text-xs text-muted-foreground">
                تنسيق CSV
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("products")}
          >
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">تصدير التحليلات</p>
              <p className="text-xs text-muted-foreground">
                الإحصائيات الشهرية
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("analytics")}
          >
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
