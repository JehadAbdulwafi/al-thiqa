import { useEffect, useRef } from "react"
import { trackProductView } from "@/app/actions/analytics"

export function useProductView(productId: number) {
  const trackedRef = useRef<string>(null)

  useEffect(() => {
    const sessionId = `product_view_${productId}_${Date.now()}`
    
    if (trackedRef.current === sessionId) {
      return
    }

    trackProductView(productId)
    trackedRef.current = sessionId
  }, [productId])

  return null
}
