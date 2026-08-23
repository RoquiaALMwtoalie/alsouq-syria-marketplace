// 📁 src/lib/hooks/useCartTotal.ts

import { useMemo } from "react";
import { useCart } from "./useCart";

export function useCartTotal(
  userId: string | undefined,
  storeId?: string
) {
  const { data: cart } = useCart(userId);
  
  return useMemo(() => {
    if (!cart?.items || cart.items.length === 0) return 0;
    
    // ✅ إذا تم تحديد متجر، نحسب فقط منتجات هذا المتجر
    if (storeId) {
      const filteredItems = cart.items.filter((item: any) => {
        // ✅ ✅ ✅ استخدم item.listings (الاسم الصحيح من useCart)
        const listing = item.listings || item.listing || item;
        const ownerId = listing?.owner_id || item.owner_id || item.listing_id;
        
        console.log(`🔍 [useCartTotal] Checking item: ownerId=${ownerId}, storeId=${storeId}, match=${ownerId === storeId}`);
        
        return ownerId === storeId;
      });
      
      const total = filteredItems.reduce((sum, item) => {
        return sum + (Number(item.price) * Number(item.quantity));
      }, 0);
      
      console.log(`✅ [useCartTotal] Store ${storeId} total: ${total}`);
      return total;
    }
    
    // ✅ بدون فلتر، نحسب كل السلة
    return cart.items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);
  }, [cart?.items, storeId]);
}