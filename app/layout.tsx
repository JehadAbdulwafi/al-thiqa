import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "الثقة للأثاث - أثاث عصري وفاخر",
  description: "اكتشف مجموعتنا الفريدة من الأثاث العصري المصمم بعناية لتحويل منزلك إلى واحة من الراحة والأناقة",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
