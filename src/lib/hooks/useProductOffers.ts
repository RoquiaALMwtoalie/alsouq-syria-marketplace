// src/lib/hooks/useProductOffers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ============================================================
// 📦 أنواع العروض
// ============================================================
export type OfferType = 'bogo' | 'cross_sell' | 'bundle';

export interface ProductOffer {
    id: string;
    listing_id: string;
    store_id: string;
    offer_type: OfferType;
    buy_quantity: number;
    get_quantity: number;
    free_listing_id: string | null;
    variation_ids: string[] | null;
    required_product_ids: string[] | null;
    required_variations: any;
    result_variation_ids: string[] | null;
    starts_at: string;
    expires_at: string | null;
    is_active: boolean;
    is_featured: boolean;
    featured_sort: number;
    display_text_ar: string | null;
    display_text_en: string | null;
    category_id: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================================
// 📦 جلب العرض النشط لمنتج معين
// ============================================================
export function useProductOffer(listingId: string | undefined, variationId?: string) {
    return useQuery({
        queryKey: ["product-offer", listingId, variationId],
        enabled: !!listingId,
        queryFn: async () => {
            if (!listingId) return null;
            
            const { data, error } = await supabase
                .rpc('get_active_bogo_offer', {
                    p_listing_id: listingId,
                    p_variation_id: variationId || null
                });

            if (error) {
                console.error("❌ [useProductOffer] Error:", error);
                return null;
            }

            return data as ProductOffer | null;
        },
        staleTime: 60 * 1000,
        retry: 1,
        gcTime: 5 * 60 * 1000,
    });
}

// ============================================================
// 📦 جلب العرض الترويجي بواسطة ID (لصفحة التفاصيل)
// ============================================================
// ============================================================
// 📦 جلب العرض الترويجي بواسطة ID (لصفحة التفاصيل) - ✅ تم التعديل
// ============================================================
// ============================================================
// ✅✅✅ النسخة المحسّنة - تستخدم RPC مع p_offer_id (جديدة)
// ============================================================
// ✅ تعديل useProductOfferByIdV2 لاستخدام الدالة الجديدة
export function useProductOfferByIdV2(offerId: string | undefined) {
    return useQuery({
        queryKey: ["product-offer-by-id-v2", offerId],
        enabled: !!offerId,
        queryFn: async () => {
            if (!offerId) return null;
            
            console.log("🔍 [useProductOfferByIdV2] Fetching offer with RPC:", offerId);
            
            // ✅ استخدام الدالة الجديدة (بدون تعارض)
            const { data, error } = await supabase
                .rpc('get_product_offer_by_id', {
                    p_offer_id: offerId  // ✅ دالة منفصلة
                });

            if (error) {
                console.error("❌ [useProductOfferByIdV2] RPC Error:", error);
                return null;
            }

            if (!data) {
                console.log("ℹ️ [useProductOfferByIdV2] No offer found:", offerId);
                return null;
            }

            console.log("✅ [useProductOfferByIdV2] Offer found:", data.id);
            console.log("🎁 [useProductOfferByIdV2] Free product:", data.free_product?.title_ar || 'No free product');
            
            return data;
        },
        staleTime: 60 * 1000,
        retry: 1,
        gcTime: 5 * 60 * 1000,
    });
}
// ============================================================
// 📦 جلب جميع عروض البائع (محسّن لجلب كل التفاصيل)
// ============================================================
export function useSellerOffers(storeId: string | undefined) {
    return useQuery({
        queryKey: ["seller-offers", storeId],
        enabled: !!storeId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("product_offers")
                .select(`
                    *,
                    category:category_id (
                        id,
                        name_ar,
                        name_en,
                        slug,
                        icon,
                        image_url
                    ),
                    listings:listing_id (
                        id,
                        title_ar,
                        title_en,
                        description_ar,
                        description_en,
                        price,
                        old_price,
                        discount_percent,
                        cover_url,
                        currency,
                        is_available,
                        rating,
                        owner_id,
                        category_id,
                        colors:product_colors (
                            id,
                            color_name_ar,
                            color_name_en,
                            color_hex,
                            image_url
                        ),
                        variations:product_variations (
                            id,
                            sku,
                            combination,
                            price,
                            old_price,
                            stock_quantity,
                            image_url,
                            is_active
                        ),
                        profiles!fk_listings_owner_id (
                            id,
                            full_name,
                            store_name,
                            store_logo_url,
                            store_cover_url,
                            avatar_url
                        )
                    ),
                    free_listing:free_listing_id (
                        id,
                        title_ar,
                        title_en,
                        description_ar,
                        description_en,
                        price,
                        old_price,
                        discount_percent,
                        cover_url,
                        currency,
                        is_available,
                        rating,
                        owner_id,
                        category_id,
                        colors:product_colors (
                            id,
                            color_name_ar,
                            color_name_en,
                            color_hex,
                            image_url
                        ),
                        variations:product_variations (
                            id,
                            sku,
                            combination,
                            price,
                            old_price,
                            stock_quantity,
                            image_url,
                            is_active
                        ),
                        profiles!fk_listings_owner_id (
                            id,
                            full_name,
                            store_name,
                            store_logo_url,
                            store_cover_url,
                            avatar_url
                        )
                    )
                `)
                .eq("store_id", storeId!)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("❌ Error fetching seller offers:", error);
                throw error;
            }
            
            console.log("✅ [useSellerOffers] Found offers:", data?.length || 0);
            
            // ✅ تحويل البيانات لتشمل تفاصيل الهدية والفيرنتات
            const offersWithDetails = (data || []).map((offer: any) => {
                // ✅ التأكد من أن result_variation_ids موجودة
                const resultVariationIds = offer.result_variation_ids || [];
                const variationIds = offer.variation_ids || [];
                
                // ✅ إذا كان العرض من نوع BOGO والهدية null، نستخدم نفس المنتج
                if (offer.offer_type === 'bogo' && !offer.free_listing_id) {
                    // في BOGO، الهدية هي نفس المنتج الأساسي
                    return {
                        ...offer,
                        result_variation_ids: resultVariationIds,
                        variation_ids: variationIds,
                        free_listing: offer.listings || null,
                    };
                }
                
                return {
                    ...offer,
                    result_variation_ids: resultVariationIds,
                    variation_ids: variationIds,
                };
            });
            
            console.log("✅ [useSellerOffers] Offers with details:", offersWithDetails.length);
            return offersWithDetails || [];
        },
    });
}

