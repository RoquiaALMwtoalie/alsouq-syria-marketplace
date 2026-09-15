import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useApp, b7 as useMyDeliveryCompany, aA as useUpdateDeliveryCompany, L as Label, I as Input, j as Textarea, b2 as AddressPicker, b as Button } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as Sparkles, B as Building2, r as Phone, cE as PenLine, cF as Map, a0 as MapPin, bU as DollarSign, bX as Save } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "tslib";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
async function extractGovernorateFromAddress(address, lat, lng) {
  try {
    if (lat && lng) {
      const {
        data: governorates
      } = await supabase.from("governorates").select("*");
      if (governorates) {
        for (const g of governorates) {
          if (g.center_lat && g.center_lng) {
            const distance = Math.sqrt(Math.pow(lat - g.center_lat, 2) + Math.pow(lng - g.center_lng, 2));
            if (distance < 0.5) {
              return {
                governorate_id: g.id,
                governorate_name: g.name_ar
              };
            }
          }
        }
      }
    }
    if (address) {
      const {
        data: governorates
      } = await supabase.from("governorates").select("*");
      if (governorates) {
        for (const g of governorates) {
          if (address.includes(g.name_ar) || address.includes(g.name_en || "")) {
            return {
              governorate_id: g.id,
              governorate_name: g.name_ar
            };
          }
        }
      }
    }
    const {
      data: defaultGov
    } = await supabase.from("governorates").select("id, name_ar").eq("name_ar", "دمشق").single();
    if (defaultGov) {
      return {
        governorate_id: defaultGov.id,
        governorate_name: defaultGov.name_ar
      };
    }
    return {
      governorate_id: "",
      governorate_name: ""
    };
  } catch (error) {
    console.error("Error extracting governorate:", error);
    return {
      governorate_id: "",
      governorate_name: ""
    };
  }
}
function DeliveryCompletePage() {
  const app = useApp();
  const [loading, setLoading] = reactExports.useState(false);
  const [checking, setChecking] = reactExports.useState(true);
  const [companyData, setCompanyData] = reactExports.useState(null);
  const [location, setLocation] = reactExports.useState(null);
  const [addressMethod, setAddressMethod] = reactExports.useState("manual");
  const {
    data: company,
    isLoading: companyLoading
  } = useMyDeliveryCompany(app.user?.id);
  const updateCompany = useUpdateDeliveryCompany();
  const isArabic = app.lang === "ar";
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: userData
      } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.replace("/auth/login");
        return;
      }
      const {
        data: roleRows
      } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
      const role = roleRows?.[0]?.role;
      if (role !== "delivery_company") {
        window.location.replace("/");
        return;
      }
      const {
        data: company2,
        error
      } = await supabase.from("delivery_companies").select("*").eq("created_by", userData.user.id).maybeSingle();
      if (error) {
        console.error("Error fetching company:", error);
        window.location.replace("/delivery/dashboard");
        return;
      }
      if (company2?.is_verified) {
        window.location.replace("/delivery/dashboard");
        return;
      }
      setCompanyData(company2);
      setChecking(false);
    })();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const patch = {
      name_ar: formData.get("name_ar"),
      name_en: formData.get("name_en"),
      phone: formData.get("phone"),
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
      is_active: formData.get("is_active") === "on",
      is_verified: true
    };
    let governorateId = "";
    if (addressMethod === "map" && location) {
      patch.address_ar = location.address;
      patch.address_en = location.address;
      const result = await extractGovernorateFromAddress(location.address, location.lat, location.lng);
      governorateId = result.governorate_id;
      const {
        error: updateProfileError
      } = await supabase.from("profiles").update({
        lat: location.lat || 0,
        lng: location.lng || 0,
        address_text: location.address.trim(),
        governorate_id: governorateId || null
      }).eq("id", app.user?.id);
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
      }
    } else {
      patch.address_ar = formData.get("address_ar");
      patch.address_en = formData.get("address_en");
      const result = await extractGovernorateFromAddress(patch.address_ar);
      governorateId = result.governorate_id;
      const {
        error: updateProfileError
      } = await supabase.from("profiles").update({
        address_text: patch.address_ar.trim(),
        governorate_id: governorateId || null
      }).eq("id", app.user?.id);
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
      }
    }
    if (governorateId) {
      patch.governorate_id = governorateId;
      console.log("📍 Saving governorate_id to company:", governorateId);
    }
    setLoading(true);
    try {
      await updateCompany.mutateAsync({
        id: companyData.id,
        patch
      });
      toast.success(isArabic ? "✅ تم إكمال بيانات الشركة بنجاح! جاري التوجيه للداشبورد..." : "✅ Company data completed successfully! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.replace("/delivery/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(isArabic ? "❌ فشل تحديث بيانات الشركة" : "❌ Failed to update company");
    } finally {
      setLoading(false);
    }
  }
  if (checking || companyLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-[#0d2e2a] border-t-transparent mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-600", children: "جاري التحقق..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-[calc(100vh-140px)] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-[#0d2e2a] via-[#1a4f4a] to-[#2a655f]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-140px)] grid place-items-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-white/20 backdrop-blur grid place-items-center font-black text-xl", children: "س" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-2xl", children: "ذوق" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-white/85", children: isArabic ? "📋 أكمل بيانات شركتك لتفعيل حساب التوصيل" : "📋 Complete your company data to activate delivery" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/25 bg-white/15 backdrop-blur-2xl shadow-2xl p-6 md:p-8 text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black", children: isArabic ? "🏢 معلومات شركة التوصيل" : "🏢 Delivery Company Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-yellow-300" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm mt-1", children: isArabic ? "يرجى إكمال جميع البيانات المطلوبة لتفعيل حساب شركتك" : "Please complete all required data to activate your company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
                isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name_ar", defaultValue: companyData?.name_ar || "", placeholder: isArabic ? "شركة التوصيل السريع" : "Fast Delivery Company", required: true, className: "h-11 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5" }),
                isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "name_en", defaultValue: companyData?.name_en || "", placeholder: isArabic ? "Fast Delivery Company" : "Fast Delivery Company", required: true, className: "h-11 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
              isArabic ? "رقم الهاتف" : "Phone",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", type: "tel", defaultValue: companyData?.phone || "", placeholder: "09XXXXXXXX", required: true, className: "h-11 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-white/90", children: isArabic ? "📍 طريقة إدخال العنوان" : "📍 Address Input Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddressMethod("manual"), className: `
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300
                      ${addressMethod === "manual" ? "bg-white/20 border-2 border-white shadow-lg" : "bg-white/5 border-2 border-white/10 hover:bg-white/10"}
                    `, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: isArabic ? "📝 كتابة يدوية" : "✏️ Manual" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAddressMethod("map"), className: `
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300
                      ${addressMethod === "map" ? "bg-white/20 border-2 border-white shadow-lg" : "bg-white/5 border-2 border-white/10 hover:bg-white/10"}
                    `, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: isArabic ? "🗺️ اختيار من الخريطة" : "🗺️ Map" })
              ] })
            ] })
          ] }),
          addressMethod === "manual" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-1 gap-4 animate-in fade-in-50 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
              isArabic ? "العنوان" : "Address",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "address_ar", defaultValue: companyData?.address_ar || "", placeholder: isArabic ? "مثال: شارع الأندلس، مبنى 5، الطابق 3" : "Example: Al-Andalus Street, Building 5, Floor 3", required: true, rows: 2, className: "bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" })
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in-50 duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-3.5 w-3.5" }),
              isArabic ? "اختر موقعك على الخريطة" : "Select your location on the map",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-white/90 text-foreground p-3 border border-[#2a655f]/20 focus-within:border-[#2a655f]/50 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddressPicker, { value: location ?? void 0, onChange: setLocation, lang: app.lang }) }),
            location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-300 flex items-center gap-1", children: [
              "✅ ",
              isArabic ? "تم اختيار الموقع" : "Location selected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70", children: isArabic ? "📍 سيتم استخدام العنوان المختار من الخريطة تلقائياً" : "📍 The selected address from the map will be used automatically" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
                isArabic ? "الوصف (عربي)" : "Description (Arabic)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "description_ar", defaultValue: companyData?.description_ar || "", placeholder: isArabic ? "وصف الشركة بالعربية" : "Company description in Arabic", rows: 3, className: "bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/90 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
                isArabic ? "الوصف (إنجليزي)" : "Description (English)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "description_en", defaultValue: companyData?.description_en || "", placeholder: isArabic ? "وصف الشركة بالإنجليزية" : "Company description in English", rows: 3, className: "bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-white/90", children: [
                isArabic ? "السعر الأساسي" : "Base Price",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "base_price", type: "number", step: "0.01", defaultValue: companyData?.base_price || 0, required: true, className: "h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-white/90", children: [
                isArabic ? "سعر الكيلومتر" : "Price per KM",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "price_per_km", type: "number", step: "0.01", defaultValue: companyData?.price_per_km || 0, required: true, className: "h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-white/90", children: [
                isArabic ? "الحد الأدنى" : "Min Fee",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "min_delivery_fee", type: "number", step: "0.01", defaultValue: companyData?.min_delivery_fee || 0, required: true, className: "h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-white/90 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5" }),
                isArabic ? "الحد الأقصى للتوصيل" : "Max Delivery Fee",
                " *",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-yellow-300/80 font-normal", children: [
                  "(",
                  isArabic ? "مثال: 15000" : "Example: 15000",
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "max_delivery_fee", type: "number", step: "0.01", defaultValue: companyData?.max_delivery_fee || 15e3, required: true, className: "h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70", children: isArabic ? "💡 الحد الأقصى لسعر التوصيل (يُفضل ألا يتجاوز 15,000 ل.س)" : "💡 Maximum delivery fee (preferably not exceeding 15,000 SYP)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-white/90", children: isArabic ? "قيمة التوصيل المجاني" : "Free Delivery Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground", children: "ل.س" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "free_delivery_threshold", type: "number", step: "0.01", defaultValue: companyData?.free_delivery_threshold || 0, className: "h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-white/90", children: [
                isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time",
                " *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "avg_delivery_time", type: "number", defaultValue: companyData?.avg_delivery_time || 60, required: true, className: "h-10 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70", children: isArabic ? "بالدقائق" : "In minutes" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-white/10 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-white/90 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_tracking", defaultChecked: companyData?.has_tracking ?? true, className: "h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50" }),
              isArabic ? "تتبع" : "Tracking"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-white/90 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_insurance", defaultChecked: companyData?.has_insurance ?? true, className: "h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50" }),
              isArabic ? "تأمين" : "Insurance"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-white/90 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_cod", defaultChecked: companyData?.has_cod ?? true, className: "h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50" }),
              isArabic ? "دفع عند الاستلام" : "Cash on Delivery"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-white/90 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "has_express", defaultChecked: companyData?.has_express ?? true, className: "h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50" }),
              isArabic ? "توصيل سريع" : "Express"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-white/10 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "is_active", defaultChecked: companyData?.is_active !== false, className: "h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-white/90 cursor-pointer", children: isArabic ? "🟢 الشركة نشطة" : "🟢 Company is active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", className: "w-full h-12 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-xl transition-all duration-300 font-bold", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }),
            isArabic ? "جاري الحفظ..." : "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-5 w-5" }),
            isArabic ? "حفظ وتفعيل الشركة" : "Save & Activate Company"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/70 text-center", children: isArabic ? "🔒 بعد حفظ البيانات سيتم تفعيل حساب شركتك ويمكنك البدء في استلام الطلبات" : "🔒 After saving, your company account will be activated and you can start receiving orders" })
        ] })
      ] })
    ] }) })
  ] });
}
function FileText(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 2 14 8 20 8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "10 9 9 9 8 9" })
  ] });
}
export {
  DeliveryCompletePage as component
};
