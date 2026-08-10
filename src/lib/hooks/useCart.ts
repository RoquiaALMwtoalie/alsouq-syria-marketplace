// src/lib/hooks/useCart.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ============================================================
// ✅ أنواع البيانات
// ============================================================
export interface CartItem {
  id: string;
  cart_id: string;
  listing_id: string;
  quantity: number;
  price: number;
  price_usd?: number;
  currency: string;
  selected_color?: string;
  selected_size?: string;
  selected_variation_id?: string;
  variation_combination?: Record<string, string>;  // ✅ أضف هذا
  variation_snapshot?: any;
  subtotal: number;
  subtotal_usd?: number;
  listing?: {
    id: string;
    title_ar: string;
    title_en: string;
    cover_url: string;
    owner_id: string;
    price: number;
    price_usd?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  store_id?: string;
  store?: {
    id: string;
    store_name: string;
    store_logo_url?: string;
  };
  total_items: number;
  total_price: number;
  total_price_usd?: number;
  currency: string;
  status: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
  expires_at: string;
}

// ============================================================
// ✅ 1. جلب السلة (محسّن)
// ============================================================
export function useCart(userId: string | undefined) {
  return useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("🔄 [useCart] Fetching cart for user:", userId);
      
      // ✅ جلب السلة النشطة
      const { data: cart, error } = await supabase
        .from("carts")
        .select(`
          *,
          store:store_id (
            id,
            store_name,
            store_logo_url
          )
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .order("total_items", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("❌ [useCart] Error fetching cart:", error);
        throw error;
      }
      
      if (!cart) {
        console.log("📭 [useCart] No active cart found");
        return null;
      }
      
      // ✅ جلب عناصر السلة
      const { data: items, error: itemsError } = await supabase
        .from("cart_items")
        .select(`
          *,
          listing:listing_id (
            id,
            title_ar,
            title_en,
            cover_url,
            owner_id,
            price,
            price_usd
          )
        `)
        .eq("cart_id", cart.id)
        .order("created_at", { ascending: true });
      
      if (itemsError) {
        console.error("❌ [useCart] Error fetching items:", itemsError);
        throw itemsError;
      }
      
      console.log(`✅ [useCart] Cart loaded: ${items?.length || 0} items`);
      
      // ✅ حساب الـ subtotal لكل عنصر
      const itemsWithSubtotal = items?.map(item => ({
        ...item,
        subtotal: Number(item.price) * item.quantity,
        subtotal_usd: item.price_usd ? Number(item.price_usd) * item.quantity : null,
      })) || [];
      
      return {
        ...cart,
        items: itemsWithSubtotal,
      } as Cart;
    },
    
    // ✅ إعدادات مهمة لمنع الـ re-fetching المتكرر
    staleTime: 1000 * 60 * 5, // 5 دقائق
    gcTime: 1000 * 60 * 10,   // 10 دقائق
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: 1000,
  });
}

// ============================================================
// ✅ 2. التحقق من توافق المنتج مع السلة
// ============================================================
export function useCheckCartCompatibility() {
  return useMutation({
    mutationFn: async ({ 
      userId, 
      listingId,
      newOwnerId,
    }: { 
      userId: string; 
      listingId: string;
      newOwnerId: string;
    }) => {
      const { data: cart, error } = await supabase
        .from("carts")
        .select("id, store_id, total_items")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("total_items", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!cart) {
        return { compatible: true, cartId: null, hasItems: false };
      }
      
      if (cart.total_items === 0) {
        return { compatible: true, cartId: cart.id, hasItems: false };
      }
      
      if (cart.store_id && cart.store_id !== newOwnerId) {
        return { 
          compatible: false, 
          cartId: cart.id,
          currentStoreId: cart.store_id,
          newStoreId: newOwnerId,
          hasItems: true,
        };
      }
      
      return { compatible: true, cartId: cart.id, hasItems: true };
    },
  });
}

// ============================================================
// ✅ 3. إضافة للسلة (محسّن مع دعم التركيبات)
// ============================================================
export function useAddToCart() {
  const queryClient = useQueryClient();
  const checkCompatibility = useCheckCartCompatibility();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      listingId, 
      quantity = 1,
      selectedColor,
      selectedSize,
      selectedVariationId,
      variationPrice,              // ✅ سعر التركيبة
      variationCombination,        // ✅ تركيبة (لون، مقاس، إلخ)
      onStoreConflict,
    }: {
      userId: string;
      listingId: string;
      quantity?: number;
      selectedColor?: string;
      selectedSize?: string;
      selectedVariationId?: string;
      variationPrice?: number;     // ✅ جديد
      variationCombination?: Record<string, string>;  // ✅ جديد
      onStoreConflict?: (data: any) => void;
    }) => {
      console.log("🛒 [useAddToCart] START - userId:", userId, "listingId:", listingId);
      
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .select("price, price_usd, currency, owner_id, title_ar, title_en, cover_url")
        .eq("id", listingId)
        .single();
      
      if (listingError) {
        console.error("❌ [useAddToCart] Error fetching listing:", listingError);
        throw listingError;
      }
      
      console.log("✅ [useAddToCart] Listing found:", listing.title_ar);
      
      // ✅ تحديد السعر (استخدم سعر التركيبة إذا وجد)
      const finalPrice = variationPrice || listing?.price || 0;
      
      const compatibility = await checkCompatibility.mutateAsync({
        userId,
        listingId,
        newOwnerId: listing.owner_id,
      });
      
      console.log("✅ [useAddToCart] Compatibility result:", compatibility);
      
      if (!compatibility.compatible && onStoreConflict) {
        console.log("⚠️ [useAddToCart] Store conflict detected!");
        onStoreConflict(compatibility);
        return { action: 'conflict' };
      }
      
      let cartId = compatibility.cartId;
      
      if (!cartId) {
        console.log("🔄 [useAddToCart] No cart found, creating new cart...");
        const { data: newCart, error: cartError } = await supabase
          .from("carts")
          .insert({
            user_id: userId,
            store_id: listing.owner_id,
          })
          .select()
          .single();
        
        if (cartError) {
          console.error("❌ [useAddToCart] Error creating cart:", cartError);
          throw cartError;
        }
        
        console.log("✅ [useAddToCart] New cart created:", newCart.id);
        cartId = newCart.id;
      }
      
      console.log("🛒 [useAddToCart] cartId:", cartId);
      
      // ✅ التحقق من وجود العنصر بنفس التركيبة
      let query = supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("listing_id", listingId);

      if (selectedColor) {
        query = query.eq("selected_color", selectedColor);
      }
      if (selectedSize) {
        query = query.eq("selected_size", selectedSize);
      }
      if (selectedVariationId) {
        query = query.eq("selected_variation_id", selectedVariationId);
      }

      const { data: existingItem, error: checkError } = await query.maybeSingle();
      
      if (checkError) {
        console.error("❌ [useAddToCart] Error checking existing item:", checkError);
        throw checkError;
      }
      
      console.log("✅ [useAddToCart] Existing item:", existingItem);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        console.log(`🔄 [useAddToCart] Updating quantity from ${existingItem.quantity} to ${newQuantity}`);
        
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingItem.id);
        
        if (updateError) {
          console.error("❌ [useAddToCart] Error updating quantity:", updateError);
          throw updateError;
        }
        
        console.log("✅ [useAddToCart] Quantity updated");
        return { action: 'updated', quantity: newQuantity };
      } else {
        console.log("🔄 [useAddToCart] Adding new item...");
        
        // ✅ بناء بيانات الإدراج مع دعم التركيبات
        const insertData: any = {
          cart_id: cartId,
          listing_id: listingId,
          quantity: quantity,
          price: finalPrice,  // ✅ استخدم سعر التركيبة
          price_usd: listing.price_usd,
          currency: listing.currency || 'SYP',
          variation_snapshot: {
            title_ar: listing.title_ar,
            title_en: listing.title_en,
            cover_url: listing.cover_url,
            price: finalPrice,
            price_usd: listing.price_usd,
          },
        };

        if (selectedColor) {
          insertData.selected_color = selectedColor;
        }
        if (selectedSize) {
          insertData.selected_size = selectedSize;
        }
        if (selectedVariationId) {
          insertData.selected_variation_id = selectedVariationId;
        }
        // ✅ ✅ ✅ حفظ التركيبة كاملة
        if (variationCombination) {
          insertData.variation_combination = variationCombination;
        }

        const { data: newItem, error: insertError } = await supabase
          .from("cart_items")
          .insert(insertData)
          .select()
          .single();
        
        if (insertError) {
          console.error("❌ [useAddToCart] Error inserting item:", insertError);
          throw insertError;
        }
        
        console.log("✅ [useAddToCart] New item added:", newItem.id);
        return { action: 'added', item: newItem };
      }
    },
    onSuccess: (data, variables) => {
      console.log("✅ [useAddToCart] Mutation SUCCESS:", data);
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      
      if (data.action === 'updated') {
        toast.success(`🛒 تم تحديث الكمية إلى ${data.quantity}`);
      } else if (data.action === 'added') {
        toast.success("🛒 تم إضافة المنتج للسلة");
      }
    },
    onError: (error: any) => {
      console.error("❌ [useAddToCart] Mutation ERROR:", error);
      toast.error("❌ فشل إضافة المنتج للسلة");
    },
  });
}

// ============================================================
// ✅ 4. تحديث عنصر في السلة (المهم)
// ============================================================
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      itemId,
      quantity,
      userId,
    }: { 
      itemId: string;
      quantity: number;
      userId: string;
    }) => {
      console.log(`🔄 [useUpdateCartItem] Updating item ${itemId} to ${quantity}`);
      
      // ✅ جلب معلومات العنصر
      const { data: cartItem, error: fetchError } = await supabase
        .from("cart_items")
        .select("cart_id, quantity, price, price_usd")
        .eq("id", itemId)
        .single();
      
      if (fetchError) {
        console.error("❌ [useUpdateCartItem] Fetch error:", fetchError);
        throw fetchError;
      }
      
      // ✅ إذا كانت الكمية 0 → حذف
      if (quantity <= 0) {
        const { error: deleteError } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", itemId);
        
        if (deleteError) {
          console.error("❌ [useUpdateCartItem] Delete error:", deleteError);
          throw deleteError;
        }
        
        // ✅ تسجيل النشاط
        await logCartActivity(cartItem.cart_id, userId, 'remove', itemId, cartItem.quantity, 0);
        
        // ✅ تحديث الإجماليات
        await updateCartTotals(cartItem.cart_id);
        
        console.log(`🗑️ [useUpdateCartItem] Item ${itemId} deleted`);
        return { action: 'deleted', itemId, cartId: cartItem.cart_id };
      }
      
      // ✅ تحديث الكمية
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId);
      
      if (updateError) {
        console.error("❌ [useUpdateCartItem] Update error:", updateError);
        throw updateError;
      }
      
      // ✅ تسجيل النشاط
      await logCartActivity(cartItem.cart_id, userId, 'update', itemId, cartItem.quantity, quantity);
      
      // ✅ تحديث الإجماليات
      await updateCartTotals(cartItem.cart_id);
      
      console.log(`✅ [useUpdateCartItem] Item ${itemId} updated to ${quantity}`);
      return { action: 'updated', quantity, itemId, cartId: cartItem.cart_id };
    },
    
    // ✅ استراتيجية التحديث
    onSuccess: (data, variables) => {
      // ✅ تحديث الكاش
      queryClient.invalidateQueries({ 
        queryKey: ["cart", variables.userId] 
      });
      
      // ✅ رسائل النجاح
      if (data.action === 'deleted') {
        toast.success("🗑️ تم حذف المنتج من السلة");
      } else {
        toast.success(`🛒 تم تحديث الكمية إلى ${data.quantity}`);
      }
    },
    
    onError: (error: any) => {
      console.error("❌ [useUpdateCartItem] Error:", error);
      toast.error("❌ فشل تحديث العنصر في السلة");
    },
    
    retry: 1,
  });
}

// ============================================================
// ✅ 5. تفريغ السلة
// ============================================================
export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      console.log("🔄 [useClearCart] Clearing cart for user:", userId);
      
      // ✅ جلب السلة
      const { data: cart, error } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      
      if (error) throw error;
      if (!cart) {
        console.log("📭 [useClearCart] No active cart found");
        return;
      }
      
      // ✅ حذف جميع العناصر
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cart.id);
      
      if (deleteError) throw deleteError;
      
      // ✅ تسجيل النشاط
      await logCartActivity(cart.id, userId, 'clear', null, 0, 0);
      
      // ✅ تحديث السلة
      await supabase
        .from("carts")
        .update({ 
          store_id: null,
          total_items: 0,
          total_price: 0,
          total_price_usd: 0,
        })
        .eq("id", cart.id);
      
      console.log("✅ [useClearCart] Cart cleared");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      toast.success("🧹 تم تفريغ السلة");
    },
    onError: (error: any) => {
      console.error("❌ [useClearCart] Error:", error);
      toast.error("❌ فشل تفريغ السلة");
    },
  });
}

// ============================================================
// ✅ 6. دوال مساعدة
// ============================================================

// ✅ تحديث إجماليات السلة
async function updateCartTotals(cartId: string) {
  try {
    console.log("🔄 [updateCartTotals] Updating totals for cart:", cartId);
    
    const { data: items, error } = await supabase
      .from("cart_items")
      .select("quantity, price, price_usd")
      .eq("cart_id", cartId);
    
    if (error) throw error;
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const totalPriceUsd = items.reduce((sum, item) => sum + ((Number(item.price_usd) || 0) * item.quantity), 0);
    
    const { error: updateError } = await supabase
      .from("carts")
      .update({
        total_items: totalItems,
        total_price: totalPrice,
        total_price_usd: totalPriceUsd,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartId);
    
    if (updateError) throw updateError;
    
    console.log(`✅ [updateCartTotals] Totals updated: ${totalItems} items, ${totalPrice} total`);
    
  } catch (error) {
    console.error("❌ [updateCartTotals] Error:", error);
  }
}

// ✅ تسجيل نشاط السلة
async function logCartActivity(
  cartId: string, 
  userId: string, 
  action: string, 
  itemId: string | null, 
  oldQuantity: number, 
  newQuantity: number
) {
  try {
    await supabase
      .from("cart_activity")
      .insert({
        cart_id: cartId,
        user_id: userId,
        action: action,
        item_id: itemId,
        old_quantity: oldQuantity,
        new_quantity: newQuantity,
        metadata: {
          timestamp: new Date().toISOString(),
        }
      });
  } catch (error) {
    console.error("❌ [logCartActivity] Error:", error);
  }
}