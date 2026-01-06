export const MATERIALS = [
  { id: "wood", label: "خشب", labelEn: "Wood" },
  { id: "metal", label: "معدن", labelEn: "Metal" },
  { id: "glass", label: "زجاج", labelEn: "Glass" },
  { id: "fabric", label: "قماش", labelEn: "Fabric" },
  { id: "leather", label: "جلد", labelEn: "Leather" },
  { id: "plastic", label: "بلاستك", labelEn: "Plastic" },
  { id: "ceramic", label: "سيراميك", labelEn: "Ceramic" },
  { id: "stone", label: "حجر", labelEn: "Stone" },
  { id: "other", label: "أخرى", labelEn: "Other" },
] as const

export const COLORS = [
  { id: "white", label: "أبيض", labelEn: "White", hex: "#FFFFFF" },
  { id: "black", label: "أسود", labelEn: "Black", hex: "#000000" },
  { id: "gray", label: "رمادي", labelEn: "Gray", hex: "#808080" },
  { id: "brown", label: "بني", labelEn: "Brown", hex: "#A52A2A" },
  { id: "beige", label: "بيج", labelEn: "Beige", hex: "#F5F5DC" },
  { id: "red", label: "أحمر", labelEn: "Red", hex: "#EF4444" },
  { id: "blue", label: "أزرق", labelEn: "Blue", hex: "#3B82F6" },
  { id: "green", label: "أخضر", labelEn: "Green", hex: "#22C55E" },
  { id: "yellow", label: "أصفر", labelEn: "Yellow", hex: "#EAB308" },
  { id: "pink", label: "وردي", labelEn: "Pink", hex: "#EC4899" },
  { id: "purple", label: "بنفسجي", labelEn: "Purple", hex: "#9333EA" },
  { id: "orange", label: "برتقالي", labelEn: "Orange", hex: "#F97316" },
  { id: "gold", label: "ذهبي", labelEn: "Gold", hex: "#FFD700" },
  { id: "silver", label: "فضي", labelEn: "Silver", hex: "#C0C0C0" },
  { id: "other", label: "أخرى", labelEn: "Other", hex: "#6B7280" },
] as const

export type Material = typeof MATERIALS[number]
export type Color = typeof COLORS[number]
