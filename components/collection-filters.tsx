"use client"

import { useState, useEffect, useCallback } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { COLORS, MATERIALS } from "@/lib/constants/materials-colors"

export function CollectionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialMinPrice = Number(searchParams.get("minPrice")) || 0
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || 50000
  const initialColors = searchParams.get("colors")?.split(",") || []
  const initialMaterials = searchParams.get("materials")?.split(",") || []

  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice])
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialMaterials)

  // Helper function to update URL search parameters
  const updateSearchParams = useCallback((key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","))
      } else {
        params.delete(key)
      }
    } else {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Synchronize internal state with URL on initial load and URL changes
  useEffect(() => {
    setPriceRange([
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 50000,
    ])
    setSelectedColors(searchParams.get("colors")?.split(",") || [])
    setSelectedMaterials(searchParams.get("materials")?.split(",") || [])
  }, [searchParams])


  const hasActiveFilters =
    priceRange[0] !== (Number(searchParams.get("minPrice")) || 0) ||
    priceRange[1] !== (Number(searchParams.get("maxPrice")) || 50000) ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0

  const handleApplyPriceFilter = (newRange: [number, number]) => {
    setPriceRange(newRange)
    updateSearchParams("minPrice", newRange[0].toString())
    updateSearchParams("maxPrice", newRange[1].toString())
  }

  const handleColorChange = (colorId: string) => {
    let newColors
    if (selectedColors.includes(colorId)) {
      newColors = selectedColors.filter((c) => c !== colorId)
    } else {
      newColors = [...selectedColors, colorId]
    }
    setSelectedColors(newColors)
    updateSearchParams("colors", newColors)
  }

  const handleMaterialChange = (materialId: string, checked: boolean) => {
    let newMaterials
    if (checked) {
      newMaterials = [...selectedMaterials, materialId]
    } else {
      newMaterials = selectedMaterials.filter((m) => m !== materialId)
    }
    setSelectedMaterials(newMaterials)
    updateSearchParams("materials", newMaterials)
  }

  const handleClearFilters = () => {
    setPriceRange([0, 50000])
    setSelectedColors([])
    setSelectedMaterials([])

    // Clear all filter params from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("colors")
    params.delete("materials")
    router.push(`?${params.toString()}`, { scroll: false })
  }

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

      <Accordion type="multiple" defaultValue={["price", "color", "material"]} className="space-y-0">
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
                onValueChange={handleApplyPriceFilter}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString("ar-SA")} د.ل</span>
                <span>{priceRange[1].toLocaleString("ar-SA")} د.ل</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="color">
          <AccordionTrigger className="text-sm font-semibold">اللون</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
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
              {MATERIALS.map((material) => (
                <div key={material.id} className="flex items-center gap-2">
                  <Checkbox
                    id={material.id}
                    checked={selectedMaterials.includes(material.id)}
                    onCheckedChange={(checked) => handleMaterialChange(material.id, checked === true)}
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
