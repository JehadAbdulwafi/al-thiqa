import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { collections as inquiriesSchema } from "@/lib/db/schema";
import { CollectionsTable } from "@/components/dashboard/collections-table";

interface InquiriesPageProps {
  searchParams?: Promise<{
    search?: string;
    status?: string;
  }> | {
    search?: string;
    status?: string;
  };
}

export default async function InquiriesPage({
  searchParams: searchParamsProp,
}: InquiriesPageProps) {
  const searchParams = searchParamsProp ? await Promise.resolve(searchParamsProp) : {};
  const search = searchParams?.search;

  const collections = await db.query.collections.findMany({
    where: and(
      search
        ? or(
          ilike(inquiriesSchema.name, `%${search}%`),
        )
        : undefined,
    ),
    extras: {
      productsCount: sql<number>`
      (
        select count(*)
        from products
        where products.collection_id = collections.id
      )
    `.as("productsCount"),
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المجموعات</h2>
          <p className="text-muted-foreground">إدارة مجموعات المنتجات</p>
        </div>
        <Link href="/dashboard/collections/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مجموعة جديدة
          </Button>
        </Link>
      </div>

      <CollectionsTable collections={collections} />
    </div>
  );
}