// ============================================================
// 📦 إنشاء عرض جديد
// ============================================================
export function useCreateProductOffer() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: any) => {
            const { data: result, error } = await supabase
                .from("product_offers")
                .insert({
                    listing_id: data.listing_id,
                    store_id: data.store_id,
                    offer_type: data.offer_type,
                    buy_quantity: data.buy_quantity,
                    get_quantity: data.get_quantity,
                    free_listing_id: data.free_listing_id || null,
                    variation_ids: data.variation_ids || null,
                    required_product_ids: data.required_product_ids || null,
                    required_variations: data.required_variations || [],
                    result_variation_ids: data.result_variation_ids || null,
                    starts_at: data.starts_at || new Date().toISOString(),
                    expires_at: data.expires_at || null,
                    is_active: data.is_active ?? true,
                    display_text_ar: data.display_text_ar || null,
                    display_text_en: data.display_text_en || null,
                    category_id: data.category_id || null,
                    metadata: data.metadata || {}
                })
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-offer"] });
            queryClient.invalidateQueries({ queryKey: ["seller-offers"] });
            toast.success("✅ تم إضافة العرض الترويجي بنجاح");
        },
        onError: (error: any) => {
            toast.error(`❌ فشل إضافة العرض: ${error.message}`);
        },
    });
}

