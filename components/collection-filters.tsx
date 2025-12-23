"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CollectionFilters() {
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  const categories = [
    { id: "sofas", label: "أرائك" },
    { id: "chairs", label: "كراسي" },
    { id: "tables", label: "طاولات" },
    { id: "storage", label: "وحدات تخزين" },
    { id: "beds", label: "أسرة" },
  ]

  const colors = [
    { id: "beige", label: "بيج", hex: "#D4C5B9" },
    { id: "gray", label: "رمادي", hex: "#9CA3AF" },
    { id: "white", label: "أبيض", hex: "#FFFFFF" },
    { id: "black", label: "أسود", hex: "#1F2937" },
    { id: "brown", label: "بني", hex: "#92714F" },
    { id: "blue", label: "أزرق", hex: "#3B82F6" },
  ]

  const materials = [
    { id: "wood", label: "خشب" },
    { id: "metal", label: "معدن" },
    { id: "fabric", label: "قماش" },
    { id: "leather", label: "جلد" },
    { id: "velvet", label: "مخمل" },
  ]

  const handleClearFilters = () => {
    setPriceRange([0, 50000])
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedMaterials([])
  }

  const hasActiveFilters =
    priceRange[0] !== 0 ||
    priceRange[1] !== 50000 ||
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">تصفية النتائج</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-600 hover:text-gray-900">
            <X className="w-4 h-4 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["price", "category", "color", "material"]} className="space-y-0">
        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">النطاق السعري</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={0}
                max={50000}
                step={500}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString("ar-SA")} د.ل</span>
                <span>{priceRange[1].toLocaleString("ar-SA")} د.ل</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">الفئة</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category.id])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category.id))
                      }
                    }}
                  />
                  <Label htmlFor={category.id} className="text-sm text-gray-700 cursor-pointer">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="color">
          <AccordionTrigger className="text-sm font-semibold">اللون</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    if (selectedColors.includes(color.id)) {
                      setSelectedColors(selectedColors.filter((c) => c !== color.id))
                    } else {
                      setSelectedColors([...selectedColors, color.id])
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-md transition-all ${
                    selectedColors.includes(color.id) ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.id) ? "border-primary ring-2 ring-primary/20" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-gray-700">{color.label}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Material Filter */}
        <AccordionItem value="material">
          <AccordionTrigger className="text-sm font-semibold">المادة</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center gap-2">
                  <Checkbox
                    id={material.id}
                    checked={selectedMaterials.includes(material.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMaterials([...selectedMaterials, material.id])
                      } else {
                        setSelectedMaterials(selectedMaterials.filter((m) => m !== material.id))
                      }
                    }}
                  />
                  <Label htmlFor={material.id} className="text-sm text-gray-700 cursor-pointer">
                    {material.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
