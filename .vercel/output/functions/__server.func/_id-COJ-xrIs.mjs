import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { bk as Route$f, u as useApp, a as useT, ay as useDistributors, az as useDeliveryOrders, aH as Skeleton, b as Button, B as Badge, T as Tabs, h as TabsList, i as TabsTrigger, aC as TabsContent, c as cn } from "./_ssr/router-BU7AgYzK.mjs";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle, d as CardDescription } from "./_ssr/card-C7XU6h8z.mjs";
import "./_libs/sonner.mjs";
import { U as User, a as ChevronLeft, e as CircleCheckBig, N as CircleX, m as Truck, h as Star, P as Package, r as Phone, as as Mail, a0 as MapPin, o as MessageCircle, a5 as Navigation, ak as TrendingUp, bU as DollarSign } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/client-DEhnCGNP.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-tooltip.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/zustand.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/react-intersection-observer.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__react-radio-group.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/radix-ui__react-checkbox.mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
function DistributorProfilePage() {
  const {
    id
  } = Route$f.useParams();
  const app = useApp();
  useT();
  const [activeTab, setActiveTab] = reactExports.useState("info");
  const {
    data: distributors = [],
    isLoading: loadingDistributor
  } = useDistributors({
    isAvailable: true
  });
  const {
    data: orders = [],
    isLoading: loadingOrders
  } = useDeliveryOrders(app.user?.id);
  const distributor = reactExports.useMemo(() => {
    return distributors.find((d) => d.id === id);
  }, [distributors, id]);
  const distributorOrders = reactExports.useMemo(() => {
    return orders.filter((o) => o.distributor_id === id);
  }, [orders, id]);
  const stats = reactExports.useMemo(() => {
    if (!distributor) return null;
    const total = distributorOrders.length;
    const delivered = distributorOrders.filter((o) => o.status === "delivered").length;
    const cancelled = distributorOrders.filter((o) => o.status === "cancelled").length;
    const inProgress = distributorOrders.filter((o) => ["pending", "assigned", "picked_up", "in_transit"].includes(o.status)).length;
    const totalRevenue = distributorOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
    const completionRate = total > 0 ? Math.round(delivered / total * 100) : 0;
    return {
      total,
      delivered,
      cancelled,
      inProgress,
      totalRevenue,
      completionRate
    };
  }, [distributor, distributorOrders]);
  const isArabic = app.lang === "ar";
  if (loadingDistributor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full mt-4 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full mt-4 rounded-2xl" })
    ] }) });
  }
  if (!distributor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10 text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: isArabic ? "لم نجد الموزع" : "Distributor Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: isArabic ? "لا يوجد موزع بهذا المعرف" : "No distributor found with this ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/distributors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isArabic ? "العودة للموزعين" : "Back to Distributors" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-4xl px-4 py-6 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/distributors", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180" }),
          isArabic ? "الموزعين" : "Distributors"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: isArabic ? "ملف الموزع" : "Distributor Profile" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-4 -mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#2a655f]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg", children: distributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: distributor.avatar_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-12 w-12 text-[#2a655f]" }) }),
          distributor.is_available && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }),
            distributor.is_available ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500 text-white border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
              isArabic ? "متاح" : "Available"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500 text-white border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-1" }),
              isArabic ? "غير متاح" : "Unavailable"
            ] }),
            distributor.distributor_type === "company_employee" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500 text-white border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 mr-1" }),
              isArabic ? "موظف شركة" : "Company Employee"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }),
              Number(distributor.rating || 0).toFixed(1),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "(",
                distributor.reviews_count || 0,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
              stats?.delivered || 0,
              " ",
              isArabic ? "طلب مكتمل" : "delivered"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { dir: "ltr", children: distributor.phone })
            ] }),
            distributor.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
                distributor.email
              ] })
            ] })
          ] }),
          distributor.address_ar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#2a655f]" }),
            isArabic ? distributor.address_ar : distributor.address_en || distributor.address_ar
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 mt-4 md:mt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 mr-1" }),
            isArabic ? "مراسلة" : "Message"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-4 w-4 mr-1" }),
            isArabic ? "تتبع" : "Track"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Package, label: isArabic ? "إجمالي الطلبات" : "Total Orders", value: stats?.total || 0, color: "blue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheckBig, label: isArabic ? "مكتمل" : "Completed", value: stats?.delivered || 0, color: "green" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: TrendingUp, label: isArabic ? "نسبة الإنجاز" : "Completion Rate", value: `${stats?.completionRate || 0}%`, color: "purple" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: DollarSign, label: isArabic ? "الأرباح" : "Earnings", value: `${stats?.totalRevenue.toLocaleString() || 0}`, color: "emerald" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-4 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: (v) => setActiveTab(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "info", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
          isArabic ? "معلومات" : "Info"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "reviews", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4" }),
          isArabic ? "التقييمات" : "Reviews"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "orders", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
          isArabic ? "الطلبات" : "Orders"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "info", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-[#2a655f]" }),
          isArabic ? "معلومات الموزع" : "Distributor Info"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "الاسم الكامل" : "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "رقم الهاتف" : "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", dir: "ltr", children: distributor.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "البريد الإلكتروني" : "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: distributor.email || (isArabic ? "غير مسجل" : "Not registered") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "نوع الموزع" : "Distributor Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: distributor.distributor_type === "company_employee" ? isArabic ? "موظف شركة توصيل" : "Company Employee" : isArabic ? "موزع مستقل" : "Freelance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl col-span-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "العنوان" : "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? distributor.address_ar : distributor.address_en || distributor.address_ar || (isArabic ? "غير محدد" : "Not specified") })
            ] })
          ] }),
          distributor.delivery_company_id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: isArabic ? "تابع لشركة:" : "Belongs to:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-bold", children: distributor.delivery_company?.name_ar || distributor.delivery_company?.name_en || (isArabic ? "شركة توصيل" : "Delivery Company") })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "reviews", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "تقييمات الموزع" : "Distributor Reviews"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? `${distributor.reviews_count || 0} تقييم` : `${distributor.reviews_count || 0} reviews` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingOrders ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }) : distributorOrders.filter((o) => o.distributor_rating).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "لا توجد تقييمات لهذا الموزع" : "No reviews for this distributor" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: distributorOrders.filter((o) => o.distributor_rating).slice(0, 10).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-4 w-4", i < (order.distributor_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200") }, i)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: order.distributor_rating?.toFixed(1) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: order.distributor_review || (isArabic ? "لا يوجد تعليق" : "No comment") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(order.delivered_at || order.created_at).toLocaleDateString() })
        ] }) }, order.id)) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "orders", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "طلبات الموزع" : "Distributor Orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? `عرض آخر ${Math.min(distributorOrders.length, 10)} طلبات` : `Showing latest ${Math.min(distributorOrders.length, 10)} orders` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingOrders ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) }) : distributorOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "لا توجد طلبات لهذا الموزع" : "No orders for this distributor" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          distributorOrders.slice(0, 10).map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderRow, { order }, order.id)),
          distributorOrders.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center pt-4", children: isArabic ? `و ${distributorOrders.length - 10} طلب آخر` : `And ${distributorOrders.length - 10} more orders` })
        ] }) })
      ] }) })
    ] }) })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg flex items-center justify-center", colors[color]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
  ] }) });
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
export {
  DistributorProfilePage as component
};
