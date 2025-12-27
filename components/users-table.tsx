"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Search } from "lucide-react";
import { deleteUser } from "@/app/actions/users";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDebouncedCallback } from "@/lib/client-utils";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useHydration } from "@/hooks/use-hydration";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  created_at: Date;
};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClient = useHydration();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleRoleFilter = (role: string) => {
    const params = new URLSearchParams(searchParams);
    if (role && role !== "all") {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleteId);
      setDeleteId(null);
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 flex gap-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 sm:w-full"
            />
          </div>
        </div>
        <Select
          defaultValue={searchParams.get("role") || "all"}
          onValueChange={handleRoleFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="تصفية حسب الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأدوار</SelectItem>
            <SelectItem value="ADMIN">مدير</SelectItem>
            <SelectItem value="USER">مستخدم</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الدور</TableHead>
            <TableHead>تاريخ الإنشاء</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name || "غير متاح"}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {isClient && user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "غير متاح"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={user.id === currentUserId}
                  onClick={() => setDeleteId(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حساب المستخدم بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "جارٍ الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
