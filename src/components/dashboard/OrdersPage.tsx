// src/components/dashboard/OrdersPage.tsx

import React, { useState, useMemo, useCallback } from "react";
import { 
  ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, Eye, X, Layers,
  AlertCircle, Sparkles, Rocket, DollarSign,
  Calendar, User, Phone, MessageCircle,
  TrendingUp, Star, Users, Clock as ClockIcon,
  MapPin, Store,
  Wallet, Trash2, Info, ChevronDown, ChevronUp, Zap, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  const prefix = 'SQT';
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
// ✅ ORDERS PAGE
// ============================================================

export const OrdersPage = React.memo(function OrdersPage() {
  const app = useApp();
  
  // ===== STATES =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // ✅ ✅ ✅ STATE للفلتر الزمني
  const [filterDateRange, setFilterDateRange] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateFrom, setTempDateFrom] = useState<string>("");
  const [tempDateTo, setTempDateTo] = useState<string>("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // ===== API - useStoreOrders =====
  const { 
    data: allOrders = [], 
    isLoading, 
    isError,
    refetch: refetchOrders,
    isFetching 
  } = useStoreOrders(app.user?.id);

  // ===== FILTER ORDERS BY SELLER =====
  const storeOrders = useMemo(() => {
    return allOrders.filter((order: any) => order.seller_id === app.user?.id);
  }, [allOrders, app.user?.id]);

  // ============================================================
  // ✅✅✅ APPLY FILTERS (مع دعم الهاش والوقت والفلتر الزمني)
  // ============================================================
  const filteredOrders = useMemo(() => {
    let result = storeOrders;

    // ✅ فلتر الحالة
    if (filterStatus !== "all") {
      result = result.filter((order: any) => order.status === filterStatus);
    }

    // ✅ ✅ ✅ فلتر النطاق الزمني (التقويم)
    if (filterDateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        
        switch (filterDateRange) {
          case "today":
            return orderDate >= today;
          case "week": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          }
          case "custom": {
            if (dateFrom) {
              const from = new Date(dateFrom);
              from.setHours(0, 0, 0, 0);
              if (orderDate < from) return false;
            }
            if (dateTo) {
              const to = new Date(dateTo);
              to.setHours(23, 59, 59, 999);
              if (orderDate > to) return false;
            }
            return true;
          }
          default:
            return true;
        }
      });
    }

    // ✅ ✅ ✅ البحث النصي (مع دعم الهاش والوقت)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/^#/, '');
      
      result = result.filter((order: any) => {
        const orderId = order.id?.toLowerCase() || "";
        const orderIdShort = orderId.slice(0, 8);
        const orderIdWithHash = `#${orderIdShort}`;
        
        const customerName = order.buyer_name?.toLowerCase() || "";
        const customerPhone = order.buyer_phone?.toLowerCase() || "";
        const notes = order.notes?.toLowerCase() || "";
        
        const createdAt = new Date(order.created_at);
        const dateStr = createdAt.toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US');
        const timeStr = createdAt.toLocaleTimeString(app.lang === 'ar' ? 'ar-SA' : 'en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const dateFormats = [
          dateStr.toLowerCase(),
          timeStr.toLowerCase(),
          `${dateStr} ${timeStr}`.toLowerCase(),
          createdAt.toISOString().slice(0, 10),
          createdAt.toISOString().slice(0, 16),
          createdAt.toLocaleDateString('en-US'),
          createdAt.toLocaleDateString('ar-SA'),
          createdAt.toLocaleDateString('ar-SA', { month: 'long' }),
          createdAt.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' }),
          String(createdAt.getFullYear()),
          String(createdAt.getDate()).padStart(2, '0'),
          String(createdAt.getMonth() + 1).padStart(2, '0'),
        ];
        
        const searchFields = [
          orderId,
          orderIdShort,
          orderIdWithHash,
          `#${orderIdShort}`,
          customerName,
          customerPhone,
          notes,
          ...dateFormats,
        ];
        
        return searchFields.some(field => 
          String(field).toLowerCase().includes(cleanQ) || 
          String(field).toLowerCase().includes(q)
        );
      });
    }

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
  }, [storeOrders, searchQuery, filterStatus, filterDateRange, dateFrom, dateTo, app.lang]);

  // ===== PAGINATION =====
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
  const handleAcceptOrder = useCallback(async (orderId: string) => {
    try {
      console.log("🚀 Starting order acceptance for:", orderId);

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

      const trackingNumber = generateTrackingNumber();
      console.log(`🔢 Generated tracking number: ${trackingNumber}`);

      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          delivery_company_id: deliveryCompanyId,
          tracking_number: trackingNumber,
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("❌ Update error:", updateError);
        throw updateError;
      }

      console.log("✅ Order updated successfully");

      const { data: existingDelivery, error: checkError } = await supabase
        .from("delivery_orders")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Check delivery order error:", checkError);
      }

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
            tracking_number: trackingNumber,
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

      if (order.promo_code_id) {
        console.log(`🔄 [Reject Order] Decreasing used_count for promo code: ${order.promo_code_id}`);
        
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
              <Wallet className="h-3.5 w-3.5 text-purple-500" />
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
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToWord} 
            disabled={filteredOrders.length === 0} 
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchOrders()} 
            className="rounded-xl border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" /> 
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS - خلفية وردية وبوردر وردي ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: ShoppingBag },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: stats.pending, icon: Clock },
          { key: 'accepted', label: app.lang === 'ar' ? 'مقبول' : 'Accepted', value: stats.accepted, icon: CheckCircle2 },
          { key: 'rejected', label: app.lang === 'ar' ? 'مرفوض' : 'Rejected', value: stats.rejected, icon: XCircle },
          { key: 'processing', label: app.lang === 'ar' ? 'قيد المعالجة' : 'Processing', value: stats.processing, icon: RefreshCw },
          { key: 'shipped', label: app.lang === 'ar' ? 'تم الشحن' : 'Shipped', value: stats.shipped, icon: Truck },
          { key: 'delivered', label: app.lang === 'ar' ? 'تم التوصيل' : 'Delivered', value: stats.delivered, icon: CheckCircle2 },
          { key: 'cancelled', label: app.lang === 'ar' ? 'ملغي' : 'Cancelled', value: stats.cancelled, icon: XCircle },
        ].map((stat) => {
          let colorClass = 'text-[#2a655f]';
          
          if (stat.key === 'pending') {
            colorClass = 'text-yellow-600 dark:text-yellow-400';
          } else if (stat.key === 'accepted' || stat.key === 'delivered') {
            colorClass = 'text-emerald-600 dark:text-emerald-400';
          } else if (stat.key === 'rejected' || stat.key === 'cancelled') {
            colorClass = 'text-red-600 dark:text-red-400';
          } else if (stat.key === 'processing') {
            colorClass = 'text-blue-600 dark:text-blue-400';
          } else if (stat.key === 'shipped') {
            colorClass = 'text-purple-600 dark:text-purple-400';
          }
          
          return (
            <div 
              key={stat.key} 
              className="group relative bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70 dark:border-[#f9a8d4]/40 hover:border-[#d81b60]/60 shadow-sm hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4]/10 to-[#fbcfe8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#fbcfe8]/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between p-3">
                <div>
                  <p className="text-[10px] font-medium text-[#2a655f] dark:text-[#f9a8d4] uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={`text-xl font-bold mt-0.5 ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`h-8 w-8 rounded-lg bg-[#f9a8d4]/30 dark:bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30`}>
                  <stat.icon className={`h-4 w-4 ${colorClass}`} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#d81b60] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* ✅✅✅ SEARCH & FILTERS (مع فلتر الوقت والتقويم المنبثق) ✅✅✅ */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 🔍 حقل البحث - بوردر وردي */}
        <div className="relative flex-1 min-w-[200px] group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#f9a8d4] transition-colors" />
          <Input 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            placeholder={app.lang === "ar" ? "🔍 ابحث برقم الطلب #، اسم العميل، التاريخ..." : "🔍 Search by Order #, Customer, Date..."} 
            className="ps-9 h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300" 
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#f9a8d4] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* ✅ فلتر الحالة - بوردر وردي */}
        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 group-hover:text-[#f9a8d4]" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="pending" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="accepted" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">✅ {app.lang === "ar" ? "مقبول" : "Accepted"}</SelectItem>
            <SelectItem value="rejected" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">❌ {app.lang === "ar" ? "مرفوض" : "Rejected"}</SelectItem>
            <SelectItem value="processing" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🔄 {app.lang === "ar" ? "قيد المعالجة" : "Processing"}</SelectItem>
            <SelectItem value="shipped" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🚚 {app.lang === "ar" ? "تم الشحن" : "Shipped"}</SelectItem>
            <SelectItem value="delivered" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">✅ {app.lang === "ar" ? "تم التوصيل" : "Delivered"}</SelectItem>
            <SelectItem value="cancelled" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">❌ {app.lang === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ ✅ ✅ فلتر النطاق الزمني - بوردر وردي */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 rounded-full border border-[#2a655f]/20 dark:border-[#2a655f]/30">
            <Calendar className="h-3.5 w-3.5 text-[#2a655f]" />
            <span className="text-[10px] font-medium text-[#2a655f] dark:text-[#3a8a82] whitespace-nowrap">
              {app.lang === "ar" ? "📅 فلتر التاريخ" : "📅 Date Filter"}
            </span>
          </div>
          
          <Select value={filterDateRange} onValueChange={(v: any) => { 
            setFilterDateRange(v); 
            setCurrentPage(1); 
            if (v !== "custom") {
              setDateFrom("");
              setDateTo("");
              setTempDateFrom("");
              setTempDateTo("");
            }
          }}>
            <SelectTrigger className="w-[140px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 group-hover:text-[#f9a8d4]" />
                <SelectValue placeholder={app.lang === "ar" ? "الفترة" : "Period"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
              <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {app.lang === "ar" ? "الكل" : "All"}</SelectItem>
              <SelectItem value="today" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {app.lang === "ar" ? "اليوم" : "Today"}</SelectItem>
              <SelectItem value="week" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {app.lang === "ar" ? "آخر 7 أيام" : "Last 7 days"}</SelectItem>
              <SelectItem value="month" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {app.lang === "ar" ? "آخر شهر" : "Last month"}</SelectItem>
              <SelectItem value="custom" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {app.lang === "ar" ? "مخصص" : "Custom"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ ✅ ✅ فلتر التاريخ المخصص */}
        {filterDateRange === "custom" && (
          <div className="relative inline-block">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="h-10 px-4 rounded-xl border-3 border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-[#2a655f]" />
              <span className="text-sm font-medium">
                {dateFrom || dateTo 
                  ? (app.lang === "ar" ? "تعديل التاريخ" : "Edit Date")
                  : (app.lang === "ar" ? "اختر التاريخ" : "Select Date")}
              </span>
              {showDatePicker ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50/80 dark:bg-blue-950/30 rounded-full border border-blue-200/50 dark:border-blue-800/30">
                <ClockIcon className="h-3 w-3 text-blue-500" />
                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-medium">
                  {app.lang === "ar" ? "الوقت" : "Time"}
                </span>
              </div>
            </Button>

            {showDatePicker && (
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999] bg-white dark:bg-slate-900 rounded-2xl border-3 border-[#f9a8d4]/30 shadow-2xl p-5 min-w-[420px] max-w-[95vw] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2a655f] dark:text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "اختر الفترة الزمنية" : "Select Time Period"}
                    </span>
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] animate-pulse">
                      {app.lang === "ar" ? "التاريخ والوقت" : "Date & Time"}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <span className="text-[#2a655f]">📅</span>
                      {app.lang === "ar" ? "من" : "From"}
                      <span className="text-[10px] text-muted-foreground">(اختر التاريخ والوقت)</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        type="datetime-local"
                        value={tempDateFrom}
                        onChange={(e) => setTempDateFrom(e.target.value)}
                        className="h-10 w-full rounded-xl border-3 border-[#2a655f]/20 focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 bg-white/50 dark:bg-slate-800/50 text-sm transition-all duration-300 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <span className="text-[#2a655f]">📅</span>
                      {app.lang === "ar" ? "إلى" : "To"}
                      <span className="text-[10px] text-muted-foreground">(اختر التاريخ والوقت)</span>
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        type="datetime-local"
                        value={tempDateTo}
                        onChange={(e) => setTempDateTo(e.target.value)}
                        className="h-10 w-full rounded-xl border-3 border-[#2a655f]/20 focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 bg-white/50 dark:bg-slate-800/50 text-sm transition-all duration-300 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 w-full">
                      <Zap className="h-3 w-3 text-[#2a655f]" />
                      {app.lang === "ar" ? "اختيارات سريعة:" : "Quick picks:"}
                    </span>
                    {[
                      { label: app.lang === "ar" ? "اليوم" : "Today", value: "today" },
                      { label: app.lang === "ar" ? "أمس" : "Yesterday", value: "yesterday" },
                      { label: app.lang === "ar" ? "آخر 7 أيام" : "Last 7 days", value: "week" },
                      { label: app.lang === "ar" ? "آخر 30 يوم" : "Last 30 days", value: "month" },
                    ].map((item) => (
                      <Button
                        key={item.value}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const now = new Date();
                          let from = new Date();
                          let to = new Date();
                          
                          switch (item.value) {
                            case "today":
                              from.setHours(0, 0, 0, 0);
                              to.setHours(23, 59, 59, 999);
                              break;
                            case "yesterday":
                              from.setDate(from.getDate() - 1);
                              from.setHours(0, 0, 0, 0);
                              to.setDate(to.getDate() - 1);
                              to.setHours(23, 59, 59, 999);
                              break;
                            case "week":
                              from.setDate(from.getDate() - 7);
                              from.setHours(0, 0, 0, 0);
                              to.setHours(23, 59, 59, 999);
                              break;
                            case "month":
                              from.setMonth(from.getMonth() - 1);
                              from.setHours(0, 0, 0, 0);
                              to.setHours(23, 59, 59, 999);
                              break;
                          }
                          
                          const fromStr = from.toISOString().slice(0, 16);
                          const toStr = to.toISOString().slice(0, 16);
                          setTempDateFrom(fromStr);
                          setTempDateTo(toStr);
                        }}
                        className="h-7 px-3 rounded-lg text-[10px] border-3 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-200"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                  
                  {(tempDateFrom || tempDateTo) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 animate-in fade-in duration-300">
                      <ClockIcon className="h-3.5 w-3.5 text-[#2a655f]" />
                      <span className="text-xs text-[#2a655f] dark:text-[#3a8a82] truncate">
                        {tempDateFrom && tempDateTo 
                          ? `${new Date(tempDateFrom).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')} → ${new Date(tempDateTo).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}`
                          : tempDateFrom 
                            ? `${app.lang === 'ar' ? 'من' : 'From'} ${new Date(tempDateFrom).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}`
                            : `${app.lang === 'ar' ? 'إلى' : 'To'} ${new Date(tempDateTo).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}`
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempDateFrom("");
                        setTempDateTo("");
                        setShowDatePicker(false);
                      }}
                      className="h-8 px-3 rounded-xl text-xs text-slate-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-300"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      {app.lang === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTempDateFrom("");
                          setTempDateTo("");
                          setDateFrom("");
                          setDateTo("");
                          setShowDatePicker(false);
                          setCurrentPage(1);
                        }}
                        className="h-8 px-3 rounded-xl text-xs border-3 border-red-200/50 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-300"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {app.lang === "ar" ? "مسح" : "Clear"}
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          if (tempDateFrom) setDateFrom(tempDateFrom);
                          if (tempDateTo) setDateTo(tempDateTo);
                          setShowDatePicker(false);
                          setCurrentPage(1);
                        }}
                        className="h-8 px-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 border-2 border-white/30"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        {app.lang === "ar" ? "تطبيق" : "Apply"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(dateFrom || dateTo) && (
              <div className="absolute top-full left-0 mt-14 flex items-center gap-2 px-3 py-1.5 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 animate-in fade-in duration-300 whitespace-nowrap z-50">
                <ClockIcon className="h-3.5 w-3.5 text-[#2a655f]" />
                <span className="text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]">
                  {dateFrom && dateTo 
                    ? `${new Date(dateFrom).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')} → ${new Date(dateTo).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}`
                    : dateFrom 
                      ? `${app.lang === 'ar' ? 'من' : 'From'} ${new Date(dateFrom).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}`
                      : `${app.lang === 'ar' ? 'إلى' : 'To'} ${new Date(dateTo).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}`
                  }
                </span>
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setTempDateFrom("");
                    setTempDateTo("");
                    setCurrentPage(1);
                  }}
                  className="ml-1 text-[#2a655f]/60 hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ✅ عدد العناصر لكل صفحة */}
        <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
          <SelectTrigger className="w-[90px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <SelectItem value="5" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">5</SelectItem>
            <SelectItem value="10" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">10</SelectItem>
            <SelectItem value="20" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">20</SelectItem>
            <SelectItem value="50" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">50</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ زر مسح الكل - بوردر وردي */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { 
            setSearchQuery(""); 
            setFilterStatus("all"); 
            setFilterDateRange("all");
            setDateFrom("");
            setDateTo("");
            setTempDateFrom("");
            setTempDateTo("");
            setItemsPerPage(10); 
            setCurrentPage(1); 
          }} 
          className="h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

      {/* ============================================================ */}
      {/* ✅ ORDERS TABLE - أعمدة فاصلة وردية وهوفرو وردي */}
      {/* ============================================================ */}
      {storeOrders.length === 0 ? (
        <div className="rounded-3xl border-3 border-dashed border-[#2a655f]/30 dark:border-[#2a655f]/40 p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent">
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
        <div className="rounded-3xl border-3 border-dashed border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 p-20 text-center">
          <Search className="h-20 w-20 text-muted-foreground/40 mx-auto" />
          <h3 className="text-xl font-semibold text-muted-foreground mt-4">
            {app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results"}
          </h3>
          <Button 
            variant="outline" 
            className="mt-4 rounded-xl border-3 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300"
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterDateRange("all"); setDateFrom(""); setDateTo(""); setCurrentPage(1); }}
          >
            <X className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30">
                    <th className="px-4 py-3 text-center font-bold text-[#2a655f] dark:text-[#f9a8d4] text-xs uppercase tracking-wider border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {app.lang === "ar" ? "رقم الطلب" : "Order #"}
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-[#2a655f] dark:text-[#f9a8d4] text-xs uppercase tracking-wider border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {app.lang === "ar" ? "العميل" : "Customer"}
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-[#2a655f] dark:text-[#f9a8d4] text-xs uppercase tracking-wider border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {app.lang === "ar" ? "رقم العميل" : "Phone"}
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-[#2a655f] dark:text-[#f9a8d4] text-xs uppercase tracking-wider border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {app.lang === "ar" ? "الوقت" : "Time"}
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-[#2a655f] dark:text-[#f9a8d4] text-xs uppercase tracking-wider border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {app.lang === "ar" ? "الحالة" : "Status"}
                    </th>
                    <th className="px-4 py-3 text-center font-bold text-[#2a655f] dark:text-[#f9a8d4] text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#f9a8d4]/20 dark:divide-[#f9a8d4]/10">
                  {paginatedOrders.map((order: any) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const statusColor = getStatusColor(order.status);
                    const isPending = order.status === "pending";
                    
                    return (
                      <tr 
                        key={order.id} 
                        className="group hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => { setSelectedOrder(order); setDetailDialogOpen(true); }}
                      >
                        <td className="px-4 py-3 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                          <span className="font-mono font-bold text-sm text-[#2a655f] dark:text-[#f9a8d4] group-hover:text-[#d81b60] transition-colors">
                            #{String(order.id).slice(0, 8)}
                          </span>
                        </td>
                        
                        <td className="px-4 py-3 text-right border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                          <div className="flex items-center justify-end gap-2">
                            <User className="h-3.5 w-3.5 text-[#2a655f] group-hover:text-[#d81b60] transition-colors" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#2a655f] transition-colors">
                              {order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer")}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                          {order.buyer_phone ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-[#2a655f] group-hover:text-[#d81b60] transition-colors" />
                              <span className="font-mono text-sm text-slate-600 dark:text-slate-300 group-hover:text-[#2a655f] transition-colors">
                                {order.buyer_phone}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        
                        <td className="px-4 py-3 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#2a655f] transition-colors">
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
                        
                        <td className="px-4 py-3 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                          <Badge className={`${statusColor} border-2 border-[#f9a8d4]/30 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto`}>
                            <StatusIcon className="h-3 w-3" />
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 text-[#2a655f] group-hover:text-[#d81b60] transition-colors" />
                            </Button>
                            
                            {isPending && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-8 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30"
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
                                  className="h-8 px-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30"
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
                              <Badge className={`${statusColor} border-2 border-[#f9a8d4]/30 text-[9px] px-2 py-0.5`}>
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

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t-3 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 flex-wrap gap-3">
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
                  className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 disabled:opacity-40 transition-all duration-300"
                >
                  <span className="text-xs font-bold">«</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 disabled:opacity-40 transition-all duration-300"
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
                            ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white shadow-md shadow-[#2a655f]/25 border-2 border-white/30" 
                            : "border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 hover:text-[#2a655f]"
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
                  className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 disabled:opacity-40 transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages} 
                  className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 disabled:opacity-40 transition-all duration-300"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-[#f9a8d4]/10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30 transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={() => setDetailDialogOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {selectedOrder && (() => {
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
                    "border-2 border-[#f9a8d4]/30 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm",
                    status.bg,
                    status.border,
                    status.color,
                    isActive && "animate-pulse"
                  )}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </Badge>
                </div>

                <div className={cn(
                  "p-4 rounded-xl border-2 border-[#f9a8d4]/30 mb-4",
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 mb-4">
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
                        
                        const getVariationImage = (item: any) => {
                          if (item.metadata?.variation_image) return item.metadata.variation_image;
                          if (item.metadata?.product_cover) return item.metadata.product_cover;
                          if (item.selected_options?.variation_image) return item.selected_options.variation_image;
                          if (item.variation_snapshot?.image_url) return item.variation_snapshot.image_url;
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
                          if (item.variation_combination?.colors) {
                            const colorName = item.variation_combination.colors;
                            const colors = listing?.colors || [];
                            const color = colors.find((c: any) => 
                              c.color_name_ar === colorName || c.color_name_en === colorName
                            );
                            if (color?.image_url) return color.image_url;
                          }
                          return listing?.cover_url || null;
                        };

                        const imageUrl = getVariationImage(item);

                        const getVariationCombination = (item: any) => {
                          if (item.variation_snapshot?.combination) return item.variation_snapshot.combination;
                          if (item.metadata?.variation_combination) return item.metadata.variation_combination;
                          if (item.variation_combination) return item.variation_combination;
                          if (item.selected_options?.variation_combination) return item.selected_options.variation_combination;
                          return null;
                        };

                        const variationCombination = getVariationCombination(item);
                        const hasVariation = !!(variationCombination && Object.keys(variationCombination).length > 0);

                        const getVariationDisplay = (combination: any) => {
                          if (!combination) return null;
                          const parts: string[] = [];
                          const order = ['colors', 'sizes', 'size', 'color', 'اللون', 'المقاس', 'colour'];
                          for (const key of order) {
                            if (combination[key]) parts.push(combination[key]);
                          }
                          for (const [key, value] of Object.entries(combination)) {
                            if (!order.includes(key) && value) parts.push(String(value));
                          }
                          return parts.length > 0 ? parts.join(' • ') : null;
                        };

                        const variationDisplay = getVariationDisplay(variationCombination);

                        return (
                          <div 
                            key={item.id || index}
                            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-[#f9a8d4]/50 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200/50 dark:border-slate-700/50">
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
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-800 dark:text-white">
                                  {app.lang === "ar" 
                                    ? listing?.title_ar || 'منتج'
                                    : listing?.title_en || listing?.title_ar || 'Product'}
                                </p>
                                
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
                                  
                                  {hasVariation && variationDisplay && (
                                    <>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 px-2 py-0.5 rounded-full border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                                        <Layers className="h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" />
                                        {variationDisplay}
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
                              
                              <Link to="/listing/$id" params={{ id: item.listing_id || item.id }}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 hover:scale-110">
                                  <Eye className="h-3.5 w-3.5 text-[#2a655f]" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200/50 dark:border-slate-700/50">
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
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 hover:scale-110">
                              <Eye className="h-3.5 w-3.5 text-[#2a655f]" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border-2 border-yellow-200/50 dark:border-yellow-800/30 mb-4">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {app.lang === "ar" ? "ملاحظات العميل" : "Customer Notes"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedOrder.notes}</p>
                  </div>
                )}

                {selectedOrder.status === "rejected" && selectedOrder.rejection_reason && (
                  <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-800/30 mb-4">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5" />
                      {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedOrder.rejection_reason}</p>
                  </div>
                )}

                <div className="p-4 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {app.lang === "ar" ? "المجموع الفرعي" : "Subtotal"}
                    </span>
                    <span className="text-lg font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                      {formatPrice(totalPrice, app.currency, app.lang)}
                    </span>
                  </div>
                  
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

                <div className="mt-6 pt-4 border-t-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDetailDialogOpen(false)}
                    className="rounded-xl border-2 border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300"
                  >
                    {app.lang === "ar" ? "إغلاق" : "Close"}
                  </Button>
                  
                  {selectedOrder.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30"
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
                        className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30"
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
        <DialogContent className="max-w-md rounded-2xl border-3 border-red-200/50 dark:border-red-800/30 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-red-500/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600 dark:text-red-400">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {app.lang === "ar" ? "رفض الطلب" : "Reject Order"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30">
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
                className="w-full min-h-[100px] p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none"
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
                className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 border-2 border-white/30"
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