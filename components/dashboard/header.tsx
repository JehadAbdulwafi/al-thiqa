"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import React from "react"

const segmentTranslations: { [key: string]: string } = {
  dashboard: 'لوحة التحكم',
  products: 'المنتجات',
  collections: 'المجموعات',
  users: 'المستخدمون',
  settings: 'الإعدادات',
  new: 'جديد',
  edit: 'تعديل',
  blog: 'المدونة', // Add this line
  // Add other common segments and their Arabic translations here
};

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment && !/\[.*\]/.test(segment));

  const breadcrumbItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const translatedSegment = segmentTranslations[segment] || segment; // Fallback to segment if no translation

    return (
      <React.Fragment key={segment}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{translatedSegment}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>{translatedSegment}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  });

  // Add a "Home" breadcrumb at the beginning for the dashboard root
  const homeBreadcrumb = (
    <React.Fragment key="home">
      <BreadcrumbItem>
        <BreadcrumbLink href="/dashboard">الرئيسية</BreadcrumbLink>
      </BreadcrumbItem>
      {segments.length > 0 && <BreadcrumbSeparator />}
    </React.Fragment>
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {homeBreadcrumb}
            {breadcrumbItems}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
