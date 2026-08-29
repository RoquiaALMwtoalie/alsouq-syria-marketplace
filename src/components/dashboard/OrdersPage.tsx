// src/components/dashboard/OrdersPage.tsx

import React, { useState, useMemo, useCallback } from "react";
import { 
  ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, Eye, X, Layers,
  AlertCircle, Sparkles, Rocket, DollarSign,
  Calendar, User, Phone, MessageCircle,
  TrendingUp, Star, Users, Clock as ClockIcon,
  MapPin, Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp, formatPrice } from "@/lib/i18n";
import { useStoreOrders } from "@/lib/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
const { saveAs } = pkg;
// ✅ دالة توليد رقم تتبع فريد
const generateTrackingNumber = () => {
  const prefix = 'SQT'; // Souq Tracking
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
// ============================================================
// ✅ دوال حالة الطلب (للمتجر) - getOrderStatus
// ============================================================

function getOrderStatus(status: string) {
  const map: Record<string, { label: string; color: string; icon: any; description: string; bg: string; border: string }> = {
    pending: { 
      label: "⏳ قيد المراجعة", 
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50/80 dark:bg-amber-950/30",
      border: "border-amber-200/60 dark:border-amber-800/40",
      icon: Clock,
      description: "في انتظار موافقتك"
    },
    accepted: { 
      label: "✅ تم القبول", 
      color: "text-[#2a655f] dark:text-[#3a8a82]",
      bg: "bg-[#2a655f]/5 dark:bg-[#2a655f]/20",
      border: "border-[#2a655f]/20 dark:border-[#2a655f]/30",
      icon: CheckCircle2,
      description: "تم قبول الطلب"
    },
    processing: { 
      label: "🔄 قيد المعالجة", 
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50/80 dark:bg-blue-950/30",
      border: "border-blue-200/60 dark:border-blue-800/40",
      icon: RefreshCw,
      description: "جاري تجهيز الطلب"
    },
    shipped: { 
      label: "🚚 تم الشحن", 
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50/80 dark:bg-indigo-950/30",
      border: "border-indigo-200/60 dark:border-indigo-800/40",
      icon: Truck,
      description: "تم شحن الطلب"
    },
    assigned: { 
      label: "📋 تم التعيين", 
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50/80 dark:bg-purple-950/30",
      border: "border-purple-200/60 dark:border-purple-800/40",
      icon: User,
      description: "تم تعيين موزع"
    },
    delivered: { 
      label: "📦 تم التوصيل", 
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      icon: CheckCircle2,
      description: "تم توصيل الطلب"
    },
    completed: { 
      label: "✅ مكتمل", 
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      icon: CheckCircle2,
      description: "تم إكمال الطلب"
    },
    rejected: { 
      label: "❌ مرفوض", 
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50/80 dark:bg-red-950/30",
      border: "border-red-200/60 dark:border-red-800/40",
      icon: XCircle,
      description: "تم رفض الطلب"
    },
    cancelled: { 
      label: "🚫 ملغي", 
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50/80 dark:bg-rose-950/30",
      border: "border-rose-200/60 dark:border-rose-800/40",
      icon: XCircle,
      description: "تم إلغاء الطلب"
    },
  };
  return map[status] || map.pending;
}

// ============================================================
// ✅ ORDERS PAGE - جدول بسيط مع تفاصيل عند الضغط
// ============================================================

export const OrdersPage = React.memo(function OrdersPage() {
  const app = useApp();
  
  // ===== STATES =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // ===== API - استخدم useStoreOrders (طلبات المتجر فقط) =====
  const { 
    data: allOrders = [], 
    isLoading, 
    isError,
    refetch: refetchOrders,
    isFetching 
  } = useStoreOrders(app.user?.id);

  // ===== FILTER ORDERS BY SELLER (للتأكد) =====
  const storeOrders = useMemo(() => {
    return allOrders.filter((order: any) => order.seller_id === app.user?.id);
  }, [allOrders, app.user?.id]);

  // ===== APPLY FILTERS (بدون فلتر نوع) =====
  const filteredOrders = useMemo(() => {
    let result = storeOrders;

    if (filterStatus !== "all") {
      result = result.filter((order: any) => order.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((order: any) => {
        const id = order.id?.toLowerCase() || "";
        const customerName = order.buyer_name?.toLowerCase() || "";
        const customerPhone = order.buyer_phone?.toLowerCase() || "";
        const notes = order.notes?.toLowerCase() || "";
        
        return id.includes(q) || 
               customerName.includes(q) ||
               customerPhone.includes(q) ||
               notes.includes(q);
      });
    }

    // ✅ ✅ ✅ ترتيب الطلبات: قيد المراجعة بالأعلى، ثم الأحدث
    const statusOrder: Record<string, number> = {
      pending: 0,
      accepted: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      completed: 5,
      rejected: 6,
      cancelled: 7,
    };

    return result.sort((a: any, b: any) => {
      const statusDiff = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [storeOrders, searchQuery, filterStatus]);

  // ===== ✅ PAGINATION =====
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // ===== STATS =====
  const stats = useMemo(() => ({
    total: storeOrders.length,
    pending: storeOrders.filter((o: any) => o.status === "pending").length,
    accepted: storeOrders.filter((o: any) => o.status === "accepted").length,
    rejected: storeOrders.filter((o: any) => o.status === "rejected").length,
    processing: storeOrders.filter((o: any) => o.status === "processing").length,
    shipped: storeOrders.filter((o: any) => o.status === "shipped").length,
    delivered: storeOrders.filter((o: any) => o.status === "delivered").length,
    cancelled: storeOrders.filter((o: any) => o.status === "cancelled").length,
  }), [storeOrders]);

  const totalRevenue = useMemo(() => {
    return storeOrders
      .filter((o: any) => o.status === "delivered" || o.status === "completed")
      .reduce((sum: number, order: any) => sum + (Number(order.total_with_delivery) || Number(order.total) || 0), 0);
  }, [storeOrders]);

  // ===== HELPERS =====
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: app.lang === "ar" ? "قيد المراجعة" : "Pending",
      accepted: app.lang === "ar" ? "مقبول" : "Accepted",
      rejected: app.lang === "ar" ? "مرفوض" : "Rejected",
      processing: app.lang === "ar" ? "قيد المعالجة" : "Processing",
      shipped: app.lang === "ar" ? "تم الشحن" : "Shipped",
      delivered: app.lang === "ar" ? "تم التوصيل" : "Delivered",
      cancelled: app.lang === "ar" ? "ملغي" : "Cancelled",
      completed: app.lang === "ar" ? "مكتمل" : "Completed",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
      processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
      completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
    return colors[status] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: Clock,
      accepted: CheckCircle2,
      rejected: XCircle,
      processing: RefreshCw,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle,
      completed: CheckCircle2,
    };
    return icons[status] || Clock;
  };

  // ===== ACCEPT ORDER =====
// ===== ACCEPT ORDER =====
const handleAcceptOrder = useCallback(async (orderId: string) => {
  try {
    console.log("🚀 Starting order acceptance for:", orderId);

    // ✅ 1️⃣ جلب بيانات الطلب
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        seller_id,
        buyer_id,
        delivery_address,
        delivery_lat,
        delivery_lng,
        total,
        delivery_fee, 
        buyer_name,
        buyer_phone,
        notes
      `)
      .eq("id", orderId)
      .single();

    if (orderError) {
      console.error("❌ Order fetch error:", orderError);
      toast.error(app.lang === "ar" ? "❌ لم نتمكن من جلب الطلب" : "❌ Could not fetch order");
      return;
    }

    if (!order) {
      toast.error(app.lang === "ar" ? "❌ الطلب غير موجود" : "❌ Order not found");
      return;
    }

    console.log("📦 Order data:", order);

    // ✅ 2️⃣ جلب بيانات المتجر
    const { data: storeData, error: storeError } = await supabase
      .from("profiles")
      .select(`
        id,
        store_name,
        delivery_company_id,
        store_address,
        lat,
        lng
      `)
      .eq("id", order.seller_id)
      .single();

    if (storeError) {
      console.error("❌ Store fetch error:", storeError);
      toast.error(app.lang === "ar" ? "❌ لم نتمكن من جلب بيانات المتجر" : "❌ Could not fetch store data");
      return;
    }

    console.log("🏪 Store data:", storeData);

    // ✅ 3️⃣ استخراج شركة التوصيل
    let deliveryCompanyId = storeData?.delivery_company_id;

    console.log(`🏢 Delivery company from store: ${deliveryCompanyId}`);

    if (!deliveryCompanyId) {
      console.warn(`⚠️ Store ${storeData.id} (${storeData.store_name}) has no delivery company`);
      
      const { data: fallbackCompany } = await supabase
        .from("delivery_companies")
        .select("id, name_ar")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (fallbackCompany) {
        deliveryCompanyId = fallbackCompany.id;
        console.log(`🔄 Using fallback company: ${fallbackCompany.name_ar} (${fallbackCompany.id})`);
      }
    }

    if (!deliveryCompanyId) {
      toast.error(app.lang === "ar" ? "❌ لا توجد شركة توصيل متاحة" : "❌ No delivery company available");
      return;
    }

    console.log(`✅ Final delivery company: ${deliveryCompanyId}`);

    // ✅ ✅ ✅ إنشاء رقم تتبع فريد
    const trackingNumber = generateTrackingNumber();
    console.log(`🔢 Generated tracking number: ${trackingNumber}`);

    // ✅ 4️⃣ تحديث الطلب مع tracking_number
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        delivery_company_id: deliveryCompanyId,
        tracking_number: trackingNumber, // ✅ ✅ ✅ إضافة رقم التتبع
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("❌ Update error:", updateError);
      throw updateError;
    }

    console.log("✅ Order updated successfully");

    // ✅ 5️⃣ التحقق من وجود delivery_order مسبقاً
    const { data: existingDelivery, error: checkError } = await supabase
      .from("delivery_orders")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Check delivery order error:", checkError);
    }

    // ✅ 6️⃣ إنشاء طلب توصيل (إذا لم يكن موجوداً) مع tracking_number
    if (!existingDelivery) {
      const { error: deliveryError } = await supabase
        .from("delivery_orders")
        .insert({
          order_id: orderId,
          delivery_company_id: deliveryCompanyId,
          pickup_address: storeData?.store_address || "عنوان المتجر",
          pickup_latitude: storeData?.lat || 0,
          pickup_longitude: storeData?.lng || 0,
          delivery_address: order.delivery_address || "عنوان التوصيل",
          delivery_latitude: order.delivery_lat || 0,
          delivery_longitude: order.delivery_lng || 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          estimated_pickup_at: new Date(Date.now() + 3600000).toISOString(),
          estimated_delivery_at: new Date(Date.now() + 7200000).toISOString(),
          delivery_fee: order.delivery_fee || 0,
          tracking_number: trackingNumber, // ✅ ✅ ✅ إضافة رقم التتبع
        });

      if (deliveryError) {
        console.error("❌ Delivery order creation error:", deliveryError);
        toast.warning(app.lang === "ar" 
          ? "⚠️ تم قبول الطلب لكن حدث خطأ في إنشاء طلب التوصيل (تحقق من الصلاحيات)" 
          : "⚠️ Order accepted but delivery order creation failed (check permissions)");
      } else {
        console.log("✅ Delivery order created successfully");
      }
    } else {
      console.log("ℹ️ Delivery order already exists, skipping creation");
    }

    // ✅ 7️⃣ إشعار للمشتري
    if (order.buyer_id) {
      const storeName = storeData?.store_name || 'المتجر';
      const { error: buyerNotifyError } = await supabase
        .from("notifications")
        .insert({
          user_id: order.buyer_id,
          type: "order_accepted",
          title_ar: `✅ تم قبول طلبك من "${storeName}"`,
          body_ar: `تم قبول طلبك بقيمة ${order.total?.toLocaleString() || 0} SYP وسيتم توصيله قريباً (رقم التتبع: ${trackingNumber})`,
          title_en: `✅ Your order from "${storeName}" was accepted`,
          body_en: `Your order for ${order.total?.toLocaleString() || 0} SYP was accepted and will be delivered soon (Tracking: ${trackingNumber})`,
          link_url: `/orders`,
          metadata: {
            order_id: orderId,
            store_name: storeName,
            total: order.total || 0,
            tracking_number: trackingNumber,
          },
          created_at: new Date().toISOString(),
        });

      if (buyerNotifyError) {
        console.error("❌ Buyer notification error:", buyerNotifyError);
      } else {
        console.log("✅ Buyer notification sent");
      }
    }

    // ✅ 8️⃣ إشعار لشركة التوصيل
    if (deliveryCompanyId) {
      console.log(`🔍 Fetching admins for company: ${deliveryCompanyId}`);
      
      const { data: companyAdmins, error: adminsError } = await supabase
        .from("delivery_company_admins")
        .select("user_id")
        .eq("company_id", deliveryCompanyId);

      console.log(`📊 Found ${companyAdmins?.length || 0} admins`);
      console.log("👤 Admin IDs:", companyAdmins?.map((a: any) => a.user_id));

      if (!adminsError && companyAdmins && companyAdmins.length > 0) {
        const adminIds = companyAdmins.map((a: any) => a.user_id);
        
        console.log(`📨 Sending notifications to ${adminIds.length} admins`);
        
        const { error: notifyError } = await supabase
          .from("notifications")
          .insert(
            adminIds.map((userId: string) => ({
              user_id: userId,
              type: "new_delivery_order",
              title_ar: `🚚 طلب توصيل جديد #${trackingNumber}`,
              body_ar: `تم قبول طلب توصيل جديد من المتجر (${storeData?.store_name || 'المتجر'})`,
              title_en: `🚚 New delivery order #${trackingNumber}`,
              body_en: `New delivery order accepted from store (${storeData?.store_name || 'Store'})`,
              link_url: `/delivery/dashboard`,
              metadata: {
                order_id: orderId,
                store_name: storeData?.store_name,
                delivery_company_id: deliveryCompanyId,
                tracking_number: trackingNumber,
              }
            }))
          );

        if (!notifyError) {
          console.log(`✅ Notifications sent to ${adminIds.length} admins`);
          toast.success(
            app.lang === "ar" 
              ? `✅ تم إرسال إشعار لـ ${adminIds.length} من أدمن شركة التوصيل` 
              : `✅ Notified ${adminIds.length} delivery company admins`
          );
        } else {
          console.error("❌ Notification error:", notifyError);
        }
      } else {
        console.warn(`⚠️ No admins found for company ${deliveryCompanyId}`);
      }
    }

    toast.success(app.lang === "ar" 
      ? `✅ تم قبول الطلب (رقم التتبع: ${trackingNumber})` 
      : `✅ Order accepted (Tracking: ${trackingNumber})`);

    refetchOrders();
    setDetailDialogOpen(false);
    setSelectedOrder(null);

  } catch (error) {
    console.error("❌ Error accepting order:", error);
    toast.error(app.lang === "ar" ? "❌ حدث خطأ في قبول الطلب" : "❌ Error accepting order");
  }
}, [app.lang, refetchOrders]);
  // ===== REJECT ORDER =====
  const handleRejectOrder = useCallback(async (orderId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error(app.lang === "ar" ? "❌ الرجاء إدخال سبب الرفض" : "❌ Please enter a rejection reason");
      return;
    }

    setIsRejecting(true);

    try {
      // ✅ 1️⃣ جلب بيانات الطلب (بما فيها promo_code_id)
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          id,
          buyer_id,
          promo_code_id,
          order_items (
            listings (
              title_ar,
              title_en,
              profiles:owner_id (
                store_name,
                full_name
              )
            )
          ),
          listings:listing_id (
            title_ar,
            title_en,
            profiles:owner_id (
              store_name,
              full_name
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      // ✅ 2️⃣ تحديث حالة الطلب إلى rejected
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: app.user?.id,
          rejection_reason: reason.trim()
        })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // ✅ ✅ ✅ 3️⃣ نقصان used_count إذا كان الطلب يستخدم كود خصم
      if (order.promo_code_id) {
        console.log(`🔄 [Reject Order] Decreasing used_count for promo code: ${order.promo_code_id}`);
        
        // ✅ جلب القيمة الحالية
        const { data: promoCode, error: fetchError } = await supabase
          .from("promo_codes")
          .select("used_count")
          .eq("id", order.promo_code_id)
          .single();
        
        if (!fetchError && promoCode) {
          const newCount = Math.max(0, (promoCode.used_count || 0) - 1);
          
          const { error: updateCountError } = await supabase
            .from("promo_codes")
            .update({ used_count: newCount })
            .eq("id", order.promo_code_id);
          
          if (updateCountError) {
            console.error("❌ Error decreasing used_count:", updateCountError);
          } else {
            console.log(`✅ Promo code used_count decreased to ${newCount}`);
          }
        }
        
        // ✅ ✅ ✅ حذف سجل الاستخدام من promo_code_usage
        const { error: deleteUsageError } = await supabase
          .from("promo_code_usage")
          .delete()
          .eq("order_id", orderId);
        
        if (deleteUsageError) {
          console.error("❌ Error deleting promo usage record:", deleteUsageError);
        } else {
          console.log(`✅ Promo usage record deleted for order ${orderId}`);
        }
      }

      // ✅ 4️⃣ إشعار للمشتري
      let storeName = '';
      if (order.order_items && order.order_items.length > 0) {
        const firstItem = order.order_items[0];
        const listing = firstItem?.listings;
        if (listing?.profiles) {
          storeName = app.lang === "ar" 
            ? (listing.profiles.store_name || listing.profiles.full_name || 'المتجر')
            : (listing.profiles.store_name || listing.profiles.full_name || 'Store');
        }
      } else if (order.listings?.profiles) {
        storeName = app.lang === "ar" 
          ? (order.listings.profiles.store_name || order.listings.profiles.full_name || 'المتجر')
          : (order.listings.profiles.store_name || order.listings.profiles.full_name || 'Store');
      }
      
      if (!storeName) {
        storeName = app.lang === "ar" ? "المتجر" : "Store";
      }

      const itemsCount = order.order_items?.length || 1;

      if (order.buyer_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: order.buyer_id,
            type: "order_rejected",
            title_ar: "❌ تم رفض طلبك",
            body_ar: `تم رفض طلبك من متجر "${storeName}" (${itemsCount} منتج${itemsCount > 1 ? 'ات' : ''}). السبب: ${reason.trim()}`,
            title_en: "❌ Your order was rejected",
            body_en: `Your order from "${storeName}" (${itemsCount} item${itemsCount > 1 ? 's' : ''}) was rejected. Reason: ${reason.trim()}`,
            link_url: `/orders`,
            metadata: {
              rejection_reason: reason.trim(),
              order_id: orderId,
              store_name: storeName,
            }
          });
      }

      toast.success(app.lang === "ar" ? "✅ تم رفض الطلب مع إرسال السبب" : "✅ Order rejected with reason");
      refetchOrders();
      setRejectDialogOpen(false);
      setRejectOrderId(null);
      setRejectReason("");

    } catch (error) {
      console.error("❌ Error rejecting order:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ في رفض الطلب" : "❌ Error rejecting order");
    } finally {
      setIsRejecting(false);
    }
  }, [app.lang, app.user?.id, refetchOrders]);

  // ===== EXPORTS =====
  const exportToExcel = useCallback(() => {
    const exportData = filteredOrders.map((order: any) => ({
      'رقم الطلب': String(order.id).slice(0, 8),
      'العميل': order.buyer_name || (app.lang === "ar" ? 'عميل' : 'Customer'),
      'رقم العميل': order.buyer_phone || '—',
      'الحالة': getStatusLabel(order.status),
      'التاريخ': new Date(order.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
      'الوقت': new Date(order.created_at).toLocaleTimeString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
      'المجموع الفرعي': formatPrice(Number(order.total) || 0, app.currency, app.lang),
      'التوصيل': order.delivery_fee ? formatPrice(Number(order.delivery_fee), app.currency, app.lang) : '0',
      'الخصم': order.promo_discount ? formatPrice(Number(order.promo_discount), app.currency, app.lang) : '0',
      'الإجمالي الكامل': formatPrice(Number(order.total_with_delivery) || Number(order.total) || 0, app.currency, app.lang),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    ws['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `طلبات_المتجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير الطلبات إلى Excel" : "✅ Orders exported to Excel");
  }, [filteredOrders, app.lang, app.currency]);

  const exportToWord = useCallback(() => {
    let html = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <style>body{font-family:Arial;padding:20px}
      h1{color:#2a655f;text-align:center;border-bottom:2px solid #2a655f;padding-bottom:10px}
      th{background:#2a655f;color:#fff;padding:12px}
      td{padding:10px;border:1px solid #e2e8f0}
      tr:nth-child(even){background:#f8fafc}
      .stats{display:flex;gap:20px;margin:20px 0;flex-wrap:wrap}
      .stat{background:#f1f5f9;padding:15px;border-radius:10px;flex:1;min-width:120px;text-align:center}
      .stat .value{font-size:24px;font-weight:bold;color:#2a655f}
      .stat .label{font-size:12px;color:#64748b}
      </style></head><body>
      <h1>📊 تقرير طلبات المتجر</h1>
      <div class="stats">
        <div class="stat"><div class="value">${stats.total}</div><div class="label">إجمالي الطلبات</div></div>
        <div class="stat"><div class="value">${stats.pending}</div><div class="label">قيد المراجعة</div></div>
        <div class="stat"><div class="value">${stats.delivered}</div><div class="label">تم التوصيل</div></div>
        <div class="stat"><div class="value">${formatPrice(totalRevenue, app.currency, app.lang)}</div><div class="label">إجمالي الإيرادات</div></div>
      </div>
      <table><thead><tr>
        <th>#</th><th>رقم الطلب</th><th>العميل</th><th>رقم العميل</th><th>الحالة</th><th>التاريخ</th><th>الوقت</th><th>المجموع الفرعي</th><th>التوصيل</th><th>الخصم</th><th>الإجمالي الكامل</th>
      </tr></thead><tbody>
    `;
    filteredOrders.slice(0, 100).forEach((order: any, i: number) => {
      const totalWithDelivery = order.total_with_delivery || 
        (Number(order.total || 0) + Number(order.delivery_fee || 0) - Number(order.promo_discount || 0));
      
      html += `<tr>
        <td>${i+1}</td>
        <td>${String(order.id).slice(0, 8)}</td>
        <td>${order.buyer_name || (app.lang === "ar" ? 'عميل' : 'Customer')}</td>
        <td>${order.buyer_phone || '—'}</td>
        <td>${getStatusLabel(order.status)}</td>
        <td>${new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
        <td>${new Date(order.created_at).toLocaleTimeString('ar-SA')}</td>
        <td>${formatPrice(Number(order.total) || 0, app.currency, app.lang)}</td>
        <td>${order.delivery_fee ? formatPrice(Number(order.delivery_fee), app.currency, app.lang) : '0'}</td>
        <td>${order.promo_discount ? formatPrice(Number(order.promo_discount), app.currency, app.lang) : '0'}</td>
        <td>${formatPrice(totalWithDelivery, app.currency, app.lang)}</td>
      </tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `طلبات_المتجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير الطلبات إلى Word" : "✅ Orders exported to Word");
  }, [filteredOrders, stats, totalRevenue, app.lang, app.currency]);

  // ===== LOADING =====
  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
          {app.lang === "ar" ? "⏳ جاري تحميل طلباتك..." : "⏳ Loading your orders..."}
        </p>
      </div>
    );
  }

  // ===== ERROR =====
  if (isError) {
    return (
      <div className="rounded-3xl border-2 border-red-200/50 dark:border-red-800/30 p-20 text-center bg-red-50/50 dark:bg-red-950/20">
        <AlertCircle className="h-20 w-20 text-red-500/60 mx-auto animate-pulse" />
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mt-4">
          {app.lang === "ar" ? "❌ حدث خطأ في تحميل الطلبات" : "❌ Error loading orders"}
        </h3>
        <Button 
          variant="outline" 
          className="mt-6 rounded-xl border-red-300/50 text-red-600 hover:bg-red-50"
          onClick={() => refetchOrders()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {app.lang === "ar" ? "🔄 إعادة المحاولة" : "🔄 Retry"}
        </Button>
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {app.lang === "ar" ? "طلباتي" : "My Orders"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1">
              {stats.total}
            </Badge>
          </h1>
          
          <div className="flex items-center gap-3 flex-wrap mt-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 border border-yellow-200/50">
              <Clock className="h-3.5 w-3.5 text-yellow-500" />
              {stats.pending} {app.lang === "ar" ? "قيد المراجعة" : "pending"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
              <Truck className="h-3.5 w-3.5 text-emerald-500" />
              {stats.delivered} {app.lang === "ar" ? "تم التوصيل" : "delivered"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200/50">
              <DollarSign className="h-3.5 w-3.5 text-purple-500" />
              {formatPrice(totalRevenue, app.currency, app.lang)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel} 
            disabled={filteredOrders.length === 0} 
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToWord} 
            disabled={filteredOrders.length === 0} 
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchOrders()} 
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" /> 
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: ShoppingBag, color: 'text-[#2a655f]', bg: 'bg-[#2a655f]/10' },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          { key: 'accepted', label: app.lang === 'ar' ? 'مقبول' : 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'rejected', label: app.lang === 'ar' ? 'مرفوض' : 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
          { key: 'processing', label: app.lang === 'ar' ? 'قيد المعالجة' : 'Processing', value: stats.processing, icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { key: 'shipped', label: app.lang === 'ar' ? 'تم الشحن' : 'Shipped', value: stats.shipped, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-500/10' },
          { key: 'delivered', label: app.lang === 'ar' ? 'تم التوصيل' : 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'cancelled', label: app.lang === 'ar' ? 'ملغي' : 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
          >
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className={`text-xl font-bold mt-0.5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
          <Input 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            placeholder={app.lang === "ar" ? "🔍 ابحث في الطلبات..." : "🔍 Search orders..."} 
            className="ps-9 h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20" 
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="pending">⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="accepted">✅ {app.lang === "ar" ? "مقبول" : "Accepted"}</SelectItem>
            <SelectItem value="rejected">❌ {app.lang === "ar" ? "مرفوض" : "Rejected"}</SelectItem>
            <SelectItem value="processing">🔄 {app.lang === "ar" ? "قيد المعالجة" : "Processing"}</SelectItem>
            <SelectItem value="shipped">🚚 {app.lang === "ar" ? "تم الشحن" : "Shipped"}</SelectItem>
            <SelectItem value="delivered">✅ {app.lang === "ar" ? "تم التوصيل" : "Delivered"}</SelectItem>
            <SelectItem value="cancelled">❌ {app.lang === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
          <SelectTrigger className="w-[90px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setSearchQuery(""); setFilterStatus("all"); setItemsPerPage(10); setCurrentPage(1); }} 
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5"
        >
          <X className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

      {/* ===== ORDERS TABLE ===== */}
      {storeOrders.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#2a655f]/30 dark:border-[#2a655f]/40 p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent">
          <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-12 w-12 text-[#2a655f]/60" />
          </div>
          <h3 className="text-2xl font-bold mt-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
            {app.lang === "ar" ? "📦 لا توجد طلبات بعد" : "📦 No orders yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            {app.lang === "ar" 
              ? "عندما يقوم العملاء بشراء منتجاتك، ستظهر طلباتهم هنا" 
              : "When customers purchase your products, their orders will appear here"}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50 p-20 text-center">
          <Search className="h-20 w-20 text-muted-foreground/40 mx-auto" />
          <h3 className="text-xl font-semibold text-muted-foreground mt-4">
            {app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results"}
          </h3>
          <Button 
            variant="outline" 
            className="mt-4 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setCurrentPage(1); }}
          >
            <X className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 border-b border-slate-200/50 dark:border-slate-700/50">
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "رقم الطلب" : "Order #"}
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "العميل" : "Customer"}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "رقم العميل" : "Phone"}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "الوقت" : "Time"}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "الحالة" : "Status"}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedOrders.map((order: any) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const statusColor = getStatusColor(order.status);
                    const isPending = order.status === "pending";
                    
                    return (
                      <tr 
                        key={order.id} 
                        className="group hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => { setSelectedOrder(order); setDetailDialogOpen(true); }}
                      >
                        {/* رقم الطلب */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300">
                              #{String(order.id).slice(0, 8)}
                            </span>
                          </div>
                        </td>
                        
                        {/* اسم العميل */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <User className="h-3.5 w-3.5 text-[#2a655f]" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer")}
                            </span>
                          </div>
                        </td>
                        
                        {/* رقم العميل */}
                        <td className="px-4 py-3 text-center">
                          {order.buyer_phone ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-[#2a655f]" />
                              <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
                                {order.buyer_phone}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        
                        {/* الوقت */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {new Date(order.created_at).toLocaleDateString(
                                app.lang === "ar" ? "ar-SA" : "en-US",
                                { day: 'numeric', month: 'short' }
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              {new Date(order.created_at).toLocaleTimeString(
                                app.lang === "ar" ? "ar-SA" : "en-US",
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                          </div>
                        </td>
                        
                        {/* الحالة */}
                        <td className="px-4 py-3 text-center">
                          <Badge className={`${statusColor} border text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto`}>
                            <StatusIcon className="h-3 w-3" />
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        
                        {/* الإجراءات */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 text-[#2a655f]" />
                            </Button>
                            
                            {isPending && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptOrder(order.id);
                                  }}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  {app.lang === "ar" ? "قبول" : "Accept"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 px-3 rounded-lg text-xs font-bold shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRejectOrderId(order.id);
                                    setRejectReason("");
                                    setRejectDialogOpen(true);
                                  }}
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                  {app.lang === "ar" ? "رفض" : "Reject"}
                                </Button>
                              </>
                            )}
                            
                            {!isPending && (
                              <Badge className={`${statusColor} border text-[9px] px-2 py-0.5`}>
                                {order.status === "accepted" && "✅ " + (app.lang === "ar" ? "مقبول" : "Accepted")}
                                {order.status === "rejected" && "❌ " + (app.lang === "ar" ? "مرفوض" : "Rejected")}
                                {order.status === "processing" && "🔄 " + (app.lang === "ar" ? "قيد المعالجة" : "Processing")}
                                {order.status === "shipped" && "🚚 " + (app.lang === "ar" ? "تم الشحن" : "Shipped")}
                                {order.status === "delivered" && "✅ " + (app.lang === "ar" ? "تم التوصيل" : "Delivered")}
                                {order.status === "cancelled" && "❌ " + (app.lang === "ar" ? "ملغي" : "Cancelled")}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== ✅ PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex-wrap gap-3">
              <span className="text-xs text-slate-500 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#2a655f]" />
                {app.lang === "ar" ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                <span className="text-muted-foreground/50">|</span>
                <span className="text-muted-foreground">
                  {totalItems} {app.lang === "ar" ? "طلب" : "orders"}
                </span>
              </span>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <span className="text-xs font-bold">«</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "h-8 w-8 p-0 rounded-xl text-xs font-medium transition-all duration-300",
                          pageNum === currentPage 
                            ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25" 
                            : "hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <span className="text-xs font-bold">»</span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== ORDER DETAIL DIALOG ===== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-[#2a655f]/20 bg-white dark:bg-slate-900 p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30"
            onClick={() => setDetailDialogOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {selectedOrder && (() => {
            // ✅ استخراج storeName من order_items أو listings
            let storeName = '';
            let storeLogo: string | null = null;
            let storePhone: string | null = null;
            
            if (selectedOrder.order_items && selectedOrder.order_items.length > 0) {
              const firstItem = selectedOrder.order_items[0];
              const listing = firstItem?.listings;
              if (listing?.profile) {
                storeName = listing.profile.store_name || 
                            listing.profile.full_name || 
                            (app.lang === "ar" ? "متجر" : "Store");
                storeLogo = listing.profile.store_logo_url || null;
                storePhone = listing.profile.store_phone || null;
              }
            }
            
            if (!storeName && selectedOrder.listings?.profile) {
              storeName = selectedOrder.listings.profile.store_name || 
                          selectedOrder.listings.profile.full_name || 
                          (app.lang === "ar" ? "متجر" : "Store");
              storeLogo = selectedOrder.listings.profile.store_logo_url || null;
              storePhone = selectedOrder.listings.profile.store_phone || null;
            }
            
            if (!storeName) {
              storeName = app.lang === "ar" ? "متجر" : "Store";
            }

            // ✅ حساب الإجماليات
            const totalItems = selectedOrder.order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || selectedOrder.quantity || 1;
            const totalPrice = selectedOrder.order_items?.reduce((sum: number, item: any) => sum + (Number(item.price) * (item.quantity || 1)), 0) || Number(selectedOrder.total) || 0;
            const deliveryFee = Number(selectedOrder.delivery_fee) || 0;
            const promoDiscount = Number(selectedOrder.promo_discount) || 0;
            const totalWithDelivery = Number(selectedOrder.total_with_delivery) || (totalPrice + deliveryFee - promoDiscount);

            const status = getOrderStatus(selectedOrder.status);
            const StatusIcon = status.icon;
            const isActive = selectedOrder.status === 'pending' || selectedOrder.status === 'accepted' || selectedOrder.status === 'shipped' || selectedOrder.status === 'assigned';

            return (
              <div>
                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white shadow-lg shadow-[#0d2e2a]/30">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      {app.lang === "ar" ? "تفاصيل الطلب" : "Order Details"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
                      #{String(selectedOrder.id).slice(0, 12)}
                    </p>
                  </div>
                  <Badge className={cn(
                    "border-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm",
                    status.bg,
                    status.border,
                    status.color,
                    isActive && "animate-pulse"
                  )}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </Badge>
                </div>

                {/* ===== حالة الطلب مع وصف ===== */}
                <div className={cn(
                  "p-4 rounded-xl border mb-4",
                  status.bg,
                  status.border
                )}>
                  <div className="flex items-center gap-3">
                    <StatusIcon className={cn("h-5 w-5", status.color)} />
                    <div>
                      <p className="font-bold text-sm">{status.label}</p>
                      <p className="text-xs text-muted-foreground">{status.description}</p>
                    </div>
                  </div>
                </div>

                {/* ===== معلومات المتجر والعميل ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mb-4">
                  {/* ✅ المتجر */}
                  <div className="flex items-center gap-3">
                    {storeLogo ? (
                      <img 
                        src={storeLogo} 
                        alt={storeName}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-[#2a655f]/20"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white font-bold text-lg">
                        {storeName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                        <Store className="h-3 w-3 text-[#2a655f]" />
                        {app.lang === "ar" ? "المتجر" : "Store"}
                      </p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{storeName}</p>
                      {storePhone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {storePhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ✅ العميل */}
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                      <User className="h-3 w-3 text-[#2a655f]" />
                      {app.lang === "ar" ? "العميل" : "Customer"}
                    </p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedOrder.buyer_name || (app.lang === "ar" ? "عميل" : "Customer")}</p>
                    {selectedOrder.buyer_phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedOrder.buyer_phone}
                      </p>
                    )}
                  </div>
                </div>
{/* ===== قائمة المنتجات ===== */}
<div className="mb-4">
  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
    <Package className="h-3.5 w-3.5" />
    {app.lang === "ar" ? "المنتجات" : "Products"}
    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
      {selectedOrder.order_items?.length || 1}
    </Badge>
  </div>
  
  <div className="space-y-3 mt-2">
    {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
      selectedOrder.order_items.map((item: any, index: number) => {
        const listing = item.listings || item;
        
        // ✅ ✅ ✅ دالة الحصول على صورة الفيرنت المختار (مطابقة لدالة getProductImage في orders.tsx)
        const getVariationImage = (item: any) => {
          // 1. الأولوية الأولى: metadata.variation_image
          if (item.metadata?.variation_image) {
            return item.metadata.variation_image;
          }
          // 2. metadata.product_cover
          if (item.metadata?.product_cover) {
            return item.metadata.product_cover;
          }
          // 3. selected_options.variation_image
          if (item.selected_options?.variation_image) {
            return item.selected_options.variation_image;
          }
          // 4. variation_snapshot.image_url
          if (item.variation_snapshot?.image_url) {
            return item.variation_snapshot.image_url;
          }
          // 5. من selected_options.selected_variation_id
          if (item.selected_options?.selected_variation_id) {
            const variations = listing?.variations || [];
            const variation = variations.find((v: any) => v.id === item.selected_options.selected_variation_id);
            if (variation?.image_url) return variation.image_url;
            if (variation?.color_id) {
              const colors = listing?.colors || [];
              const color = colors.find((c: any) => c.id === variation.color_id);
              if (color?.image_url) return color.image_url;
            }
          }
          // 6. selected_variation_id القديم
          if (item.selected_variation_id) {
            const variations = listing?.variations || [];
            const variation = variations.find((v: any) => v.id === item.selected_variation_id);
            if (variation?.image_url) return variation.image_url;
            if (variation?.color_id) {
              const colors = listing?.colors || [];
              const color = colors.find((c: any) => c.id === variation.color_id);
              if (color?.image_url) return color.image_url;
            }
            if (variation?.combination) {
              const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
              let colorValue = null;
              for (const key of colorKeys) {
                if (variation.combination[key]) {
                  colorValue = variation.combination[key];
                  break;
                }
              }
              if (colorValue) {
                const colors = listing?.colors || [];
                const color = colors.find((c: any) => 
                  c.color_name_ar === colorValue || c.color_name_en === colorValue
                );
                if (color?.image_url) return color.image_url;
              }
            }
          }
          // 7. من variation_combination
          if (item.variation_combination?.colors) {
            const colorName = item.variation_combination.colors;
            const colors = listing?.colors || [];
            const color = colors.find((c: any) => 
              c.color_name_ar === colorName || c.color_name_en === colorName
            );
            if (color?.image_url) return color.image_url;
          }
          // 8. أخيراً: cover_url
          return listing?.cover_url || null;
        };

        // ✅ ✅ ✅ الحصول على صورة الفيرنت
        const imageUrl = getVariationImage(item);

        // ✅ ✅ ✅ الحصول على تركيبة الفيرنت (مطابقة لطريقة العرض في orders.tsx)
        const getVariationCombination = (item: any) => {
          if (item.variation_snapshot?.combination) {
            return item.variation_snapshot.combination;
          }
          if (item.metadata?.variation_combination) {
            return item.metadata.variation_combination;
          }
          if (item.variation_combination) {
            return item.variation_combination;
          }
          if (item.selected_options?.variation_combination) {
            return item.selected_options.variation_combination;
          }
          return null;
        };

        const variationCombination = getVariationCombination(item);
        const hasVariation = !!(variationCombination && Object.keys(variationCombination).length > 0);

        // ✅ عرض اسم الفيرنت المختار (مطابق لـ orders.tsx)
        const getVariationDisplay = (combination: any) => {
          if (!combination) return null;
          const parts: string[] = [];
          
          const order = ['colors', 'sizes', 'size', 'color', 'اللون', 'المقاس', 'colour'];
          
          for (const key of order) {
            if (combination[key]) {
              parts.push(combination[key]);
            }
          }
          
          for (const [key, value] of Object.entries(combination)) {
            if (!order.includes(key) && value) {
              parts.push(String(value));
            }
          }
          
          return parts.length > 0 ? parts.join(' • ') : null;
        };

        const variationDisplay = getVariationDisplay(variationCombination);

        return (
          <div 
            key={item.id || index}
            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* ✅ صورة المنتج (مع دعم الفيرنتات) - نفس تصميم orders.tsx */}
              <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                    <Package className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </div>
              
              {/* ✅ معلومات المنتج - نفس تصميم orders.tsx */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-white">
                  {app.lang === "ar" 
                    ? listing?.title_ar || 'منتج'
                    : listing?.title_en || listing?.title_ar || 'Product'}
                </p>
                
                {/* ✅ ✅ ✅ عرض الفيرنتات بنفس طريقة orders.tsx */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-0.5">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {app.lang === "ar" ? "الكمية:" : "Qty:"}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {item.quantity || 1}
                    </span>
                  </span>
                  
                  <span className="text-muted-foreground/30">•</span>
                  
                  <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {app.lang === "ar" ? "السعر:" : "Price:"}
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {formatPrice(
                        item.total || (Number(item.price) * (item.quantity || 1)) || 0, 
                        app.currency, 
                        app.lang
                      )}
                    </span>
                  </span>
                  
                  {/* ✅ ✅ ✅ عرض الفيرنت المختار بنفس طريقة orders.tsx */}
                  {hasVariation && variationDisplay && (
                    <>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 px-2 py-0.5 rounded-full border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                        <Layers className="h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" />
                        {variationDisplay}
                        {/* ✅ صورة مصغرة للفيرنت بجانب النص */}
                        {imageUrl && (
                          <img 
                            src={imageUrl} 
                            alt=""
                            className="h-4 w-4 rounded-md object-cover border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 ml-0.5"
                          />
                        )}
                      </span>
                    </>
                  )}
                  
                  {/* ✅ ✅ ✅ عرض معلومات الفيرنت من metadata - نفس orders.tsx */}
                  {item.metadata?.variation_combination && Object.keys(item.metadata.variation_combination).length > 0 && !variationDisplay && (
                    <>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-[9px] text-muted-foreground/70 flex items-center gap-1">
                        <Layers className="h-2.5 w-2.5" />
                        {Object.values(item.metadata.variation_combination).join(' • ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* ✅ زر عرض المنتج */}
              <Link to="/listing/$id" params={{ id: item.listing_id || item.id }}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-[#2a655f]/10 transition-all duration-300 hover:scale-110">
                  <Eye className="h-3.5 w-3.5 text-[#2a655f]" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })
    ) : (
      // ✅ للطلبات القديمة (بدون order_items) - نفس تصميم orders.tsx
      <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
            {selectedOrder.listings?.cover_url ? (
              <img 
                src={selectedOrder.listings.cover_url} 
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                <Package className="h-6 w-6 text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-slate-800 dark:text-white">
              {app.lang === "ar" 
                ? selectedOrder.listings?.title_ar || 'منتج'
                : selectedOrder.listings?.title_en || selectedOrder.listings?.title_ar || 'Product'}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                <span className="font-medium">{app.lang === "ar" ? "الكمية:" : "Qty:"}</span>
                <span className="font-bold text-slate-800 dark:text-white">{selectedOrder.quantity || 1}</span>
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 px-2 py-0.5 rounded-full">
                <span className="font-medium text-[#2a655f] dark:text-[#3a8a82]">{app.lang === "ar" ? "الإجمالي:" : "Total:"}</span>
                <span className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                  {formatPrice(Number(selectedOrder.total) || 0, app.currency, app.lang)}
                </span>
              </span>
            </div>
          </div>
          <Link to="/listing/$id" params={{ id: selectedOrder.listing_id }}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-[#2a655f]/10">
              <Eye className="h-3.5 w-3.5 text-[#2a655f]" />
            </Button>
          </Link>
        </div>
      </div>
    )}
  </div>
</div>

                {/* ===== ملاحظات الطلب ===== */}
                {selectedOrder.notes && (
                  <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30 mb-4">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {app.lang === "ar" ? "ملاحظات العميل" : "Customer Notes"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* ===== سبب الرفض ===== */}
                {selectedOrder.status === "rejected" && selectedOrder.rejection_reason && (
                  <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30 mb-4">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5" />
                      {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedOrder.rejection_reason}</p>
                  </div>
                )}

                {/* ===== إجمالي الطلب ===== */}
                <div className="p-4 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                  
                  {/* المجموع الفرعي */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {app.lang === "ar" ? "المجموع الفرعي" : "Subtotal"}
                    </span>
                    <span className="text-lg font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                      {formatPrice(totalPrice, app.currency, app.lang)}
                    </span>
                  </div>
                  
                  {/* سعر التوصيل */}
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/10">
                    <span className="text-sm text-muted-foreground">
                      {app.lang === "ar" ? "سعر التوصيل" : "Delivery Fee"}
                    </span>
                    <span className={cn(
                      "text-sm font-medium",
                      deliveryFee === 0 
                        ? "text-emerald-500 font-bold" 
                        : "text-[#0d2e2a] dark:text-[#3a8a82]"
                    )}>
                      {deliveryFee === 0 
                        ? (app.lang === "ar" ? "🆓 مجاني" : "🆓 Free")
                        : formatPrice(deliveryFee, app.currency, app.lang)
                      }
                    </span>
                  </div>
                  
                  {/* الخصم */}
                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/10 text-emerald-500">
                      <span className="text-sm">
                        {app.lang === "ar" ? "💚 الخصم" : "💚 Discount"}
                      </span>
                      <span className="text-sm font-bold">
                        -{formatPrice(promoDiscount, app.currency, app.lang)}
                      </span>
                    </div>
                  )}
                  
                  {/* الإجمالي الكامل */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-[#2a655f]/20">
                    <span className="text-sm font-semibold text-[#0d2e2a] dark:text-white">
                      {app.lang === "ar" ? "الإجمالي الكامل" : "Total"}
                    </span>
                    <span className="text-2xl font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                      {formatPrice(totalWithDelivery, app.currency, app.lang)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {totalItems} {app.lang === "ar" ? "منتج" : "items"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedOrder.created_at).toLocaleString(
                        app.lang === "ar" ? "ar-SA" : "en-US",
                        { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </span>
                  </div>
                </div>

                {/* ===== أزرار الإجراءات (في الأسفل) ===== */}
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDetailDialogOpen(false)}
                    className="rounded-xl border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10"
                  >
                    {app.lang === "ar" ? "إغلاق" : "Close"}
                  </Button>
                  
                  {selectedOrder.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setDetailDialogOpen(false);
                          handleAcceptOrder(selectedOrder.id);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        {app.lang === "ar" ? "قبول الطلب" : "Accept Order"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setDetailDialogOpen(false);
                          setRejectOrderId(selectedOrder.id);
                          setRejectReason("");
                          setRejectDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        {app.lang === "ar" ? "رفض الطلب" : "Reject Order"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ===== REJECT ORDER DIALOG ===== */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-red-200/50 dark:border-red-800/30 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-red-500/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600 dark:text-red-400">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {app.lang === "ar" ? "رفض الطلب" : "Reject Order"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {app.lang === "ar" 
                    ? "سيتم إرسال سبب الرفض إلى العميل ليتمكن من فهم سبب الرفض"
                    : "The rejection reason will be sent to the customer so they can understand why"}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1.5">
                {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={app.lang === "ar" 
                  ? "اكتب سبب رفض الطلب..."
                  : "Write the reason for rejecting the order..."
                }
                className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none"
                dir={app.lang === "ar" ? "rtl" : "ltr"}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {rejectReason.length}/500
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                app.lang === "ar" ? "المنتج غير متوفر" : "Product unavailable",
                app.lang === "ar" ? "سعر غير صحيح" : "Incorrect price",
                app.lang === "ar" ? "عنوان غير صحيح" : "Invalid address",
                app.lang === "ar" ? "مشكلة في الدفع" : "Payment issue",
                app.lang === "ar" ? "سبب آخر" : "Other reason",
              ].map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => setRejectReason(reason)}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setRejectOrderId(null);
                  setRejectReason("");
                }}
                className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (rejectOrderId) {
                    handleRejectOrder(rejectOrderId, rejectReason);
                  }
                }}
                disabled={!rejectReason.trim() || isRejecting}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isRejecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {app.lang === "ar" ? "جاري الرفض..." : "Rejecting..."}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    {app.lang === "ar" ? "تأكيد الرفض" : "Confirm Reject"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
});

export default OrdersPage;