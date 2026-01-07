import { exportProductsToCSV, exportAnalyticsToCSV } from "@/app/actions/export"

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params

  try {
    if (type === "products") {
      return await exportProductsToCSV()
    } else if (type === "analytics") {
      return await exportAnalyticsToCSV()
    } else {
      return new Response("Invalid export type", { status: 400 })
    }
  } catch (error) {
    console.error("Export error:", error)
    return new Response("Export failed", { status: 500 })
  }
}
