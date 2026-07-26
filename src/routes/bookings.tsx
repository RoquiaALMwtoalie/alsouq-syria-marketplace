// src/routes/bookings.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  CalendarDays, 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  Eye,
  Trash2,
  Plus,
  ShoppingBag,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Share2,
  MoreVertical,
  Download,
  Printer,
  FileText,
  ChevronDown
} from "lucide-react";
import { useApp, formatPrice, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMyBookings, useCancelBooking } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { supabase } from "@/integrations/supabase/client";
import { useBookingsRealtime } from "@/lib/hooks";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
  head: () => ({ meta: [{ title: "حجوزاتي — السوق لعندك" }] }),
});

// ============================================================
// 📦 الثوابت - متطابقة مع قاعدة البيانات 100%
// ============================================================
const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  accepted: "مؤكدة",
  completed: "مكتملة",
  rejected: "مرفوضة",
  cancelled: "ملغية",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-300 dark:bg-yellow-950/30 dark:text-yellow-400",
  accepted: "bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400",
  completed: "bg-blue-500/10 text-blue-700 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400",
  rejected: "bg-red-500/10 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400",
  cancelled: "bg-gray-500/10 text-gray-700 border-gray-300 dark:bg-gray-950/30 dark:text-gray-400",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  accepted: Check,
  completed: Check,
  rejected: X,
  cancelled: X,
};

