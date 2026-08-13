// src/lib/hooks/useCartTotal.ts

import { useMemo } from "react";
import { useCart } from "./useCart";

export function useCartTotal(
  userId: string | undefined,
  storeId?: string  // ✅ إضافة معامل اختياري للمتجر
) {
  const { data: cart } = useCart(userId);
  
  return useMemo(() => {
    if (!cart?.items || cart.items.length === 0) return 0;
    
    // ✅ إذا تم تحديد متجر، نحسب فقط منتجات هذا المتجر
    let filteredItems = cart.items;
    
    if (storeId) {
      filteredItems = cart.items.filter((item: any) => {
        // ✅ التحقق من أن المنتج ينتمي للمتجر المطلوب
        const listing = item.listing || item;
        const ownerId = listing.owner_id || item.listing_id;
        return ownerId === storeId;
      });
    }
    
    return filteredItems.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);
  }, [cart?.items, storeId]);
}