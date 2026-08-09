// src/components/dashboard/OrdersPage.tsx

import React, { useState, useMemo, useCallback } from "react";
import { 
  ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, Eye, X, Layers,
  AlertCircle, Sparkles, Rocket, DollarSign,
  Calendar, User, Phone, MessageCircle,
  TrendingUp, Star, Users, Clock as ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp, formatPrice } from "@/lib/i18n";
import { useMyOrders } from "@/lib/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
import { supabase } from "@/integrations/supabase/client";
import { notifyDeliveryCompanyAdmins } from "@/lib/delivery-notifications";
const { saveAs } = pkg;

// ============================================================
// ✅ ORDERS PAGE - نسخة محسّنة مع Pagination احترافي
// ============================================================

export const OrdersPage = React.memo(function OrdersPage() {
  const app = useApp();
  
  // ===== STATES =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // ===== API =====
  const { 
    data: allOrders = [], 
    isLoading, 
    isError,
    refetch: refetchOrders,
    isFetching 
  } = useMyOrders(app.user?.id);

  // ===== FILTER ORDERS BY SELLER =====
  const storeOrders = useMemo(() => {
    return allOrders.filter((order: any) => order.seller_id === app.user?.id);
  }, [allOrders, app.user?.id]);

  // ===== APPLY FILTERS =====
  const filteredOrders = useMemo(() => {
    let result = storeOrders;

    if (filterStatus !== "all") {
      result = result.filter((order: any) => order.status === filterStatus);
    }

    if (filterType === "booking") {
      result = result.filter((order: any) => order.is_booking === true || order.type === "booking");
    } else if (filterType === "order") {
      result = result.filter((order: any) => !order.is_booking && order.type !== "booking");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((order: any) => {
        const productName = app.lang === "ar" 
          ? order.listings?.title_ar || ""
          : order.listings?.title_en || order.listings?.title_ar || "";
        const id = order.id?.toLowerCase() || "";
        const customerName = order.buyer_name?.toLowerCase() || "";
        const notes = order.notes?.toLowerCase() || "";
        
        return productName.includes(q) || 
               id.includes(q) || 
               customerName.includes(q) ||
               notes.includes(q);
      });
    }

    return result.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [storeOrders, searchQuery, filterStatus, filterType]);

  // ===== ✅ PAGINATION =====
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // ===== Reset to page 1 when filters change =====
  const handleFilterChange = useCallback((callback: () => void) => {
    callback();
    setCurrentPage(1);
  }, []);

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
    bookings: storeOrders.filter((o: any) => o.is_booking === true || o.type === "booking").length,
  }), [storeOrders]);

  const totalRevenue = useMemo(() => {
    return storeOrders
      .filter((o: any) => o.status === "delivered" || o.status === "completed")
      .reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0);
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
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          listings:listing_id (
            id,
            title_ar,
            owner_id,
            profiles:owner_id (
              store_name,
              store_address,
              lat,
              lng
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (updateError) throw updateError;

      const { data: company, error: companyError } = await supabase
        .from("delivery_companies")
        .select("*")
        .eq("governorate_id", order.governorate_id)
        .eq("is_active", true)
        .maybeSingle();

      if (company && !companyError) {
        const { error: deliveryError } = await supabase
          .from("delivery_orders")
          .insert({
            order_id: orderId,
            delivery_company_id: company.id,
            pickup_address: order.listings?.profiles?.store_address || "عنوان المتجر",
            pickup_latitude: order.listings?.profiles?.lat || 0,
            pickup_longitude: order.listings?.profiles?.lng || 0,
            delivery_address: order.delivery_address,
            delivery_latitude: order.delivery_lat,
            delivery_longitude: order.delivery_lng,
            status: 'pending',
            created_at: new Date().toISOString(),
          });

        if (deliveryError) console.error("❌ Error creating delivery order:", deliveryError);

        await notifyDeliveryCompanyAdmins(company.id, {
          type: "new_delivery",
          title_ar: "🚚 طلب توصيل جديد",
          body_ar: `لديك طلب توصيل جديد إلى ${order.delivery_address || "عنوان العميل"}`,
          link_url: `/delivery/orders/${orderId}`,
          metadata: {
            order_id: orderId,
            delivery_address: order.delivery_address,
            company_id: company.id,
          }
        });
      }

      if (order.buyer_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: order.buyer_id,
            type: "order_accepted",
            title_ar: "✅ تم قبول طلبك",
            body_ar: `تم قبول طلبك "${order.listings?.title_ar}" وسيتم شحنه قريباً`,
            link_url: `/orders/${orderId}`,
          });
      }

      toast.success(app.lang === "ar" ? "✅ تم قبول الطلب" : "✅ Order accepted");
      refetchOrders();

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
          buyer_id,
          listings:listing_id (
            title_ar,
            title_en
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

      const productTitle = app.lang === "ar" 
        ? order.listings?.title_ar 
        : order.listings?.title_en || order.listings?.title_ar;

      if (order.buyer_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: order.buyer_id,
            type: "order_rejected",
            title_ar: "❌ تم رفض طلبك",
            body_ar: `تم رفض طلبك "${productTitle}" من قبل المتجر. السبب: ${reason.trim()}`,
            title_en: "❌ Your order was rejected",
            body_en: `Your order "${productTitle}" was rejected by the store. Reason: ${reason.trim()}`,
            link_url: `/orders/${orderId}`,
            metadata: {
              rejection_reason: reason.trim(),
              order_id: orderId,
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
      'المنتج': app.lang === "ar" ? order.listings?.title_ar : (order.listings?.title_en || order.listings?.title_ar) || '—',
      'الكمية': order.quantity || 1,
      'الإجمالي': formatPrice(Number(order.total) || 0, app.currency, app.lang),
      'الحالة': getStatusLabel(order.status),
      'التاريخ': new Date(order.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
      'النوع': order.is_booking || order.type === "booking" ? 'حجز' : 'طلب',
      'سبب الرفض': order.rejection_reason || '—',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 30 }];
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
        <th>#</th><th>رقم الطلب</th><th>المنتج</th><th>الكمية</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th><th>سبب الرفض</th>
      </tr></thead><tbody>
    `;
    filteredOrders.slice(0, 100).forEach((order: any, i: number) => {
      html += `<tr>
        <td>${i+1}</td>
        <td>${String(order.id).slice(0, 8)}</td>
        <td>${app.lang === "ar" ? order.listings?.title_ar : (order.listings?.title_en || order.listings?.title_ar) || '—'}</td>
        <td>${order.quantity || 1}</td>
        <td>${formatPrice(Number(order.total) || 0, app.currency, app.lang)}</td>
        <td>${getStatusLabel(order.status)}</td>
        <td>${new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
        <td>${order.rejection_reason || '—'}</td>
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
          <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" />
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
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" /> 
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
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60">
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
        
        <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="order">📦 {app.lang === "ar" ? "طلبات" : "Orders"}</SelectItem>
            <SelectItem value="booking">📅 {app.lang === "ar" ? "حجوزات" : "Bookings"}</SelectItem>
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
          onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); setItemsPerPage(10); setCurrentPage(1); }} 
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

      {/* ===== ORDERS TABLE ===== */}
      {storeOrders.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#2a655f]/30 dark:border-[#2a655f]/40 p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent">
          <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto animate-bounce">
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
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); setCurrentPage(1); }}
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
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "المنتج" : "Product"}
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "العميل" : "Customer"}
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "الإجمالي" : "Total"}
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                      {app.lang === "ar" ? "الحالة" : "Status"}
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider hidden md:table-cell">
                      {app.lang === "ar" ? "التاريخ" : "Date"}
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
                    const isBooking = order.is_booking === true || order.type === "booking";
                    const isPending = order.status === "pending";
                    
                    return (
                      <tr 
                        key={order.id} 
                        className="group hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => { setSelectedOrder(order); setDetailDialogOpen(true); }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {order.listings?.cover_url ? (
                              <img 
                                src={order.listings.cover_url} 
                                alt=""
                                className="h-12 w-12 rounded-lg object-cover border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                                <Package className="h-5 w-5 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#2a655f] transition-colors">
                                {app.lang === "ar" 
                                  ? order.listings?.title_ar 
                                  : order.listings?.title_en || order.listings?.title_ar}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                  #{String(order.id).slice(0, 8)}
                                </span>
                                {isBooking && (
                                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-[9px]">
                                    📅 {app.lang === "ar" ? "حجز" : "Booking"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.buyer_phone || ""}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                              {formatPrice(Number(order.total) || 0, app.currency, app.lang)}
                            </p>
                            {order.quantity && (
                              <p className="text-xs text-muted-foreground">
                                {order.quantity} {app.lang === "ar" ? "وحدة" : "units"}
                              </p>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <Badge className={`${statusColor} border text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {new Date(order.created_at).toLocaleDateString(
                              app.lang === "ar" ? "ar-SA" : "en-US",
                              { day: 'numeric', month: 'short', year: 'numeric' }
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleTimeString(
                              app.lang === "ar" ? "ar-SA" : "en-US",
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </p>
                        </td>
                        
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all group-hover:scale-110"
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
                <TrendingUp className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
                {app.lang === "ar" ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                <span className="text-muted-foreground/50">|</span>
                <span className="text-muted-foreground">
                  {totalItems} {app.lang === "ar" ? "طلب" : "orders"}
                </span>
              </span>
              
              <div className="flex items-center gap-1">
                {/* First page */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <span className="text-xs font-bold">«</span>
                </Button>
                
                {/* Previous page */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Page numbers */}
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
                
                {/* Next page */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Last page */}
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

          {selectedOrder && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "تفاصيل الطلب" : "Order Details"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    #{String(selectedOrder.id).slice(0, 8)}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {getStatusLabel(selectedOrder.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-[#2a655f]" />
                    {app.lang === "ar" ? "المنتج" : "Product"}
                  </p>
                  <p className="text-lg font-semibold mt-1 text-slate-900 dark:text-white">
                    {app.lang === "ar" 
                      ? selectedOrder.listings?.title_ar 
                      : selectedOrder.listings?.title_en || selectedOrder.listings?.title_ar}
                  </p>
                  {selectedOrder.quantity && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {app.lang === "ar" ? "الكمية:" : "Quantity:"} {selectedOrder.quantity}
                    </p>
                  )}
                  {selectedOrder.total && (
                    <p className="text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82] mt-2">
                      {formatPrice(Number(selectedOrder.total) || 0, app.currency, app.lang)}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#2a655f]" />
                    {app.lang === "ar" ? "العميل" : "Customer"}
                  </p>
                  <p className="text-lg font-semibold mt-1 text-slate-900 dark:text-white">
                    {selectedOrder.buyer_name || (app.lang === "ar" ? "عميل" : "Customer")}
                  </p>
                  {selectedOrder.buyer_phone && (
                    <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {selectedOrder.buyer_phone}
                    </p>
                  )}
                </div>
              </div>

              {selectedOrder.status === "rejected" && selectedOrder.rejection_reason && (
                <div className="mt-4 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {selectedOrder.rejection_reason}
                  </p>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="mt-4 p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30">
                  <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "ملاحظات" : "Notes"}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "تاريخ الطلب:" : "Order date:"}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(selectedOrder.created_at).toLocaleDateString(
                      app.lang === "ar" ? "ar-SA" : "en-US",
                      { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
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
                  ? "اكتب سبب رفض الطلب (مثال: المنتج غير متوفر، سعر غير صحيح، ...)"
                  : "Write the reason for rejecting the order (e.g., product unavailable, incorrect price, ...)"
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