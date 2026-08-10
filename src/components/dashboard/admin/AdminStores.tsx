// src/components/dashboard/admin/AdminStores.tsx

import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp, useT } from "@/lib/i18n";
import { useAdminAllStores, useSetStoreActive, useSetStoreFeatured } from "@/lib/queries";
import { toast } from "sonner";
import { 
  CheckCircle2, XCircle, Flame, Store, Eye, 
  Search, Filter, ChevronDown, RefreshCw,
  Store as StoreIcon, Users, Package, TrendingUp,
  FileSpreadsheet, FileText, ChevronLeft, ChevronRight,
  Zap, Sparkles, Shield, Crown, Star, Gem, Layers,
  DollarSign, Clock, Award, Rocket, Trash2, Loader2,
  AlertTriangle, X, CheckCircle2 as CheckCircle2Icon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { cn } from "@/lib/utils";
const { saveAs } = fileSaver;

// ✅ ✅ ✅ دوال إضافية للحذف (نضيفها مؤقتاً هنا، لكن الأفضل نقلها لـ queries.ts)
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ✅ Hook: حذف متجر من لوحة الأدمن
function useAdminDeleteStore() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log(`🗑️ [Admin] Deleting store for user: ${userId}`);
      
      // ✅ 1. حذف المنتجات (مع CASCADE)
      const { error: listingsError } = await supabase
        .from("listings")
        .delete()
        .eq("owner_id", userId);

      if (listingsError) {
        console.error("❌ Error deleting listings:", listingsError);
        throw new Error(`Failed to delete listings: ${listingsError.message}`);
      }

      // ✅ 2. حذف طلبات فتح المتجر
      const { error: appsError } = await supabase
        .from("seller_applications")
        .delete()
        .eq("user_id", userId);

      if (appsError) {
        console.warn(`⚠️ Error deleting seller applications:`, appsError);
      }

      // ✅ 3. حذف متابعي المتجر
      const { error: followersError } = await supabase
        .from("store_followers")
        .delete()
        .eq("store_id", userId);

      if (followersError) {
        console.warn(`⚠️ Error deleting store followers:`, followersError);
      }

      // ✅ 4. تنظيف بيانات المتجر من جدول profiles
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

      // ✅ 5. حذف دور seller
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "seller");

      if (roleError) {
        console.warn(`⚠️ Error removing seller role:`, roleError);
      }

      // ✅ 6. إرسال إشعار للمستخدم
      try {
        await supabase.from("notifications").insert({
          user_id: userId,
          type: "store_deleted_by_admin",
          title_ar: "🗑️ تم حذف متجرك من قبل الإدارة",
          body_ar: "تم حذف متجرك وجميع بياناته من قبل فريق الإدارة",
          title_en: "🗑️ Your store has been deleted by admin",
          body_en: "Your store and all its data have been deleted by the admin team",
          link_url: "/dashboard",
          metadata: {
            deleted_by: "admin",
            deleted_at: new Date().toISOString(),
          },
        });
      } catch (notifError) {
        console.warn(`⚠️ Error sending notification:`, notifError);
      }

      console.log(`✅ Store deletion completed successfully!`);
      return { success: true, userId };
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
      qc.invalidateQueries({ queryKey: ["stores"] });
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      qc.invalidateQueries({ queryKey: ["myListings"] });
      qc.invalidateQueries({ queryKey: ["mySellerApplication"] });
      
      toast.success("🗑️ تم حذف المتجر وجميع بياناته بنجاح", { duration: 4000 });
    },
    onError: (error: Error) => {
      console.error("❌ AdminDeleteStore error:", error);
      toast.error(`❌ فشل حذف المتجر: ${error.message}`, { duration: 4000 });
    },
  });
}

// ✅ Hook: جلب إحصائيات المتجر
function useAdminStoreStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "store-stats", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      
      // ✅ عدد المنتجات
      const { count: products, error: productsError } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId);
      
      if (productsError) {
        console.error("❌ Error counting products:", productsError);
      }

      // ✅ عدد الطلبات
      const { count: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
      
      if (ordersError) {
        console.error("❌ Error counting orders:", ordersError);
      }

      // ✅ عدد المفضلات
      const { count: favorites, error: favoritesError } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      if (favoritesError) {
        console.error("❌ Error counting favorites:", favoritesError);
      }

      // ✅ عدد التقييمات
      const { count: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      if (reviewsError) {
        console.error("❌ Error counting reviews:", reviewsError);
      }

      // ✅ عدد الرسائل
      const { count: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
      
      if (messagesError) {
        console.error("❌ Error counting messages:", messagesError);
      }

      return {
        products: products || 0,
        orders: orders || 0,
        favorites: favorites || 0,
        reviews: reviews || 0,
        messages: messages || 0,
      };
    },
    staleTime: 1000 * 30,
  });
}

export function AdminStores() {
  const app = useApp();
  const { data: stores = [], isLoading, refetch } = useAdminAllStores();
  const setActive = useSetStoreActive();
  const setFeatured = useSetStoreFeatured();
  const deleteStore = useAdminDeleteStore();

  const isRTL = app.lang === 'ar';

  // ✅ State للبحث والفلترة والـ Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "banned" | "featured">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ✅ State لنافذة حذف المتجر
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [confirmStoreName, setConfirmStoreName] = useState("");

  // ✅ جلب إحصائيات المتجر المحدد
  const { data: storeStats, isLoading: statsLoading } = useAdminStoreStats(
    selectedStore?.id
  );

  // ✅ فلترة المتاجر
  const filteredStores = useMemo(() => {
    let result = stores;

    if (filterStatus === "active") {
      result = result.filter((s: any) => s.store_active !== false);
    } else if (filterStatus === "banned") {
      result = result.filter((s: any) => s.store_active === false);
    } else if (filterStatus === "featured") {
      result = result.filter((s: any) => s.is_featured === true);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s: any) => {
        return (
          s.store_name?.toLowerCase().includes(q) ||
          s.full_name?.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.store_description?.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [stores, searchQuery, filterStatus]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredStores.length / limit);
  const paginatedStores = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredStores.slice(start, end);
  }, [filteredStores, page, limit]);

  // ✅ إحصائيات
  const stats = {
    total: stores.length,
    active: stores.filter((s: any) => s.store_active !== false).length,
    banned: stores.filter((s: any) => s.store_active === false).length,
    featured: stores.filter((s: any) => s.is_featured === true).length,
  };

  // ✅ تغيير الصفحة
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ فتح نافذة حذف المتجر
  const openDeleteDialog = (store: any) => {
    setSelectedStore(store);
    setConfirmStoreName("");
    setDeleteDialogOpen(true);
  };

  // ✅ تنفيذ حذف المتجر
  const handleDeleteStore = async () => {
    if (!selectedStore) return;
    
    if (confirmStoreName !== selectedStore.store_name) {
      toast.error(
        isRTL 
          ? "⚠️ الاسم الذي أدخلته غير مطابق لاسم المتجر" 
          : "⚠️ The name you entered does not match the store name"
      );
      return;
    }

    await deleteStore.mutateAsync(selectedStore.id);
    setDeleteDialogOpen(false);
    setSelectedStore(null);
    setConfirmStoreName("");
    refetch();
  };

  // ✅ تصدير إلى Excel
  const exportToExcel = () => {
    const exportData = filteredStores.map((s: any) => ({
      'اسم المتجر': s.store_name || s.full_name || '—',
      'المالك': s.full_name || '—',
      'الهاتف': s.phone || '—',
      'عدد المنتجات': s.listing_count || 0,
      'الحالة': s.store_active === false ? 'محظور' : 'نشط',
      'رائج': s.is_featured ? 'نعم' : 'لا',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المتاجر');
    ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `المتاجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  // ✅ تصدير إلى Word
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 20px; background: #f8fafc; }
        h1 { color: #0d2e2a; text-align: center; border-bottom: 3px solid #0d2e2a; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
        .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #0d2e2a; }
        .stat-card .value { font-size: 22px; font-weight: bold; color: #0d2e2a; }
        .stat-card .label { font-size: 11px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #0d2e2a; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        tr:hover { background: #f1f5f9; }
        .status-active { color: #0d2e2a; font-weight: bold; }
        .status-banned { color: #6bb5aa; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .badge-featured { background: #2d6b63; color: white; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
      </style></head>
      <body>
        <h1>🏪 تقرير المتاجر</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${stats.total}</div><div class="label">إجمالي المتاجر</div></div>
          <div class="stat-card"><div class="value">${stats.active}</div><div class="label">نشط</div></div>
          <div class="stat-card"><div class="value">${stats.banned}</div><div class="label">محظور</div></div>
          <div class="stat-card"><div class="value">${stats.featured}</div><div class="label">رائج</div></div>
        </div>
        <table><thead><tr><th>#</th><th>اسم المتجر</th><th>المالك</th><th>الهاتف</th><th>المنتجات</th><th>الحالة</th><th>رائج</th></tr></thead><tbody>
    `;
    filteredStores.forEach((s: any, index: number) => {
      const statusClass = s.store_active === false ? 'status-banned' : 'status-active';
      const statusText = s.store_active === false ? 'محظور' : 'نشط';
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${s.store_name || s.full_name || '—'}</td>
          <td>${s.full_name || '—'}</td>
          <td>${s.phone || '—'}</td>
          <td>${s.listing_count || 0}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${s.is_featured ? '<span class="badge-featured">★ رائج</span>' : '—'}</td>
        </tr>
      `;
    });
    htmlContent += `
        </tbody></table>
        <div class="footer">إجمالي المتاجر: ${filteredStores.length} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المتاجر_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  return (
    <div className="space-y-5">
      
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
              <StoreIcon className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {app.lang === "ar" ? "المتاجر" : "Stores"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {app.lang === 'ar' ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {app.lang === "ar"
              ? `إدارة جميع المتاجر (${filteredStores.length} من ${stores.length})`
              : `Manage all stores (${filteredStores.length} of ${stores.length})`}
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="text-xs text-[#2d6b63] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {app.lang === 'ar' ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        {/* ✅ أزرار التصدير */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-[#0d2e2a]/20 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToExcel}
              disabled={filteredStores.length === 0}
              className="rounded-lg h-9 px-4 text-[#2d6b63] hover:bg-[#2d6b63]/10 hover:text-[#2d6b63] gap-2 transition-all duration-300 hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Excel</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToWord}
              disabled={filteredStores.length === 0}
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
              className="rounded-lg h-9 px-3 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
            </Button>
          </div>
          <Badge className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#0d2e2a]/30 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            {app.lang === 'ar' ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ✅ Stats Cards - بألوان النظام */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { 
            key: "total", 
            label: app.lang === "ar" ? "إجمالي المتاجر" : "Total Stores", 
            value: stats.total,
            icon: StoreIcon,
            gradient: "from-[#0d2e2a] to-[#1a4f4a]",
            bg: "bg-[#0d2e2a]/10",
            glow: "shadow-[#0d2e2a]/20",
          },
          { 
            key: "active", 
            label: app.lang === "ar" ? "نشطة" : "Active", 
            value: stats.active,
            icon: CheckCircle2,
            gradient: "from-[#2d6b63] to-[#4a9f95]",
            bg: "bg-[#2d6b63]/10",
            glow: "shadow-[#2d6b63]/20",
          },
          { 
            key: "banned", 
            label: app.lang === "ar" ? "محظورة" : "Banned", 
            value: stats.banned,
            icon: XCircle,
            gradient: "from-[#4a9f95] to-[#6bb5aa]",
            bg: "bg-[#4a9f95]/10",
            glow: "shadow-[#4a9f95]/20",
          },
          { 
            key: "featured", 
            label: app.lang === "ar" ? "رائجة" : "Featured", 
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "🔍 بحث عن متجر..." : "🔍 Search stores..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300`}
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => {
            setFilterStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] hover:border-[#0d2e2a]/40 transition-colors">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#0d2e2a]" />
              <SelectValue placeholder={app.lang === "ar" ? "جميع المتاجر" : "All stores"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "📋 جميع المتاجر" : "📋 All stores"}</SelectItem>
            <SelectItem value="active">{app.lang === "ar" ? "✅ نشطة فقط" : "✅ Active only"}</SelectItem>
            <SelectItem value="banned">{app.lang === "ar" ? "🚫 محظورة فقط" : "🚫 Banned only"}</SelectItem>
            <SelectItem value="featured">{app.lang === "ar" ? "🔥 رائجة فقط" : "🔥 Featured only"}</SelectItem>
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
            setFilterStatus("all");
            setPage(1);
          }}
          className="h-10 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 hover:scale-105"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
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
                    <StoreIcon className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "المتجر" : "Store"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "المالك" : "Owner"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-2">
                    <Package className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "المنتجات" : "Products"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[380px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 animate-pulse" />
                    {app.lang === "ar" ? "إجراءات" : "Actions"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && paginatedStores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center animate-bounce-slow">
                        <StoreIcon className="h-8 w-8 text-[#0d2e2a]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {app.lang === "ar" ? "لا توجد متاجر" : "No stores"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {app.lang === "ar" ? "لا توجد متاجر تطابق البحث" : "No stores match your search"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterStatus("all");
                        }}
                        className="mt-2 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300"
                      >
                        {app.lang === "ar" ? "مسح البحث" : "Clear search"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginatedStores.map((s: any, index: number) => (
                <TableRow 
                  key={s.id} 
                  className="border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {s.store_logo_url ? (
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#0d2e2a]/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={s.store_logo_url}
                            className="h-full w-full object-cover"
                            alt=""
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-xl bg-[#0d2e2a]/10 border border-[#0d2e2a]/20 flex items-center justify-center flex-shrink-0">
                          <StoreIcon className="h-5 w-5 text-[#0d2e2a]/40" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#0d2e2a] transition-colors">
                          <Link
                            to="/store/$id"
                            params={{ id: s.id }}
                            className="hover:text-[#2d6b63] transition-colors truncate"
                          >
                            {s.store_name || s.full_name || "—"}
                          </Link>
                          {s.is_featured && (
                            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                          {s.store_description || s.full_name || ""}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Link
                            to="/store/$id"
                            params={{ id: s.id }}
                            className="text-[10px] text-[#2d6b63] hover:underline flex items-center gap-0.5 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            {app.lang === "ar" ? "عرض المتجر" : "View store"}
                          </Link>
                          <span className="text-[#0d2e2a]/20">|</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Users className="h-3 w-3" />
                            {s.full_name || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3 text-[#2d6b63]" />
                      {s.full_name || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-white text-center">
                    <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 font-mono">
                      {s.listing_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {s.store_active === false ? (
                      <Badge className="bg-[#6bb5aa]/10 text-[#6bb5aa] border border-[#6bb5aa]/20">
                        <XCircle className="h-3 w-3 mr-1" />
                        {app.lang === "ar" ? "محظور" : "Banned"}
                      </Badge>
                    ) : (
                      <Badge className="bg-[#2d6b63]/10 text-[#2d6b63] border border-[#2d6b63]/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {app.lang === "ar" ? "نشط" : "Active"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      
                      {/* ✅ زر Featured - رائج */}
                      <Button
                        size="sm"
                        className={cn(
                          "rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105",
                          s.is_featured
                            ? "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30"
                            : "border border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40"
                        )}
                        onClick={() =>
                          setFeatured.mutate(
                            { id: s.id, is_featured: !s.is_featured },
                            {
                              onSuccess: () =>
                                toast.success(
                                  app.lang === "ar"
                                    ? s.is_featured
                                      ? "✨ أُزيل من الرائج"
                                      : "🔥 أُضيف للرائج"
                                    : s.is_featured
                                    ? "✨ Removed from trending"
                                    : "🔥 Added to trending"
                                ),
                            }
                          )
                        }
                        title={app.lang === "ar" ? "الأكثر رواجاً" : "Trending"}
                      >
                        <Flame className={cn(
                          "h-3.5 w-3.5 mr-1",
                          s.is_featured ? "animate-pulse" : ""
                        )} />
                        {app.lang === "ar" ? "رائج" : "Trend"}
                      </Button>

                      {/* ✅ زر Ban/Unban */}
                      {s.store_active === false ? (
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-3 bg-gradient-to-r from-[#2d6b63] to-[#4a9f95] hover:from-[#4a9f95] hover:to-[#6bb5aa] text-white shadow-lg shadow-[#2d6b63]/30 transition-all duration-300 hover:scale-105"
                          onClick={() =>
                            setActive.mutate(
                              { id: s.id, active: true },
                              {
                                onSuccess: () =>
                                  toast.success(
                                    app.lang === "ar" ? "✅ تم التفعيل" : "✅ Activated"
                                  ),
                              }
                            )
                          }
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          {app.lang === "ar" ? "تفعيل" : "Unban"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8 px-3 border-[#6bb5aa]/30 text-[#6bb5aa] hover:bg-[#6bb5aa]/10 hover:border-[#6bb5aa]/50 transition-all duration-300 hover:scale-105"
                          onClick={() => {
                            if (
                              confirm(
                                app.lang === "ar"
                                  ? "⚠️ هل أنت متأكد من حظر هذا المتجر؟"
                                  : "⚠️ Are you sure you want to ban this store?"
                              )
                            )
                              setActive.mutate(
                                { id: s.id, active: false },
                                {
                                  onSuccess: () =>
                                    toast.success(
                                      app.lang === "ar" ? "🚫 تم الحظر" : "🚫 Banned"
                                    ),
                                }
                              );
                          }}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          {app.lang === "ar" ? "حظر" : "Ban"}
                        </Button>
                      )}

                      {/* ✅ ✅ ✅ زر حذف المتجر (جديد) */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl h-8 px-3 border-red-300/50 text-red-500 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 hover:scale-105"
                        onClick={() => openDeleteDialog(s)}
                        title={isRTL ? "حذف المتجر نهائياً" : "Permanently delete store"}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {isRTL ? "حذف" : "Delete"}
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredStores.length === 0 ? (
                <span>{app.lang === "ar" ? "لا توجد متاجر" : "No stores"}</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d6b63] animate-pulse" />
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredStores.length)} من ${filteredStores.length} متجر`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredStores.length)} of ${filteredStores.length} stores`}
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
              >
                <span className="text-xs font-bold">«</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 disabled:opacity-50"
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
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 disabled:opacity-50"
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
              {app.lang === "ar"
                ? `عرض ${paginatedStores.length} من ${filteredStores.length}`
                : `Showing ${paginatedStores.length} of ${filteredStores.length}`}
            </Badge>
            <span className="text-[10px] text-[#2d6b63]">
              {app.lang === "ar" ? `إجمالي ${stores.length}` : `Total ${stores.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#0d2e2a]/5 text-[#0d2e2a] border border-[#0d2e2a]/20">
              <Shield className="h-3 w-3 mr-1" />
              {filterStatus === "all" && (app.lang === "ar" ? "جميع" : "All")}
              {filterStatus === "active" && (app.lang === "ar" ? "نشطة" : "Active")}
              {filterStatus === "banned" && (app.lang === "ar" ? "محظورة" : "Banned")}
              {filterStatus === "featured" && (app.lang === "ar" ? "رائجة" : "Featured")}
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

      {/* ✅ ✅ ✅ نافذة حذف المتجر */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl border-red-200/50 dark:border-red-800/30 shadow-2xl shadow-red-500/20 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-bounce">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {isRTL ? "⚠️ تأكيد حذف المتجر" : "⚠️ Confirm Store Deletion"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {isRTL
                ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المتجر نهائياً."
                : "This action cannot be undone. All store data will be permanently deleted."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="p-6 space-y-4">
              {/* ✅ معلومات المتجر */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <StoreIcon className="h-4 w-4 text-[#2a655f]" />
                    {isRTL ? "اسم المتجر" : "Store Name"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedStore?.store_name || selectedStore?.full_name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#2a655f]" />
                    {isRTL ? "المالك" : "Owner"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedStore?.full_name || "—"}
                  </span>
                </div>
              </div>

              {/* ✅ إحصاءات البيانات المرتبطة */}
              {storeStats && !statsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-3 border border-red-200/30 dark:border-red-800/30">
                    <p className="text-xs text-red-600/70 dark:text-red-400/70">📦 {isRTL ? "منتجات" : "Products"}</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-400">{storeStats.products}</p>
                  </div>
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/30 dark:border-amber-800/30">
                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">🛒 {isRTL ? "طلبات" : "Orders"}</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{storeStats.orders}</p>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-200/30 dark:border-blue-800/30">
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">💬 {isRTL ? "رسائل" : "Messages"}</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{storeStats.messages}</p>
                  </div>
                  <div className="bg-pink-50/50 dark:bg-pink-950/20 rounded-xl p-3 border border-pink-200/30 dark:border-pink-800/30">
                    <p className="text-xs text-pink-600/70 dark:text-pink-400/70">❤️ {isRTL ? "مفضلات" : "Favorites"}</p>
                    <p className="text-xl font-bold text-pink-700 dark:text-pink-400">{storeStats.favorites}</p>
                  </div>
                  <div className="bg-green-50/50 dark:bg-green-950/20 rounded-xl p-3 border border-green-200/30 dark:border-green-800/30">
                    <p className="text-xs text-green-600/70 dark:text-green-400/70">⭐ {isRTL ? "تقييمات" : "Reviews"}</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{storeStats.reviews}</p>
                  </div>
                  <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-3 border border-purple-200/30 dark:border-purple-800/30">
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70">📊 {isRTL ? "إجمالي" : "Total"}</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                      {storeStats.products + storeStats.orders + storeStats.messages + storeStats.favorites + storeStats.reviews}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
                </div>
              )}

              {/* ✅ تحذير إضافي */}
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border-2 border-red-200/50 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      {isRTL
                        ? "⚠️ هذا الإجراء سيحذف جميع بيانات المتجر نهائياً"
                        : "⚠️ This will permanently delete all store data"}
                    </p>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                      {isRTL
                        ? "بما في ذلك المنتجات والطلبات والمفضلات والتقييمات والرسائل"
                        : "Including products, orders, favorites, reviews, and messages"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ حقل تأكيد الاسم */}
              <div className="bg-red-50/30 dark:bg-red-950/10 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30">
                <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  {isRTL
                    ? `✍️ اكتب اسم المتجر "${selectedStore?.store_name}" لتأكيد الحذف`
                    : `✍️ Type the store name "${selectedStore?.store_name}" to confirm deletion`}
                </label>
                <Input
                  value={confirmStoreName}
                  onChange={(e) => setConfirmStoreName(e.target.value)}
                  placeholder={isRTL ? "أدخل اسم المتجر هنا..." : "Enter store name here..."}
                  className={cn(
                    "rounded-xl border-red-200/50 dark:border-red-800/50 focus:border-red-500 focus:ring-red-500/20",
                    confirmStoreName && confirmStoreName !== selectedStore?.store_name && "border-red-500 focus:border-red-500"
                  )}
                />
                {confirmStoreName && confirmStoreName !== selectedStore?.store_name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {isRTL ? "الاسم غير مطابق" : "Name does not match"}
                  </p>
                )}
                {confirmStoreName === selectedStore?.store_name && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircle2Icon className="h-3 w-3" />
                    {isRTL ? "✓ الاسم مطابق، يمكنك الحذف" : "✓ Name matches, you can delete"}
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-0 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfirmStoreName("");
                setSelectedStore(null);
              }}
              className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 h-12"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleDeleteStore}
              disabled={
                deleteStore.isPending ||
                confirmStoreName !== selectedStore?.store_name
              }
              className={cn(
                "flex-1 rounded-xl text-white shadow-lg transition-all duration-300 h-12",
                confirmStoreName === selectedStore?.store_name
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105"
                  : "bg-slate-400 cursor-not-allowed opacity-50"
              )}
            >
              {deleteStore.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isRTL ? "جاري الحذف..." : "Deleting..."}
                </span>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  {isRTL ? "تأكيد الحذف النهائي" : "Confirm Permanent Deletion"}
                </>
              )}
            </Button>
          </DialogFooter>
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

// ✅ تصدير افتراضي
export default AdminStores;