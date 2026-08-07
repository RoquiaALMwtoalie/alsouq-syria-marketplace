// src/routes/delivery/reports.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDeliveryOrders, useDistributors, useDeliveryCompanies } from "@/lib/queries";
import {
  BarChart3, PieChart, TrendingUp, TrendingDown, 
  DollarSign, Package, Truck, Users, 
  Calendar, Download, Filter, ChevronLeft,
  Clock, CheckCircle, XCircle, AlertCircle,
  Award, Star, Activity, ArrowUp, ArrowDown,
  Printer, FileText, Share2, RefreshCw
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/delivery/reports")({
  component: DeliveryReportsPage,
  head: () => ({
    meta: [
      { title: "تقارير التوصيل - Souqi" },
      { name: "description", content: "تقارير وإحصائيات شركة التوصيل" },
    ],
  }),
});

function DeliveryReportsPage() {
  const app = useApp();
  const t = useT();
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");
  const [reportType, setReportType] = useState<"overview" | "orders" | "distributors" | "financial">("overview");
  const [chartView, setChartView] = useState<"bar" | "pie">("bar");

  // ✅ جلب البيانات
  const { data: orders = [], isLoading: ordersLoading } = useDeliveryOrders(app.user?.id);
  const { data: distributors = [], isLoading: distributorsLoading } = useDistributors({});
  const { data: companies = [], isLoading: companiesLoading } = useDeliveryCompanies({ active: true });

  // ✅ حساب الإحصائيات حسب الفترة
  const stats = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredOrders = orders.filter((o: any) => {
      const orderDate = new Date(o.created_at);
      return orderDate >= startDate;
    });

    const total = filteredOrders.length;
    const delivered = filteredOrders.filter((o: any) => o.status === "delivered").length;
    const cancelled = filteredOrders.filter((o: any) => o.status === "cancelled").length;
    const inProgress = filteredOrders.filter((o: any) => 
      ["pending", "assigned", "picked_up", "in_transit"].includes(o.status)
    ).length;
    
    const totalRevenue = filteredOrders
      .filter((o: any) => o.status === "delivered")
      .reduce((sum: number, o: any) => sum + Number(o.delivery_fee || 0), 0);
    
    const avgDeliveryTime = filteredOrders
      .filter((o: any) => o.delivered_at && o.created_at)
      .reduce((sum: number, o: any) => {
        const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
        return sum + (diff / (1000 * 60));
      }, 0) / (filteredOrders.filter((o: any) => o.delivered_at && o.created_at).length || 1);

    const completionRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

    // ✅ تقييم الموزعين
    const avgDistributorRating = distributors.length > 0
      ? distributors.reduce((sum: number, d: any) => sum + Number(d.rating || 0), 0) / distributors.length
      : 0;

    // ✅ التغيير عن الفترة السابقة (محاكاة)
    const previousOrders = Math.round(total * 0.85);
    const previousRevenue = Math.round(totalRevenue * 0.82);
    const ordersChange = total > 0 ? Math.round(((total - previousOrders) / previousOrders) * 100) : 0;
    const revenueChange = totalRevenue > 0 ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100) : 0;

    return {
      total,
      delivered,
      cancelled,
      inProgress,
      totalRevenue,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      completionRate,
      cancellationRate,
      avgDistributorRating,
      ordersChange,
      revenueChange,
      previousOrders,
      previousRevenue,
    };
  }, [orders, distributors, period]);

  // ✅ بيانات الموزعين
  const distributorStats = useMemo(() => {
    return distributors.map((d: any) => {
      const distributorOrders = orders.filter((o: any) => o.distributor_id === d.id);
      const completed = distributorOrders.filter((o: any) => o.status === "delivered").length;
      const total = distributorOrders.length;
      const revenue = distributorOrders
        .filter((o: any) => o.status === "delivered")
        .reduce((sum: number, o: any) => sum + Number(o.delivery_fee || 0), 0);
      
      return {
        ...d,
        orders: total,
        completed,
        revenue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }).sort((a: any, b: any) => b.completed - a.completed);
  }, [distributors, orders]);

  // ✅ بيانات الطلبات اليومية (محاكاة)
 // ✅ بدلاً من البيانات العشوائية، استخدم:
const dailyOrders = useMemo(() => {
  // جلب الطلبات وتجميعها حسب اليوم
  const grouped = orders.reduce((acc: any, order: any) => {
    const date = new Date(order.created_at).toLocaleDateString();
    if (!acc[date]) acc[date] = { orders: 0, delivered: 0, revenue: 0 };
    acc[date].orders += 1;
    if (order.status === 'delivered') {
      acc[date].delivered += 1;
      acc[date].revenue += Number(order.delivery_fee || 0);
    }
    return acc;
  }, {});
  return Object.entries(grouped).map(([day, data]) => ({ day, ...data }));
}, [orders]);

  // ✅ بيانات التوزيع (محاكاة)
  const distributionData = useMemo(() => {
    return [
      { label: app.lang === 'ar' ? 'تم التوصيل' : 'Delivered', value: stats.delivered, color: '#10b981' },
      { label: app.lang === 'ar' ? 'قيد التنفيذ' : 'In Progress', value: stats.inProgress, color: '#f59e0b' },
      { label: app.lang === 'ar' ? 'ملغي' : 'Cancelled', value: stats.cancelled, color: '#ef4444' },
    ];
  }, [stats, app.lang]);

  const isArabic = app.lang === "ar";
  const isLoading = ordersLoading || distributorsLoading || companiesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <Link to="/delivery/dashboard" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {isArabic ? "لوحة التحكم" : "Dashboard"}
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {isArabic ? "📊 تقارير التوصيل" : "📊 Delivery Reports"}
                </h1>
                <p className="text-white/80 text-xs">
                  {isArabic 
                    ? `إحصائيات وتقارير ${period === 'week' ? 'الأسبوع' : period === 'month' ? 'الشهر' : period === 'quarter' ? 'الربع' : 'السنة'}` 
                    : `Statistics for ${period === 'week' ? 'week' : period === 'month' ? 'month' : period === 'quarter' ? 'quarter' : 'year'}`}
                </p>
              </div>
            </div>
          </div>

          {/* ===== PERIOD SELECTOR ===== */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
              {[
                { value: "week", label: isArabic ? "أسبوع" : "Week" },
                { value: "month", label: isArabic ? "شهر" : "Month" },
                { value: "quarter", label: isArabic ? "ربع" : "Quarter" },
                { value: "year", label: isArabic ? "سنة" : "Year" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                    period === p.value
                      ? "bg-white text-[#2a655f]"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-1" />
                {isArabic ? "طباعة" : "Print"}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Download className="h-4 w-4 mr-1" />
                {isArabic ? "تصدير" : "Export"}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        
        {/* ===== TABS ===== */}
        <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {isArabic ? "نظرة عامة" : "Overview"}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isArabic ? "الطلبات" : "Orders"}
            </TabsTrigger>
            <TabsTrigger value="distributors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isArabic ? "الموزعين" : "Distributors"}
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {isArabic ? "المالية" : "Financial"}
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB: OVERVIEW ===== */}
          <TabsContent value="overview">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard 
                    icon={Package} 
                    label={isArabic ? "إجمالي الطلبات" : "Total Orders"} 
                    value={stats.total} 
                    change={stats.ordersChange}
                    color="blue"
                  />
                  <StatCard 
                    icon={CheckCircle} 
                    label={isArabic ? "تم التوصيل" : "Delivered"} 
                    value={stats.delivered} 
                    change={Math.round((stats.delivered / stats.total) * 100)}
                    color="green"
                  />
                  <StatCard 
                    icon={DollarSign} 
                    label={isArabic ? "الإيرادات" : "Revenue"} 
                    value={`${stats.totalRevenue.toLocaleString()}`} 
                    change={stats.revenueChange}
                    color="emerald"
                  />
                  <StatCard 
                    icon={Award} 
                    label={isArabic ? "نسبة الإنجاز" : "Completion Rate"} 
                    value={`${stats.completionRate}%`} 
                    change={stats.completionRate - 5}
                    color="purple"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Daily Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#2a655f]" />
                        {isArabic ? "الطلبات اليومية" : "Daily Orders"}
                      </CardTitle>
                      <CardDescription>
                        {isArabic 
                          ? "عدد الطلبات خلال الأيام" 
                          : "Number of orders per day"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dailyOrders.map((day, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{day.day}</span>
                              <span className="font-medium">{day.orders}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#2a655f] rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.min((day.orders / Math.max(...dailyOrders.map(d => d.orders))) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-[#2a655f]" />
                        {isArabic ? "توزيع الطلبات" : "Order Distribution"}
                      </CardTitle>
                      <CardDescription>
                        {isArabic 
                          ? "توزيع الطلبات حسب الحالة" 
                          : "Order distribution by status"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {distributionData.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.label}
                              </span>
                              <span className="font-medium">{item.value}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                  backgroundColor: item.color,
                                  width: `${stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{isArabic ? "الإجمالي" : "Total"}</span>
                            <span>{stats.total}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{isArabic ? "نسبة الإنجاز" : "Completion Rate"}: {stats.completionRate}%</span>
                            <span>{isArabic ? "نسبة الإلغاء" : "Cancellation Rate"}: {stats.cancellationRate}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <MetricCard 
                    icon={Clock} 
                    label={isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time"} 
                    value={`${stats.avgDeliveryTime} ${isArabic ? 'دقيقة' : 'min'}`}
                    description={isArabic ? "من الاستلام للتوصيل" : "From pickup to delivery"}
                  />
                  <MetricCard 
                    icon={Star} 
                    label={isArabic ? "متوسط تقييم الموزعين" : "Avg Distributor Rating"} 
                    value={stats.avgDistributorRating.toFixed(1)}
                    description={isArabic ? "من 5 نجوم" : "out of 5 stars"}
                  />
                  <MetricCard 
                    icon={Users} 
                    label={isArabic ? "الموزعين النشطين" : "Active Distributors"} 
                    value={distributors.filter((d: any) => d.is_available).length}
                    description={isArabic ? "متاحين للاستلام" : "Available for pickups"}
                  />
                </div>
              </>
            )}
          </TabsContent>

          {/* ===== TAB: ORDERS ===== */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "تفاصيل الطلبات" : "Order Details"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? `جميع الطلبات خلال ${period === 'week' ? 'الأسبوع' : period === 'month' ? 'الشهر' : period === 'quarter' ? 'الربع' : 'السنة'}` 
                    : `All orders during ${period === 'week' ? 'week' : period === 'month' ? 'month' : period === 'quarter' ? 'quarter' : 'year'}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isArabic ? "لا توجد طلبات" : "No orders"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 10).map((order: any) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                    {orders.length > 10 && (
                      <p className="text-sm text-muted-foreground text-center pt-4">
                        {isArabic 
                          ? `و ${orders.length - 10} طلب آخر` 
                          : `And ${orders.length - 10} more orders`}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: DISTRIBUTORS ===== */}
          <TabsContent value="distributors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "أداء الموزعين" : "Distributor Performance"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "ترتيب الموزعين حسب الأداء" 
                    : "Distributors ranked by performance"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                ) : distributorStats.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {isArabic ? "لا يوجد موزعين" : "No distributors"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {distributorStats.slice(0, 5).map((dist: any, index: number) => (
                      <DistributorRow key={dist.id} distributor={dist} rank={index + 1} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: FINANCIAL ===== */}
          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    {isArabic ? "الإيرادات" : "Revenue"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic 
                      ? "إجمالي إيرادات التوصيل" 
                      : "Total delivery revenue"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-emerald-500">
                    {stats.totalRevenue.toLocaleString()} {app.currency}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "text-sm font-medium",
                      stats.revenueChange >= 0 ? "text-emerald-500" : "text-red-500"
                    )}>
                      {stats.revenueChange >= 0 ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                      {Math.abs(stats.revenueChange)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {isArabic ? "عن الفترة السابقة" : "vs previous period"}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-muted-foreground">{isArabic ? "متوسط الطلب" : "Avg per Order"}</p>
                      <p className="font-bold">
                        {stats.total > 0 
                          ? `${Math.round(stats.totalRevenue / stats.total).toLocaleString()} ${app.currency}` 
                          : `0 ${app.currency}`}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-muted-foreground">{isArabic ? "إيرادات اليوم" : "Today's Revenue"}</p>
                      <p className="font-bold text-[#2a655f]">
                        {Math.round(stats.totalRevenue / 30).toLocaleString()} {app.currency}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#2a655f]" />
                    {isArabic ? "المؤشرات المالية" : "Financial Indicators"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic 
                      ? "مؤشرات الأداء المالي" 
                      : "Financial performance indicators"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <span className="text-sm">{isArabic ? "نسبة الربح" : "Profit Margin"}</span>
                      <span className="font-bold text-emerald-500">~{stats.completionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <span className="text-sm">{isArabic ? "تكلفة التوصيل" : "Delivery Cost"}</span>
                      <span className="font-bold">{Math.round(stats.totalRevenue * 0.7).toLocaleString()} {app.currency}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <span className="text-sm">{isArabic ? "صافي الربح" : "Net Profit"}</span>
                      <span className="font-bold text-emerald-500">{Math.round(stats.totalRevenue * 0.3).toLocaleString()} {app.currency}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <span className="text-sm">{isArabic ? "متوسط أرباح الموزع" : "Avg Distributor Profit"}</span>
                      <span className="font-bold">
                        {distributorStats.length > 0 
                          ? `${Math.round(stats.totalRevenue / distributorStats.length / 3).toLocaleString()} ${app.currency}` 
                          : `0 ${app.currency}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
  change, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  change?: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && change !== 0 && (
            <p className={cn(
              "text-xs font-medium mt-1",
              change > 0 ? "text-emerald-500" : "text-red-500"
            )}>
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", colors[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 MetricCard Component
// ============================================================
function MetricCard({ icon: Icon, label, value, description }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-center">
      <div className="h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2">
        <Icon className="h-5 w-5 text-[#2a655f]" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
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

// ============================================================
// 📦 DistributorRow Component
// ============================================================
function DistributorRow({ distributor, rank }: { distributor: any; rank: number }) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  const rankColors = {
    1: "bg-yellow-500 text-white",
    2: "bg-slate-400 text-white",
    3: "bg-amber-600 text-white",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm",
          rank <= 3 ? rankColors[rank as keyof typeof rankColors] : "bg-slate-100 dark:bg-slate-700 text-muted-foreground"
        )}>
          {rank}
        </div>
        <div>
          <p className="font-medium">
            {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {Number(distributor.rating || 0).toFixed(1)}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span>{distributor.completed} {isArabic ? "طلب" : "orders"}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-[#2a655f]">{distributor.revenue} {app.currency}</p>
        <p className="text-xs text-muted-foreground">
          {distributor.completionRate}% {isArabic ? "إنجاز" : "completion"}
        </p>
      </div>
    </div>
  );
}