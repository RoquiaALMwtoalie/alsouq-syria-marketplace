import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { b5 as Route$l, u as useApp, a as useT, b6 as useDeliveryCompany, ay as useDistributors, aH as Skeleton, b as Button, B as Badge } from "./_ssr/router-BU7AgYzK.mjs";
import "./_libs/sonner.mjs";
import { m as Truck, a as ChevronLeft, g as Sparkles, e as CircleCheckBig, h as Star, b as Clock, a5 as Navigation, r as Phone, as as Mail, aa as Globe, a0 as MapPin, a1 as Shield, N as CircleX, t as Users, a2 as ArrowRight, aq as Award } from "./_libs/lucide-react.mjs";
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
function DeliveryCompanyPage() {
  const {
    slug
  } = Route$l.useParams();
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("info");
  const {
    data: company,
    isLoading: loadingCompany
  } = useDeliveryCompany(slug);
  const {
    data: distributors = [],
    isLoading: loadingDistributors
  } = useDistributors({
    companyId: company?.id,
    isAvailable: true
  });
  if (loadingCompany) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full mt-4 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }, i)) })
    ] }) });
  }
  if (!company) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-16 w-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: app.lang === "ar" ? "لم نجد الشركة" : "Company not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({
        to: "/delivery"
      }), className: "mt-4", children: app.lang === "ar" ? "← العودة للشركات" : "← Back to companies" })
    ] }) });
  }
  const isArabic = app.lang === "ar";
  const name = isArabic ? company.name_ar : company.name_en;
  const description = isArabic ? company.description_ar : company.description_en;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-8 md:py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/delivery", className: "inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" }),
          app.lang === "ar" ? "جميع شركات التوصيل" : "All delivery companies"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0", children: company.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: company.logo_url, alt: name, className: "h-16 w-16 object-contain rounded-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-12 w-12 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold", children: name }),
              company.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500 text-white border-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 mr-1" }),
                app.lang === "ar" ? "مميزة" : "Featured"
              ] }),
              company.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500 text-white border-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
                app.lang === "ar" ? "نشطة" : "Active"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2 text-white/80 text-sm flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }),
                Number(company.rating || 0).toFixed(1),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/60", children: [
                  "(",
                  company.reviews_count || 0,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-white/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                company.avg_delivery_time || 60,
                " ",
                app.lang === "ar" ? "دقيقة" : "min"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-white/30", children: "|" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
                distributors.length,
                " ",
                app.lang === "ar" ? "موزع" : "distributors"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-white text-[#2a655f] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105", onClick: () => navigate({
            to: "/tracking"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-4 w-4 mr-2" }),
            app.lang === "ar" ? "تتبع شحنة" : "Track shipment"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 border-b", children: [{
        id: "info",
        label: isArabic ? "📋 معلومات" : "📋 Info"
      }, {
        id: "distributors",
        label: isArabic ? "👤 الموزعين" : "👤 Distributors"
      }, {
        id: "pricing",
        label: isArabic ? "💰 الأسعار" : "💰 Pricing"
      }].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? "border-[#2a655f] text-[#2a655f]" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: tab.label }, tab.id)) }),
      activeTab === "info" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-3", children: app.lang === "ar" ? "عن الشركة" : "About" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: description || (app.lang === "ar" ? "لا يوجد وصف" : "No description") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-4", children: app.lang === "ar" ? "📍 معلومات الاتصال" : "📍 Contact Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              company.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "الهاتف" : "Phone" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", dir: "ltr", children: company.phone })
                ] })
              ] }),
              company.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "البريد" : "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: company.email })
                ] })
              ] }),
              company.website && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "الموقع" : "Website" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: company.website, target: "_blank", rel: "noopener", className: "font-medium text-[#2a655f] hover:underline", children: company.website.replace(/^https?:\/\//, "") })
                ] })
              ] }),
              company.address_ar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm col-span-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#2a655f]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "العنوان" : "Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? company.address_ar : company.address_en })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "الخدمات المقدمة" : "Services"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [{
              label: isArabic ? "تتبع الشحنات" : "Shipment tracking",
              value: company.has_tracking
            }, {
              label: isArabic ? "تأمين على الشحنات" : "Insurance",
              value: company.has_insurance
            }, {
              label: isArabic ? "الدفع عند الاستلام" : "Cash on delivery",
              value: company.has_cod
            }, {
              label: isArabic ? "توصيل سريع" : "Express delivery",
              value: company.has_express
            }].map((service) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: service.label }),
              service.value ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-red-400" })
            ] }, service.label)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "الموزعون" : "Distributors"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-[#2a655f]", children: distributors.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "موزع متاح" : "available distributors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full mt-4 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10", onClick: () => setActiveTab("distributors"), children: [
              app.lang === "ar" ? "عرض الموزعين" : "View distributors",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1 rtl:rotate-180" })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "distributors" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold", children: [
          app.lang === "ar" ? "👤 موزعينا" : "👤 Our Distributors",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground ml-2", children: [
            "(",
            distributors.length,
            ")"
          ] })
        ] }) }),
        loadingDistributors ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }, i)) }) : distributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: app.lang === "ar" ? "لا يوجد موزعين حالياً" : "No distributors available" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: distributors.map((dist) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border hover:shadow-md transition-all hover:border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center", children: dist.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: dist.avatar_url, alt: "", className: "h-full w-full object-cover rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold line-clamp-1", children: isArabic ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-yellow-400 text-yellow-400" }),
                Number(dist.rating || 0).toFixed(1)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                dist.completed_orders || 0,
                " ",
                app.lang === "ar" ? "طلب" : "orders"
              ] }),
              dist.is_available && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-0 text-[9px]", children: [
                "● ",
                app.lang === "ar" ? "متاح" : "Available"
              ] })
            ] })
          ] })
        ] }) }, dist.id)) })
      ] }),
      activeTab === "pricing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "السعر الأساسي" : "Base Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold text-[#2a655f] mt-1", children: [
              company.base_price,
              " ",
              app.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-6 w-6 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "سعر الكيلومتر" : "Price per KM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold text-[#2a655f] mt-1", children: [
              company.price_per_km,
              " ",
              app.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-6 w-6 text-emerald-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "توصيل مجاني فوق" : "Free delivery above" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold text-emerald-500 mt-1", children: [
              company.free_delivery_threshold,
              " ",
              app.currency
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold mb-4", children: app.lang === "ar" ? "ملاحظات الأسعار" : "Pricing Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-500" }),
              app.lang === "ar" ? `الحد الأدنى للتوصيل: ${company.min_delivery_fee} ${app.currency}` : `Minimum delivery fee: ${company.min_delivery_fee} ${app.currency}`
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-500" }),
              app.lang === "ar" ? `الحد الأقصى للتوصيل: ${company.max_delivery_fee} ${app.currency}` : `Maximum delivery fee: ${company.max_delivery_fee} ${app.currency}`
            ] }),
            company.coverage_areas && company.coverage_areas.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? `يغطي: ${company.coverage_areas.join("، ")}` : `Covers: ${company.coverage_areas.join(", ")}`
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  DeliveryCompanyPage as component
};
