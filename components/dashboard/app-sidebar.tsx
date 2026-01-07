"use client"

import * as React from "react"
import {
  AudioWaveform,
  BarChart,
  Command,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  History,
  LayoutDashboard,
  LayoutGrid,
  Newspaper,
  Package,
  Settings,
  Users,
  Shield,
  Scale,
  List,
  Image as ImageIcon,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "لوحة التحكم",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "المنتجات",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "المجموعات",
      url: "/dashboard/collections",
      icon: FolderOpen,
    },
    {
      title: "المدونة",
      url: "/dashboard/blog",
      icon: Newspaper,
    },
    {
      title: "المستخدمين",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "اللافتات",
      url: "/dashboard/banners",
      icon: ImageIcon,
    },
    {
      title: "سياسة الخصوصية",
      url: "/dashboard/privacy",
      icon: Shield,
    },
    {
      title: "شروط الخدمة",
      url: "/dashboard/terms",
      icon: Scale,
    },
    {
      title: "الإعدادات",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "سجل النشاطات",
      url: "/dashboard/activity",
      icon: List,
    },
  ],
}
interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}


export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & HeaderProps) {
  return (
    <Sidebar collapsible="icon" dir='rtl' variant="inset" side='right' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                key={"home"}
                href={"/"}
              >
                <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
                  <Image src="/logo.png" alt="أتيكا" width={40} height={40} className="rounded-full" />
                  <div className="text-right">
                    <h2 className="font-bold text-lg">الثقة للأثاث</h2>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar >
  )
}

