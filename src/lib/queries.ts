import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StoreService, DeleteStoreResult } from "@/lib/services/StoreService";
import { 
  NOTIFICATION_TYPES as NOTIFICATION_TYPES_V2, 
  NOTIFICATION_CONFIG as NOTIFICATION_CONFIG_V2, 
  NotificationType as NotificationTypeV2 
} from "@/types/notificationTypes";
import { channelManager } from "@/lib/channelManager";
import { useEffect, useRef } from "react";
import type { ListingRow, ListingKind, ListingWithRelations } from "@/types";
import { DeliveryCompany, Distributor, DeliveryOrder, calculateDeliveryFee } from "@/types/delivery";
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markConversationAsRead,
  getUnreadMessagesCount,
  deleteConversation,
} from "./messages";
export type ListingKind =
  | "product" | "property" | "vehicle" | "service" | "food"
  | "travel" | "health" | "beauty" | "farm" | "tourism";
export type ListingStatus = "draft" | "pending" | "published" | "archived";

export type ListingRow = {
  id: string;
  owner_id: string;
  kind: ListingKind;
  category_id: string | null;
  governorate_id: string | null;
  title_ar: string;
  title_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  currency: string;
  cover_url: string | null;
  status: ListingStatus;
  rating: number;
  views: number;
  created_at: string;
  updated_at: string;
  // extended fields
  is_offer?: boolean;
  is_available?: boolean;
  // ❌ تم إزالة price_usd
  old_price?: number | null;
  discount_percent?: number | null;

  payment_method?: string | null;
  delivery_note?: string | null;
};

export type ListingWithRelations = ListingRow & {
  categories?: { slug: string; name_ar: string; name_en: string } | null;
  governorates?: { slug: string; name_ar: string; name_en: string } | null;
  listing_images?: { url: string; sort_order: number }[];
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    bio: string | null;
    store_name: string | null;
    store_logo_url: string | null;
    store_cover_url: string | null;
    allows_messaging: boolean;
    allows_bookings: boolean;
    store_online: boolean;
    store_opens_at: string | null;
    store_closes_at: string | null;
  } | null;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  icon: string | null;
  sort_order: number;
  active?: boolean;
  image_url?: string | null;
  accent_from?: string | null;
  accent_to?: string | null;
};
// ============================================================
// 📦 أنواع خيارات المنتج (Product Options)
// ============================================================
export interface ProductOption {
  id: string;
  listing_id: string;
  option_type: 'color' | 'size' | 'model' | 'material' | 'weight' | 'style' | 'brand';
  option_value: string;
  option_label_ar?: string;
  option_label_en?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ✅ تأكد من وجود old_price في الـ type
export interface ProductVariation {
  id: string;
  listing_id: string;
  sku: string;
  combination: Record<string, string>;
  price: number;
  old_price?: number | null;  // ✅ هذا السطر
  stock_quantity: number;
  reserved_quantity: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


// ============================================================
// 📦 أنواع ألوان المنتج (Product Colors)
// ============================================================
export interface ProductColor {
  id: string;
  listing_id: string;
  color_name_ar: string;
  color_name_en?: string;
  color_hex?: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductColorVariation {
  id: string;
  listing_id: string;
  color_id: string;
  size: string;
  is_available: boolean;
  sku?: string;
  created_at: string;
  color?: ProductColor;
}
/* ---------- Categories & Governorates ---------- */

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*" as any).order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as CategoryRow[];
  },
  staleTime: 5 * 60 * 1000,
});

export const governoratesQuery = queryOptions({
  queryKey: ["governorates"],
  queryFn: async () => {
    const { data, error } = await supabase.from("governorates").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 5 * 60 * 1000,
});

export function useCategories() { return useQuery(categoriesQuery); }
export function useGovernorates() { return useQuery(governoratesQuery); }

/* ---------- Listings ---------- */
// ✅ جلب منتجات مشابهة بناءً على التصنيف
// src/lib/queries.ts

export function useSimilarListings(categoryId: string | undefined, currentId: string | undefined, limit = 4) {
  return useQuery({
    queryKey: ["listings", "similar", categoryId, currentId, limit],
    enabled: !!categoryId && !!currentId,
    queryFn: async () => {
      console.log("📡 [useSimilarListings] Fetching similar listings...");
      
      // ✅ نطلب عدداً زائداً بواقع عنصر واحد لتعويض العنصر المستبعد (المنتج الحالي)
      const { data, error } = await supabase
        .rpc('get_public_products_with_variations', {
          p_limit: limit + 1, 
          p_offset: 0,
          p_sort: 'rating',
          p_is_offer: null,
          p_category_id: categoryId,
          p_is_featured: null // 👈 تمرير المعامل السادس لتتوافق الدالة مع التحديث الأخير تماماً
        });
      
      if (error) {
        console.error("❌ [useSimilarListings] RPC Error:", error);
        throw error;
      }
      
      const listings = Array.isArray(data) ? data : [];
      
      // استبعاد المنتج الحالي وقص القائمة لتطابق الـ limit المطلوب تماماً
      const filtered = listings
        .filter((item: any) => item.id !== currentId)
        .slice(0, limit);
      
      console.log(`✅ [useSimilarListings] Found ${filtered.length} similar listings`);
      
      return filtered;
    },
  });
}
export type ListingsFilter = {
  kind?: ListingKind;
  categorySlug?: string;
  governorateSlug?: string;
  search?: string;
  ownerId?: string;
  limit?: number;
  isOffer?: boolean;
  sort?: "recent" | "rating" | "cheapest" | "popular";
};

// Helper function to fetch profiles for listings
async function fetchProfilesForListings(listings: any[]) {
  if (!listings || listings.length === 0) return {};
  
  const ownerIds = Array.from(new Set(listings.map((l: any) => l.owner_id).filter(Boolean)));
  if (ownerIds.length === 0) return {};
  
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, phone, bio, store_name, store_logo_url, store_cover_url, allows_messaging, allows_bookings, store_online, store_opens_at, store_closes_at")
    .in("id", ownerIds);
  
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  return Object.fromEntries(profileMap);
}

// src/lib/queries.ts - تعديل useListings

// src/lib/queries.ts

// src/lib/queries.ts

export function useListings(filter: ListingsFilter = {}) {
  return useQuery({
    queryKey: ["listings", filter],
    queryFn: async () => {
      console.log("🔍 [useListings] START - Filter:", filter);
      
      let categoryId = null;
      if (filter.categorySlug) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filter.categorySlug)
          .maybeSingle();
        categoryId = category?.id || null;
      }
      
      const { data, error } = await supabase
        .rpc('get_public_products_with_variations', {
          p_limit: filter.limit || 12,
          p_offset: filter.page ? (filter.page - 1) * (filter.limit || 12) : 0,
          p_sort: filter.sort || 'recent',
          p_is_offer: filter.isOffer || null,
          p_category_id: categoryId,
          p_is_featured: filter.isFeatured || null
        });
      
      if (error) {
        console.error("❌ [useListings] RPC Error:", error);
        throw error;
      }
      
      let listings = Array.isArray(data) ? data : [];
      
      // ✅ ✅ ✅ فلترة حسب owner_id (بدون تغيير الدالة)
      if (filter.ownerId) {
        listings = listings.filter((item: any) => item.owner_id === filter.ownerId);
        console.log(`🔍 [useListings] Filtered by ownerId: ${filter.ownerId}, found ${listings.length} listings`);
      }
      
      console.log(`📊 [useListings] Total listings: ${listings.length}`);
      
      listings.forEach((item: any, index: number) => {
        const variations = item.variations || [];
        const colors = item.colors || [];
        const options = item.options || [];
        
        console.log(`📦 Product ${index + 1}: ${item.title_ar}`);
        console.log(`   ✅ Variations: ${variations.length}`);
        console.log(`   ✅ Colors: ${colors.length}`);
        console.log(`   ✅ Options: ${options.length}`);
        
        if (variations.length > 0) {
          console.log(`   🔍 First variation:`, JSON.stringify(variations[0], null, 2));
        }
      });
      
      const featured = listings.find((item: any) => item.is_featured === true);
      if (featured) {
        console.log('⭐ [useListings] Featured product:', featured.title_ar);
        console.log('⭐ [useListings] Featured variations:', featured.variations?.length || 0);
      }
      
      return {
        data: listings,
        count: listings.length,
        totalPages: filter.limit ? Math.ceil(listings.length / filter.limit) : 1,
      };
    },
  });
}
// src/lib/queries.ts
// src/lib/queries.ts

// ✅ 1. فصل الـ queryFn
// src/lib/queries.ts

// src/lib/queries.ts

// src/lib/queries.ts

const fetchMyListings = async (ownerId: string) => {
    console.log("🔄 [fetchMyListings] Called at:", new Date().toISOString());
  console.trace(); // ✅ هذا يظهر أين تم الاستدعاء
  console.log("🔄 [fetchMyListings] Fetching listings for user:", ownerId);
  
  if (!ownerId) {
    console.log("⚠️ [fetchMyListings] No ownerId provided");
    return [];
  }
  
  // ✅ ✅ ✅ استخدم RPC بدلاً من الاستعلام المباشر
  const { data, error } = await supabase
    .rpc('get_listings_with_variations', {
      p_owner_id: ownerId
    });
  
  if (error) {
    console.error("❌ [fetchMyListings] RPC Error:", error);
    throw error;
  }
  
  const listings = Array.isArray(data) ? data : [];
  
  console.log(`✅ [fetchMyListings] Found ${listings.length} listings`);
  
  if (listings.length > 0) {
    const firstListing = listings[0];
    console.log("🔍 [fetchMyListings] First listing:", {
      id: firstListing.id,
      title: firstListing.title_ar,
      price: firstListing.price,
      variationsCount: firstListing.variations?.length || 0,
      variationsWithPrices: firstListing.variations?.map((v: any) => ({
        id: v.id,
        price: v.price,
        combination: v.combination
      })),
      colorsCount: firstListing.colors?.length || 0,
      optionsCount: firstListing.options?.length || 0,
    });
    
    // ✅ معالجة البيانات للتوافق
    const processedListings = listings.map((listing: any) => {
      // ✅ تحويل variations
      const variationsWithAvailability = listing.variations?.map((v: any) => ({
        ...v,
        is_available: v.is_available !== undefined ? v.is_available : v.is_active !== false,
        price: v.price || 0,
      })) || [];
      
      // ✅ تحويل sizes من options
      const sizesFromOptions = listing.options
        ?.filter((opt: any) => opt.option_type === 'size')
        .map((opt: any) => opt.option_value) || [];
      
      return {
        ...listing,
        variations: variationsWithAvailability,
        sizes: sizesFromOptions,
        image_urls: listing.images?.map((img: any) => img.url) || [],
        listing_images: listing.images || [],
      };
    });
    
    return processedListings;
  }
  
  return [];
};
// ✅ باقي الكود كما هو
// src/lib/queries.ts

export const myListingsQueryOptions = (ownerId: string | undefined) => 
  queryOptions({
    queryKey: ["listings", "my", ownerId].filter(Boolean),
    enabled: !!ownerId && ownerId.length > 0 && ownerId !== "undefined",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    queryFn: async () => {
      if (!ownerId) throw new Error("ownerId is required");
      return fetchMyListings(ownerId);
    },
  });

export function useMyListings(ownerId: string | undefined) {
  return useQuery(myListingsQueryOptions(ownerId));
}

// src/lib/queries.ts

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ["listing", id],
    enabled: !!id,
    queryFn: async () => {
      console.log("🚀 [useListing] Fetching product:", id);
      
      // ✅ استخدم الدالة الخاصة لمنتج واحد
      const { data, error } = await supabase
        .rpc('get_product_details', {
          p_product_id: id
        });
      
      if (error) {
        console.error("❌ [useListing] RPC Error:", error);
        throw error;
      }
      
      if (data?.error) {
        console.error("❌ [useListing] Product error:", data.error);
        return null;
      }
      
      console.log("✅ [useListing] Product found:", data?.title_ar);
      console.log("✅ [useListing] Variations count:", data?.variations?.length || 0);
      
      // 🔍🔍🔍 DEBUG: تحقق من الـ combination قبل أي تعديل
      console.log("🔍🔍🔍 [useListing] ===== RAW DATA FROM RPC =====");
      console.log("🔍🔍🔍 [useListing] Full data:", JSON.stringify(data, null, 2));
      
      if (data?.variations && data.variations.length > 0) {
        console.log("🔍🔍🔍 [useListing] First variation (RAW):", data.variations[0]);
        console.log("🔍🔍🔍 [useListing] First combination (RAW):", data.variations[0]?.combination);
        console.log("🔍🔍🔍 [useListing] Keys from first combination:", Object.keys(data.variations[0]?.combination || {}));
      }
      
      console.log("🔍🔍🔍 [useListing] ===== END RAW DATA =====");
      
      // ✅ ✅ ✅ تأكد من إرجاع البيانات كما هي دون أي تعديل
      return data;
    },
  });
}
export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<ListingRow> & { title_ar: string; kind: ListingKind; owner_id: string; image_urls?: string[] }) => {
      const { image_urls, ...listingInput } = input;
      const payload = { ...listingInput, status: "pending" as any };
      const { data, error } = await supabase.from("listings").insert(payload as any).select().single();
      if (error) throw error;
      
      const urls = Array.from(new Set((image_urls ?? []).map((url) => url.trim()).filter(Boolean)));
      if (urls.length) {
        const { error: imagesError } = await supabase.from("listing_images").insert(
          urls.map((url, index) => ({ listing_id: (data as any).id, url, sort_order: index })) as any,
        );
        if (imagesError) throw imagesError;
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}
// src/lib/queries.ts

// ============================================================
// 📦 ALL DEALS - جميع العروض
// ============================================================

export function useAllDeals(limit = 12) {
  return useQuery({
    queryKey: ["listings", "deals", limit],
    queryFn: async () => {
      console.log("📡 [useAllDeals] Fetching deals...");
      
      const { data, error } = await supabase
        .rpc('get_public_products_with_variations', {
          p_limit: limit,
          p_offset: 0,
          p_sort: 'discount_desc',
          p_is_offer: true,  // ✅ فقط العروض
          p_category_id: null,
          p_is_featured: null // 👈 إضافة المعامل السادس المفقود لتتطابق تماماً مع الدالة في قاعدة البيانات
        });
      
      if (error) {
        console.error("❌ [useAllDeals] RPC Error:", error);
        throw error;
      }
      
      const listings = Array.isArray(data) ? data : [];
      console.log(`✅ [useAllDeals] Found ${listings.length} deals`);
      
      if (listings.length > 0) {
        console.log("🔍 [useAllDeals] First deal variations:", listings[0]?.variations?.length || 0);
      }
      
      return {
        data: listings,
        count: listings.length,
        totalPages: limit ? Math.ceil(listings.length / limit) : 1,
      };
    },
  });
}
export function useUpdateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ListingRow> }) => {
      const { data, error } = await supabase.from("listings").update(patch as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

/* ---------- Favorites ---------- */

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("listing_id, listings(*, categories(slug, name_ar, name_en), governorates(slug, name_ar, name_en), listing_images(url, sort_order))")
        .eq("user_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, listingId, isFav }: { userId: string; listingId: string; isFav: boolean }) => {
      if (isFav) {
        const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("listing_id", listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("favorites").insert({ user_id: userId, listing_id: listingId });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

/* ---------- Reviews ---------- */

export function useListingReviews(listingId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", listingId],
    enabled: !!listingId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, created_at, user_id")
        .eq("listing_id", listingId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data?.length) return [];
      const ids = Array.from(new Set(data.map((r) => r.user_id)));
      const { data: profs } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", ids);
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      return data.map((r) => ({ ...r, profile: map.get(r.user_id) ?? null }));
    },
  });
}

// src/lib/queries.ts

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { 
      listing_id: string; 
      user_id: string; 
      rating: number;
      order_id?: string; // ✅ ربط التقييم بالطلب
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          listing_id: input.listing_id,
          user_id: input.user_id,
          rating: input.rating,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.listing_id] });
      qc.invalidateQueries({ queryKey: ["listing", variables.listing_id] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      
      toast.success(
        "⭐ تم تقييم المنتج بنجاح!",
        { duration: 3000 }
      );
    },
  });
}
/* ---------- Orders ---------- */

