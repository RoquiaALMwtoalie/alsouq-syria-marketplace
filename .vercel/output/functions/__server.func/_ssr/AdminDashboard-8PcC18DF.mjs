import { r as reactExports, j as jsxRuntimeExports, R as React__default } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a7 as useAllListingsAdmin, a8 as useAdminAllStores, a9 as useAllSellerApplications, B as Badge, I as Input, P as Avatar, Q as AvatarImage, U as AvatarFallback, b as Button, c as cn, aa as useMyOrders, V as useNotifications, ab as useAllBanners, ac as useAllAnnouncements, e as useCategories, k as formatPrice, ad as useSetListingStatus, ae as useAdminDeleteListing, af as useSetListingFeatured, E as useSendNotificationV2, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, L as Label, j as Textarea, w as DialogFooter, ag as useSetStoreActive, ah as useSetStoreFeatured, ax as useDeliveryCompanies, ay as useDistributors, az as useDeliveryOrders, aA as useUpdateDeliveryCompany, aB as useCreateDeliveryCompany, _ as DialogTrigger, T as Tabs, h as TabsList, i as TabsTrigger, aC as TabsContent, aE as useAllStores, aF as useAllComplaints, aG as useUpdateComplaint, a as useT, ai as useReviewSellerApplication, aj as useSaveBanner, ak as useDeleteBanner, d as ImageInput, O as OptimizedImage, al as useSaveAnnouncement, am as useDeleteAnnouncement, an as useSaveCategory, ao as useDeleteCategory, ap as NOTIFICATION_TYPES, aq as useUserNotifications, ar as useUserNotificationsStats, as as useSendBulkNotificationsV2, at as useDeleteNotificationV2, au as useMarkNotificationReadV2, av as Checkbox, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, a2 as DropdownMenuItem, aD as buttonVariants, aw as NOTIFICATION_CONFIG } from "./router-BU7AgYzK.mjs";
import { u as utils, w as writeSync } from "../_libs/xlsx.mjs";
import { p as pkg, a as pkg__default } from "../_libs/file-saver.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BsaVHwzL.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { u as useQueryClient, a as useMutation, b as useQuery, c as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { S as Switch } from "./switch-CsdoyQ0i.mjs";
import { R as Root$1 } from "../_libs/radix-ui__react-separator.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-C7XU6h8z.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-CtuXcnOY.mjs";
import { k as ShieldCheck, b as Clock, q as Search, X, P as Package, c as Store, a as ChevronLeft$1, Z as Zap, C as ChevronRight$1, ai as Bell, bR as Tags, al as Megaphone, bK as Image, d as TriangleAlert, T as Tag, m as Truck, n as LayoutDashboard, a8 as ShoppingCart, t as Users, bS as Target, bT as Activity, bU as DollarSign, bV as FileSpreadsheet, an as FileText, bA as Printer, g as Sparkles, bM as ArrowUpRight, bW as ArrowDownRight, ar as Rocket, bt as Gem, R as RefreshCw, a4 as CircleCheck, F as Flame, s as Funnel, L as Layers, N as CircleX, a1 as Shield, p as LoaderCircle, v as Trash2, o as MessageCircle, W as Eye, $ as Info, B as Building2, f as Plus, h as Star, ah as UserPlus, U as User, bX as Save, r as Phone, as as Mail$1, bY as SquarePen, e as CircleCheckBig, bZ as ChartColumn, j as Percent, G as Gift, O as Calendar$1, b_ as CalendarClock, b$ as Timer, aa as Globe, u as Check, c0 as Reply, Y as Send, _ as CircleAlert, c1 as MessageSquare, a0 as MapPin, bb as Pencil, c2 as Link2, c3 as EyeOff, c4 as Hash, c5 as GripVertical, c6 as Folder, J as FolderTree, c7 as FolderOpen, c8 as CornerDownRight, a9 as Settings, ak as TrendingUp, c9 as Upload, ca as Copy, E as EllipsisVertical, y as ChevronDown, V as ChevronUp, i as ShoppingBag } from "../_libs/lucide-react.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "../_libs/react-day-picker.mjs";
const { saveAs: saveAs$4 } = pkg;
const CHART_COLORS = {
  green: ["#2a655f", "#3a8a82", "#1a4f4a", "#4a9f95", "#6bb5aa", "#8dcfc6"],
  slate: ["#94a3b8", "#cbd5e1", "#64748b", "#e2e8f0", "#94a3b8"],
  gray: ["#4b5563", "#6b7280", "#9ca3af", "#d1d5db"]
};
function AdminOverview({ onGoto, searchQuery = "" }) {
  const app = useApp();
  const { data: pending = [] } = useAllListingsAdmin("pending");
  const { data: all = [] } = useAllListingsAdmin();
  const { data: storesData } = useAdminAllStores();
  const stores = storesData?.data || [];
  const { data: appsData } = useAllSellerApplications();
  const apps = appsData?.data || [];
  const { data: sellerOrdersRaw = [] } = useMyOrders();
  const { data: notifications = [] } = useNotifications(app.user?.id);
  const { data: banners = [] } = useAllBanners();
  const { data: announcements = [] } = useAllAnnouncements();
  const { data: categories = [] } = useCategories();
  const pendingApps = apps.filter((a) => a.status === "pending");
  const activeBanners = banners.filter((b) => b.active !== false);
  const activeAnnouncements = announcements.filter((a) => a.active !== false);
  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const filteredAll = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase().trim();
    return all.filter((p) => {
      const title = (app.lang === "ar" ? p.title_ar : p.title_en) || "";
      return title.toLowerCase().includes(q);
    });
  }, [all, searchQuery, app.lang]);
  const filteredStores = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase().trim();
    return stores.filter((s) => {
      return (s.store_name || "").toLowerCase().includes(q);
    });
  }, [stores, searchQuery]);
  const filteredApps = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const q = searchQuery.toLowerCase().trim();
    return apps.filter((a) => {
      return (a.store_name || "").toLowerCase().includes(q);
    });
  }, [apps, searchQuery]);
  const totalRevenue = sellerOrdersRaw.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = sellerOrdersRaw.length;
  const growthData = reactExports.useMemo(() => {
    if (sellerOrdersRaw.length === 0) {
      return { growth: 0, isPositive: true };
    }
    const now = /* @__PURE__ */ new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const currentMonthOrders = sellerOrdersRaw.filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const lastMonthOrders = sellerOrdersRaw.filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });
    const currentTotal = currentMonthOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const lastTotal = lastMonthOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    if (lastTotal === 0) return { growth: 100, isPositive: true };
    const growth = (currentTotal - lastTotal) / lastTotal * 100;
    return {
      growth: Math.round(growth * 10) / 10,
      isPositive: growth >= 0
    };
  }, [sellerOrdersRaw]);
  reactExports.useMemo(() => {
    return unreadNotifications.length;
  }, [unreadNotifications]);
  reactExports.useMemo(() => {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const result = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      const year = now.getFullYear() - (now.getMonth() - i < 0 ? 1 : 0);
      const monthOrders = sellerOrdersRaw.filter((o) => {
        const d = new Date(o.created_at);
        return d.getMonth() === monthIndex && d.getFullYear() === year;
      });
      const revenue = monthOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      result.push({
        name: app.lang === "ar" ? months[monthIndex] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex],
        revenue: Math.round(revenue),
        orders: monthOrders.length
      });
    }
    return result;
  }, [sellerOrdersRaw, app.lang]);
  reactExports.useMemo(() => {
    const published = all.filter((p) => p.status === "published").length;
    const pendingCount = all.filter((p) => p.status === "pending").length;
    const archived = all.filter((p) => p.status === "archived").length;
    return [
      { name: app.lang === "ar" ? "منشور" : "Published", value: published, color: CHART_COLORS.green[0] },
      { name: app.lang === "ar" ? "قيد المراجعة" : "Pending", value: pendingCount, color: CHART_COLORS.slate[0] },
      { name: app.lang === "ar" ? "مؤرشف" : "Archived", value: archived, color: CHART_COLORS.green[2] }
    ];
  }, [all, app.lang]);
  reactExports.useMemo(() => {
    const active = stores.filter((s) => s.store_active !== false).length;
    const banned = stores.filter((s) => s.store_active === false).length;
    return [
      { name: app.lang === "ar" ? "نشط" : "Active", value: active, color: CHART_COLORS.green[0] },
      { name: app.lang === "ar" ? "محظور" : "Banned", value: banned, color: CHART_COLORS.gray[0] }
    ];
  }, [stores, app.lang]);
  reactExports.useMemo(() => {
    const sellerMap = {};
    sellerOrdersRaw.forEach((o) => {
      const sellerId = o.seller_id || "unknown";
      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          name: o.seller_name || `بائع ${sellerId.slice(0, 4)}`,
          revenue: 0,
          orders: 0
        };
      }
      sellerMap[sellerId].revenue += Number(o.total || 0);
      sellerMap[sellerId].orders += 1;
    });
    return Object.values(sellerMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [sellerOrdersRaw]);
  app.lang === "ar";
  const searchResults = {
    products: filteredAll.length,
    stores: filteredStores.length,
    applications: filteredApps.length,
    total: filteredAll.length + filteredStores.length + filteredApps.length
  };
  const quickStats = [
    {
      label: app.lang === "ar" ? "إجمالي الطلبات" : "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      change: `${totalOrders > 0 ? "+" : ""}${totalOrders > 0 ? Math.round(totalOrders / (sellerOrdersRaw.length || 1) * 100) : 0}%`,
      changeType: totalOrders > 0 ? "up" : "down",
      color: "text-[#2a655f]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      gradient: "from-[#2a655f] to-[#3a8a82]"
    },
    {
      label: app.lang === "ar" ? "إجمالي المستخدمين" : "Total Users",
      value: stores.length + all.length,
      icon: Users,
      change: `${stores.length > 0 ? "+" : ""}${stores.length > 0 ? Math.round(stores.length / (all.length || 1) * 100) : 0}%`,
      changeType: stores.length > 0 ? "up" : "down",
      color: "text-[#3a8a82]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      gradient: "from-[#3a8a82] to-[#4a9f95]"
    },
    {
      label: app.lang === "ar" ? "متوسط الطلب" : "Avg Order",
      value: formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang),
      icon: Target,
      change: `${totalOrders > 0 ? "+" : ""}${totalOrders > 0 ? Math.round(totalRevenue / totalOrders / (totalRevenue / (totalOrders || 1)) * 100) : 0}%`,
      changeType: totalOrders > 0 ? "up" : "down",
      color: "text-[#1a4f4a]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      gradient: "from-[#1a4f4a] to-[#3a8a82]"
    }
  ];
  const additionalStats = [
    {
      label: app.lang === "ar" ? "البنرات النشطة" : "Active Banners",
      value: activeBanners.length,
      icon: LayoutDashboard,
      gradient: "from-[#2a655f] to-[#1a4f4a]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]"
    },
    {
      label: app.lang === "ar" ? "الإعلانات النشطة" : "Active Announcements",
      value: activeAnnouncements.length,
      icon: Megaphone,
      gradient: "from-[#1a4f4a] to-[#3a8a82]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]"
    },
    {
      label: app.lang === "ar" ? "التصنيفات" : "Categories",
      value: categories.length,
      icon: Tags,
      gradient: "from-[#3a8a82] to-[#4a9f95]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]"
    },
    {
      label: app.lang === "ar" ? "الإشعارات غير المقروءة" : "Unread Notifications",
      value: unreadNotifications.length,
      icon: Bell,
      gradient: "from-[#4a9f95] to-[#6bb5aa]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]"
    }
  ];
  const platformStats = [
    {
      label: app.lang === "ar" ? "منتجات بانتظار الموافقة" : "Products Pending",
      value: pending.length,
      icon: Package,
      gradient: "from-[#2a655f] to-[#1a4f4a]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      to: "listings",
      glow: "shadow-[#2a655f]/20"
    },
    {
      label: app.lang === "ar" ? "طلبات بائعين جديدة" : "Seller Applications",
      value: pendingApps.length,
      icon: ShieldCheck,
      gradient: "from-[#1a4f4a] to-[#3a8a82]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      to: "applications",
      glow: "shadow-[#1a4f4a]/20"
    },
    {
      label: app.lang === "ar" ? "إجمالي المتاجر" : "Total Stores",
      value: stores.length,
      icon: Store,
      gradient: "from-[#3a8a82] to-[#4a9f95]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      to: "stores",
      glow: "shadow-[#3a8a82]/20"
    },
    {
      label: app.lang === "ar" ? "إجمالي المنتجات" : "Total Products",
      value: all.length,
      icon: LayoutDashboard,
      gradient: "from-[#4a9f95] to-[#6bb5aa]",
      border: "border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f]",
      to: "listings",
      glow: "shadow-[#4a9f95]/20"
    }
  ];
  const exportOverviewToExcel = () => {
    const exportData = [
      {
        "المؤشر": app.lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
        "القيمة": formatPrice(totalRevenue, app.currency, app.lang),
        "التغير": `${growthData.isPositive ? "+" : ""}${growthData.growth}%`
      },
      {
        "المؤشر": app.lang === "ar" ? "إجمالي الطلبات" : "Total Orders",
        "القيمة": totalOrders,
        "التغير": `${totalOrders > 0 ? "+" : ""}${totalOrders > 0 ? Math.round(totalOrders / (sellerOrdersRaw.length || 1) * 100) : 0}%`
      },
      {
        "المؤشر": app.lang === "ar" ? "إجمالي المستخدمين" : "Total Users",
        "القيمة": stores.length + all.length,
        "التغير": `${stores.length > 0 ? "+" : ""}${stores.length > 0 ? Math.round(stores.length / (all.length || 1) * 100) : 0}%`
      },
      {
        "المؤشر": app.lang === "ar" ? "متوسط الطلب" : "Avg Order",
        "القيمة": formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang),
        "التغير": `${totalOrders > 0 ? "+" : ""}${totalOrders > 0 ? Math.round(totalRevenue / totalOrders / (totalRevenue / (totalOrders || 1)) * 100) : 0}%`
      },
      {
        "المؤشر": app.lang === "ar" ? "إجمالي المنتجات" : "Total Products",
        "القيمة": all.length,
        "التغير": ""
      },
      {
        "المؤشر": app.lang === "ar" ? "المنتجات بانتظار الموافقة" : "Pending Products",
        "القيمة": pending.length,
        "التغير": ""
      },
      {
        "المؤشر": app.lang === "ar" ? "إجمالي المتاجر" : "Total Stores",
        "القيمة": stores.length,
        "التغير": ""
      },
      {
        "المؤشر": app.lang === "ar" ? "طلبات البائعين" : "Seller Applications",
        "القيمة": pendingApps.length,
        "التغير": ""
      },
      {
        "المؤشر": app.lang === "ar" ? "البنرات النشطة" : "Active Banners",
        "القيمة": activeBanners.length,
        "التغير": ""
      },
      {
        "المؤشر": app.lang === "ar" ? "الإعلانات النشطة" : "Active Announcements",
        "القيمة": activeAnnouncements.length,
        "التغير": ""
      }
    ];
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "نظرة عامة");
    ws["!cols"] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$4(blob, `نظرة_عامة_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير نظرة عامة إلى Excel" : "✅ Overview exported to Excel");
  };
  const exportOverviewToWord = () => {
    const now = (/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA");
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 30px; background: #f8fafc; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #2a655f, #1a4f4a); color: white; border-radius: 12px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0; opacity: 0.8; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #2a655f; }
        .stat-card .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
        .stat-card .value { font-size: 24px; font-weight: bold; color: #1e293b; margin: 4px 0; }
        .stat-card .change { font-size: 13px; }
        .stat-card .change.up { color: #2a655f; }
        .stat-card .change.down { color: #ef4444; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #2a655f; color: white; padding: 12px; text-align: right; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: right; }
        tr:hover { background: #f8fafc; }
        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
        .badge-green { background: #d0ece8; color: #0d2e2a; }
        .badge-yellow { background: #fef3c7; color: #92400e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
      </style></head>
     <body>
  <div class="header"><h1>📊 تقرير نظرة عامة</h1><p>${now} | ذوق</p></div>
  <div class="stats-grid">
`;
    const statsItems = [
      { label: app.lang === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: formatPrice(totalRevenue, app.currency, app.lang), change: `${growthData.isPositive ? "+" : ""}${growthData.growth}%`, changeType: growthData.isPositive ? "up" : "down" },
      { label: app.lang === "ar" ? "إجمالي الطلبات" : "Total Orders", value: totalOrders, change: `${totalOrders > 0 ? "+" : ""}${totalOrders > 0 ? Math.round(totalOrders / (sellerOrdersRaw.length || 1) * 100) : 0}%`, changeType: totalOrders > 0 ? "up" : "down" },
      { label: app.lang === "ar" ? "إجمالي المستخدمين" : "Total Users", value: stores.length + all.length, change: `${stores.length > 0 ? "+" : ""}${stores.length > 0 ? Math.round(stores.length / (all.length || 1) * 100) : 0}%`, changeType: stores.length > 0 ? "up" : "down" },
      { label: app.lang === "ar" ? "متوسط الطلب" : "Avg Order", value: formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, app.currency, app.lang), change: `${totalOrders > 0 ? "+" : ""}${totalOrders > 0 ? Math.round(totalRevenue / totalOrders / (totalRevenue / (totalOrders || 1)) * 100) : 0}%`, changeType: totalOrders > 0 ? "up" : "down" }
    ];
    statsItems.forEach((stat) => {
      const changeClass = stat.changeType === "up" ? "up" : "down";
      htmlContent += `<div class="stat-card"><div class="label">${stat.label}</div><div class="value">${stat.value}</div><div class="change ${changeClass}">${stat.change}</div></div>`;
    });
    htmlContent += `
        </div>
        <h2 style="margin-top: 30px; color: #1e293b; font-size: 18px;">📋 إحصائيات المنصة</h2>
        <table><thead><tr><th>#</th><th>${app.lang === "ar" ? "المؤشر" : "Indicator"}</th><th>${app.lang === "ar" ? "القيمة" : "Value"}</th><th>${app.lang === "ar" ? "الحالة" : "Status"}</th></tr></thead><tbody>
    `;
    const tableData = [
      { label: app.lang === "ar" ? "إجمالي المنتجات" : "Total Products", value: all.length, badge: "badge-green", status: app.lang === "ar" ? "نشط" : "Active" },
      { label: app.lang === "ar" ? "منتجات بانتظار الموافقة" : "Pending Products", value: pending.length, badge: "badge-yellow", status: app.lang === "ar" ? "قيد المراجعة" : "Pending" },
      { label: app.lang === "ar" ? "إجمالي المتاجر" : "Total Stores", value: stores.length, badge: "badge-green", status: app.lang === "ar" ? "نشط" : "Active" },
      { label: app.lang === "ar" ? "طلبات بائعين جديدة" : "Seller Applications", value: pendingApps.length, badge: "badge-yellow", status: app.lang === "ar" ? "قيد المراجعة" : "Pending" },
      { label: app.lang === "ar" ? "البنرات النشطة" : "Active Banners", value: activeBanners.length, badge: "badge-green", status: app.lang === "ar" ? "نشط" : "Active" },
      { label: app.lang === "ar" ? "الإعلانات النشطة" : "Active Announcements", value: activeAnnouncements.length, badge: "badge-green", status: app.lang === "ar" ? "نشط" : "Active" },
      { label: app.lang === "ar" ? "التصنيفات" : "Categories", value: categories.length, badge: "badge-green", status: app.lang === "ar" ? "نشط" : "Active" },
      { label: app.lang === "ar" ? "الإشعارات غير المقروءة" : "Unread Notifications", value: unreadNotifications.length, badge: unreadNotifications.length > 0 ? "badge-red" : "badge-green", status: unreadNotifications.length > 0 ? app.lang === "ar" ? "غير مقروءة" : "Unread" : app.lang === "ar" ? "مقروءة" : "Read" }
    ];
    tableData.forEach((item, index) => {
      htmlContent += `<tr><td>${index + 1}</td><td>${item.label}</td><td><strong>${item.value}</strong></td><td><span class="badge ${item.badge}">${item.status}</span></td></tr>`;
    });
    htmlContent += `
  </tbody></table>
  <div class="footer">تم التصدير من ذوق | ${now}</div>
</body></html>
`;
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs$4(blob, `نظرة_عامة_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير نظرة عامة إلى Word" : "✅ Overview exported to Word");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in slide-in-from-bottom-5 duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: searchQuery.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? "نتائج البحث" : "Search Results" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white text-sm px-3 py-1 shadow-lg shadow-[#2a655f]/30", children: [
            searchResults.total,
            " ",
            app.lang === "ar" ? "نتيجة" : "results"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: app.lang === "ar" ? "نظرة عامة" : "Overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            app.lang === "ar" ? "مباشر" : "Live"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: searchQuery.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? `نتائج البحث عن "${searchQuery}"` : `Results for "${searchQuery}"` }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: formatPrice(totalRevenue, app.currency, app.lang) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "إيرادات" : "revenue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-400/20 hover:bg-slate-500/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 text-slate-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 dark:text-slate-300 font-medium", children: totalOrders }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "طلبات" : "orders" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: stores.length + all.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "مستخدم" : "users" })
          ] })
        ] }) })
      ] }),
      !searchQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-[#2a655f]/40 dark:border-[#3a8a82]/30 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: exportOverviewToExcel,
              className: "rounded-lg h-9 px-4 text-[#2a655f] hover:bg-[#2a655f]/10 hover:text-[#2a655f] gap-2 transition-all duration-300 hover:scale-105",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Excel" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: exportOverviewToWord,
              className: "rounded-lg h-9 px-4 text-[#1a4f4a] hover:bg-[#1a4f4a]/10 hover:text-[#1a4f4a] gap-2 transition-all duration-300 hover:scale-105",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Word" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "rounded-lg h-9 px-3 text-slate-500 hover:bg-[#2a655f]/10 transition-all duration-300",
              onClick: () => window.print(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          app.lang === "ar" ? "تقرير لحظي" : "Live Report"
        ] })
      ] })
    ] }),
    searchQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-5 duration-300", children: [
      { key: "products", label: app.lang === "ar" ? "المنتجات" : "Products", count: searchResults.products, icon: Package, gradient: "from-[#2a655f] to-[#1a4f4a]" },
      { key: "stores", label: app.lang === "ar" ? "المتاجر" : "Stores", count: searchResults.stores, icon: Store, gradient: "from-[#1a4f4a] to-[#3a8a82]" },
      { key: "applications", label: app.lang === "ar" ? "طلبات البائعين" : "Applications", count: searchResults.applications, icon: ShieldCheck, gradient: "from-[#3a8a82] to-[#4a9f95]" }
    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          if (item.key === "products") onGoto("listings");
          else if (item.key === "stores") onGoto("stores");
          else if (item.key === "applications") onGoto("applications");
        },
        className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30 hover:border-[#2a655f] p-4 text-center hover:shadow-xl hover:shadow-[#2a655f]/20 transition-all hover:scale-[1.02]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-[#2a655f]/20 group-hover:scale-110 transition-all duration-300`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-500 dark:text-slate-400", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: item.count })
            ] })
          ] }),
          item.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-[#2a655f] font-medium group-hover:translate-x-1 transition-transform duration-300", children: [
            app.lang === "ar" ? "عرض الكل" : "View all",
            " →"
          ] })
        ]
      },
      item.key
    )) }),
    searchQuery.trim() && searchResults.total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30 p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-10 w-10 text-[#2a655f]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: app.lang === "ar" ? "لا توجد نتائج" : "No results found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: app.lang === "ar" ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"` })
    ] }),
    !searchQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: quickStats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "group bg-white dark:bg-[#1e293b] rounded-xl border-2 transition-all duration-300 hover:shadow-xl",
            stat.border,
            "hover:shadow-[#2a655f]/20 hover:-translate-y-1 hover:scale-[1.02]"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: stat.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white mt-1", children: stat.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                  stat.changeType === "up" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3 text-[#2a655f] animate-bounce-slow" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3 w-3 text-slate-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${stat.changeType === "up" ? "text-[#2a655f]" : "text-slate-500"}`, children: stat.change })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                "bg-white dark:bg-[#1e293b] border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30",
                "group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
              ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: cn("h-5 w-5", stat.color) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-full rounded-full bg-gradient-to-r",
                  stat.gradient,
                  "transition-all duration-1000 animate-shimmer"
                ),
                style: { width: `${Math.min(Math.abs(parseFloat(stat.change) || 0) * 4, 100)}%` }
              }
            ) })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: platformStats.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onGoto(item.to),
          className: cn(
            "group bg-white dark:bg-[#1e293b] rounded-xl p-4 border-2 transition-all hover:shadow-xl hover:shadow-[#2a655f]/20 hover:scale-[1.02] text-start relative overflow-hidden",
            item.border
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-[#2a655f]/5 blur-3xl animate-pulse" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: item.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white mt-1", children: item.value })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                "bg-white dark:bg-[#1e293b] border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30",
                "group-hover:scale-110 transition-all duration-300",
                "shadow-lg shadow-[#2a655f]/10"
              ), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-6 w-6 rounded-lg bg-gradient-to-br", item.gradient, "flex items-center justify-center"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-3.5 w-3.5 text-white" }) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-full rounded-full bg-gradient-to-r",
                  item.gradient,
                  "transition-all duration-1000 animate-shimmer"
                ),
                style: { width: `${Math.min(100, item.value / (all.length || 1) * 100)}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-[#2a655f] opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: [
              app.lang === "ar" ? "اضغط للعرض" : "Click to view",
              " →"
            ] })
          ]
        },
        item.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: additionalStats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "group bg-white dark:bg-[#1e293b] rounded-xl p-4 border-2 transition-all hover:shadow-xl hover:shadow-[#2a655f]/20 hover:scale-[1.02] relative overflow-hidden",
            stat.border
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#2a655f]/5 blur-3xl animate-pulse" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                "bg-white dark:bg-[#1e293b] border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30",
                "group-hover:scale-110 transition-all duration-300",
                "shadow-lg shadow-[#2a655f]/10"
              ), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-6 w-6 rounded-lg bg-gradient-to-br", stat.gradient, "flex items-center justify-center"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-3.5 w-3.5 text-white" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400", children: stat.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-slate-900 dark:text-white", children: stat.value })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-full rounded-full bg-gradient-to-r",
                  stat.gradient,
                  "transition-all duration-1000 animate-shimmer"
                ),
                style: { width: `${Math.min(100, stat.value / (all.length || 1) * 100)}%` }
              }
            ) })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-hidden rounded-xl border-2 border-[#2a655f]/40 dark:border-[#3a8a82]/30 bg-white dark:bg-[#1e293b] p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-6 animate-marquee-slow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-4 w-4 text-[#2a655f] animate-float" }),
          app.lang === "ar" ? "🚀 ذوق - منصة متكاملة" : "🚀 Zooq - Integrated Platform"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]/20", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gem, { className: "h-4 w-4 text-[#3a8a82] animate-spin-slow" }),
          app.lang === "ar" ? "💎 أداء عالي وسرعة فائقة" : "💎 High Performance & Speed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]/20", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-[#3a8a82] animate-pulse" }),
          app.lang === "ar" ? "🛡️ آمن وموثوق" : "🛡️ Secure & Reliable"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
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
        @keyframes marquee-slow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: flex;
          animation: marquee-slow 20s linear infinite;
          width: 200%;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      ` })
  ] });
}
const { saveAs: saveAs$3 } = pkg;
function AdminListings() {
  const app = useApp();
  const [statusFilter, setStatusFilter] = reactExports.useState("pending");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const [limit, setLimit] = reactExports.useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [productToDelete, setProductToDelete] = reactExports.useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = reactExports.useState(false);
  const [productToReject, setProductToReject] = reactExports.useState(null);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [isRejecting, setIsRejecting] = reactExports.useState(false);
  const isRTL = app.lang === "ar";
  const {
    data: rows = [],
    isLoading,
    refetch,
    isRefetching
  } = useAllListingsAdmin(statusFilter === "all" ? void 0 : statusFilter);
  const setStatusMut = useSetListingStatus();
  const del = useAdminDeleteListing();
  const setFeatured = useSetListingFeatured();
  const sendNotification = useSendNotificationV2();
  const filteredRows = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase().trim();
    return rows.filter((r) => {
      const title = (isRTL ? r.title_ar : r.title_en) || "";
      const storeName = r.profiles?.store_name || r.profiles?.full_name || "";
      return title.toLowerCase().includes(q) || storeName.toLowerCase().includes(q);
    });
  }, [rows, searchQuery, isRTL]);
  const totalPages = Math.ceil(filteredRows.length / limit);
  const paginatedRows = reactExports.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, limit]);
  const stats = reactExports.useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const published = rows.filter((r) => r.status === "published").length;
    const archived = rows.filter((r) => r.status === "archived").length;
    const featured = rows.filter((r) => r.is_featured === true).length;
    return { total, pending, published, archived, featured };
  }, [rows]);
  const goToPage = reactExports.useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [totalPages]);
  const handleStatusFilterChange = reactExports.useCallback((value) => {
    setStatusFilter(value);
    setPage(1);
  }, []);
  const handleSearchChange = reactExports.useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);
  const handleApprove = reactExports.useCallback(async (id) => {
    const toastId = toast.loading(isRTL ? "⏳ جاري الموافقة..." : "⏳ Approving...");
    try {
      const product = rows.find((r) => r.id === id);
      await setStatusMut.mutateAsync({ id, status: "published" });
      await refetch();
      if (product?.owner_id) {
        await sendNotification.mutateAsync({
          userId: product.owner_id,
          type: "product_approved",
          titleAr: "✅ تمت الموافقة على منتجك",
          bodyAr: `تمت الموافقة على منتج "${product.title_ar}" وهو الآن متاح للبيع 🎉`,
          linkUrl: `/dashboard?tab=products`,
          imageUrl: product.cover_url || void 0,
          actions: [
            { label_ar: "عرض المنتج", url: `/listing/${product.id}` }
          ],
          metadata: {
            listing_id: product.id,
            listing_title: product.title_ar,
            status: "approved"
          }
        });
      }
      toast.success(isRTL ? "✅ تمت الموافقة على المنتج" : "✅ Product approved", {
        id: toastId
      });
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error(isRTL ? "❌ فشل في الموافقة" : "❌ Failed to approve", {
        id: toastId
      });
      await refetch();
    }
  }, [setStatusMut, refetch, sendNotification, rows, isRTL]);
  const openRejectDialog = reactExports.useCallback((product) => {
    setProductToReject(product);
    setRejectReason("");
    setRejectDialogOpen(true);
  }, []);
  const handleConfirmReject = reactExports.useCallback(async () => {
    if (!productToReject) return;
    if (!rejectReason.trim()) {
      toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a rejection reason");
      return;
    }
    setIsRejecting(true);
    const toastId = toast.loading(isRTL ? "⏳ جاري الرفض..." : "⏳ Rejecting...");
    try {
      await setStatusMut.mutateAsync({
        id: productToReject.id,
        status: "draft",
        rejection_reason: rejectReason
      });
      await refetch();
      if (productToReject?.owner_id) {
        await sendNotification.mutateAsync({
          userId: productToReject.owner_id,
          type: "product_rejected",
          titleAr: "❌ تم رفض منتجك",
          bodyAr: `تم رفض منتج "${productToReject.title_ar}"
السبب: ${rejectReason}`,
          linkUrl: `/dashboard?tab=products`,
          imageUrl: productToReject.cover_url,
          actions: [
            { label_ar: "مراجعة المنتج", url: "/dashboard/products" }
          ],
          metadata: {
            listing_id: productToReject.id,
            listing_title: productToReject.title_ar,
            status: "rejected",
            reason: rejectReason
          }
        });
      }
      toast.success(isRTL ? "❌ تم رفض المنتج" : "❌ Product rejected", {
        id: toastId
      });
      setRejectDialogOpen(false);
      setProductToReject(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting product:", error);
      toast.error(isRTL ? "❌ فشل في الرفض" : "❌ Failed to reject", {
        id: toastId
      });
      await refetch();
    } finally {
      setIsRejecting(false);
    }
  }, [productToReject, rejectReason, setStatusMut, refetch, sendNotification, isRTL]);
  const openDeleteDialog = reactExports.useCallback((product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);
  const confirmDelete = reactExports.useCallback(async () => {
    if (!productToDelete) return;
    const toastId = toast.loading(isRTL ? "⏳ جاري الحذف..." : "⏳ Deleting...");
    try {
      await del.mutateAsync(productToDelete.id);
      await refetch();
      toast.success(isRTL ? "🗑️ تم حذف المنتج" : "🗑️ Product deleted", {
        id: toastId
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(isRTL ? "❌ فشل في الحذف" : "❌ Failed to delete", {
        id: toastId
      });
      await refetch();
    }
  }, [productToDelete, del, refetch, isRTL]);
  const handleToggleFeatured = reactExports.useCallback(async (id, currentFeatured) => {
    const toastId = toast.loading(isRTL ? "⏳ جاري التحديث..." : "⏳ Updating...");
    try {
      await setFeatured.mutateAsync({ id, is_featured: !currentFeatured });
      await refetch();
      toast.success(
        !currentFeatured ? isRTL ? "🔥 تمت إضافة المنتج للرائج" : "🔥 Product added to trending" : isRTL ? "✨ تمت إزالة المنتج من الرائج" : "✨ Product removed from trending",
        { id: toastId }
      );
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error(isRTL ? "❌ فشل في التحديث" : "❌ Failed to update", {
        id: toastId
      });
      await refetch();
    }
  }, [setFeatured, refetch, isRTL]);
  const exportToExcel = reactExports.useCallback(() => {
    const exportData = filteredRows.map((r) => ({
      "اسم المنتج": isRTL ? r.title_ar : r.title_en || r.title_ar,
      "المتجر": r.profiles?.store_name || r.profiles?.full_name || "—",
      "السعر": `${r.price} ${r.currency}`,
      "التصنيف": r.categories?.[isRTL ? "name_ar" : "name_en"] || "—",
      "الحالة": r.status === "pending" ? "قيد المراجعة" : r.status === "published" ? "منشور" : "مؤرشف",
      "رائج": r.is_featured ? "نعم" : "لا",
      "سبب الرفض": r.rejection_reason || "—",
      "تاريخ الإضافة": new Date(r.created_at).toLocaleDateString("ar-SA")
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "المنتجات");
    ws["!cols"] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 25 }, { wch: 20 }];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$3(blob, `المنتجات_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  }, [filteredRows, isRTL]);
  const exportToWord = reactExports.useCallback(() => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 20px; background: #f8fafc; }
        h1 { color: #2a655f; text-align: center; border-bottom: 3px solid #f9a8d4; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 20px 0; }
        .stat-card { background: white; padding: 14px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid #f9a8d4; }
        .stat-card .value { font-size: 22px; font-weight: bold; color: #2a655f; }
        .stat-card .label { font-size: 11px; color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #2a655f; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        tr:hover { background: #fdf2f8; }
        .status-pending { color: #f9a8d4; font-weight: bold; }
        .status-published { color: #2a655f; font-weight: bold; }
        .status-archived { color: #3a8a82; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .badge-featured { background: #f9a8d4; color: #2a655f; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
      </style></head>
      <body>
        <h1>📊 تقرير المنتجات</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA")}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${stats.total}</div><div class="label">إجمالي المنتجات</div></div>
          <div class="stat-card"><div class="value">${stats.pending}</div><div class="label">قيد المراجعة</div></div>
          <div class="stat-card"><div class="value">${stats.published}</div><div class="label">منشور</div></div>
          <div class="stat-card"><div class="value">${stats.archived}</div><div class="label">مؤرشف</div></div>
          <div class="stat-card"><div class="value">${stats.featured}</div><div class="label">رائج</div></div>
        </div>
        <table><thead><tr><th>#</th><th>اسم المنتج</th><th>المتجر</th><th>السعر</th><th>الحالة</th><th>رائج</th><th>سبب الرفض</th></tr></thead><tbody>
    `;
    filteredRows.forEach((r, index) => {
      const statusClass = r.status === "pending" ? "status-pending" : r.status === "published" ? "status-published" : "status-archived";
      const statusText = r.status === "pending" ? "قيد المراجعة" : r.status === "published" ? "منشور" : "مؤرشف";
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${isRTL ? r.title_ar : r.title_en || r.title_ar}</td>
          <td>${r.profiles?.store_name || r.profiles?.full_name || "—"}</td>
          <td>${r.price} ${r.currency}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${r.is_featured ? '<span class="badge-featured">★ رائج</span>' : "—"}</td>
          <td>${r.rejection_reason || "—"}</td>
        </tr>
      `;
    });
    htmlContent += `
        </tbody></table>
        <div class="footer">إجمالي المنتجات: ${filteredRows.length} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs$3(blob, `المنتجات_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  }, [filteredRows, stats, isRTL]);
  const getStoreName = reactExports.useCallback((product) => {
    if (product?.profile?.store_name) return product.profile.store_name;
    if (product?.profile?.full_name) return product.profile.full_name;
    if (product?.profiles?.store_name) return product.profiles.store_name;
    if (product?.profiles?.full_name) return product.profiles.full_name;
    if (product?.owner?.store_name) return product.owner.store_name;
    if (product?.owner?.full_name) return product.owner.full_name;
    if (product?.store_name) return product.store_name;
    if (product?.seller_name) return product.seller_name;
    return "—";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isRTL ? "إدارة المنتجات" : "Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isRTL ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2", children: [
          isRTL ? `إدارة جميع المنتجات (${filteredRows.length} من ${rows.length})` : `Manage all products (${filteredRows.length} of ${rows.length})`,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#f9a8d4]/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#d81b60] flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 animate-pulse" }),
            isRTL ? "تحديث لحظي" : "Real-time"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: exportToExcel,
            disabled: filteredRows.length === 0,
            className: "rounded-lg h-9 px-4 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 gap-2 transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Excel" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: exportToWord,
            disabled: filteredRows.length === 0,
            className: "rounded-lg h-9 px-4 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 gap-2 transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Word" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-slate-300/50 dark:bg-slate-600/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => refetch(),
            disabled: isRefetching,
            className: "rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", isRefetching && "animate-spin") })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      {
        key: "total",
        label: isRTL ? "إجمالي المنتجات" : "Total Products",
        value: stats.total,
        icon: Package,
        color: "text-[#2a655f]",
        border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
        gradient: "from-[#2a655f] to-[#f9a8d4]"
      },
      {
        key: "pending",
        label: isRTL ? "قيد المراجعة" : "Pending",
        value: stats.pending,
        icon: Clock,
        color: "text-[#3a8a82]",
        border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
        gradient: "from-[#3a8a82] to-[#f9a8d4]"
      },
      {
        key: "published",
        label: isRTL ? "منشورة" : "Published",
        value: stats.published,
        icon: CircleCheck,
        color: "text-[#1a4f4a]",
        border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
        gradient: "from-[#1a4f4a] to-[#f9a8d4]"
      },
      {
        key: "featured",
        label: isRTL ? "رائجة" : "Featured",
        value: stats.featured,
        icon: Flame,
        color: "text-[#4a9f95]",
        border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
        gradient: "from-[#4a9f95] to-[#f9a8d4]"
      }
    ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "group bg-white dark:bg-[#1e293b] rounded-xl border-2 transition-all duration-300 hover:shadow-xl",
          stat.border,
          "hover:shadow-pink-500/20 hover:-translate-y-1 hover:scale-[1.02]"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white mt-1", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              "bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40",
              "group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
            ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: cn("h-5 w-5", stat.color) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-full rounded-full bg-gradient-to-r",
                stat.gradient,
                "transition-all duration-1000 animate-shimmer"
              ),
              style: { width: `${Math.min(100, stat.value / (stats.total || 1) * 100)}%` }
            }
          ) })
        ]
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: handleSearchChange,
            placeholder: isRTL ? "🔍 بحث عن منتج..." : "🔍 Search products...",
            className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: handleStatusFilterChange, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "الحالة" : "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "pending", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "⏳ ",
            isRTL ? "قيد المراجعة" : "Pending"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "published", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "✅ ",
            isRTL ? "منشور" : "Published"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "archived", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "📦 ",
            isRTL ? "مؤرشف" : "Archived"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "📋 ",
            isRTL ? "الكل" : "All"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(limit),
          onValueChange: (value) => {
            setLimit(Number(value));
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[100px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "100", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "100" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setStatusFilter("pending");
            setPage(1);
          },
          className: "h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1.5" }),
            isRTL ? "مسح الكل" : "Clear all"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المنتج" : "Product"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المتجر" : "Store"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "السعر" : "Price"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[340px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            isRTL ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: isRTL ? "جار التحميل..." : "Loading..." })
          ] }) }) }),
          !isLoading && paginatedRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: isRTL ? "لا توجد منتجات" : "No products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "جميع المنتجات تمت مراجعتها" : "All products have been reviewed" })
          ] }) }) }),
          paginatedRows.map((r) => {
            const isPending = r.status === "pending";
            const isPublished = r.status === "published";
            const isArchived = r.status === "archived";
            const isFeatured = r.is_featured === true;
            const isProcessing = setStatusMut.isPending;
            const hasRejectionReason = r.rejection_reason && r.rejection_reason.trim() !== "";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                className: cn(
                  "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
                  isPending && "bg-amber-50/30 dark:bg-amber-950/10",
                  isArchived && hasRejectionReason && "bg-rose-50/10 dark:bg-rose-950/5"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    r.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-12 w-12 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform duration-300", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: r.cover_url,
                          className: "h-full w-full object-cover",
                          alt: "",
                          onError: (e) => {
                            e.target.style.display = "none";
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-slate-400 dark:text-slate-500" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#2a655f] transition-colors", children: [
                        isRTL ? r.title_ar : r.title_en || r.title_ar,
                        isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 text-[#d81b60] fill-[#d81b60] animate-pulse shrink-0" }),
                        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#f9a8d4]/20 text-[#d81b60] border-2 border-pink-400/40 text-[8px] animate-pulse hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? "جديد" : "New" }),
                        isArchived && hasRejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-rose-500/20 text-rose-600 border-2 border-rose-500/30 text-[8px] hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? "مرفوض" : "Rejected" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "h-3 w-3 text-[#d81b60]" }),
                        r.categories?.[isRTL ? "name_ar" : "name_en"] ?? "—"
                      ] })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3 text-[#2a655f] dark:text-slate-400" }),
                    getStoreName(r)
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-[#2a655f] dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: Number(r.price).toLocaleString(app.lang === "ar" ? "ar-SY" : "en-US") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: cn(
                        "border-2 font-medium px-3 py-1 transition-all duration-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30",
                        isPending ? "bg-[#f9a8d4]/20 text-[#d81b60] border-pink-400/40" : isPublished ? "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/30" : "bg-[#3a8a82]/10 text-[#3a8a82] border-[#3a8a82]/30"
                      ),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 animate-spin-slow" }),
                        isPublished && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                        isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                        isPending ? isRTL ? "قيد المراجعة" : "Pending" : isPublished ? isRTL ? "منشور" : "Published" : isRTL ? "مؤرشف" : "Archived"
                      ] })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: cn(
                          "rounded-xl h-8 px-3 transition-all duration-300 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200",
                          isFeatured && "border-amber-400/60 dark:border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300"
                        ),
                        onClick: () => handleToggleFeatured(r.id, isFeatured),
                        disabled: setFeatured.isPending,
                        title: isRTL ? "الأكثر رواجاً" : "Trending",
                        children: [
                          setFeatured.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: cn("h-3.5 w-3.5 mr-1", isFeatured ? "animate-pulse" : "") }),
                          isRTL ? "رائج" : "Trend"
                        ]
                      }
                    ),
                    isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                        onClick: () => handleApprove(r.id),
                        disabled: isProcessing,
                        children: [
                          isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1" }),
                          isRTL ? "موافقة" : "Approve"
                        ]
                      }
                    ),
                    isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                        onClick: () => openRejectDialog(r),
                        disabled: isProcessing,
                        children: [
                          isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 mr-1" }),
                          isRTL ? "رفض" : "Reject"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-red-500 transition-all duration-300",
                        onClick: () => openDeleteDialog(r),
                        disabled: del.isPending,
                        children: del.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] }) })
                ]
              },
              r.id
            );
          })
        ] })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: filteredRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? "لا توجد منتجات" : "No products" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" }),
          isRTL ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredRows.length)} من ${filteredRows.length} منتج` : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredRows.length)} of ${filteredRows.length} products`
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "الصفحة الأولى" : "First page",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "«" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page - 1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "السابق" : "Previous",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: page === pageNum ? "default" : "outline",
                  size: "sm",
                  onClick: () => goToPage(pageNum),
                  className: cn(
                    "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                    page === pageNum ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
                  ),
                  children: pageNum
                },
                pageNum
              );
            }),
            totalPages > 5 && page < totalPages - 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm px-1", children: "..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => goToPage(totalPages),
                  className: "h-8 min-w-[32px] p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all duration-300",
                  children: totalPages
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page + 1),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "التالي" : "Next",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(totalPages),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "الصفحة الأخيرة" : "Last page",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "»" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: isRTL ? `عرض ${paginatedRows.length} من ${filteredRows.length}` : `Showing ${paginatedRows.length} of ${filteredRows.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: isRTL ? `إجمالي ${rows.length}` : `Total ${rows.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            statusFilter === "pending" && (isRTL ? "قيد المراجعة" : "Pending"),
            statusFilter === "published" && (isRTL ? "منشور" : "Published"),
            statusFilter === "archived" && (isRTL ? "مؤرشف" : "Archived"),
            statusFilter === "all" && (isRTL ? "الكل" : "All")
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            searchQuery
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setRejectDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-6 w-6 text-rose-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "رفض المنتج" : "Reject Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? `يرجى كتابة سبب رفض المنتج "${productToReject?.title_ar}"` : `Please provide a reason for rejecting "${productToReject?.title_en || productToReject?.title_ar}"` })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4", children: [
          productToReject && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 mb-4", children: [
            productToReject.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: productToReject.cover_url,
                alt: productToReject.title_ar,
                className: "h-12 w-12 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-700"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-slate-400 dark:text-slate-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white truncate", children: productToReject.title_ar }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: getStoreName(productToReject) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: Number(productToReject.price).toLocaleString(app.lang === "ar" ? "ar-SY" : "en-US") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
              isRTL ? "سبب الرفض" : "Rejection Reason",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: rejectReason,
                onChange: (e) => setRejectReason(e.target.value),
                placeholder: isRTL ? "✍️ اكتب سبب الرفض هنا (سيظهر للمستخدم)" : "✍️ Write the rejection reason here (will be shown to the user)",
                rows: 4,
                className: cn(
                  "rounded-xl resize-none border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300",
                  !rejectReason.trim() && rejectDialogOpen ? "border-rose-500/50 focus-visible:ring-rose-500/20" : ""
                )
              }
            ),
            !rejectReason.trim() && rejectDialogOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-rose-500 mt-1 flex items-center gap-1 animate-pulse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
              isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a rejection reason"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3 text-[#d81b60]" }),
              isRTL ? "💡 هذا السبب سيظهر للمستخدم في الإشعار" : "💡 This reason will be shown to the user in the notification"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setRejectDialogOpen(false),
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: isRTL ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleConfirmReject,
              disabled: isRejecting || !rejectReason.trim(),
              className: "flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50",
              children: isRejecting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isRTL ? "جاري الرفض..." : "Rejecting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 me-2" }),
                isRTL ? "تأكيد الرفض" : "Confirm Reject"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl p-0 overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setDeleteDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-rose-600 dark:text-rose-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "تأكيد الحذف" : "Confirm Delete" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isRTL ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-700 dark:text-rose-300 font-medium", children: isRTL ? `هل أنت متأكد من حذف المنتج "${productToDelete?.title_ar}"؟` : `Are you sure you want to delete "${productToDelete?.title_en || productToDelete?.title_ar}"?` }),
          productToDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3 pt-3 border-t border-rose-200/50 dark:border-rose-800/30", children: [
            productToDelete.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: productToDelete.cover_url,
                alt: productToDelete.title_ar,
                className: "h-12 w-12 rounded-lg object-cover border-2 border-rose-200/30 dark:border-rose-800/30"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-rose-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 truncate", children: productToDelete.title_ar }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: getStoreName(productToDelete) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-rose-500/10 text-rose-600 border-2 border-rose-500/30", children: Number(productToDelete.price).toLocaleString(app.lang === "ar" ? "ar-SY" : "en-US") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
          isRTL ? "تحذير: حذف هذا المنتج سيؤثر على الطلبات المرتبطة به" : "Warning: Deleting this product will affect associated orders"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setDeleteDialogOpen(false),
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: isRTL ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: confirmDelete,
              disabled: del.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50",
              children: del.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isRTL ? "جاري الحذف..." : "Deleting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 me-2" }),
                isRTL ? "تأكيد الحذف" : "Confirm Delete"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` })
  ] });
}
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
const { saveAs: saveAs$2 } = pkg;
function useAdminDeleteStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      console.log(`🗑️ [Admin] Deleting store for user: ${userId}`);
      const { error: listingsError } = await supabase.from("listings").delete().eq("owner_id", userId);
      if (listingsError) {
        console.error("❌ Error deleting listings:", listingsError);
        throw new Error(`Failed to delete listings: ${listingsError.message}`);
      }
      const { error: appsError } = await supabase.from("seller_applications").delete().eq("user_id", userId);
      if (appsError) {
        console.warn(`⚠️ Error deleting seller applications:`, appsError);
      }
      const { error: followersError } = await supabase.from("store_followers").delete().eq("store_id", userId);
      if (followersError) {
        console.warn(`⚠️ Error deleting store followers:`, followersError);
      }
      const { error: updateProfileError } = await supabase.from("profiles").update({
        store_name: null,
        store_description: null,
        store_logo_url: null,
        store_cover_url: null,
        store_phone: null,
        store_type: null,
        store_address: null,
        store_opens_at: null,
        store_closes_at: null,
        weekly_off_days: null,
        store_active: false,
        store_online: false,
        allows_messaging: false,
        allows_bookings: false,
        governorate_id: null,
        is_featured: false,
        featured_sort: 0,
        company_id: null,
        delivery_company_id: null
      }).eq("id", userId);
      if (updateProfileError) {
        console.error("❌ Error clearing store data:", updateProfileError);
        throw new Error(`Failed to clear store data: ${updateProfileError.message}`);
      }
      const { error: roleError } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "seller");
      if (roleError) {
        console.warn(`⚠️ Error removing seller role:`, roleError);
      }
      try {
        await supabase.from("notifications").insert({
          user_id: userId,
          type: "store_deleted_by_admin",
          title_ar: "🗑️ تم حذف متجرك من قبل الإدارة",
          body_ar: "تم حذف متجرك وجميع بياناته من قبل فريق الإدارة",
          title_en: "🗑️ Your store has been deleted by admin",
          body_en: "Your store and all its data have been deleted by the admin team",
          link_url: "/dashboard",
          metadata: {
            deleted_by: "admin",
            deleted_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
      } catch (notifError) {
        console.warn(`⚠️ Error sending notification:`, notifError);
      }
      console.log(`✅ Store deletion completed successfully!`);
      return { success: true, userId };
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["admin", "stores"] });
      qc.invalidateQueries({ queryKey: ["stores"] });
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      qc.invalidateQueries({ queryKey: ["myListings"] });
      qc.invalidateQueries({ queryKey: ["mySellerApplication"] });
      toast.success("🗑️ تم حذف المتجر وجميع بياناته بنجاح", { duration: 4e3 });
    },
    onError: (error) => {
      console.error("❌ AdminDeleteStore error:", error);
      toast.error(`❌ فشل حذف المتجر: ${error.message}`, { duration: 4e3 });
    }
  });
}
function useAdminStoreStats(userId) {
  return useQuery({
    queryKey: ["admin", "store-stats", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null;
      const { count: products, error: productsError } = await supabase.from("listings").select("*", { count: "exact", head: true }).eq("owner_id", userId);
      if (productsError) {
        console.error("❌ Error counting products:", productsError);
      }
      const { count: orders, error: ordersError } = await supabase.from("orders").select("*", { count: "exact", head: true }).or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
      if (ordersError) {
        console.error("❌ Error counting orders:", ordersError);
      }
      const { count: favorites, error: favoritesError } = await supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", userId);
      if (favoritesError) {
        console.error("❌ Error counting favorites:", favoritesError);
      }
      const { count: reviews, error: reviewsError } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", userId);
      if (reviewsError) {
        console.error("❌ Error counting reviews:", reviewsError);
      }
      const { count: messages, error: messagesError } = await supabase.from("messages").select("*", { count: "exact", head: true }).or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
      if (messagesError) {
        console.error("❌ Error counting messages:", messagesError);
      }
      return {
        products: products || 0,
        orders: orders || 0,
        favorites: favorites || 0,
        reviews: reviews || 0,
        messages: messages || 0
      };
    },
    staleTime: 1e3 * 30
  });
}
async function getDeliveryCompanyName(companyId) {
  if (!companyId) return null;
  try {
    const { data, error } = await supabase.from("delivery_companies").select("name_ar, name_en").eq("id", companyId).maybeSingle();
    if (error || !data) return null;
    return data.name_ar || data.name_en || null;
  } catch (error) {
    return null;
  }
}
function isStoreCurrentlyOpen(store) {
  if (!store || store.store_online === false) return false;
  if (!store.store_opens_at || !store.store_closes_at) {
    return true;
  }
  try {
    const opens = store.store_opens_at.slice(0, 5);
    const closes = store.store_closes_at.slice(0, 5);
    if (!opens || !closes || opens.length < 5 || closes.length < 5) {
      return true;
    }
    const now = /* @__PURE__ */ new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = opens.split(":").map(Number);
    const [ch, cm] = closes.split(":").map(Number);
    if (isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm)) {
      return true;
    }
    const o = oh * 60 + om;
    const c = ch * 60 + cm;
    if (o <= c) {
      return cur >= o && cur <= c;
    } else {
      return cur >= o || cur <= c;
    }
  } catch (error) {
    console.error("❌ Error checking store status:", error);
    return true;
  }
}
function AdminStores() {
  const app = useApp();
  const { data: storesData, isLoading, refetch } = useAdminAllStores();
  const stores = storesData?.data || [];
  const setActive = useSetStoreActive();
  const setFeatured = useSetStoreFeatured();
  const deleteStore = useAdminDeleteStore();
  const isRTL = app.lang === "ar";
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [page, setPage] = reactExports.useState(1);
  const [limit, setLimit] = reactExports.useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [selectedStore, setSelectedStore] = reactExports.useState(null);
  const [confirmStoreName, setConfirmStoreName] = reactExports.useState("");
  const [deliveryDialogOpen, setDeliveryDialogOpen] = reactExports.useState(false);
  const [selectedStoreForDelivery, setSelectedStoreForDelivery] = reactExports.useState(null);
  const [selectedDeliveryCompanyId, setSelectedDeliveryCompanyId] = reactExports.useState("");
  const [deliveryCompanies, setDeliveryCompanies] = reactExports.useState([]);
  const [isLoadingDeliveryCompanies, setIsLoadingDeliveryCompanies] = reactExports.useState(false);
  const [deliveryCompanyNames, setDeliveryCompanyNames] = reactExports.useState({});
  const { data: storeStats, isLoading: statsLoading } = useAdminStoreStats(
    selectedStore?.id
  );
  reactExports.useEffect(() => {
    const fetchDeliveryCompanyNames = async () => {
      const storesWithDelivery = stores.filter((s) => s.delivery_company_id);
      const names = {};
      for (const store of storesWithDelivery) {
        if (store.delivery_company_id && !names[store.id]) {
          const name = await getDeliveryCompanyName(store.delivery_company_id);
          if (name) names[store.id] = name;
        }
      }
      setDeliveryCompanyNames(names);
    };
    if (stores.length > 0) {
      fetchDeliveryCompanyNames();
    }
  }, [stores]);
  const filteredStores = reactExports.useMemo(() => {
    let result = stores;
    if (filterStatus === "active") {
      result = result.filter((s) => s.store_active !== false);
    } else if (filterStatus === "banned") {
      result = result.filter((s) => s.store_active === false);
    } else if (filterStatus === "featured") {
      result = result.filter((s) => s.is_featured === true);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        return s.store_name?.toLowerCase().includes(q) || s.full_name?.toLowerCase().includes(q) || s.phone?.includes(q) || s.store_description?.toLowerCase().includes(q);
      });
    }
    return result;
  }, [stores, searchQuery, filterStatus]);
  const totalPages = Math.ceil(filteredStores.length / limit);
  const paginatedStores = reactExports.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredStores.slice(start, end);
  }, [filteredStores, page, limit]);
  const stats = {
    total: stores.length,
    active: stores.filter((s) => s.store_active !== false).length,
    banned: stores.filter((s) => s.store_active === false).length,
    featured: stores.filter((s) => s.is_featured === true).length
  };
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const openDeleteDialog = (store) => {
    setSelectedStore(store);
    setConfirmStoreName("");
    setDeleteDialogOpen(true);
  };
  const openDeliveryDialog = async (store) => {
    setSelectedStoreForDelivery(store);
    setSelectedDeliveryCompanyId(store.delivery_company_id || "");
    setIsLoadingDeliveryCompanies(true);
    try {
      const { data, error } = await supabase.from("delivery_companies").select("id, name_ar, name_en, base_price").eq("is_active", true).order("name_ar");
      if (error) throw error;
      setDeliveryCompanies(data || []);
    } catch (error) {
      console.error("❌ Error fetching delivery companies:", error);
      toast.error(isRTL ? "❌ فشل جلب شركات التوصيل" : "❌ Failed to fetch delivery companies");
    } finally {
      setIsLoadingDeliveryCompanies(false);
      setDeliveryDialogOpen(true);
    }
  };
  const handleSaveDeliveryCompany = async () => {
    if (!selectedStoreForDelivery) return;
    try {
      const { error } = await supabase.from("profiles").update({
        delivery_company_id: selectedDeliveryCompanyId || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", selectedStoreForDelivery.id);
      if (error) throw error;
      toast.success(
        isRTL ? "✅ تم تحديث شركة التوصيل بنجاح" : "✅ Delivery company updated successfully"
      );
      setDeliveryDialogOpen(false);
      setSelectedStoreForDelivery(null);
      setSelectedDeliveryCompanyId("");
      refetch();
    } catch (error) {
      console.error("❌ Error updating delivery company:", error);
      toast.error(
        isRTL ? "❌ فشل تحديث شركة التوصيل" : "❌ Failed to update delivery company"
      );
    }
  };
  const handleDeleteStore = async () => {
    if (!selectedStore) return;
    if (confirmStoreName !== selectedStore.store_name) {
      toast.error(
        isRTL ? "⚠️ الاسم الذي أدخلته غير مطابق لاسم المتجر" : "⚠️ The name you entered does not match the store name"
      );
      return;
    }
    await deleteStore.mutateAsync(selectedStore.id);
    setDeleteDialogOpen(false);
    setSelectedStore(null);
    setConfirmStoreName("");
    refetch();
  };
  const exportToExcel = () => {
    const exportData = filteredStores.map((s) => ({
      "اسم المتجر": s.store_name || s.full_name || "—",
      "المالك": s.full_name || "—",
      "الهاتف": s.phone || "—",
      "عدد المنتجات": s.listing_count || 0,
      "الحالة": s.store_active === false ? "محظور" : "نشط",
      "رائج": s.is_featured ? "نعم" : "لا"
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "المتاجر");
    ws["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 12 }];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$2(blob, `المتاجر_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
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
        .status-active { color: #2a655f; font-weight: bold; }
        .status-banned { color: #d81b60; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .badge-featured { background: #f9a8d4; color: #2a655f; padding: 2px 10px; border-radius: 20px; font-size: 11px; }
      </style></head>
      <body>
        <h1>🏪 تقرير المتاجر</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA")}</p>
        <div class="stats-grid">
          <div class="stat-card"><div class="value">${stats.total}</div><div class="label">إجمالي المتاجر</div></div>
          <div class="stat-card"><div class="value">${stats.active}</div><div class="label">نشط</div></div>
          <div class="stat-card"><div class="value">${stats.banned}</div><div class="label">محظور</div></div>
          <div class="stat-card"><div class="value">${stats.featured}</div><div class="label">رائج</div></div>
        </div>
        <table><thead><tr><th>#</th><th>اسم المتجر</th><th>المالك</th><th>الهاتف</th><th>المنتجات</th><th>الحالة</th><th>رائج</th></tr></thead><tbody>
    `;
    filteredStores.forEach((s, index) => {
      const statusClass = s.store_active === false ? "status-banned" : "status-active";
      const statusText = s.store_active === false ? "محظور" : "نشط";
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${s.store_name || s.full_name || "—"}</td>
          <td>${s.full_name || "—"}</td>
          <td>${s.phone || "—"}</td>
          <td>${s.listing_count || 0}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${s.is_featured ? '<span class="badge-featured">★ رائج</span>' : "—"}</td>
        </tr>
      `;
    });
    htmlContent += `
        </tbody></table>
        <div class="footer">إجمالي المتاجر: ${filteredStores.length} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs$2(blob, `المتاجر_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isRTL ? "المتاجر" : "Stores" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isRTL ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2", children: [
          isRTL ? `إدارة جميع المتاجر (${filteredStores.length} من ${stores.length})` : `Manage all stores (${filteredStores.length} of ${stores.length})`,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#f9a8d4]/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#d81b60] flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 animate-pulse" }),
            isRTL ? "تحديث لحظي" : "Real-time"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: exportToExcel,
            disabled: filteredStores.length === 0,
            className: "rounded-lg h-9 px-4 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 gap-2 transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Excel" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: exportToWord,
            disabled: filteredStores.length === 0,
            className: "rounded-lg h-9 px-4 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 gap-2 transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Word" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-slate-300/50 dark:bg-slate-600/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => refetch(),
            disabled: isLoading,
            className: "rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", isLoading && "animate-spin") })
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      { key: "total", label: isRTL ? "الإجمالي" : "Total", value: stats.total, icon: Store, gradient: "from-[#2a655f] to-[#1a4f4a]" },
      { key: "active", label: isRTL ? "نشط" : "Active", value: stats.active, icon: CircleCheck, gradient: "from-emerald-500 to-teal-500" },
      { key: "banned", label: isRTL ? "محظور" : "Banned", value: stats.banned, icon: CircleX, gradient: "from-red-500 to-rose-500" },
      { key: "featured", label: isRTL ? "رائج" : "Featured", value: stats.featured, icon: Flame, gradient: "from-[#d81b60] to-[#f9a8d4]" }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-3.5 w-3.5 text-white" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`,
              style: { width: `${Math.min(100, stat.value / (stats.total || 1) * 100)}%` }
            }
          ) })
        ]
      },
      stat.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            },
            placeholder: isRTL ? "🔍 بحث عن متجر..." : "🔍 Search stores...",
            className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchQuery(""), className: `absolute inset-y-0 ${isRTL ? "left-3" : "right-3"} flex items-center text-slate-400 hover:text-slate-600 transition-colors`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: (value) => {
        setFilterStatus(value);
        setPage(1);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "الحالة" : "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? "الكل" : "All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "active", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "✅ ",
            isRTL ? "نشط" : "Active"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "banned", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "🚫 ",
            isRTL ? "محظور" : "Banned"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "featured", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "🔥 ",
            isRTL ? "رائج" : "Featured"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(limit),
          onValueChange: (value) => {
            setLimit(Number(value));
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[100px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "100", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "100" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setFilterStatus("all");
            setPage(1);
          },
          className: "h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isRTL ? "مسح الكل" : "Clear All"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المتجر" : "Store"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المالك" : "Owner"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[80px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المنتجات" : "Products"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الدوام" : "Hours"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[160px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "شركة التوصيل" : "Delivery Co."
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[340px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            isRTL ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: isRTL ? "جار التحميل..." : "Loading..." })
          ] }) }) }),
          !isLoading && paginatedStores.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: isRTL ? "لا توجد متاجر" : "No stores" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "لا توجد متاجر تطابق البحث" : "No stores match your search" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  setSearchQuery("");
                  setFilterStatus("all");
                },
                className: "mt-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                children: isRTL ? "مسح البحث" : "Clear search"
              }
            )
          ] }) }) }),
          paginatedStores.map((s) => {
            const isOpen = isStoreCurrentlyOpen(s);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                className: "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    s.store_logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-11 w-11 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 flex-shrink-0 group-hover:scale-105 transition-transform duration-300", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: s.store_logo_url,
                          className: "h-full w-full object-cover",
                          alt: "",
                          onError: (e) => {
                            e.target.style.display = "none";
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-slate-400 dark:text-slate-500" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#2a655f] transition-colors", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Link,
                          {
                            to: "/store/$id",
                            params: { id: s.id },
                            className: "hover:text-[#2a655f] transition-colors truncate",
                            children: s.store_name || s.full_name || "—"
                          }
                        ),
                        s.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 text-[#d81b60] fill-[#d81b60] animate-pulse shrink-0" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]", children: s.store_description || s.full_name || "" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Link,
                          {
                            to: "/store/$id",
                            params: { id: s.id },
                            className: "text-[10px] text-[#2a655f] hover:text-[#d81b60] hover:underline flex items-center gap-0.5 transition-colors",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
                              isRTL ? "عرض المتجر" : "View store"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 dark:text-slate-600", children: "|" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400 flex items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
                          s.full_name || "—"
                        ] })
                      ] })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-[#2a655f] dark:text-slate-400" }),
                    s.full_name || "—"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-slate-900 dark:text-white text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: s.listing_count || 0 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: s.store_active === false ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-1" }),
                    isRTL ? "محظور" : "Banned"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1" }),
                    isRTL ? "نشط" : "Active"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
                    "border-2 text-xs font-medium px-3 py-1 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors",
                    isOpen ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"
                  ), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                      "h-1.5 w-1.5 rounded-full inline-block mr-1.5",
                      isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                    ) }),
                    isOpen ? isRTL ? "🟢 مفتوح" : "🟢 Open" : isRTL ? "🔴 مغلق" : "🔴 Closed",
                    s.store_opens_at && s.store_closes_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground block mt-0.5", children: [
                      s.store_opens_at.slice(0, 5),
                      " - ",
                      s.store_closes_at.slice(0, 5)
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: s.delivery_company_id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-2 border-blue-500/20 px-3 py-1 text-xs font-medium hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 mr-1" }),
                    deliveryCompanyNames[s.id] || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse text-muted-foreground text-[10px]", children: isRTL ? "جاري التحميل..." : "Loading..." })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: isRTL ? "— غير مرتبط" : "— Not linked" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: cn(
                          "rounded-xl h-8 px-3 transition-all duration-300 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200",
                          s.is_featured && "bg-slate-100/50 dark:bg-slate-700/30 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                        ),
                        onClick: () => setFeatured.mutate(
                          { id: s.id, is_featured: !s.is_featured },
                          {
                            onSuccess: () => toast.success(
                              isRTL ? s.is_featured ? "✨ أُزيل من الرائج" : "🔥 أُضيف للرائج" : s.is_featured ? "✨ Removed from trending" : "🔥 Added to trending"
                            )
                          }
                        ),
                        title: isRTL ? "الأكثر رواجاً" : "Trending",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: cn(
                            "h-3.5 w-3.5 mr-1",
                            s.is_featured ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"
                          ) }),
                          isRTL ? "رائج" : "Trend"
                        ]
                      }
                    ),
                    s.store_active === false ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                        onClick: () => setActive.mutate(
                          { id: s.id, active: true },
                          {
                            onSuccess: () => toast.success(
                              isRTL ? "✅ تم التفعيل" : "✅ Activated"
                            )
                          }
                        ),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" }),
                          isRTL ? "تفعيل" : "Unban"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                        onClick: () => {
                          if (confirm(
                            isRTL ? "⚠️ هل أنت متأكد من حظر هذا المتجر؟" : "⚠️ Are you sure you want to ban this store?"
                          ))
                            setActive.mutate(
                              { id: s.id, active: false },
                              {
                                onSuccess: () => toast.success(
                                  isRTL ? "🚫 تم الحظر" : "🚫 Banned"
                                )
                              }
                            );
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" }),
                          isRTL ? "حظر" : "Ban"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                        onClick: () => openDeliveryDialog(s),
                        title: isRTL ? "تعديل شركة التوصيل" : "Edit delivery company",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" }),
                          isRTL ? "تعديل التوصيل" : "Edit Delivery"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-red-500 transition-all duration-300",
                        onClick: () => openDeleteDialog(s),
                        title: isRTL ? "حذف المتجر نهائياً" : "Permanently delete store",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" }),
                          isRTL ? "حذف" : "Delete"
                        ]
                      }
                    )
                  ] }) })
                ]
              },
              s.id
            );
          })
        ] })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: filteredStores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? "لا توجد متاجر" : "No stores" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" }),
          isRTL ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredStores.length)} من ${filteredStores.length} متجر` : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredStores.length)} of ${filteredStores.length} stores`
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "الصفحة الأولى" : "First page",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "«" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page - 1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "السابق" : "Previous",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: page === pageNum ? "default" : "outline",
                  size: "sm",
                  onClick: () => goToPage(pageNum),
                  className: cn(
                    "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                    page === pageNum ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
                  ),
                  children: pageNum
                },
                pageNum
              );
            }),
            totalPages > 5 && page < totalPages - 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm px-1", children: "..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => goToPage(totalPages),
                  className: "h-8 min-w-[32px] p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all duration-300",
                  children: totalPages
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page + 1),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "التالي" : "Next",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(totalPages),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              title: isRTL ? "الصفحة الأخيرة" : "Last page",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "»" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: isRTL ? `عرض ${paginatedStores.length} من ${filteredStores.length}` : `Showing ${paginatedStores.length} of ${filteredStores.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: isRTL ? `إجمالي ${stores.length}` : `Total ${stores.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            filterStatus === "all" && (isRTL ? "الكل" : "All"),
            filterStatus === "active" && (isRTL ? "نشط" : "Active"),
            filterStatus === "banned" && (isRTL ? "محظور" : "Banned"),
            filterStatus === "featured" && (isRTL ? "رائج" : "Featured")
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            searchQuery
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => {
            setDeleteDialogOpen(false);
            setConfirmStoreName("");
            setSelectedStore(null);
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "p-6 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-red-600 dark:text-red-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2", children: isRTL ? "⚠️ تأكيد حذف المتجر" : "⚠️ Confirm Store Deletion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isRTL ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المتجر نهائياً." : "This action cannot be undone. All store data will be permanently deleted." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-4 border-2 border-slate-200/50 dark:border-slate-700/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f]" }),
              isRTL ? "اسم المتجر" : "Store Name"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 dark:text-white", children: selectedStore?.store_name || selectedStore?.full_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[#2a655f]" }),
              isRTL ? "المالك" : "Owner"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 dark:text-white", children: selectedStore?.full_name || "—" })
          ] })
        ] }),
        storeStats && !statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50/50 dark:bg-red-950/20 rounded-xl p-3 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-600/70 dark:text-red-400/70", children: [
              "📦 ",
              isRTL ? "منتجات" : "Products"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-red-700 dark:text-red-400", children: storeStats.products })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-600/70 dark:text-amber-400/70", children: [
              "🛒 ",
              isRTL ? "طلبات" : "Orders"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-amber-700 dark:text-amber-400", children: storeStats.orders })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-blue-600/70 dark:text-blue-400/70", children: [
              "💬 ",
              isRTL ? "رسائل" : "Messages"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-blue-700 dark:text-blue-400", children: storeStats.messages })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-pink-50/50 dark:bg-pink-950/20 rounded-xl p-3 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-pink-600/70 dark:text-pink-400/70", children: [
              "❤️ ",
              isRTL ? "مفضلات" : "Favorites"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-pink-700 dark:text-pink-400", children: storeStats.favorites })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50/50 dark:bg-green-950/20 rounded-xl p-3 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600/70 dark:text-green-400/70", children: [
              "⭐ ",
              isRTL ? "تقييمات" : "Reviews"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-green-700 dark:text-green-400", children: storeStats.reviews })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-3 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-purple-600/70 dark:text-purple-400/70", children: [
              "📊 ",
              isRTL ? "إجمالي" : "Total"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-purple-700 dark:text-purple-400", children: storeStats.products + storeStats.orders + storeStats.messages + storeStats.favorites + storeStats.reviews })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border-2 border-pink-400/60 dark:border-pink-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-red-500 mt-0.5 flex-shrink-0 animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-red-700 dark:text-red-400", children: isRTL ? "⚠️ هذا الإجراء سيحذف جميع بيانات المتجر نهائياً" : "⚠️ This will permanently delete all store data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-600/70 dark:text-red-400/70 mt-1", children: isRTL ? "بما في ذلك المنتجات والطلبات والمفضلات والتقييمات والرسائل" : "Including products, orders, favorites, reviews, and messages" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50/30 dark:bg-red-950/10 rounded-xl p-4 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-red-700 dark:text-red-400 mb-2", children: isRTL ? `✍️ اكتب اسم المتجر "${selectedStore?.store_name}" لتأكيد الحذف` : `✍️ Type the store name "${selectedStore?.store_name}" to confirm deletion` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: confirmStoreName,
              onChange: (e) => setConfirmStoreName(e.target.value),
              placeholder: isRTL ? "أدخل اسم المتجر هنا..." : "Enter store name here...",
              className: cn(
                "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300",
                confirmStoreName && confirmStoreName !== selectedStore?.store_name && "border-red-500 focus:border-red-500"
              )
            }
          ),
          confirmStoreName && confirmStoreName !== selectedStore?.store_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
            isRTL ? "الاسم غير مطابق" : "Name does not match"
          ] }),
          confirmStoreName === selectedStore?.store_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-500 mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            isRTL ? "✓ الاسم مطابق، يمكنك الحذف" : "✓ Name matches, you can delete"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-6 pt-0 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setDeleteDialogOpen(false);
              setConfirmStoreName("");
              setSelectedStore(null);
            },
            className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 h-12",
            children: isRTL ? "إلغاء" : "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleDeleteStore,
            disabled: deleteStore.isPending || confirmStoreName !== selectedStore?.store_name,
            className: cn(
              "flex-1 rounded-xl text-white shadow-lg transition-all duration-300 h-12 border-2",
              confirmStoreName === selectedStore?.store_name ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 border-red-500/30" : "bg-slate-400 cursor-not-allowed opacity-50 border-slate-400/30"
            ),
            children: deleteStore.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
              isRTL ? "جاري الحذف..." : "Deleting..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5 mr-2" }),
              isRTL ? "تأكيد الحذف النهائي" : "Confirm Permanent Deletion"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deliveryDialogOpen, onOpenChange: setDeliveryDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => {
            setDeliveryDialogOpen(false);
            setSelectedStoreForDelivery(null);
            setSelectedDeliveryCompanyId("");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-[#2a655f]/10 border-2 border-[#2a655f]/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "🚚 تعديل شركة التوصيل" : "🚚 Edit Delivery Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? `تعديل شركة التوصيل لمتجر "${selectedStoreForDelivery?.store_name}"` : `Edit delivery company for store "${selectedStoreForDelivery?.store_name}"` })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          selectedStoreForDelivery && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-[#2a655f]/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-[#2a655f]/40" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-white truncate", children: selectedStoreForDelivery.store_name || selectedStoreForDelivery.full_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isRTL ? `المالك: ${selectedStoreForDelivery.full_name || "—"}` : `Owner: ${selectedStoreForDelivery.full_name || "—"}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: selectedStoreForDelivery.store_active === false ? "bg-red-500/10 text-red-600 border-2 border-red-500/20" : "bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/20", children: selectedStoreForDelivery.store_active === false ? isRTL ? "محظور" : "Banned" : isRTL ? "نشط" : "Active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[#2a655f] dark:text-white font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-[#2a655f]" }),
              isRTL ? "شركة التوصيل" : "Delivery Company"
            ] }),
            isLoadingDeliveryCompanies ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f]" }) }) : deliveryCompanies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-center text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-8 w-8 mx-auto mb-2 text-[#2a655f]/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: isRTL ? "⚠️ لا توجد شركات توصيل نشطة" : "⚠️ No active delivery companies" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedDeliveryCompanyId,
                onValueChange: setSelectedDeliveryCompanyId,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "🔍 اختر شركة التوصيل..." : "🔍 Select delivery company..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
                      isRTL ? "بدون شركة توصيل" : "No delivery company"
                    ] }) }),
                    deliveryCompanies.map((company) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: company.id, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-[#2a655f]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: company.name_ar || company.name_en }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[9px] bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20", children: [
                        company.base_price || 0,
                        " SYP"
                      ] })
                    ] }) }, company.id))
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 text-[#2a655f]" }),
              isRTL ? "💡 هذه الشركة ستكون المسؤولة عن توصيل طلبات هذا المتجر" : "💡 This company will handle delivery for this store"
            ] })
          ] }),
          selectedStoreForDelivery?.delivery_company_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-[#2a655f]/5 rounded-xl border-2 border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isRTL ? "🔄 الشركة الحالية" : "🔄 Current company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-[#2a655f]", children: deliveryCompanies.find((c) => c.id === selectedStoreForDelivery.delivery_company_id)?.name_ar || deliveryCompanies.find((c) => c.id === selectedStoreForDelivery.delivery_company_id)?.name_en || selectedStoreForDelivery.delivery_company_id })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-slate-200/50 dark:border-slate-700/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setDeliveryDialogOpen(false);
                setSelectedStoreForDelivery(null);
                setSelectedDeliveryCompanyId("");
              },
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: isRTL ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSaveDeliveryCompany,
              disabled: isLoadingDeliveryCompanies,
              className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02] border-2 border-[#2a655f]/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
                isRTL ? "حفظ التغييرات" : "Save Changes"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      ` })
  ] });
}
const { saveAs: saveAs$1 } = pkg;
const STATUS_CONFIG = {
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
    icon: CircleCheck,
    animation: "animate-bounce-slow"
  },
  rejected: {
    label_ar: "مرفوض",
    label_en: "Rejected",
    color: "text-rose-600 border-rose-500/30",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: CircleX,
    animation: "animate-float"
  }
};
const StatCard$2 = ({
  label,
  value,
  icon: Icon,
  color,
  gradient
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors ${color}`, children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-white" }) }) })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`,
      style: { width: `${Math.min(100, value / 1 * 100)}%` }
    }
  ) })
] });
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  const isRTL = useApp().lang === "ar";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
    "border-2 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 cursor-default",
    config.bg,
    config.color,
    config.border
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-3 w-3", config.animation) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? config.label_ar : config.label_en })
  ] });
};
const TypeBadge = ({ type }) => {
  const isRTL = useApp().lang === "ar";
  const typeValue = type || "store";
  const configs = {
    store: {
      icon: Building2,
      label: isRTL ? "🏪 فتح متجر" : "🏪 Open Store",
      bg: "bg-[#2a655f]/10",
      color: "text-[#2a655f] border-[#2a655f]/30"
    },
    product: {
      icon: ShoppingBag,
      label: isRTL ? "🛍️ إضافة منتج" : "🛍️ Add Product",
      bg: "bg-[#f9a8d4]/20",
      color: "text-[#d81b60] border-[#f9a8d4]/40"
    }
  };
  const config = configs[typeValue] || configs.store;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
    "border-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 cursor-default",
    config.bg,
    config.color
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    config.label
  ] });
};
const withTimeout = (promise, timeoutMs = 15e3) => {
  return Promise.race([
    promise,
    new Promise(
      (_, reject) => setTimeout(() => reject(new Error(`⏱️ Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};
const safeSendNotification = async (sendNotification, params) => {
  try {
    await withTimeout(sendNotification.mutateAsync(params), 1e4);
    return true;
  } catch (error) {
    console.error("❌ [Notification] Failed (non-critical):", error);
    return false;
  }
};
function SellerApplicationsAdmin() {
  const app = useApp();
  useT();
  const [page, setPage] = reactExports.useState(1);
  const [limit, setLimit] = reactExports.useState(10);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterType, setFilterType] = reactExports.useState("all");
  const sendNotification = useSendNotificationV2();
  const tableRef = reactExports.useRef(null);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [hoveredRow, setHoveredRow] = reactExports.useState(null);
  const isRTL = app.lang === "ar";
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
  useReviewSellerApplication();
  const [noteFor, setNoteFor] = reactExports.useState(null);
  const [note, setNote] = reactExports.useState("");
  const [selectedApp, setSelectedApp] = reactExports.useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = reactExports.useState(false);
  const [selectedDeliveryCompanyId, setSelectedDeliveryCompanyId] = reactExports.useState("");
  const [deliveryCompanies, setDeliveryCompanies] = reactExports.useState([]);
  const [showDeliveryCompanyDialog, setShowDeliveryCompanyDialog] = reactExports.useState(false);
  const [pendingAppId, setPendingAppId] = reactExports.useState("");
  reactExports.useEffect(() => {
    const fetchDeliveryCompanies = async () => {
      try {
        const { data, error } = await supabase.from("delivery_companies").select("id, name_ar, name_en, base_price, is_verified").eq("is_active", true).eq("is_verified", true).order("name_ar");
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
  const stats = reactExports.useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a) => a.status === "pending").length;
    const approved = apps.filter((a) => a.status === "approved").length;
    const rejected = apps.filter((a) => a.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [apps]);
  const exportToExcel = () => {
    const exportData = apps.map((a) => ({
      "اسم المتجر": a.store_name,
      "نوع الطلب": a.application_type === "product" ? "إضافة منتج" : "فتح متجر",
      "المتقدم": a.profiles?.full_name || "—",
      "الهاتف": a.store_phone || a.profiles?.phone || "—",
      "الحالة": a.status === "pending" ? "قيد المراجعة" : a.status === "approved" ? "موافق عليه" : "مرفوض",
      "المحافظة": a.governorate?.name_ar || "—",
      "تاريخ الطلب": new Date(a.created_at).toLocaleDateString("ar-SA")
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "الطلبات");
    const colWidths = [
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 }
    ];
    ws["!cols"] = colWidths;
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$1(blob, `الطلبات_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };
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
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA")}</p>
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
    apps.forEach((a, index) => {
      const statusClass = a.status === "pending" ? "status-pending" : a.status === "approved" ? "status-approved" : "status-rejected";
      const statusText = a.status === "pending" ? "قيد المراجعة" : a.status === "approved" ? "موافق عليه" : "مرفوض";
      const typeText = a.application_type === "product" ? "إضافة منتج" : "فتح متجر";
      const typeClass = a.application_type === "product" ? "badge-type-product" : "badge-type-store";
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${a.store_name}</td>
          <td><span class="${typeClass}">${typeText}</span></td>
          <td>${a.profiles?.full_name || "—"}</td>
          <td>${a.store_phone || a.profiles?.phone || "—"}</td>
          <td class="${statusClass}">${statusText}</td>
          <td>${a.governorate?.name_ar || "—"}</td>
          <td>${new Date(a.created_at).toLocaleDateString("ar-SA")}</td>
        </tr>
      `;
    });
    htmlContent += `
          </tbody>
        </table>
        <div class="footer">إجمالي الطلبات: ${totalCount} | تم التصدير من لوحة التحكم</div>
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs$1(blob, `الطلبات_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(isRTL ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };
  async function decide(id, status, admin_note) {
    if (isProcessing) {
      toast.warning(isRTL ? "⏳ جاري المعالجة..." : "⏳ Processing...");
      return;
    }
    if (status === "rejected" && (!admin_note || admin_note.trim() === "")) {
      toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection");
      return;
    }
    setIsProcessing(true);
    let applicationData = null;
    let isCompleted = false;
    try {
      console.log(`🔍 [decide] Starting for application: ${id}, status: ${status}`);
      const { data: appData, error: fetchError } = await withTimeout(
        supabase.from("seller_applications").select("*").eq("id", id).single(),
        1e4
      );
      if (fetchError || !appData) {
        toast.error(isRTL ? "❌ فشل جلب بيانات الطلب" : "❌ Failed to fetch application");
        setIsProcessing(false);
        return;
      }
      applicationData = appData;
      console.log(`✅ [decide] Application fetched: ${appData.store_name}`);
      const updatePayload = {
        status,
        admin_note: admin_note || null,
        reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
        reviewed_by: app.user?.id || null
      };
      const { error: updateError } = await withTimeout(
        supabase.from("seller_applications").update(updatePayload).eq("id", id),
        1e4
      );
      if (updateError) {
        toast.error(
          isRTL ? `❌ فشل تحديث الطلب: ${updateError.message}` : `❌ Failed to update: ${updateError.message}`
        );
        setIsProcessing(false);
        return;
      }
      console.log(`✅ [decide] Application status updated to: ${status}`);
      isCompleted = true;
      toast.success(
        status === "approved" ? isRTL ? "✅ تمت الموافقة على الطلب" : "✅ Application approved" : isRTL ? "❌ تم رفض الطلب" : "❌ Application rejected"
      );
      if (status === "approved") {
        if (appData.application_type === "store") {
          const storeDescription = appData.store_description?.trim() || null;
          const updateData = {
            store_name: appData.store_name,
            store_description: storeDescription,
            store_logo_url: appData.store_logo_url,
            store_cover_url: appData.store_cover_url,
            store_phone: appData.store_phone,
            allows_messaging: appData.allows_messaging ?? true,
            allows_bookings: appData.allows_bookings ?? false,
            store_type: appData.store_type || "online",
            governorate_id: appData.governorate_id,
            store_address: appData.address,
            store_opens_at: appData.opening_time,
            store_closes_at: appData.closing_time,
            weekly_off_days: appData.weekly_off_days || [],
            store_active: true,
            store_online: true
          };
          if (selectedDeliveryCompanyId) {
            updateData.delivery_company_id = selectedDeliveryCompanyId;
          }
          const { error: profileError } = await supabase.from("profiles").update(updateData).eq("id", appData.user_id);
          if (profileError) {
            console.error("❌ Error updating profile:", profileError);
            toast.warning(
              isRTL ? "⚠️ تمت الموافقة لكن فشل تحديث بيانات المتجر" : "⚠️ Approved but failed to update store data"
            );
          } else {
            console.log(`✅ [decide] Profile updated for user: ${appData.user_id}`);
            const { error: roleError } = await supabase.from("user_roles").insert({
              user_id: appData.user_id,
              role: "seller"
            });
            if (roleError) {
              console.error("❌ Error adding seller role:", roleError);
            } else {
              console.log(`✅ Seller role added for user: ${appData.user_id}`);
            }
          }
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: "store_approved",
            titleAr: "✅ تمت الموافقة على طلبك",
            bodyAr: `تمت الموافقة على طلب فتح متجر "${appData.store_name}" 🎉`,
            linkUrl: "/dashboard?tab=settings",
            imageUrl: appData.store_logo_url,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              application_type: "store",
              admin_note: admin_note || null,
              delivery_company_id: selectedDeliveryCompanyId || null
            },
            actions: [
              { label_ar: "عرض متجري", url: "/dashboard?tab=settings" }
            ]
          });
        }
        if (appData.application_type === "product") {
          const { data: listing, error: listingError } = await withTimeout(
            supabase.from("listings").select("id, title_ar, cover_url").eq("owner_id", appData.user_id).eq("status", "pending").order("created_at", { ascending: false }).limit(1).maybeSingle(),
            1e4
          );
          if (!listingError && listing) {
            await withTimeout(
              supabase.from("listings").update({ status: "published" }).eq("id", listing.id),
              1e4
            );
            console.log(`✅ [decide] Product published: ${listing.id}`);
          }
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: "product_approved",
            titleAr: "✅ تمت الموافقة على طلبك",
            bodyAr: `تمت الموافقة على إضافة المنتج، وهو الآن متاح للبيع 🛍️`,
            linkUrl: "/dashboard?tab=products",
            imageUrl: listing?.cover_url || null,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              application_type: "product",
              admin_note: admin_note || null,
              listing_id: listing?.id || null
            },
            actions: [
              { label_ar: "عرض المنتج", url: "/dashboard?tab=products" }
            ]
          });
        }
      } else {
        if (appData.application_type === "store") {
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: "store_rejected",
            titleAr: "❌ تم رفض طلبك",
            bodyAr: `تم رفض طلب فتح متجر "${appData.store_name}"${admin_note ? `
السبب: ${admin_note}` : ""}`,
            linkUrl: "/dashboard?tab=overview",
            imageUrl: appData.store_logo_url,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              reason: admin_note || null,
              application_type: "store"
            },
            actions: [
              { label_ar: "مراجعة الطلب", url: "/dashboard?tab=overview" }
            ]
          });
        }
        if (appData.application_type === "product") {
          const { data: listing, error: listingError } = await withTimeout(
            supabase.from("listings").select("id, title_ar, cover_url").eq("owner_id", appData.user_id).eq("status", "pending").order("created_at", { ascending: false }).limit(1).maybeSingle(),
            1e4
          );
          if (!listingError && listing) {
            await withTimeout(
              supabase.from("listings").update({
                status: "draft",
                rejection_reason: admin_note || null,
                rejected_at: (/* @__PURE__ */ new Date()).toISOString()
              }).eq("id", listing.id),
              1e4
            );
            console.log(`✅ [decide] Product rejected: ${listing.id}`);
          }
          safeSendNotification(sendNotification, {
            userId: appData.user_id,
            type: "product_rejected",
            titleAr: "❌ تم رفض طلبك",
            bodyAr: `تم رفض طلب إضافة المنتج${admin_note ? `
السبب: ${admin_note}` : ""}`,
            linkUrl: "/dashboard?tab=products",
            imageUrl: listing?.cover_url || null,
            metadata: {
              application_id: appData.id,
              store_name: appData.store_name,
              reason: admin_note || null,
              application_type: "product",
              listing_id: listing?.id || null
            },
            actions: [
              { label_ar: "مراجعة المنتج", url: "/dashboard?tab=products" }
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
    } catch (error) {
      console.error("❌ [decide] Fatal error:", error);
      if (isCompleted) {
        toast.warning(
          isRTL ? "⚠️ تم تحديث الطلب ولكن حدث خطأ في خطوة ثانوية" : "⚠️ Application updated but a secondary step failed"
        );
      } else {
        const errorMessage = error.message || String(error);
        if (errorMessage.includes("timeout")) {
          toast.error(
            isRTL ? "⏱️ انتهت المهلة، يرجى المحاولة مرة أخرى" : "⏱️ Request timeout, please try again"
          );
        } else {
          toast.error(
            isRTL ? `❌ فشل العملية: ${errorMessage}` : `❌ Operation failed: ${errorMessage}`
          );
        }
      }
    } finally {
      setIsProcessing(false);
      console.log(`🏁 [decide] Finished for application: ${id}`);
    }
  }
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
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-8 w-8 text-[#2a655f] animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse", children: isRTL ? "⏳ جاري تحميل الطلبات..." : "⏳ Loading applications..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isRTL ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isRTL ? "طلبات البائعين" : "Seller Applications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isRTL ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: totalCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "إجمالي" : "total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-amber-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: stats.pending }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "قيد المراجعة" : "pending" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: stats.approved }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "موافق" : "approved" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: exportToExcel,
              disabled: apps.length === 0,
              className: "rounded-lg h-9 px-4 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 gap-2 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Excel" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: exportToWord,
              disabled: apps.length === 0,
              className: "rounded-lg h-9 px-4 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 gap-2 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Word" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-slate-300/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => refetch(),
              className: "rounded-lg h-9 px-3 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 transition-all duration-300",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          isRTL ? "لوحة تحكم" : "Dashboard"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$2,
        {
          label: isRTL ? "📊 الإجمالي" : "📊 Total",
          value: stats.total,
          icon: Layers,
          color: "text-[#2a655f]",
          gradient: "from-[#2a655f] to-[#f9a8d4]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$2,
        {
          label: isRTL ? "⏳ قيد المراجعة" : "⏳ Pending",
          value: stats.pending,
          icon: Clock,
          color: "text-amber-500",
          gradient: "from-amber-500 to-amber-600"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$2,
        {
          label: isRTL ? "✅ موافق عليه" : "✅ Approved",
          value: stats.approved,
          icon: CircleCheck,
          color: "text-emerald-500",
          gradient: "from-emerald-500 to-teal-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$2,
        {
          label: isRTL ? "❌ مرفوض" : "❌ Rejected",
          value: stats.rejected,
          icon: CircleX,
          color: "text-rose-500",
          gradient: "from-rose-500 to-red-600"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-[#d81b60] transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            },
            placeholder: isRTL ? "🔍 بحث عن طلب..." : "🔍 Search applications...",
            className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300 hover:border-pink-500`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterStatus,
          onValueChange: (value) => {
            setFilterStatus(value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-[#d81b60]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "جميع الحالات" : "All status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "📋 ",
                isRTL ? "جميع الحالات" : "All"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "pending", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "⏳ ",
                isRTL ? "قيد المراجعة" : "Pending"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "approved", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "✅ ",
                isRTL ? "موافق" : "Approved"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "rejected", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "❌ ",
                isRTL ? "مرفوض" : "Rejected"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterType,
          onValueChange: (value) => {
            setFilterType(value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[#d81b60]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "النوع" : "Type" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "📦 ",
                isRTL ? "جميع الأنواع" : "All"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "store", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "🏪 ",
                isRTL ? "فتح متجر" : "Open Store"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "product", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "🛍️ ",
                isRTL ? "إضافة منتج" : "Add Product"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(limit),
          onValueChange: (value) => {
            setLimit(Number(value));
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[100px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[#d81b60]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "100", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "100" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setFilterStatus("all");
            setFilterType("all");
            setPage(1);
          },
          className: "h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-pink-500 hover:text-slate-800 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isRTL ? "مسح الكل" : "Clear all"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", ref: tableRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المتقدم / المتجر" : "Applicant / Store"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "النوع" : "Type"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الهاتف" : "Phone"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "تاريخ الطلب" : "Date"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            isRTL ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: apps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: isRTL ? "لا توجد طلبات" : "No applications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "جميع الطلبات تمت مراجعتها" : "All applications have been reviewed" })
        ] }) }) }) : apps.map((a) => {
          const isHovered = hoveredRow === a.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: cn(
                "border-slate-200 dark:border-slate-700 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
                a.status === "pending" ? "bg-amber-50/30 dark:bg-amber-950/10" : "",
                "hover:bg-gray-50/60 dark:hover:bg-gray-700/20"
              ),
              onMouseEnter: () => setHoveredRow(a.id),
              onMouseLeave: () => setHoveredRow(null),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700",
                    isHovered ? "scale-105 rotate-6" : "",
                    a.store_logo_url ? "" : "bg-gradient-to-br from-[#2a655f] to-[#1a4f4a]"
                  ), children: a.store_logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.store_logo_url, alt: "", className: "h-11 w-11 rounded-xl object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-white" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-[#2a655f] transition-colors", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: a.store_name }),
                      a.store_type && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0 border-2 border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: a.store_type === "physical" ? "🏪" : "🌐" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#2a655f] dark:text-slate-400" }),
                      a.profiles?.full_name || "—"
                    ] }),
                    a.store_description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 dark:text-slate-500 line-clamp-1 max-w-[150px]", children: a.store_description })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: a.application_type || "store" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { dir: "ltr", className: "text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-[#2a655f] dark:text-slate-400" }),
                  a.store_phone || a.profiles?.phone || "—"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }),
                  a.reviewed_at && a.status !== "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-0.5", children: new Date(a.reviewed_at).toLocaleDateString(
                    isRTL ? "ar-SA" : "en-US"
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-slate-600 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-400" }),
                  new Date(a.created_at).toLocaleDateString(
                    isRTL ? "ar-SA" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
                      onClick: () => {
                        setSelectedApp(a);
                        setShowDetailsDialog(true);
                      },
                      title: isRTL ? "عرض التفاصيل" : "View details",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  a.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    a.application_type === "store" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
                        onClick: () => {
                          setPendingAppId(a.id);
                          setShowDeliveryCompanyDialog(true);
                        },
                        disabled: isProcessing,
                        title: isRTL ? "موافقة على الطلب (اختر شركة توصيل)" : "Approve application (Select delivery company)",
                        children: [
                          isProcessing && pendingAppId === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1" }),
                          isRTL ? "موافقة" : "Approve"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
                        onClick: () => {
                          decide(a.id, "approved");
                        },
                        disabled: isProcessing,
                        title: isRTL ? "موافقة على الطلب" : "Approve application",
                        children: [
                          isProcessing && pendingAppId === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1" }),
                          isRTL ? "موافقة" : "Approve"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "rounded-xl h-8 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
                        onClick: () => {
                          if (isProcessing) {
                            toast.warning(isRTL ? "⏳ جاري المعالجة..." : "⏳ Processing...");
                            return;
                          }
                          setNoteFor(a.id);
                          setNote("");
                        },
                        disabled: isProcessing,
                        title: isRTL ? "رفض الطلب" : "Reject application",
                        children: [
                          isProcessing && noteFor === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 mr-1" }),
                          isRTL ? "رفض" : "Reject"
                        ]
                      }
                    )
                  ] }),
                  a.status !== "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all duration-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 cursor-default",
                    a.status === "approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                  ), children: a.status === "approved" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? "تمت الموافقة" : "Approved" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? "مرفوض" : "Rejected" })
                  ] }) })
                ] }) })
              ]
            },
            a.id
          );
        }) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: apps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? "لا توجد طلبات" : "No applications" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" }),
          isRTL ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} من ${totalCount} طلب` : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, totalCount)} of ${totalCount} applications`
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "«" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page - 1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: page === pageNum ? "default" : "outline",
                  size: "sm",
                  onClick: () => goToPage(pageNum),
                  className: cn(
                    "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                    page === pageNum ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
                  ),
                  children: pageNum
                },
                pageNum
              );
            }),
            totalPages > 5 && page < totalPages - 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm px-1", children: "..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => goToPage(totalPages),
                  className: "h-8 min-w-[32px] p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all duration-300",
                  children: totalPages
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page + 1),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(totalPages),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "»" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: isRTL ? `عرض ${apps.length} من ${totalCount}` : `Showing ${apps.length} of ${totalCount}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: isRTL ? `إجمالي ${totalCount}` : `Total ${totalCount}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            filterStatus === "all" && (isRTL ? "جميع" : "All"),
            filterStatus === "pending" && (isRTL ? "قيد المراجعة" : "Pending"),
            filterStatus === "approved" && (isRTL ? "موافق" : "Approved"),
            filterStatus === "rejected" && (isRTL ? "مرفوض" : "Rejected")
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            searchQuery
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!noteFor, onOpenChange: (o) => !o && setNoteFor(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setNoteFor(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 text-rose-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "رفض الطلب" : "Reject Application" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isRTL ? "✍️ يرجى كتابة سبب الرفض لتوضيح السبب للمستخدم." : "✍️ Please provide a reason for rejection to clarify to the user." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-[#2a655f]", children: [
            isRTL ? "سبب الرفض" : "Rejection Reason",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              rows: 4,
              value: note,
              onChange: (e) => setNote(e.target.value),
              placeholder: isRTL ? "✍️ اذكر سبب الرفض هنا (مطلوب)" : "✍️ Mention the reason for rejection here (required)",
              className: cn(
                "mt-1.5 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300",
                !note && noteFor && "border-rose-500/50 focus-visible:ring-rose-500/20"
              )
            }
          ),
          !note && noteFor && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-rose-500 mt-1.5 flex items-center gap-1 animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason for rejection"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3 w-3 text-[#d81b60]" }),
            isRTL ? "💡 هذا السبب سيظهر للمستخدم ليعرف سبب الرفض" : "💡 This reason will be shown to the user to know why it was rejected"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-pink-400/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setNoteFor(null),
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: isRTL ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                if (!note.trim()) {
                  toast.error(isRTL ? "⚠️ يرجى كتابة سبب الرفض" : "⚠️ Please provide a reason");
                  return;
                }
                noteFor && decide(noteFor, "rejected", note.trim());
              },
              disabled: isProcessing,
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 hover:scale-105",
              children: [
                isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "تأكيد الرفض" : "Confirm Reject"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDetailsDialog, onOpenChange: setShowDetailsDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-lg border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setShowDetailsDialog(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "تفاصيل الطلب" : "Application Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "جميع معلومات الطلب في مكان واحد" : "All application information in one place" })
          ] })
        ] }) }),
        selectedApp && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "اسم المتجر" : "Store Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-900 dark:text-white text-lg", children: selectedApp.store_name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "نوع الطلب" : "Application Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: selectedApp.application_type || "store" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "الحالة" : "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: selectedApp.status }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "المتقدم" : "Applicant" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-900 dark:text-white", children: selectedApp.profiles?.full_name || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "الهاتف" : "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-slate-900 dark:text-white", children: selectedApp.store_phone || selectedApp.profiles?.phone || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "الوصف" : "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50", children: selectedApp.store_description || (isRTL ? "لا يوجد وصف" : "No description") })
            ] }),
            selectedApp.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "العنوان" : "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-700 dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#2a655f]" }),
                selectedApp.address
              ] })
            ] }),
            selectedApp.admin_note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
                isRTL ? "ملاحظة الأدمن" : "Admin Note"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: selectedApp.admin_note })
            ] }),
            selectedApp.opening_time && selectedApp.closing_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "أوقات العمل" : "Working Hours" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-700 dark:text-slate-300 font-mono", children: [
                selectedApp.opening_time?.slice(0, 5),
                " - ",
                selectedApp.closing_time?.slice(0, 5)
              ] })
            ] }),
            selectedApp.weekly_off_days && selectedApp.weekly_off_days.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: isRTL ? "أيام العطل" : "Off Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 dark:text-slate-300", children: selectedApp.weekly_off_days.map((day) => {
                const dayMap = {
                  Monday: isRTL ? "الإثنين" : "Mon",
                  Tuesday: isRTL ? "الثلاثاء" : "Tue",
                  Wednesday: isRTL ? "الأربعاء" : "Wed",
                  Thursday: isRTL ? "الخميس" : "Thu",
                  Friday: isRTL ? "الجمعة" : "Fri",
                  Saturday: isRTL ? "السبت" : "Sat",
                  Sunday: isRTL ? "الأحد" : "Sun"
                };
                return dayMap[day] || day;
              }).join(", ") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t-2 border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
              isRTL ? "تاريخ الطلب" : "Request Date",
              ":",
              " ",
              new Date(selectedApp.created_at).toLocaleDateString(
                isRTL ? "ar-SA" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setShowDetailsDialog(false),
                className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                children: isRTL ? "إغلاق" : "Close"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeliveryCompanyDialog, onOpenChange: setShowDeliveryCompanyDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => {
            setShowDeliveryCompanyDialog(false);
            setSelectedDeliveryCompanyId("");
            setPendingAppId("");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-[#2a655f]/10 border-2 border-[#2a655f]/30 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-[#2a655f] dark:text-white", children: isRTL ? "🚚 اختيار شركة التوصيل" : "🚚 Select Delivery Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isRTL ? "اختر شركة التوصيل التي ستخدم هذا المتجر" : "Select the delivery company for this store" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white font-semibold", children: isRTL ? "شركة التوصيل *" : "Delivery Company *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedDeliveryCompanyId,
                onValueChange: setSelectedDeliveryCompanyId,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "🔍 اختر شركة التوصيل..." : "🔍 Select delivery company..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: deliveryCompanies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no-company", disabled: true, children: isRTL ? "⚠️ لا توجد شركات توصيل موثقة" : "⚠️ No verified delivery companies" }) : deliveryCompanies.map((company) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: company.id, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-[#2a655f]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: company.name_ar || company.name_en }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[9px] bg-emerald-500/10 text-emerald-600 border-2 border-emerald-400/40 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "✅ ",
                      isRTL ? "موثقة" : "Verified"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      company.base_price || 0,
                      " SYP"
                    ] })
                  ] }) }, company.id)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 text-[#2a655f]" }),
              isRTL ? "💡 هذه الشركة ستكون المسؤولة عن توصيل طلبات هذا المتجر" : "💡 This company will handle delivery for this store"
            ] })
          ] }),
          selectedDeliveryCompanyId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            isRTL ? "✅ تم اختيار شركة التوصيل" : "✅ Delivery company selected"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setShowDeliveryCompanyDialog(false);
                setSelectedDeliveryCompanyId("");
                setPendingAppId("");
              },
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: isRTL ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleApproveWithDelivery,
              disabled: !selectedDeliveryCompanyId || isProcessing,
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed",
              children: [
                isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
                isRTL ? "تأكيد الموافقة" : "Confirm Approve"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      ` })
  ] });
}
const BannerCard = React__default.memo(({
  banner,
  onEdit,
  onDelete,
  isArabic
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        OptimizedImage,
        {
          src: banner.image_url,
          alt: banner.title_ar,
          width: 600,
          height: 300,
          quality: 85,
          objectFit: "cover",
          className: "w-full h-full group-hover:scale-105 transition-transform duration-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          className: cn(
            "absolute top-3 right-3 border-2 px-3 py-1 text-xs font-medium backdrop-blur-sm",
            banner.active ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"
          ),
          children: banner.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1.5 animate-pulse" }),
            isArabic ? "نشط" : "Active"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1.5" }),
            isArabic ? "غير نشط" : "Inactive"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3 mr-1" }),
          "Banner"
        ] }),
        banner.link_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3 mr-1" }),
          isArabic ? "رابط" : "Link"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors truncate", children: banner.title_ar }),
          banner.subtitle_ar && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1", children: banner.subtitle_ar }),
          banner.title_en && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1", children: banner.title_en })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40 text-[10px] flex-shrink-0", children: [
          "#",
          banner.sort_order + 1
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "rounded-xl h-8 px-4 flex-1 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300",
            onClick: () => onEdit(banner),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5 mr-1.5 text-gray-500" }),
              isArabic ? "تعديل" : "Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "rounded-xl h-8 px-3 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300",
            onClick: () => onDelete(banner),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-gray-500" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-full bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" })
  ] });
});
BannerCard.displayName = "BannerCard";
const StatsCards$3 = React__default.memo(({ total, active, inactive, isArabic }) => {
  const items = [
    {
      key: "total",
      label: isArabic ? "إجمالي البنرات" : "Total Banners",
      value: total,
      icon: LayoutDashboard,
      gradient: "from-[#2a655f] to-[#1a4f4a]"
    },
    {
      key: "active",
      label: isArabic ? "نشط" : "Active",
      value: active,
      icon: CircleCheck,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      key: "inactive",
      label: isArabic ? "غير نشط" : "Inactive",
      value: inactive,
      icon: Clock,
      gradient: "from-[#d81b60] to-[#f9a8d4]"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: item.value })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-3.5 w-3.5 text-white" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 animate-shimmer`,
            style: { width: `${Math.min(100, item.value / (total || 1) * 100)}%` }
          }
        ) })
      ]
    },
    item.key
  )) });
});
StatsCards$3.displayName = "StatsCards";
function BannersAdminPage() {
  const app = useApp();
  useT();
  const isArabic = app.lang === "ar";
  const { data: banners = [], isLoading } = useAllBanners();
  const save = useSaveBanner();
  const del = useDeleteBanner();
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [bannerToDelete, setBannerToDelete] = reactExports.useState(null);
  const stats = {
    total: banners.length,
    active: banners.filter((b) => b.active).length,
    inactive: banners.filter((b) => !b.active).length
  };
  function openNew() {
    setEditing({
      title_ar: "",
      image_url: "",
      active: true,
      sort_order: banners.length
    });
  }
  async function handleSave() {
    if (!editing?.title_ar || !editing?.image_url) {
      toast.error(isArabic ? "⚠️ العنوان والصورة مطلوبان" : "⚠️ Title and image required");
      return;
    }
    try {
      await save.mutateAsync(editing);
      toast.success(isArabic ? "✅ تم حفظ البنر بنجاح" : "✅ Banner saved successfully");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }
  async function handleDeleteBanner() {
    if (!bannerToDelete) return;
    try {
      await del.mutateAsync(bannerToDelete.id);
      toast.success(isArabic ? "✅ تم حذف البنر بنجاح" : "✅ Banner deleted successfully");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isArabic ? "البنرات" : "Banners" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isArabic ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: stats.total }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "إجمالي" : "total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: stats.active }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "نشط" : "active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9a8d4]/10 border border-[#f9a8d4]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#d81b60]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#d81b60] font-medium", children: stats.inactive }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "غير نشط" : "inactive" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openNew,
            className: "rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
              isArabic ? "إضافة بنر جديد" : "Add New Banner"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          isArabic ? "لوحة تحكم" : "Dashboard"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCards$3, { ...stats, isArabic }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 animate-pulse", children: isArabic ? "⏳ جاري تحميل البنرات..." : "⏳ Loading banners..." })
    ] }) : banners.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-16 text-center shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: isArabic ? "🚀 لا توجد بنرات" : "🚀 No banners" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto", children: isArabic ? "قم بإضافة أول بنر لجعل الصفحة الرئيسية أكثر جاذبية" : "Add your first banner to make the homepage more attractive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: openNew,
          className: "mt-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
            isArabic ? "إضافة بنر جديد" : "Add New Banner"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: banners.map((banner, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in-up", style: { animationDelay: `${index * 0.05}s` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      BannerCard,
      {
        banner,
        onEdit: (b) => setEditing(b),
        onDelete: (b) => {
          setBannerToDelete(b);
          setDeleteDialogOpen(true);
        },
        isArabic
      }
    ) }, banner.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-20 transition-all duration-300 border border-gray-300 dark:border-gray-600",
          onClick: () => setEditing(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-pink-400/40", children: editing?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-6 w-6 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: editing?.id ? isArabic ? "تعديل البنر" : "Edit Banner" : isArabic ? "إضافة بنر جديد" : "Add New Banner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: editing?.id ? isArabic ? "تعديل بيانات البنر" : "Edit banner details" : isArabic ? "أدخل معلومات البنر الجديد" : "Enter new banner details" })
          ] })
        ] }) }),
        editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "📝" }),
                isArabic ? "العنوان (AR) *" : "Title (AR) *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editing.title_ar || "",
                  onChange: (e) => setEditing({ ...editing, title_ar: e.target.value }),
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300",
                  placeholder: isArabic ? "مثال: عرض الصيف" : "Example: Summer Sale"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "🌐" }),
                isArabic ? "العنوان (EN)" : "Title (EN)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editing.title_en || "",
                  onChange: (e) => setEditing({ ...editing, title_en: e.target.value }),
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300",
                  placeholder: "Example: Summer Sale"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "📝" }),
                isArabic ? "العنوان الفرعي (AR)" : "Subtitle (AR)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editing.subtitle_ar || "",
                  onChange: (e) => setEditing({ ...editing, subtitle_ar: e.target.value }),
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300",
                  placeholder: isArabic ? "مثال: خصم يصل إلى 50%" : "Example: Up to 50% off"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "🌐" }),
                isArabic ? "العنوان الفرعي (EN)" : "Subtitle (EN)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editing.subtitle_en || "",
                  onChange: (e) => setEditing({ ...editing, subtitle_en: e.target.value }),
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300",
                  placeholder: "Example: Up to 50% off"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "الرابط" : "Link URL"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.link_url || "",
                onChange: (e) => setEditing({ ...editing, link_url: e.target.value }),
                placeholder: isArabic ? "/category/fashion" : "/category/fashion",
                className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "صورة البنر *" : "Banner Image *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageInput,
              {
                value: editing.image_url || "",
                onChange: (value) => setEditing({ ...editing, image_url: value }),
                userId: app.user?.id,
                folder: "banners",
                lang: app.lang,
                label: isArabic ? "ارفع صورة البنر" : "Upload banner image",
                required: true,
                hint: isArabic ? "ارفع صورة البنر من جهازك أو ضع رابط URL" : "Upload a banner image or paste a URL",
                previewClassName: "aspect-[16/6] h-auto rounded-xl border border-gray-300 dark:border-gray-600"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-300 dark:border-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: editing.active ?? true,
                  onChange: (e) => setEditing({ ...editing, active: e.target.checked }),
                  className: "h-4 w-4 rounded border-gray-300 text-[#2a655f] focus:ring-[#2a655f]/30 accent-[#2a655f]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[#2a655f] dark:text-white", children: isArabic ? "🟢 البنر نشط" : "🟢 Banner is active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40 text-[10px]", children: isArabic ? `ترتيب: ${editing.sort_order + 1}` : `Order: ${editing.sort_order + 1}` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t border-gray-300 dark:border-gray-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setEditing(null),
              className: "flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-600 hover:text-slate-800 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                isArabic ? "إلغاء" : "Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: save.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0",
              children: save.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
                isArabic ? "جاري الحفظ..." : "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "حفظ البنر" : "Save Banner"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl p-0 overflow-hidden border-2 border-[#d81b60]/40 shadow-2xl shadow-[#d81b60]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-20 transition-all duration-300 border border-gray-300 dark:border-gray-600",
          onClick: () => setDeleteDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-rose-600 dark:text-rose-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isArabic ? "تأكيد الحذف" : "Confirm Delete" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-700 dark:text-rose-300 font-medium", children: isArabic ? `هل أنت متأكد من حذف البنر "${bannerToDelete?.title_ar}"؟` : `Are you sure you want to delete the banner "${bannerToDelete?.title_ar}"?` }),
          bannerToDelete?.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-lg overflow-hidden border-2 border-rose-200/30 dark:border-rose-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            OptimizedImage,
            {
              src: bannerToDelete.image_url,
              alt: bannerToDelete.title_ar,
              width: 400,
              height: 100,
              quality: 80,
              objectFit: "cover",
              className: "w-full h-24 object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-rose-600/70 dark:text-rose-400/70 mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
            isArabic ? "سيتم حذف هذا البنر نهائياً من النظام" : "This banner will be permanently deleted from the system"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
          isArabic ? "تحذير: حذف هذا البنر سيؤثر على واجهة الصفحة الرئيسية" : "Warning: Deleting this banner will affect the homepage layout"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setDeleteDialogOpen(false),
              className: "flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-600 hover:text-slate-800 transition-all duration-300",
              children: isArabic ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleDeleteBanner,
              disabled: del.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50",
              children: del.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
                isArabic ? "جاري الحذف..." : "Deleting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
                isArabic ? "تأكيد الحذف" : "Confirm Delete"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
          opacity: 0;
        }
      ` })
  ] });
}
const StatCard$1 = ({
  label,
  value,
  icon: Icon,
  gradient,
  color
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-5 w-5", color) }) })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`,
      style: { width: `${Math.min(100, value / 1 * 100)}%` }
    }
  ) })
] });
function AnnouncementsAdmin() {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const { data: items = [], isLoading, refetch } = useAllAnnouncements();
  const save = useSaveAnnouncement();
  const del = useDeleteAnnouncement();
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [deleteTargetId, setDeleteTargetId] = reactExports.useState(null);
  const [deleteTargetText, setDeleteTargetText] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const stats = reactExports.useMemo(() => {
    const total = items.length;
    const active = items.filter((a) => a.active).length;
    const inactive = items.filter((a) => !a.active).length;
    return { total, active, inactive };
  }, [items]);
  const filteredItems = reactExports.useMemo(() => {
    let result = items;
    if (filterStatus === "active") {
      result = result.filter((a) => a.active);
    } else if (filterStatus === "inactive") {
      result = result.filter((a) => !a.active);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        return a.text_ar?.toLowerCase().includes(q) || a.text_en?.toLowerCase().includes(q) || a.link_url?.toLowerCase().includes(q);
      });
    }
    return result;
  }, [items, searchQuery, filterStatus]);
  function openNew() {
    setEditing({
      text_ar: "",
      text_en: "",
      link_url: "",
      active: true,
      sort_order: items.length
    });
  }
  async function handleSave() {
    if (!editing?.text_ar) {
      toast.error(isRTL ? "النص العربي مطلوب" : "Arabic text required");
      return;
    }
    try {
      await save.mutateAsync(editing);
      toast.success(isRTL ? "✅ تم الحفظ" : "✅ Saved");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }
  function openDeleteDialog(id, text) {
    setDeleteTargetId(id);
    setDeleteTargetText(text);
    setDeleteDialogOpen(true);
  }
  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await del.mutateAsync(deleteTargetId);
      toast.success(isRTL ? "✅ تم حذف الإعلان" : "✅ Announcement deleted");
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 animate-pulse", children: isRTL ? "⏳ جاري تحميل الإعلانات..." : "⏳ Loading announcements..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isRTL ? "شريط الإعلانات" : "Announcement Bar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isRTL ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: stats.total }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "إجمالي" : "total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: stats.active }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "نشط" : "active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 hover:bg-rose-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5 text-rose-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-600 dark:text-rose-400 font-medium", children: stats.inactive }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "مخفي" : "hidden" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => refetch(),
            className: "rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openNew,
            className: "rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
              isRTL ? "إعلان جديد" : "New Announcement"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          isRTL ? "لوحة تحكم" : "Dashboard"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$1,
        {
          label: isRTL ? "الإجمالي" : "Total",
          value: stats.total,
          icon: Megaphone,
          gradient: "from-[#2a655f] to-[#f9a8d4]",
          color: "text-[#2a655f]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$1,
        {
          label: isRTL ? "نشط" : "Active",
          value: stats.active,
          icon: CircleCheck,
          gradient: "from-emerald-500 to-teal-500",
          color: "text-emerald-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard$1,
        {
          label: isRTL ? "مخفي" : "Inactive",
          value: stats.inactive,
          icon: EyeOff,
          gradient: "from-rose-500 to-[#f9a8d4]",
          color: "text-rose-500"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: isRTL ? "🔍 بحث عن إعلان..." : "🔍 Search announcements...",
            className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: `absolute inset-y-0 ${isRTL ? "left-3" : "right-3"} flex items-center text-slate-400 hover:text-slate-600 transition-colors`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterStatus,
          onValueChange: (value) => setFilterStatus(value),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "جميع الإعلانات" : "All" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "📋 ",
                isRTL ? "جميع" : "All"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "active", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "✅ ",
                isRTL ? "نشطة" : "Active"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "inactive", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "🚫 ",
                isRTL ? "مخفية" : "Inactive"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setFilterStatus("all");
          },
          className: "h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1.5" }),
            isRTL ? "مسح الكل" : "Clear all"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "النص" : "Text"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[150px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الرابط" : "Link"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[80px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الترتيب" : "Order"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            isRTL ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: isRTL ? "لا توجد إعلانات" : "No announcements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "ابدأ بإضافة أول إعلان لشريط الإعلانات" : "Start by adding your first announcement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: openNew,
              className: "mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
                isRTL ? "إضافة إعلان" : "Add Announcement"
              ]
            }
          )
        ] }) }) }) : filteredItems.map((a, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border-2 border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: a.text_ar }),
                  a.text_en && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", dir: "ltr", children: a.text_en })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { dir: "ltr", className: "text-xs text-slate-500 dark:text-slate-400 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: a.link_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: a.link_url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-[#2a655f] hover:text-[#d81b60] underline flex items-center justify-center gap-1 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
                    a.link_url.length > 30 ? a.link_url.slice(0, 30) + "..." : a.link_url
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-slate-900 dark:text-white text-center font-mono text-sm border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                "#",
                a.sort_order
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: a.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1 animate-pulse" }),
                isRTL ? "نشط" : "Active"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3 w-3 mr-1" }),
                isRTL ? "مخفي" : "Hidden"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
                    onClick: () => setEditing({ ...a }),
                    title: isRTL ? "تعديل الإعلان" : "Edit announcement",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-red-300 dark:hover:border-red-500/40 hover:text-red-500 transition-all duration-300",
                    onClick: () => openDeleteDialog(a.id, a.text_ar),
                    title: isRTL ? "حذف الإعلان" : "Delete announcement",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3 w-3 mr-0.5 text-[#2a655f] dark:text-slate-400" }),
                  index + 1
                ] })
              ] }) })
            ]
          },
          a.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: isRTL ? `عرض ${filteredItems.length} من ${items.length}` : `Showing ${filteredItems.length} of ${items.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: isRTL ? `إجمالي ${items.length}` : `Total ${items.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            filterStatus === "all" && (isRTL ? "جميع" : "All"),
            filterStatus === "active" && (isRTL ? "نشطة" : "Active"),
            filterStatus === "inactive" && (isRTL ? "مخفية" : "Inactive")
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            searchQuery
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 max-w-md overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setEditing(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-[#f9a8d4]/40", children: editing?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-6 w-6 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: editing?.id ? isRTL ? "تعديل إعلان" : "Edit Announcement" : isRTL ? "إعلان جديد" : "New Announcement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "أضف أو عدل محتوى الإعلان الذي سيظهر في شريط الإعلانات" : "Add or edit the announcement content for the announcement bar" })
          ] })
        ] }) }),
        editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📝" }),
              isRTL ? "النص بالعربية *" : "Arabic text *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.text_ar || "",
                onChange: (e) => setEditing({ ...editing, text_ar: e.target.value }),
                placeholder: isRTL ? "عروض حصرية على الأزياء حتى 40%" : "Exclusive fashion offers up to 40%",
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🌐" }),
              isRTL ? "النص بالإنكليزية" : "English text"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.text_en || "",
                onChange: (e) => setEditing({ ...editing, text_en: e.target.value }),
                dir: "ltr",
                placeholder: "Exclusive fashion offers up to 40%",
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4" }),
              isRTL ? "رابط (اختياري)" : "Link URL (optional)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.link_url || "",
                onChange: (e) => setEditing({ ...editing, link_url: e.target.value }),
                dir: "ltr",
                placeholder: "/category/offers",
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4" }),
                isRTL ? "الترتيب" : "Sort order"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: editing.sort_order ?? 0,
                  onChange: (e) => setEditing({ ...editing, sort_order: Number(e.target.value) }),
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "الحالة" : "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: editing.active ?? true,
                    onCheckedChange: (checked) => setEditing({ ...editing, active: checked }),
                    className: "data-[state=checked]:bg-[#2a655f]"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium ${editing.active ? "text-emerald-600" : "text-red-500"}`, children: editing.active ? isRTL ? "نشط" : "Active" : isRTL ? "مخفي" : "Inactive" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-pink-400/30 dark:border-pink-400/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setEditing(null),
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                isRTL ? "إلغاء" : "Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: save.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0",
              children: save.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isRTL ? "جاري الحفظ..." : "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "حفظ" : "Save"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-2 border-rose-500/40 shadow-2xl shadow-rose-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
            setDeleteTargetText("");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-rose-600 dark:text-rose-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "تأكيد الحذف" : "Confirm Deletion" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isRTL ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone" })
          ] })
        ] }),
        deleteTargetText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-3 w-3 text-[#2a655f] dark:text-[#f9a8d4]" }),
            isRTL ? "الإعلان المراد حذفه:" : "Announcement to delete:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-slate-900 dark:text-white", children: [
            '"',
            deleteTargetText,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border-2 border-rose-500/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-rose-500 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-600 dark:text-rose-400", children: isRTL ? "⚠️ هذا الإجراء نهائي ولا يمكن استعادة الإعلان بعد حذفه." : "⚠️ This action is permanent and cannot be undone." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setDeleteDialogOpen(false);
                setDeleteTargetId(null);
                setDeleteTargetText("");
              },
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                isRTL ? "إلغاء" : "Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: confirmDelete,
              disabled: del.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50",
              children: del.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isRTL ? "جاري الحذف..." : "Deleting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "تأكيد الحذف" : "Confirm Delete"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      ` })
  ] });
}
const CATEGORY_ICONS = [
  { value: "smartphone", label: "📱", name: "Smartphone", category: "electronics" },
  { value: "laptop", label: "💻", name: "Laptop", category: "electronics" },
  { value: "tablet", label: "📟", name: "Tablet", category: "electronics" },
  { value: "watch", label: "⌚", name: "Smart Watch", category: "electronics" },
  { value: "headphones", label: "🎧", name: "Headphones", category: "electronics" },
  { value: "camera", label: "📷", name: "Camera", category: "electronics" },
  { value: "tv", label: "📺", name: "TV", category: "electronics" },
  { value: "speaker", label: "🔊", name: "Speaker", category: "electronics" },
  { value: "gamepad", label: "🎮", name: "Game Console", category: "electronics" },
  { value: "drone", label: "🛸", name: "Drone", category: "electronics" },
  { value: "shirt", label: "👕", name: "Shirt", category: "fashion" },
  { value: "dress", label: "👗", name: "Dress", category: "fashion" },
  { value: "jeans", label: "👖", name: "Jeans", category: "fashion" },
  { value: "shoes", label: "👟", name: "Sneakers", category: "fashion" },
  { value: "boots", label: "🥾", name: "Boots", category: "fashion" },
  { value: "hat", label: "🧢", name: "Hat", category: "fashion" },
  { value: "glasses", label: "👓", name: "Glasses", category: "fashion" },
  { value: "bag", label: "👜", name: "Bag", category: "fashion" },
  { value: "jewelry", label: "💎", name: "Jewelry", category: "fashion" },
  { value: "perfume", label: "🧴", name: "Perfume", category: "fashion" },
  { value: "home", label: "🏠", name: "Home", category: "home" },
  { value: "furniture", label: "🛋️", name: "Furniture", category: "home" },
  { value: "bed", label: "🛏️", name: "Bed", category: "home" },
  { value: "kitchen", label: "🍳", name: "Kitchen", category: "home" },
  { value: "fridge", label: "🧊", name: "Fridge", category: "home" },
  { value: "lamp", label: "💡", name: "Lamp", category: "home" },
  { value: "tools", label: "🔧", name: "Tools", category: "home" },
  { value: "book", label: "📚", name: "Book", category: "books" },
  { value: "notebook", label: "📓", name: "Notebook", category: "books" },
  { value: "pen", label: "🖊️", name: "Pen", category: "books" },
  { value: "art", label: "🎨", name: "Art", category: "books" },
  { value: "toys", label: "🧸", name: "Toys", category: "toys" },
  { value: "puzzle", label: "🧩", name: "Puzzle", category: "toys" },
  { value: "dumbbell", label: "🏋️", name: "Dumbbell", category: "sports" },
  { value: "coffee", label: "☕", name: "Coffee", category: "food" },
  { value: "cake", label: "🎂", name: "Cake", category: "food" },
  { value: "health", label: "🏥", name: "Health", category: "health" },
  { value: "medicine", label: "💊", name: "Medicine", category: "health" },
  { value: "soap", label: "🧼", name: "Soap", category: "health" },
  { value: "car", label: "🚗", name: "Car", category: "vehicles" },
  { value: "truck", label: "🚚", name: "Truck", category: "vehicles" },
  { value: "motorcycle", label: "🏍️", name: "Motorcycle", category: "vehicles" },
  { value: "office", label: "🏢", name: "Office", category: "services" },
  { value: "shop", label: "🏪", name: "Shop", category: "services" },
  { value: "restaurant", label: "🍽️", name: "Restaurant", category: "services" },
  { value: "nature", label: "🌿", name: "Nature", category: "nature" },
  { value: "flower", label: "🌸", name: "Flower", category: "nature" },
  { value: "tree", label: "🌳", name: "Tree", category: "nature" },
  { value: "pets", label: "🐾", name: "Pets", category: "nature" },
  { value: "money", label: "💰", name: "Money", category: "business" },
  { value: "gift", label: "🎁", name: "Gift", category: "business" },
  { value: "discount", label: "🏷️", name: "Discount", category: "business" },
  { value: "globe", label: "🌍", name: "Globe", category: "general" },
  { value: "location", label: "📍", name: "Location", category: "general" },
  { value: "calendar", label: "📅", name: "Calendar", category: "general" },
  { value: "bell", label: "🔔", name: "Bell", category: "general" },
  { value: "email", label: "📧", name: "Email", category: "general" },
  { value: "phone", label: "📞", name: "Phone", category: "general" },
  { value: "chat", label: "💬", name: "Chat", category: "general" },
  { value: "user", label: "👤", name: "User", category: "general" },
  { value: "settings", label: "⚙️", name: "Settings", category: "general" },
  { value: "heart", label: "❤️", name: "Heart", category: "general" },
  { value: "fire", label: "🔥", name: "Fire", category: "general" },
  { value: "sparkle", label: "✨", name: "Sparkle", category: "general" },
  { value: "rocket", label: "🚀", name: "Rocket", category: "general" },
  { value: "package", label: "📦", name: "Package", category: "general" },
  { value: "delivery", label: "🚚", name: "Delivery", category: "general" },
  { value: "shield", label: "🛡️", name: "Shield", category: "general" },
  { value: "award", label: "🏆", name: "Award", category: "general" }
];
const getIconEmoji = (value) => {
  const found = CATEGORY_ICONS.find((icon) => icon.value === value);
  return found?.label || "📦";
};
const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-400/80 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-white" }) }) })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`,
      style: { width: `${Math.min(100, value / 1 * 100)}%` }
    }
  ) })
] });
function IconDropdown({ value, onChange, lang, searchTerm, onSearchChange }) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const dropdownRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const filteredIcons = reactExports.useMemo(() => {
    if (!searchTerm.trim()) return CATEGORY_ICONS;
    const query = searchTerm.toLowerCase().trim();
    return CATEGORY_ICONS.filter(
      (icon) => icon.name.toLowerCase().includes(query) || icon.value.toLowerCase().includes(query) || icon.label.includes(query)
    );
  }, [searchTerm]);
  const groupedIcons = reactExports.useMemo(() => {
    const groups = {};
    filteredIcons.forEach((icon) => {
      if (!groups[icon.category]) groups[icon.category] = [];
      groups[icon.category].push(icon);
    });
    return groups;
  }, [filteredIcons]);
  const categoryNames = {
    electronics: { ar: "إلكترونيات", en: "Electronics", emoji: "📱" },
    fashion: { ar: "أزياء", en: "Fashion", emoji: "👕" },
    home: { ar: "منزل", en: "Home", emoji: "🏠" },
    books: { ar: "كتب", en: "Books", emoji: "📚" },
    toys: { ar: "ألعاب", en: "Toys", emoji: "🎮" },
    food: { ar: "طعام", en: "Food", emoji: "🍕" },
    health: { ar: "صحة", en: "Health", emoji: "🏥" },
    vehicles: { ar: "سيارات", en: "Vehicles", emoji: "🚗" },
    services: { ar: "خدمات", en: "Services", emoji: "🏢" },
    sports: { ar: "رياضة", en: "Sports", emoji: "🏋️" },
    nature: { ar: "طبيعة", en: "Nature", emoji: "🌿" },
    business: { ar: "تجارة", en: "Business", emoji: "💰" },
    general: { ar: "عام", en: "General", emoji: "🌐" }
  };
  const selectedIcon = CATEGORY_ICONS.find((icon) => icon.value === value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: cn(
          "w-full h-11 px-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
          isOpen ? "border-gray-400 ring-2 ring-gray-300/30 bg-white dark:bg-slate-800" : "border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-slate-900/50 hover:border-gray-400"
        ),
        children: [
          selectedIcon ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none", children: selectedIcon.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-start text-sm font-medium text-slate-700 dark:text-slate-300", children: selectedIcon.name })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-start text-sm text-slate-400", children: lang === "ar" ? "اختر أيقونة..." : "Select icon..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}` })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-2xl overflow-hidden z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 bg-white dark:bg-slate-800 p-3 border-b border-gray-300 dark:border-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchTerm,
            onChange: (e) => onSearchChange(e.target.value),
            placeholder: lang === "ar" ? "ابحث عن أيقونة..." : "Search icons...",
            className: "pl-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-50/50 dark:bg-slate-900/50 text-sm",
            autoFocus: true
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[320px] overflow-y-auto p-2 space-y-1.5", children: Object.entries(groupedIcons).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl block mb-2", children: "🔍" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: lang === "ar" ? "لا نتائج" : "No results" })
      ] }) : Object.entries(groupedIcons).map(([category, icons]) => {
        const catInfo = categoryNames[category] || categoryNames.general;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: catInfo.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "ar" ? catInfo.ar : catInfo.en }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-300", children: [
              "(",
              icons.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-1", children: icons.map((icon) => {
            const isSelected = value === icon.value;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  onChange(icon.value);
                  setIsOpen(false);
                },
                className: cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                  isSelected ? "bg-gray-200/50 dark:bg-gray-700/50 text-slate-800 ring-1 ring-gray-400" : "hover:bg-gray-100/70 dark:hover:bg-gray-700/50 text-slate-700"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl leading-none", children: icon.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-start truncate", children: icon.name }),
                  isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 flex-shrink-0" })
                ]
              },
              icon.value
            );
          }) })
        ] }, category);
      }) })
    ] })
  ] });
}
function CategoriesAdmin() {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const { data: categories = [], isLoading, refetch } = useCategories();
  const save = useSaveCategory();
  const del = useDeleteCategory();
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [categoryToDelete, setCategoryToDelete] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [iconSearchTerm, setIconSearchTerm] = reactExports.useState("");
  const [expandedParents, setExpandedParents] = reactExports.useState(/* @__PURE__ */ new Set());
  const mainCategories = reactExports.useMemo(() => {
    return categories.filter((c) => !c.parent_id);
  }, [categories]);
  const childrenMap = reactExports.useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      if (c.parent_id) {
        if (!map[c.parent_id]) map[c.parent_id] = [];
        map[c.parent_id].push(c);
      }
    });
    return map;
  }, [categories]);
  const displayedCategories = reactExports.useMemo(() => {
    const result = [];
    const sortedMain = [...mainCategories].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
    sortedMain.forEach((parent) => {
      const children = childrenMap[parent.id] || [];
      result.push({
        ...parent,
        _isChild: false,
        _parentName: null,
        _childrenCount: children.length,
        _isExpanded: expandedParents.has(parent.id)
      });
      if (expandedParents.has(parent.id)) {
        const sortedChildren = [...children].sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
        );
        sortedChildren.forEach((child) => {
          result.push({
            ...child,
            _isChild: true,
            _parentName: isRTL ? parent.name_ar : parent.name_en,
            _childrenCount: 0,
            _isExpanded: false
          });
        });
      }
    });
    return result;
  }, [mainCategories, childrenMap, expandedParents, isRTL]);
  const filteredCategories = reactExports.useMemo(() => {
    if (!searchQuery.trim()) return displayedCategories;
    const q = searchQuery.toLowerCase().trim();
    return displayedCategories.filter(
      (c) => c.name_ar?.toLowerCase().includes(q) || c.name_en?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q)
    );
  }, [displayedCategories, searchQuery]);
  const stats = {
    total: categories.length,
    main: mainCategories.length,
    sub: categories.filter((c) => c.parent_id).length,
    active: categories.filter((c) => c.active !== false).length,
    hidden: categories.filter((c) => c.active === false).length,
    featured: categories.filter((c) => c.is_featured === true).length
  };
  function toggleExpand(parentId) {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  }
  function openNewMain() {
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: mainCategories.length + 1,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
      parent_id: null,
      _lockParent: true,
      _mode: "add-main"
    });
    setIconSearchTerm("");
  }
  function openNewSubFromHeader() {
    if (mainCategories.length === 0) {
      toast.error(isRTL ? "⚠️ أضف تصنيفاً رئيسياً أولاً" : "⚠️ Add a main category first");
      return;
    }
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: 1,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
      parent_id: null,
      _lockParent: false,
      _mode: "add-sub-from-header"
    });
    setIconSearchTerm("");
  }
  function openNewSubFromRow(parentCategory) {
    const siblings = childrenMap[parentCategory.id] || [];
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: siblings.length + 1,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
      parent_id: parentCategory.id,
      _lockParent: true,
      _mode: "add-sub-from-row"
    });
    setIconSearchTerm("");
    setExpandedParents((prev) => new Set(prev).add(parentCategory.id));
  }
  async function handleToggleFeatured(category) {
    try {
      const newValue = !category.is_featured;
      let newSort = 0;
      if (newValue) {
        const featuredCount = categories.filter((c) => c.is_featured).length;
        newSort = featuredCount + 1;
      }
      const { error } = await supabase.from("categories").update({
        is_featured: newValue,
        featured_sort: newSort
      }).eq("id", category.id);
      if (error) throw error;
      refetch();
      toast.success(
        newValue ? isRTL ? "✅ تم التفعيل" : "✅ Activated" : isRTL ? "✅ تم الإلغاء" : "✅ Deactivated"
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error(isRTL ? "❌ فشل التحديث" : "❌ Failed");
    }
  }
  async function handleSave() {
    if (!editing?.slug || !editing?.name_ar || !editing?.name_en) {
      toast.error(isRTL ? "الحقول الأساسية مطلوبة" : "Required fields missing");
      return;
    }
    if (editing._mode === "add-sub-from-header" && !editing.parent_id) {
      toast.error(isRTL ? "⚠️ اختر التصنيف الأب" : "⚠️ Select parent category");
      return;
    }
    if (editing.parent_id && editing.parent_id === editing.id) {
      toast.error(isRTL ? "❌ لا يمكن أن يكون التصنيف أباً لنفسه" : "❌ Cannot be its own parent");
      return;
    }
    const { _lockParent, _mode, _isChild, _parentName, _childrenCount, _isExpanded, ...cleanData } = editing;
    const dataToSave = {
      ...cleanData,
      level: cleanData.parent_id ? 1 : 0
    };
    try {
      await save.mutateAsync(dataToSave);
      toast.success(
        cleanData.parent_id ? isRTL ? "✅ تم حفظ التصنيف الفرعي" : "✅ Subcategory saved" : isRTL ? "✅ تم حفظ التصنيف الرئيسي" : "✅ Main category saved"
      );
      if (cleanData.parent_id) {
        setExpandedParents((prev) => new Set(prev).add(cleanData.parent_id));
      }
      setEditing(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }
  function openDeleteDialog(category) {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  }
  async function handleDelete() {
    if (!categoryToDelete) return;
    try {
      await del.mutateAsync(categoryToDelete.id);
      toast.success(isRTL ? "✅ تم الحذف" : "✅ Deleted");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 animate-pulse", children: isRTL ? "⏳ جاري التحميل..." : "⏳ Loading..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isRTL ? "التصنيفات" : "Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isRTL ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: stats.main }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "رئيسي" : "main" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d81b60]/10 border border-[#d81b60]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-3.5 w-3.5 text-[#d81b60]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#d81b60] font-medium", children: stats.sub }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "فرعي" : "sub" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-yellow-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-600 dark:text-yellow-400 font-medium", children: stats.featured }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "مميز" : "featured" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openNewMain,
            className: "rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4 mr-1.5 group-hover:rotate-6 transition-transform duration-300" }),
              isRTL ? "تصنيف رئيسي" : "Main Category"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: openNewSubFromHeader,
            className: "rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-4 w-4 mr-1.5 group-hover:rotate-6 transition-transform duration-300" }),
              isRTL ? "تصنيف فرعي" : "Subcategory"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: isRTL ? "الإجمالي" : "Total",
          value: stats.total,
          icon: FolderOpen,
          gradient: "from-[#2a655f] to-[#1a4f4a]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: isRTL ? "رئيسي" : "Main",
          value: stats.main,
          icon: Folder,
          gradient: "from-emerald-500 to-teal-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: isRTL ? "فرعي" : "Sub",
          value: stats.sub,
          icon: FolderTree,
          gradient: "from-[#d81b60] to-[#f9a8d4]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: isRTL ? "مميز" : "Featured",
          value: stats.featured,
          icon: Star,
          gradient: "from-yellow-500 to-amber-500"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: isRTL ? "🔍 بحث عن تصنيف..." : "🔍 Search categories...",
            className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/60`
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: `absolute inset-y-0 ${isRTL ? "left-3" : "right-3"} flex items-center text-slate-400 hover:text-[#2a655f] transition-colors`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setSearchQuery(""),
          className: "h-10 rounded-xl border border-gray-300 dark:border-gray-600 text-slate-600 hover:bg-gray-100/70 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isRTL ? "مسح" : "Clear"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[300px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-3.5 w-3.5" }),
            isRTL ? "التصنيف" : "Category"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
            "Slug"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5" }),
            isRTL ? "المستوى" : "Level"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[80px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3.5 w-3.5" }),
            isRTL ? "الترتيب" : "Order"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5" }),
            isRTL ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5" }),
            isRTL ? "مميز" : "Featured"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 animate-pulse" }),
            isRTL ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: isRTL ? "لا توجد تصنيفات" : "No categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: openNewMain,
              className: "mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg transition-all duration-300 hover:scale-105 border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "إضافة تصنيف" : "Add Category"
              ]
            }
          )
        ] }) }) }) : filteredCategories.map((c) => {
          const isFeatured = c.is_featured === true;
          const isChild = c._isChild === true;
          const hasChildren = c._childrenCount > 0;
          const isExpanded = c._isExpanded;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: cn(
                "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
                isFeatured && !isChild && "bg-yellow-50/30 dark:bg-yellow-950/10",
                isChild && "bg-[#f9a8d4]/5 dark:bg-[#d81b60]/5"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-2", isChild && "ps-6"), children: [
                  !isChild && hasChildren ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => toggleExpand(c.id),
                      className: cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0",
                        isExpanded ? "bg-[#2a655f]/15 text-[#2a655f] rotate-90" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                      ),
                      title: isRTL ? isExpanded ? "طي" : "عرض" : isExpanded ? "Collapse" : "Expand",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: "h-4 w-4 transition-transform duration-300" })
                    }
                  ) : !isChild && !hasChildren ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 flex-shrink-0" }) : null,
                  isChild && /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownRight, { className: "h-4 w-4 text-[#d81b60] flex-shrink-0 -ms-2" }),
                  c.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: c.image_url,
                      className: cn(
                        "rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#2a655f]/60 group-hover:scale-105 transition-all duration-300 shadow-md flex-shrink-0",
                        isChild ? "h-10 w-10" : "h-14 w-14"
                      ),
                      alt: "",
                      onError: (e) => {
                        e.target.style.display = "none";
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                    "rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#2a655f]/60",
                    isChild ? "h-10 w-10" : "h-14 w-14"
                  ), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isChild ? "text-xl" : "text-3xl", children: getIconEmoji(c.icon) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
                      "font-semibold flex items-center gap-2 group-hover:text-[#2a655f] transition-colors duration-300",
                      isChild ? "text-sm text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                    ), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: c.name_ar }),
                      isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-yellow-400 text-yellow-500 flex-shrink-0" }),
                      !isChild && hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] flex-shrink-0", children: [
                        c._childrenCount,
                        " ",
                        isRTL ? "فرعي" : "sub"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400 truncate", children: c.name_en }),
                    isChild && c._parentName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-[#d81b60] flex items-center gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-2.5 w-2.5" }),
                      isRTL ? "تابع لـ:" : "Under:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c._parentName })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { dir: "ltr", className: "text-sm text-slate-500 text-center font-mono border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 text-[10px]", children: c.slug }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: isChild ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#d81b60]/10 text-[#d81b60] dark:bg-[#d81b60]/20 dark:text-[#f48fb1] border-2 border-[#d81b60]/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "فرعي" : "Sub"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] dark:bg-[#2a655f]/20 dark:text-[#3a8a82] border-2 border-[#2a655f]/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "رئيسي" : "Main"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
                  "#",
                  c.sort_order
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: c.active !== false ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "نشط" : "Active"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "مخفي" : "Hidden"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: cn(
                      "rounded-xl h-9 w-9 p-0 transition-all duration-300 hover:scale-110 border",
                      isFeatured ? "border-amber-400/60 bg-amber-50 dark:bg-amber-950/20 text-amber-600" : "border-gray-300 dark:border-gray-600 text-gray-400 hover:text-amber-500 hover:border-amber-400/40"
                    ),
                    onClick: () => handleToggleFeatured(c),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-4 w-4", isFeatured && "fill-yellow-400") })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 flex-wrap", children: [
                  !isChild && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "rounded-xl h-8 px-2.5 border-[#2a655f]/40 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f] transition-all duration-300 group/sub",
                      onClick: () => openNewSubFromRow(c),
                      title: isRTL ? "إضافة تصنيف فرعي" : "Add subcategory",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1 group-hover/sub:rotate-90 transition-transform duration-300" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: isRTL ? "إضافة فرعي" : "Add Sub" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "rounded-xl h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f] hover:text-[#2a655f] transition-all duration-300",
                      onClick: () => {
                        setEditing({
                          ...c,
                          _lockParent: !isChild,
                          _mode: isChild ? "edit-sub" : "edit-main"
                        });
                        setIconSearchTerm("");
                      },
                      title: isRTL ? "تعديل" : "Edit",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "rounded-xl h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-rose-500/10 hover:border-rose-400 hover:text-rose-600 transition-all duration-300",
                      onClick: () => openDeleteDialog(c),
                      title: isRTL ? "حذف" : "Delete",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }) })
              ]
            },
            c.id
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: isRTL ? `عرض ${filteredCategories.length} من ${categories.length}` : `Showing ${filteredCategories.length} of ${categories.length}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-3 w-3 mr-1" }),
            stats.main,
            " ",
            isRTL ? "رئيسي" : "main"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#d81b60]/10 text-[#d81b60] border-2 border-[#d81b60]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-3 w-3 mr-1" }),
            stats.sub,
            " ",
            isRTL ? "فرعي" : "sub"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-700/50 z-20 transition-all duration-300 border border-gray-300 dark:border-gray-600",
          onClick: () => setEditing(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg border-2 border-pink-400/40",
            editing?.parent_id ? "bg-gradient-to-br from-[#d81b60] to-[#f48fb1] shadow-[#d81b60]/20" : "bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] shadow-[#2a655f]/20"
          ), children: editing?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-6 w-6 text-white" }) : editing?.parent_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-6 w-6 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: editing?.id ? isRTL ? "تعديل التصنيف" : "Edit Category" : editing?.parent_id ? isRTL ? "تصنيف فرعي جديد" : "New Subcategory" : isRTL ? "تصنيف رئيسي جديد" : "New Main Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: editing?.id ? isRTL ? "قم بتعديل بيانات التصنيف" : "Edit category details" : editing?.parent_id ? isRTL ? "أضف تصنيفاً فرعياً" : "Add a subcategory" : isRTL ? "أضف تصنيفاً رئيسياً" : "Add a main category" })
          ] })
        ] }) }),
        editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4" }),
              isRTL ? "التصنيف الأب" : "Parent Category",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn(
                "text-[10px] border-slate-200 dark:bg-slate-800 dark:text-slate-400",
                editing._lockParent ? "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/30" : "bg-slate-100 text-slate-600"
              ), children: editing._lockParent ? isRTL ? "🔒 مُقفل" : "🔒 Locked" : isRTL ? "قابل للتعديل" : "Editable" })
            ] }),
            editing._lockParent ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 h-11 px-4 rounded-xl border-2 border-[#2a655f]/40 bg-[#2a655f]/5 dark:bg-[#2a655f]/10", children: editing.parent_id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[#2a655f] truncate", children: mainCategories.find((m) => m.id === editing.parent_id)?.name_ar || "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] ml-auto", children: [
                "🔒 ",
                isRTL ? "مُقفل" : "Locked"
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[#2a655f]", children: isRTL ? "🚫 بدون (تصنيف رئيسي)" : "🚫 None (Main)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] ml-auto", children: [
                "🔒 ",
                isRTL ? "مُقفل" : "Locked"
              ] })
            ] }) }) : (
              /* ✅ الحالة العادية: dropdown مفتوح */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: editing.parent_id || "__none__",
                  onValueChange: (value) => {
                    setEditing({
                      ...editing,
                      parent_id: value === "__none__" ? null : value
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      editing.parent_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-4 w-4 text-[#d81b60]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4 text-[#2a655f]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "اختر..." : "Select..." })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-gray-300 dark:border-gray-600 max-h-[300px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", className: "hover:bg-[#2a655f]/10 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4 text-[#2a655f]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: isRTL ? "🚫 بدون (تصنيف رئيسي)" : "🚫 None (Main)" })
                      ] }) }),
                      mainCategories.filter((m) => m.id !== editing.id).map((main) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectItem,
                        {
                          value: main.id,
                          className: "hover:bg-[#d81b60]/10 cursor-pointer",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: getIconEmoji(main.icon) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: main.name_ar })
                          ] })
                        },
                        main.id
                      ))
                    ] })
                  ]
                }
              )
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
              "flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-300",
              editing.parent_id ? "bg-[#d81b60]/5 border-[#d81b60]/30" : "bg-[#2a655f]/5 border-[#2a655f]/30"
            ), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: cn(
                "h-4 w-4 flex-shrink-0",
                editing.parent_id ? "text-[#d81b60]" : "text-[#2a655f]"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(
                "text-xs font-medium",
                editing.parent_id ? "text-[#d81b60]" : "text-[#2a655f]"
              ), children: [
                editing._mode === "add-sub-from-row" && (isRTL ? "📌 إضافة فرعي تحت التصنيف المُحدَّد" : "📌 Add sub under selected parent"),
                editing._mode === "add-sub-from-header" && !editing.parent_id && (isRTL ? "⚠️ اختر التصنيف الأب للتصنيف الفرعي" : "⚠️ Select parent for the subcategory"),
                editing._mode === "add-sub-from-header" && editing.parent_id && (isRTL ? "📂 سيتم إنشاء تصنيف فرعي" : "📂 Will create a subcategory"),
                editing._mode === "add-main" && (isRTL ? "📁 سيتم إنشاء تصنيف رئيسي" : "📁 Will create a main category"),
                editing._mode === "edit-main" && (isRTL ? "📁 تعديل تصنيف رئيسي" : "📁 Edit main category"),
                editing._mode === "edit-sub" && (isRTL ? "📂 تعديل تصنيف فرعي" : "📂 Edit subcategory")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📝" }),
                isRTL ? "الاسم بالعربية *" : "Arabic Name *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editing.name_ar,
                  onChange: (e) => setEditing({ ...editing, name_ar: e.target.value }),
                  placeholder: isRTL ? "مثلاً: أزياء" : "e.g. Fashion",
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🌐" }),
                isRTL ? "الاسم بالإنكليزية *" : "English Name *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editing.name_en,
                  onChange: (e) => setEditing({ ...editing, name_en: e.target.value }),
                  dir: "ltr",
                  placeholder: "e.g. Fashion",
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4" }),
              "Slug ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#d81b60]", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editing.slug,
                onChange: (e) => setEditing({
                  ...editing,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                }),
                dir: "ltr",
                placeholder: "fashion",
                className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4" }),
                isRTL ? "الأيقونة" : "Icon"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                IconDropdown,
                {
                  value: editing.icon || "",
                  onChange: (value) => setEditing({ ...editing, icon: value }),
                  lang: app.lang,
                  searchTerm: iconSearchTerm,
                  onSearchChange: setIconSearchTerm
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }),
                isRTL ? "الترتيب" : "Sort Order"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: editing.sort_order ?? 0,
                  onChange: (e) => setEditing({ ...editing, sort_order: Number(e.target.value) }),
                  className: "rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }),
              isRTL ? "صورة التصنيف" : "Category Image"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageInput,
              {
                folder: "uploads/categories",
                value: editing.image_url || "",
                onChange: (value) => setEditing({ ...editing, image_url: value }),
                userId: app.user?.id,
                lang: app.lang,
                label: isRTL ? "ارفع صورة" : "Upload image",
                hint: isRTL ? "صورة احترافية 1200×800" : "Professional image 1200×800",
                previewClassName: "aspect-video h-auto rounded-xl border border-gray-300 dark:border-gray-600"
              }
            )
          ] }),
          !editing.parent_id && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-300 dark:border-gray-600 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-[#2a655f] dark:text-slate-300 cursor-pointer p-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-[#2a655f]/60 transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: editing.is_featured ?? false,
                  onChange: (e) => setEditing({ ...editing, is_featured: e.target.checked }),
                  className: "h-4 w-4 rounded border-gray-300 accent-yellow-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-4 w-4", editing.is_featured ? "text-yellow-500 fill-yellow-400" : "text-slate-400") }),
                isRTL ? "تصنيف مميز (يظهر في الرئيسية)" : "Featured Category (Homepage)"
              ] })
            ] }),
            editing.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border-2 border-yellow-200/50 dark:border-yellow-800/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-2 text-[#2a655f]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }),
                isRTL ? "ترتيب المميز" : "Featured Order"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: editing.featured_sort ?? 0,
                  onChange: (e) => setEditing({ ...editing, featured_sort: Number(e.target.value) }),
                  className: "mt-1.5 rounded-xl border-yellow-200/50 bg-white/50 dark:border-yellow-800/30 dark:bg-slate-900/50"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 text-sm font-medium text-[#2a655f] dark:text-slate-300 cursor-pointer p-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-[#2a655f]/60 transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: editing.active ?? true,
                onChange: (e) => setEditing({ ...editing, active: e.target.checked }),
                className: "h-4 w-4 rounded border-gray-300 accent-[#2a655f]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[#2a655f]" }),
              isRTL ? "مفعّل ويظهر للجميع" : "Active & visible"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t border-gray-300 dark:border-gray-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setEditing(null),
              className: "flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100/70 text-slate-600 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                isRTL ? "إلغاء" : "Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: save.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0",
              children: save.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isRTL ? "جاري الحفظ..." : "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "حفظ" : "Save"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100/70 z-20 border border-gray-300 dark:border-gray-600",
          onClick: () => setDeleteDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-rose-600 dark:text-rose-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "حذف التصنيف" : "Delete Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isRTL ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-700 dark:text-rose-300 font-medium", children: isRTL ? `هل أنت متأكد من حذف "${categoryToDelete?.name_ar}"؟` : `Delete "${categoryToDelete?.name_en}"?` }) }),
        categoryToDelete && childrenMap[categoryToDelete.id]?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRTL ? `⚠️ لهذا التصنيف ${childrenMap[categoryToDelete.id].length} تصنيف فرعي` : `⚠️ This has ${childrenMap[categoryToDelete.id].length} subcategories` })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setDeleteDialogOpen(false),
              className: "flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100/70 text-slate-600 transition-all duration-300",
              children: isRTL ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleDelete,
              disabled: del.isPending,
              className: "flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 border-0",
              children: del.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isRTL ? "جاري الحذف..." : "Deleting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "تأكيد الحذف" : "Confirm Delete"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      ` })
  ] });
}
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root$1.displayName;
const ICON_MAP = {
  "clock": Clock,
  "check-circle": CircleCheckBig,
  "x-circle": CircleX,
  "store": Store,
  "package": Package,
  "sparkles": Sparkles,
  "megaphone": Megaphone,
  "gift": Gift,
  "trending-up": TrendingUp,
  "calendar": Calendar$1,
  "globe": Globe,
  "settings": Settings,
  "bell": Bell
};
const getNotificationConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};
const StatsCards$2 = React__default.memo(({ stats, isArabic }) => {
  const items = [
    {
      key: "total",
      label: isArabic ? "📊 الإجمالي" : "📊 Total",
      value: stats?.total || 0,
      icon: Bell,
      color: "text-[#2a655f]",
      gradient: "from-[#2a655f] to-[#f9a8d4]"
    },
    {
      key: "sent",
      label: isArabic ? "✅ مرسلة" : "✅ Sent",
      value: stats?.read || 0,
      icon: CircleCheckBig,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      key: "unread",
      label: isArabic ? "📬 غير مقروءة" : "📬 Unread",
      value: stats?.unread || 0,
      icon: Clock,
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      key: "scheduled",
      label: isArabic ? "📅 مجدولة" : "📅 Scheduled",
      value: stats?.scheduled || 0,
      icon: Calendar$1,
      color: "text-[#d81b60]",
      gradient: "from-[#d81b60] to-[#f9a8d4]"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white mt-1", children: item.value })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: cn("h-5 w-5", item.color) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 animate-shimmer`,
            style: { width: `${Math.min(100, item.value / (stats?.total || 1) * 100)}%` }
          }
        ) })
      ]
    },
    item.key
  )) });
});
StatsCards$2.displayName = "StatsCards";
function AdminNotifications() {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const fileInputRef = reactExports.useRef(null);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = reactExports.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = reactExports.useState(false);
  const [selectedNotification, setSelectedNotification] = reactExports.useState(null);
  const [isSending, setIsSending] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    title_ar: "",
    title_en: "",
    body_ar: "",
    body_en: "",
    type: NOTIFICATION_TYPES.ANNOUNCEMENT,
    target: "all",
    governorate_ids: [],
    specific_users: [],
    link_url: "",
    image_url: "",
    image_file: null,
    scheduled_for: ""
  });
  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 10 });
  const { data: stats, refetch: refetchStats } = useUserNotificationsStats(app.user?.id);
  const sendBulkNotification = useSendBulkNotificationsV2();
  const deleteNotification = useDeleteNotificationV2();
  const markRead = useMarkNotificationReadV2();
  const [governorates, setGovernorates] = reactExports.useState([]);
  const [allUsers, setAllUsers] = reactExports.useState([]);
  const [filteredUsers, setFilteredUsers] = reactExports.useState([]);
  const [usersSearch, setUsersSearch] = reactExports.useState("");
  const [usersFilterGovernorate, setUsersFilterGovernorate] = reactExports.useState("all");
  const [usersFilterRole, setUsersFilterRole] = reactExports.useState("all");
  const [isLoadingUsers, setIsLoadingUsers] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetchGovernorates();
    fetchAllUsers();
  }, []);
  const fetchGovernorates = async () => {
    const { data, error } = await supabase.from("governorates").select("id, name_ar, name_en").order("sort_order");
    if (!error && data) {
      setGovernorates(data);
    }
  };
  const fetchAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data: profiles, error: profilesError } = await supabase.from("profiles").select("id, full_name, phone, avatar_url, store_name, governorate_id");
      if (profilesError) throw profilesError;
      const { data: sellers, error: sellersError } = await supabase.from("user_roles").select("user_id").eq("role", "seller");
      if (sellersError) throw sellersError;
      const sellerIds = new Set(sellers?.map((s) => s.user_id) || []);
      const governorateMap = /* @__PURE__ */ new Map();
      governorates.forEach((g) => governorateMap.set(g.id, g));
      const users = (profiles || []).map((p) => ({
        ...p,
        governorate_name: governorateMap.get(p.governorate_id)?.name_ar || "",
        is_seller: sellerIds.has(p.id)
      }));
      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };
  reactExports.useEffect(() => {
    let result = allUsers;
    if (usersSearch.trim()) {
      const q = usersSearch.toLowerCase().trim();
      result = result.filter(
        (u) => u.full_name?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q) || u.store_name?.toLowerCase().includes(q)
      );
    }
    if (usersFilterGovernorate !== "all") {
      result = result.filter((u) => u.governorate_id === usersFilterGovernorate);
    }
    if (usersFilterRole === "seller") {
      result = result.filter((u) => u.is_seller === true);
    } else if (usersFilterRole === "customer") {
      result = result.filter((u) => u.is_seller !== true);
    }
    setFilteredUsers(result);
  }, [allUsers, usersSearch, usersFilterGovernorate, usersFilterRole]);
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `notifications/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("public").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("public").getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl || "";
      setFormData({ ...formData, image_url: publicUrl, image_file: file });
      setImagePreview(URL.createObjectURL(file));
      toast.success(isRTL ? "✅ تم رفع الصورة بنجاح" : "✅ Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(isRTL ? "❌ فشل رفع الصورة" : "❌ Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  const removeImage = () => {
    setFormData({ ...formData, image_url: "", image_file: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const filteredNotifications = reactExports.useMemo(() => {
    let result = notifications;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) => n.title_ar?.toLowerCase().includes(q) || n.title_en?.toLowerCase().includes(q) || n.body_ar?.toLowerCase().includes(q) || n.body_en?.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") {
      result = result.filter((n) => n.type === filterType);
    }
    if (activeTab === "sent") {
      result = result.filter((n) => n.is_sent === true);
    } else if (activeTab === "scheduled") {
      result = result.filter((n) => n.scheduled_for && !n.is_sent);
    } else if (activeTab === "draft") {
      result = result.filter((n) => !n.is_sent && !n.scheduled_for);
    }
    return result;
  }, [notifications, searchQuery, filterType, activeTab]);
  const handleSendNotification = async () => {
    if (!formData.title_ar || !formData.body_ar) {
      toast.error(isRTL ? "⚠️ الرجاء ملء العنوان والمحتوى بالعربية" : "⚠️ Please fill title and body in Arabic");
      return;
    }
    setIsSending(true);
    try {
      let userIds = [];
      if (formData.target === "all") {
        const { data: allUsers2 } = await supabase.from("profiles").select("id");
        userIds = allUsers2?.map((u) => u.id) || [];
      } else if (formData.target === "customers") {
        const { data: sellers } = await supabase.from("user_roles").select("user_id").eq("role", "seller");
        const sellerIds = new Set(sellers?.map((s) => s.user_id) || []);
        const { data: allUsers2 } = await supabase.from("profiles").select("id");
        userIds = allUsers2?.filter((u) => !sellerIds.has(u.id)).map((u) => u.id) || [];
      } else if (formData.target === "sellers") {
        const { data: sellers } = await supabase.from("user_roles").select("user_id").eq("role", "seller");
        userIds = sellers?.map((s) => s.user_id) || [];
      } else if (formData.target === "governorate" && formData.governorate_ids.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id").in("governorate_id", formData.governorate_ids);
        userIds = profiles?.map((p) => p.id) || [];
      } else if (formData.target === "specific" && formData.specific_users.length > 0) {
        userIds = formData.specific_users.map((u) => u.id);
      } else if (formData.target === "new_users") {
        const thirtyDaysAgo = /* @__PURE__ */ new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: newUsers } = await supabase.from("profiles").select("id").gte("created_at", thirtyDaysAgo.toISOString());
        userIds = newUsers?.map((u) => u.id) || [];
      } else if (formData.target === "active_users") {
        const sevenDaysAgo = /* @__PURE__ */ new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: activeUsers } = await supabase.from("profiles").select("id").gte("last_seen_at", sevenDaysAgo.toISOString());
        userIds = activeUsers?.map((u) => u.id) || [];
      }
      if (userIds.length === 0) {
        toast.warning(isRTL ? "⚠️ لا يوجد مستلمون لهذا الهدف" : "⚠️ No recipients found for this target");
        setIsSending(false);
        return;
      }
      sendBulkNotification.mutateAsync({
        userIds,
        type: formData.type,
        titleAr: formData.title_ar,
        bodyAr: formData.body_ar,
        titleEn: formData.title_en || formData.title_ar,
        bodyEn: formData.body_en || formData.body_ar,
        linkUrl: formData.link_url || null,
        imageUrl: formData.image_url || null,
        metadata: {
          target: formData.target,
          governorate_ids: formData.governorate_ids,
          scheduled_for: formData.scheduled_for || null
        }
      }).then(() => {
        toast.success(
          isRTL ? `✅ تم إرسال الإشعار إلى ${userIds.length} مستخدم` : `✅ Notification sent to ${userIds.length} users`
        );
        refetchNotifications();
        refetchStats();
      }).catch((error) => {
        console.error("Error sending notification:", error);
        toast.error(isRTL ? "❌ فشل إرسال الإشعار" : "❌ Failed to send notification");
      });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success(
        isRTL ? `✅ جاري إرسال الإشعار إلى ${userIds.length} مستخدم...` : `✅ Sending notification to ${userIds.length} users...`
      );
    } catch (error) {
      console.error("Error preparing notification:", error);
      toast.error(isRTL ? "❌ فشل تجهيز الإشعار" : "❌ Failed to prepare notification");
    } finally {
      setIsSending(false);
    }
  };
  const resetForm = () => {
    setFormData({
      title_ar: "",
      title_en: "",
      body_ar: "",
      body_en: "",
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      target: "all",
      governorate_ids: [],
      specific_users: [],
      link_url: "",
      image_url: "",
      image_file: null,
      scheduled_for: ""
    });
    setImagePreview(null);
    setUsersSearch("");
    setUsersFilterGovernorate("all");
    setUsersFilterRole("all");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleDelete = async (id) => {
    if (!confirm(isRTL ? "هل أنت متأكد من حذف هذا الإشعار؟" : "Are you sure you want to delete this notification?")) return;
    try {
      await deleteNotification.mutateAsync({
        notificationId: id,
        userId: app.user.id
      });
      toast.success(isRTL ? "✅ تم حذف الإشعار" : "✅ Notification deleted");
      refetchNotifications();
      refetchStats();
    } catch (error) {
      toast.error(isRTL ? "❌ فشل حذف الإشعار" : "❌ Failed to delete notification");
    }
  };
  const handleMarkRead = async (id, isRead) => {
    try {
      if (!isRead) {
        await markRead.mutateAsync({
          notificationId: id,
          userId: app.user.id
        });
        refetchNotifications();
        refetchStats();
      }
    } catch (error) {
      toast.error(isRTL ? "❌ فشل تحديث الحالة" : "❌ Failed to update status");
    }
  };
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(
      app.lang === "ar" ? "ar-SA" : "en-US",
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };
  const getTargetLabel = (target) => {
    const labels = {
      all: { ar: "الجميع", en: "All Users" },
      customers: { ar: "العملاء", en: "Customers" },
      sellers: { ar: "البائعين", en: "Sellers" },
      specific: { ar: "مستخدمين محددين", en: "Specific Users" },
      governorate: { ar: "حسب المحافظة", en: "By Governorate" },
      new_users: { ar: "مستخدمين جدد", en: "New Users" },
      active_users: { ar: "مستخدمين نشطين", en: "Active Users" }
    };
    return isRTL ? labels[target]?.ar || target : labels[target]?.en || target;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", dir: isRTL ? "rtl" : "ltr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isRTL ? "الإشعارات" : "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isRTL ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: stats?.total || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "إجمالي" : "total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: stats?.read || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "مرسلة" : "sent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-amber-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: stats?.unread || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isRTL ? "غير مقروءة" : "unread" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => {
              refetchNotifications();
              refetchStats();
            },
            className: "rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
            onClick: () => setIsCreateDialogOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
              isRTL ? "إشعار جديد" : "New Notification"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          isRTL ? "لوحة تحكم" : "Dashboard"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCards$2, { stats, isArabic: isRTL }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: isRTL ? "🔍 بحث في الإشعارات..." : "🔍 Search notifications...",
            className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterType, onValueChange: setFilterType, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "النوع" : "Type" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "📋 ",
            isRTL ? "جميع الأنواع" : "All Types"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.ANNOUNCEMENT, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "📢 ",
            isRTL ? "إعلان" : "Announcement"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.PROMOTION, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "🎯 ",
            isRTL ? "ترويجي" : "Promotion"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.OFFER, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "🎁 ",
            isRTL ? "عرض خاص" : "Special Offer"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.MARKETING, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "📊 ",
            isRTL ? "تسويقي" : "Marketing"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.SYSTEM, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "⚙️ ",
            isRTL ? "نظام" : "System"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm", children: [
        { id: "all", label: isRTL ? "الكل" : "All" },
        { id: "sent", label: isRTL ? "مرسلة" : "Sent" },
        { id: "scheduled", label: isRTL ? "مجدولة" : "Scheduled" },
        { id: "draft", label: isRTL ? "مسودات" : "Drafts" }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: activeTab === tab.id ? "default" : "ghost",
          size: "sm",
          onClick: () => setActiveTab(tab.id),
          className: cn(
            "rounded-lg transition-all duration-300 h-9 px-4",
            activeTab === tab.id ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0" : "text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200"
          ),
          children: tab.label
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setFilterType("all");
            setActiveTab("all");
          },
          className: "h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isRTL ? "مسح الكل" : "Clear All"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الإشعار" : "Notification"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "النوع" : "Type"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "المستهدفين" : "Target"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isRTL ? "التاريخ" : "Date"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            isRTL ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredNotifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: isRTL ? "لا توجد إشعارات" : "No notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "ابدأ بإنشاء أول إشعار لك" : "Start by creating your first notification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setIsCreateDialogOpen(true),
              className: "mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
                isRTL ? "إنشاء إشعار" : "Create Notification"
              ]
            }
          )
        ] }) }) }) : filteredNotifications.map((notification) => {
          const config = getNotificationConfig(notification.type);
          const Icon = ICON_MAP[config.icon] || Bell;
          const isSent = notification.is_sent === true;
          const isScheduled = notification.scheduled_for && !isSent;
          const isRead = notification.is_read === true;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: cn(
                "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
                !isRead && isSent ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                    "p-2 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border-2 border-slate-200 dark:border-slate-700",
                    config.color
                  ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: isRTL ? notification.title_ar : notification.title_en || notification.title_ar }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 truncate", children: isRTL ? notification.body_ar : notification.body_en || notification.body_ar }),
                    !isRead && isSent && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 text-[10px] bg-[#d81b60] text-white rounded-full px-2 py-0 animate-pulse border-2 border-white/30", children: isRTL ? "جديد" : "New" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center py-3 border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(
                  "border-2 px-3 py-1 whitespace-nowrap hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors",
                  config.color
                ), children: isRTL ? config.ar : config.en }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center py-3 border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 rounded-xl whitespace-nowrap hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: getTargetLabel(notification.metadata?.target || "all") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center py-3 border-r-2 border-slate-200/60 dark:border-slate-700/60", children: isSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20 rounded-xl whitespace-nowrap hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "مرسل" : "Sent"
                ] }) : isScheduled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-2 border-amber-500/20 rounded-xl whitespace-nowrap hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "مجدول" : "Scheduled"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-600 rounded-xl whitespace-nowrap hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
                  isRTL ? "مسودة" : "Draft"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center py-3 border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500 whitespace-nowrap", children: notification.sent_at ? formatDate(notification.sent_at) : notification.scheduled_for ? formatDate(notification.scheduled_for) : formatDate(notification.created_at) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => {
                        setSelectedNotification(notification);
                        setIsViewDialogOpen(true);
                      },
                      className: "rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
                      title: isRTL ? "عرض التفاصيل" : "View details",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                    }
                  ),
                  isSent && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => handleMarkRead(notification.id, isRead),
                      className: "rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
                      title: isRTL ? isRead ? "تحديد كغير مقروء" : "تحديد كمقروء" : isRead ? "Mark as unread" : "Mark as read",
                      children: isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-slate-600" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-red-300 hover:text-red-500 transition-all duration-300 hover:scale-105",
                      onClick: () => handleDelete(notification.id),
                      title: isRTL ? "حذف" : "Delete",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                    }
                  )
                ] }) })
              ]
            },
            notification.id
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: isRTL ? `عرض ${filteredNotifications.length} من ${notifications.length}` : `Showing ${filteredNotifications.length} of ${notifications.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: isRTL ? `إجمالي ${notifications.length}` : `Total ${notifications.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            activeTab === "all" && (isRTL ? "جميع" : "All"),
            activeTab === "sent" && (isRTL ? "مرسلة" : "Sent"),
            activeTab === "scheduled" && (isRTL ? "مجدولة" : "Scheduled"),
            activeTab === "draft" && (isRTL ? "مسودات" : "Drafts")
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            searchQuery
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setIsCreateDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-[#f9a8d4]/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "إنشاء إشعار جديد" : "Create New Notification" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "املأ البيانات لإرسال إشعار للمستخدمين المستهدفين" : "Fill in the details to send a notification to target users" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1", children: [
                isRTL ? "العنوان (عربي)" : "Title (Arabic)",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.title_ar,
                  onChange: (e) => setFormData({ ...formData, title_ar: e.target.value }),
                  placeholder: isRTL ? "أدخل عنوان الإشعار" : "Enter notification title",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "العنوان (إنجليزي)" : "Title (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.title_en,
                  onChange: (e) => setFormData({ ...formData, title_en: e.target.value }),
                  placeholder: "Enter notification title",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300",
                  dir: "ltr"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1", children: [
                isRTL ? "المحتوى (عربي)" : "Content (Arabic)",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: formData.body_ar,
                  onChange: (e) => setFormData({ ...formData, body_ar: e.target.value }),
                  placeholder: isRTL ? "أدخل محتوى الإشعار" : "Enter notification content",
                  rows: 4,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300 resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "المحتوى (إنجليزي)" : "Content (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: formData.body_en,
                  onChange: (e) => setFormData({ ...formData, body_en: e.target.value }),
                  placeholder: "Enter notification content",
                  rows: 4,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300 resize-none",
                  dir: "ltr"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-pink-400/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "نوع الإشعار" : "Notification Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.type,
                onValueChange: (value) => setFormData({ ...formData, type: value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "اختر النوع" : "Select type" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.ANNOUNCEMENT, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "📢 ",
                      isRTL ? "إعلان" : "Announcement"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.PROMOTION, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "🎯 ",
                      isRTL ? "ترويجي" : "Promotion"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.OFFER, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "🎁 ",
                      isRTL ? "عرض خاص" : "Special Offer"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.MARKETING, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "📊 ",
                      isRTL ? "تسويقي" : "Marketing"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.EVENT, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "📅 ",
                      isRTL ? "حدث" : "Event"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.NEWS, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "📰 ",
                      isRTL ? "أخبار" : "News"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.ORDER_UPDATE, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "📦 ",
                      isRTL ? "تحديث طلب" : "Order Update"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: NOTIFICATION_TYPES.SYSTEM, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "⚙️ ",
                      isRTL ? "نظام" : "System"
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "المستهدفين" : "Target Audience" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.target,
                onValueChange: (value) => setFormData({ ...formData, target: value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "اختر الفئة المستهدفة" : "Select target audience" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "🌍 ",
                      isRTL ? "الجميع" : "All Users"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "customers", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "🛒 ",
                      isRTL ? "العملاء" : "Customers"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "sellers", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "🏪 ",
                      isRTL ? "البائعين" : "Sellers"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "new_users", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "✨ ",
                      isRTL ? "مستخدمين جدد" : "New Users"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "active_users", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "🔥 ",
                      isRTL ? "مستخدمين نشطين" : "Active Users"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "governorate", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "📍 ",
                      isRTL ? "حسب المحافظة" : "By Governorate"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "specific", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                      "👤 ",
                      isRTL ? "مستخدمين محددين" : "Specific Users"
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          formData.target === "governorate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4 bg-[#f9a8d4]/10 dark:bg-[#f9a8d4]/5 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "اختر المحافظات" : "Select Governorates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: governorates.map((gov) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: formData.governorate_ids.includes(gov.id) ? "default" : "outline",
                className: cn(
                  "cursor-pointer px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 border-2",
                  formData.governorate_ids.includes(gov.id) ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-[#2a655f]/30" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                ),
                onClick: () => {
                  const ids = formData.governorate_ids.includes(gov.id) ? formData.governorate_ids.filter((id) => id !== gov.id) : [...formData.governorate_ids, gov.id];
                  setFormData({ ...formData, governorate_ids: ids });
                },
                children: [
                  isRTL ? gov.name_ar : gov.name_en,
                  formData.governorate_ids.includes(gov.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 ml-1" })
                ]
              },
              gov.id
            )) }),
            formData.governorate_ids.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-500", children: isRTL ? "⚠️ اختر محافظة واحدة على الأقل" : "⚠️ Select at least one governorate" })
          ] }),
          formData.target === "specific" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4 bg-[#f9a8d4]/10 dark:bg-[#f9a8d4]/5 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "اختر المستخدمين" : "Select Users" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] dark:text-[#f9a8d4] border-2 border-pink-400/60 dark:border-pink-400/40 rounded-xl", children: [
                formData.specific_users.length,
                " ",
                isRTL ? "مختار" : "selected"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: usersSearch,
                  onChange: (e) => setUsersSearch(e.target.value),
                  placeholder: isRTL ? "🔍 بحث باسم أو هاتف أو متجر" : "🔍 Search by name, phone or store",
                  className: "flex-1 min-w-[150px] rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: usersFilterGovernorate, onValueChange: setUsersFilterGovernorate, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[140px] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "المحافظة" : "Governorate" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? "كل المحافظات" : "All Governorates" }),
                  governorates.map((gov) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: gov.id, className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? gov.name_ar : gov.name_en }, gov.id))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: usersFilterRole, onValueChange: setUsersFilterRole, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[130px] rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isRTL ? "الدور" : "Role" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? "الكل" : "All" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "seller", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                    "🏪 ",
                    isRTL ? "بائع" : "Seller"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "customer", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                    "🛒 ",
                    isRTL ? "عميل" : "Customer"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    setUsersSearch("");
                    setUsersFilterGovernorate("all");
                    setUsersFilterRole("all");
                  },
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            isLoadingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-[#2a655f]" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[300px] border-2 border-pink-400/60 dark:border-pink-400/40 rounded-xl p-2", children: filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-slate-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isRTL ? "لا يوجد مستخدمين مطابقين" : "No matching users" })
            ] }) : filteredUsers.map((user) => {
              const isSelected = formData.specific_users.some((u) => u.id === user.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] border-2",
                    isSelected ? "border-pink-500 bg-[#f9a8d4]/20" : "border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                  ),
                  onClick: () => {
                    const users = isSelected ? formData.specific_users.filter((u) => u.id !== user.id) : [...formData.specific_users, user];
                    setFormData({ ...formData, specific_users: users });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        checked: isSelected,
                        className: "data-[state=checked]:bg-[#2a655f] data-[state=checked]:border-[#2a655f] border-2 border-slate-300 dark:border-slate-600"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar_url || void 0 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] text-white text-xs", children: user.full_name?.charAt(0) || "U" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate text-slate-900 dark:text-white", children: user.full_name || (isRTL ? "مستخدم" : "User") }),
                        user.is_seller && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5 py-0 border-[#2a655f]/30 text-[#2a655f]", children: [
                          "🏪 ",
                          isRTL ? "بائع" : "Seller"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-400", children: [
                        user.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "📱 ",
                          user.phone
                        ] }),
                        user.store_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "🏷️ ",
                          user.store_name
                        ] }),
                        user.governorate_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "📍 ",
                          user.governorate_name
                        ] })
                      ] })
                    ] }),
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" })
                  ]
                },
                user.id
              );
            }) }),
            formData.specific_users.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-2 pt-2 border-t-2 border-pink-400/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 flex items-center", children: isRTL ? "المختارين:" : "Selected:" }),
              formData.specific_users.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1 px-3 py-1.5 rounded-xl bg-[#f9a8d4]/20 text-[#2a655f] dark:text-[#f9a8d4] border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                user.full_name || user.id.slice(0, 8),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {
                    className: "h-3 w-3 cursor-pointer hover:text-rose-500 transition-colors",
                    onClick: () => {
                      setFormData({
                        ...formData,
                        specific_users: formData.specific_users.filter((u) => u.id !== user.id)
                      });
                    }
                  }
                )
              ] }, user.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-pink-400/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "الصورة (اختياري)" : "Image (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: "image/*",
                  onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  },
                  className: "hidden"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => fileInputRef.current?.click(),
                  disabled: isUploading,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                  children: [
                    isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-1.5" }),
                    isRTL ? "اختر صورة" : "Choose Image"
                  ]
                }
              ),
              formData.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  onClick: removeImage,
                  className: "text-rose-500 hover:text-rose-700 rounded-xl border border-rose-300/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
                    isRTL ? "إزالة" : "Remove"
                  ]
                }
              )
            ] }),
            (imagePreview || formData.image_url) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-48 h-48 rounded-xl overflow-hidden border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: imagePreview || formData.image_url,
                  alt: "Preview",
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg", children: isRTL ? "معاينة" : "Preview" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "رابط الإجراء (اختياري)" : "Action URL (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: formData.link_url,
                onChange: (e) => setFormData({ ...formData, link_url: e.target.value }),
                placeholder: "/products/123",
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: isRTL ? "جدولة الإرسال (اختياري)" : "Schedule Send (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "datetime-local",
                value: formData.scheduled_for,
                onChange: (e) => setFormData({ ...formData, scheduled_for: e.target.value }),
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-pink-400/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setIsCreateDialogOpen(false),
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
                isRTL ? "إلغاء" : "Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSendNotification,
              disabled: isSending || isUploading,
              className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0",
              children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }),
                isRTL ? "جاري الإرسال..." : "Sending..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-1.5" }),
                formData.scheduled_for ? isRTL ? "جدولة" : "Schedule" : isRTL ? "إرسال" : "Send"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isViewDialogOpen, onOpenChange: setIsViewDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[600px] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setIsViewDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-[#f9a8d4]/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isRTL ? "تفاصيل الإشعار" : "Notification Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isRTL ? "جميع معلومات الإشعار في مكان واحد" : "All notification information in one place" })
          ] })
        ] }) }),
        selectedNotification && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "العنوان" : "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg text-slate-900 dark:text-white", children: isRTL ? selectedNotification.title_ar : selectedNotification.title_en || selectedNotification.title_ar })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "المحتوى" : "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 dark:text-slate-300 whitespace-pre-wrap", children: isRTL ? selectedNotification.body_ar : selectedNotification.body_en || selectedNotification.body_ar })
          ] }),
          selectedNotification.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "الصورة" : "Image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: selectedNotification.image_url,
                alt: "Notification",
                className: "rounded-xl max-h-[200px] w-full object-cover border-2 border-pink-400/60 dark:border-pink-400/40"
              }
            )
          ] }),
          selectedNotification.link_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "الرابط" : "Link" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: selectedNotification.link_url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-[#2a655f] hover:underline break-all",
                children: selectedNotification.link_url
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-pink-400/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "النوع" : "Type" }),
              (() => {
                const config = getNotificationConfig(selectedNotification.type);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-2 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", config.color), children: isRTL ? config.ar : config.en });
              })()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "المستهدفين" : "Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] dark:text-[#f9a8d4] border-2 border-pink-400/60 dark:border-pink-400/40 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: getTargetLabel(selectedNotification.metadata?.target || "all") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "الحالة" : "Status" }),
              selectedNotification.is_sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
                isRTL ? "مرسل" : "Sent"
              ] }) : selectedNotification.scheduled_for ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-2 border-amber-500/20 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3 w-3 mr-1" }),
                isRTL ? "مجدول" : "Scheduled"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-600 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
                isRTL ? "مسودة" : "Draft"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "تاريخ الإنشاء" : "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: formatDate(selectedNotification.created_at) })
            ] })
          ] }),
          selectedNotification.metadata?.governorate_ids?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-slate-500", children: isRTL ? "المحافظات" : "Governorates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: selectedNotification.metadata.governorate_ids.map((id) => {
              const gov = governorates.find((g) => g.id === id);
              return gov ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-[#2a655f] dark:text-[#f9a8d4] hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isRTL ? gov.name_ar : gov.name_en }, id) : null;
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-pink-400/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => setIsViewDialogOpen(false),
            className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
              isRTL ? "إغلاق" : "Close"
            ]
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` })
  ] });
}
function AdminDeliveryCompanies() {
  const app = useApp();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedCompany, setSelectedCompany] = reactExports.useState(null);
  const { data: companies = [], isLoading, refetch } = useDeliveryCompanies({ active: void 0 });
  const { data: distributors = [], isLoading: distributorsLoading } = useDistributors({
    companyId: selectedCompany?.id
  });
  const { data: allOrders = [], isLoading: ordersLoading } = useDeliveryOrders(app.user?.id);
  const updateCompany = useUpdateDeliveryCompany();
  useCreateDeliveryCompany();
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = reactExports.useState(false);
  const [showAddCompany, setShowAddCompany] = reactExports.useState(false);
  const [showAddAdmin, setShowAddAdmin] = reactExports.useState(false);
  const [showEditCompany, setShowEditCompany] = reactExports.useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = reactExports.useState(null);
  const [isAddingAdmin, setIsAddingAdmin] = reactExports.useState(false);
  const [isCreatingCompany, setIsCreatingCompany] = reactExports.useState(false);
  const [isEditingCompany, setIsEditingCompany] = reactExports.useState(false);
  const [showAddDistributorDialog, setShowAddDistributorDialog] = reactExports.useState(false);
  const [isAddingDistributor, setIsAddingDistributor] = reactExports.useState(false);
  const [companyTab, setCompanyTab] = reactExports.useState("orders");
  const [orderStatusFilter, setOrderStatusFilter] = reactExports.useState("all");
  const [distributorFilter, setDistributorFilter] = reactExports.useState("all");
  const isArabic = app.lang === "ar";
  const filteredCompanies = companies.filter((company) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameAr = company.name_ar?.toLowerCase() || "";
    const nameEn = company.name_en?.toLowerCase() || "";
    const phone = company.phone || "";
    return nameAr.includes(q) || nameEn.includes(q) || phone.includes(q);
  });
  const getCompanyOrders = (companyId) => {
    return allOrders.filter((o) => o.delivery_company_id === companyId);
  };
  const getCompanyDistributors = (companyId) => {
    return distributors.filter((d) => d.delivery_company_id === companyId);
  };
  const getCompanyStats = (companyId) => {
    const orders = getCompanyOrders(companyId);
    const dists = getCompanyDistributors(companyId);
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const assigned = orders.filter((o) => o.status === "assigned").length;
    const inTransit = orders.filter((o) => o.status === "in_transit").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
    const availableDistributors = dists.filter((d) => d.is_available).length;
    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      cancelled,
      totalRevenue,
      totalDistributors: dists.length,
      availableDistributors,
      completionRate: total > 0 ? Math.round(delivered / total * 100) : 0
    };
  };
  const [companyAdmins, setCompanyAdmins] = reactExports.useState([]);
  const fetchCompanyAdmins = async (companyId) => {
    try {
      const { data: admins, error } = await supabase.from("delivery_company_admins").select(`
          id,
          company_id,
          user_id,
          created_at,
          profiles:user_id (
            id,
            full_name,
            phone,
            avatar_url
          )
        `).eq("company_id", companyId);
      if (error) {
        console.error("❌ Error fetching company admins:", error);
        throw error;
      }
      if (admins && admins.length > 0) {
        const merged = admins.map((admin) => ({
          ...admin.profiles,
          admin_id: admin.id,
          admin_since: admin.created_at,
          role: "delivery_company_admin"
        }));
        setCompanyAdmins(merged);
      } else {
        setCompanyAdmins([]);
      }
    } catch (error) {
      console.error("❌ Error fetching company admins:", error);
      setCompanyAdmins([]);
    }
  };
  const [adminUsers, setAdminUsers] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("role", ["admin", "super_admin", "delivery_company"]);
        if (roles && roles.length > 0) {
          const userIds = roles.map((r) => r.user_id);
          const { data: profiles } = await supabase.from("profiles").select("id, full_name, phone, avatar_url, company_id").in("id", userIds);
          if (profiles) {
            const merged = profiles.map((p) => ({
              ...p,
              role: roles.find((r) => r.user_id === p.id)?.role || "admin"
            }));
            setAdminUsers(merged);
          }
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);
  const handleAddCompany = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const phone = formData.get("phone");
    const password = formData.get("password");
    const name_ar = formData.get("name_ar");
    const name_en = formData.get("name_en");
    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }
    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      return;
    }
    setIsCreatingCompany(true);
    try {
      console.log("🔍 [handleAddCompany] Checking if phone exists:", phone.trim());
      const { data: existingProfile, error: profileCheckError } = await supabase.from("profiles").select("id, full_name, phone").eq("phone", phone.trim()).maybeSingle();
      if (profileCheckError) {
        console.error("❌ [handleAddCompany] Error checking profile:", profileCheckError);
      }
      if (existingProfile) {
        console.log("⚠️ [handleAddCompany] User already exists:", existingProfile);
        toast.error(
          isArabic ? `❌ المستخدم "${existingProfile.full_name || "غير معروف"}" مسجل مسبقاً برقم ${phone}` : `❌ User "${existingProfile.full_name || "Unknown"}" already registered with ${phone}`
        );
        setIsCreatingCompany(false);
        return;
      }
      const fakeEmail = `${phone.trim()}@delivery.com`;
      console.log("🔍 [handleAddCompany] Checking if email exists:", fakeEmail);
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
        filter: {
          email: fakeEmail
        }
      });
      if (listError) {
        console.warn("⚠️ [handleAddCompany] Could not check users list:", listError);
      }
      if (users && users.length > 0) {
        console.log("⚠️ [handleAddCompany] User already exists in auth:", users[0]);
        toast.error(
          isArabic ? `❌ هذا الرقم مسجل مسبقاً في النظام (${phone})` : `❌ This number is already registered in the system (${phone})`
        );
        setIsCreatingCompany(false);
        return;
      }
      console.log("✅ [handleAddCompany] User does not exist, proceeding to create...");
      const response = await fetch("https://jjqgfjpxaxjpyohvcbfi.supabase.co/functions/v1/rapid-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
          password,
          name_ar,
          name_en,
          is_verified: false
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        const errorMsg = data.error || "Failed to create company";
        if (errorMsg.includes("already been registered") || errorMsg.includes("already registered")) {
          toast.error(
            isArabic ? `❌ هذا الرقم مسجل مسبقاً في النظام` : `❌ This number is already registered in the system`
          );
        } else {
          toast.error(
            isArabic ? `❌ فشل إنشاء الشركة: ${errorMsg}` : `❌ Failed to create company: ${errorMsg}`
          );
        }
        setIsCreatingCompany(false);
        return;
      }
      const companyData = data.company;
      toast.success(
        isArabic ? `✅ تم إنشاء الحساب والشركة "${name_ar}" بنجاح
📱 ${phone}
🔑 ${password}` : `✅ Account & Company "${name_en}" created successfully
📱 ${phone}
🔑 ${password}`
      );
      setShowAddCompany(false);
      form.reset();
      await refetch();
      if (companyData?.id) {
        await fetchCompanyAdmins(companyData.id);
      }
    } catch (error) {
      console.error("❌ [handleAddCompany] Error:", error);
      const errorMessage = error.message || String(error);
      if (errorMessage.includes("already been registered") || errorMessage.includes("already registered") || errorMessage.includes("duplicate")) {
        toast.error(
          isArabic ? `❌ هذا الرقم مسجل مسبقاً في النظام` : `❌ This number is already registered in the system`
        );
      } else if (errorMessage.includes("phone") || errorMessage.includes("رقم")) {
        toast.error(
          isArabic ? `❌ رقم الهاتف غير صحيح أو مكرر` : `❌ Invalid or duplicate phone number`
        );
      } else {
        toast.error(
          isArabic ? `❌ حدث خطأ: ${errorMessage}` : `❌ Error: ${errorMessage}`
        );
      }
      setIsCreatingCompany(false);
    } finally {
      setIsCreatingCompany(false);
    }
  };
  const handleAddAdminToCompany = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const phone = formData.get("phone");
    const password = formData.get("password");
    const fullName = formData.get("full_name");
    console.log("🔍 [handleAddAdmin] Starting...");
    console.log("📱 [handleAddAdmin] Phone:", phone);
    console.log("🔑 [handleAddAdmin] Password length:", password?.length || 0);
    console.log("👤 [handleAddAdmin] Full Name:", fullName);
    console.log("🏢 [handleAddAdmin] Company ID:", selectedCompanyId);
    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      console.log("❌ [handleAddAdmin] Invalid phone number");
      return;
    }
    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      console.log("❌ [handleAddAdmin] Invalid password");
      return;
    }
    setIsAddingAdmin(true);
    try {
      const url = `${"https://jjqgfjpxaxjpyohvcbfi.supabase.co"}/functions/v1/create-company-admin`;
      console.log("🌐 [handleAddAdmin] Calling Edge Function:", url);
      const body = JSON.stringify({
        phone: phone.trim(),
        password,
        full_name_ar: fullName || `أدمن ${phone}`,
        full_name_en: `Admin ${phone}`,
        company_id: selectedCompanyId,
        role: "delivery_company"
      });
      console.log("📦 [handleAddAdmin] Request body:", body);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${"sb_publishable_fEPybgejg_mSqpmlDj6rNw_7o67e7nt"}`
        },
        body
      });
      console.log("📡 [handleAddAdmin] Response status:", response.status);
      const result = await response.json();
      console.log("📄 [handleAddAdmin] Response data:", result);
      if (!response.ok || result.error) {
        console.error("❌ [handleAddAdmin] Error from Edge Function:", result.error);
        throw new Error(result.error || "Failed to add admin");
      }
      console.log("✅ [handleAddAdmin] Admin added successfully:", result);
      toast.success(
        isArabic ? `✅ تم إضافة الأدمن بنجاح
📱 الرقم: ${phone}
🔑 كلمة المرور: ${password}` : `✅ Admin added successfully
📱 Phone: ${phone}
🔑 Password: ${password}`
      );
      setShowAddAdmin(false);
      setSelectedCompanyId(null);
      setIsAddingAdmin(false);
      if (selectedCompanyId) {
        console.log("🔄 [handleAddAdmin] Refreshing company admins for:", selectedCompanyId);
        await fetchCompanyAdmins(selectedCompanyId);
      }
      refetch();
    } catch (error) {
      console.error("❌ [handleAddAdmin] Catch error:", error);
      toast.error(isArabic ? `❌ فشل إضافة الأدمن: ${error.message}` : `❌ Failed to add admin: ${error.message}`);
      setIsAddingAdmin(false);
    }
  };
  const handleAddDistributorToCompany = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const phone = formData.get("phone");
    const password = formData.get("password");
    const full_name_ar = formData.get("full_name_ar");
    const full_name_en = formData.get("full_name_en");
    const address_ar = formData.get("address_ar");
    const address_en = formData.get("address_en");
    const governorate_id = formData.get("governorate_id");
    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }
    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      return;
    }
    if (!full_name_ar || full_name_ar.length < 2) {
      toast.error(isArabic ? "❌ الاسم (عربي) مطلوب" : "❌ Name (Arabic) is required");
      return;
    }
    setIsAddingDistributor(true);
    try {
      const response = await fetch(
        `${"https://jjqgfjpxaxjpyohvcbfi.supabase.co"}/functions/v1/create-distributor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${"sb_publishable_fEPybgejg_mSqpmlDj6rNw_7o67e7nt"}`
          },
          body: JSON.stringify({
            phone: phone.trim(),
            password,
            full_name_ar: full_name_ar || `موزع ${phone}`,
            full_name_en: full_name_en || `Distributor ${phone}`,
            address_ar: address_ar || null,
            address_en: address_en || null,
            governorate_id: governorate_id || null,
            company_id: selectedCompanyId
          })
        }
      );
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to add distributor");
      }
      toast.success(
        isArabic ? `✅ تم إضافة الموزع بنجاح
📱 الرقم: ${phone}
🔑 كلمة المرور: ${password}` : `✅ Distributor added successfully
📱 Phone: ${phone}
🔑 Password: ${password}`
      );
      setShowAddDistributorDialog(false);
      setIsAddingDistributor(false);
      refetch();
    } catch (error) {
      console.error("Error adding distributor:", error);
      toast.error(isArabic ? `❌ فشل إضافة الموزع: ${error.message}` : `❌ Failed to add distributor: ${error.message}`);
      setIsAddingDistributor(false);
    }
  };
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const patch = {
      name_ar: formData.get("name_ar"),
      name_en: formData.get("name_en"),
      phone: formData.get("phone"),
      address_ar: formData.get("address_ar"),
      address_en: formData.get("address_en"),
      description_ar: formData.get("description_ar"),
      description_en: formData.get("description_en"),
      base_price: parseFloat(formData.get("base_price")) || 0,
      price_per_km: parseFloat(formData.get("price_per_km")) || 0,
      free_delivery_threshold: parseFloat(formData.get("free_delivery_threshold")) || 0,
      min_delivery_fee: parseFloat(formData.get("min_delivery_fee")) || 0,
      max_delivery_fee: parseFloat(formData.get("max_delivery_fee")) || 15e3,
      avg_delivery_time: parseInt(formData.get("avg_delivery_time")) || 60,
      has_tracking: formData.get("has_tracking") === "on",
      has_insurance: formData.get("has_insurance") === "on",
      has_cod: formData.get("has_cod") === "on",
      has_express: formData.get("has_express") === "on",
      is_active: formData.get("is_active") === "on"
    };
    setIsEditingCompany(true);
    try {
      await updateCompany.mutateAsync({
        id: selectedCompany.id,
        patch
      });
      toast.success(isArabic ? "✅ تم تحديث معلومات الشركة بنجاح" : "✅ Company updated successfully");
      setShowEditCompany(false);
      setIsEditingCompany(false);
      refetch();
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تحديث الشركة" : "❌ Failed to update company");
      setIsEditingCompany(false);
    }
  };
  const handleToggleActive = async (company) => {
    try {
      await updateCompany.mutateAsync({
        id: company.id,
        patch: { is_active: !company.is_active }
      });
      toast.success(
        isArabic ? `✅ تم ${!company.is_active ? "تفعيل" : "تعطيل"} الشركة بنجاح` : `✅ Company ${!company.is_active ? "activated" : "deactivated"} successfully`
      );
      refetch();
    } catch (error) {
      toast.error(isArabic ? "❌ حدث خطأ" : "❌ Error occurred");
    }
  };
  const getAverageRating = (companyId) => {
    const orders = getCompanyOrders(companyId);
    const ratedOrders = orders.filter((o) => o.distributor_rating);
    if (ratedOrders.length === 0) return 0;
    const sum = ratedOrders.reduce((acc, o) => acc + Number(o.distributor_rating || 0), 0);
    return Math.round(sum / ratedOrders.length * 10) / 10;
  };
  reactExports.useEffect(() => {
    if (selectedCompany && isCompanyDialogOpen) {
      fetchCompanyAdmins(selectedCompany.id);
    }
  }, [selectedCompany, isCompanyDialogOpen]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-[#2a655f] border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isArabic ? "شركات التوصيل" : "Delivery Companies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isArabic ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: companies.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "إجمالي" : "total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: companies.filter((c) => c.is_active).length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "نشط" : "active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 hover:bg-rose-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 text-rose-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-600 dark:text-rose-400 font-medium", children: companies.filter((c) => !c.is_active).length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "غير نشط" : "inactive" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-amber-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: companies.filter((c) => c.is_verified === true).length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "موثقة" : "verified" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => refetch(),
            disabled: isLoading,
            className: "rounded-lg h-9 px-3 text-slate-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-slate-800 transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", isLoading && "animate-spin") })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showAddCompany, onOpenChange: setShowAddCompany, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-2 border-[#2a655f]/30 hover:border-[#f9a8d4]/50",
              onClick: () => setShowAddCompany(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
                isArabic ? "إضافة شركة" : "Add Company"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border-2 border-slate-300 dark:border-slate-600",
                onClick: () => setShowAddCompany(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-white", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-[#2a655f]" }),
                  isArabic ? "➕ إضافة شركة توصيل جديدة" : "➕ Add New Delivery Company"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "سيتم إنشاء حساب مدير للشركة تلقائياً" : "A manager account will be created automatically" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddCompany, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name_ar", placeholder: "شركة التوصيل السريع", required: true, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name_en", placeholder: "Fast Delivery Company", className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "رقم الهاتف (للمدير)" : "Phone Number (for Manager)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", type: "tel", placeholder: "09XXXXXXXX", required: true, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "كلمة المرور" : "Password" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "password", type: "password", placeholder: "********", required: true, minLength: 6, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowAddCompany(false), className: "rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                    isArabic ? "إلغاء" : "Cancel"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/40", disabled: isCreatingCompany, children: isCreatingCompany ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "h-4 w-4 mr-1" }),
                    isArabic ? "إنشاء الشركة" : "Create Company"
                  ] }) })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: isArabic ? "بحث عن شركة..." : "Search company...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "pl-9 h-10 border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
        }
      ),
      searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSearchQuery(""),
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    filteredCompanies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-dashed border-pink-400/60 dark:border-pink-400/40 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 flex items-center justify-center mx-auto mb-4 animate-bounce-slow border-2 border-pink-400/60 dark:border-pink-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-10 w-10 text-[#2a655f]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: isArabic ? "لا توجد شركات توصيل" : "No delivery companies" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: searchQuery ? isArabic ? `لا توجد نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"` : isArabic ? "قم بإضافة أول شركة توصيل" : "Add your first delivery company" }),
      !searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "mt-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 hover:scale-105",
          onClick: () => setShowAddCompany(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
            isArabic ? "إضافة شركة" : "Add Company"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredCompanies.map((company) => {
      const stats = getCompanyStats(company.id);
      const rating = getAverageRating(company.id);
      const adminUser = adminUsers.find(
        (u) => u.id === company.created_by && (u.role === "delivery_company" || u.role === "admin" || u.role === "super_admin")
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "group bg-white dark:bg-[#1e293b] cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-pink-500/20 relative overflow-hidden rounded-2xl",
          onClick: () => {
            setSelectedCompany(company);
            setIsCompanyDialogOpen(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/0 via-pink-400/5 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
            company.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-12 w-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#d81b60] to-[#f9a8d4] rounded-bl-2xl shadow-lg shadow-[#d81b60]/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white animate-pulse" })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                company.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: company.logo_url,
                    alt: "",
                    className: "h-12 w-12 rounded-xl object-contain bg-white/50 dark:bg-slate-800/50 p-1 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-pink-400/60 dark:border-pink-400/40"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-[#f9a8d4]/20 dark:bg-[#f9a8d4]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-pink-400/60 dark:border-pink-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-[#2a655f] dark:text-[#f9a8d4]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors duration-300", children: isArabic ? company.name_ar : company.name_en }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: company.is_active ? "bg-emerald-500/20 text-emerald-700 border-2 border-emerald-400/40 text-[10px] animate-pulse" : "bg-red-500/20 text-red-600 border-2 border-red-400/40 text-[10px]",
                        children: company.is_active ? isArabic ? "✅ نشطة" : "✅ Active" : isArabic ? "❌ غير نشطة" : "❌ Inactive"
                      }
                    ),
                    company.is_verified === true ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-700 border-2 border-emerald-400/40 text-[10px] flex items-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-2.5 w-2.5" }),
                      isArabic ? "موثقة" : "Verified"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/20 text-amber-600 border-2 border-amber-400/40 text-[10px] flex items-center gap-0.5 animate-pulse", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-2.5 w-2.5" }),
                      isArabic ? "قيد المراجعة" : "Pending"
                    ] }),
                    rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/20 text-yellow-700 border-2 border-yellow-400/40 text-[10px] flex items-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 fill-yellow-400 text-yellow-400" }),
                      rating
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "h-8 w-8 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300 group-hover:scale-110",
                    onClick: (e) => {
                      e.stopPropagation();
                      setSelectedCompanyId(company.id);
                      setShowAddAdmin(true);
                    },
                    title: isArabic ? "إضافة أدمن" : "Add Admin",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: company.is_active,
                    onCheckedChange: (e) => {
                      e.stopPropagation();
                      handleToggleActive(company);
                    },
                    className: "data-[state=checked]:bg-emerald-500",
                    onClick: (e) => e.stopPropagation()
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/60 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#f9a8d4]/20 transition-colors duration-300 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-[#2a655f] mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-slate-900 dark:text-white", children: stats.total }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "الطلبات" : "Orders" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/60 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#f9a8d4]/20 transition-colors duration-300 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[#2a655f] mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-slate-900 dark:text-white", children: stats.totalDistributors }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "الموزعين" : "Distributors" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/60 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#f9a8d4]/20 transition-colors duration-300 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-yellow-500 mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-slate-900 dark:text-white", children: stats.pending }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "معلقة" : "Pending" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/60 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#f9a8d4]/20 transition-colors duration-300 border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-emerald-500 mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-slate-900 dark:text-white", children: stats.totalRevenue.toLocaleString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground", children: isArabic ? "الإيرادات" : "Revenue" })
                ] })
              ] }),
              adminUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t-2 border-pink-400/30 pt-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 rounded-full bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-2.5 w-2.5 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "المدير:" : "Manager:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#d81b60] transition-colors duration-300", children: adminUser.full_name || adminUser.phone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/60 dark:border-pink-400/40 text-[8px]", children: adminUser.role === "delivery_company" ? isArabic ? "مدير" : "Manager" : adminUser.role === "super_admin" ? isArabic ? "سوبر أدمن" : "Super Admin" : isArabic ? "أدمن" : "Admin" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full max-w-[100px] rounded-full bg-white/60 dark:bg-slate-700 overflow-hidden group-hover:bg-[#f9a8d4]/20 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] transition-all duration-1000",
                      style: { width: `${stats.completionRate}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-[#2a655f] dark:text-[#f9a8d4]", children: [
                    stats.completionRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "text-xs border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300 hover:scale-105 rounded-xl",
                    onClick: (e) => {
                      e.stopPropagation();
                      setSelectedCompany(company);
                      setIsCompanyDialogOpen(true);
                    },
                    children: [
                      isArabic ? "عرض التفاصيل" : "View Details",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: "h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" })
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        company.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddAdmin, onOpenChange: setShowAddAdmin, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 z-20 transition-all duration-300 border-2 border-slate-300",
          onClick: () => setShowAddAdmin(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5 text-emerald-500" }),
            isArabic ? "➕ إضافة أدمن للشركة" : "➕ Add Admin to Company"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "سيتم إنشاء حساب جديد للأدمن برقم هاتف وكلمة مرور" : "A new admin account will be created with phone and password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddAdminToCompany, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الاسم الكامل (اختياري)" : "Full Name (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name", placeholder: isArabic ? "أدمن الشركة" : "Company Admin", className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "رقم الهاتف" : "Phone Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", type: "tel", placeholder: "09XXXXXXXX", required: true, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "كلمة المرور" : "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "password", type: "password", placeholder: "********", required: true, minLength: 6, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowAddAdmin(false), className: "rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
              isArabic ? "إلغاء" : "Cancel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/40", disabled: isAddingAdmin, children: isAddingAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1.5" }),
              isArabic ? "إضافة أدمن" : "Add Admin"
            ] }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddDistributorDialog, onOpenChange: setShowAddDistributorDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 z-20 transition-all duration-300 border-2 border-slate-300",
          onClick: () => setShowAddDistributorDialog(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5 text-emerald-500" }),
            isArabic ? "➕ إضافة موزع للشركة" : "➕ Add Distributor to Company"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "سيتم إنشاء حساب جديد للموزع برقم هاتف وكلمة مرور" : "A new distributor account will be created with phone and password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddDistributorToCompany, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[#2a655f] dark:text-white", children: [
                isArabic ? "الاسم (عربي)" : "Name (Arabic)",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "full_name_ar",
                  placeholder: isArabic ? "أحمد محمد" : "Ahmed",
                  required: true,
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الاسم (إنجليزي)" : "Name (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "full_name_en",
                  placeholder: "Ahmed Mohamad",
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[#2a655f] dark:text-white", children: [
                isArabic ? "رقم الهاتف" : "Phone Number",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "phone",
                  type: "tel",
                  placeholder: "09XXXXXXXX",
                  required: true,
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[#2a655f] dark:text-white", children: [
                isArabic ? "كلمة المرور" : "Password",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "password",
                  type: "password",
                  placeholder: "********",
                  required: true,
                  minLength: 6,
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "6 أحرف على الأقل" : "At least 6 characters" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "address_ar",
                  placeholder: isArabic ? "دمشق" : "Damascus",
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "address_en",
                  placeholder: "Damascus",
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "المحافظة" : "Governorate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "governorate_id",
                  placeholder: isArabic ? "اختر المحافظة" : "Select governorate",
                  className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 p-3 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: isArabic ? `🔗 سيتم ربط الموزع بشركة "${selectedCompany?.name_ar || ""}"` : `🔗 Distributor will be linked to company "${selectedCompany?.name_en || ""}"` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t-2 border-pink-400/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowAddDistributorDialog(false), className: "rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
              isArabic ? "إلغاء" : "Cancel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#2a655f] shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/40",
                disabled: isAddingDistributor,
                children: isAddingDistributor ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1.5" }),
                  isArabic ? "إضافة موزع" : "Add Distributor"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showEditCompany, onOpenChange: setShowEditCompany, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 z-20 transition-all duration-300 border-2 border-slate-300",
          onClick: () => setShowEditCompany(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-[#2a655f] dark:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "✏️ تعديل معلومات الشركة" : "✏️ Edit Company Info"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? `تعديل معلومات شركة "${selectedCompany?.name_ar || selectedCompany?.name_en}"` : `Edit company "${selectedCompany?.name_en || selectedCompany?.name_ar}"` })
        ] }),
        selectedCompany && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateCompany, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[#2a655f] dark:text-white", children: [
                isArabic ? "الاسم (عربي)" : "Name (Arabic)",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name_ar", defaultValue: selectedCompany.name_ar, required: true, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[#2a655f] dark:text-white", children: [
                isArabic ? "الاسم (إنجليزي)" : "Name (English)",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name_en", defaultValue: selectedCompany.name_en, required: true, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الهاتف" : "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", defaultValue: selectedCompany.phone || "", className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "address_ar", defaultValue: selectedCompany.address_ar || "", className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "address_en", defaultValue: selectedCompany.address_en || "", className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الوصف (عربي)" : "Description (Arabic)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "description_ar", defaultValue: selectedCompany.description_ar || "", rows: 2, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الوصف (إنجليزي)" : "Description (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "description_en", defaultValue: selectedCompany.description_en || "", rows: 2, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "السعر الأساسي" : "Base Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "base_price", type: "number", step: "0.01", defaultValue: selectedCompany.base_price || 0, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "السعر لكل كم" : "Price per KM" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "price_per_km", type: "number", step: "0.01", defaultValue: selectedCompany.price_per_km || 0, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الحد الأدنى للتوصيل المجاني" : "Free Delivery Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "free_delivery_threshold", type: "number", step: "0.01", defaultValue: selectedCompany.free_delivery_threshold || 0, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "متوسط وقت التوصيل (دقيقة)" : "Avg Delivery Time (min)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "avg_delivery_time", type: "number", defaultValue: selectedCompany.avg_delivery_time || 60, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الحد الأدنى للتوصيل" : "Min Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "min_delivery_fee", type: "number", step: "0.01", defaultValue: selectedCompany.min_delivery_fee || 0, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white", children: isArabic ? "الحد الأقصى للتوصيل" : "Max Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "max_delivery_fee", type: "number", step: "0.01", defaultValue: selectedCompany.max_delivery_fee || 15e3, className: "border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 rounded-xl transition-all duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_tracking", id: "has_tracking", defaultChecked: selectedCompany.has_tracking, className: "h-4 w-4 rounded border-pink-400/60 text-[#d81b60] focus:ring-pink-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "has_tracking", className: "text-sm text-[#2a655f] dark:text-white", children: isArabic ? "تتبع" : "Tracking" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_insurance", id: "has_insurance", defaultChecked: selectedCompany.has_insurance, className: "h-4 w-4 rounded border-pink-400/60 text-[#d81b60] focus:ring-pink-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "has_insurance", className: "text-sm text-[#2a655f] dark:text-white", children: isArabic ? "تأمين" : "Insurance" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_cod", id: "has_cod", defaultChecked: selectedCompany.has_cod, className: "h-4 w-4 rounded border-pink-400/60 text-[#d81b60] focus:ring-pink-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "has_cod", className: "text-sm text-[#2a655f] dark:text-white", children: isArabic ? "الدفع عند الاستلام" : "Cash on Delivery" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_express", id: "has_express", defaultChecked: selectedCompany.has_express, className: "h-4 w-4 rounded border-pink-400/60 text-[#d81b60] focus:ring-pink-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "has_express", className: "text-sm text-[#2a655f] dark:text-white", children: isArabic ? "توصيل سريع" : "Express" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "is_active", id: "is_active", defaultChecked: selectedCompany.is_active, className: "h-4 w-4 rounded border-pink-400/60 text-[#d81b60] focus:ring-pink-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "is_active", className: "text-sm font-medium text-[#2a655f] dark:text-white", children: isArabic ? "✅ الشركة نشطة" : "✅ Company is active" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setShowEditCompany(false), className: "rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
              isArabic ? "إلغاء" : "Cancel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/40", disabled: isEditingCompany, children: isEditingCompany ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
              isArabic ? "حفظ التغييرات" : "Save Changes"
            ] }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isCompanyDialogOpen, onOpenChange: setIsCompanyDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 z-20 transition-all duration-300 border-2 border-slate-300",
          onClick: () => setIsCompanyDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      selectedCompany && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-3", children: [
          selectedCompany.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: selectedCompany.logo_url,
              alt: "",
              className: "h-10 w-10 rounded-xl object-contain bg-white/50 dark:bg-slate-800/50 p-1 border-2 border-pink-400/60 dark:border-pink-400/40"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-[#f9a8d4]/20 dark:bg-[#f9a8d4]/10 flex items-center justify-center border-2 border-pink-400/60 dark:border-pink-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-[#2a655f] dark:text-white", children: isArabic ? selectedCompany.name_ar : selectedCompany.name_en }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { dir: "ltr", children: selectedCompany.phone }),
              selectedCompany.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail$1, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedCompany.email })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: selectedCompany.is_active ? "bg-emerald-500/20 text-emerald-700 border-2 border-emerald-400/40" : "bg-red-500/20 text-red-600 border-2 border-red-400/40",
                children: selectedCompany.is_active ? isArabic ? "✅ نشطة" : "✅ Active" : isArabic ? "❌ غير نشطة" : "❌ Inactive"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-8 px-3 text-xs border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300 hover:scale-105 rounded-xl",
                onClick: () => {
                  setShowEditCompany(true);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3 mr-1" }),
                  isArabic ? "تعديل" : "Edit"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4", children: [
          { icon: Package, label: isArabic ? "الطلبات" : "Orders", value: getCompanyStats(selectedCompany.id).total, color: "border-[#2a655f]" },
          { icon: Clock, label: isArabic ? "معلقة" : "Pending", value: getCompanyStats(selectedCompany.id).pending, color: "border-yellow-500" },
          { icon: Truck, label: isArabic ? "قيد التوصيل" : "In Transit", value: getCompanyStats(selectedCompany.id).inTransit, color: "border-orange-500" },
          { icon: CircleCheckBig, label: isArabic ? "منجزة" : "Delivered", value: getCompanyStats(selectedCompany.id).delivered, color: "border-emerald-500" },
          { icon: Users, label: isArabic ? "الموزعين" : "Distributors", value: getCompanyStats(selectedCompany.id).totalDistributors, color: "border-purple-500" },
          { icon: DollarSign, label: isArabic ? "الإيرادات" : "Revenue", value: getCompanyStats(selectedCompany.id).totalRevenue.toLocaleString(), color: "border-emerald-500" }
        ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "bg-white dark:bg-[#1e293b] rounded-xl p-3 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
              stat.color && `border-l-8 ${stat.color}`
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: cn(
                "h-5 w-5 mx-auto mb-1 transition-all duration-300",
                stat.color === "border-[#2a655f]" && "text-[#2a655f]",
                stat.color === "border-yellow-500" && "text-yellow-500",
                stat.color === "border-orange-500" && "text-orange-500",
                stat.color === "border-emerald-500" && "text-emerald-500",
                stat.color === "border-purple-500" && "text-purple-500"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-slate-900 dark:text-white", children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: stat.label })
            ]
          },
          stat.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#2a655f] dark:text-[#f9a8d4]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-[#2a655f] dark:text-white", children: isArabic ? "👑 أدمن الشركة" : "👑 Company Admins" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/60 dark:border-pink-400/40 text-[10px]", children: [
                companyAdmins.length,
                " ",
                isArabic ? "أدمن" : "Admins"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-8 px-3 text-xs border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 rounded-xl transition-all duration-300 hover:scale-105",
                onClick: () => {
                  setSelectedCompanyId(selectedCompany.id);
                  setShowAddAdmin(true);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3 w-3 mr-1" }),
                  isArabic ? "إضافة أدمن" : "Add Admin"
                ]
              }
            )
          ] }),
          companyAdmins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: isArabic ? "لا يوجد أدمن لهذه الشركة" : "No admins for this company" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: companyAdmins.map((admin) => {
            const isOwner = admin.id === selectedCompany.created_by;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 p-2.5 bg-white/70 dark:bg-slate-900/70 rounded-lg border-2 border-pink-400/60 dark:border-pink-400/40 hover:shadow-md transition-all hover:border-pink-500",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-[#f9a8d4]/20 flex items-center justify-center overflow-hidden shrink-0 border-2 border-pink-400/60 dark:border-pink-400/40", children: admin.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: admin.avatar_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#2a655f]", children: admin.full_name?.charAt(0) || "U" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate text-slate-900 dark:text-white", children: admin.full_name || admin.phone }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", dir: "ltr", children: admin.phone }),
                      isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/60 dark:border-pink-400/40 text-[8px]", children: [
                        "👑 ",
                        isArabic ? "مالك" : "Owner"
                      ] }),
                      admin.role === "delivery_company_admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-700 border-2 border-emerald-400/40 text-[8px]", children: isArabic ? "مدير" : "Manager" })
                    ] })
                  ] })
                ]
              },
              admin.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: companyTab, onValueChange: (v) => setCompanyTab(v), className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3 bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 rounded-xl p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "orders", className: "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2a655f] data-[state=active]:to-[#f9a8d4] data-[state=active]:text-white rounded-lg transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
              isArabic ? "📦 الطلبات" : "📦 Orders"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "distributors", className: "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2a655f] data-[state=active]:to-[#f9a8d4] data-[state=active]:text-white rounded-lg transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
              isArabic ? "👤 الموزعين" : "👤 Distributors"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "analytics", className: "flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2a655f] data-[state=active]:to-[#f9a8d4] data-[state=active]:text-white rounded-lg transition-all duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
              isArabic ? "📊 التحليلات" : "📊 Analytics"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "orders", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? `عرض ${getCompanyOrders(selectedCompany.id).length} طلب` : `Showing ${getCompanyOrders(selectedCompany.id).length} orders` }) }),
            getCompanyOrders(selectedCompany.id).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: isArabic ? "لا توجد طلبات لهذه الشركة" : "No orders for this company" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-80 overflow-y-auto", children: getCompanyOrders(selectedCompany.id).slice(0, 20).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-white/70 dark:bg-slate-900/70 rounded-lg border-2 border-pink-400/60 dark:border-pink-400/40 hover:shadow-md transition-all hover:border-pink-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/60 dark:border-pink-400/40 text-[10px] font-mono", children: [
                  "#",
                  order.id.slice(0, 8)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(
                  "border-2 text-[10px]",
                  order.status === "pending" && "bg-yellow-500/20 text-yellow-700 border-yellow-400/40",
                  order.status === "assigned" && "bg-blue-500/20 text-blue-700 border-blue-400/40",
                  order.status === "in_transit" && "bg-purple-500/20 text-purple-700 border-purple-400/40",
                  order.status === "delivered" && "bg-emerald-500/20 text-emerald-700 border-emerald-400/40",
                  order.status === "cancelled" && "bg-red-500/20 text-red-600 border-red-400/40"
                ), children: isArabic ? order.status === "pending" ? "معلق" : order.status === "assigned" ? "تم التعيين" : order.status === "in_transit" ? "قيد التوصيل" : order.status === "delivered" ? "تم التوصيل" : order.status === "cancelled" ? "ملغي" : order.status : order.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: formatPrice(Number(order.delivery_fee || 0), app.currency, app.lang) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(order.created_at).toLocaleDateString() })
              ] })
            ] }, order.id)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "distributors", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? `عرض ${getCompanyDistributors(selectedCompany.id).length} موزع` : `Showing ${getCompanyDistributors(selectedCompany.id).length} distributors` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300",
                  onClick: () => {
                    setSelectedCompanyId(selectedCompany.id);
                    setShowAddDistributorDialog(true);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3 w-3 mr-1" }),
                    isArabic ? "إضافة موزع" : "Add Distributor"
                  ]
                }
              )
            ] }),
            getCompanyDistributors(selectedCompany.id).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: isArabic ? "لا يوجد موزعين لهذه الشركة" : "No distributors for this company" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-80 overflow-y-auto", children: getCompanyDistributors(selectedCompany.id).map((dist) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-white/70 dark:bg-slate-900/70 rounded-lg border-2 border-pink-400/60 dark:border-pink-400/40 hover:shadow-md transition-all hover:border-pink-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-[#f9a8d4]/20 flex items-center justify-center border-2 border-pink-400/60 dark:border-pink-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: dist.full_name_ar || dist.full_name_en || dist.phone }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", dir: "ltr", children: dist.phone })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(
                  "border-2 text-[10px]",
                  dist.is_available ? "bg-emerald-500/20 text-emerald-700 border-emerald-400/40" : "bg-red-500/20 text-red-600 border-red-400/40"
                ), children: dist.is_available ? isArabic ? "✅ متاح" : "✅ Available" : isArabic ? "❌ غير متاح" : "❌ Unavailable" }),
                dist.completed_orders > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/20 text-blue-700 border-2 border-blue-400/40 text-[10px]", children: [
                  dist.completed_orders,
                  " ",
                  isArabic ? "طلب" : "orders"
                ] })
              ] })
            ] }, dist.id)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-[#2a655f] dark:text-white mb-2", children: isArabic ? "📊 إحصائيات الطلبات" : "📊 Order Statistics" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-[#fbcfe8]/40 dark:bg-[#fbcfe8]/10 rounded-lg border border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الإجمالي" : "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getCompanyStats(selectedCompany.id).total })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "معلق" : "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-yellow-600", children: getCompanyStats(selectedCompany.id).pending })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "قيد التوصيل" : "In Transit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-purple-600", children: getCompanyStats(selectedCompany.id).inTransit })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "تم التوصيل" : "Delivered" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600", children: getCompanyStats(selectedCompany.id).delivered })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "ملغي" : "Cancelled" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-red-600", children: getCompanyStats(selectedCompany.id).cancelled })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/10 rounded-lg border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "نسبة الإنجاز" : "Completion Rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#2a655f]", children: [
                    getCompanyStats(selectedCompany.id).completionRate,
                    "%"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-[#2a655f] dark:text-white mb-2", children: isArabic ? "💰 الإيرادات" : "💰 Revenue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/10 rounded-lg border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "إجمالي الإيرادات" : "Total Revenue" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-600 text-lg", children: formatPrice(getCompanyStats(selectedCompany.id).totalRevenue, app.currency, app.lang) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-[#fbcfe8]/40 dark:bg-[#fbcfe8]/10 rounded-lg border border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "متوسط سعر التوصيل" : "Avg Delivery Fee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getCompanyStats(selectedCompany.id).total > 0 ? formatPrice(Math.round(getCompanyStats(selectedCompany.id).totalRevenue / getCompanyStats(selectedCompany.id).total), app.currency, app.lang) : formatPrice(0, app.currency, app.lang) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-[#fbcfe8]/40 dark:bg-[#fbcfe8]/10 rounded-lg border border-pink-400/60 dark:border-pink-400/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الموزعين" : "Distributors" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getCompanyStats(selectedCompany.id).totalDistributors })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: isArabic ? "الموزعين المتاحين" : "Available" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600", children: getCompanyStats(selectedCompany.id).availableDistributors })
                ] })
              ] })
            ] })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
      ` })
  ] });
}
async function fetchPromoCodesPaginated({
  page = 0,
  limit = 20,
  search = "",
  filterType = "all",
  filterStatus = "all"
}) {
  const from = page * limit;
  const to = from + limit - 1;
  let query = supabase.from("promo_codes").select("*", { count: "exact" });
  if (search.trim()) {
    const s = `%${search.trim()}%`;
    query = query.or(`code.ilike.${s},label.ilike.${s},description.ilike.${s}`);
  }
  if (filterType !== "all") {
    query = query.eq("type", filterType);
  }
  if (filterStatus !== "all") {
    if (filterStatus === "active") {
      query = query.eq("is_active", true);
    } else if (filterStatus === "inactive") {
      query = query.eq("is_active", false);
    } else if (filterStatus === "expired") {
      query = query.lt("expires_at", (/* @__PURE__ */ new Date()).toISOString());
    }
  }
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw error;
  return { data: data || [], total: count || 0 };
}
async function getPromoCodesStatsOptimized() {
  const { count: total } = await supabase.from("promo_codes").select("*", { count: "exact", head: true });
  const { count: active } = await supabase.from("promo_codes").select("*", { count: "exact", head: true }).eq("is_active", true);
  const { count: expired } = await supabase.from("promo_codes").select("*", { count: "exact", head: true }).lt("expires_at", (/* @__PURE__ */ new Date()).toISOString());
  const { count: used } = await supabase.from("promo_codes").select("*", { count: "exact", head: true }).gt("used_count", 0);
  return {
    total: total || 0,
    active: active || 0,
    expired: expired || 0,
    used: used || 0
  };
}
async function createPromoCode(data) {
  const { data: result, error } = await supabase.from("promo_codes").insert({
    code: data.code?.toUpperCase().trim(),
    label: data.label?.trim(),
    description: data.description?.trim() || null,
    type: data.type,
    value: data.value,
    min_order: data.min_order || 0,
    max_discount: data.max_discount || null,
    usage_limit: data.usage_limit || 1,
    is_active: data.is_active ?? true,
    is_public: data.is_public ?? false,
    is_auto_applied: data.is_auto_applied ?? false,
    starts_at: data.starts_at || (/* @__PURE__ */ new Date()).toISOString(),
    expires_at: data.expires_at || null,
    created_by: data.created_by || null,
    metadata: data.metadata || {},
    store_id: data.store_id || null,
    store_name: data.store_name || null,
    store_ids: data.store_ids || []
  }).select().single();
  if (error) throw error;
  return result;
}
async function updatePromoCode(id, data) {
  const { data: result, error } = await supabase.from("promo_codes").update({
    code: data.code?.toUpperCase().trim(),
    label: data.label?.trim(),
    description: data.description?.trim() || null,
    type: data.type,
    value: data.value,
    min_order: data.min_order || 0,
    max_discount: data.max_discount || null,
    usage_limit: data.usage_limit || 1,
    is_active: data.is_active ?? true,
    is_public: data.is_public ?? false,
    is_auto_applied: data.is_auto_applied ?? false,
    starts_at: data.starts_at || (/* @__PURE__ */ new Date()).toISOString(),
    expires_at: data.expires_at || null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    metadata: data.metadata || {},
    store_id: data.store_id || null,
    store_name: data.store_name || null,
    store_ids: data.store_ids || []
  }).eq("id", id).select().single();
  if (error) throw error;
  return result;
}
async function deletePromoCode(id) {
  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) throw error;
}
async function togglePromoCodeStatus(id, isActive) {
  const { error } = await supabase.from("promo_codes").update({
    is_active: isActive,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", id);
  if (error) throw error;
}
function usePromoCodesInfinite({
  search = "",
  filterType = "all",
  filterStatus = "all"
} = {}) {
  return useInfiniteQuery({
    queryKey: ["promo-codes-infinite", search, filterType, filterStatus],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchPromoCodesPaginated({
        page: pageParam,
        limit: 20,
        search,
        filterType,
        filterStatus
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      return totalLoaded < lastPage.total ? allPages.length : void 0;
    },
    initialPageParam: 0,
    staleTime: 1e3 * 60 * 2,
    gcTime: 1e3 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1
  });
}
function usePromoCodesStatsOptimized() {
  return useQuery({
    queryKey: ["promo-codes-stats-optimized"],
    queryFn: getPromoCodesStatsOptimized,
    staleTime: 1e3 * 60 * 2,
    gcTime: 1e3 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });
}
function usePromoCodesRealtime() {
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    const channel = supabase.channel("promo-codes-realtime").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "promo_codes" },
      () => {
        queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
        queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
        queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
function useCreatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    }
  });
}
function useUpdatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePromoCode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    }
  });
}
function useDeletePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    }
  });
}
function useTogglePromoCodeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => togglePromoCodeStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    }
  });
}
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft$1, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
function CustomTimePicker({
  value,
  onChange,
  isArabic
}) {
  const [hours, setHours] = reactExports.useState(() => {
    if (!value) return "12";
    const parts = value.split(":");
    return parts[0] || "12";
  });
  const [minutes, setMinutes] = reactExports.useState(() => {
    if (!value) return "00";
    const parts = value.split(":");
    return parts[1] || "00";
  });
  const [period, setPeriod] = reactExports.useState(() => {
    if (!value) return "AM";
    const h = parseInt(value.split(":")[0] || "12");
    return h >= 12 ? "PM" : "AM";
  });
  const updateTime = reactExports.useCallback((h, m, p) => {
    let hour = parseInt(h);
    if (p === "PM" && hour < 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0;
    const timeStr = `${String(hour).padStart(2, "0")}:${m}`;
    onChange(timeStr);
  }, [onChange]);
  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Select,
      {
        value: hours,
        onValueChange: (v) => {
          setHours(v);
          updateTime(v, minutes, period);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-20 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono text-base hover:border-slate-300 dark:hover:border-slate-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700", children: hourOptions.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: h, className: "text-center font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: h }, h)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-slate-600 dark:text-slate-300", children: ":" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Select,
      {
        value: minutes,
        onValueChange: (v) => {
          setMinutes(v);
          updateTime(hours, v, period);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-20 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono text-base hover:border-slate-300 dark:hover:border-slate-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700", children: minuteOptions.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, className: "text-center font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: m }, m)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Select,
      {
        value: period,
        onValueChange: (v) => {
          setPeriod(v);
          updateTime(hours, minutes, v);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-24 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-sm font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AM", className: "font-medium hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isArabic ? "صباحاً" : "AM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PM", className: "font-medium hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isArabic ? "مساءً" : "PM" })
          ] })
        ]
      }
    )
  ] });
}
const StatsCards$1 = React__default.memo(({ stats }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const items = reactExports.useMemo(() => [
    {
      label: isArabic ? "📊 الإجمالي" : "📊 Total",
      value: stats.total,
      icon: Tag,
      gradient: "from-[#2a655f] to-[#1a4f4a]"
    },
    {
      label: isArabic ? "✅ نشط" : "✅ Active",
      value: stats.active,
      icon: Shield,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      label: isArabic ? "⏰ منتهي" : "⏰ Expired",
      value: stats.expired,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      label: isArabic ? "📈 مستخدم" : "📈 Used",
      value: stats.used,
      icon: Users,
      gradient: "from-[#d81b60] to-[#f9a8d4]"
    }
  ], [stats, isArabic]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: item.value })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-3.5 w-3.5 text-white" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 animate-shimmer`,
            style: { width: `${Math.min(100, item.value / (stats.total || 1) * 100)}%` }
          }
        ) })
      ]
    },
    item.label
  )) });
});
StatsCards$1.displayName = "StatsCards";
const PromoCodeRow = React__default.memo(({
  code,
  onEdit,
  onDelete,
  onToggle,
  onCopy,
  isArabic,
  currency,
  getTypeLabel,
  getTypeColor,
  getStatusColor,
  getStatusLabel,
  formatDate
}) => {
  const typeInfo = getTypeLabel(code.type);
  const TypeIcon = typeInfo.icon;
  const statusColor = getStatusColor(code);
  const statusLabel = getStatusLabel(code);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => onCopy(code.code),
        className: "flex items-center gap-2 hover:text-[#2a655f] dark:hover:text-[#f9a8d4] transition-colors group/code font-mono font-semibold text-slate-700 dark:text-slate-300",
        children: [
          code.code,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5 text-slate-400 opacity-0 group-hover/code:opacity-100 transition-opacity" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      code.is_public && !code.store_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-[8px] hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-2.5 w-2.5 inline mr-0.5" }),
        isArabic ? "عام" : "Public"
      ] }),
      code.store_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#d81b60]/10 text-[#d81b60] border-2 border-[#d81b60]/20 text-[8px] hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-2.5 w-2.5 inline mr-0.5" }),
        code.store_name || (isArabic ? "مخصص" : "Specific")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium group-hover:text-[#2a655f] dark:group-hover:text-[#f9a8d4] transition-colors", children: code.label || "-" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn("border-2 flex items-center gap-1 px-3 py-1 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", getTypeColor(code.type)), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TypeIcon, { className: "h-3 w-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: isArabic ? typeInfo.ar : typeInfo.en })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-slate-700 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: code.type === "free_shipping" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#2a655f] dark:text-[#f9a8d4]", children: [
      "🆓 ",
      isArabic ? "مجاني" : "Free"
    ] }) : code.type === "percentage" ? `${code.value}%` : `${code.value} ${currency}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#2a655f] dark:group-hover:text-[#f9a8d4] transition-colors", children: code.used_count || 0 }),
      code.usage_limit && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
        "/ ",
        code.usage_limit
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-2 px-3 py-1 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", statusColor), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
      statusLabel === "نشط" || statusLabel === "Active" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }) : statusLabel === "منتهي الصلاحية" || statusLabel === "Expired" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-rose-500" }),
      statusLabel
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-slate-500 dark:text-slate-400 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: code.expires_at ? formatDate(code.expires_at) : isArabic ? "غير محدود" : "Unlimited" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          onClick: () => onEdit(code),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-red-300 hover:text-red-500 transition-all duration-300",
          onClick: () => onDelete(code),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "rounded-xl border border-slate-200 dark:border-slate-700 p-1 min-w-[160px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              className: "rounded-lg cursor-pointer gap-2 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors",
              onClick: () => onCopy(code.code),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 text-slate-500" }),
                isArabic ? "نسخ الكود" : "Copy code"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuItem,
            {
              className: "rounded-lg cursor-pointer gap-2 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors",
              onClick: () => onToggle(code),
              children: code.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4 text-slate-500" }),
                isArabic ? "تعطيل" : "Deactivate"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-slate-500" }),
                isArabic ? "تفعيل" : "Activate"
              ] })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
});
PromoCodeRow.displayName = "PromoCodeRow";
function AdminPromoCodes() {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [showAddDialog, setShowAddDialog] = reactExports.useState(false);
  const [showEditDialog, setShowEditDialog] = reactExports.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [selectedCode, setSelectedCode] = reactExports.useState(null);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isStoreSpecific, setIsStoreSpecific] = reactExports.useState(false);
  const [selectedStoreId, setSelectedStoreId] = reactExports.useState("");
  const [searchStore, setSearchStore] = reactExports.useState("");
  const { data: stores = [], isLoading: storesLoading } = useAllStores(100);
  const activeStores = reactExports.useMemo(() => {
    return stores.filter((store) => store.store_active !== false);
  }, [stores]);
  const filteredStores = reactExports.useMemo(() => {
    if (!searchStore.trim()) return activeStores;
    const query = searchStore.trim().toLowerCase();
    return activeStores.filter((store) => {
      const name = (store.store_name || store.full_name || "").toLowerCase();
      const phone = (store.store_phone || store.phone || "").toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [activeStores, searchStore]);
  const {
    data: infiniteData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePromoCodesInfinite({
    search: searchQuery,
    filterType,
    filterStatus
  });
  const { data: stats = { total: 0, active: 0, expired: 0, used: 0 } } = usePromoCodesStatsOptimized();
  usePromoCodesRealtime();
  const codes = reactExports.useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page.data) || [];
  }, [infiniteData]);
  const totalCount = reactExports.useMemo(() => {
    if (!infiniteData || infiniteData.pages.length === 0) return 0;
    return infiniteData.pages[0]?.total || 0;
  }, [infiniteData]);
  const copyCode = reactExports.useCallback((code) => {
    navigator.clipboard.writeText(code);
    toast.success(isArabic ? "✅ تم نسخ الكود" : "✅ Code copied");
  }, [isArabic]);
  const getTypeLabel = reactExports.useCallback((type) => {
    const map = {
      percentage: { ar: "نسبة مئوية", en: "Percentage", icon: Percent },
      fixed: { ar: "قيمة ثابتة", en: "Fixed", icon: DollarSign },
      free_shipping: { ar: "توصيل مجاني", en: "Free Shipping", icon: Truck }
    };
    return map[type] || map.percentage;
  }, []);
  const getTypeColor = reactExports.useCallback((type) => {
    const map = {
      percentage: "bg-[#f9a8d4]/20 text-[#d81b60] border-[#f9a8d4]/40",
      fixed: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/30",
      free_shipping: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    };
    return map[type] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  }, []);
  const getStatusColor = reactExports.useCallback((code) => {
    if (!code.is_active) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    if (code.expires_at && new Date(code.expires_at) < /* @__PURE__ */ new Date()) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  }, []);
  const getStatusLabel = reactExports.useCallback((code) => {
    if (!code.is_active) return isArabic ? "غير نشط" : "Inactive";
    if (code.expires_at && new Date(code.expires_at) < /* @__PURE__ */ new Date()) {
      return isArabic ? "منتهي الصلاحية" : "Expired";
    }
    return isArabic ? "نشط" : "Active";
  }, [isArabic]);
  const formatDate = reactExports.useCallback((date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString(
      isArabic ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    );
  }, [isArabic]);
  const createMutation = useCreatePromoCode();
  const updateMutation = useUpdatePromoCode();
  const deleteMutation = useDeletePromoCode();
  const toggleMutation = useTogglePromoCodeStatus();
  const [formData, setFormData] = reactExports.useState({
    code: "",
    label: "",
    description: "",
    type: "percentage",
    value: "",
    min_order: "0",
    max_discount: "",
    usage_limit: "1",
    is_active: true,
    is_public: false,
    expires_at: "",
    store_id: "",
    store_name: ""
  });
  const resetForm = reactExports.useCallback(() => {
    setFormData({
      code: "",
      label: "",
      description: "",
      type: "percentage",
      value: "",
      min_order: "0",
      max_discount: "",
      usage_limit: "1",
      is_active: true,
      is_public: false,
      expires_at: "",
      store_id: "",
      store_name: ""
    });
    setIsStoreSpecific(false);
    setSelectedStoreId("");
    setSearchStore("");
  }, []);
  const handleAddCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isStoreSpecific && !selectedStoreId) {
        toast.error(isArabic ? "⚠️ يرجى اختيار متجر للكود المخصص" : "⚠️ Please select a store for specific code");
        setIsSubmitting(false);
        return;
      }
      const selectedStore = activeStores.find((s) => s.id === selectedStoreId);
      const storeName = selectedStore?.store_name || null;
      let expiresAt = formData.expires_at || null;
      if (expiresAt) {
        const date = new Date(expiresAt);
        expiresAt = date.toISOString();
      }
      await createMutation.mutateAsync({
        code: formData.code,
        label: formData.label,
        description: formData.description,
        type: formData.type,
        value: parseFloat(formData.value) || 0,
        min_order: parseFloat(formData.min_order) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: parseInt(formData.usage_limit) || 1,
        is_active: formData.is_active,
        is_public: formData.is_public,
        expires_at: expiresAt,
        created_by: app.user?.id,
        metadata: {},
        store_id: isStoreSpecific ? selectedStoreId : null,
        store_name: isStoreSpecific ? storeName : null
      });
      toast.success(isArabic ? "✅ تم إضافة الكود بنجاح" : "✅ Code added successfully");
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditCode = async (e) => {
    e.preventDefault();
    if (!selectedCode) return;
    setIsSubmitting(true);
    try {
      if (isStoreSpecific && !selectedStoreId) {
        toast.error(isArabic ? "⚠️ يرجى اختيار متجر للكود المخصص" : "⚠️ Please select a store for specific code");
        setIsSubmitting(false);
        return;
      }
      const selectedStore = activeStores.find((s) => s.id === selectedStoreId);
      const storeName = selectedStore?.store_name || null;
      let expiresAt = formData.expires_at || null;
      if (expiresAt) {
        const date = new Date(expiresAt);
        expiresAt = date.toISOString();
      }
      await updateMutation.mutateAsync({
        id: selectedCode.id,
        data: {
          code: formData.code,
          label: formData.label,
          description: formData.description,
          type: formData.type,
          value: parseFloat(formData.value) || 0,
          min_order: parseFloat(formData.min_order) || 0,
          max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
          usage_limit: parseInt(formData.usage_limit) || 1,
          is_active: formData.is_active,
          is_public: formData.is_public,
          expires_at: expiresAt,
          metadata: {},
          store_id: isStoreSpecific ? selectedStoreId : null,
          store_name: isStoreSpecific ? storeName : null
        }
      });
      toast.success(isArabic ? "✅ تم تحديث الكود بنجاح" : "✅ Code updated successfully");
      setShowEditDialog(false);
      setSelectedCode(null);
      resetForm();
    } catch (error) {
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteCode = async () => {
    if (!selectedCode) return;
    setIsSubmitting(true);
    try {
      await deleteMutation.mutateAsync(selectedCode.id);
      toast.success(isArabic ? "✅ تم حذف الكود بنجاح" : "✅ Code deleted successfully");
      setShowDeleteDialog(false);
      setSelectedCode(null);
    } catch (error) {
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggleStatus = async (code) => {
    try {
      await toggleMutation.mutateAsync({
        id: code.id,
        isActive: !code.is_active
      });
      toast.success(
        isArabic ? code.is_active ? "❌ تم تعطيل الكود" : "✅ تم تفعيل الكود" : code.is_active ? "❌ Code deactivated" : "✅ Code activated"
      );
    } catch (error) {
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    }
  };
  const openEditDialog = reactExports.useCallback((code) => {
    setSelectedCode(code);
    const isSpecific = !!code.store_id;
    setIsStoreSpecific(isSpecific);
    setSelectedStoreId(code.store_id || "");
    let formattedExpiresAt = "";
    if (code.expires_at) {
      const date = new Date(code.expires_at);
      formattedExpiresAt = date.toISOString().slice(0, 16);
    }
    setFormData({
      code: code.code,
      label: code.label || "",
      description: code.description || "",
      type: code.type,
      value: String(code.value),
      min_order: String(code.min_order || 0),
      max_discount: code.max_discount ? String(code.max_discount) : "",
      usage_limit: String(code.usage_limit || 1),
      is_active: code.is_active,
      is_public: code.is_public || false,
      expires_at: formattedExpiresAt,
      store_id: code.store_id || "",
      store_name: code.store_name || ""
    });
    setShowEditDialog(true);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isArabic ? "أكواد الخصم" : "Promo Codes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isArabic ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2", children: [
          isArabic ? `إدارة جميع الأكواد (${codes.length} من ${totalCount})` : `Manage all codes (${codes.length} of ${totalCount})`,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#f9a8d4]/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#d81b60] flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 animate-pulse" }),
            isArabic ? "تحديث لحظي" : "Real-time"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => refetch(),
            disabled: isLoading,
            className: "rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", isLoading && "animate-spin") })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0",
            onClick: () => {
              resetForm();
              setShowAddDialog(true);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
              isArabic ? "إضافة كود جديد" : "Add New Code"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          isArabic ? "لوحة تحكم" : "Dashboard"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCards$1, { stats }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute inset-y-0 my-auto ${isArabic ? "right-3" : "left-3"} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: isArabic ? "🔍 بحث عن كود..." : "🔍 Search code...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: `${isArabic ? "pr-9 pl-3" : "pl-9 pr-3"} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: `absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterType, onValueChange: setFilterType, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "النوع" : "Type" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isArabic ? "الكل" : "All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "percentage", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "📊 ",
            isArabic ? "نسبة مئوية" : "Percentage"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "fixed", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "💰 ",
            isArabic ? "قيمة ثابتة" : "Fixed"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "free_shipping", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "🚚 ",
            isArabic ? "توصيل مجاني" : "Free Shipping"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: setFilterStatus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "الحالة" : "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: isArabic ? "الكل" : "All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "active", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "✅ ",
            isArabic ? "نشط" : "Active"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "inactive", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "❌ ",
            isArabic ? "غير نشط" : "Inactive"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "expired", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            "⏰ ",
            isArabic ? "منتهي" : "Expired"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setFilterType("all");
            setFilterStatus("all");
          },
          className: "h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "مسح الكل" : "Clear All"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 animate-pulse", children: isArabic ? "⏳ جاري تحميل الأكواد..." : "⏳ Loading codes..." })
    ] }) : codes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-16 text-center shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-10 w-10 text-[#2a655f]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: searchQuery ? isArabic ? "🔍 لا توجد نتائج" : "🔍 No results found" : isArabic ? "🚀 لا توجد أكواد خصم" : "🚀 No promo codes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 max-w-md", children: searchQuery ? isArabic ? `لا توجد أكواد تطابق "${searchQuery}"` : `No codes match "${searchQuery}"` : isArabic ? "ابدأ بإضافة أول كود خصم لجذب المزيد من العملاء" : "Start adding promo codes to attract more customers" }),
      !searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-0",
          onClick: () => {
            resetForm();
            setShowAddDialog(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 me-2 group-hover:rotate-90 transition-transform duration-300" }),
            isArabic ? "إضافة كود جديد" : "Add New Code"
          ]
        }
      )
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "الكود" : "Code"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[160px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "الاسم / النوع" : "Label / Type"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "النوع" : "Type"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "القيمة" : "Value"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "الاستخدامات" : "Uses"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            isArabic ? "الصلاحية" : "Expires"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            isArabic ? "إجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: codes.map((code) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PromoCodeRow,
          {
            code,
            onEdit: openEditDialog,
            onDelete: (c) => {
              setSelectedCode(c);
              setShowDeleteDialog(true);
            },
            onToggle: handleToggleStatus,
            onCopy: copyCode,
            isArabic,
            currency: app.currency,
            getTypeLabel,
            getTypeColor,
            getStatusColor,
            getStatusLabel,
            formatDate
          },
          code.id
        )) })
      ] }) }) }),
      hasNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => fetchNextPage(),
          disabled: isFetchingNextPage,
          className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105",
          children: isFetchingNextPage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
            isArabic ? "جار التحميل..." : "Loading..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            isArabic ? "تحميل المزيد" : "Load More"
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-slate-500 dark:text-slate-400 pt-2", children: isArabic ? `عرض ${codes.length} من ${totalCount} كود` : `Showing ${codes.length} of ${totalCount} codes` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddDialog, onOpenChange: setShowAddDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setShowAddDialog(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isArabic ? "إضافة كود خصم جديد" : "Add New Promo Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isArabic ? "أدخل معلومات كود الخصم الجديد" : "Enter the new promo code information" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddCode, className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الكود *" : "Code *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.code,
                  onChange: (e) => setFormData({ ...formData, code: e.target.value.toUpperCase() }),
                  placeholder: isArabic ? "مثال: SUMMER25" : "Example: SUMMER25",
                  required: true,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 font-mono text-lg transition-all duration-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: isArabic ? "أحرف كبيرة وأرقام فقط" : "Uppercase letters and numbers only" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الاسم *" : "Label *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.label,
                  onChange: (e) => setFormData({ ...formData, label: e.target.value }),
                  placeholder: isArabic ? "مثال: خصم الصيف" : "Example: Summer Sale",
                  required: true,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "الوصف" : "Description"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: formData.description,
                onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                placeholder: isArabic ? "وصف الكود" : "Code description",
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 min-h-[60px] transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "النوع *" : "Type *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: formData.type,
                  onValueChange: (value) => {
                    setFormData({
                      ...formData,
                      type: value,
                      value: value === "free_shipping" ? "0" : formData.value
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "percentage", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                        "📊 ",
                        isArabic ? "نسبة مئوية" : "Percentage"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "fixed", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                        "💰 ",
                        isArabic ? "قيمة ثابتة" : "Fixed"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "free_shipping", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                        "🚚 ",
                        isArabic ? "توصيل مجاني" : "Free Shipping"
                      ] })
                    ] })
                  ]
                }
              )
            ] }),
            formData.type !== "free_shipping" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "القيمة *" : "Value *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: formData.value,
                  onChange: (e) => setFormData({ ...formData, value: e.target.value }),
                  placeholder: formData.type === "percentage" ? "10" : "10.00",
                  required: true,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] }),
            formData.type === "free_shipping" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "القيمة" : "Value"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2 h-11", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "🆓 تُحسب تلقائياً حسب رسوم التوصيل" : "🆓 Calculated automatically based on delivery fee" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الحد الأدنى للطلب" : "Min Order"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: formData.min_order,
                  onChange: (e) => setFormData({ ...formData, min_order: e.target.value }),
                  placeholder: "0",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الحد الأقصى للخصم" : "Max Discount"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: formData.max_discount,
                  onChange: (e) => setFormData({ ...formData, max_discount: e.target.value }),
                  placeholder: isArabic ? "غير محدود" : "Unlimited",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "حد الاستخدامات" : "Usage Limit"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: formData.usage_limit,
                  onChange: (e) => setFormData({ ...formData, usage_limit: e.target.value }),
                  placeholder: "1",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: isArabic ? "عدد مرات استخدام الكود" : "Number of times code can be used" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "تاريخ ووقت الانتهاء" : "Expiry Date & Time"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: cn(
                      "w-full justify-start text-left font-normal rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-12 text-slate-700 dark:text-slate-300",
                      !formData.expires_at && "text-slate-400"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "mr-2 h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                      formData.expires_at ? formatDate(formData.expires_at) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "اختر التاريخ" : "Select date" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Calendar,
                  {
                    mode: "single",
                    selected: formData.expires_at ? new Date(formData.expires_at) : void 0,
                    onSelect: (date) => {
                      if (date) {
                        const currentTime = formData.expires_at ? new Date(formData.expires_at) : /* @__PURE__ */ new Date();
                        const newDate = new Date(date);
                        newDate.setHours(currentTime.getHours());
                        newDate.setMinutes(currentTime.getMinutes());
                        setFormData({ ...formData, expires_at: newDate.toISOString() });
                      } else {
                        setFormData({ ...formData, expires_at: "" });
                      }
                    },
                    disabled: (date) => date < /* @__PURE__ */ new Date(),
                    initialFocus: true,
                    className: "rounded-2xl"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomTimePicker,
                {
                  value: formData.expires_at ? new Date(formData.expires_at).toTimeString().slice(0, 5) : "",
                  onChange: (time) => {
                    if (formData.expires_at) {
                      const date = new Date(formData.expires_at);
                      const [hours, minutes] = time.split(":").map(Number);
                      date.setHours(hours || 0);
                      date.setMinutes(minutes || 0);
                      setFormData({ ...formData, expires_at: date.toISOString() });
                    } else {
                      const date = /* @__PURE__ */ new Date();
                      const [hours, minutes] = time.split(":").map(Number);
                      date.setHours(hours || 0);
                      date.setMinutes(minutes || 0);
                      setFormData({ ...formData, expires_at: date.toISOString() });
                    }
                  },
                  isArabic
                }
              ) })
            ] }),
            formData.expires_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 text-[#d81b60] animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? "ينتهي في: " : "Expires at: " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#d81b60]", children: new Date(formData.expires_at).toLocaleString(
                isArabic ? "ar-SA" : "en-US",
                {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors ml-auto",
                  onClick: () => setFormData({ ...formData, expires_at: "" }),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "📅 اختر تاريخ ووقت الانتهاء (اتركه فارغاً للصلاحية الدائمة)" : "📅 Select expiry date & time (leave empty for unlimited)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "نوع الكود" : "Code Type"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    !isStoreSpecific ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: !isStoreSpecific,
                        onChange: () => {
                          setIsStoreSpecific(false);
                          setSelectedStoreId("");
                        },
                        className: "mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-slate-700 dark:text-slate-300", children: isArabic ? "🌐 كود عام" : "🌐 Public Code" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: isArabic ? "ينطبق على جميع المتاجر" : "Applies to all stores" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    isStoreSpecific ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: isStoreSpecific,
                        onChange: () => setIsStoreSpecific(true),
                        className: "mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-slate-700 dark:text-slate-300", children: isArabic ? "🏪 كود مخصص" : "🏪 Specific Code" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: isArabic ? "ينطبق على متجر معين" : "Applies to a specific store" })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          isStoreSpecific && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "اختر المتجر المستهدف *" : "Select Target Store *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto left-3 h-4 w-4 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: isArabic ? "🔍 بحث بالاسم أو رقم الجوال..." : "🔍 Search by name or phone...",
                  value: searchStore,
                  onChange: (e) => setSearchStore(e.target.value),
                  className: "pl-9 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] }),
            storesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f] dark:text-slate-300" }) }) : filteredStores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-slate-400", children: searchStore ? isArabic ? "❌ لا توجد متاجر تطابق البحث" : "❌ No stores match search" : isArabic ? "❌ لا توجد متاجر نشطة" : "❌ No active stores" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-60 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-950", children: [
              filteredStores.map((store) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    selectedStoreId === store.id ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "store",
                        value: store.id,
                        checked: selectedStoreId === store.id,
                        onChange: () => setSelectedStoreId(store.id),
                        className: "h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: store.store_logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: store.store_logo_url,
                        alt: "",
                        className: "h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700",
                        onError: (e) => {
                          e.target.style.display = "none";
                        }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-[#2a655f] dark:text-slate-300" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-slate-900 dark:text-white truncate", children: store.store_name || store.full_name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-400", children: [
                        store.store_phone || store.phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-slate-300", children: "📞" }),
                          store.store_phone || store.phone
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400/50", children: isArabic ? "رقم غير متاح" : "No phone" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600", children: [
                          store.listing_count || 0,
                          " ",
                          isArabic ? "منتج" : "products"
                        ] })
                      ] })
                    ] }),
                    selectedStoreId === store.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5 text-[#2a655f] flex-shrink-0" })
                  ]
                },
                store.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-700", children: isArabic ? `عرض ${filteredStores.length} من ${activeStores.length} متجر` : `Showing ${filteredStores.length} of ${activeStores.length} stores` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "💡 اختر المتجر الذي سينطبق عليه الكود (يمكنك البحث بالاسم أو رقم الجوال)" : "💡 Select the store where this code will apply (search by name or phone)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: formData.is_active,
                onCheckedChange: (checked) => setFormData({ ...formData, is_active: checked }),
                className: "data-[state=checked]:bg-[#2a655f]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? "🟢 الكود نشط" : "🟢 Code is active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowAddDialog(false),
                className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                  isArabic ? "إلغاء" : "Cancel"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0",
                disabled: isSubmitting || isStoreSpecific && !selectedStoreId,
                children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                  isArabic ? "جاري الإضافة..." : "Adding..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 mr-1.5" }),
                  isArabic ? "إضافة الكود" : "Add Code"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showEditDialog, onOpenChange: setShowEditDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setShowEditDialog(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isArabic ? "تعديل كود الخصم" : "Edit Promo Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400", children: isArabic ? `تعديل كود "${selectedCode?.code}"` : `Editing code "${selectedCode?.code}"` })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEditCode, className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الكود *" : "Code *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.code,
                  onChange: (e) => setFormData({ ...formData, code: e.target.value.toUpperCase() }),
                  placeholder: isArabic ? "مثال: SUMMER25" : "Example: SUMMER25",
                  required: true,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 font-mono text-lg transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الاسم *" : "Label *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: formData.label,
                  onChange: (e) => setFormData({ ...formData, label: e.target.value }),
                  placeholder: isArabic ? "مثال: خصم الصيف" : "Example: Summer Sale",
                  required: true,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "الوصف" : "Description"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: formData.description,
                onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                placeholder: isArabic ? "وصف الكود" : "Code description",
                className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 min-h-[60px] transition-all duration-300"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "النوع *" : "Type *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: formData.type,
                  onValueChange: (value) => setFormData({ ...formData, type: value }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border border-slate-200 dark:border-slate-700", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "percentage", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                        "📊 ",
                        isArabic ? "نسبة مئوية" : "Percentage"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "fixed", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                        "💰 ",
                        isArabic ? "قيمة ثابتة" : "Fixed"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "free_shipping", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                        "🚚 ",
                        isArabic ? "توصيل مجاني" : "Free Shipping"
                      ] })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "القيمة *" : "Value *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: formData.value,
                  onChange: (e) => setFormData({ ...formData, value: e.target.value }),
                  placeholder: formData.type === "percentage" ? "10" : "10.00",
                  required: true,
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الحد الأدنى للطلب" : "Min Order"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: formData.min_order,
                  onChange: (e) => setFormData({ ...formData, min_order: e.target.value }),
                  placeholder: "0",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "الحد الأقصى للخصم" : "Max Discount"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  value: formData.max_discount,
                  onChange: (e) => setFormData({ ...formData, max_discount: e.target.value }),
                  placeholder: isArabic ? "غير محدود" : "Unlimited",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                isArabic ? "حد الاستخدامات" : "Usage Limit"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: formData.usage_limit,
                  onChange: (e) => setFormData({ ...formData, usage_limit: e.target.value }),
                  placeholder: "1",
                  className: "rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "تاريخ ووقت الانتهاء" : "Expiry Date & Time"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: cn(
                      "w-full justify-start text-left font-normal rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-12 text-slate-700 dark:text-slate-300",
                      !formData.expires_at && "text-slate-400"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "mr-2 h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                      formData.expires_at ? formatDate(formData.expires_at) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "اختر التاريخ" : "Select date" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Calendar,
                  {
                    mode: "single",
                    selected: formData.expires_at ? new Date(formData.expires_at) : void 0,
                    onSelect: (date) => {
                      if (date) {
                        const currentTime = formData.expires_at ? new Date(formData.expires_at) : /* @__PURE__ */ new Date();
                        const newDate = new Date(date);
                        newDate.setHours(currentTime.getHours());
                        newDate.setMinutes(currentTime.getMinutes());
                        setFormData({ ...formData, expires_at: newDate.toISOString() });
                      } else {
                        setFormData({ ...formData, expires_at: "" });
                      }
                    },
                    disabled: (date) => date < /* @__PURE__ */ new Date(),
                    initialFocus: true,
                    className: "rounded-2xl"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomTimePicker,
                {
                  value: formData.expires_at ? new Date(formData.expires_at).toTimeString().slice(0, 5) : "",
                  onChange: (time) => {
                    if (formData.expires_at) {
                      const date = new Date(formData.expires_at);
                      const [hours, minutes] = time.split(":").map(Number);
                      date.setHours(hours || 0);
                      date.setMinutes(minutes || 0);
                      setFormData({ ...formData, expires_at: date.toISOString() });
                    } else {
                      const date = /* @__PURE__ */ new Date();
                      const [hours, minutes] = time.split(":").map(Number);
                      date.setHours(hours || 0);
                      date.setMinutes(minutes || 0);
                      setFormData({ ...formData, expires_at: date.toISOString() });
                    }
                  },
                  isArabic
                }
              ) })
            ] }),
            formData.expires_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 text-[#d81b60] animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? "ينتهي في: " : "Expires at: " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#d81b60]", children: new Date(formData.expires_at).toLocaleString(
                isArabic ? "ar-SA" : "en-US",
                {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors ml-auto",
                  onClick: () => setFormData({ ...formData, expires_at: "" }),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "نوع الكود" : "Code Type"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    !isStoreSpecific ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: !isStoreSpecific,
                        onChange: () => {
                          setIsStoreSpecific(false);
                          setSelectedStoreId("");
                        },
                        className: "mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-slate-700 dark:text-slate-300", children: isArabic ? "🌐 كود عام" : "🌐 Public Code" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: isArabic ? "ينطبق على جميع المتاجر" : "Applies to all stores" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    isStoreSpecific ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        checked: isStoreSpecific,
                        onChange: () => setIsStoreSpecific(true),
                        className: "mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-slate-700 dark:text-slate-300", children: isArabic ? "🏪 كود مخصص" : "🏪 Specific Code" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: isArabic ? "ينطبق على متجر معين" : "Applies to a specific store" })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          isStoreSpecific && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f] dark:text-slate-300" }),
              isArabic ? "اختر المتجر المستهدف *" : "Select Target Store *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto left-3 h-4 w-4 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: isArabic ? "🔍 بحث بالاسم أو رقم الجوال..." : "🔍 Search by name or phone...",
                  value: searchStore,
                  onChange: (e) => setSearchStore(e.target.value),
                  className: "pl-9 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                }
              )
            ] }),
            storesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f] dark:text-slate-300" }) }) : filteredStores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-slate-400", children: searchStore ? isArabic ? "❌ لا توجد متاجر تطابق البحث" : "❌ No stores match search" : isArabic ? "❌ لا توجد متاجر نشطة" : "❌ No active stores" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-950", children: filteredStores.map((store) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                  selectedStoreId === store.id ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "store-edit",
                      value: store.id,
                      checked: selectedStoreId === store.id,
                      onChange: () => setSelectedStoreId(store.id),
                      className: "h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: store.store_logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: store.store_logo_url,
                      alt: "",
                      className: "h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700",
                      onError: (e) => {
                        e.target.style.display = "none";
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-[#2a655f] dark:text-slate-300" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-slate-900 dark:text-white truncate", children: store.store_name || store.full_name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-400", children: [
                      store.store_phone || store.phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-slate-300", children: "📞" }),
                        store.store_phone || store.phone
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400/50", children: isArabic ? "رقم غير متاح" : "No phone" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600", children: [
                        store.listing_count || 0,
                        " ",
                        isArabic ? "منتج" : "products"
                      ] })
                    ] })
                  ] }),
                  selectedStoreId === store.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5 text-[#2a655f] flex-shrink-0" })
                ]
              },
              store.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: formData.is_active,
                onCheckedChange: (checked) => setFormData({ ...formData, is_active: checked }),
                className: "data-[state=checked]:bg-[#2a655f]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300", children: isArabic ? "🟢 الكود نشط" : "🟢 Code is active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3 pt-4 border-t-2 border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowEditDialog(false),
                className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                  isArabic ? "إلغاء" : "Cancel"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0",
                disabled: isSubmitting || isStoreSpecific && !selectedStoreId,
                children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                  isArabic ? "جاري الحفظ..." : "Saving..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1.5" }),
                  isArabic ? "حفظ التغييرات" : "Save Changes"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700",
          onClick: () => setShowDeleteDialog(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-rose-600 dark:text-rose-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 dark:text-white", children: isArabic ? "حذف الكود" : "Delete Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-700 dark:text-rose-300 font-medium", children: isArabic ? `هل أنت متأكد من حذف كود "${selectedCode?.code}"؟` : `Are you sure you want to delete code "${selectedCode?.code}"?` }),
          selectedCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-3 pt-3 border-t border-rose-200/50 dark:border-rose-800/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 truncate", children: selectedCode.label || selectedCode.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: selectedCode.type === "percentage" ? `${selectedCode.value}%` : selectedCode.type === "free_shipping" ? "🆓 توصيل مجاني" : `${selectedCode.value} ${app.currency}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-rose-500/10 text-rose-600 border-2 border-rose-500/30", children: [
              selectedCode.used_count || 0,
              " ",
              isArabic ? "استخدام" : "uses"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
          isArabic ? "تحذير: حذف هذا الكود سيؤثر على الطلبات المرتبطة به" : "Warning: Deleting this code will affect associated orders"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-3 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setShowDeleteDialog(false),
              className: "flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
              children: isArabic ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleDeleteCode,
              disabled: isSubmitting,
              className: "flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50",
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                isArabic ? "جاري الحذف..." : "Deleting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 me-2" }),
                isArabic ? "تأكيد الحذف" : "Confirm Delete"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` })
  ] });
}
const { saveAs } = pkg__default;
const StatsCards = React__default.memo(({ stats, isArabic }) => {
  const items = reactExports.useMemo(() => [
    {
      key: "total",
      label: isArabic ? "📊 الإجمالي" : "📊 Total",
      value: stats.total,
      icon: TriangleAlert,
      color: "text-[#2a655f]",
      gradient: "from-[#2a655f] to-[#f9a8d4]"
    },
    {
      key: "pending",
      label: isArabic ? "⏳ قيد المراجعة" : "⏳ Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500",
      gradient: "from-amber-500 to-amber-600"
    },
    {
      key: "inProgress",
      label: isArabic ? "🔄 قيد المعالجة" : "🔄 In Progress",
      value: stats.inProgress,
      icon: LoaderCircle,
      color: "text-[#3a8a82]",
      gradient: "from-[#3a8a82] to-[#4a9f95]"
    },
    {
      key: "resolved",
      label: isArabic ? "✅ تم الحل" : "✅ Resolved",
      value: stats.resolved,
      icon: CircleCheck,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      key: "closed",
      label: isArabic ? "📌 مغلقة" : "📌 Closed",
      value: stats.closed,
      icon: CircleX,
      color: "text-[#f9a8d4]",
      gradient: "from-[#f9a8d4] to-[#fbcfe8]"
    }
  ], [stats, isArabic]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors ${item.color}`, children: item.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-500 dark:text-slate-400", children: stats.total > 0 ? `${Math.round(item.value / stats.total * 100)}%` : "0%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-3.5 w-3.5 text-white" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 animate-shimmer`,
            style: { width: `${Math.min(100, item.value / (stats.total || 1) * 100)}%` }
          }
        ) })
      ]
    },
    item.key
  )) });
});
StatsCards.displayName = "StatsCards";
const ComplaintRow = React__default.memo(({
  complaint,
  isExpanded,
  onToggle,
  onReply,
  isArabic,
  getStatusBadge,
  index,
  rank
}) => {
  const status = getStatusBadge(complaint.status);
  const StatusIcon = status.icon;
  const user = complaint.profiles;
  const rankColor = rank === 1 ? "text-[#2a655f]" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-[#f9a8d4]" : "text-slate-400";
  const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  const rankBg = rank === 1 ? "bg-[#2a655f]/10" : rank === 2 ? "bg-slate-300/10" : rank === 3 ? "bg-[#f9a8d4]/20" : "bg-slate-100/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    TableRow,
    {
      className: "border-slate-200 dark:border-slate-700 hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 group border-b-2 border-pink-400/30 dark:border-pink-400/20 cursor-pointer",
      onClick: () => onToggle(complaint.id),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-pink-400/30 dark:border-pink-400/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center h-8 w-8 rounded-full ${rankBg} ${rankColor} font-bold text-sm transition-all duration-300 group-hover:scale-110`, children: rankEmoji }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-semibold text-slate-900 dark:text-white text-right border-r-2 border-pink-400/30 dark:border-pink-400/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-[#2a655f] transition-colors", children: complaint.subject || (isArabic ? "شكوى" : "Complaint") }),
            rank <= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg animate-bounce", children: rankEmoji })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground justify-end mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#2a655f]" }),
              user?.full_name || (isArabic ? "مستخدم" : "User")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#2a655f]/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "h-3 w-3 text-[#2a655f]" }),
              new Date(complaint.created_at).toLocaleDateString(
                isArabic ? "ar-SA" : "en-US",
                { day: "numeric", month: "short", year: "numeric" }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-slate-600 dark:text-slate-300 text-center font-mono border-r-2 border-pink-400/30 dark:border-pink-400/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20", children: [
          "#",
          complaint.order_id?.slice(0, 12) || "—"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center border-r-2 border-pink-400/30 dark:border-pink-400/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn("border-2 flex items-center gap-1.5 px-3 py-1 text-xs", status.bg, status.color), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }),
          status.label
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
          complaint.status !== "resolved" && complaint.status !== "closed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-8 w-8 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-200 hover:scale-105",
              onClick: (e) => {
                e.stopPropagation();
                onReply(complaint);
              },
              title: isArabic ? "رد" : "Reply",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-8 w-8 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-200 hover:scale-105",
              onClick: (e) => {
                e.stopPropagation();
                window.open(`/admin/complaints/${complaint.id}`, "_blank");
              },
              title: isArabic ? "عرض التفاصيل" : "View Details",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
            }
          ),
          isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-5 w-5 text-slate-400 group-hover:text-[#2a655f] group-hover:scale-110 transition-transform" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5 text-slate-400 group-hover:text-[#2a655f] group-hover:scale-110 transition-transform" })
        ] }) })
      ]
    }
  );
});
ComplaintRow.displayName = "ComplaintRow";
const ComplaintDetails = React__default.memo(({
  complaint,
  isArabic,
  onReply
}) => {
  const user = complaint.profiles;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 pt-3 border-t-3 border-pink-400/30 dark:border-pink-400/20 animate-in slide-in-from-top-2 duration-300 bg-gradient-to-r from-[#f9a8d4]/5 to-[#fbcfe8]/5 dark:from-[#f9a8d4]/5 dark:to-[#fbcfe8]/5 rounded-b-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-[#2a655f]" }),
        isArabic ? "معلومات العميل" : "Customer Information"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: user?.full_name || "-" }),
        user?.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-[#2a655f]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { dir: "ltr", children: user.phone })
        ] }),
        user?.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 text-[#2a655f]" }),
          user.email
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3 w-3 text-amber-500" }),
        isArabic ? "تفاصيل الشكوى" : "Complaint Details"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed", children: complaint.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      complaint.admin_response && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in slide-in-from-left-2 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-3 w-3 text-emerald-500" }),
          isArabic ? "رد الإدارة" : "Admin Response"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: complaint.admin_response }),
        complaint.resolved_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
          isArabic ? "تم الحل في " : "Resolved on ",
          new Date(complaint.resolved_at).toLocaleDateString(
            isArabic ? "ar-SA" : "en-US",
            { day: "numeric", month: "short", year: "numeric" }
          )
        ] })
      ] }),
      complaint.status !== "resolved" && complaint.status !== "closed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "w-full border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300 hover:scale-105 rounded-xl",
          onClick: () => onReply(complaint),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-4 w-4 mr-2" }),
            isArabic ? "رد على الشكوى" : "Reply"
          ]
        }
      )
    ] })
  ] }) });
});
ComplaintDetails.displayName = "ComplaintDetails";
function AdminComplaints() {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const { data: complaints = [], isLoading, refetch } = useAllComplaints();
  const updateComplaint = useUpdateComplaint();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [selectedComplaint, setSelectedComplaint] = reactExports.useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = reactExports.useState(false);
  const [adminResponse, setAdminResponse] = reactExports.useState("");
  const [newStatus, setNewStatus] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const [limit, setLimit] = reactExports.useState(10);
  const [sortBy, setSortBy] = reactExports.useState("created_at");
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const filteredComplaints = reactExports.useMemo(() => {
    let result = complaints;
    if (filterStatus !== "all") {
      result = result.filter((c) => c.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        const subject = (c.subject || "").toLowerCase();
        const userName = (c.profiles?.full_name || "").toLowerCase();
        const orderId = (c.order_id || "").toLowerCase();
        return subject.includes(q) || userName.includes(q) || orderId.includes(q);
      });
    }
    result = [...result].sort((a, b) => {
      let aVal = a[sortBy] || "";
      let bVal = b[sortBy] || "";
      if (sortBy === "status") {
        const statusOrder = { pending: 0, in_progress: 1, resolved: 2, closed: 3 };
        aVal = statusOrder[a.status] || 0;
        bVal = statusOrder[b.status] || 0;
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return result;
  }, [complaints, searchQuery, filterStatus, sortBy, sortOrder]);
  const totalPages = Math.ceil(filteredComplaints.length / limit);
  const paginatedComplaints = reactExports.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredComplaints.slice(start, end);
  }, [filteredComplaints, page, limit]);
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const stats = reactExports.useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "pending").length;
    const inProgress = complaints.filter((c) => c.status === "in_progress").length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    const closed = complaints.filter((c) => c.status === "closed").length;
    return { total, pending, inProgress, resolved, closed };
  }, [complaints]);
  const getStatusBadge = reactExports.useCallback((status) => {
    const map = {
      pending: {
        label: isArabic ? "⏳ قيد المراجعة" : "⏳ Pending",
        color: "text-amber-600 border-amber-500/30",
        bg: "bg-amber-500/10",
        icon: Clock
      },
      in_progress: {
        label: isArabic ? "🔄 قيد المعالجة" : "🔄 In Progress",
        color: "text-[#3a8a82] border-[#3a8a82]/30",
        bg: "bg-[#3a8a82]/10",
        icon: LoaderCircle
      },
      resolved: {
        label: isArabic ? "✅ تم الحل" : "✅ Resolved",
        color: "text-emerald-600 border-emerald-500/30",
        bg: "bg-emerald-500/10",
        icon: CircleCheck
      },
      closed: {
        label: isArabic ? "📌 مغلقة" : "📌 Closed",
        color: "text-[#f9a8d4] border-[#f9a8d4]/30",
        bg: "bg-[#f9a8d4]/10",
        icon: CircleX
      }
    };
    return map[status] || map.pending;
  }, [isArabic]);
  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;
    if (!newStatus) {
      toast.warning(isArabic ? "⚠️ يرجى اختيار حالة جديدة" : "⚠️ Please select a new status");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateComplaint.mutateAsync({
        id: selectedComplaint.id,
        status: newStatus,
        admin_response: adminResponse || void 0
      });
      setReplyDialogOpen(false);
      setSelectedComplaint(null);
      setAdminResponse("");
      setNewStatus("");
      refetch();
      toast.success(
        isArabic ? "✅ تم تحديث حالة الشكوى بنجاح" : "✅ Complaint updated successfully"
      );
    } catch (error) {
      console.error("Error updating complaint:", error);
      toast.error(
        isArabic ? "❌ فشل تحديث الشكوى" : "❌ Failed to update complaint"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleExpand = reactExports.useCallback((id) => {
    setExpandedId((prev) => prev === id ? null : id);
  }, []);
  const openReplyDialog = reactExports.useCallback((complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAdminResponse(complaint.admin_response || "");
    setReplyDialogOpen(true);
  }, []);
  const exportToExcel = () => {
    const exportData = filteredComplaints.map((c) => ({
      "الموضوع": c.subject || "—",
      "العميل": c.profiles?.full_name || "—",
      "رقم الطلب": c.order_id || "—",
      "الحالة": isArabic ? c.status === "pending" ? "قيد المراجعة" : c.status === "in_progress" ? "قيد المعالجة" : c.status === "resolved" ? "تم الحل" : "مغلقة" : c.status,
      "تاريخ الشكوى": new Date(c.created_at).toLocaleDateString("ar-SA"),
      "رد الإدارة": c.admin_response || "—"
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "الشكاوى");
    ws["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 30 }];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `الشكاوى_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(isArabic ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 20px; }
        h1 { color: #2a655f; text-align: center; border-bottom: 2px solid #f9a8d4; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #2a655f; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style></head>
      <body>
        <h1>📊 تقرير الشكاوى</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA")}</p>
        <table>
          <thead><tr><th>#</th><th>الموضوع</th><th>العميل</th><th>رقم الطلب</th><th>الحالة</th><th>التاريخ</th></tr></thead>
          <tbody>
    `;
    filteredComplaints.forEach((c, i) => {
      const statusText = c.status === "pending" ? "قيد المراجعة" : c.status === "in_progress" ? "قيد المعالجة" : c.status === "resolved" ? "تم الحل" : "مغلقة";
      htmlContent += `
        <tr>
          <td>${i + 1}</td>
          <td>${c.subject || "—"}</td>
          <td>${c.profiles?.full_name || "—"}</td>
          <td>${c.order_id || "—"}</td>
          <td>${statusText}</td>
          <td>${new Date(c.created_at).toLocaleDateString("ar-SA")}</td>
        </tr>
      `;
    });
    htmlContent += `
          </tbody></table>
          <div class="footer">إجمالي الشكاوى: ${filteredComplaints.length}</div>
        </body></html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs(blob, `الشكاوى_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(isArabic ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-[#2a655f] animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse", children: isArabic ? "⏳ جاري تحميل الشكاوى..." : "⏳ Loading complaints..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent", children: isArabic ? "الشكاوى" : "Complaints" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" }),
            isArabic ? "مباشر" : "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: stats.total }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "إجمالي" : "total" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-amber-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: stats.pending }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "قيد المراجعة" : "pending" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: stats.resolved }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isArabic ? "تم الحل" : "resolved" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: exportToExcel,
              disabled: filteredComplaints.length === 0,
              className: "rounded-lg h-9 px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-800 gap-2 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Excel" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: exportToWord,
              disabled: filteredComplaints.length === 0,
              className: "rounded-lg h-9 px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-800 gap-2 transition-all duration-300",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs font-medium", children: "Word" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-slate-300/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => refetch(),
              className: "rounded-lg h-9 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-300",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
          isArabic ? "تقرير لحظي" : "Live Report"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCards, { stats, isArabic }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-focus-within:text-[#d81b60] transition-colors duration-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            },
            placeholder: isArabic ? "🔍 بحث عن شكوى..." : "🔍 Search complaints...",
            className: "ps-9 h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300 hover:border-pink-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterStatus,
          onValueChange: (value) => {
            setFilterStatus(value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[140px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-[#d81b60]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "الحالة" : "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: isArabic ? "📋 الكل" : "📋 All" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "pending", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "⏳ ",
                isArabic ? "قيد المراجعة" : "Pending"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "in_progress", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "🔄 ",
                isArabic ? "قيد المعالجة" : "In Progress"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "resolved", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "✅ ",
                isArabic ? "تم الحل" : "Resolved"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "closed", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "📌 ",
                isArabic ? "مغلقة" : "Closed"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: sortBy,
          onValueChange: (value) => {
            setSortBy(value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[140px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-[#d81b60]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "ترتيب حسب" : "Sort by" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "created_at", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "📅 ",
                isArabic ? "التاريخ" : "Date"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "status", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "📊 ",
                isArabic ? "الحالة" : "Status"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: sortOrder,
          onValueChange: (value) => {
            setSortOrder(value);
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[100px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "ترتيب" : "Order" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "desc", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "⬇️ ",
                isArabic ? "تنازلي" : "Descending"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "asc", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                "⬆️ ",
                isArabic ? "تصاعدي" : "Ascending"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(limit),
          onValueChange: (value) => {
            setLimit(Number(value));
            setPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[100px] h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: isArabic ? "عدد" : "Show" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: "6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: "10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: "20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: "50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "100", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: "100" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            setSearchQuery("");
            setFilterStatus("all");
            setSortBy("created_at");
            setSortOrder("desc");
            setPage(1);
          },
          className: "h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "مسح الكل" : "Clear all"
          ]
        }
      )
    ] }),
    filteredComplaints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-dashed border-pink-400/60 dark:border-pink-400/40 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 flex items-center justify-center mx-auto mb-4 animate-bounce-slow border-2 border-pink-400/60 dark:border-pink-400/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-10 w-10 text-[#2a655f]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-slate-900 dark:text-white", children: searchQuery ? isArabic ? "لا توجد نتائج" : "No results found" : isArabic ? "لا توجد شكاوى" : "No complaints" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: searchQuery ? isArabic ? `لا توجد شكاوى تطابق "${searchQuery}"` : `No complaints match "${searchQuery}"` : isArabic ? "لم يتم تقديم أي شكاوى حتى الآن" : "No complaints have been submitted yet" }),
      searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setSearchQuery(""),
          className: "mt-4 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300",
          children: isArabic ? "مسح البحث" : "Clear search"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-2 border-pink-400/60 dark:border-pink-400/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[60px] border-r-2 border-pink-400/30 dark:border-pink-400/20", children: isArabic ? "الترتيب" : "Rank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[200px] border-r-2 border-pink-400/30 dark:border-pink-400/20", children: isArabic ? "الموضوع" : "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-pink-400/30 dark:border-pink-400/20", children: isArabic ? "رقم الطلب" : "Order ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-pink-400/30 dark:border-pink-400/20", children: isArabic ? "الحالة" : "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px]", children: isArabic ? "إجراءات" : "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: paginatedComplaints.map((complaint, index) => {
          const rank = (page - 1) * limit + index + 1;
          const isExpanded = expandedId === complaint.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(React__default.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ComplaintRow,
              {
                complaint,
                isExpanded,
                onToggle: toggleExpand,
                onReply: openReplyDialog,
                isArabic,
                getStatusBadge,
                index,
                rank
              }
            ),
            isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "border-none hover:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "p-0 border-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ComplaintDetails,
              {
                complaint,
                isArabic,
                onReply: openReplyDialog
              }
            ) }) })
          ] }, complaint.id);
        }) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t-2 border-pink-400/30 dark:border-pink-400/20 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400", children: filteredComplaints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "لا توجد شكاوى" : "No complaints" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" }),
          isArabic ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredComplaints.length)} من ${filteredComplaints.length} شكوى` : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredComplaints.length)} of ${filteredComplaints.length} complaints`
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "«" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page - 1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: page === pageNum ? "default" : "outline",
                  size: "sm",
                  onClick: () => goToPage(pageNum),
                  className: cn(
                    "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                    page === pageNum ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#f9a8d4]/30 border-2 border-white/30 scale-105" : "border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800"
                  ),
                  children: pageNum
                },
                pageNum
              );
            }),
            totalPages > 5 && page < totalPages - 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm px-1", children: "..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => goToPage(totalPages),
                  className: "h-8 min-w-[32px] p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 text-xs transition-all duration-300",
                  children: totalPages
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page + 1),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(totalPages),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "»" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-pink-400/30 dark:border-pink-400/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40", children: isArabic ? `عرض ${paginatedComplaints.length} من ${filteredComplaints.length}` : `Showing ${paginatedComplaints.length} of ${filteredComplaints.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: isArabic ? `إجمالي ${complaints.length}` : `Total ${complaints.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40", children: [
            sortBy === "created_at" ? isArabic ? "📅 التاريخ" : "📅 Date" : isArabic ? "📊 الحالة" : "📊 Status",
            sortOrder === "desc" ? " ↓" : " ↑"
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40", children: [
            "🔍 ",
            searchQuery
          ] }),
          filterStatus !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40", children: getStatusBadge(filterStatus).label })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: replyDialogOpen, onOpenChange: setReplyDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 z-20 transition-all duration-300 border-2 border-slate-300",
          onClick: () => setReplyDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-400 hover:text-slate-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-3 text-xl text-[#2a655f] dark:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-4 w-4 text-white" }) }),
            isArabic ? "رد على الشكوى" : "Reply to Complaint"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? `شكوى بخصوص الطلب #${selectedComplaint?.order_id?.slice(0, 12)}` : `Complaint for order #${selectedComplaint?.order_id?.slice(0, 12)}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white font-semibold", children: isArabic ? "الحالة الجديدة" : "New Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newStatus, onValueChange: setNewStatus, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر حالة" : "Select status" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "pending", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                  "⏳ ",
                  isArabic ? "قيد المراجعة" : "Pending"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "in_progress", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                  "🔄 ",
                  isArabic ? "قيد المعالجة" : "In Progress"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "resolved", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                  "✅ ",
                  isArabic ? "تم الحل" : "Resolved"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "closed", className: "hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors", children: [
                  "📌 ",
                  isArabic ? "مغلقة" : "Closed"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[#2a655f] dark:text-white font-semibold", children: isArabic ? "الرد (اختياري)" : "Response (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: adminResponse,
                onChange: (e) => setAdminResponse(e.target.value),
                placeholder: isArabic ? "اكتب ردك على الشكوى..." : "Write your response to the complaint...",
                className: "min-h-[100px] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-4 border-t-2 border-pink-400/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setReplyDialogOpen(false),
              className: "rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300",
              children: isArabic ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleUpdateComplaint,
              disabled: isSubmitting,
              className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/40 px-6",
              children: [
                isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
                isArabic ? "تحديث وإرسال" : "Update & Send"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      ` })
  ] });
}
const NAV_ICONS = {
  overview: {
    icon: LayoutDashboard,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
  listings: {
    icon: Package,
    animation: "animate-pulse-slow",
    color: "text-[#2a655f]"
  },
  stores: {
    icon: Store,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  delivery: {
    icon: Truck,
    animation: "animate-bounce-slow",
    color: "text-[#2a655f]"
  },
  promo: {
    icon: Tag,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  complaints: {
    icon: TriangleAlert,
    animation: "animate-pulse-slow",
    color: "text-[#2a655f]"
  },
  applications: {
    icon: ShieldCheck,
    animation: "animate-float",
    color: "text-[#2a655f]"
  },
  banners: {
    icon: Image,
    animation: "animate-pulse-slow",
    color: "text-[#2a655f]"
  },
  announcements: {
    icon: Megaphone,
    animation: "animate-bounce-slow",
    color: "text-[#2a655f]"
  },
  categories: {
    icon: Tags,
    animation: "animate-spin-slow",
    color: "text-[#2a655f]"
  },
  notifications: {
    icon: Bell,
    animation: "animate-float",
    color: "text-[#2a655f]"
  }
};
const LiveIndicator = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a655f] opacity-75" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,0.8)]" })
] });
const SystemSlider = ({ isRTL }) => {
  const [currentSlide, setCurrentSlide] = reactExports.useState(0);
  const [isAutoPlay, setIsAutoPlay] = reactExports.useState(true);
  const totalSlides = 5;
  const slides = [
    {
      id: 1,
      icon: "🏛️",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "نظام إدارة السوق الذكي",
      subtitle_en: "Smart Marketplace Management System",
      desc_ar: "منصة سوق متكاملة تربط البائعين والمشترين في بيئة آمنة وسهلة الاستخدام",
      desc_en: "An integrated marketplace platform connecting buyers and sellers in a secure, user-friendly environment"
    },
    {
      id: 2,
      icon: "🛡️",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "أمان وحماية متكاملة",
      subtitle_en: "Complete Security & Protection",
      desc_ar: "نظام حماية المشتري والبائع مع توثيق الهوية ومراقبة الطلبات لحماية جميع الأطراف",
      desc_en: "Buyer and seller protection system with identity verification and order monitoring"
    },
    {
      id: 3,
      icon: "📊",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "تحليلات وتقارير فورية",
      subtitle_en: "Real-time Analytics & Reports",
      desc_ar: "لوحة تحكم متقدمة تعرض مؤشرات الأداء والإحصائيات لحظياً لاتخاذ قرارات ذكية",
      desc_en: "Advanced dashboard displaying real-time KPIs and statistics for smart decision making"
    },
    {
      id: 4,
      icon: "🚀",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "توصيل ذكي ومتكامل",
      subtitle_en: "Smart Integrated Delivery",
      desc_ar: "نظام توصيل متطور يدعم شركات متعددة وتتبع الطلبات في الوقت الفعلي",
      desc_en: "Advanced delivery system supporting multiple companies and real-time order tracking"
    },
    {
      id: 5,
      icon: "💎",
      title_ar: "ذوق | Zooq",
      title_en: "Zooq",
      subtitle_ar: "تجربة مستخدم فريدة",
      subtitle_en: "Unique User Experience",
      desc_ar: "واجهات مستخدم حديثة ومتجاوبة مع دعم كامل للغتين العربية والإنجليزية",
      desc_en: "Modern, responsive user interfaces with full Arabic and English language support"
    }
  ];
  reactExports.useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5e3);
    return () => clearInterval(interval);
  }, [isAutoPlay, totalSlides]);
  const goToSlide = reactExports.useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8e3);
  }, []);
  const nextSlide = reactExports.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);
  const prevSlide = reactExports.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);
  const current = slides[currentSlide];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] shadow-xl shadow-[#2a655f]/20 border-2 border-[#2a655f]/30 group min-h-[100px] sm:min-h-[100px] md:min-h-[105px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 h-32 w-32 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse delay-1000" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 flex items-center gap-2.5 sm:gap-3 md:gap-3.5 z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl bg-white/30 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg shadow-[#2a655f]/20 animate-float group-hover:scale-110 transition-transform duration-500", children: current.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2a655f]/30 to-[#3a8a82]/30 blur-lg animate-pulse" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-right w-full min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: `text-sm sm:text-sm md:text-lg font-bold text-white mb-0.5 tracking-tight ${isRTL ? "font-arabic" : ""}`, children: isRTL ? current.title_ar : current.title_en }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: `text-xs sm:text-xs md:text-base font-bold text-[#e8f0ee] mb-0.5 tracking-tight ${isRTL ? "font-arabic" : ""}`, children: isRTL ? current.subtitle_ar : current.subtitle_en }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] sm:text-[11px] md:text-xs text-[#e8f0ee]/80 max-w-2xl leading-relaxed hidden sm:block ${isRTL ? "font-arabic" : ""}`, children: isRTL ? current.desc_ar : current.desc_en })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-row sm:flex-col gap-1.5 sm:gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: prevSlide,
            className: "h-7 w-7 sm:h-7 sm:w-7 md:h-6 md:w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 flex items-center justify-center",
            "aria-label": "Previous",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft$1, { className: "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: nextSlide,
            className: "h-7 w-7 sm:h-7 sm:w-7 md:h-6 md:w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 flex items-center justify-center",
            "aria-label": "Next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight$1, { className: "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10", children: [
      Array.from({ length: totalSlides }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => goToSlide(index),
          "aria-label": `Slide ${index + 1}`,
          className: cn(
            "h-1 rounded-full transition-all duration-500",
            currentSlide === index ? "w-4 bg-white shadow-lg shadow-white/30" : "w-1 bg-white/40 hover:bg-white/60"
          )
        },
        index
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[7px] text-white/60 ml-1 font-mono font-bold", children: [
        currentSlide + 1,
        "/",
        totalSlides
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-0.5 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" })
  ] });
};
function AdminDashboard({ notificationButton }) {
  const app = useApp();
  useNavigate();
  const [tab, setTab] = reactExports.useState("overview");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = reactExports.useState(false);
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  reactExports.useEffect(() => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, [tab]);
  const handleTabChange = reactExports.useCallback((newTab) => {
    setTab(newTab);
    const url = new URL(window.location.href);
    if (newTab === "overview") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", newTab);
    }
    window.history.pushState({}, "", url.toString());
  }, []);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl) {
      const validTabs = [
        "overview",
        "listings",
        "stores",
        "delivery",
        "promo",
        "complaints",
        "applications",
        "banners",
        "announcements",
        "categories",
        "notifications"
      ];
      if (validTabs.includes(tabFromUrl)) {
        setTab(tabFromUrl);
      }
    }
  }, []);
  reactExports.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get("tab");
      if (tabFromUrl) {
        const validTabs = [
          "overview",
          "listings",
          "stores",
          "delivery",
          "promo",
          "complaints",
          "applications",
          "banners",
          "announcements",
          "categories",
          "notifications"
        ];
        if (validTabs.includes(tabFromUrl)) {
          setTab(tabFromUrl);
        }
      } else {
        setTab("overview");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const isRTL = app.lang === "ar";
  const getFilteredData = (data, searchFields, searchTerm) => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase().trim();
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === void 0) return false;
        return String(value).toLowerCase().includes(q);
      });
    });
  };
  const { data: allListings = [] } = useAllListingsAdmin();
  const { data: allStores = [] } = useAdminAllStores();
  const { data: allApplications = [] } = useAllSellerApplications();
  const filteredListings = reactExports.useMemo(() => {
    return getFilteredData(allListings, ["title_ar", "title_en", "description_ar", "description_en", "id"], searchQuery);
  }, [allListings, searchQuery]);
  const filteredStores = reactExports.useMemo(() => {
    return getFilteredData(allStores, ["store_name", "store_description", "full_name", "email", "phone"], searchQuery);
  }, [allStores, searchQuery]);
  const filteredApplications = reactExports.useMemo(() => {
    return getFilteredData(allApplications, ["store_name", "store_description", "user_id", "id", "status"], searchQuery);
  }, [allApplications, searchQuery]);
  const searchResults = reactExports.useMemo(() => {
    return {
      products: filteredListings.length,
      stores: filteredStores.length,
      applications: filteredApplications.length,
      total: filteredListings.length + filteredStores.length + filteredApplications.length
    };
  }, [filteredListings, filteredStores, filteredApplications]);
  const getBestTab = () => {
    const results = [
      { tab: "listings", count: filteredListings.length, label: app.lang === "ar" ? "المنتجات" : "Products" },
      { tab: "stores", count: filteredStores.length, label: app.lang === "ar" ? "المتاجر" : "Stores" },
      { tab: "applications", count: filteredApplications.length, label: app.lang === "ar" ? "طلبات البائعين" : "Applications" }
    ];
    results.sort((a, b) => b.count - a.count);
    return results[0];
  };
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowSearchResultsPage(true);
      const bestTab = getBestTab();
      if (bestTab.count > 0) {
        handleTabChange(bestTab.tab);
      }
    }
  };
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResultsPage(false);
  };
  const showSearchResults = searchQuery.trim().length > 0 && showSearchResultsPage;
  const nav = [
    { id: "overview", label: app.lang === "ar" ? "نظرة عامة" : "Overview", iconKey: "overview" },
    { id: "listings", label: app.lang === "ar" ? "المنتجات" : "Products", iconKey: "listings" },
    { id: "stores", label: app.lang === "ar" ? "المتاجر" : "Stores", iconKey: "stores" },
    { id: "delivery", label: app.lang === "ar" ? "شركات التوصيل" : "Delivery Companies", iconKey: "delivery" },
    { id: "promo", label: app.lang === "ar" ? "أكواد الخصم" : "Promo Codes", iconKey: "promo" },
    { id: "complaints", label: app.lang === "ar" ? "الشكاوى" : "Complaints", iconKey: "complaints" },
    { id: "applications", label: app.lang === "ar" ? "طلبات البائعين" : "Seller applications", iconKey: "applications" },
    { id: "banners", label: app.lang === "ar" ? "البنرات" : "Banners", iconKey: "banners" },
    { id: "announcements", label: app.lang === "ar" ? "شريط الإعلانات" : "Announcements", iconKey: "announcements" },
    { id: "categories", label: app.lang === "ar" ? "التصنيفات" : "Categories", iconKey: "categories" },
    { id: "notifications", label: app.lang === "ar" ? "الإشعارات" : "Notifications", iconKey: "notifications" }
  ];
  const getIconConfig = (iconKey) => {
    return NAV_ICONS[iconKey] || NAV_ICONS.overview;
  };
  const formattedTime = currentTime.toLocaleTimeString(app.lang === "ar" ? "ar-SA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-h-screen bg-gradient-to-br from-white via-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#2a655f]/5 ${isRTL ? "font-arabic" : ""}`, dir: isRTL ? "rtl" : "ltr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 shadow-lg shadow-[#2a655f]/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex items-center gap-2 sm:gap-4 min-w-0 ${isRTL ? "flex-row-reverse" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 group min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-[#2a655f]/20 to-transparent animate-pulse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-sm sm:text-lg group-hover:text-[#3a8a82] transition-colors truncate", children: app.lang === "ar" ? "لوحة الأدمن" : "Admin Panel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 bg-[#2a655f]/20 text-[#2a655f] dark:text-[#2a655f] border-0 animate-pulse shrink-0", children: [
                "🟢 ",
                app.lang === "ar" ? "نشط" : "Active"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[10px] text-[#2a655f] dark:text-[#3a8a82] -mt-0.5 font-semibold truncate", children: app.lang === "ar" ? "تحكم كامل في المنصة" : "Full Platform Control" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 sm:gap-3 shrink-0 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 border-2 border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-slate-600 dark:text-slate-300", children: formattedTime }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LiveIndicator, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden md:block group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f] transition-colors duration-300 group-focus-within:text-[#2a655f]` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: app.lang === "ar" ? "بحث في لوحة التحكم..." : "Search dashboard...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                onKeyDown: handleSearch,
                className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} w-64 h-9 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 focus:bg-white dark:focus:bg-slate-800/50 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-[#2a655f]/20`
              }
            ),
            searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: clearSearch,
                className: `absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-[#2a655f] hover:text-[#3a8a82] transition-colors duration-200`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          notificationButton,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex flex-col items-end text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-tight", children: app.user?.name || "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] sm:text-[9px] text-[#2a655f] dark:text-[#3a8a82] font-semibold", children: app.lang === "ar" ? "مدير النظام" : "System Administrator" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-[#2a655f]/40 group-hover:ring-[#2a655f]/60 transition-all duration-300 group-hover:scale-105 cursor-pointer shrink-0", children: app.user?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: app.user.avatar_url, alt: app.user.name || "Admin", className: "object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs sm:text-sm font-bold", children: app.user?.name?.charAt(0)?.toUpperCase() || "A" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#2a655f] border-2 border-white dark:border-slate-900 animate-pulse shadow-[0_0_12px_rgba(42,101,95,0.8)]" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 relative z-0", children: [
      !showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 sm:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SystemSlider, { isRTL }) }),
      showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-4 sm:mb-6 animate-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3", children: [
          { key: "listings", label: app.lang === "ar" ? "المنتجات" : "Products", count: searchResults.products, icon: Package },
          { key: "stores", label: app.lang === "ar" ? "المتاجر" : "Stores", count: searchResults.stores, icon: Store },
          { key: "applications", label: app.lang === "ar" ? "طلبات البائعين" : "Applications", count: searchResults.applications, icon: ShieldCheck }
        ].map((item) => {
          const isActive = tab === item.key;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              tabIndex: -1,
              onMouseDown: (e) => e.preventDefault(),
              onClick: () => {
                handleTabChange(item.key);
                setShowSearchResultsPage(false);
              },
              className: `bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-2.5 sm:p-3 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group ${isActive ? "ring-2 ring-[#2a655f] border-[#2a655f] shadow-lg shadow-[#2a655f]/20" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-[#2a655f]/20 shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: `h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-[#2a655f]" : "text-[#2a655f]"}` }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 truncate", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]", children: item.count })
                  ] })
                ] }),
                item.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[9px] sm:text-[10px] text-[#2a655f] font-medium hover:underline transition-all", children: [
                  app.lang === "ar" ? "عرض الكل" : "View all",
                  " →"
                ] })
              ]
            },
            item.key
          );
        }) }),
        searchResults.total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-8 sm:p-12 text-center shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 sm:h-10 sm:w-10 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base sm:text-lg font-semibold text-slate-900 dark:text-white", children: app.lang === "ar" ? "لا توجد نتائج" : "No results found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: app.lang === "ar" ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4 rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10",
              onClick: clearSearch,
              children: app.lang === "ar" ? "مسح البحث" : "Clear search"
            }
          )
        ] })
      ] }),
      !showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 sm:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 shadow-xl shadow-[#2a655f]/10 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center p-1.5 gap-1.5 overflow-x-auto", children: nav.map((n) => {
          const iconConfig = getIconConfig(n.iconKey);
          const Icon = iconConfig.icon;
          const isActive = tab === n.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              tabIndex: -1,
              onMouseDown: (e) => e.preventDefault(),
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTabChange(n.id);
              },
              className: `
                        relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 whitespace-nowrap flex-1 text-center justify-center group
                        ${isActive ? "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-xl shadow-[#2a655f]/40 scale-[1.03] border-2 border-[#2a655f]/50" : "text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 hover:text-[#2a655f] dark:hover:text-[#2a655f]"}
                      `,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative transition-all duration-500 ${isActive ? "scale-110 animate-pulse" : "group-hover:scale-110 group-hover:rotate-6"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Icon,
                    {
                      className: `h-5 w-5 ${isActive ? "text-white" : "text-[#2a655f] group-hover:text-[#2a655f]"}`
                    }
                  ),
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white/60 animate-ping" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${isActive ? "text-white" : "group-hover:text-[#2a655f]"}`, children: n.label }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse ml-1" })
              ]
            },
            n.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory",
              style: {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch"
              },
              children: nav.map((n) => {
                const iconConfig = getIconConfig(n.iconKey);
                const Icon = iconConfig.icon;
                const isActive = tab === n.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    tabIndex: -1,
                    onMouseDown: (e) => e.preventDefault(),
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTabChange(n.id);
                    },
                    className: `
                          relative flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl 
                          text-[10px] font-bold transition-all duration-300 shrink-0 min-w-[85px] snap-start
                          ${isActive ? "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/40 border-2 border-[#2a655f]/50 scale-[1.02]" : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20"}
                        `,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4.5 w-4.5 ${isActive ? "text-white" : "text-[#2a655f]"}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-tight text-center whitespace-nowrap", children: n.label }),
                      isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 h-1 w-6 rounded-full bg-white/70 animate-pulse" })
                    ]
                  },
                  n.id
                );
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-[#2a655f]/60 font-semibold", children: app.lang === "ar" ? "اسحب للمزيد" : "Swipe for more" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft$1, { className: "h-3 w-3 text-[#2a655f]/60 animate-pulse" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-0", children: [
        tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminOverview, { onGoto: handleTabChange, searchQuery: showSearchResults ? searchQuery : "" }),
        tab === "listings" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminListings, {}),
        tab === "stores" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminStores, {}),
        tab === "delivery" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDeliveryCompanies, {}),
        tab === "promo" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPromoCodes, {}),
        tab === "complaints" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminComplaints, {}),
        tab === "applications" && /* @__PURE__ */ jsxRuntimeExports.jsx(SellerApplicationsAdmin, {}),
        tab === "banners" && /* @__PURE__ */ jsxRuntimeExports.jsx(BannersAdminPage, {}),
        tab === "announcements" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementsAdmin, {}),
        tab === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriesAdmin, {}),
        tab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNotifications, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 sm:mt-12 pt-4 sm:pt-6 border-t-2 border-[#2a655f]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-4 flex-wrap justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-[#3a8a82] font-medium", children: app.lang === "ar" ? "© 2024 جميع الحقوق محفوظة" : "© 2024 All rights reserved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#2a655f]/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[#2a655f] dark:text-[#3a8a82]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LiveIndicator, {}),
            app.lang === "ar" ? "النظام يعمل بشكل طبيعي" : "System operational"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 flex-wrap justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "v2.0.0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#2a655f]/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            app.lang === "ar" ? "مدعوم من" : "Powered by",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-[#3a8a82] font-bold hover:text-[#3a8a82] transition-colors duration-300", children: "Zooq" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-[#2a655f] animate-pulse" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        /* ✅ إخفاء scrollbar للتابات على الموبايل */
        .md\\:hidden .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      ` })
  ] });
}
export {
  AdminDashboard as A
};
