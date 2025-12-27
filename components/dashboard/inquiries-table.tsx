"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
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
import { useHydration } from "@/hooks/use-hydration";

interface Inquiry {
  id: string;
  name: string;
  age: number | null;
  address: string | null;
  country: string | null;
  place: string | null;
  type: "BUY" | "RENT";
  budget: number | null;
  notes: string | null;
  status: "PENDING" | "CONTACTED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface InquiriesTableProps {
  inquiries: Inquiry[];
}

export function InquiriesTable({ inquiries }: InquiriesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
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

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    await deleteInquiry(id);
    setDeleteId(null);
    router.refresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        );
      case "CONTACTED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Contacted
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            Closed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
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
              placeholder="Search by name, place, or country..."
              defaultValue={searchParams.get("search") || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 sm:w-full"
            />
          </div>
        </div>
        <Select
          defaultValue={searchParams.get("status") || "all"}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Place</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.place || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {inquiry.type === "BUY" ? "Buy" : "Rent"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isClient && inquiry.budget
                      ? `$${inquiry.budget.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    {isClient && inquiry.createdAt
                      ? format(new Date(inquiry.createdAt), "MMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/inquiries/${inquiry.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/inquiries/${inquiry.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(inquiry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              inquiry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
