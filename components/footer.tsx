import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="الثقة للأثاث - Ateka" width={50} height={50} className="object-contain" />
              <h3 className="font-bold text-xl text-white">
                <span className="text-white ml-1">الثقة</span>
                <span className="text-[#D4A574]">للأثاث</span>
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              نقدم لكم أفضل حلول الأثاث العصري بجودة عالية وتصاميم فريدة تناسب جميع الأذواق
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#products" className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  منتجاتنا
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  عن الشركة
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-gray-400 hover:text-[#D4A574] transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">معلومات التواصل</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#D4A574]" />
                <span>طرابلس, ليبيا</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-5 w-5 flex-shrink-0 text-[#D4A574]" />
                <span dir="ltr">+218 91 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-5 w-5 flex-shrink-0 text-[#D4A574]" />
                <span>info@althiqa.ly</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-lg">تابعنا</h4>
            <p className="text-sm text-gray-400 mb-4">تواصل معنا عبر وسائل التواصل الاجتماعي</p>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-11 w-11 rounded-lg bg-gray-800 hover:bg-[#8B7355] text-gray-300 hover:text-white flex items-center justify-center transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-11 w-11 rounded-lg bg-gray-800 hover:bg-[#8B7355] text-gray-300 hover:text-white flex items-center justify-center transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-11 w-11 rounded-lg bg-gray-800 hover:bg-[#8B7355] text-gray-300 hover:text-white flex items-center justify-center transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} الثقة للأثاث. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
