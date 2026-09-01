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
  Mail, Hash, Clock as ClockIcon, Info
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
// ✅ أيقونات متحركة للحالات - بألوان النظام
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
    color: "text-[#2d6b63]",
    bg: "bg-[#2d6b63]/10",
    border: "border-[#2d6b63]/30",
    icon: Clock,
    animation: "animate-pulse-slow"
  },
  approved: {
    label_ar: "موافق عليه",
    label_en: "Approved",
    color: "text-[#0d2e2a]",
    bg: "bg-[#0d2e2a]/10",
    border: "border-[#0d2e2a]/30",
    icon: CheckCircle2,
    animation: "animate-bounce-slow"
  },
  rejected: {
    label_ar: "مرفوض",
    label_en: "Rejected",
    color: "text-[#6bb5aa]",
    bg: "bg-[#6bb5aa]/10",
    border: "border-[#6bb5aa]/30",
    icon: XCircle,
    animation: "animate-float"
  },
};

// ============================================================
// ✅ مؤشر حيوي
// ============================================================
const LiveIndicator = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2d6b63] opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0d2e2a]" />
  </span>
);

// ============================================================
// ✅ Stat Card بألوان النظام
// ============================================================
const StatCard = ({ 
  label, 
  value, 
  gradient,
  bg,
  glow,
  icon: Icon, 
  animation,
  subtitle 
}: { 
  label: string; 
  value: number; 
  gradient: string;
  bg: string;
  glow: string;
  icon: any; 
  animation?: string;
  subtitle?: string;
}) => (
  <div className={cn(
    "group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-4 shadow-lg hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
  )}>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
    </div>
    <div className="flex items-center justify-between relative">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors">{value}</p>
        {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
      </div>
      <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${glow}`}>
        <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className={cn(
            "h-3.5 w-3.5 text-white",
            animation || "animate-float"
          )} />
        </div>
      </div>
    </div>
    <div className="mt-2 h-0.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`} 
        style={{ width: `${Math.min(100, value / 10 * 100)}%` }}
      />
    </div>
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
      "border-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105",
      config.bg,
      config.color,
      config.border,
      "border"
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
      bg: "bg-[#0d2e2a]/10",
      color: "text-[#0d2e2a]",
      animation: "animate-float"
    },
    product: {
      icon: ShoppingBag,
      label: isRTL ? "🛍️ إضافة منتج" : "🛍️ Add Product",
      bg: "bg-[#4a9f95]/10",
      color: "text-[#4a9f95]",
      animation: "animate-spin-slow"
    },
  };
  
  const config = configs[typeValue] || configs.store;
  const Icon = config.icon;
  
  return (
    <Badge className={cn(
      "border-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105",
      config.bg,
      config.color
    )}>
      <Icon className={cn("h-3 w-3", config.animation)} />
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
// ✅ دالة إشعار آمنة (لا تعلق أبداً)
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

  // ✅ ✅ ✅ جديد - State لشركة التوصيل
  const [selectedDeliveryCompanyId, setSelectedDeliveryCompanyId] = useState<string>("");
  const [deliveryCompanies, setDeliveryCompanies] = useState<any[]>([]);
  const [showDeliveryCompanyDialog, setShowDeliveryCompanyDialog] = useState(false);
  const [pendingAppId, setPendingAppId] = useState<string>("");

  // ✅ ✅ ✅ جلب شركات التوصيل الموثقة والنشطة فقط
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
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return { total, pending, approved, rejected, approvalRate };
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
          h1 { color: #0d2e2a; text-align: center; border-bottom: 3px solid #0d2e2a; padding-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #0d2e2a; }
          .stat-card .value { font-size: 22px; font-weight: bold; color: #0d2e2a; }
          .stat-card .label { font-size: 11px; color: #94a3b8; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          th { background: #0d2e2a; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
          tr:hover { background: #f1f5f9; }
          .status-pending { color: #2d6b63; font-weight: bold; }
          .status-approved { color: #0d2e2a; font-weight: bold; }
          .status-rejected { color: #6bb5aa; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          .badge-type-store { background: #0d2e2a10; color: #0d2e2a; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
          .badge-type-product { background: #4a9f9510; color: #4a9f95; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
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
  // ✅ الدالة الرئيسية - مُعاد كتابتها بالكامل وبشكل احترافي
  // ============================================================
  async function decide(id: string, status: "approved" | "rejected", admin_note?: string) {
    // ✅ منع التكرار
    if (isProcessing) {
      toast.warning(isRTL ? "⏳ جاري المعالجة..." : "⏳ Processing...");
      return;
    }

    // ✅ التحقق من صحة الإدخال
    if (status === "rejected" && (!admin_note || admin_note.trim() === "")) {
      toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection");
      return;
    }

    // ✅ تعيين حالة المعالجة
    setIsProcessing(true);
    let applicationData: any = null;
    let isCompleted = false;

    try {
      console.log(`🔍 [decide] Starting for application: ${id}, status: ${status}`);

      // ============================================================
      // 1️⃣ جلب بيانات الطلب (مع Timeout)
      // ============================================================
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

      // ============================================================
      // 2️⃣ تحديث حالة الطلب في قاعدة البيانات (مع Timeout)
      // ============================================================
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

      // ============================================================
      // 3️⃣ إشعار فوري للمستخدم (نجاح أو فشل)
      // ============================================================
      toast.success(
        status === "approved"
          ? isRTL ? "✅ تمت الموافقة على الطلب" : "✅ Application approved"
          : isRTL ? "❌ تم رفض الطلب" : "❌ Application rejected"
      );

      // ============================================================
      // 4️⃣ معالجة الموافقة أو الرفض
      // ============================================================
      if (status === "approved") {
        
        // ✅ ===== الموافقة على متجر =====
        if (appData.application_type === 'store') {
          const storeDescription = appData.store_description?.trim() || null;
          
          // ✅ ✅ ✅ إضافة delivery_company_id إلى التحديث
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

          // ✅ ✅ ✅ إذا تم اختيار شركة توصيل، أضفها
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
            
            // ✅ ✅ ✅ ✅ ✅ إضافة رول seller للمستخدم ✅ ✅ ✅ ✅ ✅
            const { error: roleError } = await supabase
              .from("user_roles")
              .insert({
                user_id: appData.user_id,
                role: 'seller'
              });

            if (roleError) {
              console.error("❌ Error adding seller role:", roleError);
              toast.warning(
                isRTL 
                  ? "⚠️ تمت الموافقة لكن فشل إضافة رول البائع" 
                  : "⚠️ Approved but failed to add seller role"
              );
            } else {
              console.log(`✅ Seller role added for user: ${appData.user_id}`);
            }
          }

          // ✅ ✅ ✅ إشعار موافقة متجر - يفتح تبويب الإعدادات ✅ ✅ ✅
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
          }).then(success => {
            if (success) {
              console.log(`✅ [decide] Notification sent successfully`);
            } else {
              console.warn(`⚠️ [decide] Notification failed but application was approved`);
            }
          });
        }

        // ✅ ===== الموافقة على منتج =====
        if (appData.application_type === 'product') {
          // ✅ البحث عن المنتج
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

          // ✅ ✅ ✅ إشعار موافقة منتج - يفتح تبويب المنتجات ✅ ✅ ✅
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
          }).then(success => {
            if (success) {
              console.log(`✅ [decide] Notification sent successfully`);
            } else {
              console.warn(`⚠️ [decide] Notification failed but product was approved`);
            }
          });
        }

      } else {
        
        // ❌ ===== رفض متجر =====
        if (appData.application_type === 'store') {
          // ✅ ✅ ✅ إشعار رفض متجر - يفتح تبويب نظرة عامة ✅ ✅ ✅
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
          }).then(success => {
            if (success) {
              console.log(`✅ [decide] Rejection notification sent`);
            } else {
              console.warn(`⚠️ [decide] Rejection notification failed but application was rejected`);
            }
          });
        }

        // ❌ ===== رفض منتج =====
        if (appData.application_type === 'product') {
          // ✅ البحث عن المنتج
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

          // ✅ ✅ ✅ إشعار رفض منتج - يفتح تبويب المنتجات ✅ ✅ ✅
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
          }).then(success => {
            if (success) {
              console.log(`✅ [decide] Product rejection notification sent`);
            } else {
              console.warn(`⚠️ [decide] Product rejection notification failed`);
            }
          });
        }
      }

      // ============================================================
      // 5️⃣ إعادة تحميل البيانات
      // ============================================================
      await refetch();

      // ============================================================
      // 6️⃣ تنظيف الـ UI
      // ============================================================
      setNoteFor(null);
      setNote("");
      setShowDeliveryCompanyDialog(false);
      setSelectedDeliveryCompanyId("");
      setPendingAppId("");

      console.log(`✅ [decide] Complete for application: ${id}`);

    } catch (error: any) {
      console.error("❌ [decide] Fatal error:", error);
      
      // ✅ إذا كانت العملية مكتملة ولكن حدث خطأ في الإشعار أو التحديث
      if (isCompleted) {
        toast.warning(
          isRTL 
            ? "⚠️ تم تحديث الطلب ولكن حدث خطأ في خطوة ثانوية" 
            : "⚠️ Application updated but a secondary step failed"
        );
      } else {
        // ✅ فشل كامل
        const errorMessage = error.message || String(error);
        
        if (errorMessage.includes("timeout")) {
          toast.error(
            isRTL 
              ? "⏱️ انتهت المهلة، يرجى المحاولة مرة أخرى" 
              : "⏱️ Request timeout, please try again"
          );
        } else if (errorMessage.includes("لا يمكنك تقديم أكثر من طلب واحد")) {
          toast.error(isRTL ? "⛔ هذا المستخدم لديه طلب سابق بالفعل" : "⛔ This user already has an existing application");
        } else if (errorMessage.includes("لديك متجر مفعل")) {
          toast.error(isRTL ? "✅ هذا المستخدم لديه متجر مفعل بالفعل" : "✅ This user already has an active store");
        } else {
          toast.error(
            isRTL 
              ? `❌ فشل العملية: ${errorMessage}` 
              : `❌ Operation failed: ${errorMessage}`
          );
        }
      }

    } finally {
      // ✅ ✅ ✅ دائماً نحرر حالة المعالجة
      setIsProcessing(false);
      console.log(`🏁 [decide] Finished for application: ${id}`);
    }
  }

  // ✅ دالة للموافقة مع شركة توصيل
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-[#0d2e2a] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* ============================================================
      // ✅ HEADER - مثل AdminStores
      // ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
              <Layers className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {app.lang === "ar" ? "الطلبات" : "Applications"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {app.lang === 'ar' ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {app.lang === "ar"
              ? `إدارة جميع الطلبات (${apps.length} من ${totalCount})`
              : `Manage all applications (${apps.length} of ${totalCount})`}
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
              disabled={apps.length === 0}
              className="rounded-lg h-9 px-4 text-[#2d6b63] hover:bg-[#2d6b63]/10 hover:text-[#2d6b63] gap-2 transition-all duration-300 hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Excel</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToWord}
              disabled={apps.length === 0}
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

      {/* ============================================================
      // ✅ STATS CARDS - مثل AdminStores
      // ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          label={isRTL ? 'إجمالي الطلبات' : 'Total Applications'} 
          value={stats.total} 
          gradient="from-[#0d2e2a] to-[#1a4f4a]"
          bg="bg-[#0d2e2a]/10"
          glow="shadow-[#0d2e2a]/20"
          icon={Layers}
          animation="animate-float"
        />
        <StatCard 
          label={isRTL ? 'قيد المراجعة' : 'Pending'} 
          value={stats.pending} 
          gradient="from-[#2d6b63] to-[#4a9f95]"
          bg="bg-[#2d6b63]/10"
          glow="shadow-[#2d6b63]/20"
          icon={Clock}
          animation="animate-pulse-slow"
        />
        <StatCard 
          label={isRTL ? 'موافق عليه' : 'Approved'} 
          value={stats.approved} 
          gradient="from-[#0d2e2a] to-[#2d6b63]"
          bg="bg-[#0d2e2a]/10"
          glow="shadow-[#0d2e2a]/20"
          icon={CheckCircle2}
          animation="animate-bounce-slow"
        />
        <StatCard 
          label={isRTL ? 'مرفوض' : 'Rejected'} 
          value={stats.rejected} 
          gradient="from-[#4a9f95] to-[#6bb5aa]"
          bg="bg-[#4a9f95]/10"
          glow="shadow-[#4a9f95]/20"
          icon={XCircle}
          animation="animate-float"
        />
      </div>

      {/* ============================================================
      // ✅ SEARCH & FILTERS
      // ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#0d2e2a] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isRTL ? "🔍 بحث عن طلب..." : "🔍 Search applications..."}
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
              <SelectValue placeholder={isRTL ? "جميع الحالات" : "All status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📋 {isRTL ? "جميع الحالات" : "All"}</SelectItem>
            <SelectItem value="pending">⏳ {isRTL ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="approved">✅ {isRTL ? "موافق" : "Approved"}</SelectItem>
            <SelectItem value="rejected">❌ {isRTL ? "مرفوض" : "Rejected"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterType}
          onValueChange={(value: any) => {
            setFilterType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] hover:border-[#0d2e2a]/40 transition-colors">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0d2e2a]" />
              <SelectValue placeholder={isRTL ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📦 {isRTL ? "جميع الأنواع" : "All"}</SelectItem>
            <SelectItem value="store">🏪 {isRTL ? "فتح متجر" : "Open Store"}</SelectItem>
            <SelectItem value="product">🛍️ {isRTL ? "إضافة منتج" : "Add Product"}</SelectItem>
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
            setFilterType("all");
            setPage(1);
          }}
          className="h-10 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 hover:scale-105"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {isRTL ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ============================================================
      // ✅ TABLE - مثل AdminStores
      // ============================================================ */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg shadow-[#0d2e2a]/5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300">
        <div className="overflow-x-auto" ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow className="border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-transparent bg-gradient-to-r from-[#0d2e2a]/5 to-[#1a4f4a]/5">
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-right min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Store className="h-3.5 w-3.5" />
                    {isRTL ? "المتقدم / المتجر" : "Applicant / Store"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="h-3.5 w-3.5" />
                    {isRTL ? "النوع" : "Type"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {isRTL ? "الهاتف" : "Phone"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {isRTL ? "تاريخ الطلب" : "Date"}
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
              {apps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center animate-bounce-slow">
                        <Layers className="h-8 w-8 text-[#0d2e2a]/40" />
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
                        "border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 transition-all duration-300 group",
                        a.status === "pending" ? "bg-[#2d6b63]/5 dark:bg-[#2d6b63]/10" : "",
                        "hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/10"
                      )}
                      onMouseEnter={() => setHoveredRow(a.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
                            isHovered ? "scale-105 rotate-6" : "",
                            a.store_logo_url ? "" : "bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a]"
                          )}>
                            {a.store_logo_url ? (
                              <img src={a.store_logo_url} alt="" className="h-11 w-11 rounded-xl object-cover" />
                            ) : (
                              <Store className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#0d2e2a] transition-colors">
                              <span className="truncate">{a.store_name}</span>
                              {a.store_type && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#0d2e2a]/20">
                                  {a.store_type === "physical" ? "🏪" : "🌐"}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <User className="h-3 w-3" />
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
                      
                      <TableCell className="text-center">
                        <TypeBadge type={a.application_type || "store"} />
                      </TableCell>
                      
                      <TableCell dir="ltr" className="text-sm text-slate-600 dark:text-slate-300 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Phone className="h-3 w-3 text-[#4a9f95]" />
                          {a.store_phone || a.profiles?.phone || "—"}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <StatusBadge status={a.status} />
                        {a.reviewed_at && a.status !== "pending" && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(a.reviewed_at).toLocaleDateString(
                              isRTL ? "ar-SA" : "en-US"
                            )}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#4a9f95]" />
                          {new Date(a.created_at).toLocaleDateString(
                            isRTL ? "ar-SA" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </div>
                      </TableCell>
                      
               <TableCell className="text-center">
  <div className="flex items-center justify-center gap-1.5 flex-wrap">
    
    {/* ✅ زر التفاصيل */}
    <Button
      size="sm"
      variant="ghost"
      className="rounded-xl h-8 px-3 text-[#4a9f95] hover:text-[#0d2e2a] hover:bg-[#0d2e2a]/10 transition-all duration-300 hover:scale-105"
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
        {/* ✅ زر الموافقة - يختلف حسب نوع الطلب */}
        {a.application_type === "store" ? (
          // ✅ طلب فتح متجر → يفتح Dialog اختيار شركة التوصيل
          <Button
            size="sm"
            className={cn(
              "rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105",
              "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30"
            )}
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
          // ✅ طلب إضافة منتج → موافقة مباشرة (بدون شركة توصيل)
          <Button
            size="sm"
            className={cn(
              "rounded-xl h-8 px-3 transition-all duration-300 hover:scale-105",
              "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
            )}
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

        {/* ✅ زر الرفض */}
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "rounded-xl h-8 px-3 transition-all duration-300",
            "border-[#6bb5aa]/30 text-[#6bb5aa] hover:bg-[#6bb5aa]/10 hover:border-[#6bb5aa]/50",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
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
        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium",
        a.status === "approved" 
          ? "bg-[#0d2e2a]/10 text-[#0d2e2a]" 
          : "bg-[#6bb5aa]/10 text-[#6bb5aa]"
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

        {/* ============================================================
        // ✅ PAGINATION - مثل AdminStores
        // ============================================================ */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {apps.length === 0 ? (
                <span>{isRTL ? "لا توجد طلبات" : "No applications"}</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d6b63] animate-pulse" />
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
              {isRTL
                ? `عرض ${apps.length} من ${totalCount}`
                : `Showing ${apps.length} of ${totalCount}`}
            </Badge>
            <span className="text-[10px] text-[#2d6b63]">
              {isRTL ? `إجمالي ${totalCount}` : `Total ${totalCount}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#0d2e2a]/5 text-[#0d2e2a] border border-[#0d2e2a]/20">
              <Shield className="h-3 w-3 mr-1" />
              {filterStatus === "all" && (isRTL ? "جميع" : "All")}
              {filterStatus === "pending" && (isRTL ? "قيد المراجعة" : "Pending")}
              {filterStatus === "approved" && (isRTL ? "موافق" : "Approved")}
              {filterStatus === "rejected" && (isRTL ? "مرفوض" : "Rejected")}
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
      // ✅ REJECT DIALOG - بألوان النظام
      // ============================================================ */}
      <Dialog open={!!noteFor} onOpenChange={(o) => !o && setNoteFor(null)}>
        <DialogContent className="rounded-2xl max-w-md p-6 border border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#6bb5aa]" />
              {isRTL ? "رفض الطلب" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? "✍️ يرجى كتابة سبب الرفض لتوضيح السبب للمستخدم."
                : "✍️ Please provide a reason for rejection to clarify to the user."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1 text-[#0d2e2a]">
                {isRTL ? "سبب الرفض" : "Rejection Reason"}
                <span className="text-[#6bb5aa]">*</span>
              </Label>
              <Textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isRTL 
                  ? "✍️ اذكر سبب الرفض هنا (مطلوب)" 
                  : "✍️ Mention the reason for rejection here (required)"}
                className={cn(
                  "mt-1.5 rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300",
                  !note && noteFor && "border-[#6bb5aa]/50 focus-visible:ring-[#6bb5aa]/20"
                )}
              />
              {!note && noteFor && (
                <p className="text-xs text-[#6bb5aa] mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection"}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {isRTL 
                  ? "💡 هذا السبب سيظهر للمستخدم ليعرف سبب الرفض"
                  : "💡 This reason will be shown to the user to know why it was rejected"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteFor(null)} className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10">
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!note.trim()) {
                  toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason");
                  return;
                }
                noteFor && decide(noteFor, "rejected", note.trim());
              }}
              disabled={isProcessing}
              className="rounded-xl bg-gradient-to-r from-[#6bb5aa] to-[#4a9f95] hover:from-[#4a9f95] hover:to-[#2d6b63] text-white shadow-lg shadow-[#6bb5aa]/30 transition-all duration-300 hover:scale-105"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <XCircle className="h-4 w-4 mr-1.5" />
              )}
              {isRTL ? "تأكيد الرفض" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DETAILS DIALOG - بألوان النظام
      // ============================================================ */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="rounded-2xl max-w-lg p-6 border border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                <Store className="h-4 w-4 text-white" />
              </div>
              {isRTL ? "تفاصيل الطلب" : "Application Details"}
            </DialogTitle>
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
                  <div className="mt-1">{TypeBadge({ type: selectedApp.application_type || "store" })}</div>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500">{isRTL ? "الحالة" : "Status"}</p>
                  <div className="mt-1">{StatusBadge({ status: selectedApp.status })}</div>
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
                  <p className="text-slate-700 dark:text-slate-300 bg-[#0d2e2a]/5 p-3 rounded-xl border border-[#0d2e2a]/10">
                    {selectedApp.store_description || (isRTL ? "لا يوجد وصف" : "No description")}
                  </p>
                </div>
                
                {selectedApp.address && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">{isRTL ? "العنوان" : "Address"}</p>
                    <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#4a9f95]" />
                      {selectedApp.address}
                    </p>
                  </div>
                )}
                
                {selectedApp.admin_note && (
                  <div className="col-span-2 p-4 rounded-xl bg-[#2d6b63]/10 border border-[#2d6b63]/30">
                    <p className="text-xs text-[#2d6b63] flex items-center gap-1">
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
              
              <div className="flex items-center justify-between pt-3 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#4a9f95]" />
                  {isRTL ? "تاريخ الطلب" : "Request Date"}:{" "}
                  {new Date(selectedApp.created_at).toLocaleDateString(
                    isRTL ? "ar-SA" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailsDialog(false)}
                  className="rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300"
                >
                  {isRTL ? "إغلاق" : "Close"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DIALOG: اختيار شركة التوصيل عند الموافقة
      // ============================================================ */}
      <Dialog open={showDeliveryCompanyDialog} onOpenChange={setShowDeliveryCompanyDialog}>
        <DialogContent className="rounded-2xl max-w-md border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2d6b63]/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-[#2d6b63]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#0d2e2a] dark:text-white">
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
              <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                {isRTL ? "شركة التوصيل *" : "Delivery Company *"}
              </Label>
              <Select 
                value={selectedDeliveryCompanyId} 
                onValueChange={setSelectedDeliveryCompanyId}
              >
                <SelectTrigger className="rounded-xl border-[#0d2e2a]/20">
                  <SelectValue placeholder={isRTL ? "🔍 اختر شركة التوصيل..." : "🔍 Select delivery company..."} />
                </SelectTrigger>
                <SelectContent>
                  {deliveryCompanies.length === 0 ? (
                    <SelectItem value="no-company" disabled>
                      {isRTL ? "⚠️ لا توجد شركات توصيل موثقة" : "⚠️ No verified delivery companies"}
                    </SelectItem>
                  ) : (
                    deliveryCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <span className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-[#2d6b63]" />
                          <span>{company.name_ar || company.name_en}</span>
                          <Badge className="text-[9px] bg-emerald-500/10 text-emerald-600 border-0">
                            ✅ {isRTL ? "موثقة" : "Verified"}
                          </Badge>
                          <Badge className="text-[9px] bg-[#2d6b63]/10 text-[#2d6b63] border-0">
                            {company.base_price || 0} SYP
                          </Badge>
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {isRTL 
                  ? "💡 هذه الشركة ستكون المسؤولة عن توصيل طلبات هذا المتجر"
                  : "💡 This company will handle delivery for this store"}
              </p>
            </div>
            
            {selectedDeliveryCompanyId && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {isRTL ? "✅ تم اختيار شركة التوصيل" : "✅ Delivery company selected"}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeliveryCompanyDialog(false);
                setSelectedDeliveryCompanyId("");
                setPendingAppId("");
              }}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleApproveWithDelivery}
              disabled={!selectedDeliveryCompanyId || isProcessing}
              className="rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              {isRTL ? "تأكيد الموافقة" : "Confirm Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ CSS Animations
      // ============================================================ */}
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

export default SellerApplicationsAdmin;