// src/lib/queries.ts

export function useMyOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            listing_id,
            quantity,
            price,
            currency,
            variation_combination,
            listings (
              id,
              title_ar,
              title_en,
              cover_url,
              owner_id,
              profile:profiles!owner_id (
                id,
                store_name,
                full_name,
                store_logo_url,
                store_phone
              )
            )
          ),
          listings (
            id,
            title_ar,
            title_en,
            cover_url,
            profile:profiles!owner_id (
              id,
              store_name,
              full_name,
              store_logo_url,
              store_phone
            )
          )
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // ✅ تحويل البيانات للتوافق مع الواجهة القديمة
      const transformedData = data?.map((order: any) => {
        // ✅ حساب الإجمالي الكامل إذا لم يكن موجوداً
        const totalWithDelivery = order.total_with_delivery ?? 
          (Number(order.total || 0) + Number(order.delivery_fee || 0) - Number(order.promo_discount || 0));
        
        // إذا كان عندنا order_items، استخدمها
        if (order.order_items && order.order_items.length > 0) {
          return {
            ...order,
            total_with_delivery: totalWithDelivery,  // ✅ أضف هذا
            // أول منتج في order_items يكون الرئيسي (للتوافق)
            listing_id: order.order_items[0]?.listing_id,
            quantity: order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0),
            total: order.order_items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
            // تجميع listings من order_items
            listings: order.order_items[0]?.listings || order.listings,
          };
        }
        // إذا كان الطلب قديماً (بدون order_items)
        return {
          ...order,
          total_with_delivery: totalWithDelivery,  // ✅ أضف هذا
        };
      });
      
      return transformedData ?? [];
    },
  });
}
// src/lib/queries.ts

