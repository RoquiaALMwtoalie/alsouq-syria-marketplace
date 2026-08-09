// src/components/dashboard/BookingsPage.tsx
import { useState, useMemo } from "react";
import { 
  CalendarIcon, Search, Eye, ChevronLeft, ChevronRight, 
  FileSpreadsheet, FileText, RefreshCw, X, Filter,
  Users, Clock, CheckCircle2, XCircle, AlertCircle,
  BarChart3, TrendingUp, Award, Check, Ban, MessageSquare,
  Loader2, Sparkles, Rocket, Crown, Star, Zap, Gift,
  Calendar, MapPin, User, DollarSign, Package, ShoppingBag,
  Heart, TrendingDown, ArrowUpRight, ArrowDownRight, Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, ComposedChart
} from 'recharts';
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useMyBookings } from "@/lib/queries";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
import { cn } from "@/lib/utils";
const { saveAs } = pkg;

// ============================================================
// 📦 الثوابت
// ============================================================
const statusLabels: any = {
  pending: "قيد الانتظار",
  accepted: "مقبولة",
  completed: "مكتملة",
  rejected: "مرفوضة",
  cancelled: "ملغية",
};

const statusColors: any = {
  pending: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const statusIcons: any = {
  pending: Clock,
  accepted: CheckCircle2,
  completed: CheckCircle2,
  rejected: XCircle,
  cancelled: XCircle,
};

const COLORS = ['#2a655f', '#3a8a82', '#4a9f95', '#5ab5a8', '#6acbbb', '#7ad8ca'];

// ============================================================
// 🏠 المكون الرئيسي
// ============================================================
export function BookingsPage() {
  const app = useApp();
  const t = useT();
  const { data: rows = [], isLoading, refetch } = useMyBookings(app.user?.id);

  // ===== State للبحث والفلترة والـ Pagination =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "completed" | "rejected" | "cancelled">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ===== State للحجز المختار وإجراءاته =====
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // ===== State لعرض تفاصيل الحجز =====
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<any>(null);

  // ============================================================
  // 📊 فلترة البيانات
  // ============================================================
  const filteredBookings = useMemo(() => {
    let result = rows;

    if (filterStatus !== "all") {
      result = result.filter((b: any) => b.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b: any) => {
        const id = String(b.id).toLowerCase();
        const title = (app.lang === "ar" ? b.listings?.title_ar : b.listings?.title_en || b.listings?.title_ar) || "";
        return id.includes(q) || title.toLowerCase().includes(q);
      });
    }

    return result;
  }, [rows, searchQuery, filterStatus, app.lang]);

  // ============================================================
  // 📄 Pagination
  // ============================================================
  const totalPages = Math.ceil(filteredBookings.length / limit);
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredBookings.slice(start, end);
  }, [filteredBookings, page, limit]);

  // ============================================================
  // 📈 إحصائيات
  // ============================================================
  const stats = {
    total: rows.length,
    pending: rows.filter((b: any) => b.status === "pending").length,
    accepted: rows.filter((b: any) => b.status === "accepted").length,
    completed: rows.filter((b: any) => b.status === "completed").length,
    rejected: rows.filter((b: any) => b.status === "rejected").length,
    cancelled: rows.filter((b: any) => b.status === "cancelled").length,
  };

  // ============================================================
  // 📊 بيانات الرسوم البيانية
  // ============================================================
  const statusChartData = useMemo(() => {
    return [
      { name: app.lang === 'ar' ? 'قيد الانتظار' : 'Pending', value: stats.pending, color: '#f59e0b' },
      { name: app.lang === 'ar' ? 'مقبولة' : 'Accepted', value: stats.accepted, color: '#10b981' },
      { name: app.lang === 'ar' ? 'مكتملة' : 'Completed', value: stats.completed, color: '#3b82f6' },
      { name: app.lang === 'ar' ? 'مرفوضة' : 'Rejected', value: stats.rejected, color: '#ef4444' },
      { name: app.lang === 'ar' ? 'ملغية' : 'Cancelled', value: stats.cancelled, color: '#6b7280' },
    ].filter(d => d.value > 0);
  }, [stats, app.lang]);

  const monthlyBookingsData = useMemo(() => {
    const months: { [key: string]: any } = {};
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    rows.forEach((b: any) => {
      const date = new Date(b.starts_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) {
        months[key] = { 
          name: app.lang === 'ar' ? arabicMonths[date.getMonth()] : date.toLocaleString('default', { month: 'short' }),
          bookings: 0,
          revenue: 0
        };
      }
      months[key].bookings += 1;
      months[key].revenue += Number(b.total) || 0;
    });
    return Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
      .map(([k, v]) => ({ ...v, revenue: Math.round(v.revenue) }));
  }, [rows, app.lang]);

  const topBookedProducts = useMemo(() => {
    const map: { [key: string]: any } = {};
    rows.forEach((b: any) => {
      const id = b.listing_id || 'unknown';
      if (!map[id]) {
        map[id] = { 
          id, 
          name: app.lang === "ar" ? b.listings?.title_ar : (b.listings?.title_en || b.listings?.title_ar) || `منتج ${id.slice(0, 4)}`,
          bookings: 0,
          revenue: 0
        };
      }
      map[id].bookings += 1;
      map[id].revenue += Number(b.total) || 0;
    });
    return Object.values(map)
      .sort((a: any, b: any) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [rows, app.lang]);

  // ============================================================
  // 🔄 تغيير الصفحة
  // ============================================================
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================
  // 📥 تصدير البيانات
  // ============================================================
  const exportToExcel = () => {
    const exportData = filteredBookings.map((b: any) => ({
      'رقم الحجز': String(b.id).slice(0, 8),
      'المنتج': app.lang === "ar" ? b.listings?.title_ar : (b.listings?.title_en || b.listings?.title_ar) || '—',
      'العميل': String(b.customer_id).slice(0, 8),
      'عدد الضيوف': b.guests || 1,
      'الإجمالي': formatPrice(Number(b.total) || 0, app.currency, app.lang),
      'الحالة': statusLabels[b.status] || b.status,
      'تاريخ البدء': new Date(b.starts_at).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
      'تاريخ الانتهاء': b.ends_at ? new Date(b.ends_at).toLocaleString(app.lang === 'ar' ? 'ar-SA' : 'en-US') : '—',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الحجوزات');
    
    ws['!cols'] = [
      { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
      { wch: 18 }, { wch: 15 }, { wch: 25 }, { wch: 25 },
    ];

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `الحجوزات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          h1 { color: #1e293b; text-align: center; border-bottom: 2px solid #2a655f; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2a655f; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #f8fafc; }
          .status-pending { color: #f59e0b; font-weight: bold; }
          .status-accepted { color: #10b981; font-weight: bold; }
          .status-completed { color: #3b82f6; font-weight: bold; }
          .status-rejected { color: #ef4444; font-weight: bold; }
          .status-cancelled { color: #6b7280; font-weight: bold; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير الحجوزات</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
          ${filterStatus !== 'all' ? ` | الحالة: ${statusLabels[filterStatus] || filterStatus}` : ''}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>رقم الحجز</th>
              <th>المنتج</th>
              <th>العميل</th>
              <th>عدد الضيوف</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>تاريخ البدء</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredBookings.forEach((b: any, index: number) => {
      const statusClass = `status-${b.status}`;
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${String(b.id).slice(0, 8)}</td>
          <td>${app.lang === "ar" ? b.listings?.title_ar : (b.listings?.title_en || b.listings?.title_ar) || '—'}</td>
          <td>${String(b.customer_id).slice(0, 8)}</td>
          <td>${b.guests || 1}</td>
          <td>${formatPrice(Number(b.total) || 0, app.currency, app.lang)}</td>
          <td class="${statusClass}">${statusLabels[b.status] || b.status}</td>
          <td>${new Date(b.starts_at).toLocaleString('ar-SA')}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          إجمالي الحجوزات: ${filteredBookings.length} | تم التصدير من لوحة البائع
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `الحجوزات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ============================================================
  // ✅ قبول الحجز
  // ============================================================
  const handleAcceptBooking = async (booking: any) => {
    if (!booking) return;
    
    setIsProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      await supabase
        .from('notifications')
        .insert({
         user_id: booking.customer_id,
          type: 'booking_accepted',
          title_ar: `✅ تم قبول حجزك`,
          body_ar: `تم قبول حجز "${booking.listings?.title_ar}" من قبل المتجر. يمكنك الآن التوجه للحجز.`,
          title_en: `✅ Your booking was accepted`,
          body_en: `Your booking for "${booking.listings?.title_en || booking.listings?.title_ar}" has been accepted by the store.`,
          link_url: `/bookings`,
          metadata: {
            booking_id: booking.id,
            listing_id: booking.listing_id,
            status: 'accepted',
          },
        });

      toast.success(
        app.lang === "ar" 
          ? "✅ تم قبول الحجز وإرسال إشعار للمشتري" 
          : "✅ Booking accepted and notification sent to customer"
      );

      setShowActionDialog(false);
      refetch();

    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error(
        app.lang === "ar" 
          ? "❌ فشل قبول الحجز" 
          : "❌ Failed to accept booking"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================
  // ❌ رفض الحجز
  // ============================================================
  const handleRejectBooking = async (booking: any) => {
    if (!booking) return;
    
    if (!rejectReason.trim()) {
      toast.error(
        app.lang === "ar" 
          ? "⚠️ يرجى كتابة سبب الرفض" 
          : "⚠️ Please provide a rejection reason"
      );
      return;
    }

    setIsProcessing(true);
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'rejected',
          notes: rejectReason.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      await supabase
        .from('notifications')
        .insert({
        user_id: booking.customer_id,
          type: 'booking_rejected',
          title_ar: `❌ تم رفض حجزك`,
          body_ar: `تم رفض حجز "${booking.listings?.title_ar}" من قبل المتجر. السبب: ${rejectReason.trim()}`,
          title_en: `❌ Your booking was rejected`,
          body_en: `Your booking for "${booking.listings?.title_en || booking.listings?.title_ar}" was rejected by the store. Reason: ${rejectReason.trim()}`,
          link_url: `/bookings`,
          metadata: {
            booking_id: booking.id,
            listing_id: booking.listing_id,
            status: 'rejected',
            reason: rejectReason.trim(),
          },
        });

      toast.success(
        app.lang === "ar" 
          ? "✅ تم رفض الحجز وإرسال إشعار للمشتري" 
          : "✅ Booking rejected and notification sent to customer"
      );

      setShowActionDialog(false);
      setRejectReason("");
      refetch();

    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error(
        app.lang === "ar" 
          ? "❌ فشل رفض الحجز" 
          : "❌ Failed to reject booking"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================
  // 🖱️ فتح نافذة الإجراء
  // ============================================================
  const openActionDialog = (booking: any, type: 'accept' | 'reject') => {
    setSelectedBooking(booking);
    setActionType(type);
    setRejectReason("");
    setShowActionDialog(true);
  };

  const openDetailsDialog = (booking: any) => {
    setViewingBooking(booking);
    setShowDetailsDialog(true);
  };

  // ============================================================
  // 📋 عرض تفاصيل الحجز
  // ============================================================
  const BookingDetails = ({ booking }: { booking: any }) => {
    if (!booking) return null;
    
    const StatusIcon = statusIcons[booking.status] || Clock;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "رقم الحجز" : "Booking ID"}
            </p>
            <p className="font-mono text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]">
              #{String(booking.id).slice(0, 8)}
            </p>
          </div>
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "الحالة" : "Status"}
            </p>
            <Badge variant="outline" className={statusColors[booking.status] || statusColors.pending}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusLabels[booking.status] || booking.status}
            </Badge>
          </div>
        </div>

        <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {app.lang === "ar" ? "المنتج" : "Product"}
          </p>
          <p className="font-medium text-[#2a655f] dark:text-[#3a8a82]">
            {app.lang === "ar" ? booking.listings?.title_ar : (booking.listings?.title_en || booking.listings?.title_ar)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "الضيوف" : "Guests"}
            </p>
            <p className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
              {booking.guests || 1}
            </p>
          </div>
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "الإجمالي" : "Total"}
            </p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(Number(booking.total) || 0, app.currency, app.lang)}
            </p>
          </div>
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "العميل" : "Customer"}
            </p>
            <p className="font-mono text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]">
              {String(booking.customer_id).slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "تاريخ البدء" : "Start Date"}
            </p>
            <p className="text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]">
              {new Date(booking.starts_at).toLocaleString(
                app.lang === 'ar' ? 'ar-SA' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              )}
            </p>
          </div>
          <div className="p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 rounded-xl border border-[#2a655f]/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {app.lang === "ar" ? "تاريخ الانتهاء" : "End Date"}
            </p>
            <p className="text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]">
              {booking.ends_at 
                ? new Date(booking.ends_at).toLocaleString(
                    app.lang === 'ar' ? 'ar-SA' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                  )
                : (app.lang === "ar" ? "—" : "—")
              }
            </p>
          </div>
        </div>

        {booking.notes && booking.status === 'rejected' && (
          <div className="p-3 bg-red-50/30 dark:bg-red-950/10 rounded-xl border border-red-200/50 dark:border-red-800/30">
            <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              {booking.notes}
            </p>
          </div>
        )}

        {booking.created_at && (
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 pt-3">
            {app.lang === "ar" ? "تم الإنشاء" : "Created"}: {new Date(booking.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}
            {booking.updated_at && booking.updated_at !== booking.created_at && (
              <> · {app.lang === "ar" ? "آخر تحديث" : "Updated"}: {new Date(booking.updated_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US')}</>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 🌀 Skeleton Loading
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CalendarIcon className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {app.lang === "ar" ? "⏳ جاري تحميل الحجوزات..." : "⏳ Loading bookings..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  // ============================================================
  // 🏠 الصفحة الرئيسية
  // ============================================================
  return (
    <div className="space-y-6">
      {/* ===== العنوان ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#3a8a82]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <CalendarIcon className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {app.lang === "ar" ? "الحجوزات" : "Bookings"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <Clock className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
              <span className="text-yellow-600 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "قيد الانتظار" : "pending"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-medium">{stats.accepted}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "مقبولة" : "accepted"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/50">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-blue-600 font-medium">{stats.completed}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "مكتملة" : "completed"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredBookings.length === 0}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredBookings.length === 0}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" />
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== إحصائيات سريعة ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: CalendarIcon, color: 'text-[#2a655f]', bg: 'bg-[#2a655f]/10' },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد الانتظار' : 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          { key: 'accepted', label: app.lang === 'ar' ? 'مقبولة' : 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'completed', label: app.lang === 'ar' ? 'مكتملة' : 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { key: 'cancelled', label: app.lang === 'ar' ? 'ملغية' : 'Cancelled', value: stats.cancelled + stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div 
            key={stat.key} 
            className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center justify-center gap-2">
              <div className={`h-6 w-6 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className={`h-3 w-3 ${stat.color}`} />
              </div>
              <p className={`text-lg font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.value}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">{stat.label}</p>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ===== البحث والفلترة ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={app.lang === "ar" ? "🔍 بحث عن حجز..." : "🔍 Search bookings..."}
            className="ps-9 h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => {
            setFilterStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all" className="hover:bg-[#2a655f]/10">{app.lang === "ar" ? "جميع الحالات" : "All status"}</SelectItem>
            <SelectItem value="pending" className="hover:bg-[#2a655f]/10">⏳ {app.lang === "ar" ? "قيد الانتظار" : "Pending"}</SelectItem>
            <SelectItem value="accepted" className="hover:bg-[#2a655f]/10">✅ {app.lang === "ar" ? "مقبولة" : "Accepted"}</SelectItem>
            <SelectItem value="completed" className="hover:bg-[#2a655f]/10">📅 {app.lang === "ar" ? "مكتملة" : "Completed"}</SelectItem>
            <SelectItem value="rejected" className="hover:bg-[#2a655f]/10">❌ {app.lang === "ar" ? "مرفوضة" : "Rejected"}</SelectItem>
            <SelectItem value="cancelled" className="hover:bg-[#2a655f]/10">🚫 {app.lang === "ar" ? "ملغية" : "Cancelled"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{app.lang === "ar" ? "عدد" : "Show"}</span>
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
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
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== جدول الحجوزات ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  #ID
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[150px]">
                  {app.lang === "ar" ? "المنتج" : "Item"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[120px]">
                  {app.lang === "ar" ? "العميل" : "Customer"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  {app.lang === "ar" ? "الضيوف" : "Guests"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "الإجمالي" : "Total"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[150px]">
                  {app.lang === "ar" ? "تاريخ البدء" : "Start Date"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[60px]">
                  {app.lang === "ar" ? "عرض" : "View"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2a655f] border-t-transparent" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && paginatedBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center">
                        <CalendarIcon className="h-8 w-8 text-[#2a655f]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">{app.lang === "ar" ? "لا توجد حجوزات" : "No bookings"}</p>
                      <p className="text-sm text-slate-400">{app.lang === "ar" ? "جميع الحجوزات ستظهر هنا" : "All bookings will appear here"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {paginatedBookings.map((b: any) => {
                const StatusIcon = statusIcons[b.status] || Clock;
                return (
                  <TableRow key={b.id} className="border-slate-100 dark:border-slate-800 hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-colors duration-300 group">
                    <TableCell className="font-mono text-xs text-[#2a655f] dark:text-[#3a8a82] text-center">
                      #{String(b.id).slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-white text-right group-hover:text-[#2a655f] transition-colors">
                      {app.lang === "ar" ? b.listings?.title_ar : (b.listings?.title_en || b.listings?.title_ar) || '—'}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300 text-right">
                      {String(b.customer_id).slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-center text-slate-600 dark:text-slate-300">
                      {b.guests || 1}
                    </TableCell>
                    <TableCell className="font-bold text-[#2a655f] dark:text-[#3a8a82] text-center">
                      {formatPrice(Number(b.total) || 0, app.currency, app.lang)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusColors[b.status] || statusColors.pending}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusLabels[b.status] || b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs text-slate-500">
                      <div className="flex items-center justify-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-[#2a655f]" />
                        {new Date(b.starts_at).toLocaleString(
                          app.lang === 'ar' ? 'ar-SA' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all group-hover:scale-110"
                        onClick={() => openDetailsDialog(b)}
                      >
                        <Eye className="h-4 w-4 text-[#2a655f]" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {filteredBookings.length === 0 ? (
                <span>{app.lang === "ar" ? "لا توجد حجوزات" : "No bookings"}</span>
              ) : (
                <span>
                  {app.lang === "ar"
                    ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredBookings.length)} من ${filteredBookings.length} حجز`
                    : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredBookings.length)} of ${filteredBookings.length} bookings`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">«</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
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
                          ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25"
                          : "border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 hover:text-[#2a655f]"
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
                      className="h-8 min-w-[32px] p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 text-xs"
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
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-xs font-bold">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ===== Footer ===== */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-[#2a655f]/5">
          <span>
            {app.lang === "ar"
              ? `عرض ${paginatedBookings.length} من ${filteredBookings.length} حجز (إجمالي ${rows.length})`
              : `Showing ${paginatedBookings.length} of ${filteredBookings.length} bookings (total ${rows.length})`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-0">
              {filterStatus === "all" ? (app.lang === "ar" ? "جميع" : "All") : statusLabels[filterStatus] || filterStatus}
            </Badge>
            {searchQuery && (
              <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-0">
                🔍 {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ===== الرسوم البيانية ===== */}
      <div className="space-y-6 mt-6">
        <div className="flex items-center gap-2 border-b border-[#2a655f]/20 dark:border-[#2a655f]/30 pb-3">
          <div className="p-1.5 rounded-lg bg-[#2a655f]/10">
            <BarChart3 className="h-5 w-5 text-[#2a655f]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {app.lang === "ar" ? "📊 تحليل الحجوزات" : "📊 Bookings Analytics"}
          </h2>
          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-xs">
            {rows.length} {app.lang === "ar" ? "حجز" : "bookings"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ===== توزيع الحجوزات حسب الحالة ===== */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <div className="p-1 rounded-lg bg-[#2a655f]/10">
                  <PieChart className="h-4 w-4 text-[#2a655f]" />
                </div>
                {app.lang === 'ar' ? "توزيع الحجوزات" : "Bookings Distribution"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? "حسب الحالة" : "By status"}
              </p>
            </div>
            <div className="h-[220px] mt-2">
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={statusChartData} 
                      cx="50%" 
                      cy="45%" 
                      innerRadius={40} 
                      outerRadius={70} 
                      paddingAngle={2} 
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 40px rgba(42,101,95,0.15)',
                        background: 'rgba(255,255,255,0.95)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  {app.lang === 'ar' ? "لا توجد بيانات" : "No data"}
                </div>
              )}
            </div>
          </div>

          {/* ===== اتجاه الحجوزات الشهرية ===== */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <div className="p-1 rounded-lg bg-[#2a655f]/10">
                  <TrendingUp className="h-4 w-4 text-[#2a655f] animate-pulse" />
                </div>
                {app.lang === 'ar' ? 'اتجاه الحجوزات الشهرية' : 'Monthly Bookings Trend'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? 'عدد الحجوزات والإيرادات الشهرية' : 'Monthly bookings and revenue'}
              </p>
            </div>
            <div className="h-[220px] mt-2">
              {monthlyBookingsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyBookingsData}>
                    <defs>
                      <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2a655f" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#2a655f" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 40px rgba(42,101,95,0.15)',
                        background: 'rgba(255,255,255,0.95)'
                      }}
                      formatter={(v: any) => typeof v === 'number' ? v.toLocaleString() : v}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Area 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="bookings" 
                      name={app.lang === 'ar' ? "الحجوزات" : "Bookings"} 
                      stroke="#2a655f" 
                      strokeWidth={2.5} 
                      fill="url(#bookingsGradient)"
                      dot={{ fill: '#2a655f', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="revenue" 
                      name={app.lang === 'ar' ? "الإيرادات" : "Revenue"} 
                      fill="#3a8a82" 
                      radius={[4,4,0,0]} 
                      barSize={24} 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  {app.lang === 'ar' ? "لا توجد بيانات" : "No data"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== أفضل المنتجات حجوزات ===== */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <div className="p-1 rounded-lg bg-[#2a655f]/10">
                  <Award className="h-4 w-4 text-[#2a655f] animate-bounce" />
                </div>
                {app.lang === 'ar' ? '🏆 أفضل المنتجات حجوزات' : '🏆 Most Booked Products'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {app.lang === 'ar' ? 'المنتجات الأكثر حجزاً' : 'Most booked products'}
              </p>
            </div>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0">
              {topBookedProducts.length} {app.lang === "ar" ? "منتج" : "products"}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {topBookedProducts.length > 0 ? (
              topBookedProducts.map((product: any, index: number) => (
                <div 
                  key={product.id} 
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg group",
                    index === 0 
                      ? "border-amber-400 bg-gradient-to-br from-amber-50/80 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-950/10" 
                      : "border-[#2a655f]/20 bg-white dark:bg-[#1e293b] hover:border-[#2a655f]/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 group-hover:scale-110",
                      index === 0 
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30" 
                        : "bg-[#2a655f]/10 text-[#2a655f]"
                    )}>
                      #{index + 1}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[100px] group-hover:text-[#2a655f] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-[#2a655f]" />
                        {product.bookings || 0} {app.lang === 'ar' ? 'حجز' : 'bookings'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] mt-1 text-center">
                    {formatPrice(product.revenue || 0, app.currency, app.lang)}
                  </p>
                  {index === 0 && (
                    <div className="flex justify-center mt-1">
                      <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-5 text-center py-8 text-sm text-slate-500">
                <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2">
                  <CalendarIcon className="h-6 w-6 text-[#2a655f]/40" />
                </div>
                {app.lang === 'ar' ? 'لا توجد حجوزات حتى الآن' : 'No bookings yet'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Action Dialog (قبول/رفض) ===== */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#2a655f]">
              {actionType === 'accept' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {actionType === 'accept' 
                ? (app.lang === "ar" ? "قبول الحجز" : "Accept Booking")
                : (app.lang === "ar" ? "رفض الحجز" : "Reject Booking")}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'accept'
                ? (app.lang === "ar" 
                    ? `هل أنت متأكد من قبول الحجز "${selectedBooking?.listings?.title_ar}"؟`
                    : `Are you sure you want to accept the booking "${selectedBooking?.listings?.title_en || selectedBooking?.listings?.title_ar}"?`)
                : (app.lang === "ar" 
                    ? `هل أنت متأكد من رفض الحجز "${selectedBooking?.listings?.title_ar}"؟`
                    : `Are you sure you want to reject the booking "${selectedBooking?.listings?.title_en || selectedBooking?.listings?.title_ar}"?`)
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {actionType === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="reject-reason" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reject-reason"
                  placeholder={app.lang === "ar" ? "اكتب سبب الرفض..." : "Write rejection reason..."}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px] resize-none rounded-xl border-slate-200 dark:border-slate-700 focus-visible:ring-[#2a655f] focus-visible:border-[#2a655f]"
                  rows={3}
                />
                <p className="text-xs text-slate-400">
                  {app.lang === "ar" ? "سيتم إرسال السبب للمشتري" : "The reason will be sent to the customer"}
                </p>
              </div>
            )}

            {actionType === 'accept' && (
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {app.lang === "ar" 
                    ? "سيتم إرسال إشعار للمشتري بتأكيد الحجز"
                    : "A confirmation notification will be sent to the customer"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={() => {
                if (actionType === 'accept') {
                  handleAcceptBooking(selectedBooking);
                } else {
                  handleRejectBooking(selectedBooking);
                }
              }}
              disabled={isProcessing || (actionType === 'reject' && !rejectReason.trim())}
              className={`rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                actionType === 'accept'
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري المعالجة..." : "Processing..."}
                </div>
              ) : actionType === 'accept' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "تأكيد القبول" : "Confirm Accept"}
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "تأكيد الرفض" : "Confirm Reject"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Details Dialog ===== */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#2a655f]">
              <CalendarIcon className="h-6 w-6 text-[#2a655f]" />
              {app.lang === "ar" ? "تفاصيل الحجز" : "Booking Details"}
            </DialogTitle>
          </DialogHeader>

          {viewingBooking && (
            <div className="py-4">
              <BookingDetails booking={viewingBooking} />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            >
              {app.lang === "ar" ? "إغلاق" : "Close"}
            </Button>
            {viewingBooking?.status === 'pending' && (
              <>
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    openActionDialog(viewingBooking, 'accept');
                  }}
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "قبول" : "Accept"}
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    openActionDialog(viewingBooking, 'reject');
                  }}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <X className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "رفض" : "Reject"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ✅ إضافة CSS للحركات (في نهاية الملف)
const style = document.createElement('style');
style.textContent = `
  @keyframes slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-slide {
    animation: slide 1.5s ease-in-out infinite;
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`;
document.head.appendChild(style);