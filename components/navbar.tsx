"use client"

import { useState } from "react"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SearchDialog } from "./search-dialog"

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navItems = [
    { label: "الرئيسية", href: "/" },
    { label: "المجموعات", href: "/collections" },
    { label: "غرف النوم", href: "/collections/bedroom" },
    { label: "غرف المعيشة", href: "/collections/living-room" },
    { label: "المكاتب", href: "/collections/office" },
  ]

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="الثقة للأثاث - Ateka" width={60} height={60} className="object-contain" />
              <div className="text-2xl font-bold md:block hidden">
                <span className="text-gray-900 ml-1">الثقة</span>
                <span className="text-[#8B7355]">للأثاث</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#8B7355] hover:bg-gray-50 rounded-lg transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => router.push(isLoggedIn ? "/dashboard" : "/login")}>
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#8B7355] hover:bg-gray-50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