// src/lib/queries.ts

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { 
      buyer_id: string; 
      seller_id: string; 
      items: Array<{
        listing_id: string;
        quantity: number;
        price: number;
        currency?: string;
      }>;
      total: number; 
      notes?: string;
      governorate_id?: string;
      delivery_address?: string;
      delivery_lat?: number;
      delivery_lng?: number;
      buyer_name?: string;   // ✅ جديد
      buyer_phone?: string;  // ✅ جديد
    }) => {
      
      // ✅ 1. جلب اسم المستخدم من profiles إذا ما تم إرساله
      let buyerName = input.buyer_name;
      let buyerPhone = input.buyer_phone;
      
      if (!buyerName || !buyerPhone) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", input.buyer_id)
          .maybeSingle();
        
        if (profile) {
          buyerName = buyerName || profile.full_name || 'عميل';
          buyerPhone = buyerPhone || profile.phone || '';
        }
      }
      
      // ✅ 2. إنشاء الطلب الرئيسي
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: input.buyer_id,
          seller_id: input.seller_id,
          total: input.total,
          notes: input.notes || null,
          governorate_id: input.governorate_id || null,
          delivery_address: input.delivery_address || null,
          delivery_lat: input.delivery_lat || null,
          delivery_lng: input.delivery_lng || null,
          buyer_name: buyerName,        // ✅ اسم المستخدم
          buyer_phone: buyerPhone,      // ✅ رقم المستخدم
          status: 'pending',
          currency: input.items[0]?.currency || 'SYP',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (orderError) throw orderError;

      // ✅ 3. إضافة المنتجات إلى order_items
      const orderItems = input.items.map((item) => ({
        order_id: order.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency || 'SYP',
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return {
        ...order,
        order_items: orderItems,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
/* ---------- Bookings ---------- */

export function useMyBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ["bookings", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, listings(title_ar, title_en, cover_url)")
        .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { customer_id: string; provider_id: string; listing_id: string; starts_at: string; ends_at?: string; guests?: number; total: number; notes?: string }) => {
      const { data, error } = await supabase.from("bookings").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}
/* ---------- Bookings ---------- */

export async function cancelBooking(bookingId: string, userId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq("id", bookingId)
    .eq("customer_id", userId) // تأكد إنو المستخدم يملك الحجز
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ✅ React Query Hook لإلغاء الحجز
export function useCancelBooking() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, userId }: { bookingId: string; userId: string }) => {
      return await cancelBooking(bookingId, userId);
    },
    onSuccess: (_, variables) => {
      // ✅ تحديث cache الحجوزات
      qc.invalidateQueries({ queryKey: ["bookings", variables.userId] });
      qc.invalidateQueries({ queryKey: ["bookings"] });
      
      toast.success(
        "✅ تم إلغاء الحجز بنجاح",
        { duration: 3000 }
      );
    },
    onError: (error: any) => {
      console.error("Error cancelling booking:", error);
      toast.error(
        "❌ فشل إلغاء الحجز، حاول مرة أخرى",
        { duration: 3000 }
      );
    },
  });
}
export function useSellerCustomers(sellerId: string | undefined) {
  return useQuery({
    queryKey: ["seller-customers", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("orders")
        .select("buyer_id, total, created_at")
        .eq("seller_id", sellerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const stats = new Map<string, { orders: number; spend: number; last_order: string | null }>();
      for (const row of rows ?? []) {
        const key = (row as any).buyer_id as string;
        const current = stats.get(key) ?? { orders: 0, spend: 0, last_order: null };
        current.orders += 1;
        current.spend += Number((row as any).total) || 0;
        current.last_order = current.last_order ?? ((row as any).created_at as string);
        stats.set(key, current);
      }
      const ids = Array.from(stats.keys());
      if (!ids.length) return [] as any[];
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, phone, avatar_url").in("id", ids);
      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return ids.map((id) => ({ id, ...(profileMap.get(id) ?? {}), ...stats.get(id) })).sort((a, b) => b.spend - a.spend);
    },
  });
}

export function useSellerReviews(sellerId: string | undefined) {
  return useQuery({
    queryKey: ["seller-reviews", sellerId],
    enabled: !!sellerId,
    queryFn: async () => {
      const { data: listings, error: listingError } = await supabase
        .from("listings")
        .select("id, title_ar, title_en, cover_url")
        .eq("owner_id", sellerId!);
      if (listingError) throw listingError;
      const ids = (listings ?? []).map((l: any) => l.id as string);
      if (!ids.length) return [] as any[];
      
      // ✅ حدد الأعمدة المطلوبة فقط (بدون comment)
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("id, rating, user_id, created_at, listing_id") // ✅ بدون comment
        .in("listing_id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      const userIds = Array.from(new Set((reviews ?? []).map((r: any) => r.user_id as string)));
      const { data: profiles } = userIds.length
        ? await supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds)
        : { data: [] as any[] };
      const listingMap = new Map((listings ?? []).map((l: any) => [l.id, l]));
      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return (reviews ?? []).map((review: any) => ({ 
        ...review, 
        listing: listingMap.get(review.listing_id), 
        profile: profileMap.get(review.user_id) 
      }));
    },
  });
}
/* ---------- Profile ---------- */



export function useProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  // ✅ استخدام مدير القنوات المركزي
  useEffect(() => {
    if (!userId) return;

    const channelName = `profile-${userId}`;

    // ✅ الاشتراك في القناة مع رد اتصال واحد
    const unsubscribe = channelManager.subscribe(channelName, (payload) => {
      queryClient.setQueryData(['profile', userId], payload.new);
      console.log('✅ Profile updated in realtime:', payload.new);
    });

    return unsubscribe;
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          governorate:governorate_id (
            id,
            name_ar,
            name_en
          )
        `)
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { data, error } = await supabase.from("profiles").update(patch as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["profile", v.id] }),
  });
}

/* ---------- Seller applications (admin approval flow) ---------- */

export type SellerApplication = {
  id: string;
  user_id: string;
  store_name: string;
  store_description: string | null;
  store_phone: string | null;
  store_logo_url?: string | null;
  store_cover_url?: string | null;
  allows_messaging?: boolean;
  allows_bookings?: boolean;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // ✅ الحقول الجديدة
  store_type?: string;
  governorate_id?: string | null;
  address?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  weekly_off_days?: string[];
  application_type?: string;
  // ✅ العلاقات
  governorate?: {
    id: string;
    name_ar: string;
    name_en: string;
  } | null;
};

export function useMySellerApplication(userId?: string) {
  return useQuery({
    queryKey: ["seller_application", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_applications" as any)
        .select(`
          *,
          governorate:governorate_id (
            id,
            name_ar,
            name_en
          )
        `)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as SellerApplication) ?? null;
    },
  });
}
export function useBecomeSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { 
      userId: string; 
      store_name: string; 
      store_description?: string; 
      store_phone?: string; 
      store_logo_url?: string; 
      store_cover_url?: string; 
      allows_messaging?: boolean; 
      allows_bookings?: boolean;
      // ✅ الحقول الجديدة
      store_type?: string;
      governorate_id?: string;
      address?: string | null;
      opening_time?: string;
      closing_time?: string;
      weekly_off_days?: string[];
      application_type?: string; // ✅ أضف هذا السطر
    }) => {
      const { error } = await supabase.from("seller_applications" as any).insert({
        user_id: input.userId,
        store_name: input.store_name,
        store_description: input.store_description ?? null,
        store_phone: input.store_phone ?? null,
        store_logo_url: input.store_logo_url ?? null,
        store_cover_url: input.store_cover_url ?? null,
        allows_messaging: input.allows_messaging ?? true,
        allows_bookings: input.allows_bookings ?? false,
        // ✅ الحقول الجديدة
        store_type: input.store_type ?? 'online',
        governorate_id: input.governorate_id ?? null,
        address: input.address ?? null,
        opening_time: input.opening_time ?? null,
        closing_time: input.closing_time ?? null,
        weekly_off_days: input.weekly_off_days ?? [],
        application_type: input.application_type ?? 'store', // ✅ أضف هذا السطر
      } as any);
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["seller_application", v.userId] });
    },
  });
}

// src/lib/queries.ts

export function useUpdateStorePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      allows_messaging,
      allows_bookings,
      store_online,
      store_opens_at,
      store_closes_at,
      store_type,
      governorate_id,
      store_address,
      weekly_off_days,
      notifications_enabled, // ✅ جديد
    }: {
      userId: string;
      allows_messaging?: boolean;
      allows_bookings?: boolean;
      store_online?: boolean;
      store_opens_at?: string | null;
      store_closes_at?: string | null;
      store_type?: string;
      governorate_id?: string | null;
      store_address?: string | null;
      weekly_off_days?: string[];
      notifications_enabled?: boolean; // ✅ جديد
    }) => {
      const patch: any = {};
      if (typeof allows_messaging === "boolean") patch.allows_messaging = allows_messaging;
      if (typeof allows_bookings === "boolean") patch.allows_bookings = allows_bookings;
      if (typeof store_online === "boolean") patch.store_online = store_online;
      if (store_opens_at !== undefined) patch.store_opens_at = store_opens_at;
      if (store_closes_at !== undefined) patch.store_closes_at = store_closes_at;
      if (store_type !== undefined) patch.store_type = store_type;
      if (governorate_id !== undefined) patch.governorate_id = governorate_id;
      if (store_address !== undefined) patch.store_address = store_address;
      if (weekly_off_days !== undefined) patch.weekly_off_days = weekly_off_days;
      
      // ✅ جديد - إضافة notifications_enabled
      if (notifications_enabled !== undefined) {
        patch.notifications_enabled = notifications_enabled;
        patch.notifications_updated_at = new Date().toISOString();
      }
      
      const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["profile", v.userId] });
      qc.invalidateQueries({ queryKey: ["store", v.userId] });
    },
  });
}
/* ---------- User addresses ---------- */

export type UserAddress = {
  id: string;
  user_id: string;
  label: string;
  address_text: string;
  details: string;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export function useMyAddresses(userId?: string) {
  return useQuery({
    queryKey: ["user_addresses", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_addresses" as any)
        .select("*")
        .eq("user_id", userId!)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as UserAddress[]) ?? [];
    },
  });
}

export function useSaveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<UserAddress> & { user_id: string; label: string; address_text: string; details: string }) => {
      const payload: any = {
        user_id: input.user_id,
        label: input.label,
        address_text: input.address_text,
        details: input.details,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        is_default: input.is_default ?? false,
      };
      const { error } = input.id
        ? await supabase.from("user_addresses" as any).update(payload).eq("id", input.id)
        : await supabase.from("user_addresses" as any).insert(payload);
      if (error) throw error;
    },
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["user_addresses", v.user_id] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_addresses" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user_addresses"] }),
  });
}

// src/lib/queries.ts

// ✅ تحديث useAllSellerApplications لدعم Pagination والفلترة
export function useAllSellerApplications(
  page: number = 1, 
  limit: number = 10,
  filterStatus?: string,
  applicationType?: string,
  searchQuery?: string
) {
  return useQuery({
    queryKey: ["seller_applications", "all", page, limit, filterStatus, applicationType, searchQuery],
    queryFn: async () => {
      let q = supabase
        .from("seller_applications" as any)
        .select(`
          *,
          profiles:user_id(full_name, avatar_url, phone),
          governorate:governorate_id(id, name_ar, name_en)
        `, { count: 'exact' })
        .order("created_at", { ascending: false });

      // ✅ فلتر الحالة
      if (filterStatus && filterStatus !== "all") {
        q = q.eq("status", filterStatus);
      }

      // ✅ فلتر نوع الطلب
      if (applicationType && applicationType !== "all") {
        q = q.eq("application_type", applicationType);
      }

      // ✅ فلتر البحث
      if (searchQuery && searchQuery.trim()) {
        const s = `%${searchQuery.trim()}%`;
        q = q.or(`store_name.ilike.${s},store_description.ilike.${s}`);
      }

      // ✅ Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      q = q.range(from, to);

      const { data, error, count } = await q;
      if (error) throw error;
      
      return {
        data: (data as any[]) ?? [],
        count: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      };
    },
  });
}

// src/lib/queries.ts

export function useReviewSellerApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; status: "approved" | "rejected"; admin_note?: string }) => {
      // 1. جلب بيانات الطلب
      const { data: appData, error: fetchError } = await supabase
        .from("seller_applications")
        .select("*")
        .eq("id", input.id)
        .single();

      if (fetchError || !appData) throw new Error("لا يمكن العثور على الطلب");

      // 2. تحديث حالة الطلب
      const { error: updateError } = await supabase
        .from("seller_applications")
        .update({
          status: input.status,
          admin_note: input.admin_note ?? null,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", input.id);
      
      if (updateError) throw updateError;

      // 3. إذا كانت الموافقة
      if (input.status === "approved") {
        
        // ✅ 3a. طلبات فتح متجر: نسخ البيانات إلى profiles
        if (appData.application_type === 'store') {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              store_name: appData.store_name,
              store_description: appData.store_description,
              store_logo_url: appData.store_logo_url,
              store_cover_url: appData.store_cover_url,
              store_phone: appData.store_phone,
              allows_messaging: appData.allows_messaging,
              allows_bookings: appData.allows_bookings,
              store_type: appData.store_type || 'online',
              governorate_id: appData.governorate_id,
              store_address: appData.address,
              store_opens_at: appData.opening_time,
              store_closes_at: appData.closing_time,
              weekly_off_days: appData.weekly_off_days || [],
              store_active: true,
              store_online: true,
            })
            .eq("id", appData.user_id);

          if (profileError) throw profileError;
        }

        // ✅ 3b. طلبات إضافة منتج: فقط تحديث حالة المنتج
        if (appData.application_type === 'product') {
          console.log("📝 Product application approved - skipping profile update");
          
          // تحديث حالة المنتج في listings
          const productNameMatch = appData.store_description?.match(/طلب إضافة منتج: (.+)/);
          const productName = productNameMatch ? productNameMatch[1] : null;

          if (productName) {
            const { data: listing, error: listingError } = await supabase
              .from("listings")
              .select("id, title_ar")
              .eq("owner_id", appData.user_id)
              .eq("title_ar", productName)
              .eq("status", "pending")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (listingError) {
              console.error("❌ Error finding listing:", listingError);
            } else if (listing) {
              const { error: updateError } = await supabase
                .from("listings")
                .update({ status: 'published' })
                .eq("id", listing.id);

              if (updateError) {
                console.error("❌ Error updating listing status:", updateError);
              } else {
                console.log("✅ Listing published successfully!");
              }
            }
          }
        }

        // ✅ 4. إدارة دور المستخدم بشكل صحيح (الحل الجديد)
        // 4a. التحقق من وجود دور للمستخدم
        const { data: existingRole, error: roleFetchError } = await supabase
          .from("user_roles")
          .select("id, role")
          .eq("user_id", appData.user_id)
          .maybeSingle();

        if (roleFetchError) {
          console.error("❌ Error fetching user role:", roleFetchError);
          throw roleFetchError;
        }

        if (!existingRole) {
          // 🔹 المستخدم ليس لديه أي دور → إدراج دور seller
          const { error: insertError } = await supabase
            .from("user_roles")
            .insert({
              user_id: appData.user_id,
              role: "seller"
            });
          
          if (insertError) throw insertError;
          console.log("✅ New seller role inserted for user:", appData.user_id);
          
        } else if (existingRole.role === "customer") {
          // 🔹 المستخدم مشتري → تحديثه إلى seller
          const { error: updateRoleError } = await supabase
            .from("user_roles")
            .update({ role: "seller" })
            .eq("id", existingRole.id);
          
          if (updateRoleError) throw updateRoleError;
          console.log("✅ User role updated from customer to seller:", appData.user_id);
          
        } else if (existingRole.role === "seller") {
          // 🔹 المستخدم بالفعل بائع → لا تفعل شيئاً
          console.log("ℹ️ User already has seller role:", appData.user_id);
          
        } else {
          // 🔹 أي دور آخر (admin, etc) → لا نغيره
          console.log("ℹ️ User has role:", existingRole.role, "- keeping it");
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller_applications"] });
      qc.invalidateQueries({ queryKey: ["roles"] });
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
      qc.invalidateQueries({ queryKey: ["stores"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
/* ---------- Admin categories management ---------- */

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id?: string; slug: string; name_ar: string; name_en: string;
      icon?: string | null; sort_order?: number; active?: boolean;
      image_url?: string | null; accent_from?: string | null; accent_to?: string | null;
    }) => {
      const payload: any = {
        slug: input.slug, name_ar: input.name_ar, name_en: input.name_en,
        icon: input.icon ?? null, sort_order: input.sort_order ?? 0, active: input.active ?? true,
        image_url: input.image_url ?? null,
        accent_from: input.accent_from || "from-primary",
        accent_to: input.accent_to || "to-sky-400",
      };
      if (input.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

/* ---------- Banners (homepage slider) ---------- */

export type BannerRow = {
  id: string;
  title_ar: string;
  title_en: string | null;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  image_url: string;
  link_url: string | null;
  cta_label_ar: string | null;
  cta_label_en: string | null;
  sort_order: number;
  active: boolean;
};

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("banners").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return (data ?? []) as BannerRow[];
    },
    staleTime: 60 * 1000,
  });
}

export function useAllBanners() {
  return useQuery({
    queryKey: ["banners", "all"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("banners").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as BannerRow[];
    },
  });
}

export function useSaveBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (b: Partial<BannerRow> & { title_ar: string; image_url: string }) => {
      if (b.id) {
        const { error } = await (supabase as any).from("banners").update(b).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("banners").insert(b);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

/* ---------- Announcements (top marquee) ---------- */

export type AnnouncementRow = {
  id: string;
  text_ar: string;
  text_en: string | null;
  link_url: string | null;
  active: boolean;
  sort_order: number;
};

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("announcements").select("*").eq("active", true).order("sort_order");
      if (error) throw error;
      return (data ?? []) as AnnouncementRow[];
    },
    staleTime: 60 * 1000,
  });
}
export function useAllAnnouncements() {
  return useQuery({
    queryKey: ["announcements", "all"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("announcements").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as AnnouncementRow[];
    },
  });
}
export function useSaveAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (a: Partial<AnnouncementRow> & { text_ar: string }) => {
      if (a.id) {
        const { error } = await (supabase as any).from("announcements").update(a).eq("id", a.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("announcements").insert(a);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}
export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

/* ---------- Stores (sellers) in a category ---------- */

export type StoreRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  store_name: string | null;
  store_description: string | null;
  store_phone: string | null;
  store_logo_url: string | null;
  store_cover_url: string | null;
  listing_count: number;
  avg_rating: number;
};

export function useAllStores(limit = 24) {
  return useQuery({
    queryKey: ["stores", "all", limit],
    queryFn: async () => {
      console.log("🔍 [useAllStores] بدأت جلب المتاجر");
      
      const { data: rows, error } = await supabase
        .from("listings")
        .select("owner_id, rating")
        .eq("status", "published");
      
      if (error) {
        console.error("❌ [useAllStores] Error fetching listings:", error);
        throw error;
      }
      
      console.log("📊 [useAllStores] Found listings:", rows?.length);
      
      const map = new Map<string, { count: number; sum: number }>();
      for (const r of rows ?? []) {
        const key = (r as any).owner_id as string;
        const cur = map.get(key) ?? { count: 0, sum: 0 };
        cur.count += 1;
        cur.sum += Number((r as any).rating) || 0;
        map.set(key, cur);
      }
      
      const ids = Array.from(map.keys());
      console.log("🆔 [useAllStores] Unique owner IDs:", ids);
      
      if (!ids.length) {
        console.log("ℹ️ [useAllStores] No owners found");
        return [] as StoreRow[];
      }
      
      // ✅ أضف allows_messaging في الـ select
      const { data: profs, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, store_name, store_description, store_phone, store_logo_url, store_cover_url, allows_messaging, allows_bookings, store_type, store_address, weekly_off_days, is_featured, featured_sort")
        .in("id", ids);
      
      if (profError) {
        console.error("❌ [useAllStores] Error fetching profiles:", profError);
        throw profError;
      }
      
      console.log("🖼️ [useAllStores] Profiles with images:", profs?.map(p => ({
        name: p.store_name,
        logo: p.store_logo_url,
        cover: p.store_cover_url,
        allows_messaging: p.allows_messaging  // ✅ تأكد من وجودها
      })));
      
      const list = (profs ?? []).map((p: any) => {
        const s = map.get(p.id)!;
        return {
          id: p.id,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          store_name: p.store_name,
          store_description: p.store_description,
          store_phone: p.store_phone,
          store_logo_url: p.store_logo_url,
          store_cover_url: p.store_cover_url,
          listing_count: s.count,
          avg_rating: s.count ? s.sum / s.count : 0,
          allows_messaging: p.allows_messaging,  // ✅ أضف هذا
          allows_bookings: p.allows_bookings,     // ✅ أضف هذا
          store_type: p.store_type,
          store_address: p.store_address,
          weekly_off_days: p.weekly_off_days,
          is_featured: p.is_featured || false,
          featured_sort: p.featured_sort || 0,
        } as StoreRow;
      });
      
      list.sort((a, b) => b.listing_count - a.listing_count);
      
      console.log("✅ [useAllStores] Final stores:", list.length);
      return list.slice(0, limit);
    },
  });
}
// ✅ تعديل fetchAllPromoCodes - إزالة company_id
export async function fetchAllPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from("promo_codes")
    .select(`
      *,
      creator:profiles!created_by (
        id,
        full_name,
        phone,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching all promo codes:", error);
    throw error;
  }
  return data || [];
}
// ✅ تعديل createPromoCode - إضافة store_id, store_name, store_ids
export async function createPromoCode(data: Partial<PromoCode>): Promise<PromoCode> {
  const { data: result, error } = await supabase
    .from("promo_codes")
    .insert({
      code: data.code?.toUpperCase().trim(),
      label: data.label?.trim(),
      description: data.description?.trim() || null,
      type: data.type,
      value: data.value,
      min_order: data.min_order || 0,
      max_discount: data.max_discount || null,
      usage_limit: data.usage_limit || 1,
      is_active: data.is_active ?? true,
      is_public: data.is_public ?? false,
      is_auto_applied: data.is_auto_applied ?? false,
      starts_at: data.starts_at || new Date().toISOString(),
      expires_at: data.expires_at || null,
      created_by: data.created_by || null,
      metadata: data.metadata || {},
      store_id: data.store_id || null,      // ✅ جديد
      store_name: data.store_name || null,  // ✅ جديد
      store_ids: data.store_ids || [],      // ✅ جديد
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}
// ✅ تعديل updatePromoCode - إضافة store_id, store_name, store_ids
export async function updatePromoCode(id: string, data: Partial<PromoCode>): Promise<PromoCode> {
  const { data: result, error } = await supabase
    .from("promo_codes")
    .update({
      code: data.code?.toUpperCase().trim(),
      label: data.label?.trim(),
      description: data.description?.trim() || null,
      type: data.type,
      value: data.value,
      min_order: data.min_order || 0,
      max_discount: data.max_discount || null,
      usage_limit: data.usage_limit || 1,
      is_active: data.is_active ?? true,
      is_public: data.is_public ?? false,
      is_auto_applied: data.is_auto_applied ?? false,
      starts_at: data.starts_at || new Date().toISOString(),
      expires_at: data.expires_at || null,
      updated_at: new Date().toISOString(),
      metadata: data.metadata || {},
      store_id: data.store_id || null,      // ✅ جديد
      store_name: data.store_name || null,  // ✅ جديد
      store_ids: data.store_ids || [],      // ✅ جديد
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}
export function useStoresByCategory(categorySlug: string | undefined) {
  return useQuery({
    queryKey: ["stores", categorySlug],
    enabled: !!categorySlug,
    queryFn: async () => {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", categorySlug!).maybeSingle();
      if (!cat) return [] as StoreRow[];
      const { data: rows, error } = await supabase
        .from("listings")
        .select("owner_id, rating")
        .eq("category_id", (cat as any).id)
        .eq("status", "published");
      if (error) throw error;
      const map = new Map<string, { count: number; sum: number }>();
      for (const r of rows ?? []) {
        const key = (r as any).owner_id as string;
        const cur = map.get(key) ?? { count: 0, sum: 0 };
        cur.count += 1;
        cur.sum += Number((r as any).rating) || 0;
        map.set(key, cur);
      }
      const ids = Array.from(map.keys());
      if (!ids.length) return [] as StoreRow[];
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, store_name, store_description, store_phone, store_logo_url, store_cover_url" as any)
        .in("id", ids);
      return (profs ?? []).map((p: any) => {
        const s = map.get(p.id)!;
        return {
          id: p.id, full_name: p.full_name, avatar_url: p.avatar_url,
          store_name: p.store_name, store_description: p.store_description,
          store_phone: p.store_phone, store_logo_url: p.store_logo_url, store_cover_url: p.store_cover_url,
          listing_count: s.count, avg_rating: s.count ? s.sum / s.count : 0,
        } as StoreRow;
      });
    },
  });
}

export function useStoreProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["store", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

/* ---------- Admin: manage all listings & stores ---------- */

// ✅ useAllListingsAdmin - مع staleTime منخفض لإعادة الجلب الفورية
export function useAllListingsAdmin(status?: "pending" | "published" | "archived" | "draft") {
  return useQuery({
    queryKey: ["admin", "listings", status ?? "all"],
    staleTime: 0, // ✅ لا تخزن الكاش، أجلب دائماً جديد
    gcTime: 1000 * 60, // ✅ 1 دقيقة
    refetchOnWindowFocus: true, // ✅ أعيد الجلب عند التركيز
    refetchOnMount: true, // ✅ أعيد الجلب عند التحميل
    queryFn: async () => {
      console.log(`📡 [useAllListingsAdmin] Fetching listings with status: ${status || 'all'}`);
      
      let q = supabase
        .from("listings")
        .select("*, categories(slug, name_ar, name_en), governorates(slug, name_ar, name_en)")
        .order("created_at", { ascending: false });
      
      if (status) q = q.eq("status", status);
      
      const { data, error } = await q;
      if (error) {
        console.error("❌ [useAllListingsAdmin] Error:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("ℹ️ [useAllListingsAdmin] No data found");
        return [];
      }
      
      // جلب بيانات الملفات الشخصية
      const ownerIds = data.map((item: any) => item.owner_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, store_name")
        .in("id", ownerIds);
      
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      
      const result = data.map((item: any) => ({
        ...item,
        profile: profileMap.get(item.owner_id) || null
      }));
      
      console.log(`✅ [useAllListingsAdmin] Found ${result.length} listings`);
      return result;
    },
  });
}
// ✅ احتفظ بهذا الكود
export function useSetListingStatus() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "published" | "archived" }) => {
      console.log(`📝 [useSetListingStatus] Updating listing ${id} to ${status}`);
      
      // ✅ أضف هذا للتأكد من البيانات
      console.log('🔍 البيانات المرسلة:', { id, status });
      
      // ✅ جرب التحديث بهذه الطريقة
      const { data, error } = await supabase
        .from("listings")
        .update({ status } as any)
        .eq("id", id)
        .select(); // ✅ أضف select() عشان ترجع البيانات

      if (error) {
        console.error("❌ [useSetListingStatus] Error:", error);
        throw error;
      }
      
      console.log(`✅ [useSetListingStatus] Listing ${id} updated to ${status}`);
      console.log('📊 البيانات بعد التحديث:', data); // ✅ شوف البيانات الراجعة
      
      return { id, status, data };
    },
    onSuccess: (result) => {
      console.log("🔄 [useSetListingStatus] Invalidating queries...");
      console.log('📊 Result from mutation:', result); // ✅ شوف النتيجة
      
      qc.invalidateQueries({ 
        queryKey: ["admin", "listings"],
        exact: false 
      });
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}
export function useAdminDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "listings"] }),
  });
}

export function useAdminAllStores(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["admin", "stores", page, limit],
    queryFn: async () => {
      // 1️⃣ جلب الـ Sellers مع Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data: sellers, count: totalCount } = await supabase
        .from("user_roles")
        .select("user_id", { count: "exact" })
        .eq("role", "seller")
        .range(from, to);
      
      const ids = Array.from(new Set((sellers ?? []).map((r: any) => r.user_id as string)));
      if (!ids.length) return { data: [], total: 0, page, limit };
      
      // 2️⃣ جلب الـ Profiles
      const { data: profs, error } = await supabase
        .from("profiles")
        .select(`
          id, 
          full_name, 
          phone, 
          store_name, 
          store_description, 
          store_logo_url, 
          store_cover_url, 
          store_active, 
          is_featured, 
          featured_sort,
          store_online,
          store_opens_at,
          store_closes_at,
          delivery_company_id,
          delivery_companies!profiles_delivery_company_id_fkey (
            id,
            name_ar,
            name_en,
            logo_url
          )
        `)
        .in("id", ids);
      
      if (error) throw error;
      
      // 3️⃣ جلب عدد المنتجات لكل متجر
      const { data: rows } = await supabase
        .from("listings")
        .select("owner_id")
        .in("owner_id", ids);
      
      const counts = new Map<string, number>();
      for (const r of rows ?? []) {
        const k = (r as any).owner_id as string;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      
      return {
        data: (profs ?? []).map((p: any) => ({ 
          ...p, 
          listing_count: counts.get(p.id) ?? 0,
          delivery_company: p.delivery_companies || null
        })),
        total: totalCount || 0,
        page,
        limit
      };
    },
  });
}

