import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { users as usersSchema } from "@/lib/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { UsersTable } from "@/components/users-table";

interface UsersPageProps {
  searchParams?: Promise<{
    search?: string;
    role?: "ADMIN" | "USER" | "all";
  }> | {
    search?: string;
    role?: "ADMIN" | "USER" | "all";
  };
}

export default async function UsersPage({
  searchParams: searchParamsProp,
}: UsersPageProps) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(usersSchema.id, currentUserId),
    columns: {
      role: true,
    },
  });

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>تم رفض الوصول</CardTitle>
            <CardDescription>
              ليس لديك إذن للوصول إلى هذه الصفحة.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const searchParams = searchParamsProp ? await Promise.resolve(searchParamsProp) : {};
  const search = searchParams?.search;
  const role = searchParams?.role;

  const allUsersFromDb = await db.query.users.findMany({
    where: and(
      search
        ? or(
          ilike(usersSchema.name, `%${search}%`),
          ilike(usersSchema.email, `%${search}%`)
        )
        : undefined,
      role && role !== "all"
        ? eq(usersSchema.role, role)
        : undefined
    ),
  });

  const allUsers = allUsersFromDb.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h2>
          <p className="text-muted-foreground mt-1">
            إدارة مستخدمي النظام وأدوارهم
          </p>
        </div>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مستخدم
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع المستخدمين</CardTitle>
          <CardDescription>قائمة بجميع المستخدمين في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={allUsers} currentUserId={currentUserId} />
        </CardContent>
      </Card>
    </div>
  );
}
