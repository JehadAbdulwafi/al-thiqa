import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CollectionForm } from "@/components/dashboard/collections/collection-form"
import { getCollectionById } from "@/lib/queries"

interface EditCollectionPageProps {
  params: {
    id: string
  }
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const session = await auth()
  const { id } = await params

  if (!id) {
    redirect("/dashboard/collections")
  }

  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check if user is admin
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { role: true },
  })

  if (currentUser?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const collectionId = parseInt(id, 10)
  if (isNaN(collectionId)) {
    redirect("/dashboard/collections")
  }

  const collection = await getCollectionById(collectionId)
  if (!collection) {
    redirect("/dashboard/collections")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">تعديل المجموعة: {collection.name}</h2>
        <p className="text-muted-foreground mt-1">تحديث تفاصيل المجموعة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المجموعة</CardTitle>
          <CardDescription>قم بتحديث تفاصيل المجموعة أدناه</CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionForm collection={collection} />
        </CardContent>
      </Card>
    </div>
  )
}
