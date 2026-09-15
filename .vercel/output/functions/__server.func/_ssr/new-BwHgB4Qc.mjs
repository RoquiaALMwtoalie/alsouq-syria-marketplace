import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, ax as useDeliveryCompanies, ay as useDistributors, bE as useCreateDeliveryOrder, E as useSendNotificationV2, c as cn, L as Label, I as Input, j as Textarea, b as Button, aH as Skeleton, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, B as Badge } from "./router-BU7AgYzK.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-C7XU6h8z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as ChevronLeft, f as Plus, e as CircleCheckBig, P as Package, c as Store, U as User, r as Phone, a0 as MapPin, m as Truck, bU as DollarSign, a2 as ArrowRight, _ as CircleAlert, p as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function NewDeliveryOrderPage() {
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    // معلومات الشحن (من البائع)
    pickupName: "",
    pickupPhone: "",
    pickupAddress: "",
    pickupLat: "",
    pickupLng: "",
    // معلومات التسليم (للمشتري)
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryLat: "",
    deliveryLng: "",
    // شركة التوصيل
    deliveryCompanyId: "",
    // الموزع
    distributorId: "",
    // التفاصيل
    notes: "",
    codAmount: "0",
    scheduledPickupAt: "",
    scheduledDeliveryAt: ""
  });
  const {
    data: companies = [],
    isLoading: companiesLoading
  } = useDeliveryCompanies({
    active: true
  });
  const {
    data: distributors = [],
    isLoading: distributorsLoading
  } = useDistributors({
    companyId: formData.deliveryCompanyId || void 0,
    isAvailable: true
  });
  const createOrder = useCreateDeliveryOrder();
  const sendNotification = useSendNotificationV2();
  const selectedCompany = reactExports.useMemo(() => {
    return companies.find((c) => c.id === formData.deliveryCompanyId);
  }, [companies, formData.deliveryCompanyId]);
  const selectedDistributor = reactExports.useMemo(() => {
    return distributors.find((d) => d.id === formData.distributorId);
  }, [distributors, formData.distributorId]);
  const estimatedFee = reactExports.useMemo(() => {
    if (!selectedCompany) return 0;
    return selectedCompany.base_price || 0;
  }, [selectedCompany]);
  const isArabic = app.lang === "ar";
  const isStep1Valid = formData.pickupName.trim() && formData.pickupPhone.trim() && formData.pickupAddress.trim() && formData.deliveryName.trim() && formData.deliveryPhone.trim() && formData.deliveryAddress.trim();
  const isStep2Valid = formData.deliveryCompanyId && formData.distributorId;
  const handleSubmit = async () => {
    if (!isStep1Valid || !isStep2Valid) {
      toast.error(isArabic ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        pickup_name: formData.pickupName,
        pickup_phone: formData.pickupPhone,
        pickup_address: formData.pickupAddress,
        pickup_latitude: parseFloat(formData.pickupLat) || null,
        pickup_longitude: parseFloat(formData.pickupLng) || null,
        delivery_name: formData.deliveryName,
        delivery_phone: formData.deliveryPhone,
        delivery_address: formData.deliveryAddress,
        delivery_latitude: parseFloat(formData.deliveryLat) || null,
        delivery_longitude: parseFloat(formData.deliveryLng) || null,
        delivery_company_id: formData.deliveryCompanyId,
        distributor_id: formData.distributorId,
        notes_ar: formData.notes,
        cod_amount: parseFloat(formData.codAmount) || 0,
        delivery_fee: estimatedFee,
        scheduled_pickup_at: formData.scheduledPickupAt || null,
        scheduled_delivery_at: formData.scheduledDeliveryAt || null,
        tracking_number: `SOUQI-${Date.now().toString(36).toUpperCase()}`,
        status: "assigned"
      };
      const result = await createOrder.mutateAsync(payload);
      if (result.distributor_id) {
        await sendNotification.mutateAsync({
          userId: result.distributor_id,
          type: "delivery_order",
          titleAr: isArabic ? "📦 طلب توصيل جديد" : "📦 New Delivery Order",
          bodyAr: isArabic ? `طلب توصيل من ${result.pickup_name} إلى ${result.delivery_name}` : `Delivery order from ${result.pickup_name} to ${result.delivery_name}`,
          linkUrl: `/distributor/dashboard`,
          metadata: {
            order_id: result.id,
            tracking_number: result.tracking_number,
            pickup_name: result.pickup_name,
            delivery_name: result.delivery_name
          },
          actions: [{
            label_ar: isArabic ? "عرض الطلب" : "View Order",
            url: `/distributor/dashboard`
          }]
        });
      }
      await sendNotification.mutateAsync({
        userId: app.user?.id,
        type: "delivery_order",
        titleAr: isArabic ? "📦 تم إنشاء طلب توصيل" : "📦 Delivery Order Created",
        bodyAr: isArabic ? `تم إنشاء طلب توصيل جديد برقم ${result.tracking_number}` : `New delivery order created with tracking #${result.tracking_number}`,
        linkUrl: `/delivery/dashboard`,
        metadata: {
          order_id: result.id,
          tracking_number: result.tracking_number
        }
      });
      toast.success(isArabic ? "✅ تم إنشاء طلب التوصيل بنجاح!" : "✅ Delivery order created successfully!");
      navigate({
        to: "/delivery/dashboard"
      });
    } catch (error) {
      console.error("Error creating delivery order:", error);
      toast.error(isArabic ? "❌ حدث خطأ في إنشاء الطلب" : "❌ Error creating order");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-3xl px-4 py-6 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/delivery/dashboard", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180" }),
          isArabic ? "لوحة التحكم" : "Dashboard"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold", children: isArabic ? "📦 طلب توصيل جديد" : "📦 New Delivery Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: isArabic ? "أدخل معلومات الطلب" : "Enter order details" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-8", children: [{
        number: 1,
        label: isArabic ? "معلومات الطلب" : "Order Info"
      }, {
        number: 2,
        label: isArabic ? "اختيار التوصيل" : "Delivery Selection"
      }, {
        number: 3,
        label: isArabic ? "تأكيد" : "Confirm"
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-all", step === s.number ? "bg-[#2a655f] text-white" : step > s.number ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"), children: step > s.number ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : s.number }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-sm font-medium hidden sm:inline", step === s.number ? "text-[#2a655f]" : step > s.number ? "text-emerald-500" : "text-muted-foreground"), children: s.label }),
        s.number < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-8 h-0.5 mx-1 hidden sm:block", step > s.number ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700") })
      ] }, s.number)) }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "معلومات الشحن والتسليم" : "Shipping & Delivery Info"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "أدخل معلومات مكان الاستلام والتسليم" : "Enter pickup and delivery locations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "📍 معلومات الاستلام (من البائع)" : "📍 Pickup Info (From Seller)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "اسم المستلم *" : "Pickup Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.pickupName, onChange: (e) => setFormData({
                    ...formData,
                    pickupName: e.target.value
                  }), placeholder: isArabic ? "اسم البائع" : "Seller name", className: "ps-9" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "رقم الهاتف *" : "Phone *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.pickupPhone, onChange: (e) => setFormData({
                    ...formData,
                    pickupPhone: e.target.value
                  }), placeholder: "+963 9xx xxx xxx", className: "ps-9", dir: "ltr" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان *" : "Address *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.pickupAddress, onChange: (e) => setFormData({
                  ...formData,
                  pickupAddress: e.target.value
                }), placeholder: isArabic ? "عنوان البائع بالتفصيل" : "Seller address in detail", className: "ps-9 min-h-[80px]" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-slate-200/50 dark:border-slate-700/50 pt-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-[#2a655f]" }),
              isArabic ? "📍 معلومات التسليم (للمشتري)" : "📍 Delivery Info (To Buyer)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "اسم المستلم *" : "Recipient Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.deliveryName, onChange: (e) => setFormData({
                    ...formData,
                    deliveryName: e.target.value
                  }), placeholder: isArabic ? "اسم المشتري" : "Buyer name", className: "ps-9" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "رقم الهاتف *" : "Phone *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.deliveryPhone, onChange: (e) => setFormData({
                    ...formData,
                    deliveryPhone: e.target.value
                  }), placeholder: "+963 9xx xxx xxx", className: "ps-9", dir: "ltr" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان *" : "Address *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.deliveryAddress, onChange: (e) => setFormData({
                  ...formData,
                  deliveryAddress: e.target.value
                }), placeholder: isArabic ? "عنوان المشتري بالتفصيل" : "Buyer address in detail", className: "ps-9 min-h-[80px]" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-slate-200/50 dark:border-slate-700/50 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "المبلغ المستلم (COD)" : "COD Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: formData.codAmount, onChange: (e) => setFormData({
                  ...formData,
                  codAmount: e.target.value
                }), placeholder: "0", className: "ps-9" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "المبلغ الذي سيتم تحصيله عند الاستلام" : "Amount to be collected on delivery" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "ملاحظات" : "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.notes, onChange: (e) => setFormData({
                ...formData,
                notes: e.target.value
              }), placeholder: isArabic ? "أي ملاحظات إضافية" : "Any additional notes", className: "min-h-[80px]" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setStep(2), disabled: !isStep1Valid, className: "w-full bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: [
            isArabic ? "التالي →" : "Next →",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1 rtl:rotate-180" })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "اختيار شركة التوصيل والموزع" : "Select Delivery Company & Distributor"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "اختر شركة التوصيل المناسبة والموزع المتاح" : "Choose delivery company and available distributor" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "شركة التوصيل *" : "Delivery Company *" }),
            companiesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.deliveryCompanyId, onValueChange: (value) => {
              setFormData({
                ...formData,
                deliveryCompanyId: value,
                distributorId: ""
              });
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر شركة توصيل" : "Select delivery company" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: companies.map((company) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: company.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? company.name_ar : company.name_en }),
                company.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500 text-white border-0 text-[9px]", children: [
                  "⭐ ",
                  isArabic ? "مميز" : "Featured"
                ] })
              ] }) }, company.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الموزع *" : "Distributor *" }),
            distributorsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }) : !formData.deliveryCompanyId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center text-muted-foreground text-sm", children: isArabic ? "الرجاء اختيار شركة توصيل أولاً" : "Please select a delivery company first" }) : distributors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 text-yellow-500 mx-auto mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "لا يوجد موزعين متاحين لهذه الشركة حالياً" : "No distributors available for this company" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.distributorId, onValueChange: (value) => setFormData({
              ...formData,
              distributorId: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر موزع" : "Select distributor" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: distributors.map((dist) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: dist.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border-0 text-[9px]", children: [
                  "● ",
                  isArabic ? "متاح" : "Available"
                ] })
              ] }) }, dist.id)) })
            ] })
          ] }),
          selectedCompany && selectedDistributor && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "رسوم التوصيل المقدرة" : "Estimated Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-[#2a655f]", children: [
                estimatedFee,
                " ",
                app.currency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "الموزع" : "Distributor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? selectedDistributor.full_name_ar : selectedDistributor.full_name_en || selectedDistributor.full_name_ar })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setStep(1), className: "flex-1 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 mr-1 rtl:rotate-180" }),
              isArabic ? "السابق" : "Previous"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setStep(3), disabled: !isStep2Valid, className: "flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: [
              isArabic ? "التالي →" : "Next →",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1 rtl:rotate-180" })
            ] })
          ] })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-emerald-500" }),
            isArabic ? "تأكيد الطلب" : "Confirm Order"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "راجع معلومات الطلب قبل التأكيد" : "Review order details before confirmation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "الاستلام من" : "Pickup From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: formData.pickupName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: formData.pickupPhone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: formData.pickupAddress })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "التسليم إلى" : "Deliver To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: formData.deliveryName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: formData.deliveryPhone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: formData.deliveryAddress })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-200/50 dark:border-slate-700/50 pt-4 grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "شركة التوصيل" : "Delivery Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedCompany && (isArabic ? selectedCompany.name_ar : selectedCompany.name_en) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "الموزع" : "Distributor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedDistributor && (isArabic ? selectedDistributor.full_name_ar : selectedDistributor.full_name_en || selectedDistributor.full_name_ar) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-200/50 dark:border-slate-700/50 pt-4 grid grid-cols-3 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "رسوم التوصيل" : "Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-[#2a655f]", children: [
                estimatedFee,
                " ",
                app.currency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "COD" : "COD" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
                parseFloat(formData.codAmount) || 0,
                " ",
                app.currency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isArabic ? "الإجمالي" : "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-emerald-500", children: [
                (parseFloat(formData.codAmount) || 0) + estimatedFee,
                " ",
                app.currency
              ] })
            ] })
          ] }),
          formData.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isArabic ? "ملاحظات" : "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: formData.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setStep(2), className: "flex-1 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 mr-1 rtl:rotate-180" }),
              isArabic ? "السابق" : "Previous"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSubmit, disabled: isSubmitting, className: "flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
              isArabic ? "جاري الإنشاء..." : "Creating..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              isArabic ? "✅ تأكيد الطلب" : "✅ Confirm Order",
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 ml-1" })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  NewDeliveryOrderPage as component
};
