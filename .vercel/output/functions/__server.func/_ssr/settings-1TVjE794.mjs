import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, ay as useDistributors, f as useGovernorates, bd as useUpdateDistributor, aH as Skeleton, b as Button, T as Tabs, h as TabsList, i as TabsTrigger, aC as TabsContent, B as Badge, c as cn, L as Label, I as Input, j as Textarea, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, w as DialogFooter } from "./router-BU7AgYzK.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-C7XU6h8z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { _ as CircleAlert, a as ChevronLeft, U as User, B as Building2, m as Truck, p as LoaderCircle, bF as Camera, r as Phone, as as Mail, a0 as MapPin, bX as Save, h as Star, v as Trash2, e as CircleCheckBig, X } from "../_libs/lucide-react.mjs";
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
function DistributorSettingsPage() {
  const app = useApp();
  useT();
  useNavigate();
  const fileInputRef = reactExports.useRef(null);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("profile");
  const [uploading, setUploading] = reactExports.useState(false);
  const {
    data: distributors = [],
    isLoading,
    refetch
  } = useDistributors({
    isAvailable: true
  });
  const {
    data: governorates = []
  } = useGovernorates();
  const updateDistributor = useUpdateDistributor();
  const currentDistributor = reactExports.useMemo(() => {
    return distributors.find((d) => d.user_id === app.user?.id);
  }, [distributors, app.user]);
  const [formData, setFormData] = reactExports.useState({
    full_name_ar: "",
    full_name_en: "",
    phone: "",
    email: "",
    address_ar: "",
    address_en: "",
    governorate_id: "",
    is_available: true,
    distributor_type: "freelance"
  });
  reactExports.useMemo(() => {
    if (currentDistributor) {
      setFormData({
        full_name_ar: currentDistributor.full_name_ar || "",
        full_name_en: currentDistributor.full_name_en || "",
        phone: currentDistributor.phone || "",
        email: currentDistributor.email || "",
        address_ar: currentDistributor.address_ar || "",
        address_en: currentDistributor.address_en || "",
        governorate_id: currentDistributor.governorate_id || "",
        is_available: currentDistributor.is_available !== false,
        distributor_type: currentDistributor.distributor_type || "freelance"
      });
    }
  }, [currentDistributor]);
  const isArabic = app.lang === "ar";
  const handleUploadImage = async (file) => {
    if (!app.user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${app.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `distributors/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await updateDistributor.mutateAsync({
        id: currentDistributor.id,
        patch: {
          avatar_url: publicUrl
        }
      });
      toast.success(isArabic ? "✅ تم تحديث الصورة بنجاح" : "✅ Image updated successfully");
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(isArabic ? "❌ حدث خطأ في رفع الصورة" : "❌ Error uploading image");
    } finally {
      setUploading(false);
    }
  };
  const handleSave = async () => {
    if (!currentDistributor) return;
    if (!formData.full_name_ar.trim()) {
      toast.error(isArabic ? "الاسم الكامل بالعربية مطلوب" : "Full name in Arabic is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error(isArabic ? "رقم الهاتف مطلوب" : "Phone number is required");
      return;
    }
    setIsSaving(true);
    try {
      await updateDistributor.mutateAsync({
        id: currentDistributor.id,
        patch: formData
      });
      toast.success(isArabic ? "✅ تم حفظ التغييرات بنجاح" : "✅ Changes saved successfully");
      refetch();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(isArabic ? "❌ حدث خطأ في حفظ التغييرات" : "❌ Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteAccount = async () => {
    toast.success(isArabic ? "✅ تم إرسال طلب إلغاء الحساب" : "✅ Account deletion request sent");
    setIsDeleteDialogOpen(false);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full mt-4 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full mt-4 rounded-2xl" })
    ] }) });
  }
  if (!currentDistributor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-10 w-10 text-red-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: isArabic ? "لم يتم العثور على الملف" : "Profile Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: isArabic ? "ليس لديك ملف موزع مسجل" : "You don't have a distributor profile registered" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/distributor/apply", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isArabic ? "تسجيل كموزع" : "Register as Distributor" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-3xl px-4 py-6 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/distributor/dashboard", className: "text-white/70 hover:text-white transition text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180" }),
          isArabic ? "لوحة التحكم" : "Dashboard"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold", children: isArabic ? "⚙️ إعدادات الموزع" : "⚙️ Distributor Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs", children: isArabic ? "تعديل الملف الشخصي والإعدادات" : "Edit profile and preferences" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: (v) => setActiveTab(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "profile", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
          isArabic ? "الملف الشخصي" : "Profile"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "account", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
          isArabic ? "الحساب" : "Account"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "preferences", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4" }),
          isArabic ? "التفضيلات" : "Preferences"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "المعلومات الشخصية" : "Personal Information"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "قم بتحديث معلوماتك الشخصية" : "Update your personal information" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center overflow-hidden", children: currentDistributor.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: currentDistributor.avatar_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-12 w-12 text-[#2a655f]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fileInputRef.current?.click(), className: "absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#2a655f] text-white flex items-center justify-center hover:bg-[#3a8a82] transition-colors shadow-lg", disabled: uploading, children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadImage(file);
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: isArabic ? formData.full_name_ar : formData.full_name_en || formData.full_name_ar }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: currentDistributor.email || (isArabic ? "بريد إلكتروني غير مسجل" : "No email registered") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("mt-1", currentDistributor.is_available ? "bg-emerald-500/10 text-emerald-600 border-0" : "bg-red-500/10 text-red-500 border-0"), children: currentDistributor.is_available ? isArabic ? "✅ متاح" : "✅ Available" : isArabic ? "❌ غير متاح" : "❌ Unavailable" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الاسم الكامل (عربي) *" : "Full Name (Arabic) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.full_name_ar, onChange: (e) => setFormData({
                  ...formData,
                  full_name_ar: e.target.value
                }), className: "ps-9", dir: "rtl" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "الاسم الكامل (إنجليزي)" : "Full Name (English)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.full_name_en, onChange: (e) => setFormData({
                  ...formData,
                  full_name_en: e.target.value
                }), className: "ps-9", dir: "ltr" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "رقم الهاتف *" : "Phone Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.phone, onChange: (e) => setFormData({
                  ...formData,
                  phone: e.target.value
                }), className: "ps-9", dir: "ltr", placeholder: "+963 9xx xxx xxx" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "البريد الإلكتروني" : "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formData.email, onChange: (e) => setFormData({
                  ...formData,
                  email: e.target.value
                }), className: "ps-9", dir: "ltr", placeholder: "example@email.com" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان (عربي)" : "Address (Arabic)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.address_ar, onChange: (e) => setFormData({
                ...formData,
                address_ar: e.target.value
              }), className: "ps-9 min-h-[80px]", dir: "rtl", placeholder: isArabic ? "العنوان بالتفصيل" : "Detailed address" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "العنوان (إنجليزي)" : "Address (English)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: formData.address_en, onChange: (e) => setFormData({
                ...formData,
                address_en: e.target.value
              }), className: "ps-9 min-h-[80px]", dir: "ltr", placeholder: "Detailed address in English" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "المحافظة" : "Governorate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.governorate_id, onValueChange: (value) => setFormData({
              ...formData,
              governorate_id: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المحافظة" : "Select governorate" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: governorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g.id, children: isArabic ? g.name_ar : g.name_en }, g.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: isSaving, className: "w-full bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
            isArabic ? "جاري الحفظ..." : "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
            isArabic ? "حفظ التغييرات" : "Save Changes"
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "account", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "إعدادات الحساب" : "Account Settings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "إدارة إعدادات الحساب والصلاحيات" : "Manage account settings and permissions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? "نوع الحساب" : "Account Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: currentDistributor.distributor_type === "company_employee" ? isArabic ? "موظف في شركة توصيل" : "Company Employee" : isArabic ? "موزع مستقل" : "Freelance Distributor" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0", children: currentDistributor.distributor_type === "company_employee" ? isArabic ? "🏢 شركة" : "🏢 Company" : isArabic ? "🆓 مستقل" : "🆓 Freelance" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? "الحالة" : "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: currentDistributor.is_available ? isArabic ? "متاح للاستلام" : "Available for pickups" : isArabic ? "غير متاح" : "Not available" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(currentDistributor.is_available ? "bg-emerald-500/10 text-emerald-600 border-0" : "bg-red-500/10 text-red-500 border-0"), children: currentDistributor.is_available ? isArabic ? "✅ متاح" : "✅ Available" : isArabic ? "❌ غير متاح" : "❌ Unavailable" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? "التقييم" : "Rating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: Number(currentDistributor.rating || 0).toFixed(1) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  "(",
                  currentDistributor.reviews_count || 0,
                  " ",
                  isArabic ? "تقييم" : "reviews",
                  ")"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "الطلبات المكتملة" : "Completed Orders" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-[#2a655f]", children: currentDistributor.completed_orders || 0 })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-red-200/50 dark:border-red-800/50 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: () => setIsDeleteDialogOpen(true), className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
              isArabic ? "طلب إلغاء الحساب" : "Request Account Deletion"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 text-center", children: isArabic ? "سيتم إرسال طلب إلغاء الحساب للإدارة للمراجعة" : "Account deletion request will be sent to administration for review" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "preferences", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-[#2a655f]" }),
            isArabic ? "تفضيلات التوصيل" : "Delivery Preferences"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isArabic ? "إعدادات تفضيلات التوصيل الخاصة بك" : "Manage your delivery preferences" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: isArabic ? "الحالة" : "Availability Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isArabic ? "حدد ما إذا كنت متاحاً لتلقي طلبات التوصيل" : "Set whether you're available to receive delivery orders" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: formData.is_available ? "default" : "outline", size: "sm", className: formData.is_available ? "bg-emerald-500 hover:bg-emerald-600" : "", onClick: () => setFormData({
                ...formData,
                is_available: true
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 mr-1" }),
                isArabic ? "متاح" : "Available"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: !formData.is_available ? "default" : "outline", size: "sm", className: !formData.is_available ? "bg-red-500 hover:bg-red-600" : "", onClick: () => setFormData({
                ...formData,
                is_available: false
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
                isArabic ? "غير متاح" : "Unavailable"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: isArabic ? "نوع الموزع" : "Distributor Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.distributor_type, onValueChange: (value) => setFormData({
              ...formData,
              distributor_type: value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "freelance", children: isArabic ? "🆓 موزع مستقل" : "🆓 Freelance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "company_employee", children: isArabic ? "🏢 موظف شركة توصيل" : "🏢 Company Employee" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: isSaving, className: "w-full bg-[#2a655f] hover:bg-[#3a8a82] text-white", children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
            isArabic ? "جاري الحفظ..." : "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
            isArabic ? "حفظ التغييرات" : "Save Changes"
          ] }) })
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-red-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5" }),
          isArabic ? "⚠️ تحذير: إلغاء الحساب" : "⚠️ Warning: Account Deletion"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: isArabic ? "هل أنت متأكد من رغبتك في إلغاء حسابك كموزع؟ هذا الإجراء لا يمكن التراجع عنه." : "Are you sure you want to delete your distributor account? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-red-50 dark:bg-red-950/20 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: isArabic ? "⚠️ سيتم إرسال طلب إلغاء الحساب للإدارة. سيتم إلغاء جميع الطلبات المعلقة." : "⚠️ Account deletion request will be sent to administration. All pending orders will be cancelled." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsDeleteDialogOpen(false), children: isArabic ? "إلغاء" : "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDeleteAccount, children: isArabic ? "تأكيد الإلغاء" : "Confirm Deletion" })
      ] })
    ] }) })
  ] });
}
export {
  DistributorSettingsPage as component
};
