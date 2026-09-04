// src/components/dashboard/admin/AdminStores.tsx

import { Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
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
  AlertTriangle, X, CheckCircle2 as CheckCircle2Icon,
  Truck, Edit2, Info  
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
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { cn } from "@/lib/utils";
const { saveAs } = fileSaver;

// ✅ ✅ ✅ دوال إضافية للحذف
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ✅ Hook: حذف متجر من لوحة الأدمن
function useAdminDeleteStore() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log(`🗑️ [Admin] Deleting store for user: ${userId}`);
      
      const { error: listingsError } = await supabase
        .from("listings")
        .delete()
        .eq("owner_id", userId);

      if (listingsError) {
        console.error("❌ Error deleting listings:", listingsError);
        throw new Error(`Failed to delete listings: ${listingsError.message}`);
      }

      const { error: appsError } = await supabase
        .from("seller_applications")
        .delete()
        .eq("user_id", userId);

      if (appsError) {
        console.warn(`⚠️ Error deleting seller applications:`, appsError);
      }

      const { error: followersError } = await supabase
        .from("store_followers")
        .delete()
        .eq("store_id", userId);

      if (followersError) {
        console.warn(`⚠️ Error deleting store followers:`, followersError);
      }

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
          delivery_company_id: null,
        })
        .eq("id", userId);

      if (updateProfileError) {
        console.error("❌ Error clearing store data:", updateProfileError);
        throw new Error(`Failed to clear store data: ${updateProfileError.message}`);
      }

      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "seller");

      if (roleError) {
        console.warn(`⚠️ Error removing seller role:`, roleError);
      }

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
      
      const { count: products, error: productsError } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId);
      
      if (productsError) {
        console.error("❌ Error counting products:", productsError);
      }

      const { count: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
      
      if (ordersError) {
        console.error("❌ Error counting orders:", ordersError);
      }

      const { count: favorites, error: favoritesError } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      if (favoritesError) {
        console.error("❌ Error counting favorites:", favoritesError);
      }

      const { count: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      if (reviewsError) {
        console.error("❌ Error counting reviews:", reviewsError);
      }

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

// ✅ دالة جلب اسم شركة التوصيل
async function getDeliveryCompanyName(companyId: string | null): Promise<string | null> {
  if (!companyId) return null;
  try {
    const { data, error } = await supabase
      .from("delivery_companies")
      .select("name_ar, name_en")
      .eq("id", companyId)
      .maybeSingle();
    
    if (error || !data) return null;
    return data.name_ar || data.name_en || null;
  } catch (error) {
    return null;
  }
}

// ✅ دالة التحقق من حالة المتجر (مفتوح/مغلق)
function isStoreCurrentlyOpen(store: any): boolean {
  if (!store || store.store_online === false) return false;

  if (!store.store_opens_at || !store.store_closes_at) {
    return true;
  }

  try {
    const opens = store.store_opens_at.slice(0, 5);
    const closes = store.store_closes_at.slice(0, 5);

    if (!opens || !closes || opens.length < 5 || closes.length < 5) {
      return true;
    }

    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();

    const [oh, om] = opens.split(":").map(Number);
    const [ch, cm] = closes.split(":").map(Number);

    if (isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm)) {
      return true;
    }

    const o = oh * 60 + om;
    const c = ch * 60 + cm;

    if (o <= c) {
      return cur >= o && cur <= c;
    } else {
      return cur >= o || cur <= c;
    }
  } catch (error) {
    console.error('❌ Error checking store status:', error);
    return true;
  }
}

export function AdminStores() {
  const app = useApp();
  const { data: storesData, isLoading, refetch } = useAdminAllStores();
  const stores = storesData?.data || [];
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

  // ✅ State لنافذة تعديل شركة التوصيل
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [selectedStoreForDelivery, setSelectedStoreForDelivery] = useState<any>(null);
  const [selectedDeliveryCompanyId, setSelectedDeliveryCompanyId] = useState<string>("");
  const [deliveryCompanies, setDeliveryCompanies] = useState<any[]>([]);
  const [isLoadingDeliveryCompanies, setIsLoadingDeliveryCompanies] = useState(false);

  // ✅ State لتخزين أسماء شركات التوصيل
  const [deliveryCompanyNames, setDeliveryCompanyNames] = useState<Record<string, string>>({});

  // ✅ جلب إحصائيات المتجر المحدد
  const { data: storeStats, isLoading: statsLoading } = useAdminStoreStats(
    selectedStore?.id
  );

  // ✅ جلب أسماء شركات التوصيل لكل متجر
  useEffect(() => {
    const fetchDeliveryCompanyNames = async () => {
      const storesWithDelivery = stores.filter((s: any) => s.delivery_company_id);
      const names: Record<string, string> = {};
      
      for (const store of storesWithDelivery) {
        if (store.delivery_company_id && !names[store.id]) {
          const name = await getDeliveryCompanyName(store.delivery_company_id);
          if (name) names[store.id] = name;
        }
      }
      
      setDeliveryCompanyNames(names);
    };
    
    if (stores.length > 0) {
      fetchDeliveryCompanyNames();
    }
  }, [stores]);

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

  // ✅ فتح نافذة تعديل شركة التوصيل
  const openDeliveryDialog = async (store: any) => {
    setSelectedStoreForDelivery(store);
    setSelectedDeliveryCompanyId(store.delivery_company_id || "");
    setIsLoadingDeliveryCompanies(true);
    
    try {
      const { data, error } = await supabase
        .from("delivery_companies")
        .select("id, name_ar, name_en, base_price")
        .eq("is_active", true)
        .order("name_ar");
      
      if (error) throw error;
      setDeliveryCompanies(data || []);
    } catch (error) {
      console.error("❌ Error fetching delivery companies:", error);
      toast.error(isRTL ? "❌ فشل جلب شركات التوصيل" : "❌ Failed to fetch delivery companies");
    } finally {
      setIsLoadingDeliveryCompanies(false);
      setDeliveryDialogOpen(true);
    }
  };

  // ✅ حفظ شركة التوصيل
  const handleSaveDeliveryCompany = async () => {
    if (!selectedStoreForDelivery) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          delivery_company_id: selectedDeliveryCompanyId || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedStoreForDelivery.id);
      
      if (error) throw error;
      
      toast.success(
        isRTL 
          ? "✅ تم تحديث شركة التوصيل بنجاح" 
          : "✅ Delivery company updated successfully"
      );
      
      setDeliveryDialogOpen(false);
      setSelectedStoreForDelivery(null);
      setSelectedDeliveryCompanyId("");
      refetch();
      
    } catch (error) {
      console.error("❌ Error updating delivery company:", error);
      toast.error(
        isRTL 
          ? "❌ فشل تحديث شركة التوصيل" 
          : "❌ Failed to update delivery company"
      );
    }
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
        h1 { color: #2a655f; text-align: center; border-bottom: 3px solid #f9a8d4; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
        .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #f9a8d4; }
        .stat-card .value { font-size: 22px; font-weight: bold; color: #2a655f; }
        .stat-card .label { font-size: 11px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #2a655f; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        tr:hover { background: #fdf2f8; }
        .status-active { color: #2a655f; font-weight: bold; }
        .status-banned { color: #d81b60; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .badge-featured { background: #f9a8d4; color: #2a655f; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
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

  // ============================================================
  // ✅ التصميم - نفس أسلوب ProductsPage
  // ============================================================

  return (
    <div className="space-y-5">
      
      {/* ✅ HEADER - نفس تصميم ProductsPage */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <StoreIcon className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {isRTL ? "المتاجر" : "Stores"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors">
              <StoreIcon className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.active}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "نشط" : "active"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 hover:bg-red-100/50 dark:hover:bg-red-950/30 transition-colors">
              <XCircle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-red-600 dark:text-red-400 font-medium">{stats.banned}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "محظور" : "banned"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9a8d4]/10 border border-[#f9a8d4]/20 hover:bg-[#f9a8d4]/20 transition-colors">
              <Flame className="h-3.5 w-3.5 text-[#d81b60]" />
              <span className="text-[#d81b60] font-medium">{stats.featured}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "رائج" : "featured"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel} 
            disabled={filteredStores.length === 0} 
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToWord} 
            disabled={filteredStores.length === 0} 
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            className="rounded-xl border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" /> 
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ✅ STATS CARDS - نفس تصميم ProductsPage مع خلفية وردية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'total', label: isRTL ? 'الإجمالي' : 'Total', value: stats.total, icon: StoreIcon, color: 'text-[#2a655f]' },
          { key: 'active', label: isRTL ? 'نشط' : 'Active', value: stats.active, icon: CheckCircle2, color: 'text-emerald-500' },
          { key: 'banned', label: isRTL ? 'محظور' : 'Banned', value: stats.banned, icon: XCircle, color: 'text-red-500' },
          { key: 'featured', label: isRTL ? 'رائج' : 'Featured', value: stats.featured, icon: Flame, color: 'text-[#d81b60]' },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70 dark:border-[#f9a8d4]/40 hover:border-[#d81b60]/60 shadow-sm hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4]/10 to-[#fbcfe8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#fbcfe8]/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center justify-between p-3">
              <div>
                <p className="text-[10px] font-medium text-[#2a655f] dark:text-[#f9a8d4] uppercase tracking-wider flex items-center gap-1.5">
                  <stat.icon className={`h-3 w-3 text-[#2a655f] dark:text-[#f9a8d4] group-hover:scale-110 transition-transform duration-300`} />
                  {stat.label}
                </p>
                <p className={`text-xl font-bold mt-0.5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </p>
              </div>
              <div className={`h-9 w-9 rounded-lg bg-[#f9a8d4]/30 dark:bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#d81b60] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ✅ SEARCH & FILTERS - مع بوردرات وردية مثل ProductsPage */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isRTL ? "🔍 بحث عن متجر..." : "🔍 Search stores..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-slate-400 hover:text-[#f9a8d4] transition-colors`}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select value={filterStatus} onValueChange={(value: any) => { setFilterStatus(value); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#2a655f]/20">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/10 hover:text-[#2a655f] transition-colors">{isRTL ? "الكل" : "All"}</SelectItem>
            <SelectItem value="active" className="hover:bg-[#f9a8d4]/10 hover:text-[#2a655f] transition-colors">✅ {isRTL ? "نشط" : "Active"}</SelectItem>
            <SelectItem value="banned" className="hover:bg-[#f9a8d4]/10 hover:text-[#2a655f] transition-colors">🚫 {isRTL ? "محظور" : "Banned"}</SelectItem>
            <SelectItem value="featured" className="hover:bg-[#f9a8d4]/10 hover:text-[#2a655f] transition-colors">🔥 {isRTL ? "رائج" : "Featured"}</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={String(limit)} 
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#2a655f]/20">
            <SelectItem value="6" className="text-xs hover:bg-[#f9a8d4]/10">6</SelectItem>
            <SelectItem value="10" className="text-xs hover:bg-[#f9a8d4]/10">10</SelectItem>
            <SelectItem value="20" className="text-xs hover:bg-[#f9a8d4]/10">20</SelectItem>
            <SelectItem value="50" className="text-xs hover:bg-[#f9a8d4]/10">50</SelectItem>
            <SelectItem value="100" className="text-xs hover:bg-[#f9a8d4]/10">100</SelectItem>
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
          className="h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {isRTL ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

  {/* ✅ TABLE - نفس تصميم جدول CustomersPage */}
<div className="bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30">
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[200px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <div className="flex items-center gap-2">
              <StoreIcon className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
              {isRTL ? "المتجر" : "Store"}
            </div>
          </TableHead>
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
              {isRTL ? "المالك" : "Owner"}
            </div>
          </TableHead>
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[80px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <div className="flex items-center justify-center gap-2">
              <Package className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
              {isRTL ? "المنتجات" : "Products"}
            </div>
          </TableHead>
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
              {isRTL ? "الحالة" : "Status"}
            </div>
          </TableHead>
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
              {isRTL ? "الدوام" : "Hours"}
            </div>
          </TableHead>
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[160px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <div className="flex items-center justify-center gap-2">
              <Truck className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
              {isRTL ? "شركة التوصيل" : "Delivery Co."}
            </div>
          </TableHead>
          <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[340px]">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4] animate-pulse" />
              {isRTL ? "إجراءات" : "Actions"}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-12">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
                <span className="text-slate-500">{isRTL ? "جار التحميل..." : "Loading..."}</span>
              </div>
            </TableCell>
          </TableRow>
        )}
        {!isLoading && paginatedStores.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow">
                  <StoreIcon className="h-8 w-8 text-[#2a655f]/40" />
                </div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {isRTL ? "لا توجد متاجر" : "No stores"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isRTL ? "لا توجد متاجر تطابق البحث" : "No stores match your search"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="mt-2 rounded-xl border-3 border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300"
                >
                  {isRTL ? "مسح البحث" : "Clear search"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        {paginatedStores.map((s: any) => {
          const isOpen = isStoreCurrentlyOpen(s);
          
          return (
            <TableRow 
              key={s.id} 
              className="border-slate-100 dark:border-slate-800 hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 group border-b-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10"
            >
              <TableCell className="border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                <div className="flex items-center gap-3">
                  {s.store_logo_url ? (
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden border-2 border-[#f9a8d4]/30 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={s.store_logo_url}
                        className="h-full w-full object-cover"
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#f9a8d4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="h-11 w-11 rounded-xl bg-[#f9a8d4]/20 border-2 border-[#f9a8d4]/30 flex items-center justify-center flex-shrink-0">
                      <StoreIcon className="h-5 w-5 text-[#d81b60]/40" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#d81b60] transition-colors">
                      <Link
                        to="/store/$id"
                        params={{ id: s.id }}
                        className="hover:text-[#d81b60] transition-colors truncate"
                      >
                        {s.store_name || s.full_name || "—"}
                      </Link>
                      {s.is_featured && (
                        <Flame className="h-3.5 w-3.5 text-[#d81b60] fill-[#d81b60] animate-pulse shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                      {s.store_description || s.full_name || ""}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Link
                        to="/store/$id"
                        params={{ id: s.id }}
                        className="text-[10px] text-[#2a655f] hover:text-[#d81b60] hover:underline flex items-center gap-0.5 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        {isRTL ? "عرض المتجر" : "View store"}
                      </Link>
                      <span className="text-[#f9a8d4]/30">|</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Users className="h-3 w-3" />
                        {s.full_name || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-3 w-3 text-[#d81b60]" />
                  {s.full_name || "—"}
                </div>
              </TableCell>
              <TableCell className="font-medium text-slate-900 dark:text-white text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40 font-mono">
                  {s.listing_count || 0}
                </Badge>
              </TableCell>
              <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                {s.store_active === false ? (
                  <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20">
                    <XCircle className="h-3 w-3 mr-1" />
                    {isRTL ? "محظور" : "Banned"}
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {isRTL ? "نشط" : "Active"}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                <Badge className={cn(
                  "border-2 text-xs font-medium px-3 py-1",
                  isOpen
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"
                )}>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full inline-block mr-1.5",
                    isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  )} />
                  {isOpen 
                    ? (isRTL ? "🟢 مفتوح" : "🟢 Open")
                    : (isRTL ? "🔴 مغلق" : "🔴 Closed")}
                  {s.store_opens_at && s.store_closes_at && (
                    <span className="text-[9px] text-muted-foreground block mt-0.5">
                      {s.store_opens_at.slice(0,5)} - {s.store_closes_at.slice(0,5)}
                    </span>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                {s.delivery_company_id ? (
                  <Badge className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-2 border-blue-500/20 px-3 py-1 text-xs font-medium">
                    <Truck className="h-3 w-3 mr-1" />
                    {deliveryCompanyNames[s.id] || (
                      <span className="animate-pulse text-muted-foreground text-[10px]">
                        {isRTL ? "جاري التحميل..." : "Loading..."}
                      </span>
                    )}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground/50">
                    {isRTL ? "— غير مرتبط" : "— Not linked"}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  
                  {/* ✅ زر Featured - رائج */}
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105 border-2",
                      s.is_featured
                        ? "bg-gradient-to-r from-[#d81b60] to-[#f9a8d4] hover:from-[#c2185b] hover:to-[#f48fb1] text-white shadow-lg shadow-[#d81b60]/30 border-[#f9a8d4]/50"
                        : "border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60]"
                    )}
                    onClick={() =>
                      setFeatured.mutate(
                        { id: s.id, is_featured: !s.is_featured },
                        {
                          onSuccess: () =>
                            toast.success(
                              isRTL
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
                    title={isRTL ? "الأكثر رواجاً" : "Trending"}
                  >
                    <Flame className={cn(
                      "h-3.5 w-3.5 mr-1",
                      s.is_featured ? "animate-pulse" : ""
                    )} />
                    {isRTL ? "رائج" : "Trend"}
                  </Button>

                  {/* ✅ زر Ban/Unban */}
                  {s.store_active === false ? (
                    <Button
                      size="sm"
                      className="rounded-xl h-8 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-emerald-500/30"
                      onClick={() =>
                        setActive.mutate(
                          { id: s.id, active: true },
                          {
                            onSuccess: () =>
                              toast.success(
                                isRTL ? "✅ تم التفعيل" : "✅ Activated"
                              ),
                          }
                        )
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      {isRTL ? "تفعيل" : "Unban"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl h-8 px-3 border-red-300/50 text-red-500 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 hover:scale-105"
                      onClick={() => {
                        if (
                          confirm(
                            isRTL
                              ? "⚠️ هل أنت متأكد من حظر هذا المتجر؟"
                              : "⚠️ Are you sure you want to ban this store?"
                          )
                        )
                          setActive.mutate(
                            { id: s.id, active: false },
                            {
                              onSuccess: () =>
                                toast.success(
                                  isRTL ? "🚫 تم الحظر" : "🚫 Banned"
                                ),
                            }
                          );
                      }}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      {isRTL ? "حظر" : "Ban"}
                    </Button>
                  )}

                  {/* ✅ زر تعديل شركة التوصيل */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl h-8 px-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] transition-all duration-300 hover:scale-105"
                    onClick={() => openDeliveryDialog(s)}
                    title={isRTL ? "تعديل شركة التوصيل" : "Edit delivery company"}
                  >
                    <Truck className="h-3.5 w-3.5 mr-1" />
                    {isRTL ? "تعديل التوصيل" : "Edit Delivery"}
                  </Button>

                  {/* ✅ زر حذف المتجر */}
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
          );
        })}
      </TableBody>
    </Table>
  </div>

  {/* ✅ PAGINATION - نفس تصميم CustomersPage */}
  {totalPages > 1 && (
    <div className="px-4 py-3 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {filteredStores.length === 0 ? (
          <span>{isRTL ? "لا توجد متاجر" : "No stores"}</span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" />
            {isRTL
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
          className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] transition-all duration-300 disabled:opacity-50"
          title={isRTL ? "الصفحة الأولى" : "First page"}
        >
          <span className="text-xs font-bold">«</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] transition-all duration-300 disabled:opacity-50"
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
                    ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#f9a8d4]/30 border-2 border-white/30 scale-105"
                    : "border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60]"
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
                className="h-8 min-w-[32px] p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] text-xs transition-all duration-300 hover:scale-105"
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
          className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] transition-all duration-300 disabled:opacity-50"
          title={isRTL ? "التالي" : "Next"}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={page === totalPages}
          className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] transition-all duration-300 disabled:opacity-50"
          title={isRTL ? "الصفحة الأخيرة" : "Last page"}
        >
          <span className="text-xs font-bold">»</span>
        </Button>
      </div>
    </div>
  )}

  {/* ✅ FOOTER - نفس تصميم CustomersPage */}
  <div className="px-4 py-2 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10">
    <span className="flex items-center gap-2">
      <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
        {isRTL
          ? `عرض ${paginatedStores.length} من ${filteredStores.length}`
          : `Showing ${paginatedStores.length} of ${filteredStores.length}`}
      </Badge>
      <span className="text-[10px] text-[#d81b60]">
        {isRTL ? `إجمالي ${stores.length}` : `Total ${stores.length}`}
      </span>
    </span>
    <div className="flex items-center gap-2">
      <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
        <Shield className="h-3 w-3 mr-1 text-[#d81b60]" />
        {filterStatus === "all" && (isRTL ? "الكل" : "All")}
        {filterStatus === "active" && (isRTL ? "نشط" : "Active")}
        {filterStatus === "banned" && (isRTL ? "محظور" : "Banned")}
        {filterStatus === "featured" && (isRTL ? "رائج" : "Featured")}
      </Badge>
      {searchQuery && (
        <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
          <Search className="h-3 w-3 mr-1 text-[#d81b60]" />
          {searchQuery}
        </Badge>
      )}
    </div>
  </div>
</div>
      {/* ✅ DIALOG: حذف المتجر - مع بوردرات وردية */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl border-3 border-[#d81b60]/40 shadow-2xl shadow-[#d81b60]/20 p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => {
              setDeleteDialogOpen(false);
              setConfirmStoreName("");
              setSelectedStore(null);
            }}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>

          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start gap-4 mb-2">
              <div className="h-14 w-14 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {isRTL ? "⚠️ تأكيد حذف المتجر" : "⚠️ Confirm Store Deletion"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isRTL
                    ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المتجر نهائياً."
                    : "This action cannot be undone. All store data will be permanently deleted."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="p-6 space-y-4">
              {/* ✅ معلومات المتجر */}
              <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-4 border-2 border-slate-200/50 dark:border-slate-700/50">
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
                  <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-3 border-2 border-red-200/30 dark:border-red-800/30">
                    <p className="text-xs text-red-600/70 dark:text-red-400/70">📦 {isRTL ? "منتجات" : "Products"}</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-400">{storeStats.products}</p>
                  </div>
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/30 dark:border-amber-800/30">
                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">🛒 {isRTL ? "طلبات" : "Orders"}</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{storeStats.orders}</p>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border-2 border-blue-200/30 dark:border-blue-800/30">
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">💬 {isRTL ? "رسائل" : "Messages"}</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{storeStats.messages}</p>
                  </div>
                  <div className="bg-pink-50/50 dark:bg-pink-950/20 rounded-xl p-3 border-2 border-pink-200/30 dark:border-pink-800/30">
                    <p className="text-xs text-pink-600/70 dark:text-pink-400/70">❤️ {isRTL ? "مفضلات" : "Favorites"}</p>
                    <p className="text-xl font-bold text-pink-700 dark:text-pink-400">{storeStats.favorites}</p>
                  </div>
                  <div className="bg-green-50/50 dark:bg-green-950/20 rounded-xl p-3 border-2 border-green-200/30 dark:border-green-800/30">
                    <p className="text-xs text-green-600/70 dark:text-green-400/70">⭐ {isRTL ? "تقييمات" : "Reviews"}</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{storeStats.reviews}</p>
                  </div>
                  <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-3 border-2 border-purple-200/30 dark:border-purple-800/30">
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
              <div className="bg-red-50/30 dark:bg-red-950/10 rounded-xl p-4 border-2 border-red-200/50 dark:border-red-800/30">
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
                    "rounded-xl border-3 border-red-200/50 dark:border-red-800/50 focus:border-red-500 focus:ring-red-500/20",
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
              className="flex-1 rounded-xl border-3 border-[#2a655f]/20 hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 h-12"
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
                "flex-1 rounded-xl text-white shadow-lg transition-all duration-300 h-12 border-2",
                confirmStoreName === selectedStore?.store_name
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 border-red-500/30"
                  : "bg-slate-400 cursor-not-allowed opacity-50 border-slate-400/30"
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

      {/* ✅ DIALOG: تعديل شركة التوصيل - مع بوردرات وردية */}
      <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-3 border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/15 p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => {
              setDeliveryDialogOpen(false);
              setSelectedStoreForDelivery(null);
              setSelectedDeliveryCompanyId("");
            }}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-[#2a655f]/10 border-2 border-[#2a655f]/30 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-6 w-6 text-[#2a655f]" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isRTL ? "🚚 تعديل شركة التوصيل" : "🚚 Edit Delivery Company"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {isRTL 
                      ? `تعديل شركة التوصيل لمتجر "${selectedStoreForDelivery?.store_name}"`
                      : `Edit delivery company for store "${selectedStoreForDelivery?.store_name}"`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* ✅ معلومات المتجر الحالية */}
              {selectedStoreForDelivery && (
                <div className="flex items-center gap-3 p-3 bg-[#f9a8d4]/10 rounded-xl border-2 border-[#f9a8d4]/30">
                  <div className="h-10 w-10 rounded-lg bg-[#2a655f]/10 flex items-center justify-center flex-shrink-0">
                    <StoreIcon className="h-5 w-5 text-[#2a655f]/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {selectedStoreForDelivery.store_name || selectedStoreForDelivery.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? `المالك: ${selectedStoreForDelivery.full_name || "—"}` : `Owner: ${selectedStoreForDelivery.full_name || "—"}`}
                    </p>
                  </div>
                  <Badge className={selectedStoreForDelivery.store_active === false ? "bg-red-500/10 text-red-600 border-2 border-red-500/20" : "bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20"}>
                    {selectedStoreForDelivery.store_active === false ? (isRTL ? "محظور" : "Banned") : (isRTL ? "نشط" : "Active")}
                  </Badge>
                </div>
              )}

              {/* ✅ اختيار شركة التوصيل */}
              <div className="space-y-2">
                <Label className="text-[#2a655f] dark:text-white font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#2a655f]" />
                  {isRTL ? "شركة التوصيل" : "Delivery Company"}
                </Label>
                
                {isLoadingDeliveryCompanies ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
                  </div>
                ) : deliveryCompanies.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground border-3 border-dashed border-[#2a655f]/20 rounded-xl">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-[#2a655f]/30" />
                    <p className="text-sm">{isRTL ? "⚠️ لا توجد شركات توصيل نشطة" : "⚠️ No active delivery companies"}</p>
                  </div>
                ) : (
                  <Select 
                    value={selectedDeliveryCompanyId} 
                    onValueChange={setSelectedDeliveryCompanyId}
                  >
                    <SelectTrigger className="rounded-xl border-3 border-[#2a655f]/20 focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30">
                      <SelectValue placeholder={isRTL ? "🔍 اختر شركة التوصيل..." : "🔍 Select delivery company..."} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-3 border-[#2a655f]/20">
                      <SelectItem value="">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <XCircle className="h-4 w-4" />
                          {isRTL ? "بدون شركة توصيل" : "No delivery company"}
                        </span>
                      </SelectItem>
                      {deliveryCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">
                          <span className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#2a655f]" />
                            <span>{company.name_ar || company.name_en}</span>
                            <Badge className="text-[9px] bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20">
                              {company.base_price || 0} SYP
                            </Badge>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3 text-[#2a655f]" />
                  {isRTL 
                    ? "💡 هذه الشركة ستكون المسؤولة عن توصيل طلبات هذا المتجر"
                    : "💡 This company will handle delivery for this store"}
                </p>
              </div>

              {/* ✅ عرض الشركة الحالية */}
              {selectedStoreForDelivery?.delivery_company_id && (
                <div className="p-3 bg-[#2a655f]/5 rounded-xl border-2 border-[#2a655f]/20">
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? "🔄 الشركة الحالية" : "🔄 Current company"}
                  </p>
                  <p className="text-sm font-medium text-[#2a655f]">
                    {deliveryCompanies.find(c => c.id === selectedStoreForDelivery.delivery_company_id)?.name_ar 
                      || deliveryCompanies.find(c => c.id === selectedStoreForDelivery.delivery_company_id)?.name_en 
                      || selectedStoreForDelivery.delivery_company_id}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-3 pt-4 border-t-3 border-[#2a655f]/20">
              <Button
                variant="outline"
                onClick={() => {
                  setDeliveryDialogOpen(false);
                  setSelectedStoreForDelivery(null);
                  setSelectedDeliveryCompanyId("");
                }}
                className="flex-1 rounded-xl border-3 border-[#2a655f]/20 hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSaveDeliveryCompany}
                disabled={isLoadingDeliveryCompanies}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02] border-2 border-[#2a655f]/30"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isRTL ? "حفظ التغييرات" : "Save Changes"}
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AdminStores;