// ============================================================
// 🏠 المكون الرئيسي
// ============================================================
function BookingsPage() {
  const app = useApp();
  const t = useT();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isClient, setIsClient] = useState(false);
  
  // ✅ State للديالوجات
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // ✅ Hooks
  const cancelBooking = useCancelBooking();
  const { data: bookings = [], isLoading, refetch } = useMyBookings(app.user?.id);
  

  
  // ✅ تأكد إنو الكود بشتغل عالعميل فقط
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // ✅ التحديث عند تغيير المستخدم
  useEffect(() => {
    if (app.user?.id && isClient) {
      refetch();
    }
  }, [app.user?.id, refetch, isClient]);

  // ============================================================
  // 📊 الفلترة والبحث
  // ============================================================
  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (statusFilter !== "all") {
      result = result.filter((b: any) => b.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b: any) => {
        const id = String(b.id).toLowerCase();
        const title = (app.lang === "ar" ? b.listings?.title_ar : b.listings?.title_en) || "";
        return id.includes(q) || title.toLowerCase().includes(q);
      });
    }

    return result;
  }, [bookings, searchQuery, statusFilter, app.lang]);

  // ============================================================
  // 📄 Pagination
  // ============================================================
  const totalPages = Math.ceil(filteredBookings.length / limit);
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBookings.slice(start, start + limit);
  }, [filteredBookings, page, limit]);

  // ============================================================
  // 📈 إحصائيات - متطابقة مع قاعدة البيانات
  // ============================================================
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: any) => b.status === "pending").length,
    accepted: bookings.filter((b: any) => b.status === "accepted").length,
    completed: bookings.filter((b: any) => b.status === "completed").length,
    rejected: bookings.filter((b: any) => b.status === "rejected").length,
    cancelled: bookings.filter((b: any) => b.status === "cancelled").length,
  };

  // ============================================================
  // 🖱️ دوال الإجراءات
  // ============================================================
  
  // ✅ دالة إلغاء الحجز
  const handleCancelBooking = async (bookingId: string) => {
    if (!app.user) return;
    
    setIsProcessing(true);
    try {
      await cancelBooking.mutateAsync({
        bookingId: bookingId,
        userId: app.user.id
      });
      
      // ✅ إشعار للبائع
      const booking = bookings.find((b: any) => b.id === bookingId);
      if (booking) {
        await supabase
          .from("notifications")
          .insert({
            recipient_id: booking.provider_id,
            type: "booking_cancelled",
            title_ar: `❌ تم إلغاء الحجز`,
            body_ar: `قام العميل بإلغاء حجز "${booking.listings?.title_ar}"`,
            title_en: `❌ Booking cancelled`,
            body_en: `Customer cancelled booking for "${booking.listings?.title_en}"`,
            link_url: `/dashboard/bookings`,
            metadata: {
              booking_id: booking.id,
              listing_id: booking.listing_id,
              status: "cancelled",
            },
          });
      }
      
      toast.success(
        app.lang === "ar" 
          ? "✅ تم إلغاء الحجز بنجاح" 
          : "✅ Booking cancelled successfully"
      );
      
      setShowCancelDialog(false);
      refetch();
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(
        app.lang === "ar" 
          ? "❌ فشل إلغاء الحجز" 
          : "❌ Failed to cancel booking"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ فتح تفاصيل الحجز
  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  // ✅ فتح نافذة الإلغاء
  const openCancelDialog = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  // ✅ تغيير الصفحة
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ دوال مساعدة
  const getStatusColor = (status: string) => statusColors[status] || statusColors.pending;
  const getStatusLabel = (status: string) => statusLabels[status] || status;
  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status] || AlertCircle;
    return <Icon className="h-4 w-4" />;
  };

  // ============================================================
  // 🌀 Skeleton Loading
  // ============================================================
  if (!isClient || isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // ✅ حالة عدم تسجيل الدخول
  if (!app.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "يرجى تسجيل الدخول" : "Please Login"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {app.lang === "ar" 
              ? "لتتمكن من مشاهدة حجوزاتك" 
              : "To view your bookings"}
          </p>
          <Link to="/auth/login">
            <Button className="mt-6">
              {app.lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // 🏠 الصفحة الرئيسية
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-emerald-500" />
              {app.lang === "ar" ? "📅 حجوزاتي" : "📅 My Bookings"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {app.lang === "ar" 
                ? `لديك ${bookings.length} حجز` 
                : `You have ${bookings.length} bookings`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "تحديث" : "Refresh"}
            </Button>
            <Link to="/">
              <Button variant="outline" className="gap-2 rounded-xl">
                <ChevronLeft className="h-4 w-4" />
                {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>

        {/* ===== الإحصائيات - متطابقة مع قاعدة البيانات ===== */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-500/10' },
            { key: 'pending', label: app.lang === 'ar' ? 'قيد الانتظار' : 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
            { key: 'accepted', label: app.lang === 'ar' ? 'مؤكدة' : 'Accepted', value: stats.accepted, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
            { key: 'completed', label: app.lang === 'ar' ? 'مكتملة' : 'Completed', value: stats.completed, color: 'text-blue-600', bg: 'bg-blue-500/10' },
            { key: 'rejected', label: app.lang === 'ar' ? 'مرفوضة' : 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-500/10' },
            { key: 'cancelled', label: app.lang === 'ar' ? 'ملغية' : 'Cancelled', value: stats.cancelled, color: 'text-gray-600', bg: 'bg-gray-500/10' },
          ].map((stat) => (
            <div key={stat.key} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ===== البحث والفلترة ===== */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={app.lang === "ar" ? "🔍 بحث عن حجز..." : "🔍 Search bookings..."}
              className="ps-9 h-10 rounded-xl"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: any) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] h-10 rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{app.lang === "ar" ? "جميع الحالات" : "All status"}</SelectItem>
              <SelectItem value="pending">{app.lang === "ar" ? "⏳ قيد الانتظار" : "⏳ Pending"}</SelectItem>
              <SelectItem value="accepted">{app.lang === "ar" ? "✅ مؤكدة" : "✅ Accepted"}</SelectItem>
              <SelectItem value="completed">{app.lang === "ar" ? "✔️ مكتملة" : "✔️ Completed"}</SelectItem>
              <SelectItem value="rejected">{app.lang === "ar" ? "❌ مرفوضة" : "❌ Rejected"}</SelectItem>
              <SelectItem value="cancelled">{app.lang === "ar" ? "🚫 ملغية" : "🚫 Cancelled"}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[100px] h-10 rounded-xl">
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "عدد" : "Show"}</span>
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setPage(1);
            }}
            className="h-10 rounded-xl"
          >
            <X className="h-4 w-4 mr-1.5" />
            {app.lang === "ar" ? "مسح الكل" : "Clear all"}
          </Button>
        </div>

        {/* ===== TABS السريعة - متطابقة مع قاعدة البيانات ===== */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: app.lang === "ar" ? "الكل" : "All" },
            { value: 'pending', label: app.lang === "ar" ? "⏳ قيد الانتظار" : "⏳ Pending" },
            { value: 'accepted', label: app.lang === "ar" ? "✅ مؤكدة" : "✅ Accepted" },
            { value: 'completed', label: app.lang === "ar" ? "✔️ مكتملة" : "✔️ Completed" },
            { value: 'rejected', label: app.lang === "ar" ? "❌ مرفوضة" : "❌ Rejected" },
            { value: 'cancelled', label: app.lang === "ar" ? "🚫 ملغية" : "🚫 Cancelled" },
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full px-4 transition-all",
                statusFilter === tab.value 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              )}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "ml-2 text-[10px]",
                    statusFilter === tab.value ? "bg-white/20 text-white" : ""
                  )}
                >
                  {bookings.filter((b: any) => b.status === tab.value).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* ===== LIST ===== */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/30">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold">
              {app.lang === "ar" ? "لا توجد حجوزات" : "No bookings found"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {app.lang === "ar" 
                ? "ابدأ بحجز خدمة الآن!" 
                : "Start booking a service now!"}
            </p>
            <Link to="/">
              <Button className="mt-4">
                {app.lang === "ar" ? "استكشف الخدمات" : "Explore Services"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedBookings.map((booking: any) => {
              // ✅ العميل يلغي فقط للحالات pending و accepted
              const canCancel = booking.status === 'pending' || booking.status === 'accepted';
              const StatusIcon = statusIcons[booking.status] || AlertCircle;
              
              return (
                <div 
                  key={booking.id} 
                  className="bg-card rounded-2xl border border-border/30 p-6 shadow-sm hover:shadow-xl transition-all hover:border-emerald-200/50 hover:-translate-y-1 duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* ===== الصورة ===== */}
                    <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-border/30 flex-shrink-0 bg-muted/30">
                      {booking.listings?.cover_url ? (
                        <img 
                          src={booking.listings.cover_url} 
                          alt={booking.listings.title_ar}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* ===== المعلومات ===== */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <Link 
                            to="/listing/$id" 
                            params={{ id: booking.listing_id }}
                            className="font-semibold hover:text-emerald-600 transition line-clamp-1 text-lg"
                          >
                            {app.lang === "ar" ? booking.listings?.title_ar : (booking.listings?.title_en || booking.listings?.title_ar) || "منتج"}
                          </Link>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(booking.starts_at).toLocaleDateString(
                                app.lang === "ar" ? "ar-SY" : "en-US",
                                { day: 'numeric', month: 'short', year: 'numeric' }
                              )}
                            </span>
                            <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(booking.starts_at).toLocaleTimeString(
                                app.lang === "ar" ? "ar-SY" : "en-US",
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                            <span className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                              <User className="h-3.5 w-3.5" />
                              {booking.guests || 1} {app.lang === "ar" ? "ضيوف" : "guests"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={cn(
                            "border-2 px-3 py-1.5 text-xs font-medium rounded-full",
                            getStatusColor(booking.status)
                          )}>
                            <span className="flex items-center gap-1.5">
                              <StatusIcon className="h-3.5 w-3.5" />
                              {getStatusLabel(booking.status)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {/* ===== السعر ===== */}
                      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(Number(booking.total), booking.currency || app.currency, app.lang)}
                        </div>
                        
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-1 bg-muted/30 px-3 py-1 rounded-full">
                            📝 {booking.notes}
                          </p>
                        )}
                      </div>

                      {/* ===== الأزرار ===== */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {canCancel && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all"
                            onClick={() => openCancelDialog(booking)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="h-3.5 w-3.5 me-1 animate-spin" />
                            ) : (
                              <X className="h-3.5 w-3.5 me-1" />
                            )}
                            {app.lang === "ar" ? "إلغاء الحجز" : "Cancel Booking"}
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-blue-50 transition-all"
                          onClick={() => openDetails(booking)}
                        >
                          <Eye className="h-3.5 w-3.5 me-1" />
                          {app.lang === "ar" ? "تفاصيل" : "Details"}
                        </Button>
                        
                        <Link to={`/listing/${booking.listing_id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-emerald-50 transition-all">
                            <ArrowRight className="h-3.5 w-3.5 me-1" />
                            {app.lang === "ar" ? "عرض المنتج" : "View Listing"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card rounded-xl border border-border/30 p-4">
            <div className="text-xs text-muted-foreground">
              {app.lang === "ar"
                ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredBookings.length)} من ${filteredBookings.length} حجز`
                : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredBookings.length)} of ${filteredBookings.length} bookings`}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl"
              >
                <span className="text-xs">«</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-4">
                {page} / {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl"
              >
                <span className="text-xs">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ===== Dialog: تفاصيل الحجز ===== */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-500" />
                {app.lang === "ar" ? "تفاصيل الحجز" : "Booking Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "رقم الحجز" : "Booking ID"}
                    </p>
                    <p className="font-mono text-sm font-medium">#{String(selectedBooking.id).slice(0, 8)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الحالة" : "Status"}
                    </p>
                    <Badge className={cn("mt-1", getStatusColor(selectedBooking.status))}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(selectedBooking.status)}
                        {getStatusLabel(selectedBooking.status)}
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "المنتج" : "Product"}
                  </p>
                  <p className="font-medium">
                    {app.lang === "ar" ? selectedBooking.listings?.title_ar : (selectedBooking.listings?.title_en || selectedBooking.listings?.title_ar)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الضيوف" : "Guests"}
                    </p>
                    <p className="font-bold text-lg">{selectedBooking.guests || 1}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الإجمالي" : "Total"}
                    </p>
                    <p className="font-bold text-emerald-600">
                      {formatPrice(Number(selectedBooking.total) || 0, selectedBooking.currency || app.currency, app.lang)}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "التاريخ" : "Date"}
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(selectedBooking.starts_at).toLocaleDateString(
                        app.lang === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {app.lang === "ar" ? "📝 ملاحظات" : "📝 Notes"}
                    </p>
                    <p className="text-sm mt-1">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-center border-t pt-3">
                  {app.lang === "ar" ? "تم الإنشاء" : "Created"}: {new Date(selectedBooking.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                {app.lang === "ar" ? "إغلاق" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ===== AlertDialog: إلغاء الحجز ===== */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                {app.lang === "ar" ? "تأكيد إلغاء الحجز" : "Confirm Cancellation"}
              </DialogTitle>
              <DialogDescription>
                {app.lang === "ar"
                  ? `هل أنت متأكد من إلغاء حجز "${selectedBooking?.listings?.title_ar}"؟ لا يمكن التراجع بعد الإلغاء.`
                  : `Are you sure you want to cancel the booking for "${selectedBooking?.listings?.title_en}"? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={() => handleCancelBooking(selectedBooking?.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                {app.lang === "ar" ? "تأكيد الإلغاء" : "Confirm Cancel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default BookingsPage;