export function useAllOrdersAdmin() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, listings(title_ar, title_en, category_id, governorate_id, categories:category_id(slug, name_ar, name_en), governorates:governorate_id(slug, name_ar, name_en))" as any)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useAllBookingsAdmin() {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, listings(title_ar, title_en, category_id, governorate_id, categories:category_id(slug, name_ar, name_en), governorates:governorate_id(slug, name_ar, name_en))" as any)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useAllProfilesAdmin() {
  return useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, city, created_at" as any)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]) ?? [];
    },
  });
}

export function useSetStoreActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("profiles").update({ store_active: active } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
      qc.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

/* ============================================================
   FEATURED / TRENDING — user hearts + admin-controlled
   ============================================================ */

// Products with the most user hearts (favorites_count > 0)
// src/lib/queries.ts

export function useMostFavoritedListings(limit = 12) {
  return useQuery({
    queryKey: ["listings", "most-favorited", limit],
    queryFn: async () => {
      console.log("📡 [useMostFavoritedListings] Fetching most favorited listings...");
      
      const { data, error } = await supabase
        .rpc('get_public_products_with_variations', {
          p_limit: limit,
          p_offset: 0,
          p_sort: 'popular',
          p_is_offer: null,
          p_category_id: null,
          p_is_featured: null // 👈 إضافة المعامل السادس المفقود لتتطابق تماماً مع الدالة في قاعدة البيانات
        });
      
      if (error) {
        console.error("❌ [useMostFavoritedListings] RPC Error:", error);
        throw error;
      }
      
      const listings = Array.isArray(data) ? data : [];
      console.log(`✅ [useMostFavoritedListings] Found ${listings.length} listings`);
      
      // ✅ فلترة المنتجات التي لها favorites_count > 0
      const filtered = listings.filter((item: any) => (item.favorites_count || 0) > 0);
      
      return filtered;
    },
  });
}
// Stores whose products accumulate the most user hearts
export function useMostFavoritedStores(limit = 12) {
  return useQuery({
    queryKey: ["stores", "most-favorited", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("owner_id, favorites_count, rating")
        .eq("status", "published")
        .gt("favorites_count", 0);
      if (error) throw error;
      const map = new Map<string, { hearts: number; count: number; sum: number }>();
      for (const r of (data ?? []) as any[]) {
        const key = r.owner_id as string;
        const cur = map.get(key) ?? { hearts: 0, count: 0, sum: 0 };
        cur.hearts += Number(r.favorites_count) || 0;
        cur.count += 1;
        cur.sum += Number(r.rating) || 0;
        map.set(key, cur);
      }
      const ids = Array.from(map.keys());
      if (!ids.length) return [] as (StoreRow & { hearts: number })[];
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, store_name, store_description, store_phone, store_logo_url, store_cover_url" as any)
        .in("id", ids);
      const list = (profs ?? []).map((p: any) => {
        const s = map.get(p.id)!;
        return {
          id: p.id, full_name: p.full_name, avatar_url: p.avatar_url,
          store_name: p.store_name, store_description: p.store_description,
          store_phone: p.store_phone, store_logo_url: p.store_logo_url, store_cover_url: p.store_cover_url,
          listing_count: s.count, avg_rating: s.count ? s.sum / s.count : 0, hearts: s.hearts,
        } as StoreRow & { hearts: number };
      });
      list.sort((a, b) => b.hearts - a.hearts);
      return list.slice(0, limit);
    },
  });
}

// Admin-picked trending listings (is_featured=true)
// src/lib/queries.ts

// src/lib/queries.ts

// src/lib/queries.ts

// src/lib/queries.ts

export function useTrendingListings(limit = 12) {
  return useQuery({
    queryKey: ["listings", "trending", limit],
    queryFn: async () => {
      console.log("📡 [useTrendingListings] Fetching trending listings...");
      
      const { data, error } = await supabase
        .rpc('get_public_products_with_variations', {
          p_limit: limit,
          p_offset: 0,
          p_sort: 'featured',  // ✅ ترتيب المميزين
          p_is_offer: null,
          p_category_id: null,
          p_is_featured: true  // ✅ فلتر المميزين فقط
        });
      
      if (error) {
        console.error("❌ [useTrendingListings] RPC Error:", error);
        throw error;
      }
      
      const listings = Array.isArray(data) ? data : [];
      console.log(`✅ [useTrendingListings] Found ${listings.length} trending listings`);
      
      if (listings.length > 0) {
        console.log("🔍 [useTrendingListings] First item:", listings[0]);
        console.log("🔍 [useTrendingListings] Variations:", listings[0]?.variations?.length || 0);
      }
      
      return listings;
    },
  });
}
// Admin-picked trending stores (profiles.is_featured=true)
export function useTrendingStores(limit = 12) {
  return useQuery({
    queryKey: ["stores", "trending", limit],
    queryFn: async () => {
      const { data: profs, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, store_name, store_description, store_phone, store_logo_url, store_cover_url, featured_sort" as any)
        .eq("is_featured", true)
        .order("featured_sort", { ascending: true })
        .limit(limit);
      if (error) throw error;
      const ids = (profs ?? []).map((p: any) => p.id as string);
      if (!ids.length) return [] as StoreRow[];
      const { data: rows } = await supabase
        .from("listings").select("owner_id, rating").in("owner_id", ids).eq("status", "published");
      const map = new Map<string, { count: number; sum: number }>();
      for (const r of rows ?? []) {
        const k = (r as any).owner_id as string;
        const cur = map.get(k) ?? { count: 0, sum: 0 };
        cur.count += 1; cur.sum += Number((r as any).rating) || 0;
        map.set(k, cur);
      }
      return (profs ?? []).map((p: any) => {
        const s = map.get(p.id) ?? { count: 0, sum: 0 };
        return {
          id: p.id, full_name: p.full_name, avatar_url: p.avatar_url,
          store_name: p.store_name, store_description: p.store_description,
          store_phone: p.store_phone, store_logo_url: p.store_logo_url, store_cover_url: p.store_cover_url,
          listing_count: s.count, avg_rating: s.count ? s.sum / s.count : 0,
        } as StoreRow;
      });
    },
  });
}
/* ============================================================
   FEATURED / TRENDING — user hearts + admin-controlled
   ============================================================ */

// ... دوال useMostFavoritedListings, useMostFavoritedStores, useTrendingListings, useTrendingStores

// Admin toggle featured on a listing
export function useSetListingFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_featured, sort }: { id: string; is_featured: boolean; sort?: number }) => {
      const patch: any = { is_featured };
      if (typeof sort === "number") patch.featured_sort = sort;
      const { error } = await supabase.from("listings").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    },
  });
}

// Admin toggle featured on a store profile
export function useSetStoreFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_featured, sort }: { id: string; is_featured: boolean; sort?: number }) => {
      const patch: any = { is_featured };
      if (typeof sort === "number") patch.featured_sort = sort;
      const { error } = await supabase.from("profiles").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stores"] });
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
  });
}
/* ============================================================
   NOTIFICATIONS — real-time notification system
   ============================================================ */

/**
 * جلب إشعارات المستخدم من قاعدة البيانات
 */
export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
       .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
}

/**
 * تحديث إشعار واحد كمقروء
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });
}

/**
 * تحديث كل الإشعارات كمقروءة لمستخدم معين
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
       .eq("user_id", userId)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });
}

/**
 * إرسال إشعار جديد (يستخدم الدالة المخزنة في PostgreSQL)
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Mutation function to update a store profile's featured status and sort order.
 *
 * @param {id: string; is_featured: boolean; sort?: number} params - store profile id, featured status and sort order
 * @returns {Promise<void>} - promise resolving to void
 * @throws {Error} - error thrown if supabase update fails
 */

// src/lib/queries.ts

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      type,
      titleAr,
      bodyAr,
      referenceId,
      metadata,
      linkUrl,        // ✅ جديد
      imageUrl,       // ✅ جديد
    }: {
      userId: string;
      type: string;
      titleAr: string;
      bodyAr: string;
      referenceId?: string;
      metadata?: Record<string, any>;
      linkUrl?: string;   // ✅ جديد
      imageUrl?: string;  // ✅ جديد
    }) => {
      // ✅ 1. حفظ الإشعار في قاعدة البيانات (In-App)
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type: type,
          title_ar: titleAr,
          body_ar: bodyAr,
          reference_id: referenceId || null,
          metadata: metadata || {},
          link_url: linkUrl || null,
          image_url: imageUrl || null,
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;

      // ✅ 2. ✅ ✅ ✅ إرسال Push Notification (من فوق الشاشة)
      try {
        // جلب الـ Push Subscriptions للمستخدم
        const { data: subscriptions, error: subError } = await supabase
          .from('push_subscriptions')
          .select('subscription')
          .eq('user_id', userId);

        if (subError) {
          console.error('❌ Error fetching push subscriptions:', subError);
        }

        if (subscriptions && subscriptions.length > 0) {
          // ✅ إرسال Push لكل Subscription
          for (const sub of subscriptions) {
            try {
              // ✅ محاولة إرسال عبر Service Worker (إذا كان نشط)
              if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                
                // ✅ طريقة 1: عبر showNotification مباشرة
                registration.showNotification(titleAr, {
                  body: bodyAr,
                  icon: imageUrl || '/logo-192.png',
                  badge: '/badge.png',
                  data: {
                    url: linkUrl || '/dashboard',
                    notificationId: data.id,
                  },
                  actions: [
                    { action: 'view', title: '👀 عرض' },
                    { action: 'dismiss', title: '✖ إغلاق' }
                  ],
                  tag: `notification-${data.id}`,
                  requireInteraction: true,
                  vibrate: [200, 100, 200],
                });
              }

              // ✅ طريقة 2: عبر API (إذا كان موجود)
              try {
                await fetch('/api/send-push', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    subscription: sub.subscription,
                    payload: {
                      title: titleAr,
                      body: bodyAr,
                      icon: imageUrl || '/logo-192.png',
                      url: linkUrl || '/dashboard',
                      notificationId: data.id,
                    },
                  }),
                });
              } catch (apiError) {
                // API مش موجود، نتجاهل
                console.log('ℹ️ Push API not available, using Service Worker directly');
              }

            } catch (pushError) {
              console.error('❌ Error sending push:', pushError);
            }
          }
          console.log(`✅ Push notifications sent to ${subscriptions.length} devices`);
        }
      } catch (pushError) {
        console.error('❌ Error in push flow:', pushError);
        // لا نرمي خطأ عشان الإشعار ينحفظ على الأقل
      }

      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread", userId] });
    },
  });
}
/* ============================================================
   NOTIFICATIONS — real-time notification system
   ============================================================ */

// ... دوال useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useSendNotification

/* ============================================================
   REALTIME NOTIFICATIONS — تحديث لحظي داخل التطبيق
   ============================================================ */

// src/lib/queries.ts

export function useRealtimeNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // ✅ إلغاء القناة السابقة إذا وجدت
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    
    // ✅ إنشاء القناة
    const channel = supabase.channel('notifications-realtime');
    channelRef.current = channel;
    
    // ✅ إضافة الـ on
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
       filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const notification = payload.new as any;
        
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        
        const message = notification.body_ar || notification.message || '📬 لديك إشعار جديد';
        toast.success(message, {
          duration: 5000,
          position: 'bottom-right',
          icon: '🔔',
          action: {
            label: 'عرض',
            onClick: () => {
              window.location.href = notification.link_url || '/dashboard?tab=notifications';
            }
          }
        });
        
        try {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {}
        
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      }
    );
    
    // ✅ الـ subscribe
    channel.subscribe((status) => {
      console.log(`📡 Realtime notifications status: ${status}`);
    });
      
    // ✅ التنظيف
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, queryClient]);
}
export function useUnreadNotificationsCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", "unread", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return 0;
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
       .eq("user_id", userId)
        .eq("is_read", false);
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread", userId] });
    },
  });
}
// src/lib/queries.ts

// ====== CONVERSATIONS ======

// src/lib/queries.ts - استبدل دالة useConversations بهذه

export function useConversations(userId: string | undefined) {
  return useQuery({
    queryKey: ["conversations", userId],
    enabled: !!userId,
    queryFn: async () => {
      // 1. جلب المحادثات أولاً
      const { data: conversations, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .order("last_message_at", { ascending: false });

      if (convError) throw convError;
      if (!conversations || conversations.length === 0) return [];

      // 2. جلب بيانات المشاركين بشكل منفصل
      const userIds = new Set<string>();
      conversations.forEach((conv: any) => {
        userIds.add(conv.participant1_id);
        userIds.add(conv.participant2_id);
      });

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, store_name, store_logo_url")
        .in("id", Array.from(userIds));

      if (profilesError) throw profilesError;

      // 3. دمج البيانات
      const profilesMap = new Map();
      profiles?.forEach((profile: any) => {
        profilesMap.set(profile.id, profile);
      });

      return conversations.map((conv: any) => ({
        ...conv,
        participant1: profilesMap.get(conv.participant1_id) || null,
        participant2: profilesMap.get(conv.participant2_id) || null,
      }));
    },
  });
}

export function useConversationMessages(conversationId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId && !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      senderId, 
      receiverId, 
      content 
    }: { 
      senderId: string; 
      receiverId: string; 
      content: string;
    }) => {
      // 1. إرسال الرسالة
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content: content,
        })
        .select()
        .single();

      if (error) throw error;

      // 2. تحديث last_message في المحادثة
      const { error: updateError } = await supabase
        .from("conversations")
        .update({
          last_message: content,
          last_message_at: new Date().toISOString(),
        })
        .or(`participant1_id.eq.${senderId},participant2_id.eq.${senderId}`)
        .or(`participant1_id.eq.${receiverId},participant2_id.eq.${receiverId}`);

      if (updateError) throw updateError;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["messages"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["conversations", variables.senderId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["conversations", variables.receiverId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["unread-count"] 
      });
    },
  });
}

