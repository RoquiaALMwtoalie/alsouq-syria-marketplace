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
  ChevronDown,
  Sparkles,
  Zap,
  Shield,
  Award,
  Gem,
  Crown,
  Heart,
  Flame,
  TrendingUp,
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
  head: () => ({ meta: [{ title: "حجوزاتي — السوق عندك" }] }),
});

// ✅ أيقونة متحركة مع تموجات
const AnimatedBookingIcon = ({ 
  Icon, 
  className = "",
  color = "text-[#2a655f]",
  delay = 0,
  size = "h-5 w-5"
}: { 
  Icon: any, 
  className?: string,
  color?: string,
  delay?: number,
  size?: string
}) => {
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float-icon group-hover:animate-pulse-slow">
        <Icon className={cn(
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          color,
          size,
          className
        )} />
      </div>
      <span className="absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

// ✅ أيقونة الحالة مع حركة
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    pending: { 
      label: "قيد الانتظار", 
      color: "from-amber-500 to-orange-500 border-amber-400/30 text-amber-100",
      icon: Clock 
    },
    accepted: { 
      label: "مؤكدة", 
      color: "from-[#2a655f] to-[#3a8a82] border-[#3a8a82]/30 text-white",
      icon: Check 
    },
    completed: { 
      label: "مكتملة", 
      color: "from-emerald-500 to-teal-500 border-emerald-400/30 text-white",
      icon: Check 
    },
    rejected: { 
      label: "مرفوضة", 
      color: "from-red-500 to-rose-500 border-red-400/30 text-white",
      icon: X 
    },
    cancelled: { 
      label: "ملغية", 
      color: "from-gray-500 to-slate-500 border-gray-400/30 text-white",
      icon: X 
    },
  };

  const config = statusMap[status] || statusMap.pending;
  const Icon = config.icon;

  return (
    <Badge className={cn(
      "border-2 px-3 py-1.5 text-xs font-bold rounded-full shadow-lg animate-pulse-slow",
      `bg-gradient-to-br ${config.color}`
    )}>
      <span className="flex items-center gap-1.5">
        <AnimatedBookingIcon 
          Icon={Icon} 
          className="h-3.5 w-3.5" 
          color="text-white" 
          delay={0} 
          size="h-3.5 w-3.5"
        />
        {config.label}
      </span>
    </Badge>
  );
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
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cancelBooking = useCancelBooking();
  const { data: bookings = [], isLoading, refetch } = useMyBookings(app.user?.id);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (app.user?.id && isClient) {
      refetch();
    }
  }, [app.user?.id, refetch, isClient]);

  // ✅ فلترة
  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (statusFilter !== "all") {
      result = result.filter((b: any) => b.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b: any) => {
        const title = (app.lang === "ar" ? b.listings?.title_ar : b.listings?.title_en) || "";
        return title.toLowerCase().includes(q);
      });
    }
    return result;
  }, [bookings, searchQuery, statusFilter, app.lang]);

  const totalPages = Math.ceil(filteredBookings.length / limit);
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredBookings.slice(start, start + limit);
  }, [filteredBookings, page, limit]);

  // ✅ إحصائيات
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: any) => b.status === "pending").length,
    accepted: bookings.filter((b: any) => b.status === "accepted").length,
    completed: bookings.filter((b: any) => b.status === "completed").length,
    rejected: bookings.filter((b: any) => b.status === "rejected").length,
    cancelled: bookings.filter((b: any) => b.status === "cancelled").length,
  };

  // ✅ دوال
  const handleCancelBooking = async (bookingId: string) => {
    if (!app.user) return;
    setIsProcessing(true);
    try {
      await cancelBooking.mutateAsync({
        bookingId: bookingId,
        userId: app.user.id
      });
      
      const booking = bookings.find((b: any) => b.id === bookingId);
      if (booking) {
        await supabase
          .from("notifications")
          .insert({
       user_id: booking.provider_id,
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
      toast.error(
        app.lang === "ar" 
          ? "❌ فشل إلغاء الحجز" 
          : "❌ Failed to cancel booking"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const openCancelDialog = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ Skeleton
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
            <Button className="mt-6 bg-[#2a655f] hover:bg-[#1a4f4a] text-white">
              {app.lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10">
      <div className="mx-auto max-w-6xl px-4 py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30">
                <AnimatedBookingIcon 
                  Icon={CalendarDays} 
                  className="h-6 w-6 text-white" 
                  color="text-white" 
                  delay={0} 
                  size="h-6 w-6"
                />
              </div>
              {app.lang === "ar" ? "📅 حجوزاتي" : "📅 My Bookings"}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82]" />
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
              className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/10 transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "تحديث" : "Refresh"}
            </Button>
            <Link to="/">
              <Button variant="outline" className="gap-2 rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/10 transition-all">
                <ChevronLeft className="h-4 w-4" />
                {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>

        {/* ===== الإحصائيات ===== */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: CalendarDays },
            { key: 'pending', label: app.lang === 'ar' ? 'قيد الانتظار' : 'Pending', value: stats.pending, icon: Clock },
            { key: 'accepted', label: app.lang === 'ar' ? 'مؤكدة' : 'Accepted', value: stats.accepted, icon: Check },
            { key: 'completed', label: app.lang === 'ar' ? 'مكتملة' : 'Completed', value: stats.completed, icon: Check },
            { key: 'rejected', label: app.lang === 'ar' ? 'مرفوضة' : 'Rejected', value: stats.rejected, icon: X },
            { key: 'cancelled', label: app.lang === 'ar' ? 'ملغية' : 'Cancelled', value: stats.cancelled, icon: X },
          ].map((stat) => (
            <div key={stat.key} className="group bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-[#2a655f]/20 hover:border-[#3a8a82]/40 p-3 shadow-sm hover:shadow-md hover:shadow-[#2a655f]/10 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className={`text-xl font-bold ${stat.key === 'total' ? 'text-[#2a655f]' : 'text-foreground'}`}>
                  {stat.value}
                </p>
                <AnimatedBookingIcon 
                  Icon={stat.icon} 
                  className="h-4 w-4" 
                  color={stat.value > 0 ? "text-[#2a655f]" : "text-muted-foreground"}
                  delay={0}
                  size="h-4 w-4"
                />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ===== البحث والفلترة ===== */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={app.lang === "ar" ? "🔍 بحث عن حجز..." : "🔍 Search bookings..."}
              className="ps-9 h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f]/50 transition-all"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: any) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f]/50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#2a655f]" />
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
            <SelectTrigger className="w-[100px] h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f]/50">
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
            className="h-10 rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/10 transition-all"
          >
            <X className="h-4 w-4 mr-1.5" />
            {app.lang === "ar" ? "مسح الكل" : "Clear all"}
          </Button>
        </div>

        {/* ===== TABS ===== */}
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
                "rounded-full px-4 transition-all duration-300",
                statusFilter === tab.value 
                  ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50" 
                  : "border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/10"
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
                    statusFilter === tab.value ? "bg-white/20 text-white" : "bg-[#2a655f]/10 text-[#2a655f]"
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
          <div className="text-center py-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-[#2a655f]/20">
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
              <Button className="mt-4 bg-[#2a655f] hover:bg-[#1a4f4a] text-white">
                {app.lang === "ar" ? "استكشف الخدمات" : "Explore Services"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedBookings.map((booking: any) => {
              const canCancel = booking.status === 'pending' || booking.status === 'accepted';
              
              return (
                <div 
                  key={booking.id} 
                  className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-[#2a655f]/20 p-6 shadow-sm hover:shadow-xl hover:shadow-[#2a655f]/10 hover:border-[#3a8a82]/50 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* ===== الصورة ===== */}
                    <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-[#2a655f]/20 flex-shrink-0 bg-[#2a655f]/10 group-hover:border-[#3a8a82]/40 transition-all">
                      {booking.listings?.cover_url ? (
                        <img 
                          src={booking.listings.cover_url} 
                          alt={booking.listings.title_ar}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2a655f]">
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
                            className="font-semibold hover:text-[#2a655f] transition-colors line-clamp-1 text-lg"
                          >
                            {app.lang === "ar" ? booking.listings?.title_ar : (booking.listings?.title_en || booking.listings?.title_ar) || "منتج"}
                          </Link>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1 bg-[#2a655f]/5 px-2 py-0.5 rounded-full border border-[#2a655f]/10">
                              <AnimatedBookingIcon Icon={CalendarDays} className="h-3.5 w-3.5" color="text-[#2a655f]" delay={0} size="h-3.5 w-3.5" />
                              {new Date(booking.starts_at).toLocaleDateString(
                                app.lang === "ar" ? "ar-SY" : "en-US",
                                { day: 'numeric', month: 'short', year: 'numeric' }
                              )}
                            </span>
                            <span className="flex items-center gap-1 bg-[#2a655f]/5 px-2 py-0.5 rounded-full border border-[#2a655f]/10">
                              <AnimatedBookingIcon Icon={Clock} className="h-3.5 w-3.5" color="text-[#2a655f]" delay={100} size="h-3.5 w-3.5" />
                              {new Date(booking.starts_at).toLocaleTimeString(
                                app.lang === "ar" ? "ar-SY" : "en-US",
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                            <span className="flex items-center gap-1 bg-[#2a655f]/5 px-2 py-0.5 rounded-full border border-[#2a655f]/10">
                              <AnimatedBookingIcon Icon={User} className="h-3.5 w-3.5" color="text-[#2a655f]" delay={200} size="h-3.5 w-3.5" />
                              {booking.guests || 1} {app.lang === "ar" ? "ضيوف" : "guests"}
                            </span>
                          </div>
                        </div>
                        
                        <StatusBadge status={booking.status} />
                      </div>

                      {/* ===== السعر ===== */}
                      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                        <div className="text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]">
                          {formatPrice(Number(booking.total), booking.currency || app.currency, app.lang)}
                        </div>
                        
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-1 bg-[#2a655f]/5 px-3 py-1 rounded-full border border-[#2a655f]/10">
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
                          className="border-[#2a655f]/20 hover:border-[#3a8a82]/40 hover:bg-[#2a655f]/10 transition-all"
                          onClick={() => openDetails(booking)}
                        >
                          <Eye className="h-3.5 w-3.5 me-1" />
                          {app.lang === "ar" ? "تفاصيل" : "Details"}
                        </Button>
                        
                        <Link to={`/listing/${booking.listing_id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-[#2a655f]/10 transition-all">
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
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-[#2a655f]/20 p-4">
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
                className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/20 hover:border-[#3a8a82]/40"
              >
                <span className="text-xs">«</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/20 hover:border-[#3a8a82]/40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-4 text-[#2a655f]">
                {page} / {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/20 hover:border-[#3a8a82]/40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/20 hover:border-[#3a8a82]/40"
              >
                <span className="text-xs">»</span>
              </Button>
            </div>
          </div>
        )}

        {/* ===== Dialog: تفاصيل الحجز ===== */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center">
                  <AnimatedBookingIcon Icon={CalendarDays} className="h-4 w-4 text-white" color="text-white" delay={0} size="h-4 w-4" />
                </div>
                {app.lang === "ar" ? "تفاصيل الحجز" : "Booking Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "رقم الحجز" : "Booking ID"}
                    </p>
                    <p className="font-mono text-sm font-medium text-[#2a655f]">#{String(selectedBooking.id).slice(0, 8)}</p>
                  </div>
                  <div className="p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الحالة" : "Status"}
                    </p>
                    <StatusBadge status={selectedBooking.status} />
                  </div>
                </div>

                <div className="p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
                  <p className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "المنتج" : "Product"}
                  </p>
                  <p className="font-medium">
                    {app.lang === "ar" ? selectedBooking.listings?.title_ar : (selectedBooking.listings?.title_en || selectedBooking.listings?.title_ar)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10 text-center">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الضيوف" : "Guests"}
                    </p>
                    <p className="font-bold text-lg text-[#2a655f]">{selectedBooking.guests || 1}</p>
                  </div>
                  <div className="p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10 text-center">
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الإجمالي" : "Total"}
                    </p>
                    <p className="font-bold text-[#2a655f]">
                      {formatPrice(Number(selectedBooking.total) || 0, selectedBooking.currency || app.currency, app.lang)}
                    </p>
                  </div>
                  <div className="p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10 text-center">
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
                  <div className="p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {app.lang === "ar" ? "📝 ملاحظات" : "📝 Notes"}
                    </p>
                    <p className="text-sm mt-1">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-center border-t border-[#2a655f]/10 pt-3">
                  {app.lang === "ar" ? "تم الإنشاء" : "Created"}: {new Date(selectedBooking.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="border-[#2a655f]/20 hover:border-[#3a8a82]/40">
                {app.lang === "ar" ? "إغلاق" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ===== AlertDialog: إلغاء الحجز ===== */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20">
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
              <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="border-[#2a655f]/20 hover:border-[#3a8a82]/40">
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

      {/* ✅ CSS Animations */}
      <style>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(3deg); }
          75% { transform: translateY(4px) rotate(-2deg); }
        }
        .animate-float-icon {
          animation: float-icon 3s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

export default BookingsPage;