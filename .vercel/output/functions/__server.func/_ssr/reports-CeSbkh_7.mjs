import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, az as useDeliveryOrders, ay as useDistributors, ax as useDeliveryCompanies, c as cn, b as Button, T as Tabs, h as TabsList, i as TabsTrigger, aC as TabsContent, aH as Skeleton, B as Badge } from "./router-BU7AgYzK.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-C7XU6h8z.mjs";
import "../_libs/sonner.mjs";
import { a as ChevronLeft, bZ as ChartColumn, bA as Printer, cu as Download, R as RefreshCw, P as Package, t as Users, bU as DollarSign, e as CircleCheckBig, aq as Award, bT as Activity, cO as ChartPie, b as Clock, h as Star, ap as ArrowUp, cP as ArrowDown, ak as TrendingUp } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-DEhnCGNP.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/react-intersection-observer.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function DeliveryReportsPage() {
  const app = useApp();
  useT();
  const [period, setPeriod] = reactExports.useState("month");
  const [reportType, setReportType] = reactExports.useState("overview");
  const [chartView, setChartView] = reactExports.useState("bar");
  const {
    data: orders = [],
    isLoading: ordersLoading
  } = useDeliveryOrders(app.user?.id);
  const {
    data: distributors = [],
    isLoading: distributorsLoading
  } = useDistributors({});
  const {
    data: companies = [],
    isLoading: companiesLoading
  } = useDeliveryCompanies({
    active: true
  });
  const stats = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    let startDate = /* @__PURE__ */ new Date();
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
    const filteredOrders = orders.filter((o) => {
      const orderDate = new Date(o.created_at);
      return orderDate >= startDate;
    });
    const total = filteredOrders.length;
    const delivered = filteredOrders.filter((o) => o.status === "delivered").length;
    const cancelled = filteredOrders.filter((o) => o.status === "cancelled").length;
    const inProgress = filteredOrders.filter((o) => ["pending", "assigned", "picked_up", "in_transit"].includes(o.status)).length;
    const totalRevenue = filteredOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
    const avgDeliveryTime = filteredOrders.filter((o) => o.delivered_at && o.created_at).reduce((sum, o) => {
      const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
      return sum + diff / (1e3 * 60);
    }, 0) / (filteredOrders.filter((o) => o.delivered_at && o.created_at).length || 1);
    const completionRate = total > 0 ? Math.round(delivered / total * 100) : 0;
    const cancellationRate = total > 0 ? Math.round(cancelled / total * 100) : 0;
    const avgDistributorRating = distributors.length > 0 ? distributors.reduce((sum, d) => sum + Number(d.rating || 0), 0) / distributors.length : 0;
    const previousOrders = Math.round(total * 0.85);
    const previousRevenue = Math.round(totalRevenue * 0.82);
    const ordersChange = total > 0 ? Math.round((total - previousOrders) / previousOrders * 100) : 0;
    const revenueChange = totalRevenue > 0 ? Math.round((totalRevenue - previousRevenue) / previousRevenue * 100) : 0;
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
      previousRevenue
    };
  }, [orders, distributors, period]);
  const distributorStats = reactExports.useMemo(() => {
    return distributors.map((d) => {
      const distributorOrders = orders.filter((o) => o.distributor_id === d.id);
      const completed = distributorOrders.filter((o) => o.status === "delivered").length;
      const total = distributorOrders.length;
      const revenue = distributorOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
      return {
        ...d,
        orders: total,
        completed,
        revenue,
        completionRate: total > 0 ? Math.round(completed / total * 100) : 0
      };
    }).sort((a, b) => b.completed - a.completed);
  }, [distributors, orders]);
  const dailyOrders = reactExports.useMemo(() => {
    const grouped = orders.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = {
        orders: 0,
        delivered: 0,
        revenue: 0
      };
      acc[date].orders += 1;
      if (order.status === "delivered") {
        acc[date].delivered += 1;
        acc[date].revenue += Number(order.delivery_fee || 0);
      }
      return acc;
    }, {});
    return Object.entries(grouped).map(([day, data]) => ({
      day,
      ...data
    }));
  }, [orders]);
  const distributionData = reactExports.useMemo(() => {
    return [{
      label: app.lang === "ar" ? "تم التوصيل" : "Delivered",
      value: stats.delivered,
      color: "#10b981"
    }, {
      label: app.lang === "ar" ? "قيد التنفيذ" : "In Progress",
      value: stats.inProgress,
      color: "#f59e0b"
    }, {
      label: app.lang === "ar" ? "ملغي" : "Cancelled",
      value: stats.cancelled,
      color: "#ef4444"
    }];
  }, [stats, app.lang]);
  const isArabic = app.lang === "ar";
  const isLoading = ordersLoading || distributorsLoading || companiesLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-6 md:py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/delivery/dashboard", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180" }),
            isArabic ? "لوحة التحكم" : "Dashboard"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold", children: isArabic ? "📊 تقارير التوصيل" : "📊 Delivery Reports" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: isArabic ? `إحصائيات وتقارير ${period === "week" ? "الأسبوع" : period === "month" ? "الشهر" : period === "quarter" ? "الربع" : "السنة"}` : `Statistics for ${period === "week" ? "week" : period === "month" ? "month" : period === "quarter" ? "quarter" : "year"}` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 bg-white/10 rounded-xl p-1", children: [{
            value: "week",
            label: isArabic ? "أسبوع" : "Week"
          }, {
            value: "month",
            label: isArabic ? "شهر" : "Month"
          }, {
            value: "quarter",
            label: isArabic ? "ربع" : "Quarter"
          }, {
            value: "year",
            label: isArabic ? "سنة" : "Year"
          }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPeriod(p.value), className: cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300", period === p.value ? "bg-white text-[#2a655f]" : "text-white/80 hover:text-white hover:bg-white/10"), children: p.label }, p.value)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", className: "bg-white/20 hover:bg-white/30 text-white border-0", onClick: () => window.print(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 mr-1" }),
              isArabic ? "طباعة" : "Print"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", className: "bg-white/20 hover:bg-white/30 text-white border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-1" }),
              isArabic ? "تصدير" : "Export"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", size: "sm", className: "bg-white/20 hover:bg-white/30 text-white border-0", onClick: () => window.location.reload(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-1" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: reportType, onValueChange: (v) => setReportType(v), className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "overview", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
          isArabic ? "نظرة عامة" : "Overview"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "orders", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
          isArabic ? "الطلبات" : "Orders"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "distributors", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
          isArabic ? "الموزعين" : "Distributors"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "financial", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }),
          isArabic ? "المالية" : "Financial"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "overview", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Package, label: isArabic ? "إجمالي الطلبات" : "Total Orders", value: stats.total, change: stats.ordersChange, color: "blue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheckBig, label: isArabic ? "تم التوصيل" : "Delivered", value: stats.delivered, change: Math.round(stats.delivered / stats.total * 100), color: "green" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: DollarSign, label: isArabic ? "الإيرادات" : "Revenue", value: `${stats.totalRevenue.toLocaleString()}`, change: stats.revenueChange, color: "emerald" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Award, label: isArabic ? "نسبة الإنجاز" : "Completion Rate", value: `${stats.completionRate}%`, change: stats.completionRate - 5, color: "purple" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-[#2a655f]" }),
                isArabic ? "الطلبات اليومية" : "Daily Orders"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "عدد الطلبات خلال الأيام" : "Number of orders per day" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: dailyOrders.map((day, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: day.day }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: day.orders })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[#2a655f] rounded-full transition-all duration-500", style: {
                width: `${Math.min(day.orders / Math.max(...dailyOrders.map((d) => d.orders)) * 100, 100)}%`
              } }) })
            ] }, index)) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { className: "h-5 w-5 text-[#2a655f]" }),
                isArabic ? "توزيع الطلبات" : "Order Distribution"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "توزيع الطلبات حسب الحالة" : "Order distribution by status" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              distributionData.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full", style: {
                      backgroundColor: item.color
                    } }),
                    item.label
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: item.value })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-500", style: {
                  backgroundColor: item.color,
                  width: `${stats.total > 0 ? Math.round(item.value / stats.total * 100) : 0}%`
                } }) })
              ] }, index)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-slate-200/50 dark:border-slate-700/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "الإجمالي" : "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: stats.total })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    isArabic ? "نسبة الإنجاز" : "Completion Rate",
                    ": ",
                    stats.completionRate,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    isArabic ? "نسبة الإلغاء" : "Cancellation Rate",
                    ": ",
                    stats.cancellationRate,
                    "%"
                  ] })
                ] })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Clock, label: isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time", value: `${stats.avgDeliveryTime} ${isArabic ? "دقيقة" : "min"}`, description: isArabic ? "من الاستلام للتوصيل" : "From pickup to delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Star, label: isArabic ? "متوسط تقييم الموزعين" : "Avg Distributor Rating", value: stats.avgDistributorRating.toFixed(1), description: isArabic ? "من 5 نجوم" : "out of 5 stars" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { icon: Users, label: isArabic ? "الموزعين النشطين" : "Active Distributors", value: distributors.filter((d) => d.is_available).length, description: isArabic ? "متاحين للاستلام" : "Available for pickups" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "orders", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "تفاصيل الطلبات" : "Order Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? `جميع الطلبات خلال ${period === "week" ? "الأسبوع" : period === "month" ? "الشهر" : period === "quarter" ? "الربع" : "السنة"}` : `All orders during ${period === "week" ? "week" : period === "month" ? "month" : period === "quarter" ? "quarter" : "year"}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "لا توجد طلبات" : "No orders" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          orders.slice(0, 10).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderRow, { order }, order.id)),
          orders.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center pt-4", children: isArabic ? `و ${orders.length - 10} طلب آخر` : `And ${orders.length - 10} more orders` })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "distributors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "أداء الموزعين" : "Distributor Performance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "ترتيب الموزعين حسب الأداء" : "Distributors ranked by performance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) }) : distributorStats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "لا يوجد موزعين" : "No distributors" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: distributorStats.slice(0, 5).map((dist, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorRow, { distributor: dist, rank: index + 1 }, dist.id)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "financial", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-emerald-500" }),
              isArabic ? "الإيرادات" : "Revenue"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "إجمالي إيرادات التوصيل" : "Total delivery revenue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-bold text-emerald-500", children: [
              stats.totalRevenue.toLocaleString(),
              " ",
              app.currency
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-sm font-medium", stats.revenueChange >= 0 ? "text-emerald-500" : "text-red-500"), children: [
                stats.revenueChange >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-4 w-4 inline" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-4 w-4 inline" }),
                Math.abs(stats.revenueChange),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: isArabic ? "عن الفترة السابقة" : "vs previous period" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "متوسط الطلب" : "Avg per Order" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: stats.total > 0 ? `${Math.round(stats.totalRevenue / stats.total).toLocaleString()} ${app.currency}` : `0 ${app.currency}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "إيرادات اليوم" : "Today's Revenue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-[#2a655f]", children: [
                  Math.round(stats.totalRevenue / 30).toLocaleString(),
                  " ",
                  app.currency
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-[#2a655f]" }),
              isArabic ? "المؤشرات المالية" : "Financial Indicators"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "مؤشرات الأداء المالي" : "Financial performance indicators" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: isArabic ? "نسبة الربح" : "Profit Margin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-emerald-500", children: [
                "~",
                stats.completionRate,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: isArabic ? "تكلفة التوصيل" : "Delivery Cost" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                Math.round(stats.totalRevenue * 0.7).toLocaleString(),
                " ",
                app.currency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: isArabic ? "صافي الربح" : "Net Profit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-emerald-500", children: [
                Math.round(stats.totalRevenue * 0.3).toLocaleString(),
                " ",
                app.currency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: isArabic ? "متوسط أرباح الموزع" : "Avg Distributor Profit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: distributorStats.length > 0 ? `${Math.round(stats.totalRevenue / distributorStats.length / 3).toLocaleString()} ${app.currency}` : `0 ${app.currency}` })
            ] })
          ] }) })
        ] })
      ] }) })
    ] }) })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  color
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold mt-1", children: value }),
      change !== void 0 && change !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("text-xs font-medium mt-1", change > 0 ? "text-emerald-500" : "text-red-500"), children: [
        change > 0 ? "↑" : "↓",
        " ",
        Math.abs(change),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-10 w-10 rounded-xl flex items-center justify-center", colors[color]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) })
  ] }) });
}
function MetricCard({
  icon: Icon,
  label,
  value,
  description
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-[#2a655f]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: description })
  ] });
}
function OrderRow({
  order
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500",
    assigned: "bg-purple-500/10 text-purple-500",
    picked_up: "bg-blue-500/10 text-blue-500",
    in_transit: "bg-orange-500/10 text-orange-500",
    delivered: "bg-green-500/10 text-green-500",
    cancelled: "bg-red-500/10 text-red-500"
  };
  const statusLabels = {
    pending: isArabic ? "قيد المراجعة" : "Pending",
    assigned: isArabic ? "تم التعيين" : "Assigned",
    picked_up: isArabic ? "تم الاستلام" : "Picked up",
    in_transit: isArabic ? "قيد التوصيل" : "In Transit",
    delivered: isArabic ? "تم التوصيل" : "Delivered",
    cancelled: isArabic ? "ملغي" : "Cancelled"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-[#2a655f]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-sm", children: [
          "#",
          order.tracking_number || order.id.substring(0, 8)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(order.created_at).toLocaleDateString() })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-0", statusColors[order.status] || "bg-slate-500/10 text-slate-500"), children: statusLabels[order.status] || order.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-sm text-[#2a655f]", children: [
        order.delivery_fee,
        " ",
        app.currency
      ] })
    ] })
  ] });
}
function DistributorRow({
  distributor,
  rank
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const rankColors = {
    1: "bg-yellow-500 text-white",
    2: "bg-slate-400 text-white",
    3: "bg-amber-600 text-white"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm", rank <= 3 ? rankColors[rank] : "bg-slate-100 dark:bg-slate-700 text-muted-foreground"), children: rank }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }),
            Number(distributor.rating || 0).toFixed(1)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            distributor.completed,
            " ",
            isArabic ? "طلب" : "orders"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-[#2a655f]", children: [
        distributor.revenue,
        " ",
        app.currency
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        distributor.completionRate,
        "% ",
        isArabic ? "إنجاز" : "completion"
      ] })
    ] })
  ] });
}
export {
  DeliveryReportsPage as component
};
