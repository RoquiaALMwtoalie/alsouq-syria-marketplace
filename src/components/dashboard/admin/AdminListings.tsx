// src/components/dashboard/admin/AdminListings.tsx

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import {
  useAllListingsAdmin,
  useSetListingStatus,
  useAdminDeleteListing,
  useSetListingFeatured,
  useSendNotificationV2,
} from "@/lib/queries";
import { toast } from "sonner";
import { 
  CheckCircle2, XCircle, Clock, Trash2, Flame, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, Package, Store, DollarSign,
  Eye, Sparkles, Layers, Zap, Crown, Star, Gem,
  TrendingUp, Award, Shield, Rocket, Tags,
  Loader2, AlertTriangle, X, Send, MessageCircle
} from "lucide-react";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { cn } from "@/lib/utils";
const { saveAs } = fileSaver;

export function AdminListings() {
  const app = useApp();
  const [statusFilter, setStatusFilter] = useState<"pending" | "published" | "archived" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // ✅ State لـ Dialog الحذف
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  
  // ✅ State لـ Dialog سبب الرفض
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [productToReject, setProductToReject] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  
  const isRTL = app.lang === 'ar';

  // ✅ ===== استخدام React Query مع تحسينات =====
  const { 
    data: rows = [], 
    isLoading, 
    refetch,
    isRefetching 
  } = useAllListingsAdmin(statusFilter === "all" ? undefined : statusFilter);

  const setStatusMut = useSetListingStatus();
  const del = useAdminDeleteListing();
  const setFeatured = useSetListingFeatured();
  const sendNotification = useSendNotificationV2();

  // ✅ ===== فلترة حسب البحث =====
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase().trim();
    return rows.filter((r: any) => {
      const title = (isRTL ? r.title_ar : r.title_en) || "";
      const storeName = r.profiles?.store_name || r.profiles?.full_name || "";
      return title.toLowerCase().includes(q) || storeName.toLowerCase().includes(q);
    });
  }, [rows, searchQuery, isRTL]);

  // ✅ ===== Pagination =====
  const totalPages = Math.ceil(filteredRows.length / limit);
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, limit]);

  // ✅ ===== إحصائيات =====
  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r: any) => r.status === "pending").length;
    const published = rows.filter((r: any) => r.status === "published").length;
    const archived = rows.filter((r: any) => r.status === "archived").length;
    const featured = rows.filter((r: any) => r.is_featured === true).length;
    return { total, pending, published, archived, featured };
  }, [rows]);

  // ✅ ===== تغيير الصفحة والفلتر =====
  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const handleStatusFilterChange = useCallback((value: any) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  // ✅ ===== الموافقة على المنتج مع إشعار =====
  const handleApprove = useCallback(async (id: string) => {
    const toastId = toast.loading(isRTL ? "⏳ جاري الموافقة..." : "⏳ Approving...");
    
    try {
      // ✅ 1. جلب بيانات المنتج قبل التحديث
      const product = rows.find((r: any) => r.id === id);
      
      // ✅ 2. تحديث حالة المنتج
      await setStatusMut.mutateAsync({ id, status: "published" });
      await refetch();
      
      // ✅ 3. إرسال إشعار للمستخدم (صاحب المتجر)
      if (product?.owner_id) {
        await sendNotification.mutateAsync({
          userId: product.owner_id,
          type: "product_approved",
          titleAr: "✅ تمت الموافقة على منتجك",
          bodyAr: `تمت الموافقة على منتج "${product.title_ar}" وهو الآن متاح للبيع 🎉`,
        linkUrl: `/dashboard`, 
          imageUrl: product.cover_url || undefined,
          actions: [
            { label_ar: "عرض المنتج", url: `/listing/${product.id}` },
          ],
          metadata: {
            listing_id: product.id,
            listing_title: product.title_ar,
            status: "approved",
          },
        });
      }
      
      toast.success(isRTL ? "✅ تمت الموافقة على المنتج" : "✅ Product approved", {
        id: toastId,
      });
      
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error(isRTL ? "❌ فشل في الموافقة" : "❌ Failed to approve", {
        id: toastId,
      });
      await refetch();
    }
  }, [setStatusMut, refetch, sendNotification, rows, isRTL]);

  // ✅ ===== فتح Dialog سبب الرفض =====
  const openRejectDialog = useCallback((product: any) => {
    setProductToReject(product);
    setRejectReason("");
    setRejectDialogOpen(true);
  }, []);

  // ✅ ===== تنفيذ الرفض مع السبب وإشعار =====
  const handleConfirmReject = useCallback(async () => {
    if (!productToReject) return;
    
    // ✅ التحقق من وجود سبب
    if (!rejectReason.trim()) {
      toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a rejection reason");
      return;
    }
    
    setIsRejecting(true);
    const toastId = toast.loading(isRTL ? "⏳ جاري الرفض..." : "⏳ Rejecting...");
    
    try {
      // ✅ 1. تحديث حالة المنتج مع سبب الرفض
      await setStatusMut.mutateAsync({ 
        id: productToReject.id, 
        status: "draft",
        rejection_reason: rejectReason 
      });
      await refetch();
      
      // ✅ 2. إرسال إشعار للمستخدم مع سبب الرفض
      if (productToReject?.owner_id) {
        await sendNotification.mutateAsync({
          userId: productToReject.owner_id,
          type: "product_rejected",
          titleAr: "❌ تم رفض منتجك",
          bodyAr: `تم رفض منتج "${productToReject.title_ar}"\nالسبب: ${rejectReason}`,
          linkUrl: `/dashboard`,           // ✅ موجود
  imageUrl: productToReject.cover_url,      // ✅ موجود
          actions: [
            { label_ar: "مراجعة المنتج", url: "/dashboard/products" },
          ],
          metadata: {
            listing_id: productToReject.id,
            listing_title: productToReject.title_ar,
            status: "rejected",
            reason: rejectReason,
          },
        });
      }
      
      toast.success(isRTL ? "❌ تم رفض المنتج" : "❌ Product rejected", {
        id: toastId,
      });
      
      setRejectDialogOpen(false);
      setProductToReject(null);
      setRejectReason("");
      
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast.error(isRTL ? "❌ فشل في الرفض" : "❌ Failed to reject", {
        id: toastId,
      });
      await refetch();
    } finally {
      setIsRejecting(false);
    }
  }, [productToReject, rejectReason, setStatusMut, refetch, sendNotification, isRTL]);

  // ✅ ===== فتح Dialog الحذف =====
  const openDeleteDialog = useCallback((product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  // ✅ ===== تأكيد الحذف =====
  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    
    const toastId = toast.loading(isRTL ? "⏳ جاري الحذف..." : "⏳ Deleting...");
    
    try {
      await del.mutateAsync(productToDelete.id);
      await refetch();
      toast.success(isRTL ? "🗑️ تم حذف المنتج" : "🗑️ Product deleted", {
        id: toastId,
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(isRTL ? "❌ فشل في الحذف" : "❌ Failed to delete", {
        id: toastId,
      });
      await refetch();
    }
  }, [productToDelete, del, refetch, isRTL]);

  // ✅ ===== تفعيل/إلغاء الرائج =====
  const handleToggleFeatured = useCallback(async (id: string, currentFeatured: boolean) => {
    const toastId = toast.loading(isRTL ? "⏳ جاري التحديث..." : "⏳ Updating...");
    
    try {
      await setFeatured.mutateAsync({ id, is_featured: !currentFeatured });
      await refetch();
      
      toast.success(
        !currentFeatured
          ? isRTL ? "🔥 تمت إضافة المنتج للرائج" : "🔥 Product added to trending"
          : isRTL ? "✨ تمت إزالة المنتج من الرائج" : "✨ Product removed from trending",
        { id: toastId }
      );
      
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error(isRTL ? "❌ فشل في التحديث" : "❌ Failed to update", {
        id: toastId,
      });
      await refetch();
    }
  }, [setFeatured, refetch, isRTL]);

  // ✅ ===== تصدير إلى Excel =====
  const exportToExcel = useCallback(() => {
    const exportData = filteredRows.map((r: any) => ({
      'اسم المنتج': isRTL ? r.title_ar : (r.title_en || r.title_ar),
      'المتجر': r.profiles?.store_name || r.profiles?.full_name || '—',
      'السعر': `${r.price} ${r.currency}`,
      'التصنيف': r.categories?.[isRTL ? "name_ar" : "name_en"] || '—',
      'الحالة': r.status === 'pending' ? 'قيد المراجعة' : r.status === 'published' ? 'منشور' : 'مؤرشف',
      'رائج': r.is_featured ? 'نعم' : 'لا',
      'سبب الرفض': r.rejection_reason || '—',
      'تاريخ الإضافة': new Date(r.created_at).toLocaleDateString('ar-SA'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجات');
    ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 25 }, { wch: 20 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  }, [filteredRows, isRTL]);

  // ✅ ===== تصدير إلى Word =====
  const exportToWord = useCallback(() => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 20px; background: #f8fafc; }
        h1 { color: #0d2e2a; text-align: center; border-bottom: 3px solid #0d2e2a; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 20px 0; }
        .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #0d2e2a; }
        .stat-card .value { font-size: 22px; font-weight: bold; color: #0d2e2a; }
        .stat-card .label { font-size: 11px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #0d2e2a; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        tr:hover { background: #f1f5f9; }
        .status-pending { color: #2d6b63; font-weight: bold; }
        .status-published { color: #0d2e2a; font-weight: bold; }
        .status-archived { color: #6bb5aa; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .badge-featured { background: #2d6b63; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
      </style></head>
      <body>
        <h1>📊 تقرير المنتجات</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${stats.total}</div><div class="label">إجمالي المنتجات</div></div>
          <div class="stat-card"><div class="value">${stats.pending}</div><div class="label">قيد المراجعة</div></div>
          <div class="stat-card"><div class="value">${stats.published}</div><div class="label">منشور</div></div>
          <div class="stat-card"><div class="value">${stats.archived}</div><div class="label">مؤرشف</div></div>
          <div class="stat-card"><div class="value">${stats.featured}</div><div class="label">رائج</div></div>
        </div>
        <table><thead><tr><th>#</th><th>اسم المنتج</th><th>المتجر</th><th>السعر</th><th>الحالة</th><th>رائج</th><th>سبب الرفض</th></tr></thead><tbody>
    `;
    filteredRows.forEach((r: any, index: number) => {
      const statusClass = r.status === 'pending' ? 'status-pending' : r.status === 'published' ? 'status-published' : 'status-archived';
      const statusText = r.status === 'pending' ? 'قيد المراجعة' : r.status === 'published' ? 'منشور' : 'مؤرشف';
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${isRTL ? r.title_ar : (r.title_en || r.title_ar)}</td>
          <td>${r.profiles?.store_name || r.profiles?.full_name || '—'}</td>
          <td>${r.price} ${r.currency}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${r.is_featured ? '<span class="badge-featured">★ رائج</span>' : '—'}</td>
          <td>${r.rejection_reason || '—'}</td>
        </tr>
      `;
    });
    htmlContent += `
        </tbody></table>
        <div class="footer">إجمالي المنتجات: ${filteredRows.length} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  }, [filteredRows, stats, isRTL]);

  // ============================================================
  // ✅ التصميم
  // ============================================================

  return (
    <div className="space-y-5">
      
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
              <Package className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {isRTL ? "إدارة المنتجات" : "Products"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {isRTL ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {isRTL
              ? `إدارة جميع المنتجات (${filteredRows.length} من ${rows.length})`
              : `Manage all products (${filteredRows.length} of ${rows.length})`}
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="text-xs text-[#2d6b63] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isRTL ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-[#0d2e2a]/20 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToExcel}
              disabled={filteredRows.length === 0}
              className="rounded-lg h-9 px-4 text-[#2d6b63] hover:bg-[#2d6b63]/10 hover:text-[#2d6b63] gap-2 transition-all duration-300 hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Excel</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToWord}
              disabled={filteredRows.length === 0}
              className="rounded-lg h-9 px-4 text-[#1a4f4a] hover:bg-[#1a4f4a]/10 hover:text-[#1a4f4a] gap-2 transition-all duration-300 hover:scale-105"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Word</span>
            </Button>
            <div className="w-px h-6 bg-[#0d2e2a]/20" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="rounded-lg h-9 px-3 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
            </Button>
          </div>
          <Badge className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#0d2e2a]/30 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            {isRTL ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { 
            key: "total", 
            label: isRTL ? "إجمالي المنتجات" : "Total Products", 
            value: stats.total,
            icon: Package,
            gradient: "from-[#0d2e2a] to-[#1a4f4a]",
            bg: "bg-[#0d2e2a]/10",
            glow: "shadow-[#0d2e2a]/20",
          },
          { 
            key: "pending", 
            label: isRTL ? "قيد المراجعة" : "Pending", 
            value: stats.pending,
            icon: Clock,
            gradient: "from-[#1a4f4a] to-[#2d6b63]",
            bg: "bg-[#1a4f4a]/10",
            glow: "shadow-[#1a4f4a]/20",
          },
          { 
            key: "published", 
            label: isRTL ? "منشورة" : "Published", 
            value: stats.published,
            icon: CheckCircle2,
            gradient: "from-[#2d6b63] to-[#4a9f95]",
            bg: "bg-[#2d6b63]/10",
            glow: "shadow-[#2d6b63]/20",
          },
          { 
            key: "archived", 
            label: isRTL ? "مؤرشفة" : "Archived", 
            value: stats.archived,
            icon: XCircle,
            gradient: "from-[#4a9f95] to-[#6bb5aa]",
            bg: "bg-[#4a9f95]/10",
            glow: "shadow-[#4a9f95]/20",
          },
          { 
            key: "featured", 
            label: isRTL ? "رائجة" : "Featured", 
            value: stats.featured,
            icon: Flame,
            gradient: "from-[#0d2e2a] to-[#2d6b63]",
            bg: "bg-[#0d2e2a]/10",
            glow: "shadow-[#0d2e2a]/20",
          },
        ].map((stat) => (
          <div
            key={stat.key}
            className="group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-4 shadow-lg hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse`} />
            </div>
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${stat.glow}`}>
                <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-2 h-0.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`} 
                style={{ width: `${Math.min(100, (stat.value / (stats.total || 1)) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#0d2e2a] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={isRTL ? "🔍 بحث عن منتج..." : "🔍 Search products..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300`}
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] hover:border-[#0d2e2a]/40 transition-colors">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#0d2e2a]" />
              <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">⏳ {isRTL ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="published">✅ {isRTL ? "منشور" : "Published"}</SelectItem>
            <SelectItem value="archived">📦 {isRTL ? "مؤرشف" : "Archived"}</SelectItem>
            <SelectItem value="all">📋 {isRTL ? "الكل" : "All"}</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={String(limit)} 
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] hover:border-[#0d2e2a]/40 transition-colors">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0d2e2a]" />
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("pending");
            setPage(1);
          }}
          className="h-10 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 hover:scale-105"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {isRTL ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ✅ Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg shadow-[#0d2e2a]/5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-transparent bg-gradient-to-r from-[#0d2e2a]/5 to-[#1a4f4a]/5">
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-right min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5" />
                    {isRTL ? "المنتج" : "Product"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <Store className="h-3.5 w-3.5" />
                    {isRTL ? "المتجر" : "Store"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="h-3.5 w-3.5" />
                    {isRTL ? "السعر" : "Price"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[150px]">
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {isRTL ? "سبب الرفض" : "Rejection Reason"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[280px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 animate-pulse" />
                    {isRTL ? "إجراءات" : "Actions"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-[#0d2e2a]" />
                      <span className="text-slate-500">{isRTL ? "جار التحميل..." : "Loading..."}</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center animate-bounce-slow">
                        <Package className="h-8 w-8 text-[#0d2e2a]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {isRTL ? "لا توجد منتجات" : "No products"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isRTL ? "جميع المنتجات تمت مراجعتها" : "All products have been reviewed"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginatedRows.map((r: any) => {
                const isPending = r.status === "pending";
                const isPublished = r.status === "published";
                const isArchived = r.status === "archived";
                const isFeatured = r.is_featured === true;
                const isProcessing = setStatusMut.isPending;
                const hasRejectionReason = r.rejection_reason && r.rejection_reason.trim() !== "";
                
                return (
                  <TableRow 
                    key={r.id} 
                    className={cn(
                      "border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/10 transition-all duration-300 group",
                      isPending && "bg-amber-50/30 dark:bg-amber-950/10",
                      isArchived && hasRejectionReason && "bg-rose-50/10 dark:bg-rose-950/5"
                    )}
                  >
                    {/* ✅ عمود المنتج */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {r.cover_url ? (
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[#0d2e2a]/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={r.cover_url}
                              className="h-full w-full object-cover"
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-[#0d2e2a]/10 border border-[#0d2e2a]/20 flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-[#0d2e2a]/40" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#0d2e2a] transition-colors">
                            {isRTL ? r.title_ar : (r.title_en || r.title_ar)}
                            {isFeatured && (
                              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
                            )}
                            {isPending && (
                              <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-[8px] animate-pulse">
                                {isRTL ? "جديد" : "New"}
                              </Badge>
                            )}
                            {isArchived && hasRejectionReason && (
                              <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30 text-[8px]">
                                {isRTL ? "مرفوض" : "Rejected"}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] flex items-center gap-1">
                            <Tags className="h-3 w-3" />
                            {r.categories?.[isRTL ? "name_ar" : "name_en"] ?? "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* ✅ عمود المتجر */}
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Store className="h-3 w-3 text-[#2d6b63]" />
                        {r.profiles?.store_name || r.profiles?.full_name || "—"}
                      </div>
                    </TableCell>
                    
                    {/* ✅ عمود السعر */}
                    <TableCell className="font-bold text-[#0d2e2a] dark:text-[#4a9f95] text-center">
                      {formatPrice(r.price, r.currency, app.lang)}
                    </TableCell>
                    
                    {/* ✅ عمود الحالة */}
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          "border-0 font-medium px-3 py-1 transition-all duration-300",
                          isPending 
                            ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" 
                            : isPublished
                            ? "bg-[#2d6b63]/10 text-[#2d6b63] dark:bg-[#2d6b63]/20 dark:text-[#4a9f95]" 
                            : "bg-[#6bb5aa]/10 text-[#6bb5aa] dark:bg-[#6bb5aa]/20 dark:text-[#6bb5aa]"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {isPending && <Clock className="h-3 w-3 animate-spin-slow" />}
                          {isPublished && <CheckCircle2 className="h-3 w-3" />}
                          {isArchived && <XCircle className="h-3 w-3" />}
                          {isPending ? (isRTL ? "قيد المراجعة" : "Pending") :
                           isPublished ? (isRTL ? "منشور" : "Published") :
                           (isRTL ? "مؤرشف" : "Archived")}
                        </span>
                      </Badge>
                    </TableCell>
                    
                    {/* ✅ عمود سبب الرفض */}
                    <TableCell className="text-center">
                      {isArchived && hasRejectionReason ? (
                        <div className="flex items-center gap-1.5 justify-center group/reason">
                          <AlertTriangle className="h-3 w-3 text-rose-400 animate-pulse" />
                          <span className="text-xs text-rose-600 dark:text-rose-400 max-w-[120px] truncate cursor-help group-hover/reason:max-w-[200px] group-hover/reason:whitespace-normal transition-all duration-300">
                            {r.rejection_reason}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    
                    {/* ✅ عمود الإجراءات */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* ✅ زر Trending */}
                        <Button
                          size="sm"
                          className={cn(
                            "rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105",
                            isFeatured
                              ? "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30"
                              : "border border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40"
                          )}
                          onClick={() => handleToggleFeatured(r.id, isFeatured)}
                          disabled={setFeatured.isPending}
                          title={isRTL ? "الأكثر رواجاً" : "Trending"}
                        >
                          {setFeatured.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <Flame className={cn("h-3.5 w-3.5 mr-1", isFeatured ? "animate-pulse" : "")} />
                          )}
                          {isRTL ? "رائج" : "Trend"}
                        </Button>

                        {/* ✅ زر Approve - يظهر فقط للمنتجات المعلقة */}
                        {isPending && (
                          <Button
                            size="sm"
                            className="rounded-xl h-8 px-3 bg-gradient-to-r from-[#2d6b63] to-[#4a9f95] hover:from-[#4a9f95] hover:to-[#6bb5aa] text-white shadow-lg shadow-[#2d6b63]/30 transition-all duration-300 hover:scale-105"
                            onClick={() => handleApprove(r.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            )}
                            {isRTL ? "موافقة" : "Approve"}
                          </Button>
                        )}

                        {/* ✅ زر Reject - يظهر فقط للمنتجات المعلقة */}
                        {isPending && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8 px-3 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all duration-300 hover:scale-105"
                            onClick={() => openRejectDialog(r)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                            )}
                            {isRTL ? "رفض" : "Reject"}
                          </Button>
                        )}

                        {/* ✅ زر Delete - يظهر للجميع (حذف مباشر) */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300 hover:scale-105"
                          onClick={() => openDeleteDialog(r)}
                          disabled={del.isPending}
                        >
                          {del.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredRows.length === 0 ? (
                <span>{isRTL ? "لا توجد منتجات" : "No products"}</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d6b63] animate-pulse" />
                  {isRTL
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredRows.length)} من ${filteredRows.length} منتج`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredRows.length)} of ${filteredRows.length} products`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 disabled:opacity-50"
                title={isRTL ? "الصفحة الأولى" : "First page"}
              >
                <span className="text-xs font-bold">«</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 disabled:opacity-50"
                title={isRTL ? "السابق" : "Previous"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={cn(
                        "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                        page === pageNum
                          ? "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30 scale-105"
                          : "border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 hover:scale-105"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {totalPages > 5 && page < totalPages - 2 && (
                  <>
                    <span className="text-slate-400 text-sm px-1">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(totalPages)}
                      className="h-8 min-w-[32px] p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 text-xs transition-all duration-300 hover:scale-105"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 disabled:opacity-50"
                title={isRTL ? "التالي" : "Next"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 disabled:opacity-50"
                title={isRTL ? "الصفحة الأخيرة" : "Last page"}
              >
                <span className="text-xs font-bold">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Footer */}
        <div className="px-4 py-2 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20">
              {isRTL
                ? `عرض ${paginatedRows.length} من ${filteredRows.length}`
                : `Showing ${paginatedRows.length} of ${filteredRows.length}`}
            </Badge>
            <span className="text-[10px] text-[#2d6b63]">
              {isRTL ? `إجمالي ${rows.length}` : `Total ${rows.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#0d2e2a]/5 text-[#0d2e2a] border border-[#0d2e2a]/20">
              <Shield className="h-3 w-3 mr-1" />
              {statusFilter === "pending" && (isRTL ? "قيد المراجعة" : "Pending")}
              {statusFilter === "published" && (isRTL ? "منشور" : "Published")}
              {statusFilter === "archived" && (isRTL ? "مؤرشف" : "Archived")}
              {statusFilter === "all" && (isRTL ? "الكل" : "All")}
            </Badge>
            {searchQuery && (
              <Badge className="bg-[#1a4f4a]/10 text-[#1a4f4a] border border-[#1a4f4a]/20">
                <Search className="h-3 w-3 mr-1" />
                {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
      // ✅ DIALOG: سبب الرفض (Reject Reason)
      // ============================================================ */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#0d2e2a]/10 z-20 transition-all duration-300 hover:scale-110"
            onClick={() => setRejectDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#0d2e2a]" />
          </Button>

          <DialogHeader>
            <div className="flex items-start gap-4 mb-2">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRTL ? "رفض المنتج" : "Reject Product"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                  {isRTL
                    ? `يرجى كتابة سبب رفض المنتج "${productToReject?.title_ar}"`
                    : `Please provide a reason for rejecting "${productToReject?.title_en || productToReject?.title_ar}"`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            {/* ✅ معلومات المنتج */}
            {productToReject && (
              <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl mb-4">
                {productToReject.cover_url ? (
                  <img
                    src={productToReject.cover_url}
                    alt={productToReject.title_ar}
                    className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-[#0d2e2a]/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-[#0d2e2a]/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {productToReject.title_ar}
                  </p>
                  <p className="text-xs text-slate-500">
                    {productToReject.profiles?.store_name || productToReject.profiles?.full_name || "—"}
                  </p>
                </div>
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  {formatPrice(productToReject.price, productToReject.currency, app.lang)}
                </Badge>
              </div>
            )}

            {/* ✅ حقل سبب الرفض */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0d2e2a] flex items-center gap-1">
                {isRTL ? "سبب الرفض" : "Rejection Reason"}
                <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={isRTL 
                  ? "✍️ اكتب سبب الرفض هنا (سيظهر للمستخدم)" 
                  : "✍️ Write the rejection reason here (will be shown to the user)"}
                rows={4}
                className={cn(
                  "rounded-xl resize-none border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300",
                  !rejectReason.trim() && rejectDialogOpen ? "border-rose-500/50 focus-visible:ring-rose-500/20" : ""
                )}
              />
              {!rejectReason.trim() && rejectDialogOpen && (
                <p className="text-xs text-rose-500 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  {isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a rejection reason"}
                </p>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {isRTL 
                  ? "💡 هذا السبب سيظهر للمستخدم في الإشعار" 
                  : "💡 This reason will be shown to the user in the notification"}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="flex-1 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={isRejecting || !rejectReason.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isRejecting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRTL ? "جاري الرفض..." : "Rejecting..."}
                </span>
              ) : (
                <>
                  <XCircle className="h-4 w-4 me-2" />
                  {isRTL ? "تأكيد الرفض" : "Confirm Reject"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DELETE CONFIRMATION DIALOG
      // ============================================================ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#0d2e2a]/10 z-20 transition-all duration-300 hover:scale-110"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#0d2e2a]" />
          </Button>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isRTL ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border border-rose-200/50 dark:border-rose-800/30 mb-4">
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {isRTL
                  ? `هل أنت متأكد من حذف المنتج "${productToDelete?.title_ar}"؟`
                  : `Are you sure you want to delete "${productToDelete?.title_en || productToDelete?.title_ar}"?`}
              </p>
              {productToDelete && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-rose-200/50 dark:border-rose-800/30">
                  {productToDelete.cover_url ? (
                    <img
                      src={productToDelete.cover_url}
                      alt={productToDelete.title_ar}
                      className="h-12 w-12 rounded-lg object-cover border border-rose-200/30 dark:border-rose-800/30"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-rose-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {productToDelete.title_ar}
                    </p>
                    <p className="text-xs text-slate-400">
                      {productToDelete.profiles?.store_name || productToDelete.profiles?.full_name || "—"}
                    </p>
                  </div>
                  <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">
                    {formatPrice(productToDelete.price, productToDelete.currency, app.lang)}
                  </Badge>
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/50 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {isRTL
                  ? "تحذير: حذف هذا المنتج سيؤثر على الطلبات المرتبطة به"
                  : "Warning: Deleting this product will affect associated orders"}
              </p>
            </div>

            <DialogFooter className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRTL ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 me-2" />
                    {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminListings;