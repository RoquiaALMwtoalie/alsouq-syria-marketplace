// src/components/dashboard/admin/SellerApplicationsAdmin.tsx

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { useAllSellerApplications, useReviewSellerApplication } from "@/lib/queries";
import { toast } from "sonner";
import { 
  CheckCircle2, XCircle, Clock, Store, User, Phone, MapPin, 
  Search, Filter, Eye, Calendar, RefreshCw, AlertCircle,
  Building2, MessageSquare, ChevronLeft, ChevronRight,
  Layers, ShoppingBag, FileSpreadsheet, FileText, Download,
  Loader2, Sparkles, Shield, Award, Target, Compass,
  Rocket, Crown, Star, Flame, Gem, Bell, Check,
  ArrowUp, ArrowDown, CircleDot, Activity, TrendingUp,
  ShieldCheck, Tag, Truck, Image as ImageIcon, Megaphone,
  Zap, Package, Users, Settings, LayoutDashboard, 
  Mail, Hash, Clock as ClockIcon, Info, X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { supabase } from "@/integrations/supabase/client";
import { useSendNotificationV2 } from "@/lib/queries";
import { cn } from "@/lib/utils";

const { saveAs } = fileSaver;

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
  pinkVeryLight: '#fdf2f8',
  fuchsia: '#d81b60',
  fuchsiaDark: '#c2185b',
  fuchsiaGlow: 'rgba(216,27,96,0.2)',
};

// ============================================================
// ✅ أيقونات متحركة للحالات
// ============================================================
const STATUS_CONFIG: Record<string, { 
  label_ar: string; 
  label_en: string; 
  color: string; 
  bg: string; 
  border: string;
  icon: any;
  animation: string;
}> = {
  pending: {
    label_ar: "قيد المراجعة",
    label_en: "Pending",
    color: "text-amber-600 border-amber-500/30",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock,
    animation: "animate-pulse-slow"
  },
  approved: {
    label_ar: "موافق عليه",
    label_en: "Approved",
    color: "text-emerald-600 border-emerald-500/30",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
    animation: "animate-bounce-slow"
  },
  rejected: {
    label_ar: "مرفوض",
    label_en: "Rejected",
    color: "text-rose-600 border-rose-500/30",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: XCircle,
    animation: "animate-float"
  },
};

