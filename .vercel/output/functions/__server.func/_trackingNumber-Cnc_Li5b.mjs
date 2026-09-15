import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { bB as Route$6, u as useApp, aH as Skeleton, b as Button, c as cn, B as Badge } from "./_ssr/router-BU7AgYzK.mjs";
import { supabase } from "./_ssr/client-DEhnCGNP.mjs";
import "./_libs/sonner.mjs";
import { N as CircleX, w as House, a as ChevronLeft, a5 as Navigation, e as CircleCheckBig, P as Package, U as User, m as Truck, p as LoaderCircle, aG as Circle, a0 as MapPin, c as Store, h as Star, r as Phone, b as Clock } from "./_libs/lucide-react.mjs";
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
import "tslib";
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
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
function TrackingPage() {
  const {
    trackingNumber
  } = Route$6.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(true);
  const [order, setOrder] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("tracking");
  const isArabic = app.lang === "ar";
  reactExports.useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data,
          error: error2
        } = await supabase.from("delivery_orders").select(`
            *,
            distributor:distributor_id (
              id,
              user_id,
              full_name_ar,
              full_name_en,
              phone,
              avatar_url,
              rating,
              completed_orders,
              is_available
            ),
            orders:order_id (
              id,
              buyer_id,
              seller_id,
              listings:listing_id (
                id,
                title_ar,
                title_en,
                owner_id
              )
            )
          `).or(`tracking_number.eq.${trackingNumber},id.eq.${trackingNumber}`).maybeSingle();
        if (error2) throw error2;
        if (!data) {
          setError(isArabic ? "❌ لم يتم العثور على الطلب" : "❌ Order not found");
          setLoading(false);
          return;
        }
        setOrder(data);
        console.log("✅ Order found:", data);
      } catch (error2) {
        console.error("❌ Error fetching order:", error2);
        setError(isArabic ? "❌ حدث خطأ في جلب بيانات الطلب" : "❌ Error fetching order");
      } finally {
        setLoading(false);
      }
    };
    if (trackingNumber) {
      fetchOrder();
    }
  }, [trackingNumber, isArabic]);
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: isArabic ? "قيد المراجعة" : "Pending",
        color: "text-yellow-500",
        icon: Clock,
        step: 0
      },
      assigned: {
        label: isArabic ? "تم التعيين" : "Assigned",
        color: "text-purple-500",
        icon: User,
        step: 1
      },
      picked_up: {
        label: isArabic ? "تم الاستلام" : "Picked Up",
        color: "text-blue-500",
        icon: Package,
        step: 2
      },
      in_transit: {
        label: isArabic ? "قيد التوصيل" : "In Transit",
        color: "text-orange-500",
        icon: Truck,
        step: 3
      },
      delivered: {
        label: isArabic ? "تم التوصيل" : "Delivered",
        color: "text-green-500",
        icon: CircleCheckBig,
        step: 4
      },
      cancelled: {
        label: isArabic ? "ملغي" : "Cancelled",
        color: "text-red-500",
        icon: CircleX,
        step: -1
      }
    };
    return statusMap[status] || statusMap.pending;
  };
  const steps = [{
    label: isArabic ? "تم إنشاء الطلب" : "Order Created",
    icon: Package,
    key: "created"
  }, {
    label: isArabic ? "تم التعيين" : "Assigned",
    icon: User,
    key: "assigned"
  }, {
    label: isArabic ? "تم الاستلام" : "Picked Up",
    icon: Package,
    key: "picked_up"
  }, {
    label: isArabic ? "قيد التوصيل" : "In Transit",
    icon: Truck,
    key: "in_transit"
  }, {
    label: isArabic ? "تم التوصيل" : "Delivered",
    icon: CircleCheckBig,
    key: "delivered"
  }];
  const currentStep = order ? getStatusInfo(order.status).step : 0;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full mt-4 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full mt-4 rounded-2xl" })
    ] }) });
  }
  if (error || !order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-10 w-10 text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: isArabic ? "لم نجد الشحنة" : "Order Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: isArabic ? `لا توجد شحنة برقم التتبع "${trackingNumber}"` : `No order found with tracking number "${trackingNumber}"` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/distributor/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4 mr-2" }),
        isArabic ? "العودة للوحة التحكم" : "Back to Dashboard"
      ] }) })
    ] }) });
  }
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-3xl px-4 py-8 md:py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
          to: "/distributor/dashboard"
        }), className: "inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("h-4 w-4", isArabic && "rotate-180") }),
          isArabic ? "العودة" : "Back"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-7 w-7" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold", children: isArabic ? "🔍 تتبع الشحنة" : "🔍 Track Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm", children: isArabic ? `رقم التتبع: ${trackingNumber}` : `Tracking Number: ${trackingNumber}` })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-14 w-14 rounded-full flex items-center justify-center", statusInfo.color.replace("text-", "bg-") + "/10"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: cn("h-7 w-7", statusInfo.color) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "حالة الشحنة" : "Order Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xl font-bold", statusInfo.color), children: statusInfo.label }),
              order.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500 text-white border-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
                isArabic ? "تم التسليم" : "Delivered"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "تاريخ الطلب" : "Order Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: new Date(order.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-b mb-6", children: [{
        id: "tracking",
        label: isArabic ? "📍 التتبع" : "📍 Tracking",
        icon: Navigation
      }, {
        id: "details",
        label: isArabic ? "📋 التفاصيل" : "📋 Details",
        icon: Package
      }, {
        id: "distributor",
        label: isArabic ? "👤 الموزع" : "👤 Distributor",
        icon: User
      }].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? "border-[#2a655f] text-[#2a655f]" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { className: "h-4 w-4" }),
        tab.label
      ] }, tab.id)) }),
      activeTab === "tracking" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-6", children: isArabic ? "⏳ مسار الشحنة" : "⏳ Order Timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10", isCompleted ? "bg-[#2a655f] text-white" : isCurrent ? "bg-orange-500 text-white animate-pulse" : "bg-slate-200 dark:bg-slate-700 text-slate-400"), children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5" }) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-semibold", isCompleted ? "text-slate-900 dark:text-white" : isCurrent ? "text-orange-500" : "text-muted-foreground"), children: step.label }),
                isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-0 text-[9px]", children: [
                  "✅ ",
                  isArabic ? "مكتمل" : "Done"
                ] }),
                isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-orange-500/10 text-orange-600 border-0 text-[9px] animate-pulse", children: [
                  "● ",
                  isArabic ? "حالياً" : "Current"
                ] })
              ] }) })
            ] }, step.key);
          }) })
        ] })
      ] }),
      activeTab === "details" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-6", children: isArabic ? "📋 تفاصيل الشحنة" : "📋 Order Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "عنوان التسليم" : "Delivery Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: order.delivery_address || (isArabic ? "غير محدد" : "Not specified") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "عنوان الاستلام" : "Pickup Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: order.pickup_address || (isArabic ? "غير محدد" : "Not specified") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "رقم التتبع" : "Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm mt-1", dir: "ltr", children: trackingNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "رسوم التوصيل" : "Delivery Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-sm mt-1 text-[#2a655f]", children: [
              order.delivery_fee,
              " ",
              app.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "المبلغ" : "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-sm mt-1", children: [
              order.cod_amount,
              " ",
              app.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "الحالة" : "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm mt-1 text-[#2a655f]", children: statusInfo.label })
          ] })
        ] })
      ] }),
      activeTab === "distributor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-6", children: isArabic ? "👤 معلومات الموزع" : "👤 Distributor Info" }),
        order.distributor ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0", children: order.distributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: order.distributor.avatar_url, alt: "", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-10 w-10 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-bold", children: isArabic ? order.distributor.full_name_ar : order.distributor.full_name_en || order.distributor.full_name_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }),
                Number(order.distributor.rating || 0).toFixed(1)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
                order.distributor.completed_orders || 0,
                " ",
                isArabic ? "طلب" : "orders"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { dir: "ltr", children: order.distributor.phone })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "لم يتم تعيين موزع بعد" : "No distributor assigned yet" })
        ] })
      ] })
    ] })
  ] });
}
export {
  TrackingPage as component
};