// ============================================================
// 📦 حذف عرض
// ============================================================
// ============================================================
// 📦 حذف عرض - ✅✅✅ النسخة المحسّنة مع logs
// ============================================================
export function useDeleteProductOffer() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            console.log("🔴 [useDeleteProductOffer.mutationFn] ===== START =====");
            console.log("🔴 [useDeleteProductOffer.mutationFn] offerId:", id);
            console.log("🔴 [useDeleteProductOffer.mutationFn] typeof id:", typeof id);
            
            // ✅ التحقق من صحة الـ ID
            if (!id) {
                console.error("❌ [useDeleteProductOffer.mutationFn] ID is empty or null");
                throw new Error("Offer ID is required");
            }
            
            if (id.length < 10) {
                console.error("❌ [useDeleteProductOffer.mutationFn] ID seems invalid (too short):", id);
                throw new Error("Invalid offer ID");
            }
            
            console.log("🔄 [useDeleteProductOffer.mutationFn] Calling supabase delete...");
            console.log("🔄 [useDeleteProductOffer.mutationFn] Query:", `product_offers.delete().eq('id', '${id}')`);
            
            try {
                const { data, error } = await supabase
                    .from("product_offers")
                    .delete()
                    .eq("id", id)
                    .select(); // ✅ إضافة .select() لمعرفة ما تم حذفه

                console.log("📦 [useDeleteProductOffer.mutationFn] Supabase response received");
                console.log("📦 [useDeleteProductOffer.mutationFn] data:", data);
                console.log("📦 [useDeleteProductOffer.mutationFn] error:", error);
                
                if (error) {
                    console.error("❌ [useDeleteProductOffer.mutationFn] Supabase error:", error);
                    console.error("❌ [useDeleteProductOffer.mutationFn] Error code:", error.code);
                    console.error("❌ [useDeleteProductOffer.mutationFn] Error message:", error.message);
                    console.error("❌ [useDeleteProductOffer.mutationFn] Error details:", error.details);
                    console.error("❌ [useDeleteProductOffer.mutationFn] Error hint:", error.hint);
                    
                    // ✅ رمي الخطأ مع رسالة واضحة
                    throw new Error(`Supabase delete error: ${error.message} (code: ${error.code})`);
                }
                
                // ✅ التحقق من أن شيئاً ما تم حذفه
                if (!data || data.length === 0) {
                    console.warn("⚠️ [useDeleteProductOffer.mutationFn] No rows were deleted");
                    console.warn("⚠️ [useDeleteProductOffer.mutationFn] This might mean the offer doesn't exist or you don't have permission");
                    
                    // ✅ حاول التحقق من وجود العرض أولاً
                    console.log("🔍 [useDeleteProductOffer.mutationFn] Checking if offer exists...");
                    const { data: checkData, error: checkError } = await supabase
                        .from("product_offers")
                        .select("id, store_id")
                        .eq("id", id)
                        .maybeSingle();
                    
                    console.log("🔍 [useDeleteProductOffer.mutationFn] Check result:", checkData);
                    console.log("🔍 [useDeleteProductOffer.mutationFn] Check error:", checkError);
                    
                    if (!checkData) {
                        throw new Error(`Offer with ID ${id} not found in database`);
                    }
                    
                    console.warn("⚠️ [useDeleteProductOffer.mutationFn] Offer exists but delete returned no rows. Check RLS policies.");
                } else {
                    console.log("✅ [useDeleteProductOffer.mutationFn] Successfully deleted offer:", data[0]?.id);
                }
                
                console.log("✅ [useDeleteProductOffer.mutationFn] ===== SUCCESS =====");
                return { success: true, deleted: data };
                
            } catch (error: any) {
                console.error("❌ [useDeleteProductOffer.mutationFn] ===== ERROR IN MUTATION =====");
                console.error("❌ [useDeleteProductOffer.mutationFn] Error:", error);
                console.error("❌ [useDeleteProductOffer.mutationFn] Error message:", error?.message);
                console.error("❌ [useDeleteProductOffer.mutationFn] Error stack:", error?.stack);
                throw error; // ✅ إعادة رمي الخطأ
            }
        },
        onSuccess: (data, variables) => {
            console.log("✅ [useDeleteProductOffer.onSuccess] Offer deleted successfully:", variables);
            console.log("✅ [useDeleteProductOffer.onSuccess] Deleted data:", data);
            
            queryClient.invalidateQueries({ queryKey: ["product-offer"] });
            queryClient.invalidateQueries({ queryKey: ["seller-offers"] });
            queryClient.invalidateQueries({ queryKey: ["listings"] });
            
            // ✅ ✅ ✅ إزالة الـ toast من هنا لمنع التكرار
            // toast.success("✅ تم حذف العرض الترويجي بنجاح");
        },
        onError: (error: any, variables) => {
            console.error("❌ [useDeleteProductOffer.onError] ===== MUTATION ERROR =====");
            console.error("❌ [useDeleteProductOffer.onError] variables:", variables);
            console.error("❌ [useDeleteProductOffer.onError] error:", error);
            console.error("❌ [useDeleteProductOffer.onError] error type:", typeof error);
            console.error("❌ [useDeleteProductOffer.onError] error message:", error?.message);
            console.error("❌ [useDeleteProductOffer.onError] error stack:", error?.stack);
            
            // ✅ عرض رسالة خطأ للمستخدم
            const errorMessage = error?.message || "فشل حذف العرض الترويجي";
            toast.error(`❌ ${errorMessage}`);
        },
    });
}

// ============================================================
// 📦 تحديث عرض
// ============================================================
export function useUpdateProductOffer() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, ...data }: any) => {
            const { data: result, error } = await supabase
                .from("product_offers")
                .update({
                    offer_type: data.offer_type,
                    buy_quantity: data.buy_quantity,
                    get_quantity: data.get_quantity,
                    free_listing_id: data.free_listing_id || null,
                    variation_ids: data.variation_ids || null,
                    required_product_ids: data.required_product_ids || null,
                    required_variations: data.required_variations || [],
                    result_variation_ids: data.result_variation_ids || null,
                    starts_at: data.starts_at,
                    expires_at: data.expires_at,
                    is_active: data.is_active,
                    display_text_ar: data.display_text_ar || null,
                    display_text_en: data.display_text_en || null,
                    category_id: data.category_id || null,
                    updated_at: new Date().toISOString(),
                    metadata: data.metadata || {}
                })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-offer"] });
            queryClient.invalidateQueries({ queryKey: ["seller-offers"] });
            toast.success("✅ تم تحديث العرض الترويجي بنجاح");
        },
        onError: (error: any) => {
            toast.error(`❌ فشل تحديث العرض: ${error.message}`);
        },
    });
}

// ============================================================
// 📦 التحقق من تطابق الفيرنتات مع العرض
// ============================================================
export function useCheckOfferVariationMatch() {
    return useMutation({
        mutationFn: async ({ offerId, variationId }: { offerId: string; variationId: string }) => {
            const { data, error } = await supabase
                .rpc('check_offer_variation_match', {
                    p_offer_id: offerId,
                    p_variation_id: variationId
                });

            if (error) throw error;
            return data as boolean;
        },
    });
}