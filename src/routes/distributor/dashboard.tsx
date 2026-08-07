// src/routes/distributor/dashboard.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDeliveryOrders, useDistributors, useUpdateDeliveryOrderStatus, useUserNotifications } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck, Package, MapPin, Phone, Mail, Clock, 
  CheckCircle, XCircle, Navigation, User, 
  Calendar, ArrowRight, ChevronLeft, Search,
  Filter, MoreVertical, Eye, AlertCircle,
  RefreshCw, UserCheck, UserX, Star, Award,
  TrendingUp, DollarSign, BarChart3, Activity,
  ClipboardCheck, ClipboardX, ClipboardList,
  LogOut, Settings, Shield, Zap, Sparkles,
  Crown, Gem, Rocket, Target, Compass,
  ChevronRight, Clipboard, Bell, Languages,
  MessageCircle, Store, Building2, Users,
  Coffee, Sun, Moon, Cloud, Heart, 
  Flame, Gift, ShoppingBag, CreditCard,
  Smartphone, Watch, Headphones, Camera,
  Gamepad2, BookOpen, Music, Film,
  Home, Briefcase, GraduationCap, Plane,
  Car, Bike, Bus, Train, Ship,
  Anchor, Compass as CompassIcon, 
  Globe, Map, Pin, Flag, Truck as TruckIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DistributorAccountMenu } from "@/components/distributor/DistributorAccountMenu";
import { DistributorNotifications } from "@/components/distributor/DistributorNotifications";
import { OrderTrackingMap } from "@/components/distributor/OrderTrackingMap";
import { useUnreadCount } from "@/lib/hooks/useConversation";

export const Route = createFileRoute("/distributor/dashboard")({
  component: DistributorDashboardPage,
  head: () => ({
    meta: [
      { title: "لوحة تحكم الموزع - السوق لعندك" },
      { name: "description", content: "إدارة طلبات التوصيل الخاصة بك" },
    ],
  }),
});

function DistributorDashboardPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [showMapOrderId, setShowMapOrderId] = useState<string | null>(null);
  
  // ✅ State للإشعارات
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ✅ جلب البيانات
  const { data: allOrders = [], isLoading: ordersLoading } = useDeliveryOrders(app.user?.id);
  const { data: distributors = [] } = useDistributors({ isAvailable: true });
  const updateStatus = useUpdateDeliveryOrderStatus();
  const { data: notifications = [] } = useUserNotifications(app.user?.id, { limit: 50 });

  // ✅ عدد الإشعارات غير المقروءة
  const unreadNotificationsCount = notifications.filter((n: any) => !n.is_read).length;

  // ✅ ✅ ✅ عدد الرسائل غير المقروءة من useUnreadCount
  const { data: unreadCount = 0 } = useUnreadCount();

  // ✅ الموزع الحالي
  const currentDistributor = useMemo(() => {
    return distributors.find((d: any) => d.user_id === app.user?.id);
  }, [distributors, app.user]);

  // ✅ جلب أدمن الشركة (لمراسلته)
  const [companyAdmin, setCompanyAdmin] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyAdmin = async () => {
      if (!currentDistributor?.delivery_company_id) return;
      
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("id, full_name, phone, avatar_url")
          .eq("company_id", currentDistributor.delivery_company_id)
          .limit(1);
        
        if (error) throw error;
        
        if (profiles && profiles.length > 0) {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("user_id, role")
            .eq("user_id", profiles[0].id)
            .eq("role", "delivery_company")
            .maybeSingle();
          
          if (roles) {
            setCompanyAdmin(profiles[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching company admin:", error);
      }
    };
    
    fetchCompanyAdmin();
  }, [currentDistributor]);

  // ✅ فلترة الطلبات: بس الطلبات المسندة للموزع الحالي
  const orders = useMemo(() => {
    if (!currentDistributor?.id) return [];
    return allOrders.filter((order: any) => order.distributor_id === currentDistributor.id);
  }, [allOrders, currentDistributor]);

  // ✅ إحصائيات الموزع
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o: any) => o.status === "pending").length;
    const assigned = orders.filter((o: any) => o.status === "assigned").length;
    const inTransit = orders.filter((o: any) => o.status === "in_transit").length;
    const delivered = orders.filter((o: any) => o.status === "delivered").length;
    const cancelled = orders.filter((o: any) => o.status === "cancelled").length;
    
    const totalEarnings = orders
      .filter((o: any) => o.status === "delivered")
      .reduce((sum: number, o: any) => sum + Number(o.delivery_fee || 0), 0);
    
    const avgDeliveryTime = orders
      .filter((o: any) => o.delivered_at && o.created_at)
      .reduce((sum: number, o: any) => {
        const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
        return sum + (diff / (1000 * 60));
      }, 0) / (orders.filter((o: any) => o.delivered_at && o.created_at).length || 1);

    const completionRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      cancelled,
      totalEarnings,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      completionRate,
      activeOrders: pending + assigned + inTransit,
    };
  }, [orders]);

  // ✅ فلترة الطلبات حسب الحالة والبحث
  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (statusFilter !== "all") {
      result = result.filter((o: any) => o.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o: any) => {
        return o.tracking_number?.toLowerCase().includes(q) ||
               o.delivery_name?.toLowerCase().includes(q) ||
               o.pickup_name?.toLowerCase().includes(q) ||
               o.delivery_address?.toLowerCase().includes(q);
      });
    }
    
    return result;
  }, [orders, statusFilter, searchQuery]);

  // ✅ دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "✅ تم تسجيل الخروج بنجاح" : "✅ Logged out successfully");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  };

  // ✅ تحديث حالة الطلب
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: newStatus as any,
        distributorId: currentDistributor?.id,
      });
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تحديث حالة الطلب إلى ${getStatusLabel(newStatus)}` 
          : `✅ Order status updated to ${getStatusLabel(newStatus)}`
      );
      
      setIsStatusDialogOpen(false);
    } catch (error) {
      toast.error(
        app.lang === "ar" 
          ? "❌ حدث خطأ في تحديث الحالة" 
          : "❌ Error updating status"
      );
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: app.lang === "ar" ? "قيد المراجعة" : "Pending",
      assigned: app.lang === "ar" ? "تم التعيين" : "Assigned",
      picked_up: app.lang === "ar" ? "تم الاستلام" : "Picked up",
      in_transit: app.lang === "ar" ? "قيد التوصيل" : "In Transit",
      delivered: app.lang === "ar" ? "تم التوصيل" : "Delivered",
      cancelled: app.lang === "ar" ? "ملغي" : "Cancelled",
    };
    return labels[status] || status;
  };

  const isArabic = app.lang === "ar";

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10">
        
        {/* ===== HEADER مع اسم التطبيق ===== */}
        <div className="relative bg-gradient-to-r from-[#0d2e2a] via-[#1a4f4a] to-[#2a655f] text-white overflow-hidden">
          
          {/* ✅ خلفية متحركة */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-spin-slow" />
          </div>
          
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          
          {/* ✅ سيارة تمشي في الهيدر */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/2 -translate-y-1/2 animate-drive-across">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                <Truck className="h-10 w-10 text-white animate-bounce-truck" />
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" style={{ animationDelay: '0.3s' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" style={{ animationDelay: '0.6s' }} />
                </div>
                <span className="text-[10px] font-bold text-white/30 tracking-widest animate-pulse">● ● ●</span>
              </div>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-4 md:py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* ✅ اسم التطبيق + معلومات الموزع */}
              <div className="flex items-center gap-4">
                {/* ✅ شعار التطبيق مع حركة */}
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-[#0d2e2a] border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-lg shadow-[#0d2e2a]/20 group-hover:scale-110 transition-all duration-500 animate-float">
                    <span className="text-2xl font-bold text-white">س</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </div>
                </div>
                
                <div>
                  {/* ✅ اسم التطبيق "السوق" */}
                <div className="flex items-center gap-2">
  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent animate-gradient">
    {isArabic ? "🛍️ السوق لعندك" : "🛍️ Souqi L3ndak"}
  </h1>
  <Badge className="bg-emerald-500/30 text-emerald-200 border-0 text-[8px] px-1.5 py-0 animate-pulse">
    {isArabic ? "🚚 توصيل" : "🚚 Delivery"}
  </Badge>
</div>
                  
                  <div className="text-white/80 text-sm flex items-center gap-2">
                    <Sparkles className="h-3 w-3 animate-spin-slow" />
                    {currentDistributor?.full_name_ar || currentDistributor?.full_name_en || (isArabic ? "مرحباً بك" : "Welcome")}
                    {currentDistributor?.is_available && (
                      <Badge className="bg-emerald-500/30 text-emerald-200 border-0 text-[10px] animate-pulse">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping mr-1" />
                        ● {isArabic ? "متاح" : "Available"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* ✅ الأزرار على اليمين مع حركات */}
              <div className="flex items-center gap-1.5 flex-wrap">
                
                {/* ✅ زر الإشعارات */}
                <DistributorNotifications 
                  userId={app.user?.id} 
                  isArabic={isArabic} 
                />

                {/* ✅ ✅ ✅ زر المحادثات - يفتح /distributor/messages ✅ ✅ ✅ */}
                <Link
                  to="/distributor/messages"
                  className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white border-0 text-[9px] animate-pulse shadow-lg shadow-red-500/50">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>

                {/* ✅ زر اللغة مع حركة */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12 group"
                      onClick={() => {
                        const newLang = isArabic ? "en" : "ar";
                        app.setLang(newLang);
                        toast.success(isArabic ? "✅ تم التبديل إلى الإنجليزية" : "✅ Switched to Arabic");
                      }}
                    >
                      <Languages className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                    <p>{isArabic ? "تبديل اللغة" : "Switch Language"}</p>
                  </TooltipContent>
                </Tooltip>

                {/* ✅ زر الحساب */}
                <DistributorAccountMenu 
                  userData={{
                    id: app.user?.id || '',
                    full_name: currentDistributor?.full_name_ar || app.user?.name || (isArabic ? 'موزع' : 'Distributor'),
                    phone: currentDistributor?.phone || app.user?.phone || '',
                    avatar_url: currentDistributor?.avatar_url || '',
                    role: 'distributor'
                  }}
                  companyName={currentDistributor?.delivery_companies?.name_ar}
                  isArabic={isArabic}
                  showEarnings={true}
                  earnings={stats.totalEarnings}
                  ordersCount={stats.delivered}
                  rating={currentDistributor?.rating || 0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS مع حركات ===== */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <StatCard 
              icon={ClipboardList} 
              label={isArabic ? "📋 الطلبات" : "📋 Orders"} 
              value={stats.total} 
              color="blue" 
            />
            <StatCard 
              icon={Clock} 
              label={isArabic ? "⏳ نشطة" : "⏳ Active"} 
              value={stats.activeOrders} 
              color="orange" 
            />
            <StatCard 
              icon={CheckCircle} 
              label={isArabic ? "✅ تم التوصيل" : "✅ Delivered"} 
              value={stats.delivered} 
              color="green" 
            />
            <StatCard 
              icon={TrendingUp} 
              label={isArabic ? "📈 نسبة الإنجاز" : "📈 Completion"} 
              value={`${stats.completionRate}%`} 
              color="purple" 
            />
            <StatCard 
              icon={Award} 
              label={isArabic ? "🏆 متوسط الوقت" : "🏆 Avg Time"} 
              value={`${stats.avgDeliveryTime} ${isArabic ? "د" : "min"}`} 
              color="indigo" 
            />
            <StatCard 
              icon={DollarSign} 
              label={isArabic ? "💰 الأرباح" : "💰 Earnings"} 
              value={`${stats.totalEarnings} ${app.currency}`} 
              color="emerald" 
            />
          </div>
        </div>

        {/* ===== ORDERS TAB ===== */}
        <div className="mx-auto max-w-7xl px-4 pb-12">
          <div className="flex items-center gap-2 border-b border-[#0d2e2a]/10 mb-6">
            <button
              className="flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 border-[#0d2e2a] text-[#0d2e2a] dark:text-[#4a9f95] hover:scale-105"
            >
              <Package className="h-4 w-4 animate-bounce-slow" />
              {isArabic ? "📦 الطلبات" : "📦 Orders"}
              {stats.pending > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-[10px] px-1.5 py-0.5 animate-pulse shadow-lg shadow-red-500/50">
                  {stats.pending}
                </Badge>
              )}
            </button>
          </div>

          {/* Orders */}
          <div className="animate-in slide-in-from-top-5 duration-300">
            {/* Filters مع حركات */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px] max-w-sm group">
                <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#0d2e2a] transition-all duration-300 group-focus-within:scale-110" />
                <Input
                  placeholder={isArabic ? "🔍 بحث عن طلب..." : "🔍 Search orders..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 h-10 rounded-xl border-slate-200/50 dark:border-slate-800/50 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground animate-pulse" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300 hover:border-[#0d2e2a]/30"
                >
                  <option value="all">{isArabic ? "جميع الحالات" : "All status"}</option>
                  <option value="pending">{isArabic ? "⏳ قيد المراجعة" : "⏳ Pending"}</option>
                  <option value="assigned">{isArabic ? "📌 تم التعيين" : "📌 Assigned"}</option>
                  <option value="picked_up">{isArabic ? "📦 تم الاستلام" : "📦 Picked up"}</option>
                  <option value="in_transit">{isArabic ? "🚚 قيد التوصيل" : "🚚 In transit"}</option>
                  <option value="delivered">{isArabic ? "✅ تم التوصيل" : "✅ Delivered"}</option>
                  <option value="cancelled">{isArabic ? "❌ ملغي" : "❌ Cancelled"}</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border border-dashed border-[#0d2e2a]/30 hover:border-[#0d2e2a]/50 transition-all duration-300 hover:scale-[1.01]">
                <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <Package className="h-10 w-10 text-[#0d2e2a]/40" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {isArabic ? "لا توجد طلبات" : "No orders"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {isArabic ? "لم يتم تعيين أي طلبات لك بعد" : "No orders assigned to you yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order: any) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={() => {
                      setSelectedOrder(order);
                      setIsStatusDialogOpen(true);
                    }}
                    onToggleMap={() => {
                      setShowMapOrderId(showMapOrderId === order.id ? null : order.id);
                    }}
                    showMap={showMapOrderId === order.id}
                    distributorLocation={currentDistributor?.latitude && currentDistributor?.longitude ? {
                      lat: currentDistributor.latitude,
                      lng: currentDistributor.longitude
                    } : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== STATUS UPDATE DIALOG ===== */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl border-[#0d2e2a]/20 shadow-2xl animate-in zoom-in-95 duration-300">
            <DialogHeader>
              <DialogTitle className="text-[#0d2e2a] dark:text-white flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin-slow" />
                {isArabic ? "تحديث حالة الطلب" : "Update Order Status"}
              </DialogTitle>
              <DialogDescription>
                {isArabic 
                  ? `اختر الحالة الجديدة للطلب #${selectedOrder?.tracking_number || selectedOrder?.id?.substring(0, 8)}` 
                  : `Select new status for order #${selectedOrder?.tracking_number || selectedOrder?.id?.substring(0, 8)}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { value: "picked_up", label: isArabic ? "📦 تم الاستلام" : "📦 Picked up", icon: Package, color: "blue" },
                { value: "in_transit", label: isArabic ? "🚚 قيد التوصيل" : "🚚 In Transit", icon: Truck, color: "orange" },
                { value: "delivered", label: isArabic ? "✅ تم التوصيل" : "✅ Delivered", icon: CheckCircle, color: "green" },
                { value: "cancelled", label: isArabic ? "❌ إلغاء" : "❌ Cancel", icon: XCircle, color: "red" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={cn(
                    "h-16 flex flex-col gap-1 transition-all duration-300 hover:scale-105",
                    `hover:border-${option.color}-500 hover:bg-${option.color}-50 dark:hover:bg-${option.color}-950/20`
                  )}
                  onClick={() => handleStatusUpdate(selectedOrder?.id, option.value)}
                  disabled={updateStatus.isPending}
                >
                  <option.icon className="h-5 w-5 group-hover:scale-110 transition-all duration-300" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          @keyframes drive-across {
            0% { transform: translateX(-20%); }
            100% { transform: translateX(120%); }
          }
          .animate-drive-across {
            animation: drive-across 14s linear infinite;
          }
          @keyframes bounce-truck {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-1deg); }
            75% { transform: translateY(-4px) rotate(1deg); }
          }
          .animate-bounce-truck {
            animation: bounce-truck 2.5s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease-in-out infinite;
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          .animate-ping {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    </TooltipProvider>
  );
}

// ============================================================
// 📦 StatCard Component مع حركات
// ============================================================
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:border-blue-500/40",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:border-orange-500/40",
    green: "bg-green-500/10 text-green-500 border-green-500/20 hover:border-green-500/40",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:border-emerald-500/40",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:border-purple-500/40",
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:border-indigo-500/40",
    red: "bg-red-500/10 text-red-500 border-red-500/20 hover:border-red-500/40",
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md hover:border-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground group-hover:text-[#0d2e2a] transition-colors duration-300">{label}</p>
          <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">{value}</p>
        </div>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300", colors[color], "group-hover:scale-110 group-hover:rotate-12")}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 OrderCard Component مع حركات
// ============================================================
function OrderCard({ 
  order, 
  onStatusUpdate, 
  onToggleMap, 
  showMap,
  distributorLocation 
}: { 
  order: any; 
  onStatusUpdate: () => void;
  onToggleMap: () => void;
  showMap: boolean;
  distributorLocation?: { lat: number; lng: number };
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const [showFullAddress, setShowFullAddress] = useState(false);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    assigned: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    picked_up: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_transit: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusLabels: Record<string, string> = {
    pending: isArabic ? "⏳ قيد المراجعة" : "⏳ Pending",
    assigned: isArabic ? "📌 تم التعيين" : "📌 Assigned",
    picked_up: isArabic ? "📦 تم الاستلام" : "📦 Picked up",
    in_transit: isArabic ? "🚚 قيد التوصيل" : "🚚 In Transit",
    delivered: isArabic ? "✅ تم التوصيل" : "✅ Delivered",
    cancelled: isArabic ? "❌ ملغي" : "❌ Cancelled",
  };

  const canUpdate = ["pending", "assigned", "picked_up", "in_transit"].includes(order.status);
  const address = order.delivery_address || order.pickup_address;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.01] group">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-[#0d2e2a]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
            <Package className="h-5 w-5 text-[#0d2e2a] dark:text-[#4a9f95] group-hover:scale-110 transition-all duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors duration-300">
                #{order.tracking_number || order.id.substring(0, 8)}
              </p>
              <Badge className={cn("border transition-all duration-300 hover:scale-105", statusColors[order.status] || "bg-slate-500/10 text-slate-500")}>
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1 group-hover:text-[#0d2e2a] transition-colors duration-300">
                <MapPin className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="truncate max-w-[150px]">
                  {address?.substring(0, 30) || (isArabic ? "عنوان غير محدد" : "No address")}
                </span>
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="font-medium text-[#0d2e2a] dark:text-[#4a9f95] group-hover:scale-105 transition-transform duration-300">
                {order.delivery_fee} {app.currency}
              </span>
              {order.distributor && (
                <>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <UserCheck className="h-3 w-3 animate-pulse" />
                    {order.distributor.full_name_ar || order.distributor.full_name_en}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 flex-wrap">
          {canUpdate && (
            <Button 
              size="sm" 
              className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white transition-all duration-300 hover:scale-105 text-xs shadow-lg shadow-[#0d2e2a]/20"
              onClick={onStatusUpdate}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1 group-hover:rotate-180 transition-all duration-500" />
              {isArabic ? "تحديث" : "Update"}
            </Button>
          )}
          
          {/* ✅ زر عرض الخريطة */}
          {address && (
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8 px-3 rounded-xl transition-all duration-300 hover:scale-105 text-xs",
                showMap ? "bg-[#0d2e2a]/10 border-[#0d2e2a]/30" : "hover:bg-[#0d2e2a]/10"
              )}
              onClick={onToggleMap}
            >
              <MapPin className={cn(
                "h-3.5 w-3.5 mr-1 transition-all duration-300",
                showMap ? "text-[#0d2e2a] scale-110" : "text-muted-foreground group-hover:scale-110"
              )} />
              {showMap ? (isArabic ? "إخفاء الخريطة" : "Hide Map") : (isArabic ? "عرض الخريطة" : "Show Map")}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 rounded-xl hover:bg-[#0d2e2a]/10 transition-all duration-300 group-hover:scale-110"
            onClick={() => window.location.href = `/tracking/${order.tracking_number}`}
          >
            <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* ✅ الخريطة */}
      {showMap && address && (
        <div className="mt-4 animate-in slide-in-from-top-3 duration-300">
          <OrderTrackingMap 
            deliveryAddress={address}
            pickupAddress={order.pickup_address}
            distributorLocation={distributorLocation}
            order={order}
          />
        </div>
      )}
    </div>
  );
}