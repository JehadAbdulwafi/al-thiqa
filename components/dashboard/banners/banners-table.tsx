import type React from "react"
import Image from "next/image"
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

type Banner = {
  id: number
  title: string
  subtitle: string | null
  cta: string | null
  image: string
  isActive: boolean
  order: number
  createdAt: Date
}

interface BannersTableProps {
  banners: Banner[]
  onToggleActive: (id: number, isActive: boolean) => void
}

export function BannersTable({ banners, onToggleActive }: BannersTableProps) {
  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصورة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان الفرعي</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دعوة العمل</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الترتيب</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">أفعال</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {banners.map((banner) => (
            <tr key={banner.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="relative w-20 h-16">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="font-medium text-gray-900">{banner.title}</div>
              </td>
              <td className="px-6 py-4 text-right text-gray-600">
                {banner.subtitle}
              </td>
              <td className="px-6 py-4 text-right text-gray-600">
                {banner.cta}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onToggleActive(banner.id, banner.isActive)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    banner.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  aria-label={banner.isActive ? "تعطيل" : "تفعيل"}
                >
                  {banner.isActive && <ToggleLeft className="w-4 h-4" />}
                  {!banner.isActive && <ToggleRight className="w-4 h-4" />}
                </button>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {banner.isActive ? "نشط" : "غير نشط"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-gray-600">
                {banner.order}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type { BannersTable as BannersTableType }
