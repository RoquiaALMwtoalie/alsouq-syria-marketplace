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
  variation_combination?: Record<string, string>;
  variation_snapshot?: any;
  subtotal: number;
  subtotal_usd?: number;
  listings?: {
    id: string;
    title_ar: string;
    title_en: string;
    cover_url: string;
    owner_id: string;
    price: number;
    price_usd?: number;
    is_offer?: boolean;
    discount_percent?: number;
    old_price?: number;
    profile?: {
      id: string;
      store_name: string;
      store_logo_url: string;
      store_cover_url: string;
      full_name: string;
      avatar_url: string;
    };
    colors?: any[];
    variations?: any[];
  };
  listing?: {
    id: string;
    title_ar: string;
    title_en: string;
    cover_url: string;
    owner_id: string;
    price: number;
    price_usd?: number;
    profile?: {
      id: string;
      store_name: string;
      store_logo_url: string;
      store_cover_url: string;
      full_name: string;
      avatar_url: string;
    };
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
// ✅ 1. جلب السلة (محسّن بالكامل)
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
      
      // ✅ ✅ ✅ جلب عناصر السلة مع بيانات المنتج الكاملة (بما فيها الـ variations و colors)
      const { data: items, error: itemsError } = await supabase
        .from("cart_items")
        .select(`
          *,
          listings:listing_id (
            id,
            title_ar,
            title_en,
            description_ar,
            description_en,
            cover_url,
            owner_id,
            price,
            price_usd,
            old_price,
            currency,
            is_offer,
            discount_percent,
            is_available,
            is_featured,
            rating,
            views,
            favorites_count,
            kind,
            status,
            delivery_method,
            delivery_note,
            payment_method,
            metadata,
            governorate_id,
            category_id,
            created_at,
            updated_at,
            profile:profiles!owner_id (
              id,
              full_name,
              phone,
              avatar_url,
              bio,
              store_name,
              store_logo_url,
              store_cover_url,
              allows_messaging,
              allows_bookings,
              store_online,
              store_opens_at,
              store_closes_at
            ),
            governorates:governorate_id (
              id,
              name_ar,
              name_en,
              slug
            ),
            categories:category_id (
              id,
              name_ar,
              name_en,
              slug,
              icon,
              image_url
            ),
            colors:product_colors (
              id,
              color_name_ar,
              color_name_en,
              color_hex,
              image_url,
              sort_order
            ),
            variations:product_variations (
              id,
              sku,
              combination,
              price,
              old_price,
              stock_quantity,
              reserved_quantity,
              image_url,
              is_active,
              color_id,
              created_at,
              updated_at
            ),
            options:product_options (
              id,
              option_type,
              option_value,
              option_label_ar,
              option_label_en,
              sort_order
            ),
            listing_images (
              id,
              url,
              sort_order
            )
          )
        `)
        .eq("cart_id", cart.id)
        .order("created_at", { ascending: true });
      
      if (itemsError) {
        console.error("❌ [useCart] Error fetching items:", itemsError);
        throw itemsError;
      }
      
      console.log(`✅ [useCart] Cart loaded: ${items?.length || 0} items`);
      
      // ✅ حساب الـ subtotal لكل عنصر مع عرض بيانات debug
      const itemsWithSubtotal = items?.map((item: any) => {
        const listing = item.listings || item.listing || null;
        
        // ✅ ✅ ✅ عرض بيانات الفيرنتات للـ debug
        if (listing?.variations && listing.variations.length > 0) {
          console.log(`🔍 [useCart] Listing ${listing.id} has ${listing.variations.length} variations`);
          console.log(`🔍 [useCart] First variation:`, listing.variations[0]);
        }
        
        return {
          ...item,
          subtotal: Number(item.price) * item.quantity,
          subtotal_usd: item.price_usd ? Number(item.price_usd) * item.quantity : null,
          listings: listing, // ✅ تأكد من إرجاع listings مع البيانات الكاملة
        };
      }) || [];
      
      // ✅ إرجاع كائن السلة مع العناصر
      return {
        ...cart,
        items: itemsWithSubtotal,
      } as Cart;
    },
    
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
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
      // 1. جلب السلة النشطة للمستخدم
      const { data: cart, error } = await supabase
        .from("carts")
        .select("id, status")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      
      if (error) throw error;
      
      if (!cart) {
        return { compatible: true, cartId: null, hasItems: false };
      }
      
      // 2. جلب أول عنصر داخل السلة لمعرفة متجر المنتجات الحالية
      const { data: existingItems, error: itemsError } = await supabase
        .from("cart_items")
        .select(`
          id,
          listings:listing_id (
            owner_id
          )
        `)
        .eq("cart_id", cart.id)
        .limit(1);
        
      if (itemsError) throw itemsError;
      
      // إذا كانت السلة فارغة تماماً، فالمنتج متوافق
      if (!existingItems || existingItems.length === 0) {
        return { compatible: true, cartId: cart.id, hasItems: false };
      }
      
      // 3. مقارنة صاحب المنتج الموجود في السلة مع صاحب المنتج الجديد المراد إضافته
      const currentStoreId = (existingItems[0] as any)?.listings?.owner_id;
      
      if (currentStoreId && currentStoreId !== newOwnerId) {
        return { 
          compatible: false, 
          cartId: cart.id,
          currentStoreId: currentStoreId,
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
      variationPrice,
      variationCombination,
      extraData,  
      onStoreConflict,
    }: {
      userId: string;
      listingId: string;
      quantity?: number;
      selectedColor?: string;
      selectedSize?: string;
      selectedVariationId?: string;
      variationPrice?: number;
      variationCombination?: Record<string, string>;
      extraData?: any;
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
      
      if (listing.owner_id === userId) {
        throw new Error("لا يمكنك إضافة منتجات من متجرك الخاص إلى السلة");
      }
      
      const finalPrice = variationPrice ?? listing?.price ?? 0;
      
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

      // ============================================================
      // ✅ ✅ ✅ البحث عن عرض ترويجي مسبق باستخدام offer_id
      // ============================================================
      const offerId = extraData?.offer_id;
      
      if (offerId) {
        const { data: existingPromo, error: promoError } = await supabase
          .from("cart_items")
          .select("id, quantity, variation_snapshot, offer_id, price")
          .eq("cart_id", cartId)
          .eq("offer_id", offerId)
          .maybeSingle();
        
        if (promoError) {
          console.error("❌ Error checking existing promo:", promoError);
        }

        // ✅ إذا كان العرض موجوداً مسبقاً
        if (existingPromo) {
          const currentSnapshot = existingPromo.variation_snapshot || {};
          const existingOfferData = currentSnapshot.offer_data || {};
          const newOfferData = extraData?.offer_data || {};
          
          // ✅ ✅ ✅ مقارنة الفيرنتات المختارة
          const existingVariations = existingOfferData?.required_products?.variations || {};
          const newVariations = newOfferData?.required_products?.variations || {};
          
          const existingKeys = Object.keys(existingVariations).sort();
          const newKeys = Object.keys(newVariations).sort();
          
          // ✅ التحقق من تطابق الفيرنتات (المفاتيح)
          const areVariationsSame = existingKeys.length === newKeys.length && 
                                    existingKeys.every((key, index) => key === newKeys[index]);
          
          // ✅ التحقق من تطابق الكميات لكل فيرنت
          let areQuantitiesSame = true;
          if (areVariationsSame) {
            for (const key of existingKeys) {
              if (existingVariations[key]?.quantity !== newVariations[key]?.quantity) {
                areQuantitiesSame = false;
                break;
              }
            }
          }
          
          // ✅ التحقق من تطابق فيرنتات الهدية
          const existingGiftKeys = Object.keys(existingOfferData?.free_product?.variations || {}).sort();
          const newGiftKeys = Object.keys(newOfferData?.free_product?.variations || {}).sort();
          const areGiftsSame = existingGiftKeys.length === newGiftKeys.length && 
                               existingGiftKeys.every((key, index) => key === newGiftKeys[index]);
          
          const isSameOffer = areVariationsSame && areQuantitiesSame && areGiftsSame;
          
          console.log(`📊 [useAddToCart] Is same offer? ${isSameOffer}`);
          console.log(`📊 [useAddToCart] Existing variations:`, existingKeys);
          console.log(`📊 [useAddToCart] New variations:`, newKeys);
          console.log(`📊 [useAddToCart] Existing gift keys:`, existingGiftKeys);
          console.log(`📊 [useAddToCart] New gift keys:`, newGiftKeys);
          
          // ✅ إذا كانت الخيارات متطابقة → تحديث الكمية مع مضاعفة الفيرنتات
          if (isSameOffer) {
            console.log("🔄 [useAddToCart] Same offer with same variations, updating quantity...");
            
            const currentQuantity = existingPromo.quantity || 1;
            const newQuantity = currentQuantity + 1;
            const basePrice = existingPromo.price / currentQuantity;
            const newTotalPrice = basePrice * newQuantity;
            
            // ✅ ✅ ✅ مضاعفة كميات الفيرنتات المطلوبة
            const updatedRequiredVariations: Record<string, any> = {};
            const oldRequired = newOfferData?.required_products?.variations || {};
            for (const [id, data] of Object.entries(oldRequired)) {
              updatedRequiredVariations[id] = {
                ...data,
                quantity: (data.quantity || 1) * newQuantity,
              };
            }
            
            // ✅ ✅ ✅ مضاعفة كميات فيرنتات الهدية
            const updatedGiftVariations: Record<string, any> = {};
            const oldGift = newOfferData?.free_product?.variations || {};
            for (const [id, data] of Object.entries(oldGift)) {
              updatedGiftVariations[id] = {
                ...data,
                quantity: (data.quantity || 1) * newQuantity,
              };
            }
            
            // ✅ ✅ ✅ مضاعفة كميات المنتجات المطلوبة في main_product
            const updatedMainProductVariations = Object.entries(updatedRequiredVariations).map(([id, data]: any) => ({
              id,
              ...data,
            }));
            
            // ✅ ✅ ✅ مضاعفة كميات فيرنتات الهدية في free_product
            const updatedFreeProductVariations = Object.entries(updatedGiftVariations).map(([id, data]: any) => ({
              id,
              ...data,
            }));
            
            const updatedSnapshot = {
              ...currentSnapshot,
              offer_data: {
                ...newOfferData,
                required_products: {
                  ...newOfferData?.required_products,
                  variations: updatedRequiredVariations,
                },
                free_product: {
                  ...newOfferData?.free_product,
                  variations: updatedGiftVariations,
                },
              },
              required_variations: updatedRequiredVariations,
              gift_variations: updatedGiftVariations,
              main_product: {
                ...(newOfferData?.required_products?.main_product || currentSnapshot.main_product || {}),
                variations: updatedMainProductVariations,
              },
              free_product: newOfferData?.free_product ? {
                ...newOfferData.free_product,
                variations: updatedFreeProductVariations,
              } : currentSnapshot.free_product,
              all_variations: {
                required: Object.entries(updatedRequiredVariations).map(([id, data]: any) => ({
                  id,
                  ...data,
                  type: 'required',
                })),
                gift: Object.entries(updatedGiftVariations).map(([id, data]: any) => ({
                  id,
                  ...data,
                  type: 'gift',
                })),
              },
              quantity: newQuantity,
              total_price: newTotalPrice,
              updated_at: new Date().toISOString(),
            };
            
            const { error: updateError } = await supabase
              .from("cart_items")
              .update({
                variation_snapshot: updatedSnapshot,
                quantity: newQuantity,
                price: newTotalPrice,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingPromo.id);
            
            if (updateError) {
              console.error("❌ Error updating promo:", updateError);
              throw updateError;
            }
            
            console.log(`✅ [useAddToCart] Promo offer updated, new quantity: ${newQuantity}`);
            return { action: 'updated', item: existingPromo, quantity: newQuantity };
          } else {
            // ✅ الخيارات مختلفة → إضافة عنصر جديد
            console.log("🔄 [useAddToCart] Same offer but different variations, adding new item...");
            // ✅ نستمر في الكود لإضافة عنصر جديد
          }
        }
      }

      // ============================================================
      // ✅ إضافة عرض ترويجي جديد (عنصر واحد) مع جميع الفيرنتات والصور
      // ============================================================
      console.log("🔄 [useAddToCart] Adding new promo offer");

      // ✅ بناء variation_snapshot كامل مع جميع الفيرنتات والصور
      const offerData = extraData?.offer_data || {};

      // ✅ ✅ ✅ تحضير بيانات الفيرنتات المطلوبة مع الصور كاملة
      const requiredVariationsWithImages = offerData?.required_products?.variations || {};
      const giftVariationsWithImages = offerData?.free_product?.variations || {};

      // ✅ ✅ ✅ دالة مساعدة لاستخراج صورة الفيرنت من مصادر متعددة
      const getVariationImage = (variation: any, product: any) => {
        let image = null;
        
        // 1. صورة الفيرنت مباشرة
        if (variation?.image_url) {
          image = variation.image_url;
        }
        
        // 2. من cover_url في المنتج
        if (!image && product?.cover_url) {
          image = product.cover_url;
        }
        
        return image;
      };

      // ✅ بناء main_product مع الفيرنتات والصور
      const mainProductWithVariations = {
        ...(offerData?.required_products?.main_product || {
          id: listingId,
          title_ar: listing.title_ar,
          title_en: listing.title_en,
          cover_url: listing.cover_url,
        }),
        variations: Object.entries(requiredVariationsWithImages).map(([id, data]: any) => ({
          id,
          ...data,
          image_url: data.image_url || getVariationImage(data, offerData?.required_products?.main_product),
        })),
        colors: offerData?.required_products?.main_product?.colors || [],
      };

      // ✅ بناء free_product مع الفيرنتات والصور
      const freeProductWithVariations = offerData?.free_product ? {
        ...offerData.free_product,
        variations: Object.entries(giftVariationsWithImages).map(([id, data]: any) => ({
          id,
          ...data,
          image_url: data.image_url || getVariationImage(data, offerData.free_product),
        })),
        colors: offerData.free_product?.colors || [],
      } : null;

      const snapshot = {
        title_ar: offerData.display_text_ar || listing.title_ar,
        title_en: offerData.display_text_en || listing.title_en || listing.title_ar,
        cover_url: listing.cover_url,
        price: finalPrice,
        is_promo_offer: true,
        offer_id: offerId,
        offer_data: offerData,
        required_variations: requiredVariationsWithImages,
        gift_variations: giftVariationsWithImages,
        store: offerData?.store || {
          id: listing.owner_id,
          name: "",
          logo: null,
        },
        main_product: mainProductWithVariations,
        free_product: freeProductWithVariations,
        all_variations: {
          required: Object.entries(requiredVariationsWithImages).map(([id, data]: any) => ({
            id,
            ...data,
            type: 'required',
          })),
          gift: Object.entries(giftVariationsWithImages).map(([id, data]: any) => ({
            id,
            ...data,
            type: 'gift',
          })),
        },
        created_at: new Date().toISOString(),
      };

      console.log(`📊 [useAddToCart] Snapshot built with ${Object.keys(requiredVariationsWithImages).length} required variations and ${Object.keys(giftVariationsWithImages).length} gift variations`);

      const insertData: any = {
        cart_id: cartId,
        listing_id: listingId,
        quantity: 1,
        price: finalPrice,
        price_usd: listing.price_usd,
        currency: listing.currency || 'SYP',
        is_free: false,
        offer_id: offerId || null,
        variation_snapshot: snapshot,
        selected_variation_id: null,
        variation_combination: {},
      };

      const { data: newItem, error: insertError } = await supabase
        .from("cart_items")
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) {
        console.error("❌ [useAddToCart] Error inserting item:", insertError);
        throw insertError;
      }
      
      console.log("✅ [useAddToCart] New promo offer added:", newItem.id);
      
      return { action: 'added', item: newItem };
    },
    onSuccess: (data, variables) => {
      console.log("✅ [useAddToCart] Mutation SUCCESS:", data);
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      
      if (data.action === 'updated') {
        toast.success(`🛒 تم تحديث الكمية إلى ${data.quantity || 1}`);
      } else if (data.action === 'added') {
        toast.success("🛒 تم إضافة العرض الترويجي للسلة");
      }
    },
    onError: (error: any) => {
      console.error("❌ [useAddToCart] Mutation ERROR:", error);
      
      if (error.message?.includes("لا يمكنك إضافة منتجات من متجرك الخاص")) {
        toast.error("❌ لا يمكنك إضافة منتجات من متجرك الخاص إلى السلة");
      } else {
        toast.error("❌ فشل إضافة العرض للسلة");
      }
    },
  });
}
// ============================================================
// ✅ 4. تحديث عنصر في السلة
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
        .maybeSingle();
      
      // ✅ تحقق من وجود العنصر
      if (fetchError || !cartItem) {
        console.log("📭 [useUpdateCartItem] Item not found, skipping...");
        return { action: 'not_found', itemId };
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
      
      // ✅ تحديث الإجماليات
      await updateCartTotals(cartItem.cart_id);
      
      console.log(`✅ [useUpdateCartItem] Item ${itemId} updated to ${quantity}`);
      return { action: 'updated', quantity, itemId, cartId: cartItem.cart_id };
    },
    
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["cart", variables.userId] 
      });
      
      if (data.action === 'deleted') {
        toast.success("🗑️ تم حذف المنتج من السلة");
      } else if (data.action === 'updated') {
        toast.success(`🛒 تم تحديث الكمية إلى ${data.quantity}`);
      } else if (data.action === 'not_found') {
        console.log("ℹ️ [useUpdateCartItem] Item not found, cache invalidated");
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