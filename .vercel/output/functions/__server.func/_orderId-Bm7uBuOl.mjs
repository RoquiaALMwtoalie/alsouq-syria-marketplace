import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { bG as Route$1, u as useApp, a as useT, az as useDeliveryOrders, bH as useUpdateDeliveryOrderStatus, aH as Skeleton, b as Button, c as cn, j as Textarea } from "./_ssr/router-BU7AgYzK.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./_ssr/card-C7XU6h8z.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { supabase } from "./_ssr/client-DEhnCGNP.mjs";
import { _ as CircleAlert, b as Clock, e as CircleCheckBig, h as Star, a as ChevronLeft, P as Package, U as User, r as Phone, o as MessageCircle, p as LoaderCircle, Y as Send, a1 as Shield } from "./_libs/lucide-react.mjs";
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
function ReviewDistributorPage() {
  const {
    orderId
  } = Route$1.useParams();
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [rating, setRating] = reactExports.useState(0);
  const [hoverRating, setHoverRating] = reactExports.useState(0);
  const [review, setReview] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isSuccess, setIsSuccess] = reactExports.useState(false);
  const [selectedEmoji, setSelectedEmoji] = reactExports.useState("");
  const {
    data: orders = [],
    isLoading,
    refetch
  } = useDeliveryOrders(app.user?.id);
  const updateOrder = useUpdateDeliveryOrderStatus();
  const order = reactExports.useMemo(() => {
    return orders.find((o) => o.id === orderId);
  }, [orders, orderId]);
  const distributor = order?.distributor;
  const stats = reactExports.useMemo(() => {
    if (!distributor) return {
      rating: 0,
      orders: 0,
      reviews: 0
    };
    return {
      rating: distributor.rating || 0,
      orders: distributor.completed_orders || 0,
      reviews: distributor.reviews_count || 0
    };
  }, [distributor]);
  const isArabic = app.lang === "ar";
  const quickReviews = [{
    label: isArabic ? "👍 ممتاز" : "👍 Excellent",
    value: 5,
    emoji: "😍"
  }, {
    label: isArabic ? "😊 جيد جداً" : "😊 Very Good",
    value: 4,
    emoji: "😊"
  }, {
    label: isArabic ? "😐 جيد" : "😐 Good",
    value: 3,
    emoji: "😐"
  }, {
    label: isArabic ? "😕 مقبول" : "😕 Fair",
    value: 2,
    emoji: "😕"
  }, {
    label: isArabic ? "👎 سيء" : "👎 Poor",
    value: 1,
    emoji: "😞"
  }];
  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error(isArabic ? "الرجاء اختيار تقييم للموزع" : "Please select a rating for the distributor");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        status: order?.status || "delivered"
      });
      if (distributor?.user_id) {
        const {
          error: reviewError
        } = await supabase.from("reviews").insert({
          listing_id: order?.order_id || null,
          user_id: app.user?.id,
          rating,
          comment: review || (isArabic ? "شكراً على الخدمة" : "Thank you for the service"),
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (reviewError) {
          console.error("Error saving review:", reviewError);
        }
      }
      if (distributor?.id) {
        const newRating = (stats.rating * stats.reviews + rating) / (stats.reviews + 1);
        const {
          error: updateError
        } = await supabase.from("distributors").update({
          rating: newRating,
          reviews_count: (stats.reviews || 0) + 1
        }).eq("id", distributor.id);
        if (updateError) {
          console.error("Error updating distributor rating:", updateError);
        }
      }
      setIsSuccess(true);
      toast.success(isArabic ? "✅ تم إرسال تقييمك بنجاح! شكراً لك" : "✅ Review submitted successfully! Thank you");
      setTimeout(() => {
        navigate({
          to: "/distributor/dashboard"
        });
      }, 3e3);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(isArabic ? "❌ حدث خطأ في إرسال التقييم" : "❌ Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full mt-4 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full mt-4 rounded-2xl" })
    ] }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-10 w-10 text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: isArabic ? "لم نجد الطلب" : "Order Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: isArabic ? "لا يوجد طلب بهذا الرقم" : "No order found with this ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/distributor/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isArabic ? "العودة للوحة التحكم" : "Back to Dashboard" }) })
    ] }) });
  }
  if (order.status !== "delivered") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-10 w-10 text-yellow-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: isArabic ? "الطلب لم يتم توصيله بعد" : "Order Not Delivered Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: isArabic ? "يمكنك تقييم الموزع بعد اكتمال التوصيل" : "You can review the distributor after delivery is completed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/distributor/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isArabic ? "العودة للوحة التحكم" : "Back to Dashboard" }) })
    ] }) });
  }
  if (isSuccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-emerald-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-12 w-12 text-emerald-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-emerald-500", children: isArabic ? "✅ شكراً لك!" : "✅ Thank You!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-lg", children: isArabic ? "تم إرسال تقييمك بنجاح" : "Your review has been submitted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1 mt-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-8 w-8", i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200") }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-4", children: isArabic ? "سيتم توجيهك إلى لوحة التحكم خلال ثوان..." : "You will be redirected to dashboard in a few seconds..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-2xl px-4 py-6 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/distributor/dashboard", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180" }),
          isArabic ? "لوحة التحكم" : "Dashboard"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold", children: isArabic ? "⭐ تقييم الموزع" : "⭐ Rate Distributor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: isArabic ? "شاركنا تجربتك مع الموزع" : "Share your experience with the distributor" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f]" }),
          isArabic ? "معلومات الطلب" : "Order Information"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "رقم التتبع" : "Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: order.tracking_number || order.id.substring(0, 8) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "تاريخ التوصيل" : "Delivery Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: order.delivered_at ? new Date(order.delivered_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US") : isArabic ? "غير محدد" : "Not specified" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-[#2a655f]" }),
          isArabic ? "الموزع" : "Distributor"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: distributor ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0", children: distributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: distributor.avatar_url, alt: "", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-8 w-8 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-lg", children: isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }),
                Number(stats.rating).toFixed(1)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
                stats.orders,
                " ",
                isArabic ? "طلب" : "orders"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { dir: "ltr", children: distributor.phone })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "لا يوجد موزع معين لهذا الطلب" : "No distributor assigned to this order" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "تقييمك للموزع" : "Your Rating"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "اختر التقييم المناسب لخدمة التوصيل" : "Choose the appropriate rating for the delivery service" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2 py-4", children: [...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRating(starValue), onMouseEnter: () => setHoverRating(starValue), onMouseLeave: () => setHoverRating(0), className: "group transition-all duration-200 hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: cn("h-12 w-12 transition-all duration-200", (hoverRating || rating) >= starValue ? "fill-yellow-400 text-yellow-400 drop-shadow-lg" : "text-slate-200 dark:text-slate-600 group-hover:text-slate-300") }) }, i);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-2 mt-4", children: quickReviews.map((qr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setRating(qr.value);
            setSelectedEmoji(qr.emoji);
          }, className: cn("p-2 rounded-xl text-center transition-all duration-200", rating === qr.value ? "bg-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30" : "bg-slate-50 dark:bg-slate-800 hover:bg-[#2a655f]/10"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl block", children: qr.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: qr.label })
          ] }, qr.value)) }),
          rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            isArabic ? `اخترت ${rating} ${rating === 1 ? "نجمة" : rating === 2 ? "نجمتين" : rating === 3 ? "نجوم" : rating === 4 ? "نجوم" : "نجوم"}` : `You selected ${rating} ${rating === 1 ? "star" : "stars"}`,
            selectedEmoji && ` ${selectedEmoji}`
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "تعليقك (اختياري)" : "Your Comment (Optional)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "اكتب تجربتك مع الموزع (اختياري)" : "Write your experience with the distributor (optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: review, onChange: (e) => setReview(e.target.value), placeholder: isArabic ? "شاركنا تجربتك مع الموزع..." : "Share your experience with the distributor...", className: "min-h-[120px] resize-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            review.length,
            " / 500"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => navigate({
          to: "/distributor/dashboard"
        }), className: "flex-1 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10", children: isArabic ? "تخطي" : "Skip" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSubmitReview, disabled: isSubmitting || rating === 0, className: "flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          isArabic ? "جاري الإرسال..." : "Sending..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
          isArabic ? "إرسال التقييم" : "Submit Review"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#2a655f] shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? "تقييمك يساعدنا في تحسين جودة الخدمة. جميع التقييمات تذهب مباشرة للموزع والإدارة." : "Your rating helps us improve service quality. All ratings go directly to the distributor and management." })
      ] }) })
    ] })
  ] });
}
export {
  ReviewDistributorPage as component
};