export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      userId 
    }: { 
      conversationId: string; 
      userId: string; 
    }) => {
      // تحديث عدد الرسائل غير المقروءة
      const { error } = await supabase
        .from("conversations")
        .update({
          unread_count_participant1: 0,
          unread_count_participant2: 0,
        })
        .eq("id", conversationId);

      if (error) throw error;

      // تحديث كل الرسائل كمقروءة
      const { error: messagesError } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", userId);

      if (messagesError) throw messagesError;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["messages", variables.conversationId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["conversations"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["unread-count"] 
      });
    },
  });
}

export function useUnreadMessagesCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["unread-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("unread_count_participant1, unread_count_participant2")
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`);

      if (error) throw error;

      let total = 0;
      data?.forEach((conv: any) => {
        total += (conv.unread_count_participant1 || 0) + (conv.unread_count_participant2 || 0);
      });

      return total;
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      userId 
    }: { 
      conversationId: string; 
      userId: string; 
    }) => {
      // حذف كل الرسائل أولاً
      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);

      if (messagesError) throw messagesError;

      // حذف المحادثة
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["conversations", variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["unread-count"] 
      });
    },
  });
}
/* ============================================================
   PRODUCT OPTIONS — خيارات المنتج (الألوان، المقاسات، إلخ)
   ============================================================ */

// ✅ جلب خيارات منتج معين
export async function getProductOptions(listingId: string) {
  const { data, error } = await supabase
    .from("product_options")
    .select("*")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as ProductOption[];
}

// ✅ جلب تركيبات منتج معين
export async function getProductVariations(listingId: string) {
  const { data, error } = await supabase
    .from("product_variations")
    .select("*")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ProductVariation[];
}

// ✅ إضافة خيار جديد
export async function addProductOption(option: Omit<ProductOption, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from("product_options")
    .insert(option)
    .select()
    .single();

  if (error) throw error;
  return data as ProductOption;
}

// ✅ حذف خيار
export async function deleteProductOption(optionId: string) {
  const { error } = await supabase
    .from("product_options")
    .delete()
    .eq("id", optionId);

  if (error) throw error;
  return true;
}

// ✅ حذف جميع خيارات منتج
export async function deleteAllProductOptions(listingId: string) {
  const { error } = await supabase
    .from("product_options")
    .delete()
    .eq("listing_id", listingId);

  if (error) throw error;
  return true;
}

// ✅ توليد التركيبات تلقائياً من الخيارات
export async function generateVariations(listingId: string) {
  // 1. جلب جميع الخيارات
  const options = await getProductOptions(listingId);
  
  // 2. تجميع الخيارات حسب النوع
  const grouped: Record<string, string[]> = {};
  options.forEach((opt) => {
    if (!grouped[opt.option_type]) {
      grouped[opt.option_type] = [];
    }
    grouped[opt.option_type].push(opt.option_value);
  });
  
  // 3. حذف التركيبات القديمة
  await supabase
    .from("product_variations")
    .delete()
    .eq("listing_id", listingId);
  
  // 4. إنشاء تركيبات جديدة
  const combinations = generateCombinations(grouped);
  const variations = combinations.map((combo, index) => ({
    listing_id: listingId,
    sku: `VAR-${listingId.substring(0, 8)}-${index + 1}`,
    combination: combo,
    stock_quantity: 0,
    is_active: true,
  }));
  
  if (variations.length === 0) return [];
  
  const { data, error } = await supabase
    .from("product_variations")
    .insert(variations)
    .select();
  
  if (error) throw error;
  return data as ProductVariation[];
}

// ✅ دالة مساعدة لتوليد التركيبات (Cartesian Product)
function generateCombinations(grouped: Record<string, string[]>): Record<string, string>[] {
  const keys = Object.keys(grouped);
  if (keys.length === 0) return [];
  
  let results: Record<string, string>[] = [{}];
  
  keys.forEach((key) => {
    const newResults: Record<string, string>[] = [];
    const values = grouped[key];
    
    results.forEach((result) => {
      values.forEach((value) => {
        newResults.push({ ...result, [key]: value });
      });
    });
    
    results = newResults;
  });
  
  return results;
}

// ✅ React Query Hooks
export function useProductOptions(listingId: string) {
  return useQuery({
    queryKey: ["product-options", listingId],
    queryFn: () => getProductOptions(listingId),
    enabled: !!listingId,
  });
}

export function useProductVariations(listingId: string) {
  return useQuery({
    queryKey: ["product-variations", listingId],
    queryFn: () => getProductVariations(listingId),
    enabled: !!listingId,
  });
}

export function useAddProductOption() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addProductOption,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-options", variables.listing_id] });
      queryClient.invalidateQueries({ queryKey: ["product-variations", variables.listing_id] });
    },
  });
}

export function useDeleteProductOption() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProductOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-options"] });
    },
  });
}

export function useGenerateVariations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: generateVariations,
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ["product-variations", listingId] });
    },
  });
}
/* ============================================================
   PRODUCT COLORS — ألوان المنتج مع الصور (مثل نظام نون)
   ============================================================ */

// ✅ جلب ألوان منتج معين
export async function getProductColors(listingId: string) {
  const { data, error } = await supabase
    .from("product_colors")
    .select("*")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as ProductColor[];
}

// ✅ جلب تركيبات الألوان والمقاسات
export async function getProductColorVariations(listingId: string) {
  const { data, error } = await supabase
    .from("product_variations")
    .select(`
      *,
      color:color_id (
        id,
        color_name_ar,
        color_name_en,
        color_hex,
        image_url
      )
    `)
    .eq("listing_id", listingId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as ProductColorVariation[];
}

// ✅ إضافة لون جديد مع صورة
export async function addProductColor(color: Omit<ProductColor, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from("product_colors")
    .insert(color)
    .select()
    .single();

  if (error) throw error;
  return data as ProductColor;
}

// ✅ حذف لون
export async function deleteProductColor(colorId: string) {
  const { error } = await supabase
    .from("product_colors")
    .delete()
    .eq("id", colorId);

  if (error) throw error;
  return true;
}

// ✅ تحديث صورة اللون
export async function updateColorImage(colorId: string, imageUrl: string) {
  const { error } = await supabase
    .from("product_colors")
    .update({ 
      image_url: imageUrl, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", colorId);

  if (error) throw error;
  return true;
}

// ✅ توليد التركيبات من الألوان والمقاسات
export async function generateVariationsFromColors(listingId: string, sizes: string[]) {
  // 1. جلب جميع الألوان
  const colors = await getProductColors(listingId);
  if (colors.length === 0) return [];

  // 2. حذف التركيبات القديمة
  await supabase
    .from("product_variations")
    .delete()
    .eq("listing_id", listingId);

  // 3. إنشاء تركيبات جديدة لكل لون × كل مقاس
  const variations = [];
  colors.forEach(color => {
    sizes.forEach(size => {
      variations.push({
        listing_id: listingId,
        color_id: color.id,
        size: size,
        is_available: true,
        sku: `${listingId.substring(0, 8)}-${color.color_name_ar}-${size}`,
      });
    });
  });

  if (variations.length === 0) return [];

  const { data, error } = await supabase
    .from("product_variations")
    .insert(variations)
    .select();

  if (error) throw error;
  return data as ProductColorVariation[];
}

// ===== React Query Hooks =====

export function useProductColors(listingId: string) {
  return useQuery({
    queryKey: ["product-colors", listingId],
    queryFn: () => getProductColors(listingId),
    enabled: !!listingId,
  });
}

export function useProductColorVariations(listingId: string) {
  return useQuery({
    queryKey: ["product-color-variations", listingId],
    queryFn: () => getProductColorVariations(listingId),
    enabled: !!listingId,
  });
}

export function useAddProductColor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addProductColor,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-colors", variables.listing_id] });
      queryClient.invalidateQueries({ queryKey: ["product-color-variations", variables.listing_id] });
    },
  });
}

export function useDeleteProductColor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProductColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-colors"] });
      queryClient.invalidateQueries({ queryKey: ["product-color-variations"] });
    },
  });
}

export function useUpdateColorImage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ colorId, imageUrl }: { colorId: string; imageUrl: string }) => 
      updateColorImage(colorId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-colors"] });
    },
  });
}

export function useGenerateVariationsFromColors() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listingId, sizes }: { listingId: string; sizes: string[] }) =>
      generateVariationsFromColors(listingId, sizes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-color-variations", variables.listingId] });
    },
  });
}
// src/lib/queries.ts

// ============================================================
// ============================================================
// 🔥 🔥 🔥 دوال التحقق من حالة المستخدم (جديدة)
// ============================================================
// ============================================================

// ✅ هذه الدوال تتحقق من إمكانية تقديم طلب متجر جديد
// ✅ وتجلب الطلبات السابقة للمستخدم

/**
 * التحقق من إمكانية تقديم طلب جديد
 * ✅ لا يتحقق من اسم المتجر (يمكن تكراره)
 */
export async function canSubmitStoreApplication(userId: string): Promise<{
  canSubmit: boolean;
  reason?: string;
  existingApplication?: any;
  existingStore?: any;
}> {
  // ✅ 1. هل المستخدم لديه متجر مفعل؟
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, store_name, store_active")
    .eq("id", userId)
    .eq("store_active", true)
    .maybeSingle();

  if (profileError) throw profileError;

  if (profile?.store_name) {
    return {
      canSubmit: false,
      reason: `✅ لديك متجر مفعل: "${profile.store_name}"`,
      existingStore: profile
    };
  }

  // ✅ 2. جلب الطلب الحالي (غير مرفوض)
  const { data: existing, error: existingError } = await supabase
    .from("seller_applications")
    .select("id, store_name, status, created_at, admin_note")
    .eq("user_id", userId)
    .neq("status", "rejected")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const statusMap = {
      pending: '⏳ قيد المراجعة',
      approved: '✅ تمت الموافقة عليه'
    };
    const statusText = statusMap[existing.status as keyof typeof statusMap] || existing.status;
    
    return {
      canSubmit: false,
      reason: `لديك طلب ${statusText} للمتجر "${existing.store_name}"`,
      existingApplication: existing
    };
  }

  // ✅ 3. لا يوجد طلب سابق (أو مرفوض فقط)
  return {
    canSubmit: true
  };
}

/**
 * جلب آخر طلب للمستخدم (بما في ذلك المرفوض)
 */
export async function getLatestApplication(userId: string) {
  const { data, error } = await supabase
    .from("seller_applications")
    .select(`
      *,
      governorate:governorate_id (
        id,
        name_ar,
        name_en
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * جلب الطلب المرفوض الأخير (إن وجد)
 */
export async function getLastRejectedApplication(userId: string) {
  const { data, error } = await supabase
    .from("seller_applications")
    .select(`
      *,
      governorate:governorate_id (
        id,
        name_ar,
        name_en
      )
    `)
    .eq("user_id", userId)
    .eq("status", "rejected")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ====== React Query Hooks ======

/**
 * Hook: هل يمكن للمستخدم تقديم طلب؟
 */
export function useCanSubmitApplication(userId: string | undefined) {
  return useQuery({
    queryKey: ["can_submit_application", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return { canSubmit: false, reason: 'غير مسجل' };
      return canSubmitStoreApplication(userId);
    },
    staleTime: 5000,
  });
}

/**
 * Hook: جلب آخر طلب للمستخدم
 */
export function useLatestApplication(userId: string | undefined) {
  return useQuery({
    queryKey: ["latest_application", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      return getLatestApplication(userId);
    },
  });
}

/**
 * Hook: جلب الطلب المرفوض الأخير
 */
export function useLastRejectedApplication(userId: string | undefined) {
  return useQuery({
    queryKey: ["last_rejected_application", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      return getLastRejectedApplication(userId);
    },
  });
}
/* ============================================================
   ADMIN NOTIFICATIONS — إدارة الإشعارات من لوحة الأدمن
   ============================================================ */

/**
 * جلب جميع الإشعارات للإدارة
 */
export function useAdminNotifications() {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * إرسال إشعار من الأدمن (مع دعم الإرسال الجماعي)
 */
export function useSendAdminNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      recipientId: string;
      type: string;
      titleAr: string;
      bodyAr: string;
      referenceId?: string;
      metadata?: Record<string, any>;
      linkUrl?: string;
      imageUrl?: string;
    }) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
         user_id: input.recipientId, 
          type: input.type,
          title_ar: input.titleAr,
          body_ar: input.bodyAr,
          reference_id: input.referenceId || null,
          metadata: input.metadata || {},
          link_url: input.linkUrl || null,
          image_url: input.imageUrl || null,
        })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * إرسال إشعار جماعي لعدة مستخدمين
 */
export function useSendBulkAdminNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notifications: Array<{
      recipientId: string;
      type: string;
      titleAr: string;
      bodyAr: string;
      referenceId?: string;
      metadata?: Record<string, any>;
      linkUrl?: string;
      imageUrl?: string;
    }>) => {
      const inserts = notifications.map(n => ({
             user_id: n.recipientId,
        type: n.type,
        title_ar: n.titleAr,
        body_ar: n.bodyAr,
        reference_id: n.referenceId || null,
        metadata: n.metadata || {},
        link_url: n.linkUrl || null,
        image_url: n.imageUrl || null,
      }));
      
      const { data, error } = await supabase
        .from('notifications')
        .insert(inserts)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * تحديث حالة الإشعار (مقروء/غير مقروء)
 */
export function useUpdateNotificationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: isRead })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * حذف إشعار (للأدمن)
 */
export function useDeleteAdminNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * جلب إحصائيات الإشعارات
 */
export function useNotificationsStats() {
  return useQuery({
    queryKey: ['notifications-stats'],
    queryFn: async () => {
      // إجمالي الإشعارات
      const { count: total, error: totalError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });
      if (totalError) throw totalError;

      // الإشعارات المقروءة
      const { count: read, error: readError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', true);
      if (readError) throw readError;

      // الإشعارات غير المقروءة
      const { count: unread, error: unreadError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      if (unreadError) throw unreadError;

      // الإشعارات حسب النوع
      const { data: byType, error: typeError } = await supabase
        .from('notifications')
        .select('type, count:type', { count: 'exact' })
        .groupBy('type');
      if (typeError) throw typeError;

      return {
        total: total || 0,
        read: read || 0,
        unread: unread || 0,
        byType: byType || [],
      };
    },
  });
}
// ============================================================
// ✅ NOTIFICATIONS V2 - نظام إشعارات متطور (مثل نون)
// ============================================================


/**
 * جلب إشعارات المستخدم مع فلترة (V2)
 */
export function useUserNotifications(userId: string | undefined, options?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  types?: NotificationTypeV2[];
}) {
  return useQuery({
    queryKey: ['notifications', 'v2', userId, options],
    enabled: !!userId,
    queryFn: async () => {
      let q = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      if (options?.unreadOnly) {
        q = q.eq('is_read', false);
      }

      if (options?.types && options.types.length > 0) {
        q = q.in('type', options.types);
      }

      if (options?.limit) {
        q = q.limit(options.limit);
      }

      if (options?.offset) {
        q = q.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as Notification[];
    },
  });
}

/**
 * إرسال إشعار جديد (V2)
 */
// src/lib/queries.ts

// src/lib/queries.ts - useSendNotificationV2

export function useSendNotificationV2() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      type: NotificationTypeV2;
      titleAr: string;
      bodyAr: string;
      titleEn?: string;
      bodyEn?: string;
      linkUrl?: string;
      imageUrl?: string;
      actions?: NotificationAction[];
      metadata?: Record<string, any>;
      scheduledFor?: string;
      expiresAt?: string;
      priority?: NotificationPriority;
    }) => {
      const config = NOTIFICATION_CONFIG_V2[params.type];

      const notification = {
        user_id: params.userId,
        type: params.type,
        title_ar: params.titleAr,
        title_en: params.titleEn || params.titleAr,
        body_ar: params.bodyAr,
        body_en: params.bodyEn || params.bodyAr,
        icon: config.icon,
        color: config.color,
        priority: params.priority || config.priority,
        link_url: params.linkUrl || null,
        image_url: params.imageUrl || null,
        actions: params.actions || [],
        metadata: params.metadata || {},
        scheduled_for: params.scheduledFor || null,
        expires_at: params.expiresAt || null,
        is_sent: !params.scheduledFor,
        sent_at: params.scheduledFor ? null : new Date().toISOString(),
      };

      // ✅ 1. حفظ الإشعار في قاعدة البيانات
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;

      // ✅ 2. إرسال Push Notification (من فوق الشاشة)
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // ✅ ✅ ✅ إرسال الإشعار مع تصميم احترافي
          await registration.showNotification(
            params.titleAr,
            {
              body: params.bodyAr,
              icon: params.imageUrl || '/logo-192.png',
              badge: '/badge.png',
              // ✅ ✅ ✅ ألوان السستم
              color: '#2a655f',
              // ✅ ✅ ✅ صورة كبيرة (اختياري)
              image: params.imageUrl || null,
              data: {
                url: params.linkUrl || '/dashboard',
                notificationId: data.id,
              },
              actions: [
                { action: 'view', title: '👀 عرض' },
                { action: 'dismiss', title: '✖ إغلاق' }
              ],
              tag: `notification-${data.id}`,
              requireInteraction: true,
              vibrate: [200, 100, 200, 100, 200],
              // ✅ ✅ ✅ الاتجاه واللغة
              dir: 'rtl',
              lang: 'ar',
              timestamp: Date.now(),
            }
          );
          
          console.log('✅ Push notification sent via Service Worker');
        }
      } catch (pushError) {
        console.error('❌ Error sending push notification:', pushError);
      }

      return data as Notification;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'v2', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
}
/**
 * إرسال إشعار جماعي (V2)
 */
