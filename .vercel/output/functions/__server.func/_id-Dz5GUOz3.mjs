import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate } from "./_libs/tanstack__react-router.mjs";
import { bD as Route$4, u as useApp, b as Button, c as cn, B as Badge, k as formatPrice } from "./_ssr/router-BU7AgYzK.mjs";
import { supabase } from "./_ssr/client-DEhnCGNP.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./_ssr/card-C7XU6h8z.mjs";
import "./_libs/sonner.mjs";
import { m as Truck, P as Package, w as House, a2 as ArrowRight, A as ArrowLeft, n as LayoutDashboard, cw as BadgeCheck, g as Sparkles, b as Clock, d2 as UserRound, a4 as CircleCheck, N as CircleX, c4 as Hash, O as Calendar, bU as DollarSign, d3 as Gauge, cx as MapPinned, r as Phone, i as ShoppingBag, k as ShieldCheck, b$ as Timer, aq as Award, Z as Zap } from "./_libs/lucide-react.mjs";
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
function DeliveryOrderDetailPage() {
  const {
    id
  } = Route$4.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const [order, setOrder] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const isArabic = app.lang === "ar";
  reactExports.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("delivery_orders").select(`
            *,
            orders:order_id (
              id,
              buyer_id,
              buyer_name,
              buyer_phone,
              total,
              delivery_fee,
              promo_discount,
              total_with_delivery,
              listings:listing_id (
                id,
                title_ar,
                title_en,
                cover_url
              )
            )
          `).eq("id", id).single();
        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error("❌ Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);
  const getStatusLabel = (status) => {
    const labels = {
      pending: isArabic ? "قيد المراجعة" : "Pending",
      assigned: isArabic ? "تم التعيين" : "Assigned",
      picked_up: isArabic ? "تم الاستلام" : "Picked up",
      in_transit: isArabic ? "قيد التوصيل" : "In Transit",
      delivered: isArabic ? "تم التوصيل" : "Delivered",
      cancelled: isArabic ? "ملغي" : "Cancelled",
      failed: isArabic ? "فشل" : "Failed"
    };
    return labels[status] || status;
  };
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      assigned: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      picked_up: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_transit: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return colors[status] || "bg-slate-500/10 text-slate-500";
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#2a655f]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-[#2a655f] animate-pulse" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground animate-pulse", children: isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..." })
    ] }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-[#0d2e2a]/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 text-[#0d2e2a]/40" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[#0d2e2a] dark:text-white", children: isArabic ? "الطلب غير موجود" : "Order not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: isArabic ? "الطلب الذي تبحث عنه غير موجود أو تم حذفه" : "The order you're looking for doesn't exist or was deleted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-6 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-105 rounded-xl px-6", onClick: () => navigate({
        to: "/delivery/dashboard"
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4 mr-2" }),
        isArabic ? "العودة للوحة التحكم" : "Back to Dashboard"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10 p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigate({
            to: "/delivery/dashboard",
            replace: true
          });
        }
      }, className: cn("group relative overflow-hidden bg-white dark:bg-slate-900/80 hover:bg-[#0d2e2a] dark:hover:bg-[#0d2e2a]", "text-[#0d2e2a] dark:text-white hover:text-white", "border-2 border-[#0d2e2a]/20 dark:border-slate-700/50 hover:border-[#0d2e2a] dark:hover:border-[#0d2e2a]", "shadow-md hover:shadow-xl hover:shadow-[#0d2e2a]/20", "transition-all duration-300 rounded-2xl px-5 py-2.5 h-auto", "hover:scale-[1.02] active:scale-[0.98]"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center", children: isArabic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 absolute -right-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300", style: {
              color: "white"
            } })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 absolute -left-1 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300", style: {
              color: "white"
            } })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: isArabic ? "الرجوع" : "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-[#0d2e2a]/20 dark:bg-white/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground group-hover:text-white/70 transition-colors duration-300 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-3 w-3" }),
            isArabic ? "لوحة التحكم" : "Dashboard"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] opacity-0 group-hover:opacity-10 transition-opacity duration-300" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-2xl border border-[#0d2e2a]/10 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-4 w-4 text-[#2a655f]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "طلب #" : "Order #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-[#0d2e2a] dark:text-white", children: order.id.substring(0, 8) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-0 shadow-2xl shadow-[#0d2e2a]/10 bg-white dark:bg-slate-900/90 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/5 to-[#2a655f]/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#2a655f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "relative border-b border-[#0d2e2a]/10 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2", children: [
                  isArabic ? "تفاصيل الطلب" : "Order Details",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-[#d4af37] animate-pulse" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  new Date(order.created_at).toLocaleString(isArabic ? "ar-SA" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn("border-0 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5", getStatusColor(order.status)), children: [
              order.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 animate-pulse" }),
              order.status === "assigned" && /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-3.5 w-3.5" }),
              order.status === "picked_up" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              order.status === "in_transit" && /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3.5 w-3.5 animate-bounce" }),
              order.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-3.5 w-3.5" }),
              order.status === "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
              getStatusLabel(order.status)
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
                isArabic ? "رقم الطلب" : "Order ID"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-sm text-[#0d2e2a] dark:text-white group-hover:text-[#2a655f] transition-colors", children: order.id.substring(0, 8) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
                isArabic ? "التاريخ" : "Date"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-[#0d2e2a] dark:text-white", children: new Date(order.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
                isArabic ? "رسوم التوصيل" : "Delivery Fee"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-[#2a655f] group-hover:scale-105 transition-transform", children: order.delivery_fee === 0 ? isArabic ? "🆓 مجاني" : "🆓 Free" : `${order.delivery_fee || 0} ${app.currency}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
                isArabic ? "رقم التتبع" : "Tracking"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-[#0d2e2a] dark:text-white", children: order.tracking_number || "-" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 bg-gradient-to-r from-[#0d2e2a]/5 to-[#2a655f]/5 dark:from-[#0d2e2a]/10 dark:to-[#2a655f]/10 rounded-2xl border-2 border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinned, { className: "h-5 w-5 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "📍 عنوان التوصيل" : "📍 Delivery Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#2a655f]/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] rounded-full px-2", children: isArabic ? "محدد" : "Set" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-[#0d2e2a] dark:text-white mt-1 leading-relaxed", children: order.delivery_address || order.pickup_address || (isArabic ? "غير محدد" : "Not specified") })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
            order.orders && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 bg-white dark:bg-slate-800/30 rounded-2xl border-2 border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-5 w-5 text-blue-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: isArabic ? "👤 معلومات العميل" : "👤 Customer Info" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[#0d2e2a] dark:text-white mt-1", children: order.orders.buyer_name || (isArabic ? "غير معروف" : "Unknown") }),
                order.orders.buyer_phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${order.orders.buyer_phone}`, className: "inline-flex items-center gap-2 mt-1 text-sm text-[#2a655f] hover:text-[#1a4f4a] hover:underline transition-all duration-300 group/phone", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 group-hover/phone:scale-110 transition-transform" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", dir: "ltr", children: order.orders.buyer_phone }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] rounded-full", children: isArabic ? "اتصل" : "Call" })
                ] })
              ] })
            ] }) }),
            order.orders?.listings && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 bg-white dark:bg-slate-800/30 rounded-2xl border-2 border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: order.orders.listings.cover_url || "/placeholder.png", alt: "", className: "h-full w-full object-cover", onError: (e) => e.target.src = "/placeholder.png" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 text-emerald-500" }),
                  isArabic ? "📦 المنتج" : "📦 Product"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[#0d2e2a] dark:text-white mt-1 truncate", children: order.orders.listings.title_ar || order.orders.listings.title_en || (isArabic ? "منتج" : "Product") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  isArabic ? "الكمية" : "Qty",
                  ": ",
                  order.orders.quantity || 1
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: isArabic ? "المجموع الفرعي" : "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#0d2e2a] dark:text-[#3a8a82]", children: formatPrice(order.orders?.total || 0, app.currency, app.lang) })
            ] }),
            order.orders?.delivery_fee !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-[#2a655f]/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: isArabic ? "سعر التوصيل" : "Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-sm font-medium", order.orders.delivery_fee === 0 ? "text-emerald-500 font-bold" : "text-[#0d2e2a] dark:text-[#3a8a82]"), children: order.orders.delivery_fee === 0 ? isArabic ? "🆓 مجاني" : "🆓 Free" : formatPrice(order.orders.delivery_fee, app.currency, app.lang) })
            ] }),
            order.orders?.promo_discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-[#2a655f]/10 text-emerald-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: isArabic ? "💚 الخصم" : "💚 Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold", children: [
                "-",
                formatPrice(order.orders.promo_discount, app.currency, app.lang)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3 pt-3 border-t-2 border-[#2a655f]/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-[#0d2e2a] dark:text-white", children: isArabic ? "الإجمالي الكامل" : "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "يشمل جميع الرسوم والضرائب" : "Includes all fees and taxes" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] rounded-full px-2.5 py-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3 mr-1" }),
                  isArabic ? "مدفوع" : "Paid"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl md:text-3xl font-black text-[#2a655f] dark:text-[#3a8a82] drop-shadow-[0_2px_15px_rgba(42,101,95,0.2)]", children: formatPrice(order.orders?.total_with_delivery || (order.orders?.total || 0) + (order.orders?.delivery_fee || 0) - (order.orders?.promo_discount || 0), app.currency, app.lang) })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 text-xs text-muted-foreground bg-white/80 dark:bg-slate-900/80 px-5 py-3 rounded-2xl border border-[#0d2e2a]/10 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            isArabic ? "آخر تحديث" : "Last updated",
            ": ",
            new Date(order.updated_at).toLocaleString(isArabic ? "ar-SA" : "en-US")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-px bg-[#0d2e2a]/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3.5 w-3.5 text-[#d4af37]" }),
            isArabic ? "طلب مؤكد" : "Verified Order"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl text-xs", onClick: () => window.print(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 mr-1.5" }),
          isArabic ? "طباعة" : "Print"
        ] })
      ] })
    ] })
  ] });
}
export {
  DeliveryOrderDetailPage as component
};
