"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-[#8B7355] to-[#6F5B44]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">اشترك في نشرتنا الإخبارية</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            احصل على آخر الأخبار والعروض الحصرية والنصائح المفيدة حول الأثاث مباشرة إلى بريدك الإلكتروني
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="h-14 px-6 bg-white/95 border-0 text-gray-900 placeholder:text-gray-500"
            />
            <Button className="h-14 px-8 bg-white text-[#8B7355] hover:bg-gray-100 font-semibold whitespace-nowrap">
              اشترك الآن
            </Button>
          </div>

          <p className="text-white/70 text-sm mt-4">نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.</p>
        </div>
      </div>
    </section>
  )
}