// src/lib/queries.ts

// src/lib/queries.ts

export function useSendBulkNotificationsV2() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      userIds: string[];
      type: NotificationTypeV2;
      titleAr: string;
      bodyAr: string;
      titleEn?: string;
      bodyEn?: string;
      linkUrl?: string;
      imageUrl?: string;
      actions?: NotificationAction[];
      metadata?: Record<string, any>;
      scheduledFor?: string;
      expiresAt?: string;
    }) => {
      const config = NOTIFICATION_CONFIG_V2[params.type];

      // ✅ حفظ الإشعارات في قاعدة البيانات
      const notifications = params.userIds.map((userId) => ({
        user_id: userId,
        type: params.type,
        title_ar: params.titleAr,
        title_en: params.titleEn || params.titleAr,
        body_ar: params.bodyAr,
        body_en: params.bodyEn || params.bodyAr,
        icon: config.icon,
        color: config.color,
        priority: config.priority,
        link_url: params.linkUrl || null,
        image_url: params.imageUrl || null,
        actions: params.actions || [],
        metadata: params.metadata || {},
        scheduled_for: params.scheduledFor || null,
        expires_at: params.expiresAt || null,
        is_sent: !params.scheduledFor,
        sent_at: params.scheduledFor ? null : new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;

      // ✅ ✅ ✅ إرسال Push Notification (من فوق الشاشة)
      try {
        // ✅ تحقق من الصلاحية
        if (Notification.permission === 'granted') {
          // ✅ ✅ ✅ استخدم new Notification مباشرة
          new Notification(params.titleAr, {
            body: params.bodyAr,
            icon: params.imageUrl || '/images/logo-192.png',
            badge: '/images/badge.png',
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200],
            dir: 'rtl',
            lang: 'ar',
            data: {
              url: params.linkUrl || '/dashboard',
            },
          });
          console.log('✅ Push notification sent successfully!');
        } else {
          console.log('❌ Notification permission not granted');
        }
      } catch (pushError) {
        console.error('❌ Error sending push notification:', pushError);
      }

      return data as Notification[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'v2'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
}

/**
 * تحديث إشعار واحد كمقروء (V2)
 */
export function useMarkNotificationReadV2() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'v2', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
    },
  });
}

/**
 * تحديث كل الإشعارات كمقروءة (V2)
 */
export function useMarkAllNotificationsReadV2() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'v2', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
    },
  });
}

/**
 * عدد الإشعارات غير المقروءة (V2)
 */
export function useUnreadNotificationsCountV2(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', 'unread', 'v2', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
        .eq('is_read', false);
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });
}

/**
 * حذف إشعار (V2)
 */
export function useDeleteNotificationV2() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'v2', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
    },
  });
}

/**
 * جلب إحصائيات الإشعارات للمستخدم (V2)
 */
export function useUserNotificationsStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', 'stats', userId],
    enabled: !!userId,
    queryFn: async () => {
      // إجمالي الإشعارات
      const { count: total, error: totalError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!);

      if (totalError) throw totalError;

      // الإشعارات المقروءة
      const { count: read, error: readError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
        .eq('is_read', true);

      if (readError) throw readError;

      // الإشعارات غير المقروءة
      const { count: unread, error: unreadError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!)
        .eq('is_read', false);

      if (unreadError) throw unreadError;

      return {
        total: total || 0,
        read: read || 0,
        unread: unread || 0,
      };
    },
  });
}
// ============================================================
// 🚚 DELIVERY COMPANIES & DISTRIBUTORS
// ============================================================

// ============================================================
// 📦 GET: شركات التوصيل
// ============================================================
export function useDeliveryCompanies(options?: { 
  featured?: boolean; 
  active?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["delivery-companies", options],
    queryFn: async () => {
      console.log("📦 [useDeliveryCompanies] Fetching delivery companies with options:", options);
      
      let query = supabase
        .from("delivery_companies")
        .select("*")
        .order("featured_sort", { ascending: true });

      if (options?.featured) {
        query = query.eq("is_featured", true);
      }
      if (options?.active !== undefined) {
        query = query.eq("is_active", options.active);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("❌ [useDeliveryCompanies] Error:", error);
        throw error;
      }
      
      console.log("✅ [useDeliveryCompanies] Found companies:", data?.length || 0);
      console.log("📦 [useDeliveryCompanies] Data:", data);
      
      return data as DeliveryCompany[];
    },
  });
}

export function useDeliveryCompaniesByGovernorate(governorateName?: string) {
  return useQuery({
    queryKey: ["delivery-companies", "governorate", governorateName],
    enabled: !!governorateName,
    queryFn: async () => {
      console.log("📦 [useDeliveryCompaniesByGovernorate] Fetching for governorate:", governorateName);
      
      const { data, error } = await supabase
        .from("delivery_companies")
        .select("*")
        .eq("is_active", true)
        .or(`coverage_areas.cs.{"${governorateName}"},coverage_areas.cs.{"all"}`)
        .order("featured_sort", { ascending: true });

      if (error) {
        console.error("❌ [useDeliveryCompaniesByGovernorate] Error:", error);
        throw error;
      }
      
      console.log("✅ [useDeliveryCompaniesByGovernorate] Found companies:", data?.length || 0);
      console.log("📦 [useDeliveryCompaniesByGovernorate] Data:", data);
      
      return data as DeliveryCompany[];
    },
  });
}

// ============================================================
// 📦 GET: شركة توصيل واحدة
// ============================================================
export function useDeliveryCompany(slug: string) {
  return useQuery({
    queryKey: ["delivery-company", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_companies")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as DeliveryCompany;
    },
    enabled: !!slug,
  });
}

// ============================================================
// 📦 GET: الموزعين
// ============================================================
// ============================================================
// 📦 GET: الموزعين (معدلة لدعم companyId)
// ============================================================
export function useDistributors(options?: {
  companyId?: string;
  governorateId?: string;
  isAvailable?: boolean;
  active?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ["distributors", options],
    queryFn: async () => {
      console.log("🔍 [useDistributors] options:", options);
      
      let query = supabase
        .from("distributors")
        .select(`
          *,
          governorates:governorate_id (
            id,
            name_ar,
            name_en
          ),
          delivery_companies:delivery_company_id (
            id,
            name_ar,
            name_en,
            logo_url
          )
        `);

      // ✅ فلتر حسب الشركة (الأهم)
      if (options?.companyId) {
        query = query.eq("delivery_company_id", options.companyId);
      }

      // ✅ فلتر حسب المحافظة
      if (options?.governorateId) {
        query = query.eq("governorate_id", options.governorateId);
      }

      // ✅ فلتر حسب التوفر
      if (options?.isAvailable !== undefined) {
        query = query.eq("is_available", options.isAvailable);
      }

      // ✅ فلتر حسب النشاط
      if (options?.active !== undefined) {
        query = query.eq("is_active", options.active);
      }

      // ✅ ترتيب حسب التوفر أولاً ثم حسب الاسم
      query = query.order("is_available", { ascending: false });
      query = query.order("full_name_ar", { ascending: true });

      const { data, error } = await query;
      
      if (error) {
        console.error("❌ [useDistributors] Error:", error);
        throw error;
      }
      
      console.log("✅ [useDistributors] Found:", data?.length || 0, "distributors");
      console.log("📦 [useDistributors] Data:", data);
      
      return data || [];
    },
    enabled: true,
    staleTime: 30 * 1000, // 30 ثانية
  });
}
// ============================================================
// 📦 GET: طلبات التوصيل
// ============================================================
// src/lib/queries.ts - ابحث عن هذا الكود واستبدله

// ✅ useDeliveryOrders - نسخة معدلة بالكامل
export function useDeliveryOrders(userId?: string) {
  return useQuery({
    queryKey: ["delivery-orders", userId],
    enabled: !!userId,
    staleTime: 30 * 1000,
    retry: 0,
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // ✅ 1️⃣ جلب دور المستخدم
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
        
        const isDeliveryCompany = roles?.some(r => r.role === 'delivery_company');
        const isDistributor = roles?.some(r => r.role === 'distributor');
        
        console.log("🔍 [useDeliveryOrders] Roles:", { isDeliveryCompany, isDistributor });
        
        let companyId: string | null = null;
        let distributorId: string | null = null;
        
        // ✅ 2️⃣ إذا كان شركة توصيل → جلب company_id
        if (isDeliveryCompany) {
          // ✅ مالك شركة
          const { data: company } = await supabase
            .from("delivery_companies")
            .select("id")
            .eq("created_by", userId)
            .maybeSingle();
          
          if (company) {
            companyId = company.id;
            console.log("✅ [useDeliveryOrders] Found company (owner):", companyId);
          } else {
            // ✅ مدير شركة (من delivery_company_admins)
            const { data: adminCompany } = await supabase
              .from("delivery_company_admins")
              .select("company_id")
              .eq("user_id", userId)
              .maybeSingle();
            
            if (adminCompany) {
              companyId = adminCompany.company_id;
              console.log("✅ [useDeliveryOrders] Found company (admin):", companyId);
            }
          }
        }
        
        // ✅ 3️⃣ إذا كان موزع → جلب distributor_id
        if (isDistributor) {
          const { data: distributor } = await supabase
            .from("distributors")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();
          
          if (distributor) {
            distributorId = distributor.id;
            console.log("✅ [useDeliveryOrders] Found distributor:", distributorId);
          }
        }
        
        // ✅ 4️⃣ بناء الاستعلام
        let query = supabase.from("delivery_orders").select(`
          *,
          delivery_company:delivery_company_id (
            id,
            name_ar,
            name_en,
            logo_url
          ),
          distributor:distributor_id (
            id,
            full_name_ar,
            full_name_en,
            phone,
            avatar_url
          )
        `);
        
        // ✅ إذا كان شركة توصيل → طلبات الشركة
        if (companyId) {
          query = query.eq("delivery_company_id", companyId);
          console.log("📡 [useDeliveryOrders] Filtering by company:", companyId);
        } 
        // ✅ إذا كان موزع → طلباته
        else if (distributorId) {
          query = query.eq("distributor_id", distributorId);
          console.log("📡 [useDeliveryOrders] Filtering by distributor:", distributorId);
        } 
        // ❌ إذا لا شركة ولا موزع
        else {
          console.log("ℹ️ [useDeliveryOrders] No company or distributor found");
          return [];
        }
        
        // ✅ ترتيب حسب الأحدث
        const { data, error } = await query.order("created_at", { ascending: false });
        
        if (error) throw error;
        
        console.log("✅ [useDeliveryOrders] Found orders:", data?.length || 0);
        return data || [];
        
      } catch (error) {
        console.error("❌ [useDeliveryOrders] Error:", error);
        return [];
      }
    },
  });
}
// ============================================================
// 📦 MUTATION: إنشاء طلب توصيل
// ============================================================
export function useCreateDeliveryOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<DeliveryOrder>) => {
      const { data, error } = await supabase
        .from("delivery_orders")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data as DeliveryOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
    },
  });
}

// ============================================================
// 📦 MUTATION: تحديث حالة طلب التوصيل
// ============================================================


// ============================================================
// 📦 MUTATION: تتبع الموزع
// ============================================================
export function useTrackDistributor() {
  return useMutation({
    mutationFn: async ({
      distributorId,
      deliveryOrderId,
      latitude,
      longitude,
      status,
      note,
    }: {
      distributorId: string;
      deliveryOrderId: string;
      latitude: number;
      longitude: number;
      status?: string;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from("distributor_tracking")
        .insert({
          distributor_id: distributorId,
          delivery_order_id: deliveryOrderId,
          latitude,
          longitude,
          status,
          note,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// ============================================================
// 📦 UTILITY: حساب تكلفة التوصيل
// ============================================================
export function useCalculateDeliveryFee() {
  return (company: DeliveryCompany, distance: number, orderTotal: number) => {
    return calculateDeliveryFee(company, distance, orderTotal);
  };
}

// ============================================================
// 📦 GET: شركات التوصيل التي تغطي محافظة معينة
// ============================================================


// ============================================================
// 📦 MUTATION: إدارة شركات التوصيل (للداشبورد)
// ============================================================
export function useCreateDeliveryCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: Partial<DeliveryCompany> & { name_ar: string; name_en: string; slug: string }) => {
      const { data, error } = await supabase
        .from("delivery_companies")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as DeliveryCompany;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-companies"] });
    },
  });
}

export function useUpdateDeliveryCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<DeliveryCompany> }) => {
      const { data, error } = await supabase
        .from("delivery_companies")
        .update(patch)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as DeliveryCompany;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-companies"] });
    },
  });
}

export function useDeleteDeliveryCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("delivery_companies")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-companies"] });
    },
  });
}

// ============================================================
// 📦 MUTATION: إدارة الموزعين (للداشبورد)
// ============================================================
// src/lib/queries.ts

// src/lib/queries.ts
// src/lib/queries.ts

// src/lib/queries.ts - ابحث عن هذا الكود واستبدله

// src/lib/queries.ts

