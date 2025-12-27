import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { inquiries } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function PendingBadge() {
  const result = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(inquiries)
    .where(eq(inquiries.status, "Pending"))

  const pendingCount = result[0].count

  if (pendingCount === 0) {
    return null
  }

  return (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
      {pendingCount} Pending
    </Badge>
  )
}
