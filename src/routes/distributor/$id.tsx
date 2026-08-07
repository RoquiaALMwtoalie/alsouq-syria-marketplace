// src/routes/distributor/$id.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDistributors, useDeliveryOrders } from "@/lib/queries";
import {
  User, Phone, Mail, MapPin, Star, 
  Truck, Package, Clock, Calendar,
  ChevronLeft, CheckCircle, XCircle,
  Award, MessageCircle, Navigation,
  Shield, Users, TrendingUp, DollarSign,
  Linkedin, Twitter, Globe, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/distributor/$id")({
  component: DistributorProfilePage,
  head: ({ params }) => ({
    meta: [
      { title: `الموزع - Souqi` },
      { name: "description", content: "ملف الموزع وتفاصيله" },
    ],
  }),
});

function DistributorProfilePage() {
  const { id } = Route.useParams();
  const app = useApp();
  const t = useT();
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "orders">("info");

  // ✅ جلب بيانات الموزع
  const { data: distributors = [], isLoading: loadingDistributor } = useDistributors({
    isAvailable: true,
  });
  const { data: orders = [], isLoading: loadingOrders } = useDeliveryOrders(app.user?.id);

  // ✅ الموزع المطلوب
  const distributor = useMemo(() => {
    return distributors.find((d: any) => d.id === id);
  }, [distributors, id]);

  // ✅ طلبات الموزع
  const distributorOrders = useMemo(() => {
    return orders.filter((o: any) => o.distributor_id === id);
  }, [orders, id]);

  // ✅ إحصائيات الموزع
  const stats = useMemo(() => {
    if (!distributor) return null;
    
    const total = distributorOrders.length;
    const delivered = distributorOrders.filter((o: any) => o.status === "delivered").length;
    const cancelled = distributorOrders.filter((o: any) => o.status === "cancelled").length;
    const inProgress = distributorOrders.filter((o: any) => 
      ["pending", "assigned", "picked_up", "in_transit"].includes(o.status)
    ).length;
    
    const totalRevenue = distributorOrders
      .filter((o: any) => o.status === "delivered")
      .reduce((sum: number, o: any) => sum + Number(o.delivery_fee || 0), 0);
    
    const completionRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return {
      total,
      delivered,
      cancelled,
      inProgress,
      totalRevenue,
      completionRate,
    };
  }, [distributor, distributorOrders]);

  const isArabic = app.lang === "ar";

  if (loadingDistributor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-64 w-full mt-4 rounded-2xl" />
          <Skeleton className="h-32 w-full mt-4 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold">
            {isArabic ? "لم نجد الموزع" : "Distributor Not Found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "لا يوجد موزع بهذا المعرف" 
              : "No distributor found with this ID"}
          </p>
          <Link to="/distributors">
            <Button className="mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
              {isArabic ? "العودة للموزعين" : "Back to Distributors"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <Link to="/distributors" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {isArabic ? "الموزعين" : "Distributors"}
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
                </h1>
                <p className="text-white/80 text-xs">
                  {isArabic ? "ملف الموزع" : "Distributor Profile"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <div className="mx-auto max-w-4xl px-4 -mt-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#2a655f]" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {distributor.avatar_url ? (
                    <img 
                      src={distributor.avatar_url} 
                      alt="" 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <User className="h-12 w-12 text-[#2a655f]" />
                  )}
                </div>
                {distributor.is_available && (
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">
                    {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
                  </h2>
                  {distributor.is_available ? (
                    <Badge className="bg-emerald-500 text-white border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {isArabic ? "متاح" : "Available"}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white border-0">
                      <XCircle className="h-3 w-3 mr-1" />
                      {isArabic ? "غير متاح" : "Unavailable"}
                    </Badge>
                  )}
                  {distributor.distributor_type === "company_employee" && (
                    <Badge className="bg-blue-500 text-white border-0">
                      <Truck className="h-3 w-3 mr-1" />
                      {isArabic ? "موظف شركة" : "Company Employee"}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {Number(distributor.rating || 0).toFixed(1)}
                    <span className="text-xs text-muted-foreground">
                      ({distributor.reviews_count || 0})
                    </span>
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {stats?.delivered || 0} {isArabic ? "طلب مكتمل" : "delivered"}
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{distributor.phone}</span>
                  </span>
                  {distributor.email && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {distributor.email}
                      </span>
                    </>
                  )}
                </div>

                {distributor.address_ar && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-[#2a655f]" />
                    {isArabic ? distributor.address_ar : distributor.address_en || distributor.address_ar}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                <Button className="bg-[#2a655f] hover:bg-[#3a8a82] text-white">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {isArabic ? "مراسلة" : "Message"}
                </Button>
                <Button variant="outline" className="border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10">
                  <Navigation className="h-4 w-4 mr-1" />
                  {isArabic ? "تتبع" : "Track"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== STATS ===== */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            icon={Package} 
            label={isArabic ? "إجمالي الطلبات" : "Total Orders"} 
            value={stats?.total || 0}
            color="blue"
          />
          <StatCard 
            icon={CheckCircle} 
            label={isArabic ? "مكتمل" : "Completed"} 
            value={stats?.delivered || 0}
            color="green"
          />
          <StatCard 
            icon={TrendingUp} 
            label={isArabic ? "نسبة الإنجاز" : "Completion Rate"} 
            value={`${stats?.completionRate || 0}%`}
            color="purple"
          />
          <StatCard 
            icon={DollarSign} 
            label={isArabic ? "الأرباح" : "Earnings"} 
            value={`${stats?.totalRevenue.toLocaleString() || 0}`}
            color="emerald"
          />
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="mx-auto max-w-4xl px-4 pb-12">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {isArabic ? "معلومات" : "Info"}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {isArabic ? "التقييمات" : "Reviews"}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isArabic ? "الطلبات" : "Orders"}
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB: INFO ===== */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "معلومات الموزع" : "Distributor Info"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">{isArabic ? "الاسم الكامل" : "Full Name"}</p>
                    <p className="font-medium">
                      {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">{isArabic ? "رقم الهاتف" : "Phone"}</p>
                    <p className="font-medium" dir="ltr">{distributor.phone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">{isArabic ? "البريد الإلكتروني" : "Email"}</p>
                    <p className="font-medium">{distributor.email || (isArabic ? "غير مسجل" : "Not registered")}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">{isArabic ? "نوع الموزع" : "Distributor Type"}</p>
                    <p className="font-medium">
                      {distributor.distributor_type === "company_employee" 
                        ? (isArabic ? "موظف شركة توصيل" : "Company Employee") 
                        : (isArabic ? "موزع مستقل" : "Freelance")}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl col-span-full">
                    <p className="text-sm text-muted-foreground">{isArabic ? "العنوان" : "Address"}</p>
                    <p className="font-medium">
                      {isArabic ? distributor.address_ar : distributor.address_en || distributor.address_ar || (isArabic ? "غير محدد" : "Not specified")}
                    </p>
                  </div>
                </div>

                {distributor.delivery_company_id && (
                  <div className="p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/20">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-[#2a655f]" />
                      <span className="font-medium">
                        {isArabic ? "تابع لشركة:" : "Belongs to:"}
                      </span>
                      <span className="text-[#2a655f] font-bold">
                        {distributor.delivery_company?.name_ar || distributor.delivery_company?.name_en || 
                         (isArabic ? "شركة توصيل" : "Delivery Company")}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: REVIEWS ===== */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "تقييمات الموزع" : "Distributor Reviews"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? `${distributor.reviews_count || 0} تقييم` 
                    : `${distributor.reviews_count || 0} reviews`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                  </div>
                ) : distributorOrders.filter((o: any) => o.distributor_rating).length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isArabic ? "لا توجد تقييمات لهذا الموزع" : "No reviews for this distributor"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {distributorOrders
                      .filter((o: any) => o.distributor_rating)
                      .slice(0, 10)
                      .map((order: any) => (
                        <div key={order.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn(
                                      "h-4 w-4",
                                      i < (order.distributor_rating || 0) 
                                        ? "fill-yellow-400 text-yellow-400" 
                                        : "text-slate-200"
                                    )} />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  {order.distributor_rating?.toFixed(1)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {order.distributor_review || (isArabic ? "لا يوجد تعليق" : "No comment")}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.delivered_at || order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: ORDERS ===== */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "طلبات الموزع" : "Distributor Orders"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? `عرض آخر ${Math.min(distributorOrders.length, 10)} طلبات` 
                    : `Showing latest ${Math.min(distributorOrders.length, 10)} orders`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : distributorOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isArabic ? "لا توجد طلبات لهذا الموزع" : "No orders for this distributor"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {distributorOrders.slice(0, 10).map((order: any) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                    {distributorOrders.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center pt-4">
                        {isArabic 
                          ? `و ${distributorOrders.length - 10} طلب آخر` 
                          : `And ${distributorOrders.length - 10} more orders`}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============================================================
// 📦 StatCard Component
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
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 OrderRow Component
// ============================================================
function OrderRow({ order }: { order: any }) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500",
    assigned: "bg-purple-500/10 text-purple-500",
    picked_up: "bg-blue-500/10 text-blue-500",
    in_transit: "bg-orange-500/10 text-orange-500",
    delivered: "bg-green-500/10 text-green-500",
    cancelled: "bg-red-500/10 text-red-500",
  };

  const statusLabels: Record<string, string> = {
    pending: isArabic ? "قيد المراجعة" : "Pending",
    assigned: isArabic ? "تم التعيين" : "Assigned",
    picked_up: isArabic ? "تم الاستلام" : "Picked up",
    in_transit: isArabic ? "قيد التوصيل" : "In Transit",
    delivered: isArabic ? "تم التوصيل" : "Delivered",
    cancelled: isArabic ? "ملغي" : "Cancelled",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
          <Package className="h-4 w-4 text-[#2a655f]" />
        </div>
        <div>
          <p className="font-medium text-sm">#{order.tracking_number || order.id.substring(0, 8)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={cn("border-0", statusColors[order.status] || "bg-slate-500/10 text-slate-500")}>
          {statusLabels[order.status] || order.status}
        </Badge>
        <span className="font-medium text-sm text-[#2a655f]">
          {order.delivery_fee} {app.currency}
        </span>
      </div>
    </div>
  );
}