// src/lib/services/StoreService.ts

import { supabase } from "@/integrations/supabase/client";

export interface DeleteStoreResult {
  success: boolean;
  error?: string;
  deletedData?: {
    listings: number;
    orders: number;
    bookings: number;
    messages: number;
    favorites: number;
    reviews: number;
    carts: number;
    sellerApplications: number;
    storeFollowers: number;
  };
}

export const StoreService = {
  /**
   * ✅ التحقق من وجود بيانات مرتبطة بالمتجر قبل الحذف
   */
  async checkStoreDependencies(userId: string): Promise<{
    hasData: boolean;
    counts: {
      listings: number;
      orders: number;
      bookings: number;
      messages: number;
      favorites: number;
      reviews: number;
      carts: number;
      sellerApplications: number;
      storeFollowers: number;
      deliveryOrders: number;
      complaints: number;
    };
  }> {
    console.log(`🔍 [STEP 1] Checking dependencies for user: ${userId}`);

    // ✅ جلب عدد المنتجات
    const { count: listings, error: listingsError } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);

    if (listingsError) {
      console.error("❌ Error counting listings:", listingsError);
    }

    // ✅ جلب عدد الطلبات (كمنتج أو مشتري)
    const { count: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);

    if (ordersError) {
      console.error("❌ Error counting orders:", ordersError);
    }

    // ✅ جلب عدد الحجوزات
    const { count: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .or(`provider_id.eq.${userId},customer_id.eq.${userId}`);

    if (bookingsError) {
      console.error("❌ Error counting bookings:", bookingsError);
    }

    // ✅ جلب عدد الرسائل
    const { count: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (messagesError) {
      console.error("❌ Error counting messages:", messagesError);
    }

    // ✅ جلب عدد المفضلات
    const { count: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (favoritesError) {
      console.error("❌ Error counting favorites:", favoritesError);
    }

    // ✅ جلب عدد التقييمات
    const { count: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (reviewsError) {
      console.error("❌ Error counting reviews:", reviewsError);
    }

    // ✅ جلب عدد السلات
    const { count: carts, error: cartsError } = await supabase
      .from("carts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (cartsError) {
      console.error("❌ Error counting carts:", cartsError);
    }

    // ✅ جلب عدد طلبات فتح المتجر
    const { count: sellerApplications, error: sellerAppsError } = await supabase
      .from("seller_applications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (sellerAppsError) {
      console.error("❌ Error counting seller applications:", sellerAppsError);
    }

    // ✅ جلب عدد متابعي المتجر
    const { count: storeFollowers, error: followersError } = await supabase
      .from("store_followers")
      .select("*", { count: "exact", head: true })
      .eq("store_id", userId);

    if (followersError) {
      console.error("❌ Error counting store followers:", followersError);
    }

    // ✅ جلب عدد طلبات التوصيل المرتبطة
    const { count: deliveryOrders, error: deliveryError } = await supabase
      .from("delivery_orders")
      .select("*", { count: "exact", head: true })
      .eq("rejected_by", userId);

    if (deliveryError) {
      console.error("❌ Error counting delivery orders:", deliveryError);
    }

    // ✅ جلب عدد الشكاوى
    const { count: complaints, error: complaintsError } = await supabase
      .from("complaints")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (complaintsError) {
      console.error("❌ Error counting complaints:", complaintsError);
    }

    const counts = {
      listings: listings || 0,
      orders: orders || 0,
      bookings: bookings || 0,
      messages: messages || 0,
      favorites: favorites || 0,
      reviews: reviews || 0,
      carts: carts || 0,
      sellerApplications: sellerApplications || 0,
      storeFollowers: storeFollowers || 0,
      deliveryOrders: deliveryOrders || 0,
      complaints: complaints || 0,
    };

    const hasData = Object.values(counts).some((count) => count > 0);

    console.log(`📊 [STEP 2] Dependency counts:`, counts);
    console.log(`📊 [STEP 3] Has data:`, hasData);

    return {
      hasData,
      counts,
    };
  },

  /**
   * ✅ حذف المتجر وجميع بياناته
   */
  async deleteStore(userId: string): Promise<DeleteStoreResult> {
    try {
      console.log(`🗑️ [STEP 1] Starting store deletion for user: ${userId}`);

      // ✅ STEP 2: التحقق من وجود بيانات
      const dependencies = await this.checkStoreDependencies(userId);
      console.log(`📊 [STEP 2] Dependencies found:`, dependencies);

      // ✅ STEP 3: حذف المنتجات (مع CASCADE)
      console.log(`🗑️ [STEP 3] Deleting listings...`);
      const { error: listingsError } = await supabase
        .from("listings")
        .delete()
        .eq("owner_id", userId);

      if (listingsError) {
        console.error("❌ Error deleting listings:", listingsError);
        throw new Error(`Failed to delete listings: ${listingsError.message}`);
      }
      console.log(`✅ [STEP 3] Listings deleted successfully`);

      // ✅ STEP 4: حذف طلبات فتح المتجر
      console.log(`🗑️ [STEP 4] Deleting seller applications...`);
      const { error: appsError } = await supabase
        .from("seller_applications")
        .delete()
        .eq("user_id", userId);

      if (appsError) {
        console.warn(`⚠️ Error deleting seller applications (non-critical):`, appsError);
      } else {
        console.log(`✅ [STEP 4] Seller applications deleted`);
      }

      // ✅ STEP 5: حذف متابعي المتجر
      console.log(`🗑️ [STEP 5] Deleting store followers...`);
      const { error: followersError } = await supabase
        .from("store_followers")
        .delete()
        .eq("store_id", userId);

      if (followersError) {
        console.warn(`⚠️ Error deleting store followers (non-critical):`, followersError);
      } else {
        console.log(`✅ [STEP 5] Store followers deleted`);
      }

      // ✅ STEP 6: تنظيف بيانات المتجر من جدول profiles
      console.log(`🗑️ [STEP 6] Clearing store data from profile...`);
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          store_name: null,
          store_description: null,
          store_logo_url: null,
          store_cover_url: null,
          store_phone: null,
          store_type: null,
          store_address: null,
          store_opens_at: null,
          store_closes_at: null,
          weekly_off_days: null,
          store_active: false,
          store_online: false,
          allows_messaging: false,
          allows_bookings: false,
          governorate_id: null,
          is_featured: false,
          featured_sort: 0,
          company_id: null,
        })
        .eq("id", userId);

      if (updateProfileError) {
        console.error("❌ Error clearing store data:", updateProfileError);
        throw new Error(`Failed to clear store data: ${updateProfileError.message}`);
      }
      console.log(`✅ [STEP 6] Store data cleared from profile`);

      // ✅ STEP 7: حذف دور seller من user_roles
      console.log(`🗑️ [STEP 7] Removing seller role...`);
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "seller");

      if (roleError) {
        console.warn(`⚠️ Error removing seller role (non-critical):`, roleError);
      } else {
        console.log(`✅ [STEP 7] Seller role removed`);
      }

      // ✅ STEP 8: إرسال إشعار للمستخدم
      console.log(`📬 [STEP 8] Sending deletion notification...`);
      try {
        await supabase.from("notifications").insert({
          user_id: userId,
          type: "store_deleted",
          title_ar: "🗑️ تم حذف متجرك",
          body_ar: "تم حذف متجرك وجميع بياناته بناءً على طلبك",
          title_en: "🗑️ Your store has been deleted",
          body_en: "Your store and all its data have been deleted as per your request",
          link_url: "/dashboard",
          metadata: {
            deleted_at: new Date().toISOString(),
          },
        });
        console.log(`✅ [STEP 8] Notification sent`);
      } catch (notifError) {
        console.warn(`⚠️ Error sending notification (non-critical):`, notifError);
      }

      console.log(`✅ [STEP 9] Store deletion completed successfully!`);

      return {
        success: true,
        deletedData: {
          listings: dependencies.counts.listings,
          orders: dependencies.counts.orders,
          bookings: dependencies.counts.bookings,
          messages: dependencies.counts.messages,
          favorites: dependencies.counts.favorites,
          reviews: dependencies.counts.reviews,
          carts: dependencies.counts.carts,
          sellerApplications: dependencies.counts.sellerApplications,
          storeFollowers: dependencies.counts.storeFollowers,
        },
      };
    } catch (error: any) {
      console.error(`❌ [ERROR] Store deletion failed:`, error);
      return {
        success: false,
        error: error.message || "Unknown error occurred",
      };
    }
  },

  /**
   * ✅ التحقق من وجود طلبات نشطة تمنع الحذف
   */
  async hasActiveOrders(userId: string): Promise<{
    hasActive: boolean;
    count: number;
    orders: any[];
  }> {
    try {
      const { data, count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
        .in("status", ["pending", "confirmed", "processing", "shipped"]);

      if (error) {
        console.error("❌ Error checking active orders:", error);
        return { hasActive: false, count: 0, orders: [] };
      }

      return {
        hasActive: (count || 0) > 0,
        count: count || 0,
        orders: data || [],
      };
    } catch (error) {
      console.error("❌ Error in hasActiveOrders:", error);
      return { hasActive: false, count: 0, orders: [] };
    }
  },

  /**
   * ✅ التحقق من وجود شكاوى نشطة تمنع الحذف
   */
  async hasActiveComplaints(userId: string): Promise<{
    hasActive: boolean;
    count: number;
    complaints: any[];
  }> {
    try {
      const { data, count, error } = await supabase
        .from("complaints")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .in("status", ["pending", "in_progress"]);

      if (error) {
        console.error("❌ Error checking active complaints:", error);
        return { hasActive: false, count: 0, complaints: [] };
      }

      return {
        hasActive: (count || 0) > 0,
        count: count || 0,
        complaints: data || [],
      };
    } catch (error) {
      console.error("❌ Error in hasActiveComplaints:", error);
      return { hasActive: false, count: 0, complaints: [] };
    }
  },
};