export function useMyDeliveryCompany(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-delivery-company", userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("🔍 [useMyDeliveryCompany] Searching for userId:", userId);
      
      try {
        // ✅ 1️⃣ أولاً: جلب الموزع من جدول distributors
        const { data: distributor, error: distError } = await supabase
          .from("distributors")
          .select(`
            id,
            delivery_company_id,
            delivery_companies:delivery_company_id (
              id,
              name_ar,
              name_en,
              logo_url,
              slug,
              phone,
              email,
              address_ar,
              address_en,
              is_active,
              is_featured,
              rating,
              reviews_count,
              base_price,
              price_per_km,
              min_delivery_fee,
              max_delivery_fee,
              free_delivery_threshold,
              avg_delivery_time,
              has_tracking,
              has_insurance,
              has_cod,
              has_express,
              coverage_areas
            )
          `)
          .eq("user_id", userId)
          .maybeSingle();

        if (distError) {
          console.error("❌ [useMyDeliveryCompany] Distributor error:", distError);
          return null;
        }

        // ✅ 2️⃣ إذا وجدنا موزع ولديه شركة
        if (distributor?.delivery_companies) {
          console.log("✅ [useMyDeliveryCompany] Company found via distributor:", distributor.delivery_companies.name_ar);
          return distributor.delivery_companies;
        }

        // ✅ 3️⃣ إذا كان المستخدم أدمن شركة (جلب من delivery_company_admins)
        const { data: adminRecord, error: adminError } = await supabase
          .from("delivery_company_admins")
          .select(`
            company_id,
            delivery_companies:company_id (
              id,
              name_ar,
              name_en,
              logo_url,
              slug,
              phone,
              email,
              address_ar,
              address_en,
              is_active,
              is_featured,
              rating,
              reviews_count,
              base_price,
              price_per_km,
              min_delivery_fee,
              max_delivery_fee,
              free_delivery_threshold,
              avg_delivery_time,
              has_tracking,
              has_insurance,
              has_cod,
              has_express,
              coverage_areas
            )
          `)
          .eq("user_id", userId)
          .maybeSingle();

        if (adminError) {
          console.error("❌ [useMyDeliveryCompany] Admin error:", adminError);
        }

        if (adminRecord?.delivery_companies) {
          console.log("✅ [useMyDeliveryCompany] Company found via delivery_company_admins:", adminRecord.delivery_companies.name_ar);
          return adminRecord.delivery_companies;
        }

        // ✅ 4️⃣ أخيراً: البحث في profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(`
            company_id,
            delivery_company_id,
            delivery_companies:delivery_company_id (
              id,
              name_ar,
              name_en,
              logo_url,
              slug,
              phone,
              email,
              address_ar,
              address_en,
              is_active,
              is_featured,
              rating,
              reviews_count,
              base_price,
              price_per_km,
              min_delivery_fee,
              max_delivery_fee,
              free_delivery_threshold,
              avg_delivery_time,
              has_tracking,
              has_insurance,
              has_cod,
              has_express,
              coverage_areas
            )
          `)
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          console.error("❌ [useMyDeliveryCompany] Profile error:", profileError);
          return null;
        }

        // ✅ التحقق من delivery_companies في profile
        if (profile?.delivery_companies) {
          console.log("✅ [useMyDeliveryCompany] Company found via profile.delivery_companies:", profile.delivery_companies.name_ar);
          return profile.delivery_companies;
        }

        // ✅ التحقق من company_id في profile
        if (profile?.company_id) {
          const { data: company, error: companyError } = await supabase
            .from("delivery_companies")
            .select("*")
            .eq("id", profile.company_id)
            .maybeSingle();

          if (companyError) {
            console.error("❌ [useMyDeliveryCompany] Company fetch error:", companyError);
            return null;
          }

          if (company) {
            console.log("✅ [useMyDeliveryCompany] Company found via profile.company_id:", company.name_ar);
            return company;
          }
        }

        console.log("ℹ️ [useMyDeliveryCompany] No company found for user");
        return null;
        
      } catch (error) {
        console.error("❌ [useMyDeliveryCompany] Unexpected error:", error);
        return null;
      }
    },
  });
}
export function useCreateDistributor() {
  const queryClient = useQueryClient();
  
  return useMutation({
   mutationFn: async (input: any) => {
  const payload = {
    ...input,
    user_id: input.user_id || null,
    delivery_company_id: input.delivery_company_id || null,  // ✅ أضف هذا
    governorate_id: input.governorate_id || null,
  };
  
  const { data, error } = await supabase
    .from("distributors")
    .insert(payload)
    .select()
    .single();

      if (error) throw error;
      return data as Distributor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
    },
  });
}
export function useUpdateDistributor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Distributor> }) => {
      const { data, error } = await supabase
        .from("distributors")
        .update(patch)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Distributor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
    },
  });
}

export function useDeleteDistributor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("distributors")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["distributors"] });
    },
  });
}
// ============================================================
// 📦 جلب صلاحيات المستخدم (الرولات)
// ============================================================
export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      
      console.log("🔍 [useUserRoles] Fetching roles for userId:", userId);
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ [useUserRoles] Error:", error);
        return [];
      }
      
      const roles = (data ?? []).map((r: any) => r.role);
      console.log("✅ [useUserRoles] Found roles:", roles);
      return roles;
    },
  });
}
// src/lib/queries.ts

// ============================================================
// ✅ الشكاوى (Complaints)
// ============================================================

// ✅ جلب شكاوى المستخدم
export function useMyComplaints(userId: string | undefined) {
  return useQuery({
    queryKey: ["complaints", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data ?? [];
    },
  });
}

// ✅ إضافة شكوى جديدة
export function useCreateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      order_id: string;
      user_id: string;
      subject: string;
      description: string;
    }) => {
      const { data, error } = await supabase
        .from("complaints")
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["complaints", variables.user_id] });
      toast.success("✅ تم إرسال شكواك بنجاح! سنتواصل معك قريباً.");
    },
  });
}

// ✅ جلب شكاوى الأدمن
// src/lib/queries.ts

// ✅ جلب شكاوى الأدمن - محسّن
export function useAllComplaints() {
  return useQuery({
    queryKey: ["complaints", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          profiles:user_id (full_name, phone, avatar_url),
          orders (id, total, created_at)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,   // ✅ 5 دقائق
    gcTime: 1000 * 60 * 10,    // ✅ 10 دقائق
    refetchOnWindowFocus: false, // ✅ لا تعيد الجلب عند التركيز
    refetchOnMount: false,      // ✅ لا تعيد الجلب عند التحميل
    retry: 1,                   // ✅ حاول مرة واحدة
  });
}
// ✅ تحديث حالة الشكوى (للأدمن)
export function useUpdateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      admin_response,
    }: {
      id: string;
      status: string;
      admin_response?: string;
    }) => {
      const { data, error } = await supabase
        .from("complaints")
        .update({
          status,
          admin_response: admin_response || null,
          resolved_at: status === 'resolved' || status === 'closed' 
            ? new Date().toISOString() 
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("✅ تم تحديث حالة الشكوى");
    },
  });
}
// ============================================================
// 🚚 نهاية دوال التوصيل والموزعين
// ============================================================
// ============================================================
// ✅ نهاية دوال الإشعارات V2
// ============================================================
// ============================================================
// ✅ نهاية الكود الجديد
// ============================================================
// ====== 🔥 NEW: Get or Create Conversation ======

// ============================================================
// 🚚 DELIVERY ORDERS - قبول ورفض من شركة التوصيل
// ============================================================

// ✅ قبول طلب توصيل مع تعيين موزع
// src/lib/queries.ts

// ============================================================
// 🚚 DELIVERY ORDERS - قبول ورفض من شركة التوصيل
// ============================================================

// ✅ قبول طلب توصيل مع تعيين موزع ووقت متوقع
export function useAcceptDeliveryOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      deliveryOrderId, 
      distributorId,
      orderId,
      estimatedDeliveryAt,
      estimatedPickupAt,
    }: { 
      deliveryOrderId: string; 
      distributorId: string;
      orderId: string;
      estimatedDeliveryAt: string;
      estimatedPickupAt?: string;
    }) => {
      console.log("🚀 [useAcceptDeliveryOrder] START");
      console.log("📦 deliveryOrderId:", deliveryOrderId);
      console.log("👤 distributorId:", distributorId);
      console.log("🆔 orderId:", orderId);
      console.log("⏰ estimatedDeliveryAt:", estimatedDeliveryAt);
      console.log("⏰ estimatedPickupAt:", estimatedPickupAt);

      // 1. جلب بيانات الطلب للإشعارات
      console.log("📡 [1] Fetching order data...");
      const { data: order, error: orderFetchError } = await supabase
        .from("orders")
        .select(`
          *,
          listings:listing_id (
            id,
            title_ar,
            title_en,
            owner_id
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderFetchError) {
        console.error("❌ [1] Order fetch error:", orderFetchError);
        throw orderFetchError;
      }
      console.log("✅ [1] Order fetched:", order);
      console.log("📦 [1] Order listings:", order?.listings);
      console.log("👤 [1] Order buyer_id:", order?.buyer_id);

      // 2. تحديث delivery_order
      console.log("📡 [2] Updating delivery_order...");
      const updateData: any = {
        status: 'assigned',
        distributor_id: distributorId,
        assigned_at: new Date().toISOString(),
        estimated_delivery_at: estimatedDeliveryAt,
      };
      
      if (estimatedPickupAt) {
        updateData.estimated_pickup_at = estimatedPickupAt;
      }
      console.log("📝 [2] Update data:", updateData);

      const { data: deliveryOrder, error: deliveryError } = await supabase
        .from("delivery_orders")
        .update(updateData)
        .eq("id", deliveryOrderId)
        .select()
        .single();

      if (deliveryError) {
        console.error("❌ [2] Delivery order update error:", deliveryError);
        throw deliveryError;
      }
      console.log("✅ [2] Delivery order updated:", deliveryOrder);

      // 3. تحديث order الرئيسي
      console.log("📡 [3] Updating main order...");
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: 'shipped',
          accepted_at: new Date().toISOString(),
          distributor_id: distributorId,
          delivery_status: 'assigned',
          estimated_delivery_at: estimatedDeliveryAt,
        })
        .eq("id", orderId);

      if (orderError) {
        console.error("❌ [3] Order update error:", orderError);
        throw orderError;
      }
      console.log("✅ [3] Main order updated");

      // 4. جلب بيانات الموزع للإشعار
      console.log("📡 [4] Fetching distributor data...");
      const { data: distributor, error: distError } = await supabase
        .from("distributors")
        .select("full_name_ar, full_name_en, user_id, phone")
        .eq("id", distributorId)
        .single();

      if (distError) {
        console.error("❌ [4] Distributor fetch error:", distError);
      } else {
        console.log("✅ [4] Distributor fetched:", distributor);
        console.log("👤 [4] Distributor user_id:", distributor?.user_id);
      }

      // ✅ 5. إشعار للموزع (تم تعيينه)
      console.log("📡 [5] Sending notification to distributor...");
      if (distributor?.user_id) {
        console.log("✅ [5] Distributor has user_id:", distributor.user_id);
        const deliveryDate = new Date(estimatedDeliveryAt);
        const formattedDate = deliveryDate.toLocaleDateString(
          'ar-SA',
          { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        );
        console.log("📅 [5] Formatted date:", formattedDate);

        const { error: notifyDistError } = await supabase
          .from("notifications")
          .insert({
            user_id: distributor.user_id,
            type: "new_delivery_assigned",
            title_ar: "🚚 طلب توصيل جديد",
            body_ar: `تم تعيينك لتوصيل طلب "${order.listings?.title_ar || 'رقم ' + orderId.substring(0,8)}" - الوقت المتوقع للوصول: ${formattedDate}`,
            title_en: `New delivery assigned: ${order.listings?.title_en || 'Order ' + orderId.substring(0,8)}`,
            body_en: `You have been assigned to deliver order "${order.listings?.title_en || 'Order ' + orderId.substring(0,8)}" - Estimated delivery: ${deliveryDate.toLocaleString('en-US')}`,
            link_url: `/delivery/orders/${orderId}`,
            metadata: {
              delivery_order_id: deliveryOrderId,
              order_id: orderId,
              distributor_id: distributorId,
              estimated_delivery_at: estimatedDeliveryAt,
              customer_phone: order.buyer_phone,
              customer_address: order.delivery_address,
            }
          });

        if (notifyDistError) {
          console.error("❌ [5] Error sending notification to distributor:", notifyDistError);
        } else {
          console.log("✅ [5] Notification sent to distributor:", distributor.user_id);
        }
      } else {
        console.warn("⚠️ [5] No distributor user_id found, skipping notification");
      }

      // ✅ 6. إشعار للمشتري (العميل) مع الوقت المتوقع
      console.log("📡 [6] Sending notification to buyer...");
      if (order?.buyer_id) {
        console.log("✅ [6] Buyer has id:", order.buyer_id);
        const deliveryDate = new Date(estimatedDeliveryAt);
        const formattedDate = deliveryDate.toLocaleDateString(
          'ar-SA',
          { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        );

        const { error: notifyBuyerError } = await supabase
          .from("notifications")
          .insert({
            user_id: order.buyer_id,
            type: "order_shipped",
            title_ar: "🚚 تم شحن طلبك!",
            body_ar: `تم شحن طلبك "${order.listings?.title_ar}" بواسطة ${distributor?.full_name_ar || 'الموزع'} - الوقت المتوقع للوصول: ${formattedDate}`,
            title_en: `Your order has been shipped!`,
            body_en: `Your order "${order.listings?.title_en || order.listings?.title_ar}" has been shipped via ${distributor?.full_name_en || 'distributor'} - Estimated delivery: ${deliveryDate.toLocaleString('en-US')}`,
            link_url: `/orders/${orderId}`,
            metadata: {
              order_id: orderId,
              distributor_id: distributorId,
              estimated_delivery_at: estimatedDeliveryAt,
              distributor_phone: distributor?.phone,
            }
          });

        if (notifyBuyerError) {
          console.error("❌ [6] Error sending notification to buyer:", notifyBuyerError);
        } else {
          console.log("✅ [6] Notification sent to buyer:", order.buyer_id);
        }
      } else {
        console.warn("⚠️ [6] No buyer_id found, skipping notification");
      }

      // ✅ 7. إشعار للبائع (صاحب المتجر)
      console.log("📡 [7] Sending notification to seller...");
      if (order?.listings?.owner_id) {
        console.log("✅ [7] Seller has id:", order.listings.owner_id);
        const { error: notifySellerError } = await supabase
          .from("notifications")
          .insert({
            user_id: order.listings.owner_id,
            type: "order_accepted",
            title_ar: "✅ تم قبول طلب التوصيل",
            body_ar: `تم قبول طلب "${order.listings?.title_ar}" من شركة التوصيل وتعيين موزع - الوقت المتوقع للوصول: ${new Date(estimatedDeliveryAt).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}`,
            link_url: `/orders/${orderId}`,
            metadata: {
              order_id: orderId,
              distributor_id: distributorId,
              estimated_delivery_at: estimatedDeliveryAt,
            }
          });

        if (notifySellerError) {
          console.error("❌ [7] Error sending notification to seller:", notifySellerError);
        } else {
          console.log("✅ [7] Notification sent to seller:", order.listings.owner_id);
        }
      } else {
        console.warn("⚠️ [7] No seller owner_id found, skipping notification");
      }

      console.log("🎉 [useAcceptDeliveryOrder] COMPLETED SUCCESSFULLY");
      return deliveryOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("✅ تم قبول الطلب وتعيين الموزع مع إرسال الإشعارات");
    },
    onError: (error) => {
      console.error("❌ Error accepting delivery:", error);
      toast.error("❌ فشل قبول الطلب");
    },
  });
}

