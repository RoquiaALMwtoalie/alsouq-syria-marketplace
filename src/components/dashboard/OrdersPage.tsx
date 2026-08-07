// src/components/dashboard/OrdersPage.tsx

import React, { useState, useMemo, useCallback } from "react";
import { 
  ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, Eye, Trash2, DollarSign,
  MapPin, Calendar, User, Store, Phone, Mail, MessageCircle,
  TrendingUp, TrendingDown, Award, Target, Sparkles, Rocket,
  ChevronDown, MoreVertical, Printer, Download, Copy, Check,
  AlertCircle, HelpCircle, Star, Users, Clock as ClockIcon,
  ArrowUpRight, ArrowDownRight, Zap, Shield, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useMyOrders } from "@/lib/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

export const OrdersPage = React.memo(function OrdersPage() {
  const app = useApp();
  const t = useT();
  
  // ✅ جلب جميع طلبات المتجر
  const { 
    data: allOrders = [], 
    isLoading, 
    isError,
    refetch: refetchOrders,
    isFetching 
  } = useMyOrders(app.user?.id);

  // ✅ حالة الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled">("all");
  const [filterType, setFilterType] = useState<"all" | "order" | "booking">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // ✅ فلترة الطلبات حسب البائع (المتجر)
  const storeOrders = useMemo(() => {
    // ✅ تصفية الطلبات الخاصة بالبائع الحالي
    return allOrders.filter((order: any) => order.seller_id === app.user?.id);
  }, [allOrders, app.user?.id]);

  // ✅ فلترة إضافية حسب البحث والحالة والنوع
  const filteredOrders = useMemo(() => {
    let result = storeOrders;

    // ✅ فلترة حسب الحالة
    if (filterStatus !== "all") {
      result = result.filter((order: any) => order.status === filterStatus);
    }

    // ✅ فلترة حسب النوع (طلب عادي / حجز)
    if (filterType === "booking") {
      result = result.filter((order: any) => order.is_booking === true || order.type === "booking");
    } else if (filterType === "order") {
      result = result.filter((order: any) => !order.is_booking && order.type !== "booking");
    }

    // ✅ فلترة حسب البحث
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

    // ✅ ترتيب من الأحدث للأقدم
    return result.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [storeOrders, searchQuery, filterStatus, filterType]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredOrders.length / limit);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredOrders.slice(start, start + limit);
  }, [filteredOrders, page, limit]);

  // ✅ إحصائيات الطلبات
  const stats = useMemo(() => ({
    total: storeOrders.length,
    pending: storeOrders.filter((o: any) => o.status === "pending").length,
    processing: storeOrders.filter((o: any) => o.status === "processing").length,
    shipped: storeOrders.filter((o: any) => o.status === "shipped").length,
    delivered: storeOrders.filter((o: any) => o.status === "delivered").length,
    cancelled: storeOrders.filter((o: any) => o.status === "cancelled").length,
    bookings: storeOrders.filter((o: any) => o.is_booking === true || o.type === "booking").length,
  }), [storeOrders]);

  // ✅ إجمالي الإيرادات
  const totalRevenue = useMemo(() => {
    return storeOrders
      .filter((o: any) => o.status === "delivered" || o.status === "completed")
      .reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0);
  }, [storeOrders]);

  // ✅ دوال مساعدة
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: app.lang === "ar" ? "قيد المراجعة" : "Pending",
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
      processing: RefreshCw,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle,
      completed: CheckCircle2,
    };
    return icons[status] || Clock;
  };

  // ✅ تصدير إلى Excel
  const exportToExcel = useCallback(() => {
    const exportData = filteredOrders.map((order: any) => ({
      'رقم الطلب': String(order.id).slice(0, 8),
      'المنتج': app.lang === "ar" ? order.listings?.title_ar : (order.listings?.title_en || order.listings?.title_ar) || '—',
      'الكمية': order.quantity || 1,
      'الإجمالي': formatPrice(Number(order.total) || 0, app.currency, app.lang),
      'الحالة': getStatusLabel(order.status),
      'التاريخ': new Date(order.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
      'النوع': order.is_booking || order.type === "booking" ? 'حجز' : 'طلب',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 12 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `طلبات_المتجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير الطلبات إلى Excel" : "✅ Orders exported to Excel");
  }, [filteredOrders, app.lang, app.currency]);

  // ✅ تصدير إلى Word
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
        <th>#</th><th>رقم الطلب</th><th>المنتج</th><th>الكمية</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th>
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
      </tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `طلبات_المتجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير الطلبات إلى Word" : "✅ Orders exported to Word");
  }, [filteredOrders, stats, totalRevenue, app.lang, app.currency]);

  // ✅ فتح تفاصيل الطلب
  const openOrderDetail = useCallback((order: any) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  }, []);

  // ✅ عرض حالة التحميل المحسنة
  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {app.lang === "ar" ? "⏳ جاري تحميل طلباتك..." : "⏳ Loading your orders..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
      </div>
    );
  }

  // ✅ عرض حالة الخطأ
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

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#3a8a82]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <ShoppingBag className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {app.lang === "ar" ? "طلباتي" : "My Orders"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <ClockIcon className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
              <span className="text-yellow-600 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "قيد المراجعة" : "pending"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
              <Truck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-medium">{stats.delivered}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "تم التوصيل" : "delivered"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200/50">
              <DollarSign className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-purple-600 font-medium">{formatPrice(totalRevenue, app.currency, app.lang)}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "إيرادات" : "revenue"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel} 
            disabled={filteredOrders.length === 0} 
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToWord} 
            disabled={filteredOrders.length === 0} 
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchOrders()} 
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" /> 
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: ShoppingBag, color: 'text-[#2a655f]', bg: 'bg-[#2a655f]/10' },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          { key: 'processing', label: app.lang === 'ar' ? 'قيد المعالجة' : 'Processing', value: stats.processing, icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { key: 'shipped', label: app.lang === 'ar' ? 'تم الشحن' : 'Shipped', value: stats.shipped, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-500/10' },
          { key: 'delivered', label: app.lang === 'ar' ? 'تم التوصيل' : 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'cancelled', label: app.lang === 'ar' ? 'ملغي' : 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
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
            
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300" />
          <Input 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} 
            placeholder={app.lang === "ar" ? "🔍 ابحث في الطلبات..." : "🔍 Search orders..."} 
            className="ps-9 h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300" 
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Select value={filterStatus} onValueChange={(v: any) => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="pending">⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="processing">🔄 {app.lang === "ar" ? "قيد المعالجة" : "Processing"}</SelectItem>
            <SelectItem value="shipped">🚚 {app.lang === "ar" ? "تم الشحن" : "Shipped"}</SelectItem>
            <SelectItem value="delivered">✅ {app.lang === "ar" ? "تم التوصيل" : "Delivered"}</SelectItem>
            <SelectItem value="cancelled">❌ {app.lang === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={(v: any) => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30">
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
        
        <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
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
          onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); setPage(1); }} 
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

      {/* ===== ORDERS TABLE ===== */}
      {storeOrders.length === 0 ? (
        <div className="relative rounded-3xl border-2 border-dashed border-[#2a655f]/30 dark:border-[#2a655f]/40 p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent group hover:border-[#2a655f]/50 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-[#2a655f]/5 blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#3a8a82]/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto animate-bounce">
                <ShoppingBag className="h-12 w-12 text-[#2a655f]/60" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mt-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
              {app.lang === "ar" ? "📦 لا توجد طلبات بعد" : "📦 No orders yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {app.lang === "ar" 
                ? "عندما يقوم العملاء بشراء منتجاتك، ستظهر طلباتهم هنا" 
                : "When customers purchase your products, their orders will appear here"}
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
                {app.lang === "ar" ? "في انتظار الطلبات" : "Waiting for orders"}
              </span>
              <span className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <Rocket className="h-3.5 w-3.5 text-[#2a655f] animate-bounce" />
                {app.lang === "ar" ? "ابدأ بتسويق منتجاتك" : "Start marketing your products"}
              </span>
            </div>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="relative rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50 p-20 text-center bg-gradient-to-b from-slate-50/50 to-transparent group hover:border-[#2a655f]/30 transition-all duration-500">
          <Search className="h-20 w-20 text-muted-foreground/40 mx-auto group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-muted-foreground mt-4">
            {app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results"}
          </h3>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {app.lang === "ar" 
              ? `لم نعثر على طلبات تطابق "${searchQuery || 'البحث'}"` 
              : `No orders match "${searchQuery || 'search'}"`}
          </p>
          <Button 
            variant="outline" 
            className="mt-4 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); }}
          >
            <X className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </Button>
        </div>
      ) : (
        <>
          {/* ===== ORDERS TABLE ===== */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
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
                  {paginatedOrders.map((order: any, index: number) => {
                    const StatusIcon = getStatusIcon(order.status);
                    const statusColor = getStatusColor(order.status);
                    const isBooking = order.is_booking === true || order.type === "booking";
                    
                    return (
                      <tr 
                        key={order.id} 
                        className="group hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-colors duration-300 cursor-pointer"
                        onClick={() => openOrderDetail(order)}
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
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all group-hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation();
                                openOrderDetail(order);
                              }}
                            >
                              <Eye className="h-4 w-4 text-[#2a655f]" />
                            </Button>
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
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <span className="text-xs text-slate-500 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
                {app.lang === "ar" ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
              </span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(1)} 
                  disabled={page === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="text-xs font-bold">«</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 1} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1 px-3">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className={cn(
                          "h-8 w-8 p-0 rounded-xl text-xs font-medium transition-all duration-300",
                          p === page 
                            ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25" 
                            : "hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                        )}
                      >
                        {p}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && page < totalPages - 2 && (
                    <>
                      <span className="text-xs text-muted-foreground">...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(totalPages)}
                        className="h-8 w-8 p-0 rounded-xl text-xs font-medium hover:bg-[#2a655f]/10 hover:text-[#2a655f] transition-all duration-300"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(page + 1)} 
                  disabled={page === totalPages} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(totalPages)} 
                  disabled={page === totalPages} 
                  className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-[#2a655f]/10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30 transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={() => setDetailDialogOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {selectedOrder && (
            <div className="p-6 md:p-8">
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
                {/* معلومات المنتج */}
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

                {/* معلومات العميل */}
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

              {/* ملاحظات */}
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

              {/* تاريخ الطلب */}
              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
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

    </div>
  );
});

// ✅ إضافة CSS للحركات (في نهاية الملف)
const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`;
document.head.appendChild(style);