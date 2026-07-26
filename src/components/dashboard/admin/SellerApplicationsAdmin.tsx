// src/components/dashboard/admin/SellerApplicationsAdmin.tsx

import { useState, useMemo, useRef } from "react";
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
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { supabase } from "@/integrations/supabase/client";
import { useSendNotificationV2 } from "@/lib/queries";

const { saveAs } = fileSaver;

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
  
  // ✅ جلب البيانات مع Pagination والفلترة
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

  // ✅ دالة تصدير إلى Excel
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
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  // ✅ دالة تصدير إلى Word
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #3b82f6; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #f8fafc; }
          .status-pending { color: #f59e0b; font-weight: bold; }
          .status-approved { color: #10b981; font-weight: bold; }
          .status-rejected { color: #ef4444; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير الطلبات</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
          ${filterStatus !== 'all' ? ` | الحالة: ${filterStatus}` : ''}
          ${filterType !== 'all' ? ` | النوع: ${filterType === 'product' ? 'إضافة منتج' : 'فتح متجر'}` : ''}
        </p>
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
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${a.store_name}</td>
          <td>${typeText}</td>
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
        <div class="footer">
          إجمالي الطلبات: ${totalCount} | تم التصدير من لوحة التحكم
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `الطلبات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ============================================================
  // ✅ الدالة الرئيسية: الموافقة أو الرفض (معدلة لاستخدام V2)
  // ============================================================
  async function decide(id: string, status: "approved" | "rejected", admin_note?: string) {
    // ✅ منع النقر المتكرر
    if (isProcessing) {
      toast.warning(app.lang === "ar" ? "⏳ جاري المعالجة..." : "⏳ Processing...");
      return;
    }

    // ✅ التحقق: الرفض يحتاج سبب
    if (status === "rejected" && (!admin_note || admin_note.trim() === "")) {
      toast.error(app.lang === "ar" ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ 1. جلب بيانات الطلب
      const { data: appData, error: fetchError } = await supabase
        .from("seller_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !appData) {
        toast.error(app.lang === "ar" ? "❌ فشل جلب بيانات الطلب" : "❌ Failed to fetch application");
        setIsProcessing(false);
        return;
      }

      console.log("📝 Application data:", {
        store_name: appData.store_name,
        user_id: appData.user_id,
        status: appData.status,
        application_type: appData.application_type,
        admin_note: admin_note
      });

      // ✅ 2. تنفيذ المراجعة (تحديث حالة الطلب)
      await review.mutateAsync({ id, status, admin_note: admin_note || null });

      // ✅ 3. إذا كانت الموافقة
      if (status === "approved") {
        
        // ✅ 3a. تحديث `profiles` (لطلبات فتح متجر)
        if (appData.application_type === 'store') {
          const storeDescription = appData.store_description?.trim() || null;
          
          console.log("📝 Updating profile with:", {
            store_name: appData.store_name,
            store_description: storeDescription,
            store_logo_url: appData.store_logo_url,
            store_cover_url: appData.store_cover_url,
            store_type: appData.store_type,
            address: appData.address,
            opening_time: appData.opening_time,
            closing_time: appData.closing_time,
            weekly_off_days: appData.weekly_off_days,
            user_id: appData.user_id
          });

          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              store_name: appData.store_name,
              store_description: storeDescription,
              store_logo_url: appData.store_logo_url,
              store_cover_url: appData.store_cover_url,
              store_phone: appData.store_phone,
              allows_messaging: appData.allows_messaging,
              allows_bookings: appData.allows_bookings,
              store_type: appData.store_type || 'online',
              governorate_id: appData.governorate_id,
              store_address: appData.address,
              store_opens_at: appData.opening_time,
              store_closes_at: appData.closing_time,
              weekly_off_days: appData.weekly_off_days || [],
              store_active: true,
              store_online: true,
            })
            .eq("id", appData.user_id);

          if (profileError) {
            console.error("❌ Error updating profile:", profileError);
            toast.error(app.lang === "ar" ? "⚠️ تمت الموافقة لكن فشل تحديث بيانات المتجر" : "⚠️ Approved but failed to update store data");
          } else {
            console.log("✅ Profile updated successfully!");
          }
        }

        // ✅ 3b. تحديث حالة المنتج في `listings` (لطلبات إضافة منتج)
        if (appData.application_type === 'product') {
          console.log("📝 Updating listing status to published for product description:", appData.store_description);

          const productNameMatch = appData.store_description?.match(/طلب إضافة منتج: (.+)/);
          const productName = productNameMatch ? productNameMatch[1] : null;

          if (productName) {
            const { data: listing, error: listingError } = await supabase
              .from("listings")
              .select("id, title_ar")
              .eq("owner_id", appData.user_id)
              .eq("title_ar", productName)
              .eq("status", "pending")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (listingError) {
              console.error("❌ Error finding listing:", listingError);
            } else if (listing) {
              const { error: updateError } = await supabase
                .from("listings")
                .update({ status: 'published' })
                .eq("id", listing.id);

              if (updateError) {
                console.error("❌ Error updating listing status:", updateError);
                toast.error(app.lang === "ar" ? "⚠️ تمت الموافقة لكن فشل نشر المنتج" : "⚠️ Approved but failed to publish product");
              } else {
                console.log("✅ Listing published successfully!");
              }
            }
          }
        }

        // ✅ 4. إرسال إشعار للمستخدم (موافقة) - باستخدام V2
        const notificationType = appData.application_type === 'store' ? 'store_approved' : 'product_approved';
        const linkUrl = appData.application_type === 'store' ? '/dashboard/store' : '/dashboard/products';
        
        await sendNotification.mutateAsync({
          userId: appData.user_id,
          type: notificationType,
          titleAr: "✅ تمت الموافقة على طلبك",
          bodyAr: appData.application_type === 'store'
            ? `تمت الموافقة على طلب فتح متجر "${appData.store_name}" 🎉`
            : `تمت الموافقة على إضافة المنتج، وهو الآن متاح للبيع 🛍️`,
          linkUrl: linkUrl,
          metadata: {
            application_id: appData.id,
            store_name: appData.store_name,
            application_type: appData.application_type,
            admin_note: admin_note || null,
          },
          actions: [
            { label_ar: appData.application_type === 'store' ? 'عرض متجري' : 'عرض المنتج', url: linkUrl },
          ]
        });

      } else {
        // ✅ الرفض: إرسال إشعار للمستخدم مع سبب الرفض - باستخدام V2
        const notificationType = appData.application_type === 'store' ? 'store_rejected' : 'product_rejected';
        
        await sendNotification.mutateAsync({
          userId: appData.user_id,
          type: notificationType,
          titleAr: "❌ تم رفض طلبك",
          bodyAr: appData.application_type === 'store'
            ? `تم رفض طلب فتح متجر "${appData.store_name}"${admin_note ? `: ${admin_note}` : ''}`
            : `تم رفض طلب إضافة المنتج${admin_note ? `: ${admin_note}` : ''}`,
          linkUrl: '/dashboard',
          metadata: {
            application_id: appData.id,
            store_name: appData.store_name,
            reason: admin_note || null,
            application_type: appData.application_type,
          },
          actions: [
            { label_ar: 'مراجعة الطلب', url: '/dashboard' },
          ]
        });
      }

      toast.success(
        status === "approved"
          ? app.lang === "ar"
            ? "✅ تمت الموافقة على الطلب"
            : "✅ Application approved"
          : app.lang === "ar"
          ? "❌ تم رفض الطلب"
          : "❌ Application rejected"
      );
      
      setNoteFor(null);
      setNote("");
      refetch();
      
    } catch (e: any) {
      console.error("❌ Error in decide:", e);
      const errorMessage = e.message || String(e);
      
      if (errorMessage.includes("لا يمكنك تقديم أكثر من طلب واحد")) {
        toast.error(app.lang === "ar" ? "⛔ هذا المستخدم لديه طلب سابق بالفعل" : "⛔ This user already has an existing application");
      } else if (errorMessage.includes("لديك متجر مفعل")) {
        toast.error(app.lang === "ar" ? "✅ هذا المستخدم لديه متجر مفعل بالفعل" : "✅ This user already has an active store");
      } else {
        toast.error(app.lang === "ar" ? `❌ فشل العملية: ${errorMessage}` : `❌ Operation failed: ${errorMessage}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 animate-pulse">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {app.lang === "ar" ? "قيد المراجعة" : "Pending"}
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            {app.lang === "ar" ? "موافق عليه" : "Approved"}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            {app.lang === "ar" ? "مرفوض" : "Rejected"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeValue = type || "store";
    
    switch (typeValue) {
      case "store":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Building2 className="h-3 w-3 mr-1" />
            {app.lang === "ar" ? "فتح متجر" : "Open Store"}
          </Badge>
        );
      case "product":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <ShoppingBag className="h-3 w-3 mr-1" />
            {app.lang === "ar" ? "إضافة منتج" : "Add Product"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-500">
            {app.lang === "ar" ? "غير معروف" : "Unknown"}
          </Badge>
        );
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" />
            {app.lang === "ar" ? "الطلبات" : "Applications"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? `إدارة جميع الطلبات (${totalCount})`
              : `Manage all applications (${totalCount})`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={apps.length === 0}
            className="rounded-xl border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500/50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={apps.length === 0}
            className="rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500/50"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Word
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ✅ Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "بحث عن طلب..." : "Search applications..."}
            className="ps-9 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <Select 
          value={filterStatus} 
          onValueChange={(value: any) => {
            setFilterStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "جميع الحالات" : "All status"}</SelectItem>
            <SelectItem value="pending">{app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="approved">{app.lang === "ar" ? "موافق" : "Approved"}</SelectItem>
            <SelectItem value="rejected">{app.lang === "ar" ? "مرفوض" : "Rejected"}</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filterType} 
          onValueChange={(value: any) => {
            setFilterType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "جميع الأنواع" : "All types"}</SelectItem>
            <SelectItem value="store">{app.lang === "ar" ? "🏪 فتح متجر" : "🏪 Open Store"}</SelectItem>
            <SelectItem value="product">{app.lang === "ar" ? "🛍️ إضافة منتج" : "🛍️ Add Product"}</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={String(limit)} 
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{app.lang === "ar" ? "عدد" : "Show"}</span>
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
          className="h-10 rounded-xl border-slate-200 dark:border-slate-700"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ✅ Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto" ref={tableRef}>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-slate-50/50 dark:bg-slate-800/30">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[200px]">
                  {app.lang === "ar" ? "المتقدم / المتجر" : "Applicant / Store"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "النوع" : "Type"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "الهاتف" : "Phone"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "تاريخ الطلب" : "Date"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[240px]">
                  {app.lang === "ar" ? "إجراء" : "Action"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && apps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Layers className="h-12 w-12 text-slate-300" />
                      <p className="font-medium">{app.lang === "ar" ? "لا توجد طلبات" : "No applications"}</p>
                      <p className="text-sm">{app.lang === "ar" ? "جميع الطلبات تمت مراجعتها" : "All applications have been reviewed"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {apps.map((a: any) => (
                <TableRow 
                  key={a.id} 
                  className={`border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                    a.status === "pending" ? "bg-yellow-50/30 dark:bg-yellow-950/10" : ""
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 rounded-xl flex-shrink-0">
                        {a.store_logo_url ? (
                          <img src={a.store_logo_url} alt="" className="h-11 w-11 rounded-xl object-cover" />
                        ) : (
                          <AvatarFallback className="bg-blue-500/10 text-blue-600 rounded-xl">
                            <Store className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {a.store_name}
                          </span>
                          {a.store_type && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {a.store_type === "physical" ? "🏪" : "🌐"}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
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
                  <TableCell className="text-center">{getTypeBadge(a.application_type || "store")}</TableCell>
                  <TableCell dir="ltr" className="text-sm text-slate-600 dark:text-slate-300 text-center">
                    {a.store_phone || a.profiles?.phone || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(a.status)}
                    {a.reviewed_at && a.status !== "pending" && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(a.reviewed_at).toLocaleDateString(
                          app.lang === "ar" ? "ar-SA" : "en-US"
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(a.created_at).toLocaleDateString(
                        app.lang === "ar" ? "ar-SA" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl h-8 px-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50/50"
                        onClick={() => {
                          setSelectedApp(a);
                          setShowDetailsDialog(true);
                        }}
                        title={app.lang === "ar" ? "عرض التفاصيل" : "View details"}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      {a.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-8 px-3 disabled:opacity-50"
                            onClick={() => decide(a.id, "approved")}
                            disabled={isProcessing}
                            title={app.lang === "ar" ? "موافقة على الطلب" : "Approve application"}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            )}
                            {app.lang === "ar" ? "موافقة" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50 disabled:opacity-50"
                            onClick={() => {
                              setNoteFor(a.id);
                              setNote("");
                            }}
                            disabled={isProcessing}
                            title={app.lang === "ar" ? "رفض الطلب" : "Reject application"}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            {app.lang === "ar" ? "رفض" : "Reject"}
                          </Button>
                        </>
                      )}
                      {a.status !== "pending" && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          {a.status === "approved" ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-emerald-600">{app.lang === "ar" ? "تمت الموافقة" : "Approved"}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5 text-rose-500" />
                              <span className="text-rose-600">{app.lang === "ar" ? "مرفوض" : "Rejected"}</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {totalCount === 0 ? (
                <span>{app.lang === "ar" ? "لا توجد طلبات" : "No applications"}</span>
              ) : (
                <span>
                  {app.lang === "ar"
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
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
                title={app.lang === "ar" ? "الصفحة الأولى" : "First page"}
              >
                <span className="text-xs">«</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
                title={app.lang === "ar" ? "السابق" : "Previous"}
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
                      className={`h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all ${
                        page === pageNum
                          ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-300"
                      }`}
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
                      className="h-8 min-w-[32px] p-0 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs"
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
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
                title={app.lang === "ar" ? "التالي" : "Next"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-slate-200 dark:border-slate-700"
                title={app.lang === "ar" ? "الصفحة الأخيرة" : "Last page"}
              >
                <span className="text-xs">»</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Dialog للرفض - مع جعل الحقل مطلوب */}
      <Dialog open={!!noteFor} onOpenChange={(o) => !o && setNoteFor(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              {app.lang === "ar" ? "رفض الطلب" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {app.lang === "ar"
                ? "✍️ يرجى كتابة سبب الرفض لتوضيح السبب للمستخدم."
                : "✍️ Please provide a reason for rejection to clarify to the user."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={app.lang === "ar" 
                  ? "✍️ اذكر سبب الرفض هنا (مطلوب)" 
                  : "✍️ Mention the reason for rejection here (required)"}
                className={`mt-1.5 rounded-xl resize-none ${
                  !note && noteFor ? 'border-rose-500/50 focus-visible:ring-rose-500/20' : ''
                }`}
              />
              {!note && noteFor && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {app.lang === "ar" ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection"}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                {app.lang === "ar" 
                  ? "💡 هذا السبب سيظهر للمستخدم ليعرف سبب الرفض"
                  : "💡 This reason will be shown to the user to know why it was rejected"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteFor(null)}>
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!note.trim()) {
                  toast.error(app.lang === "ar" ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason");
                  return;
                }
                noteFor && decide(noteFor, "rejected", note.trim());
              }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <XCircle className="h-4 w-4 mr-1.5" />
              )}
              {app.lang === "ar" ? "تأكيد الرفض" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Dialog لعرض التفاصيل */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-600" />
              {app.lang === "ar" ? "تفاصيل الطلب" : "Application Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">{app.lang === "ar" ? "اسم المتجر" : "Store Name"}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedApp.store_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{app.lang === "ar" ? "نوع الطلب" : "Application Type"}</p>
                  {getTypeBadge(selectedApp.application_type || "store")}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{app.lang === "ar" ? "الحالة" : "Status"}</p>
                  <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{app.lang === "ar" ? "المتقدم" : "Applicant"}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.profiles?.full_name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{app.lang === "ar" ? "الهاتف" : "Phone"}</p>
                  <p className="font-mono text-slate-900 dark:text-white">
                    {selectedApp.store_phone || selectedApp.profiles?.phone || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">{app.lang === "ar" ? "الوصف" : "Description"}</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {selectedApp.store_description || (app.lang === "ar" ? "لا يوجد وصف" : "No description")}
                  </p>
                </div>
                {selectedApp.address && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">{app.lang === "ar" ? "العنوان" : "Address"}</p>
                    <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {selectedApp.address}
                    </p>
                  </div>
                )}
                {selectedApp.admin_note && (
                  <div className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {app.lang === "ar" ? "ملاحظة الأدمن" : "Admin Note"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedApp.admin_note}</p>
                  </div>
                )}
                {selectedApp.opening_time && selectedApp.closing_time && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">{app.lang === "ar" ? "أوقات العمل" : "Working Hours"}</p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {selectedApp.opening_time?.slice(0,5)} - {selectedApp.closing_time?.slice(0,5)}
                    </p>
                  </div>
                )}
                {selectedApp.weekly_off_days && selectedApp.weekly_off_days.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">{app.lang === "ar" ? "أيام العطل" : "Off Days"}</p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {selectedApp.weekly_off_days.map((day: string) => {
                        const dayMap: Record<string, string> = {
                          Monday: app.lang === "ar" ? 'الإثنين' : 'Mon',
                          Tuesday: app.lang === "ar" ? 'الثلاثاء' : 'Tue',
                          Wednesday: app.lang === "ar" ? 'الأربعاء' : 'Wed',
                          Thursday: app.lang === "ar" ? 'الخميس' : 'Thu',
                          Friday: app.lang === "ar" ? 'الجمعة' : 'Fri',
                          Saturday: app.lang === "ar" ? 'السبت' : 'Sat',
                          Sunday: app.lang === "ar" ? 'الأحد' : 'Sun',
                        };
                        return dayMap[day] || day;
                      }).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500">
                  {app.lang === "ar" ? "تاريخ الطلب" : "Request Date"}:{" "}
                  {new Date(selectedApp.created_at).toLocaleDateString(
                    app.lang === "ar" ? "ar-SA" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  {app.lang === "ar" ? "إغلاق" : "Close"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}