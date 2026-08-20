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
export function useProductOfferById(offerId: string | undefined) {
    return useQuery({
        queryKey: ["product-offer-by-id", offerId],
        enabled: !!offerId,
        queryFn: async () => {
            if (!offerId) return null;
            
            console.log("🔍 [useProductOfferById] Fetching offer via RPC:", offerId);
            
            // ✅ ✅ ✅ استخدام RPC مباشرة (بدلاً من 3 استعلامات منفصلة)
            const { data, error } = await supabase
                .rpc('get_product_offers_with_details', {
                    p_limit: 1,
                    p_offset: 0,
                    p_store_id: null,
                    p_category_id: null,
                    p_is_active: true
                });

            if (error) {
                console.error("❌ [useProductOfferById] RPC Error:", error);
                return null;
            }

            // ✅ البحث عن العرض بالـ ID في النتائج
            const offer = (data || []).find((item: any) => item.id === offerId);
            
            if (!offer) {
                console.log("ℹ️ [useProductOfferById] No offer found with ID:", offerId);
                return null;
            }

            console.log("✅ [useProductOfferById] Offer found via RPC:", offer.id);
            
            // ============================================================
            // ✅ ✅ ✅ نفس المنطق القديم بالضبط، ولكن مع بيانات RPC
            // ============================================================
            
            // ✅ استخراج المنتج الرئيسي من RPC (قد يكون مصفوفة أو كائن)
            let product = null;
            if (offer.products && Array.isArray(offer.products) && offer.products.length > 0) {
                product = offer.products[0];
            } else if (offer.products && !Array.isArray(offer.products)) {
                product = offer.products;
            }
            
            // ✅ تعيين المنتج الرئيسي (نفس الكود القديم)
            offer.products = product;

            // ============================================================
            // ✅ ✅ ✅ معالجة الهدية (نفس الكود القديم تماماً)
            // ============================================================
            let freeProduct = null;
            let freeVariations = [];

            // ✅ الحالة 1: BOGO بدون free_listing_id → الهدية = نفس المنتج (نفس الكود القديم)
            if (offer.offer_type === 'bogo' && !offer.free_listing_id) {
                freeProduct = product;
                
                if (product) {
                    if (offer.result_variation_ids && offer.result_variation_ids.length > 0) {
                        freeVariations = (product.variations || []).filter((v: any) =>
                            offer.result_variation_ids.includes(v.id)
                        );
                    } else {
                        freeVariations = product.variations || [];
                    }
                }
                
                console.log("🎁 [useProductOfferById] BOGO: Using same product as gift");
                console.log("🎨 [useProductOfferById] Free variations:", freeVariations.length);
            }
            // ✅ الحالة 2: يوجد free_listing_id محدد (نفس الكود القديم)
            else if (offer.free_listing_id) {
                // ✅ من RPC، free_product قد يكون مصفوفة أو كائن
                let freeData = null;
                if (offer.free_product && Array.isArray(offer.free_product) && offer.free_product.length > 0) {
                    freeData = offer.free_product[0];
                } else if (offer.free_product && !Array.isArray(offer.free_product)) {
                    freeData = offer.free_product;
                }
                
                if (freeData) {
                    freeProduct = freeData;
                    
                    if (offer.result_variation_ids && offer.result_variation_ids.length > 0) {
                        freeVariations = (freeData.variations || []).filter((v: any) =>
                            offer.result_variation_ids.includes(v.id)
                        );
                    } else {
                        freeVariations = freeData.variations || [];
                    }
                    
                    console.log("🎁 [useProductOfferById] Free product loaded:", freeData.title_ar);
                    console.log("🎨 [useProductOfferById] Free variations:", freeVariations.length);
                }
            }

            // ✅ إضافة free_product و free_variations إلى الـ offer (نفس الكود القديم)
            offer.free_product = freeProduct;
            offer.free_variations = freeVariations;

            console.log("✅ [useProductOfferById] Offer loaded:", offer.id);
            console.log("✅ [useProductOfferById] Product:", offer.products?.title_ar);
            console.log("✅ [useProductOfferById] Free product:", offer.free_product?.title_ar || "No free product");
            console.log("✅ [useProductOfferById] Free variations:", offer.free_variations?.length || 0);
            
            return offer;
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
export function useDeleteProductOffer() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("product_offers")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product-offer"] });
            queryClient.invalidateQueries({ queryKey: ["seller-offers"] });
            toast.success("✅ تم حذف العرض الترويجي بنجاح");
        },
        onError: (error: any) => {
            toast.error(`❌ فشل حذف العرض: ${error.message}`);
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