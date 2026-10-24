// src/components/dashboard/admin/AdminCustomers.tsx

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Users, Search, Phone, MessageCircle, MapPin, Calendar,
  ShoppingCart, CheckCircle2, XCircle, Clock, Filter,
  ChevronLeft, ChevronRight, RefreshCw, User, Loader2,
  FileSpreadsheet, FileText, X, TrendingUp, Award, Activity,
  Mail, Hash, Building2, Star, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/i18n";
import { useAllCustomers } from "@/lib/queries";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
const { saveAs } = fileSaver;

// ============================================================
// 🎨 ZOOQ COLORS
// ============================================================
const OLIVE = "#2a655f";
const OLIVE_LIGHT = "#3a8a82";
const OLIVE_DARK = "#1a4f4a";

// ============================================================
// ✅ Helper Functions
// ============================================================
const formatDate = (date: string | Date, lang: string) => {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    const formatter = new Intl.DateTimeFormat(
      lang === "ar" ? "ar-SY" : "en-US",
      {
        calendar: "gregory",
        numberingSystem: "latn",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

    return formatter.format(d);
  } catch {
    try {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }
};

const formatDateForFilename = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// ============================================================
// ✅ Stat Card
// ============================================================
const StatCard = ({
  label, value, icon: Icon, gradient, color = "text-[#2a655f]"
}: {
  label: string;
  value: number | string;
  icon: any;
  gradient: string;
  color?: string;
}) => (
  <div className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f] shadow-sm hover:shadow-xl hover:shadow-[#2a655f]/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4">
    <div className="flex items-center justify-between relative">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate">{label}</p>
        <p className={cn("text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors truncate", color)}>
          {value}
        </p>
      </div>
      <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
        <div className={cn("h-6 w-6 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
      </div>
    </div>
    <div className="mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000 animate-shimmer", gradient)} style={{ width: "100%" }} />
    </div>
  </div>
);

// ============================================================
// ✅ Main Component
// ============================================================
export function AdminCustomers() {
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRTL = app.lang === 'ar';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOrders, setFilterOrders] = useState<"all" | "with_orders" | "no_orders">("all");
  const [isOpeningConversation, setIsOpeningConversation] = useState(false);

  const { data, isLoading, refetch } = useAllCustomers(page, limit);
  const getOrCreateConversation = useGetOrCreateConversation();
  
  const customers = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = data?.totalPages || 1;

  // ============================================================
  // ✅ إحصائيات عامة (كل العملاء وليس الصفحة الحالية فقط)
  // ============================================================
  const stats = useMemo(() => {
    const totalOrders = customers.reduce((sum, c) => sum + (c.orders_total || 0), 0);
    const completed = customers.reduce((sum, c) => sum + (c.orders_completed || 0), 0);
    const cancelled = customers.reduce((sum, c) => sum + (c.orders_cancelled || 0), 0);
    const withOrders = customers.filter(c => (c.orders_total || 0) > 0).length;
    
    return {
      total: totalCount,
      withOrders,
      totalOrders,
      completed,
      cancelled,
    };
  }, [customers, totalCount]);

  // ============================================================
  // ✅ فلترة محلية (بعد جلب البيانات)
  // ============================================================
  const filteredCustomers = useMemo(() => {
    let result = customers;

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c: any) => {
        const name = (c.full_name || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const address = (c.address_text || "").toLowerCase();
        const city = (c.city || "").toLowerCase();
        
        return name.includes(q) || phone.includes(q) || address.includes(q) || city.includes(q);
      });
    }

    // فلترة حسب الطلبات
    if (filterOrders === "with_orders") {
      result = result.filter((c: any) => (c.orders_total || 0) > 0);
    } else if (filterOrders === "no_orders") {
      result = result.filter((c: any) => (c.orders_total || 0) === 0);
    }

    return result;
  }, [customers, searchQuery, filterOrders]);

  // ============================================================
  // ✅ دوال الاتصال والمراسلة
  // ============================================================
  const handleCall = (phone: string) => {
    if (!phone) {
      toast.error(isRTL ? "لا يوجد رقم هاتف" : "No phone number");
      return;
    }
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const handleMessage = async (customerId: string, customerName: string) => {
    if (!customerId) {
      toast.error(isRTL ? "لا يوجد مستخدم" : "No user");
      return;
    }

    if (!app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }

    if (app.user.id === customerId) {
      toast.error(
        isRTL 
          ? "لا يمكنك مراسلة نفسك" 
          : "You can't message yourself"
      );
      return;
    }

    setIsOpeningConversation(true);

    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId: customerId,
      });

      navigate({
        to: "/messages/$userId",
        params: { userId: customerId },
        search: { cid: conversation.id },
        state: {
          fromAdmin: true,
          targetName: customerName,
          roleLabel: 'buyer',
        },
      });
    } catch (error: any) {
      console.error("❌ [AdminCustomers] Failed to open conversation:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
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
  };

  const handleWhatsApp = (phone: string) => {
    if (!phone) {
      toast.error(isRTL ? "لا يوجد رقم هاتف" : "No phone number");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const intlPhone = cleanPhone.startsWith("963") ? cleanPhone : `963${cleanPhone.replace(/^0/, "")}`;
    window.open(`https://wa.me/${intlPhone}`, "_blank");
  };

  // ============================================================
  // ✅ تصدير Excel
  // ============================================================
  const exportToExcel = () => {
    const exportData = filteredCustomers.map((c: any) => ({
      'الاسم': c.full_name || '—',
      'الهاتف': c.phone || '—',
      'العنوان': c.address_text || '—',
      'المدينة': c.city || '—',
      'المحافظة': c.governorate?.name_ar || '—',
      'تاريخ التسجيل': formatDate(c.created_at, 'ar'),
      'إجمالي الطلبات': c.orders_total || 0,
      'مكتملة': c.orders_completed || 0,
      'ملغية': c.orders_cancelled || 0,
      'قيد الانتظار': c.orders_pending || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'العملاء');
    ws['!cols'] = [
      { wch: 25 }, { wch: 18 }, { wch: 30 }, { wch: 15 },
      { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
      { wch: 12 }, { wch: 15 },
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `العملاء_${formatDateForFilename()}.xlsx`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  // ============================================================
  // ✅ تصدير Word
  // ============================================================
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; background: #f8fafc; }
          h1 { color: #2a655f; text-align: center; border-bottom: 3px solid #3a8a82; padding-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #3a8a82; }
          .stat-card .value { font-size: 22px; font-weight: bold; color: #2a655f; }
          .stat-card .label { font-size: 11px; color: #94a3b8; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th { background: #2a655f; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
          tr:hover { background: #f0fdf4; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <h1>👥 تقرير العملاء</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${formatDate(new Date(), 'ar')}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${stats.total}</div><div class="label">إجمالي العملاء</div></div>
          <div class="stat-card"><div class="value">${stats.withOrders}</div><div class="label">لديهم طلبات</div></div>
          <div class="stat-card"><div class="value">${stats.totalOrders}</div><div class="label">إجمالي الطلبات</div></div>
          <div class="stat-card"><div class="value">${stats.completed}</div><div class="label">طلبات مكتملة</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>الهاتف</th>
              <th>العنوان</th>
              <th>تاريخ التسجيل</th>
              <th>الطلبات</th>
              <th>مكتملة</th>
              <th>ملغية</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    filteredCustomers.forEach((c: any, index: number) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${c.full_name || '—'}</td>
          <td>${c.phone || '—'}</td>
          <td>${c.address_text || '—'}</td>
          <td>${formatDate(c.created_at, 'ar')}</td>
          <td>${c.orders_total || 0}</td>
          <td>${c.orders_completed || 0}</td>
          <td>${c.orders_cancelled || 0}</td>
        </tr>
      `;
    });
    
    htmlContent += `
          </tbody>
        </table>
        <div class="footer">إجمالي العملاء: ${totalCount} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `العملاء_${formatDateForFilename()}.doc`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================
  // ✅ Loading State
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
          {isRTL ? "⏳ جاري تحميل العملاء..." : "⏳ Loading customers..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent">
              {isRTL ? "👥 العملاء" : "👥 Customers"}
            </span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
              <Activity className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
              {isRTL ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <Users className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{totalCount}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? 'عميل' : 'customers'}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <ShoppingCart className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.totalOrders}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? 'طلب' : 'orders'}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border-2 border-[#2a655f]/30 dark:border-[#3a8a82]/20 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToExcel}
              disabled={filteredCustomers.length === 0}
              className="rounded-lg h-9 px-4 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 gap-2 transition-all duration-300"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Excel</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToWord}
              disabled={filteredCustomers.length === 0}
              className="rounded-lg h-9 px-4 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 gap-2 transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Word</span>
            </Button>
            <div className="w-px h-6 bg-slate-300/50" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg h-9 px-3 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30 animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            {isRTL ? 'عملاء حقيقيون' : 'Real Customers'}
          </Badge>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={isRTL ? '👥 إجمالي العملاء' : '👥 Total Customers'}
          value={stats.total}
          icon={Users}
          gradient="from-[#2a655f] to-[#3a8a82]"
        />
        <StatCard
          label={isRTL ? '🛒 لديهم طلبات' : '🛒 With Orders'}
          value={stats.withOrders}
          icon={ShoppingCart}
          gradient="from-[#3a8a82] to-[#4a9f95]"
        />
        <StatCard
          label={isRTL ? '✅ طلبات مكتملة' : '✅ Completed'}
          value={stats.completed}
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-500"
          color="text-emerald-600"
        />
        <StatCard
          label={isRTL ? '❌ طلبات ملغية' : '❌ Cancelled'}
          value={stats.cancelled}
          icon={XCircle}
          gradient="from-rose-500 to-red-600"
          color="text-rose-600"
        />
      </div>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 relative group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors`} />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isRTL ? "🔍 بحث بالاسم أو الهاتف أو العنوان..." : "🔍 Search by name, phone, or address..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#3a8a82]/20 bg-white dark:bg-[#1e293b] focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/30 transition-all`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2a655f]`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={filterOrders}
          onValueChange={(v: any) => { setFilterOrders(v); setPage(1); }}
        >
          <SelectTrigger className="h-10 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#3a8a82]/20 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#2a655f]" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">📋 {isRTL ? "جميع العملاء" : "All"}</SelectItem>
            <SelectItem value="with_orders">🛒 {isRTL ? "لديهم طلبات" : "With Orders"}</SelectItem>
            <SelectItem value="no_orders">👤 {isRTL ? "بدون طلبات" : "No Orders"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    {isRTL ? "العميل" : "Customer"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[130px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {isRTL ? "الهاتف" : "Phone"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[180px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {isRTL ? "العنوان" : "Address"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {isRTL ? "تاريخ التسجيل" : "Joined"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[180px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {isRTL ? "الطلبات" : "Orders"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[180px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 animate-pulse" />
                    {isRTL ? "إجراءات" : "Actions"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow">
                        <Users className="h-8 w-8 text-[#2a655f]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {isRTL ? "لا يوجد عملاء" : "No customers"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {searchQuery 
                          ? (isRTL ? `لا توجد نتائج لـ "${searchQuery}"` : `No results for "${searchQuery}"`)
                          : (isRTL ? "لم يسجل أي عميل بعد" : "No customers registered yet")
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((c: any) => (
                  <TableRow 
                    key={c.id}
                    className="border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-700/20 transition-colors border-b-2 border-slate-200/60 dark:border-slate-700/60"
                  >
                    {/* العميل */}
                    <TableCell className="border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-[#2a655f]/20 shrink-0">
                          <AvatarImage src={c.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs font-bold">
                            {(c.full_name || 'C').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {c.full_name || (isRTL ? 'بدون اسم' : 'No name')}
                          </p>
                          {c.governorate && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {c.governorate.name_ar}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* الهاتف */}
                    <TableCell dir="ltr" className="text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-1">
                        <Phone className="h-3 w-3 text-[#2a655f]" />
                        <span className="font-mono">
                          {c.phone || "—"}
                        </span>
                      </div>
                    </TableCell>

                    {/* العنوان */}
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="max-w-[180px] mx-auto">
                        <p className="truncate text-xs">
                          {c.address_text || (isRTL ? 'لا يوجد عنوان' : 'No address')}
                        </p>
                        {c.city && (
                          <p className="text-[10px] text-slate-400 truncate">{c.city}</p>
                        )}
                      </div>
                    </TableCell>

                    {/* تاريخ التسجيل */}
                    <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#2a655f]" />
                          <span className="text-xs">{formatDate(c.created_at, app.lang)}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* الطلبات */}
                    <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-[10px] px-1.5 py-0.5">
                          <ShoppingCart className="h-2.5 w-2.5 mr-1" />
                          {c.orders_total || 0}
                        </Badge>
                        {c.orders_completed > 0 && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] px-1.5 py-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                            {c.orders_completed}
                          </Badge>
                        )}
                        {c.orders_cancelled > 0 && (
                          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] px-1.5 py-0.5">
                            <XCircle className="h-2.5 w-2.5 mr-1" />
                            {c.orders_cancelled}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* إجراءات */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* زر مراسلة */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMessage(c.id, c.full_name || (isRTL ? 'عميل' : 'Customer'))}
                          disabled={isOpeningConversation || !c.id || c.id === app.user?.id}
                          className="rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/40 hover:text-[#2a655f] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            c.id === app.user?.id
                              ? (isRTL ? "هذا أنت" : "This is you")
                              : (isRTL ? "مراسلة" : "Message")
                          }
                        >
                          {isOpeningConversation ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <MessageCircle className="h-3.5 w-3.5 mr-1" />
                          )}
                          {isRTL ? "مراسلة" : "Message"}
                        </Button>

                        {/* زر واتساب */}
                        {c.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsApp(c.phone)}
                            className="rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300 hover:scale-105"
                            title={isRTL ? "واتساب" : "WhatsApp"}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {/* زر اتصال */}
                        {c.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCall(c.phone)}
                            className="rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:scale-105"
                            title={isRTL ? "اتصال" : "Call"}
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f] animate-pulse" />
                {isRTL
                  ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} من ${totalCount} عميل`
                  : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} of ${totalCount}`}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={cn(
                      "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all",
                      page === pageNum
                        ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105"
                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10"
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminCustomers;