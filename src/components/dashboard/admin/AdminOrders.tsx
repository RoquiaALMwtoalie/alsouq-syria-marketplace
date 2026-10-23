// src/components/dashboard/admin/AdminOrders.tsx

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";  // ✅ NEW
import {
  ShoppingBag, Store, User, Phone, MessageCircle, Eye,
  Search, Filter, RefreshCw, Package, Truck, CheckCircle2,
  XCircle, Clock, Calendar, Hash, MapPin, Wallet,
  ChevronLeft, ChevronRight, Loader2, X, Layers,
  FileSpreadsheet, FileText, AlertCircle, TrendingUp,
  PhoneCall, PhoneOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";  // ✅ NEW
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp, formatPrice } from "@/lib/i18n";
import { useAllOrdersAdminDetailed } from "@/lib/queries";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { supabase } from "@/integrations/supabase/client";  // ✅ NEW
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';

const { saveAs } = fileSaver;

// ============================================================
// ✅ دوال تنسيق
// ============================================================
const formatDate = (date: string | Date, lang: string) => {
  if (!date) return "—";
  const locale = lang === "ar" ? "ar-SY" : "en-US";
  try {
    return new Date(date).toLocaleDateString(locale, {
      calendar: "gregory",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatTime = (date: string | Date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
};

const formatDateForFilename = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ✅ NEW - توليد رقم تتبع فريد (نسخة الأدمن)
const generateTrackingNumber = () => {
  const prefix = 'SQT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// ============================================================
// ✅ STATUS CONFIG
// ============================================================
const STATUS_CONFIG: Record<string, {
  labelAr: string;
  labelEn: string;
  color: string;
  bg: string;
  border: string;
  icon: any;
}> = {
  pending: {
    labelAr: "قيد المراجعة",
    labelEn: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
  },
  accepted: {
    labelAr: "مقبول",
    labelEn: "Accepted",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  processing: {
    labelAr: "قيد المعالجة",
    labelEn: "Processing",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: RefreshCw,
  },
  shipped: {
    labelAr: "تم الشحن",
    labelEn: "Shipped",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: Truck,
  },
  delivered: {
    labelAr: "تم التوصيل",
    labelEn: "Delivered",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  completed: {
    labelAr: "مكتمل",
    labelEn: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  rejected: {
    labelAr: "مرفوض",
    labelEn: "Rejected",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: XCircle,
  },
  cancelled: {
    labelAr: "ملغي",
    labelEn: "Cancelled",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: XCircle,
  },
};

// ============================================================
// ✅ MAIN COMPONENT
// ============================================================
export function AdminOrders() {
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();  // ✅ NEW
  const isRTL = app.lang === "ar";

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // ✅ حالة فتح المحادثة
  const [isOpeningConversation, setIsOpeningConversation] = useState(false);

  // ✅ NEW - حالات القبول/الرفض
  const [isAcceptingOrder, setIsAcceptingOrder] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Query
  const { data: orders = [], isLoading, isFetching, refetch } = useAllOrdersAdminDetailed();

  // ✅ hook إنشاء/جلب المحادثة
  const getOrCreateConversation = useGetOrCreateConversation();

  // ============================================================
  // ✅ الفلترة والبحث
  // ============================================================
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (filterStatus !== "all") {
      result = result.filter((o: any) => o.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o: any) => {
        const orderId = String(o.id).toLowerCase();
        const buyerName = (o.buyer?.full_name || o.buyer_name || "").toLowerCase();
        const buyerPhone = (o.buyer?.phone || o.buyer_phone || "").toLowerCase();
        const sellerName = (o.seller?.store_name || o.seller?.full_name || "").toLowerCase();
        const sellerPhone = (o.seller?.store_phone || o.seller?.phone || "").toLowerCase();
        const trackingNumber = (o.tracking_number || "").toLowerCase();

        return (
          orderId.includes(q) ||
          buyerName.includes(q) ||
          buyerPhone.includes(q) ||
          sellerName.includes(q) ||
          sellerPhone.includes(q) ||
          trackingNumber.includes(q)
        );
      });
    }

    return result;
  }, [orders, filterStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredOrders.slice(start, start + limit);
  }, [filteredOrders, page, limit]);

  // Stats
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o: any) => o.status === "pending").length,
    delivered: orders.filter((o: any) => o.status === "delivered" || o.status === "completed").length,
    rejected: orders.filter((o: any) => o.status === "rejected" || o.status === "cancelled").length,
  }), [orders]);

  // ============================================================
  // ✅ Helpers
  // ============================================================
  const getBuyerName = (order: any) =>
    order.buyer?.full_name || order.buyer_name || (isRTL ? "عميل" : "Customer");

  const getBuyerPhone = (order: any) =>
    order.buyer?.phone || order.buyer_phone || null;

  const getSellerName = (order: any) =>
    order.seller?.store_name ||
    order.seller?.full_name ||
    (isRTL ? "متجر" : "Store");

  const getSellerPhone = (order: any) =>
    order.seller?.store_phone || order.seller?.phone || null;

  // ============================================================
  // ✅ دالة موحّدة لفتح المحادثة
  // ============================================================
  const handleMessageUser = useCallback(async (
    targetUserId: string | null | undefined,
    targetName: string,
    roleLabel: 'buyer' | 'seller',
  ) => {
    if (!targetUserId) {
      toast.error(
        isRTL
          ? `لا يوجد حساب ${roleLabel === 'buyer' ? 'للمشتري' : 'للبائع'}`
          : `No ${roleLabel} account`
      );
      return;
    }

    if (!app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }

    if (app.user.id === targetUserId) {
      toast.error(
        isRTL
          ? `لا يمكنك مراسلة نفسك (أنت ال${roleLabel === 'buyer' ? 'مشتري' : 'بائع'} في هذا الطلب)`
          : `You can't message yourself (you are the ${roleLabel})`
      );
      return;
    }

    setIsOpeningConversation(true);

    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId: targetUserId,
      });

      navigate({
        to: "/messages/$userId",
        params: { userId: targetUserId },
        search: { cid: conversation.id },
        state: {
          fromAdmin: true,
          targetName,
          roleLabel,
        },
      });
    } catch (error: any) {
      console.error("❌ [AdminOrders] Failed to open conversation:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        fullError: error,
      });

      if (error?.code === '42501') {
        toast.error(
          isRTL
            ? "ليست لديك صلاحية فتح هذه المحادثة"
            : "You don't have permission to open this conversation"
        );
      } else if (error?.message?.includes?.('yourself')) {
        toast.error(
          isRTL
            ? "لا يمكنك مراسلة نفسك"
            : "You can't message yourself"
        );
      } else {
        toast.error(
          isRTL
            ? "فشل فتح المحادثة. حاول مرة أخرى"
            : "Failed to open conversation. Please try again"
        );
      }
    } finally {
      setIsOpeningConversation(false);
    }
  }, [app.user, getOrCreateConversation, isRTL, navigate]);

  // ✅ دالة موحّدة للاتصال
  const handleCall = useCallback((phone: string | null, name?: string) => {
    if (!phone) {
      toast.error(
        isRTL
          ? `لا يوجد رقم هاتف${name ? ` لـ ${name}` : ''}`
          : `No phone number${name ? ` for ${name}` : ''}`
      );
      return;
    }
    window.location.href = `tel:${phone}`;
  }, [isRTL]);

  // ✅ مراسلة المشتري
  const handleMessageBuyer = useCallback((order: any) => {
    handleMessageUser(order.buyer_id, getBuyerName(order), 'buyer');
  }, [handleMessageUser]);

  // ✅ مراسلة البائع
  const handleMessageSeller = useCallback((order: any) => {
    handleMessageUser(order.seller_id, getSellerName(order), 'seller');
  }, [handleMessageUser]);

  // ✅ اتصال بالمشتري
  const handleCallBuyer = useCallback((order: any) => {
    handleCall(getBuyerPhone(order), getBuyerName(order));
  }, [handleCall]);

  // ✅ اتصال بالبائع
  const handleCallSeller = useCallback((order: any) => {
    handleCall(getSellerPhone(order), getSellerName(order));
  }, [handleCall]);

  // ============================================================
  // ✅ NEW - قبول الطلب (نفس منطق البائع في OrdersPage.tsx)
  // ============================================================
  const handleAcceptOrder = useCallback(async (orderId: string) => {
    if (isAcceptingOrder) return;
    setIsAcceptingOrder(true);

    try {
      console.log("🚀 [Admin] Starting order acceptance for:", orderId);

      // 1. جلب بيانات الطلب
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
        toast.error(isRTL ? "❌ لم نتمكن من جلب الطلب" : "❌ Could not fetch order");
        return;
      }

      if (!order) {
        toast.error(isRTL ? "❌ الطلب غير موجود" : "❌ Order not found");
        return;
      }

      console.log("📦 Order data:", order);

      // 2. جلب بيانات المتجر
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
        toast.error(isRTL ? "❌ لم نتمكن من جلب بيانات المتجر" : "❌ Could not fetch store data");
        return;
      }

      console.log("🏪 Store data:", storeData);

      // 3. تحديد شركة التوصيل (مع fallback)
      let deliveryCompanyId = storeData?.delivery_company_id;
      console.log(`🏢 Delivery company from store: ${deliveryCompanyId}`);

      if (!deliveryCompanyId) {
        console.warn(`⚠️ Store ${storeData.id} has no delivery company`);

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
        toast.error(isRTL ? "❌ لا توجد شركة توصيل متاحة" : "❌ No delivery company available");
        return;
      }

      console.log(`✅ Final delivery company: ${deliveryCompanyId}`);

      // 4. توليد رقم تتبع
      const trackingNumber = generateTrackingNumber();
      console.log(`🔢 Generated tracking number: ${trackingNumber}`);

      // 5. تحديث الطلب
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

      // 6. إنشاء delivery_order (إذا لم يكن موجوداً)
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
          toast.warning(isRTL
            ? "⚠️ تم قبول الطلب لكن حدث خطأ في إنشاء طلب التوصيل (تحقق من الصلاحيات)"
            : "⚠️ Order accepted but delivery order creation failed (check permissions)");
        } else {
          console.log("✅ Delivery order created successfully");
        }
      } else {
        console.log("ℹ️ Delivery order already exists, skipping creation");
      }

      // 7. إشعار المشتري
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

      // 8. إشعارات لـ admins شركة التوصيل
      if (deliveryCompanyId) {
        console.log(`🔍 Fetching admins for company: ${deliveryCompanyId}`);

        const { data: companyAdmins, error: adminsError } = await supabase
          .from("delivery_company_admins")
          .select("user_id")
          .eq("company_id", deliveryCompanyId);

        console.log(`📊 Found ${companyAdmins?.length || 0} admins`);

        if (!adminsError && companyAdmins && companyAdmins.length > 0) {
          const adminIds = companyAdmins.map((a: any) => a.user_id);

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
          } else {
            console.error("❌ Notification error:", notifyError);
          }
        }
      }

      toast.success(isRTL
        ? `✅ تم قبول الطلب (رقم التتبع: ${trackingNumber})`
        : `✅ Order accepted (Tracking: ${trackingNumber})`);

      // 9. تحديث البيانات
      await refetch();

      // 10. إبطال الـ queries المشتركة
      queryClient.invalidateQueries({ queryKey: ['store-orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders-admin'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders-admin-detailed'] });

      // 11. إغلاق Dialog
      setDetailsOpen(false);
      setSelectedOrder(null);

    } catch (error) {
      console.error("❌ Error accepting order:", error);
      toast.error(isRTL ? "❌ حدث خطأ في قبول الطلب" : "❌ Error accepting order");
    } finally {
      setIsAcceptingOrder(false);
    }
  }, [isAcceptingOrder, isRTL, refetch, queryClient]);

  // ============================================================
  // ✅ NEW - رفض الطلب (نفس منطق البائع)
  // ============================================================
  const handleRejectOrder = useCallback(async (orderId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error(isRTL ? "❌ الرجاء إدخال سبب الرفض" : "❌ Please enter a rejection reason");
      return;
    }

    setIsRejecting(true);

    try {
      // 1. جلب بيانات الطلب (مع promo)
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

      // 2. تحديث الطلب
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

      // 3. معالجة promo code (إن وجد)
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
          }
        }

        const { error: deleteUsageError } = await supabase
          .from("promo_code_usage")
          .delete()
          .eq("order_id", orderId);

        if (deleteUsageError) {
          console.error("❌ Error deleting promo usage record:", deleteUsageError);
        }
      }

      // 4. جلب اسم المتجر
      let storeName = '';
      if (order.order_items && order.order_items.length > 0) {
        const firstItem = order.order_items[0];
        const listing = firstItem?.listings;
        if (listing?.profiles) {
          storeName = isRTL
            ? (listing.profiles.store_name || listing.profiles.full_name || 'المتجر')
            : (listing.profiles.store_name || listing.profiles.full_name || 'Store');
        }
      } else if (order.listings?.profiles) {
        storeName = isRTL
          ? (order.listings.profiles.store_name || order.listings.profiles.full_name || 'المتجر')
          : (order.listings.profiles.store_name || order.listings.profiles.full_name || 'Store');
      }

      if (!storeName) {
        storeName = isRTL ? "المتجر" : "Store";
      }

      const itemsCount = order.order_items?.length || 1;

      // 5. إشعار المشتري
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

      toast.success(isRTL ? "✅ تم رفض الطلب مع إرسال السبب" : "✅ Order rejected with reason");

      // 6. تحديث البيانات
      await refetch();

      // 7. إبطال الـ queries المشتركة
      queryClient.invalidateQueries({ queryKey: ['store-orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders-admin'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders-admin-detailed'] });

      // 8. إغلاق Dialogs
      setRejectDialogOpen(false);
      setRejectOrderId(null);
      setRejectReason("");
      setDetailsOpen(false);
      setSelectedOrder(null);

    } catch (error) {
      console.error("❌ Error rejecting order:", error);
      toast.error(isRTL ? "❌ حدث خطأ في رفض الطلب" : "❌ Error rejecting order");
    } finally {
      setIsRejecting(false);
    }
  }, [app.user?.id, isRTL, refetch, queryClient]);

  // ============================================================
  // ✅ تصدير Excel
  // ============================================================
  const exportToExcel = useCallback(() => {
    const exportData = filteredOrders.map((o: any) => ({
      'رقم الطلب': String(o.id).slice(0, 8),
      'رقم التتبع': o.tracking_number || '—',
      'المشتري': getBuyerName(o),
      'هاتف المشتري': getBuyerPhone(o) || '—',
      'البائع / المتجر': getSellerName(o),
      'هاتف البائع': getSellerPhone(o) || '—',
      'الحالة': STATUS_CONFIG[o.status]?.labelAr || o.status,
      'الإجمالي': o.total_with_delivery || o.total || 0,
      'العملة': o.currency || 'SYP',
      'التاريخ': formatDate(o.created_at, 'ar'),
      'الوقت': formatTime(o.created_at),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    ws['!cols'] = [{ wch: 15 }, { wch: 22 }, { wch: 25 }, { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 15 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `الطلبات_${formatDateForFilename()}.xlsx`);
    toast.success(isRTL ? "✅ تم التصدير إلى Excel" : "✅ Exported to Excel");
  }, [filteredOrders, isRTL]);

  // ============================================================
  // ✅ Loading
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#2a655f]" />
        <p className="text-slate-600 dark:text-slate-400">
          {isRTL ? "جاري تحميل الطلبات..." : "Loading orders..."}
        </p>
      </div>
    );
  }

  // ============================================================
  // ✅ RENDER
  // ============================================================
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {isRTL ? "جميع الطلبات" : "All Orders"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20">
              {orders.length}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isRTL
              ? `جميع الطلبات عبر النظام (${filteredOrders.length} من ${orders.length})`
              : `All orders in system (${filteredOrders.length} of ${orders.length})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredOrders.length === 0}
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 h-9"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 h-9"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: isRTL ? "الإجمالي" : "Total", value: stats.total, icon: ShoppingBag, gradient: "from-[#2a655f] to-[#1a4f4a]" },
          { label: isRTL ? "قيد المراجعة" : "Pending", value: stats.pending, icon: Clock, gradient: "from-amber-500 to-orange-500" },
          { label: isRTL ? "تم التوصيل" : "Delivered", value: stats.delivered, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500" },
          { label: isRTL ? "مرفوض" : "Rejected", value: stats.rejected, icon: XCircle, gradient: "from-rose-500 to-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 p-4 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
              <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center", s.gradient)}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder={isRTL ? "🔍 بحث برقم الطلب، اسم المشتري، البائع، الهاتف..." : "🔍 Search by order #, buyer, seller, phone..."}
            className="ps-9 h-10 rounded-xl border-2 border-pink-400/60 focus:border-pink-500"
          />
        </div>

        <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl border-2 border-pink-400/60">
            <Filter className="h-4 w-4 mr-2 text-[#d81b60]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{isRTL ? "جميع الحالات" : "All"}</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{isRTL ? cfg.labelAr : cfg.labelEn}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[100px] h-10 rounded-xl border-2 border-pink-400/60">
            <Layers className="h-4 w-4 mr-2 text-[#d81b60]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-xs font-bold text-[#2a655f] text-center min-w-[140px] border-r">
                  <Hash className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "رقم الطلب" : "Order #"}
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] text-right min-w-[180px] border-r">
                  <User className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "المشتري" : "Buyer"}
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] text-center min-w-[120px] border-r">
                  <Phone className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "هاتف المشتري" : "Buyer Phone"}
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] text-right min-w-[180px] border-r">
                  <Store className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "البائع / المتجر" : "Seller"}
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] text-center min-w-[120px] border-r">
                  <Phone className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "هاتف البائع" : "Seller Phone"}
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] text-center min-w-[100px] border-r">
                  <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] text-center min-w-[280px]">
                  <Layers className="h-3.5 w-3.5 inline mr-1" />
                  {isRTL ? "الإجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingBag className="h-12 w-12 text-slate-300" />
                      <p className="font-medium">{isRTL ? "لا توجد طلبات" : "No orders"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order: any) => {
                  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusCfg.icon;
                  const buyerPhone = getBuyerPhone(order);
                  const sellerPhone = getSellerPhone(order);

                  const isSelfBuyer = !!order.buyer_id && order.buyer_id === app.user?.id;
                  const isSelfSeller = !!order.seller_id && order.seller_id === app.user?.id;

                  // ✅ NEW - هل الطلب pending؟
                  const isPending = order.status === 'pending';

                  return (
                    <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b">
                      <TableCell className="text-center border-r">
                        <div className="flex flex-col items-center gap-1">
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border font-mono text-[10px]">
                            #{String(order.id).slice(0, 8)}
                          </Badge>
                          {order.tracking_number && (
                            <Badge className="bg-blue-500/10 text-blue-600 border text-[9px] font-mono">
                              <Truck className="h-2.5 w-2.5 mr-1" />
                              {order.tracking_number}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="border-r">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#2a655f]/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-[#2a655f]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{getBuyerName(order)}</p>
                            <p className="text-[10px] text-slate-500">
                              {formatDate(order.created_at, app.lang)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center border-r">
                        {buyerPhone ? (
                          <div className="flex items-center justify-center gap-1">
                            <a href={`tel:${buyerPhone}`} className="font-mono text-xs text-[#2a655f] hover:underline">
                              {buyerPhone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>

                      <TableCell className="border-r">
                        <div className="flex items-center gap-2">
                          {order.seller?.store_logo_url ? (
                            <img src={order.seller.store_logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Store className="h-4 w-4 text-amber-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{getSellerName(order)}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center border-r">
                        {sellerPhone ? (
                          <a href={`tel:${sellerPhone}`} className="font-mono text-xs text-[#2a655f] hover:underline">
                            {sellerPhone}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center border-r">
                        <Badge className={cn("border-2 flex items-center gap-1 justify-center", statusCfg.bg, statusCfg.color, statusCfg.border)}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="text-[10px]">{isRTL ? statusCfg.labelAr : statusCfg.labelEn}</span>
                        </Badge>
                      </TableCell>

                      {/* ✅ الإجراءات: قبول + رفض (pending) + مراسلة/اتصال + تفاصيل */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {/* ✅ NEW - أزرار القبول والرفض (فقط للطلبات pending) */}
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={isAcceptingOrder || isRejecting}
                                className="h-7 px-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-[10px] font-bold shadow-md shadow-emerald-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 border border-white/30"
                                title={isRTL ? "قبول الطلب" : "Accept Order"}
                              >
                                {isAcceptingOrder ? (
                                  <Loader2 className="h-3 w-3 mr-0.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3 w-3 mr-0.5" />
                                )}
                                {isRTL ? "قبول" : "Accept"}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setRejectOrderId(order.id);
                                  setRejectReason("");
                                  setRejectDialogOpen(true);
                                }}
                                disabled={isAcceptingOrder || isRejecting}
                                className="h-7 px-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[10px] font-bold shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 border border-white/30"
                                title={isRTL ? "رفض الطلب" : "Reject Order"}
                              >
                                <XCircle className="h-3 w-3 mr-0.5" />
                                {isRTL ? "رفض" : "Reject"}
                              </Button>
                            </>
                          )}

                          {/* مراسلة المشتري */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMessageBuyer(order)}
                            disabled={!order.buyer_id || isSelfBuyer || isOpeningConversation}
                            className="h-7 w-7 p-0 rounded-lg border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 text-blue-600 disabled:opacity-40"
                            title={
                              isSelfBuyer
                                ? (isRTL ? "هذا أنت (المشتري)" : "This is you (buyer)")
                                : (isRTL ? "مراسلة المشتري" : "Message buyer")
                            }
                          >
                            {isOpeningConversation ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <MessageCircle className="h-3.5 w-3.5" />
                            )}
                          </Button>

                          {/* اتصال بالمشتري */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCallBuyer(order)}
                            disabled={!buyerPhone}
                            className="h-7 w-7 p-0 rounded-lg border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 text-purple-600 disabled:opacity-40"
                            title={
                              buyerPhone
                                ? (isRTL ? `اتصال بالمشتري: ${buyerPhone}` : `Call buyer: ${buyerPhone}`)
                                : (isRTL ? "لا يوجد رقم هاتف" : "No phone number")
                            }
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                          </Button>

                          {/* مراسلة البائع */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMessageSeller(order)}
                            disabled={!order.seller_id || isSelfSeller || isOpeningConversation}
                            className="h-7 w-7 p-0 rounded-lg border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 text-emerald-600 disabled:opacity-40"
                            title={
                              isSelfSeller
                                ? (isRTL ? "هذا أنت (البائع)" : "This is you (seller)")
                                : (isRTL ? "مراسلة البائع" : "Message seller")
                            }
                          >
                            {isOpeningConversation ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <MessageCircle className="h-3.5 w-3.5" />
                            )}
                          </Button>

                          {/* اتصال بالبائع */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCallSeller(order)}
                            disabled={!sellerPhone}
                            className="h-7 w-7 p-0 rounded-lg border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 text-orange-600 disabled:opacity-40"
                            title={
                              sellerPhone
                                ? (isRTL ? `اتصال بالبائع: ${sellerPhone}` : `Call seller: ${sellerPhone}`)
                                : (isRTL ? "لا يوجد رقم هاتف" : "No phone number")
                            }
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                          </Button>

                          {/* التفاصيل */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setSelectedOrder(order); setDetailsOpen(true); }}
                            className="h-7 w-7 p-0 rounded-lg border-slate-200 bg-slate-50 hover:bg-slate-100"
                            title={isRTL ? "التفاصيل" : "Details"}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {isRTL
                ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredOrders.length)} من ${filteredOrders.length}`
                : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredOrders.length)} of ${filteredOrders.length}`}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1} className="h-8 w-8 p-0">
                «
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 text-sm">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} className="h-8 w-8 p-0">
                »
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ✅ DETAILS DIALOG */}
      {/* ============================================================ */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#2a655f]" />
              {isRTL ? "تفاصيل الطلب" : "Order Details"}
            </DialogTitle>
            <DialogDescription>
              #{selectedOrder && String(selectedOrder.id).slice(0, 12)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (() => {
            const isSelfBuyer = !!selectedOrder.buyer_id && selectedOrder.buyer_id === app.user?.id;
            const isSelfSeller = !!selectedOrder.seller_id && selectedOrder.seller_id === app.user?.id;
            const isPending = selectedOrder.status === 'pending';

            return (
              <div className="space-y-4 mt-4">
                {/* Buyer & Seller cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <p className="text-xs font-bold text-blue-700 flex items-center gap-1 mb-2">
                      <User className="h-3.5 w-3.5" />
                      {isRTL ? "المشتري" : "Buyer"}
                      {isSelfBuyer && (
                        <Badge className="bg-blue-600 text-white text-[8px] px-1.5 py-0 ml-auto">
                          {isRTL ? "أنت" : "You"}
                        </Badge>
                      )}
                    </p>
                    <p className="font-semibold text-sm">{getBuyerName(selectedOrder)}</p>
                    {getBuyerPhone(selectedOrder) && (
                      <p className="text-xs font-mono text-slate-600 mt-1">{getBuyerPhone(selectedOrder)}</p>
                    )}
                    <div className="flex gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessageBuyer(selectedOrder)}
                        disabled={!selectedOrder.buyer_id || isSelfBuyer || isOpeningConversation}
                        className="h-7 text-xs flex-1"
                      >
                        {isOpeningConversation ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <MessageCircle className="h-3 w-3 mr-1" />
                        )}
                        {isSelfBuyer ? (isRTL ? "أنت" : "You") : (isRTL ? "مراسلة" : "Message")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCallBuyer(selectedOrder)}
                        disabled={!getBuyerPhone(selectedOrder)}
                        className="h-7 text-xs flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        {isRTL ? "اتصال" : "Call"}
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mb-2">
                      <Store className="h-3.5 w-3.5" />
                      {isRTL ? "البائع / المتجر" : "Seller"}
                      {isSelfSeller && (
                        <Badge className="bg-emerald-600 text-white text-[8px] px-1.5 py-0 ml-auto">
                          {isRTL ? "أنت" : "You"}
                        </Badge>
                      )}
                    </p>
                    <p className="font-semibold text-sm">{getSellerName(selectedOrder)}</p>
                    {getSellerPhone(selectedOrder) && (
                      <p className="text-xs font-mono text-slate-600 mt-1">{getSellerPhone(selectedOrder)}</p>
                    )}
                    <div className="flex gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessageSeller(selectedOrder)}
                        disabled={!selectedOrder.seller_id || isSelfSeller || isOpeningConversation}
                        className="h-7 text-xs flex-1"
                      >
                        {isOpeningConversation ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <MessageCircle className="h-3 w-3 mr-1" />
                        )}
                        {isSelfSeller ? (isRTL ? "أنت" : "You") : (isRTL ? "مراسلة" : "Message")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCallSeller(selectedOrder)}
                        disabled={!getSellerPhone(selectedOrder)}
                        className="h-7 text-xs flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        {isRTL ? "اتصال" : "Call"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <p className="text-xs font-bold text-slate-600 mb-2">{isRTL ? "الحالة" : "Status"}</p>
                  <Badge className={cn("border-2", STATUS_CONFIG[selectedOrder.status]?.bg, STATUS_CONFIG[selectedOrder.status]?.color, STATUS_CONFIG[selectedOrder.status]?.border)}>
                    {isRTL ? STATUS_CONFIG[selectedOrder.status]?.labelAr : STATUS_CONFIG[selectedOrder.status]?.labelEn}
                  </Badge>
                </div>

                {/* ✅ NEW - أزرار القبول والرفض داخل Dialog */}
                {isPending && (
                  <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-300">
                    <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {isRTL ? "إجراءات مطلوبة" : "Required Actions"}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptOrder(selectedOrder.id)}
                        disabled={isAcceptingOrder || isRejecting}
                        className="flex-1 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-md"
                      >
                        {isAcceptingOrder ? (
                          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        )}
                        {isRTL ? "قبول الطلب" : "Accept Order"}
                      </Button>
                      <Button
                        onClick={() => {
                          setRejectOrderId(selectedOrder.id);
                          setRejectReason("");
                          setRejectDialogOpen(true);
                        }}
                        disabled={isAcceptingOrder || isRejecting}
                        className="flex-1 h-9 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-md"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        {isRTL ? "رفض الطلب" : "Reject Order"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Products */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    {isRTL ? "المنتجات" : "Products"}
                  </p>
                  {(selectedOrder.order_items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      {item.listings?.cover_url ? (
                        <img src={item.listings.cover_url} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-200 flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {isRTL ? item.listings?.title_ar : (item.listings?.title_en || item.listings?.title_ar)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isRTL ? "الكمية:" : "Qty:"} {item.quantity} × {formatPrice(Number(item.price), selectedOrder.currency || 'SYP', app.lang)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-3 bg-[#2a655f]/5 rounded-xl border-2 border-[#2a655f]/20 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{isRTL ? "المجموع الفرعي:" : "Subtotal:"}</span>
                    <span className="font-mono">{formatPrice(Number(selectedOrder.total), selectedOrder.currency || 'SYP', app.lang)}</span>
                  </div>
                  {Number(selectedOrder.delivery_fee) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? "التوصيل:" : "Delivery:"}</span>
                      <span className="font-mono">{formatPrice(Number(selectedOrder.delivery_fee), selectedOrder.currency || 'SYP', app.lang)}</span>
                    </div>
                  )}
                  {Number(selectedOrder.promo_discount) > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>{isRTL ? "الخصم:" : "Discount:"}</span>
                      <span className="font-mono">-{formatPrice(Number(selectedOrder.promo_discount), selectedOrder.currency || 'SYP', app.lang)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold border-t-2 pt-2 mt-2">
                    <span>{isRTL ? "الإجمالي:" : "Total:"}</span>
                    <span className="text-[#2a655f]">
                      {formatPrice(
                        Number(selectedOrder.total_with_delivery) ||
                        (Number(selectedOrder.total) + Number(selectedOrder.delivery_fee) - Number(selectedOrder.promo_discount)),
                        selectedOrder.currency || 'SYP',
                        app.lang
                      )}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(selectedOrder.created_at, app.lang)} — {formatTime(selectedOrder.created_at)}
                </div>
              </div>
            );
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)} className="rounded-xl">
              {isRTL ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* ✅ NEW - REJECT ORDER DIALOG (نسخة الأدمن) */}
      {/* ============================================================ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-600 dark:text-red-400">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {isRTL ? "رفض الطلب" : "Reject Order"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {isRTL
                    ? "سيتم إرسال سبب الرفض إلى العميل ليتمكن من فهم سبب الرفض"
                    : "The rejection reason will be sent to the customer so they can understand why"}
                </span>
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1.5">
                {isRTL ? "سبب الرفض" : "Rejection Reason"}
                <span className="text-red-500">*</span>
              </Label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={isRTL
                  ? "اكتب سبب رفض الطلب..."
                  : "Write the reason for rejecting the order..."
                }
                className="w-full min-h-[100px] p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none"
                dir={isRTL ? "rtl" : "ltr"}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {rejectReason.length}/500
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                isRTL ? "المنتج غير متوفر" : "Product unavailable",
                isRTL ? "سعر غير صحيح" : "Incorrect price",
                isRTL ? "عنوان غير صحيح" : "Invalid address",
                isRTL ? "مشكلة في الدفع" : "Payment issue",
                isRTL ? "سبب آخر" : "Other reason",
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
                {isRTL ? "إلغاء" : "Cancel"}
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
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isRTL ? "جاري الرفض..." : "Rejecting..."}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    {isRTL ? "تأكيد الرفض" : "Confirm Reject"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default AdminOrders;