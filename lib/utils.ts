import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number | null | undefined) {
  if (!price) return "0"
  const numericPrice = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(numericPrice)
}
