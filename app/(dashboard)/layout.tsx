import type React from "react";
import { Header } from "@/components/dashboard/header";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider dir='rtl'>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header />
        <main className="mx-auto flex h-full w-full p-6 flex-1 flex-col gap-4 rounded-xl overflow-x-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