// ✅ رفض طلب توصيل مع سبب
export function useRejectDeliveryOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      deliveryOrderId, 
      orderId,
      reason 
    }: { 
      deliveryOrderId: string; 
      orderId: string;
      reason: string;
    }) => {
      // 1. جلب بيانات الطلب للإشعارات
      const { data: order, error: orderFetchError } = await supabase
        .from("orders")
        .select(`
          buyer_id,
          listings:listing_id (
            title_ar,
            title_en,
            owner_id
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderFetchError) throw orderFetchError;

      // 2. تحديث delivery_order
      const { data: deliveryOrder, error: deliveryError } = await supabase
        .from("delivery_orders")
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          rejection_reason: reason.trim(),
          notes_ar: `مرفوض: ${reason.trim()}`,
          notes_en: `Rejected: ${reason.trim()}`,
        })
        .eq("id", deliveryOrderId)
        .select()
        .single();

      if (deliveryError) throw deliveryError;

      // 3. تحديث order الرئيسي
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason.trim(),
        })
        .eq("id", orderId);

      if (orderError) throw orderError;

      // 4. إشعار للبائع
      if (order?.listings?.owner_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: order.listings.owner_id,
            type: "order_rejected",
            title_ar: "❌ تم رفض طلب التوصيل",
            body_ar: `تم رفض طلب "${order.listings?.title_ar}" من شركة التوصيل. السبب: ${reason.trim()}`,
            link_url: `/orders/${orderId}`,
            metadata: {
              rejection_reason: reason.trim(),
              order_id: orderId,
            }
          });
      }

      // 5. إشعار للمشتري
      if (order?.buyer_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: order.buyer_id,
            type: "order_rejected",
            title_ar: "❌ تم رفض طلبك",
            body_ar: `آسفون، تم رفض طلبك "${order.listings?.title_ar}" من شركة التوصيل. السبب: ${reason.trim()}`,
            link_url: `/orders/${orderId}`,
            metadata: {
              rejection_reason: reason.trim(),
              order_id: orderId,
            }
          });
      }

      return deliveryOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("✅ تم رفض الطلب مع إرسال السبب");
    },
  });
}


export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string): Promise<DeleteStoreResult> => {
      return StoreService.deleteStore(userId);
    },
    onSuccess: (result) => {
      if (result.success) {
        // ✅ تحديث الكاش بعد الحذف
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["myListings"] });
        queryClient.invalidateQueries({ queryKey: ["mySellerApplication"] });
        queryClient.invalidateQueries({ queryKey: ["my-orders"] });
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        queryClient.invalidateQueries({ queryKey: ["stores"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });

        toast.success(
          "🗑️ تم حذف المتجر وجميع بياناته بنجاح",
          { duration: 5000 }
        );
      } else {
        toast.error(`❌ فشل حذف المتجر: ${result.error}`);
      }
    },
    onError: (error: Error) => {
      console.error("❌ useDeleteStore error:", error);
      toast.error(`❌ فشل حذف المتجر: ${error.message}`);
    },
  });
}

/**
 * ✅ Hook: التحقق من وجود بيانات مرتبطة بالمتجر
 */
export function useStoreDependencies(userId: string | undefined) {
  return useQuery({
    queryKey: ["store-dependencies", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      return StoreService.checkStoreDependencies(userId);
    },
    staleTime: 1000 * 30, // 30 ثانية
    gcTime: 1000 * 60 * 5, // 5 دقائق
  });
}

/**
 * ✅ Hook: التحقق من وجود طلبات نشطة
 */
export function useHasActiveOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["has-active-orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return { hasActive: false, count: 0, orders: [] };
      return StoreService.hasActiveOrders(userId);
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
}

/**
 * ✅ Hook: التحقق من وجود شكاوى نشطة
 */
export function useHasActiveComplaints(userId: string | undefined) {
  return useQuery({
    queryKey: ["has-active-complaints", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return { hasActive: false, count: 0, complaints: [] };
      return StoreService.hasActiveComplaints(userId);
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
}
// ✅ تحديث حالة طلب التوصيل (للاستخدامات الأخرى)
// ✅ احتفظ بهذا التعريف (الأول)
export function useUpdateDeliveryOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      distributorId,
    }: {
      id: string;
      status: DeliveryOrder['status'];
      distributorId?: string;
    }) => {
      const payload: any = { status };
      if (distributorId) payload.distributor_id = distributorId;
      
      if (status === 'picked_up') payload.picked_up_at = new Date().toISOString();
      if (status === 'delivered') payload.delivered_at = new Date().toISOString();
      if (status === 'cancelled') payload.cancelled_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("delivery_orders")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as DeliveryOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
    },
  });
}


// ✅ جلب الموزعين الأقرب للعميل
export function useNearestDistributors(orderId: string) {
  return useQuery({
    queryKey: ["nearest-distributors", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      // 1. جلب بيانات الطلب (العنوان والإحداثيات)
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("delivery_lat, delivery_lng, delivery_address, governorate_id")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      // 2. جلب الموزعين المتاحين في نفس المحافظة
      const { data: distributors, error: distError } = await supabase
        .from("distributors")
        .select(`
          id,
          user_id,
          full_name_ar,
          full_name_en,
          phone,
          avatar_url,
          rating,
          is_available,
          completed_orders,
          lat,
          lng,
          governorate_id
        `)
        .eq("is_available", true)
        .eq("is_active", true)
        .eq("governorate_id", order.governorate_id);

      if (distError) throw distError;

      // 3. حساب المسافة لكل موزع
      const distributorsWithDistance = distributors.map((dist: any) => {
        let distance = Infinity;
        let distanceText = "غير محدد";
        
        if (dist.lat && dist.lng && order.delivery_lat && order.delivery_lng) {
          distance = calculateDistance(
            dist.lat, dist.lng,
            order.delivery_lat, order.delivery_lng
          );
          distanceText = distance < 1 
            ? `${Math.round(distance * 1000)} م`
            : `${distance.toFixed(1)} كم`;
        }
        
        return {
          ...dist,
          distance,
          distanceText,
        };
      });

      // 4. ترتيب حسب الأقرب
      return distributorsWithDistance
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 20);
    },
  });
}

// ✅ دالة حساب المسافة (هافرسين)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
// ============================================================
// 🎁 PRODUCT OFFERS - جلب العروض الترويجية للعرض العام
// ============================================================

/**
 * جلب العروض الترويجية مع فلترة (للعرض العام)
 */
export async function getProductOffers(options?: {
  storeId?: string;
  listingId?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  offerType?: 'bogo' | 'cross_sell' | 'bundle';
  featured?: boolean;
  categoryId?: string;
}) {
  console.log("📡 [getProductOffers] ===== START =====");
  console.log("📡 [getProductOffers] Options received:", JSON.stringify(options, null, 2));
  
  let query = supabase
    .from("product_offers")
    .select(`
      *,
      store:store_id (
        id,
        full_name,
        store_name,
        store_logo_url,
        store_cover_url
      ),
      category:category_id (
        id,
        name_ar,
        name_en,
        slug,
        icon,
        image_url
      )
    `)
    .order("featured_sort", { ascending: true })
    .order("created_at", { ascending: false });

  // ✅ فلتر حسب النشاط
  if (options?.isActive !== undefined) {
    query = query.eq("is_active", options.isActive);
  } else {
    query = query.eq("is_active", true);
  }

  // ✅ فلتر حسب المتجر
  if (options?.storeId) {
    query = query.eq("store_id", options.storeId);
  }

  // ✅ فلتر حسب التصنيف
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  // ✅ فلتر حسب نوع العرض
  if (options?.offerType) {
    query = query.eq("offer_type", options.offerType);
  }

  // ✅ فلتر المميزين
  if (options?.featured !== undefined) {
    query = query.eq("is_featured", options.featured);
  }

  // ✅ فلتر الصلاحية
  const now = new Date().toISOString();
  query = query.or(`expires_at.is.null,expires_at.gt.${now}`);

  // ✅ Pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  console.log("🚀 [getProductOffers] Executing query...");
  
  const { data, error } = await query;

  if (error) {
    console.error("❌ [getProductOffers] Error:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.log("⚠️ [getProductOffers] No offers found");
    return [];
  }

  console.log(`📊 [getProductOffers] Found ${data.length} offers`);

  // ✅ ✅ ✅ جلب جميع البيانات لكل عرض
  const offersWithFullData = await Promise.all(
    data.map(async (offer: any) => {
      console.log(`🔄 Processing offer ${offer.id}: ${offer.offer_type}`);

      // ============================================================
      // 1️⃣ جلب المنتج الرئيسي (listing_id) مع كل علاقاته
      // ============================================================
      const { data: mainProduct, error: mainError } = await supabase
        .from("listings")
        .select(`
          *,
          profile:profiles!owner_id (
            id, full_name, store_name, store_logo_url, store_cover_url, avatar_url
          ),
          governorates!governorate_id (
            id, name_ar, name_en
          ),
          categories!category_id (
            id, name_ar, name_en, slug, icon, image_url
          ),
          colors:product_colors (
            id, color_name_ar, color_name_en, color_hex, image_url
          ),
          variations:product_variations (
            id, sku, combination, price, old_price, stock_quantity, image_url, is_active
          ),
          options:product_options (
            id, option_type, option_value, option_label_ar, option_label_en, sort_order
          ),
          listing_images (
            id, url, sort_order
          )
        `)
        .eq("id", offer.listing_id)
        .maybeSingle();

      if (mainError) {
        console.error(`❌ Error fetching main product:`, mainError);
      }

      // ============================================================
      // 2️⃣ جلب المنتج الهدية (free_listing_id) إن وجد
      // ============================================================
      let freeProduct = null;
      if (offer.free_listing_id) {
        const { data: freeData, error: freeError } = await supabase
          .from("listings")
          .select(`
            *,
            profile:profiles!owner_id (
              id, full_name, store_name, store_logo_url, store_cover_url, avatar_url
            ),
            governorates!governorate_id (
              id, name_ar, name_en
            ),
            categories!category_id (
              id, name_ar, name_en, slug, icon, image_url
            ),
            colors:product_colors (
              id, color_name_ar, color_name_en, color_hex, image_url
            ),
            variations:product_variations (
              id, sku, combination, price, old_price, stock_quantity, image_url, is_active
            ),
            listing_images (
              id, url, sort_order
            )
          `)
          .eq("id", offer.free_listing_id)
          .maybeSingle();

        if (!freeError && freeData) {
          freeProduct = freeData;
          console.log(`   🎁 Free product: ${freeProduct.title_ar}`);
        }
      }

      // ============================================================
      // 3️⃣ جلب المنتجات المطلوبة (required_product_ids) للـ Bundle
      // ============================================================
      let requiredProducts = [];
      if (offer.required_product_ids && offer.required_product_ids.length > 0) {
        const { data: requiredData, error: requiredError } = await supabase
          .from("listings")
          .select(`
            *,
            profile:profiles!owner_id (
              id, full_name, store_name, store_logo_url, store_cover_url, avatar_url
            ),
            governorates!governorate_id (
              id, name_ar, name_en
            ),
            categories!category_id (
              id, name_ar, name_en, slug, icon, image_url
            ),
            colors:product_colors (
              id, color_name_ar, color_name_en, color_hex, image_url
            ),
            variations:product_variations (
              id, sku, combination, price, old_price, stock_quantity, image_url, is_active
            ),
            listing_images (
              id, url, sort_order
            )
          `)
          .in("id", offer.required_product_ids);

        if (!requiredError && requiredData) {
          requiredProducts = requiredData;
          console.log(`   📦 Required products: ${requiredProducts.length}`);
        }
      }

      // ============================================================
      // 4️⃣ فلترة الفيرنتات حسب الـ IDs المحددة
      // ============================================================
      
      // ✅ فيرنتات المنتج الرئيسي (variation_ids)
      let mainVariations = mainProduct?.variations || [];
      if (offer.variation_ids && offer.variation_ids.length > 0) {
        mainVariations = mainVariations.filter((v: any) => 
          offer.variation_ids.includes(v.id)
        );
      }

      // ✅ فيرنتات المنتج الهدية (result_variation_ids)
      let freeVariations = freeProduct?.variations || [];
      if (offer.result_variation_ids && offer.result_variation_ids.length > 0) {
        freeVariations = freeVariations.filter((v: any) => 
          offer.result_variation_ids.includes(v.id)
        );
      }

      // ✅ فيرنتات المنتجات المطلوبة (required_variations)
      let requiredVariations = [];
      if (offer.required_variations && offer.required_variations.length > 0) {
        requiredVariations = offer.required_variations.map((rv: any) => {
          const product = requiredProducts.find((p: any) => p.id === rv.product_id);
          const variations = product?.variations?.filter((v: any) => 
            rv.variation_ids?.includes(v.id)
          ) || [];
          return {
            ...rv,
            product,
            variations
          };
        });
      }

      // ============================================================
      // 5️⃣ بناء الكائن النهائي
      // ============================================================
      return {
        ...offer,
        
        // ✅ المنتج الرئيسي
        main_product: mainProduct || null,
        main_variations: mainVariations,
        
        // ✅ المنتج الهدية (للـ BOGO و Cross-sell)
        free_product: freeProduct,
        free_variations: freeVariations,
        
        // ✅ المنتجات المطلوبة (للـ Bundle)
        required_products: requiredProducts,
        required_variations: requiredVariations,
        
        // ✅ ✅ ✅ منتجات موحدة (للعرض في الـ UI)
        products: mainProduct ? [mainProduct] : [],
        
        // ✅ ✅ ✅ كل الفيرنتات المتاحة في العرض
        all_variations: {
          main: mainVariations,
          free: freeVariations,
          required: requiredVariations
        },
        
        // ✅ ✅ ✅ تفاصيل العرض بالعربية والإنجليزية
        display: {
          ar: offer.display_text_ar || mainProduct?.title_ar || "عرض ترويجي",
          en: offer.display_text_en || mainProduct?.title_en || "Promo Offer"
        }
      };
    })
  );

  console.log(`✅ [getProductOffers] Completed: ${offersWithFullData.length} offers processed`);
  console.log("📊 [getProductOffers] Sample:", offersWithFullData?.[0]);
  console.log("🔍 [getProductOffers] ===== END =====");
  
  return offersWithFullData;
}
// ============================================================
// 🎁 HOOK: useProductOffers (للعرض العام)
// ============================================================

export function useProductOffers(options?: {
  storeId?: string;
  listingId?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  offerType?: 'bogo' | 'cross_sell' | 'bundle';
  featured?: boolean;
  categoryId?: string;
}) {
  console.log("🎯 [useProductOffers] Hook called with options:", options);
  
  return useQuery({
    queryKey: ["product-offers", options],
    queryFn: () => {
      console.log("🔄 [useProductOffers] queryFn executing...");
      return getProductOffers(options);
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
export function useGetOrCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      otherUserId 
    }: { 
      userId: string; 
      otherUserId: string; 
    }) => {
      // 1. جلب كل محادثات المستخدم
      const { data: conversations, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`);

      if (fetchError) throw fetchError;

      // 2. البحث عن محادثة مع المستخدم الآخر
      const existing = conversations?.find((conv: any) => 
        (conv.participant1_id === otherUserId && conv.participant2_id === userId) ||
        (conv.participant1_id === userId && conv.participant2_id === otherUserId)
      );

      if (existing) {
        return existing;
      }

      // 3. إنشاء محادثة جديدة
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          participant1_id: userId,
          participant2_id: otherUserId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["conversations", variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["conversations", variables.otherUserId] 
      });
    },
  });
}