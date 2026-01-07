import { NextResponse } from "next/server"
import { recordMonthlyStats } from "@/app/actions/analytics"
import { verifySecret } from "@/lib/auth"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const secret = authHeader?.replace("Bearer ", "")

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await recordMonthlyStats()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { error: "Failed to record stats" },
      { status: 500 }
    )
  }
}