// ============================================================
// ✅ Stat Card - بتصميم وردي
// ============================================================
const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color,
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string;
}) => (
  <div className="group relative bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70 dark:border-[#f9a8d4]/40 hover:border-[#d81b60]/60 shadow-sm hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4]/10 to-[#fbcfe8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#fbcfe8]/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative flex items-center justify-between p-3">
      <div>
        <p className="text-[10px] font-medium text-[#2a655f] dark:text-[#f9a8d4] uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-xl font-bold mt-0.5 ${color} group-hover:scale-110 transition-transform duration-300`}>
          {value}
        </p>
      </div>
      <div className={`h-9 w-9 rounded-lg bg-[#f9a8d4]/30 dark:bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#d81b60] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
  </div>
);

// ============================================================
// ✅ Badge الحالة
// ============================================================
const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  const isRTL = useApp().lang === 'ar';
  
  return (
    <Badge className={cn(
      "border-2 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105",
      config.bg,
      config.color,
      config.border
    )}>
      <Icon className={cn("h-3 w-3", config.animation)} />
      <span>{isRTL ? config.label_ar : config.label_en}</span>
    </Badge>
  );
};

// ============================================================
// ✅ Badge النوع
// ============================================================
const TypeBadge = ({ type }: { type: string }) => {
  const isRTL = useApp().lang === 'ar';
  const typeValue = type || "store";
  
  const configs: Record<string, any> = {
    store: {
      icon: Building2,
      label: isRTL ? "🏪 فتح متجر" : "🏪 Open Store",
      bg: "bg-[#2a655f]/10",
      color: "text-[#2a655f] border-[#2a655f]/30",
    },
    product: {
      icon: ShoppingBag,
      label: isRTL ? "🛍️ إضافة منتج" : "🛍️ Add Product",
      bg: "bg-[#f9a8d4]/20",
      color: "text-[#d81b60] border-[#f9a8d4]/40",
    },
  };
  
  const config = configs[typeValue] || configs.store;
  const Icon = config.icon;
  
  return (
    <Badge className={cn(
      "border-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105",
      config.bg,
      config.color
    )}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

// ============================================================
// ✅ دالة مساعدة لإضافة timeout للـ Promises
// ============================================================
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`⏱️ Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// ============================================================
// ✅ دالة إشعار آمنة
// ============================================================
const safeSendNotification = async (sendNotification: any, params: any): Promise<boolean> => {
  try {
    await withTimeout(sendNotification.mutateAsync(params), 10000);
    return true;
  } catch (error) {
    console.error("❌ [Notification] Failed (non-critical):", error);
    return false;
  }
};

export function SellerApplicationsAdmin() {
  const app = useApp();
  const t = useT();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [filterType, setFilterType] = useState<"all" | "store" | "product">("all");
  const sendNotification = useSendNotificationV2();
  const tableRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  const isRTL = app.lang === 'ar';
  
  const { 
    data: appsData, 
    isLoading, 
    refetch 
  } = useAllSellerApplications(
    page, 
    limit, 
    filterStatus, 
    filterType,
    searchQuery
  );

  const apps = appsData?.data || [];
  const totalCount = appsData?.count || 0;
  const totalPages = appsData?.totalPages || 1;

  const review = useReviewSellerApplication();
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // State لشركة التوصيل
  const [selectedDeliveryCompanyId, setSelectedDeliveryCompanyId] = useState<string>("");
  const [deliveryCompanies, setDeliveryCompanies] = useState<any[]>([]);
  const [showDeliveryCompanyDialog, setShowDeliveryCompanyDialog] = useState(false);
  const [pendingAppId, setPendingAppId] = useState<string>("");

  // جلب شركات التوصيل الموثقة والنشطة فقط
  useEffect(() => {
    const fetchDeliveryCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from("delivery_companies")
          .select("id, name_ar, name_en, base_price, is_verified")
          .eq("is_active", true)
          .eq("is_verified", true)
          .order("name_ar");
        
        if (!error && data) {
          setDeliveryCompanies(data);
        } else if (error) {
          console.error("❌ Error fetching delivery companies:", error);
        }
      } catch (error) {
        console.error("❌ Error in fetchDeliveryCompanies:", error);
      }
    };
    
    fetchDeliveryCompanies();
  }, []);

  // ============================================================
  // ✅ إحصائيات
  // ============================================================
  const stats = useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a: any) => a.status === 'pending').length;
    const approved = apps.filter((a: any) => a.status === 'approved').length;
    const rejected = apps.filter((a: any) => a.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [apps]);

  // ============================================================
  // ✅ تصدير Excel
  // ============================================================
  const exportToExcel = () => {
    const exportData = apps.map((a: any) => ({
      'اسم المتجر': a.store_name,
      'نوع الطلب': a.application_type === 'product' ? 'إضافة منتج' : 'فتح متجر',
      'المتقدم': a.profiles?.full_name || '—',
      'الهاتف': a.store_phone || a.profiles?.phone || '—',
      'الحالة': a.status === 'pending' ? 'قيد المراجعة' : a.status === 'approved' ? 'موافق عليه' : 'مرفوض',
      'المحافظة': a.governorate?.name_ar || '—',
      'تاريخ الطلب': new Date(a.created_at).toLocaleDateString('ar-SA'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الطلبات');
    
    const colWidths = [
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws['!cols'] = colWidths;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `الطلبات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
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
          h1 { color: #2a655f; text-align: center; border-bottom: 3px solid #f9a8d4; padding-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #f9a8d4; }
          .stat-card .value { font-size: 22px; font-weight: bold; color: #2a655f; }
          .stat-card .label { font-size: 11px; color: #94a3b8; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th { background: #2a655f; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
          tr:hover { background: #fdf2f8; }
          .status-pending { color: #f9a8d4; font-weight: bold; }
          .status-approved { color: #2a655f; font-weight: bold; }
          .status-rejected { color: #d81b60; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          .badge-type-store { background: #2a655f10; color: #2a655f; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
          .badge-type-product { background: #f9a8d420; color: #d81b60; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
        </style>
      </head>
      <body>
        <h1>📋 تقرير الطلبات</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${stats.total}</div><div class="label">إجمالي الطلبات</div></div>
          <div class="stat-card"><div class="value">${stats.pending}</div><div class="label">قيد المراجعة</div></div>
          <div class="stat-card"><div class="value">${stats.approved}</div><div class="label">موافق عليه</div></div>
          <div class="stat-card"><div class="value">${stats.rejected}</div><div class="label">مرفوض</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم المتجر</th>
              <th>نوع الطلب</th>
              <th>المتقدم</th>
              <th>الهاتف</th>
              <th>الحالة</th>
              <th>المحافظة</th>
              <th>تاريخ الطلب</th>
            </tr>
          </thead>
          <tbody>
    `;
    apps.forEach((a: any, index: number) => {
      const statusClass = a.status === 'pending' ? 'status-pending' : a.status === 'approved' ? 'status-approved' : 'status-rejected';
      const statusText = a.status === 'pending' ? 'قيد المراجعة' : a.status === 'approved' ? 'موافق عليه' : 'مرفوض';
      const typeText = a.application_type === 'product' ? 'إضافة منتج' : 'فتح متجر';
      const typeClass = a.application_type === 'product' ? 'badge-type-product' : 'badge-type-store';
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${a.store_name}</td>
          <td><span class="${typeClass}">${typeText}</span></td>
          <td>${a.profiles?.full_name || '—'}</td>
          <td>${a.store_phone || a.profiles?.phone || '—'}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${a.governorate?.name_ar || '—'}</td>
          <td>${new Date(a.created_at).toLocaleDateString('ar-SA')}</td>
        </tr>
      `;
    });
    htmlContent += `
          </tbody>
        </table>
        <div class="footer">إجمالي الطلبات: ${totalCount} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `الطلبات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ============================================================
  // ✅ الدالة الرئيسية - مُعاد كتابتها بالكامل
  // ============================================================
  async function decide(id: string, status: "approved" | "rejected", admin_note?: string) {
    if (isProcessing) {
      toast.warning(isRTL ? "⏳ جاري المعالجة..." : "⏳ Processing...");
      return;
    }

    if (status === "rejected" && (!admin_note || admin_note.trim() === "")) {
      toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    let applicationData: any = null;
    let isCompleted = false;

    try {
      console.log(`🔍 [decide] Starting for application: ${id}, status: ${status}`);

      // جلب بيانات الطلب
      const { data: appData, error: fetchError } = await withTimeout(
        supabase
          .from("seller_applications")
          .select("*")
          .eq("id", id)
          .single(),
        10000
      );

      if (fetchError || !appData) {
        toast.error(isRTL ? "❌ فشل جلب بيانات الطلب" : "❌ Failed to fetch application");
        setIsProcessing(false);
        return;
      }

      applicationData = appData;
      console.log(`✅ [decide] Application fetched: ${appData.store_name}`);

      // تحديث حالة الطلب
      const updatePayload = {
        status: status,
        admin_note: admin_note || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: app.user?.id || null,
      };

      const { error: updateError } = await withTimeout(
        supabase
          .from("seller_applications")
          .update(updatePayload)
          .eq("id", id),
        10000
      );

      if (updateError) {
        toast.error(
          isRTL 
            ? `❌ فشل تحديث الطلب: ${updateError.message}` 
            : `❌ Failed to update: ${updateError.message}`
        );
        setIsProcessing(false);
        return;
      }

      console.log(`✅ [decide] Application status updated to: ${status}`);
      isCompleted = true;

      // إشعار فوري
      toast.success(
        status === "approved"
          ? isRTL ? "✅ تمت الموافقة على الطلب" : "✅ Application approved"
          : isRTL ? "❌ تم رفض الطلب" : "❌ Application rejected"
      );

      // معالجة الموافقة أو الرفض
      if (status === "approved") {
        
        // الموافقة على متجر
        if (appData.application_type === 'store') {
          const storeDescription = appData.store_description?.trim() || null;
          
          const updateData: any = {
            store_name: appData.store_name,
            store_description: storeDescription,
            store_logo_url: appData.store_logo_url,
            store_cover_url: appData.store_cover_url,
            store_phone: appData.store_phone,
            allows_messaging: appData.allows_messaging ?? true,
            allows_bookings: appData.allows_bookings ?? false,
            store_type: appData.store_type || 'online',
            governorate_id: appData.governorate_id,
            store_address: appData.address,
            store_opens_at: appData.opening_time,
            store_closes_at: appData.closing_time,
            weekly_off_days: appData.weekly_off_days || [],
            store_active: true,
            store_online: true,
          };

          if (selectedDeliveryCompanyId) {
            updateData.delivery_company_id = selectedDeliveryCompanyId;
          }

          const { error: profileError } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", appData.user_id);

          if (profileError) {
            console.error("❌ Error updating profile:", profileError);
            toast.warning(
              isRTL 
                ? "⚠️ تمت الموافقة لكن فشل تحديث بيانات المتجر" 
                : "⚠️ Approved but failed to update store data"
            );
          } else {
            console.log(`✅ [decide] Profile updated for user: ${appData.user_id}`);
            
            // إضافة رول seller
            const { error: roleError } = await supabase
              .from("user_roles")
              .insert({
                user_id: appData.user_id,
                role: 'seller'
              });

            if (roleError) {
              console.error("❌ Error adding seller role:", roleError);
            } else {
              console.log(`✅ Seller role added for user: ${appData.user_id}`);
            }
          }

          // إشعار موافقة متجر
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: 'store_approved',
            titleAr: "✅ تمت الموافقة على طلبك",
            bodyAr: `تمت الموافقة على طلب فتح متجر "${appData.store_name}" 🎉`,
            linkUrl: '/dashboard?tab=settings',
            imageUrl: appData.store_logo_url,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              application_type: 'store',
              admin_note: admin_note || null,
              delivery_company_id: selectedDeliveryCompanyId || null,
            },
            actions: [
              { label_ar: 'عرض متجري', url: '/dashboard?tab=settings' },
            ]
          });
        }

        // الموافقة على منتج
        if (appData.application_type === 'product') {
          const { data: listing, error: listingError } = await withTimeout(
            supabase
              .from("listings")
              .select("id, title_ar, cover_url")
              .eq("owner_id", appData.user_id)
              .eq("status", "pending")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
            10000
          );

          if (!listingError && listing) {
            await withTimeout(
              supabase
                .from("listings")
                .update({ status: 'published' })
                .eq("id", listing.id),
              10000
            );
            console.log(`✅ [decide] Product published: ${listing.id}`);
          }

          // إشعار موافقة منتج
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: 'product_approved',
            titleAr: "✅ تمت الموافقة على طلبك",
            bodyAr: `تمت الموافقة على إضافة المنتج، وهو الآن متاح للبيع 🛍️`,
            linkUrl: '/dashboard?tab=products',
            imageUrl: listing?.cover_url || null,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              application_type: 'product',
              admin_note: admin_note || null,
              listing_id: listing?.id || null,
            },
            actions: [
              { label_ar: 'عرض المنتج', url: '/dashboard?tab=products' },
            ]
          });
        }

      } else {
        
        // رفض متجر
        if (appData.application_type === 'store') {
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: 'store_rejected',
            titleAr: "❌ تم رفض طلبك",
            bodyAr: `تم رفض طلب فتح متجر "${appData.store_name}"${admin_note ? `\nالسبب: ${admin_note}` : ''}`,
            linkUrl: '/dashboard?tab=overview',
            imageUrl: appData.store_logo_url,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              reason: admin_note || null,
              application_type: 'store',
            },
            actions: [
              { label_ar: 'مراجعة الطلب', url: '/dashboard?tab=overview' },
            ]
          });
        }

        // رفض منتج
        if (appData.application_type === 'product') {
          const { data: listing, error: listingError } = await withTimeout(
            supabase
              .from("listings")
              .select("id, title_ar, cover_url")
              .eq("owner_id", appData.user_id)
              .eq("status", "pending")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
            10000
          );

          if (!listingError && listing) {
            await withTimeout(
              supabase
                .from("listings")
                .update({ 
                  status: 'draft',
                  rejection_reason: admin_note || null,
                  rejected_at: new Date().toISOString(),
                })
                .eq("id", listing.id),
              10000
            );
            console.log(`✅ [decide] Product rejected: ${listing.id}`);
          }

          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: 'product_rejected',
            titleAr: "❌ تم رفض طلبك",
            bodyAr: `تم رفض طلب إضافة المنتج${admin_note ? `\nالسبب: ${admin_note}` : ''}`,
            linkUrl: '/dashboard?tab=products',
            imageUrl: listing?.cover_url || null,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              reason: admin_note || null,
              application_type: 'product',
              listing_id: listing?.id || null,
            },
            actions: [
              { label_ar: 'مراجعة المنتج', url: '/dashboard?tab=products' },
            ]
          });
        }
      }

      await refetch();
      setNoteFor(null);
      setNote("");
      setShowDeliveryCompanyDialog(false);
      setSelectedDeliveryCompanyId("");
      setPendingAppId("");

      console.log(`✅ [decide] Complete for application: ${id}`);

    } catch (error: any) {
      console.error("❌ [decide] Fatal error:", error);
      
      if (isCompleted) {
        toast.warning(
          isRTL 
            ? "⚠️ تم تحديث الطلب ولكن حدث خطأ في خطوة ثانوية" 
            : "⚠️ Application updated but a secondary step failed"
        );
      } else {
        const errorMessage = error.message || String(error);
        
        if (errorMessage.includes("timeout")) {
          toast.error(
            isRTL 
              ? "⏱️ انتهت المهلة، يرجى المحاولة مرة أخرى" 
              : "⏱️ Request timeout, please try again"
          );
        } else {
          toast.error(
            isRTL 
              ? `❌ فشل العملية: ${errorMessage}` 
              : `❌ Operation failed: ${errorMessage}`
          );
        }
      }

    } finally {
      setIsProcessing(false);
      console.log(`🏁 [decide] Finished for application: ${id}`);
    }
  }

  // دالة للموافقة مع شركة توصيل
  const handleApproveWithDelivery = async () => {
    if (!selectedDeliveryCompanyId) {
      toast.error(isRTL ? "⚠️ يرجى اختيار شركة توصيل" : "⚠️ Please select a delivery company");
      return;
    }
    setShowDeliveryCompanyDialog(false);
    await decide(pendingAppId, "approved");
    setSelectedDeliveryCompanyId("");
    setPendingAppId("");
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================
  // ✅ حالة التحميل
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {isRTL ? "⏳ جاري تحميل الطلبات..." : "⏳ Loading applications..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Layers className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {isRTL ? "طلبات البائعين" : "Seller Applications"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {totalCount}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors">
              <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "قيد المراجعة" : "pending"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.approved}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "موافق" : "approved"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="text-xs text-[#2a655f] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isRTL ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border-2 border-[#f9a8d4]/40 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToExcel}
              disabled={apps.length === 0}
              className="rounded-lg h-9 px-4 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] gap-2 transition-all duration-300 hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Excel</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToWord}
              disabled={apps.length === 0}
              className="rounded-lg h-9 px-4 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] gap-2 transition-all duration-300 hover:scale-105"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Word</span>
            </Button>
            <div className="w-px h-6 bg-[#f9a8d4]/30" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg h-9 px-3 text-[#2a655f] hover:bg-[#f9a8d4]/20 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
            </Button>
          </div>
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white border-2 border-white/30 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#f9a8d4]/30 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            {isRTL ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ===== STATS CARDS - بتصميم وردي ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          label={isRTL ? '📊 الإجمالي' : '📊 Total'} 
          value={stats.total} 
          icon={Layers}
          color="text-[#2a655f]"
        />
        <StatCard 
          label={isRTL ? '⏳ قيد المراجعة' : '⏳ Pending'} 
          value={stats.pending} 
          icon={Clock}
          color="text-amber-500"
        />
        <StatCard 
          label={isRTL ? '✅ موافق عليه' : '✅ Approved'} 
          value={stats.approved} 
          icon={CheckCircle2}
          color="text-emerald-500"
        />
        <StatCard 
          label={isRTL ? '❌ مرفوض' : '❌ Rejected'} 
          value={stats.rejected} 
          icon={XCircle}
          color="text-rose-500"
        />
      </div>

      {/* ===== SEARCH & FILTERS - بوردرات وردية ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#d81b60] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isRTL ? "🔍 بحث عن طلب..." : "🔍 Search applications..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 bg-white dark:bg-[#1e293b] focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#d81b60]/50`}
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => {
            setFilterStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 hover:border-[#d81b60]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#d81b60]" />
              <SelectValue placeholder={isRTL ? "جميع الحالات" : "All status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📋 {isRTL ? "جميع الحالات" : "All"}</SelectItem>
            <SelectItem value="pending" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">⏳ {isRTL ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="approved" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">✅ {isRTL ? "موافق" : "Approved"}</SelectItem>
            <SelectItem value="rejected" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">❌ {isRTL ? "مرفوض" : "Rejected"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterType}
          onValueChange={(value: any) => {
            setFilterType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 hover:border-[#d81b60]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#d81b60]" />
              <SelectValue placeholder={isRTL ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📦 {isRTL ? "جميع الأنواع" : "All"}</SelectItem>
            <SelectItem value="store" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">🏪 {isRTL ? "فتح متجر" : "Open Store"}</SelectItem>
            <SelectItem value="product" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">🛍️ {isRTL ? "إضافة منتج" : "Add Product"}</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={String(limit)} 
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 hover:border-[#d81b60]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#d81b60]" />
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
            <SelectItem value="6" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">6</SelectItem>
            <SelectItem value="10" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">10</SelectItem>
            <SelectItem value="20" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">20</SelectItem>
            <SelectItem value="50" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">50</SelectItem>
            <SelectItem value="100" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">100</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
            setFilterType("all");
            setPage(1);
          }}
          className="h-10 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 hover:text-[#d81b60] transition-all duration-300 hover:scale-105"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {isRTL ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== TABLE - مع هوفر وردي ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 overflow-hidden shadow-lg shadow-[#f9a8d4]/10 hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-300">
        <div className="overflow-x-auto" ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow className="border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/20 to-[#fbcfe8]/20">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[200px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center gap-2">
                    <Store className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? "المتقدم / المتجر" : "Applicant / Store"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? "النوع" : "Type"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? "الهاتف" : "Phone"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? "تاريخ الطلب" : "Date"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[280px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#d81b60] animate-pulse" />
                    {isRTL ? "إجراءات" : "Actions"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 flex items-center justify-center animate-bounce-slow border-3 border-[#f9a8d4]/70">
                        <Layers className="h-8 w-8 text-[#2a655f]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {isRTL ? "لا توجد طلبات" : "No applications"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isRTL ? "جميع الطلبات تمت مراجعتها" : "All applications have been reviewed"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                apps.map((a: any) => {
                  const isHovered = hoveredRow === a.id;
                  
                  return (
                    <TableRow 
                      key={a.id} 
                      className={cn(
                        "border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 transition-all duration-300 group",
                        a.status === "pending" ? "bg-[#f9a8d4]/10 dark:bg-[#f9a8d4]/5" : "",
                        "hover:bg-[#f9a8d4]/20 dark:hover:bg-[#f9a8d4]/15"
                      )}
                      onMouseEnter={() => setHoveredRow(a.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell className="border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 border-2 border-[#f9a8d4]/30",
                            isHovered ? "scale-105 rotate-6" : "",
                            a.store_logo_url ? "" : "bg-gradient-to-br from-[#2a655f] to-[#f9a8d4]"
                          )}>
                            {a.store_logo_url ? (
                              <img src={a.store_logo_url} alt="" className="h-11 w-11 rounded-xl object-cover" />
                            ) : (
                              <Store className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#d81b60] transition-colors">
                              <span className="truncate">{a.store_name}</span>
                              {a.store_type && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-2 border-[#f9a8d4]/30">
                                  {a.store_type === "physical" ? "🏪" : "🌐"}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <User className="h-3 w-3 text-[#d81b60]" />
                              {a.profiles?.full_name || "—"}
                            </div>
                            {a.store_description && (
                              <div className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 max-w-[150px]">
                                {a.store_description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <TypeBadge type={a.application_type || "store"} />
                      </TableCell>
                      
                      <TableCell dir="ltr" className="text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <div className="flex items-center justify-center gap-1">
                          <Phone className="h-3 w-3 text-[#d81b60]" />
                          {a.store_phone || a.profiles?.phone || "—"}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <StatusBadge status={a.status} />
                        {a.reviewed_at && a.status !== "pending" && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(a.reviewed_at).toLocaleDateString(
                              isRTL ? "ar-SA" : "en-US"
                            )}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#d81b60]" />
                          {new Date(a.created_at).toLocaleDateString(
                            isRTL ? "ar-SA" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          
                          {/* زر التفاصيل */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-xl h-8 px-3 text-[#2a655f] hover:text-[#d81b60] hover:bg-[#f9a8d4]/20 transition-all duration-300 hover:scale-105 border-2 border-[#f9a8d4]/30"
                            onClick={() => {
                              setSelectedApp(a);
                              setShowDetailsDialog(true);
                            }}
                            title={isRTL ? "عرض التفاصيل" : "View details"}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>

                          {a.status === "pending" && (
                            <>
                              {/* زر الموافقة - يختلف حسب نوع الطلب */}
                              {a.application_type === "store" ? (
                                <Button
                                  size="sm"
                                  className="rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white shadow-lg shadow-[#f9a8d4]/30 border-2 border-[#f9a8d4]/50"
                                  onClick={() => {
                                    setPendingAppId(a.id);
                                    setShowDeliveryCompanyDialog(true);
                                  }}
                                  disabled={isProcessing}
                                  title={isRTL ? "موافقة على الطلب (اختر شركة توصيل)" : "Approve application (Select delivery company)"}
                                >
                                  {isProcessing && pendingAppId === a.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                  ) : (
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {isRTL ? "موافقة" : "Approve"}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-2 border-emerald-500/50"
                                  onClick={() => {
                                    decide(a.id, "approved");
                                  }}
                                  disabled={isProcessing}
                                  title={isRTL ? "موافقة على الطلب (بدون شركة توصيل)" : "Approve application (No delivery company)"}
                                >
                                  {isProcessing && pendingAppId === a.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                  ) : (
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {isRTL ? "موافقة" : "Approve"}
                                </Button>
                              )}

                              {/* زر الرفض */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl h-8 px-3 transition-all duration-300 border-2 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/50 hover:scale-105"
                                onClick={() => {
                                  if (isProcessing) {
                                    toast.warning(isRTL ? "⏳ جاري المعالجة..." : "⏳ Processing...");
                                    return;
                                  }
                                  setNoteFor(a.id);
                                  setNote("");
                                }}
                                disabled={isProcessing}
                                title={isRTL ? "رفض الطلب" : "Reject application"}
                              >
                                {isProcessing && noteFor === a.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                )}
                                {isRTL ? "رفض" : "Reject"}
                              </Button>
                            </>
                          )}
                          
                          {a.status !== "pending" && (
                            <div className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border-2",
                              a.status === "approved" 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" 
                                : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                            )}>
                              {a.status === "approved" ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5 animate-bounce-slow" />
                                  <span>{isRTL ? "تمت الموافقة" : "Approved"}</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3.5 w-3.5 animate-float" />
                                  <span>{isRTL ? "مرفوض" : "Rejected"}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {apps.length === 0 ? (
                <span>{isRTL ? "لا توجد طلبات" : "No applications"}</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" />
                  {isRTL
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} من ${totalCount} طلب`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} of ${totalCount} applications`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">«</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 transition-all duration-300 disabled:opacity-50"
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
                          ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white shadow-lg shadow-[#f9a8d4]/30 border-2 border-white/30 scale-105"
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
                      className="h-8 min-w-[32px] p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-xs transition-all duration-300 hover:scale-105"
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
                className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-3 border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Footer */}
        <div className="px-4 py-2 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10">
          <span className="flex items-center gap-2">
            <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
              {isRTL
                ? `عرض ${apps.length} من ${totalCount}`
                : `Showing ${apps.length} of ${totalCount}`}
            </Badge>
            <span className="text-[10px] text-[#d81b60]">
              {isRTL ? `إجمالي ${totalCount}` : `Total ${totalCount}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
              <Shield className="h-3 w-3 mr-1 text-[#d81b60]" />
              {filterStatus === "all" && (isRTL ? "جميع" : "All")}
              {filterStatus === "pending" && (isRTL ? "قيد المراجعة" : "Pending")}
              {filterStatus === "approved" && (isRTL ? "موافق" : "Approved")}
              {filterStatus === "rejected" && (isRTL ? "مرفوض" : "Rejected")}
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

      {/* ============================================================
      // ✅ REJECT DIALOG
      // ============================================================ */}
      <Dialog open={!!noteFor} onOpenChange={(o) => !o && setNoteFor(null)}>
        <DialogContent className="rounded-2xl max-w-md border-3 border-[#f9a8d4]/60 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => setNoteFor(null)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isRTL ? "رفض الطلب" : "Reject Application"}
                  </DialogTitle>
                  <DialogDescription>
                    {isRTL
                      ? "✍️ يرجى كتابة سبب الرفض لتوضيح السبب للمستخدم."
                      : "✍️ Please provide a reason for rejection to clarify to the user."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-sm font-medium flex items-center gap-1 text-[#2a655f]">
                  {isRTL ? "سبب الرفض" : "Rejection Reason"}
                  <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isRTL 
                    ? "✍️ اذكر سبب الرفض هنا (مطلوب)" 
                    : "✍️ Mention the reason for rejection here (required)"}
                  className={cn(
                    "mt-1.5 rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300",
                    !note && noteFor && "border-rose-500/50 focus-visible:ring-rose-500/20"
                  )}
                />
                {!note && noteFor && (
                  <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 animate-pulse">
                    <AlertCircle className="h-3 w-3" />
                    {isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-[#d81b60]" />
                  {isRTL 
                    ? "💡 هذا السبب سيظهر للمستخدم ليعرف سبب الرفض"
                    : "💡 This reason will be shown to the user to know why it was rejected"}
                </p>
              </div>
            </div>
            <DialogFooter className="gap-3 pt-4 border-t-3 border-[#f9a8d4]/30">
              <Button 
                variant="outline" 
                onClick={() => setNoteFor(null)}
                className="flex-1 rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  if (!note.trim()) {
                    toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason");
                    return;
                  }
                  noteFor && decide(noteFor, "rejected", note.trim());
                }}
                disabled={isProcessing}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 border-2 border-rose-400/50"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1.5" />
                )}
                {isRTL ? "تأكيد الرفض" : "Confirm Reject"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DETAILS DIALOG
      // ============================================================ */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="rounded-2xl max-w-lg border-3 border-[#f9a8d4]/60 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => setShowDetailsDialog(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#f9a8d4]/30 border-2 border-[#f9a8d4]/40">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isRTL ? "تفاصيل الطلب" : "Application Details"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {isRTL ? "جميع معلومات الطلب في مكان واحد" : "All application information in one place"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">{isRTL ? "اسم المتجر" : "Store Name"}</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-lg">{selectedApp.store_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500">{isRTL ? "نوع الطلب" : "Application Type"}</p>
                    <div className="mt-1"><TypeBadge type={selectedApp.application_type || "store"} /></div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500">{isRTL ? "الحالة" : "Status"}</p>
                    <div className="mt-1"><StatusBadge status={selectedApp.status} /></div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500">{isRTL ? "المتقدم" : "Applicant"}</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedApp.profiles?.full_name || "—"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500">{isRTL ? "الهاتف" : "Phone"}</p>
                    <p className="font-mono text-slate-900 dark:text-white">
                      {selectedApp.store_phone || selectedApp.profiles?.phone || "—"}
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">{isRTL ? "الوصف" : "Description"}</p>
                    <p className="text-slate-700 dark:text-slate-300 bg-[#f9a8d4]/10 p-3 rounded-xl border-2 border-[#f9a8d4]/30">
                      {selectedApp.store_description || (isRTL ? "لا يوجد وصف" : "No description")}
                    </p>
                  </div>
                  
                  {selectedApp.address && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">{isRTL ? "العنوان" : "Address"}</p>
                      <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-[#d81b60]" />
                        {selectedApp.address}
                      </p>
                    </div>
                  )}
                  
                  {selectedApp.admin_note && (
                    <div className="col-span-2 p-4 rounded-xl bg-[#f9a8d4]/20 border-2 border-[#f9a8d4]/50">
                      <p className="text-xs text-[#d81b60] flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {isRTL ? "ملاحظة الأدمن" : "Admin Note"}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedApp.admin_note}</p>
                    </div>
                  )}
                  
                  {selectedApp.opening_time && selectedApp.closing_time && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">{isRTL ? "أوقات العمل" : "Working Hours"}</p>
                      <p className="text-slate-700 dark:text-slate-300 font-mono">
                        {selectedApp.opening_time?.slice(0,5)} - {selectedApp.closing_time?.slice(0,5)}
                      </p>
                    </div>
                  )}
                  
                  {selectedApp.weekly_off_days && selectedApp.weekly_off_days.length > 0 && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">{isRTL ? "أيام العطل" : "Off Days"}</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        {selectedApp.weekly_off_days.map((day: string) => {
                          const dayMap: Record<string, string> = {
                            Monday: isRTL ? 'الإثنين' : 'Mon',
                            Tuesday: isRTL ? 'الثلاثاء' : 'Tue',
                            Wednesday: isRTL ? 'الأربعاء' : 'Wed',
                            Thursday: isRTL ? 'الخميس' : 'Thu',
                            Friday: isRTL ? 'الجمعة' : 'Fri',
                            Saturday: isRTL ? 'السبت' : 'Sat',
                            Sunday: isRTL ? 'الأحد' : 'Sun',
                          };
                          return dayMap[day] || day;
                        }).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t-3 border-[#f9a8d4]/30">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? "تاريخ الطلب" : "Request Date"}:{" "}
                    {new Date(selectedApp.created_at).toLocaleDateString(
                      isRTL ? "ar-SA" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetailsDialog(false)}
                    className="rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
                  >
                    {isRTL ? "إغلاق" : "Close"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DIALOG: اختيار شركة التوصيل عند الموافقة
      // ============================================================ */}
      <Dialog open={showDeliveryCompanyDialog} onOpenChange={setShowDeliveryCompanyDialog}>
        <DialogContent className="rounded-2xl max-w-md border-3 border-[#f9a8d4]/60 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => {
              setShowDeliveryCompanyDialog(false);
              setSelectedDeliveryCompanyId("");
              setPendingAppId("");
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
                  <DialogTitle className="text-xl font-bold text-[#2a655f] dark:text-white">
                    {isRTL ? "🚚 اختيار شركة التوصيل" : "🚚 Select Delivery Company"}
                  </DialogTitle>
                  <DialogDescription>
                    {isRTL 
                      ? "اختر شركة التوصيل التي ستخدم هذا المتجر" 
                      : "Select the delivery company for this store"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#2a655f] dark:text-white font-semibold">
                  {isRTL ? "شركة التوصيل *" : "Delivery Company *"}
                </Label>
                <Select 
                  value={selectedDeliveryCompanyId} 
                  onValueChange={setSelectedDeliveryCompanyId}
                >
                  <SelectTrigger className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300">
                    <SelectValue placeholder={isRTL ? "🔍 اختر شركة التوصيل..." : "🔍 Select delivery company..."} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
                    {deliveryCompanies.length === 0 ? (
                      <SelectItem value="no-company" disabled>
                        {isRTL ? "⚠️ لا توجد شركات توصيل موثقة" : "⚠️ No verified delivery companies"}
                      </SelectItem>
                    ) : (
                      deliveryCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <span className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#2a655f]" />
                            <span>{company.name_ar || company.name_en}</span>
                            <Badge className="text-[9px] bg-emerald-500/10 text-emerald-600 border-2 border-emerald-400/40">
                              ✅ {isRTL ? "موثقة" : "Verified"}
                            </Badge>
                            <Badge className="text-[9px] bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
                              {company.base_price || 0} SYP
                            </Badge>
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3 text-[#d81b60]" />
                  {isRTL 
                    ? "💡 هذه الشركة ستكون المسؤولة عن توصيل طلبات هذا المتجر"
                    : "💡 This company will handle delivery for this store"}
                </p>
              </div>
              
              {selectedDeliveryCompanyId && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {isRTL ? "✅ تم اختيار شركة التوصيل" : "✅ Delivery company selected"}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-3 pt-4 border-t-3 border-[#f9a8d4]/30">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeliveryCompanyDialog(false);
                  setSelectedDeliveryCompanyId("");
                  setPendingAppId("");
                }}
                className="flex-1 rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleApproveWithDelivery}
                disabled={!selectedDeliveryCompanyId || isProcessing}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white shadow-lg shadow-[#f9a8d4]/30 transition-all duration-300 hover:scale-[1.02] border-2 border-[#f9a8d4]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                {isRTL ? "تأكيد الموافقة" : "Confirm Approve"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
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

export default SellerApplicationsAdmin;