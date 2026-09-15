import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useApp, aU as useProfileWithUpdate, b as Button, B as Badge, T as Tabs, h as TabsList, i as TabsTrigger, aC as TabsContent, c as cn, a as useT, aN as useUpdateProfile, L as Label, P as Avatar, Q as AvatarImage, U as AvatarFallback, d as ImageInput, I as Input, aV as AlertDialog, aW as AlertDialogTrigger, aX as AlertDialogContent, aY as AlertDialogHeader, aZ as AlertDialogTitle, a_ as AlertDialogDescription, a$ as AlertDialogFooter, b0 as AlertDialogCancel, b1 as AlertDialogAction, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, b2 as AddressPicker, w as DialogFooter } from "./router-BU7AgYzK.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-C7XU6h8z.mjs";
import { S as Switch } from "./switch-CsdoyQ0i.mjs";
import { cr as Lock, a9 as Settings, g as Sparkles, U as User, a0 as MapPin, a1 as Shield, aa as Globe, cx as MapPinned, bF as Camera, r as Phone, _ as CircleAlert, a4 as CircleCheck, p as LoaderCircle, bX as Save, h as Star, bY as SquarePen, v as Trash2, f as Plus, c3 as EyeOff, W as Eye, ac as Moon, ab as Sun, ai as Bell, aj as BellOff, ad as Volume2, ae as VolumeX } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-switch.mjs";
const AnimatedIcon = ({
  Icon,
  className = "",
  color = "text-[#2a655f]",
  delay = 0,
  size = "h-5 w-5",
  glow = false
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative inline-flex items-center justify-center",
      style: { animationDelay: `${delay}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-float-icon group-hover:animate-pulse-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn(
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          color,
          size,
          className
        ) }) }),
        glow && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-6 rounded-full border-2 border-[#4a9f95]/5 animate-ripple delay-1500 opacity-0 group-hover:opacity-100 transition-opacity duration-900" })
        ] })
      ]
    }
  );
};
async function isPhoneAvailable(phone, userId) {
  if (!phone || phone.trim().length < 5) {
    return {
      available: false,
      message: "رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)"
    };
  }
  const { data, error } = await supabase.from("profiles").select("id, phone").eq("phone", phone.trim()).neq("id", userId).maybeSingle();
  if (error) {
    console.error("Error checking phone:", error);
    return {
      available: false,
      message: "حدث خطأ في التحقق من الرقم"
    };
  }
  if (data) {
    return {
      available: false,
      message: "⚠️ هذا الرقم مستخدم من قبل حساب آخر"
    };
  }
  return { available: true };
}
function AddressManager({ userId, lang }) {
  const [addresses, setAddresses] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const [editingAddress, setEditingAddress] = reactExports.useState(null);
  const [newAddress, setNewAddress] = reactExports.useState({
    label: "",
    address_text: "",
    details: "",
    lat: null,
    lng: null,
    is_default: false
  });
  const [selectedLocation, setSelectedLocation] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);
  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("user_addresses").select("*").eq("user_id", userId).order("is_default", { ascending: false }).order("created_at", { ascending: true });
      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error(lang === "ar" ? "خطأ في تحميل العناوين" : "Error loading addresses");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddAddress = async () => {
    if (!selectedLocation) {
      toast.error(lang === "ar" ? "الرجاء اختيار الموقع على الخريطة" : "Please select a location on the map");
      return;
    }
    const fullLabel = newAddress.label?.trim() || "";
    if (!fullLabel) {
      toast.error(lang === "ar" ? "الرجاء إدخال تسمية للعنوان" : "Please enter a label for the address");
      return;
    }
    const detailsText = newAddress.details?.trim() || "";
    if (!detailsText) {
      toast.error(lang === "ar" ? "الرجاء إدخال وصف تفصيلي للعنوان" : "Please enter a detailed description for the address");
      return;
    }
    try {
      const addressData = {
        user_id: userId,
        label: fullLabel,
        address_text: selectedLocation.address,
        details: detailsText,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        is_default: addresses.length === 0 || newAddress.is_default
      };
      const { data, error } = await supabase.from("user_addresses").insert(addressData).select().single();
      if (error) throw error;
      if (addressData.is_default) {
        await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId).neq("id", data.id);
      }
      toast.success(lang === "ar" ? "✅ تم إضافة العنوان" : "✅ Address added");
      setNewAddress({ label: "", address_text: "", details: "", lat: null, lng: null, is_default: false });
      setSelectedLocation(null);
      setIsAdding(false);
      loadAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(lang === "ar" ? "خطأ في إضافة العنوان" : "Error adding address");
    }
  };
  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    if (!selectedLocation) {
      toast.error(lang === "ar" ? "الرجاء اختيار الموقع على الخريطة" : "Please select a location on the map");
      return;
    }
    const fullLabel = editingAddress.label?.trim() || "";
    if (!fullLabel) {
      toast.error(lang === "ar" ? "الرجاء إدخال تسمية للعنوان" : "Please enter a label for the address");
      return;
    }
    const detailsText = selectedLocation.details?.trim() || editingAddress.details?.trim() || "";
    if (!detailsText) {
      toast.error(lang === "ar" ? "الرجاء إدخال وصف تفصيلي للعنوان" : "Please enter a detailed description for the address");
      return;
    }
    try {
      const addressData = {
        label: fullLabel,
        address_text: selectedLocation.address,
        details: detailsText,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        is_default: editingAddress.is_default
      };
      const { error } = await supabase.from("user_addresses").update(addressData).eq("id", editingAddress.id);
      if (error) throw error;
      if (addressData.is_default) {
        await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId).neq("id", editingAddress.id);
      }
      toast.success(lang === "ar" ? "✅ تم تحديث العنوان" : "✅ Address updated");
      setEditingAddress(null);
      setSelectedLocation(null);
      loadAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(lang === "ar" ? "خطأ في تحديث العنوان" : "Error updating address");
    }
  };
  const handleDeleteAddress = async (id) => {
    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", id);
      if (error) throw error;
      toast.success(lang === "ar" ? "✅ تم حذف العنوان" : "✅ Address deleted");
      loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(lang === "ar" ? "خطأ في حذف العنوان" : "Error deleting address");
    }
  };
  const handleSetDefault = async (id) => {
    try {
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId);
      const { error } = await supabase.from("user_addresses").update({ is_default: true }).eq("id", id);
      if (error) throw error;
      toast.success(lang === "ar" ? "✅ تم تعيين العنوان كافتراضي" : "✅ Address set as default");
      loadAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(lang === "ar" ? "خطأ في تعيين العنوان الافتراضي" : "Error setting default address");
    }
  };
  const openEditDialog = (address) => {
    setEditingAddress(address);
    setSelectedLocation({
      address: address.address_text,
      details: address.details || "",
      lat: address.lat || 0,
      lng: address.lng || 0,
      label: address.label
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-[#2a655f]" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    addresses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: MapPin, className: "h-12 w-12 mx-auto mb-3 opacity-30", color: "text-[#2a655f]", size: "h-12 w-12", delay: 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: lang === "ar" ? "لا توجد عناوين مسجلة" : "No addresses saved" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: lang === "ar" ? "أضف عنوانك الأول" : "Add your first address" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: addresses.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `p-4 rounded-xl border-2 transition-all ${addr.is_default ? "border-[#2a655f] bg-[#2a655f]/10 dark:bg-[#2a655f]/20" : "border-slate-200/50 dark:border-slate-800/50 hover:border-[#2a655f]/50"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 dark:text-white", children: addr.label }),
              addr.is_default && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2a655f] text-white", children: lang === "ar" ? "افتراضي" : "Default" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: addr.address_text }),
            addr.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-0.5", children: addr.details })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            !addr.is_default && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20",
                onClick: () => handleSetDefault(addr.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-muted-foreground hover:text-[#2a655f]" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20",
                onClick: () => openEditDialog(addr),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 text-muted-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-muted-foreground hover:text-red-500" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: lang === "ar" ? "حذف العنوان" : "Delete Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: lang === "ar" ? "هل أنت متأكد من حذف هذا العنوان؟ هذا الإجراء لا يمكن التراجع عنه." : "Are you sure you want to delete this address? This action cannot be undone." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: lang === "ar" ? "إلغاء" : "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: () => handleDeleteAddress(addr.id),
                      className: "bg-red-500 hover:bg-red-600",
                      children: lang === "ar" ? "حذف" : "Delete"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      },
      addr.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "w-full rounded-xl border-dashed border-2 border-[#2a655f]/30 hover:border-[#2a655f]/60 hover:bg-[#2a655f]/5 transition-all h-12",
        onClick: () => {
          setIsAdding(true);
          setNewAddress({
            label: "",
            address_text: "",
            details: "",
            lat: null,
            lng: null,
            is_default: false
          });
          setSelectedLocation(null);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Plus, className: "h-4 w-4 mr-2", color: "text-[#2a655f]", size: "h-4 w-4", delay: 0 }),
          lang === "ar" ? "إضافة عنوان جديد" : "Add New Address"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isAdding, onOpenChange: (open) => {
      setIsAdding(open);
      if (!open) {
        setNewAddress({
          label: "",
          address_text: "",
          details: "",
          lat: null,
          lng: null,
          is_default: false
        });
        setSelectedLocation(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: lang === "ar" ? "إضافة عنوان جديد" : "Add New Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: lang === "ar" ? "اختر موقعك على الخريطة وأدخل تفاصيل العنوان" : "Pick your location on the map and enter address details" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: lang === "ar" ? "تسمية العنوان *" : "Address Label *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newAddress.label || "",
              onChange: (e) => setNewAddress({ ...newAddress, label: e.target.value }),
              placeholder: lang === "ar" ? "مثال: المنزل، العمل" : "e.g. Home, Work",
              className: "mt-1.5 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: lang === "ar" ? "اختر الموقع على الخريطة *" : "Pick Location on Map *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 rounded-xl overflow-hidden border border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AddressPicker,
            {
              value: selectedLocation,
              onChange: setSelectedLocation,
              lang,
              showLabel: false,
              showDetails: false
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: lang === "ar" ? "الوصف التفصيلي *" : "Detailed Description *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: newAddress.details || "",
              onChange: (e) => setNewAddress({ ...newAddress, details: e.target.value }),
              placeholder: lang === "ar" ? "وصف تفصيلي للعنوان (شارع، بناء، طابق، علامة مميزة...)" : "Detailed address description (street, building, floor, landmark...)",
              rows: 4,
              required: true,
              className: "mt-1.5 w-full px-4 py-3 rounded-xl border border-[#2a655f]/30 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/60 focus:ring-2 focus:ring-[#2a655f]/30 focus:outline-none transition-all resize-none text-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: lang === "ar" ? "📍 كلما كان الوصف أدق، وصل الطلب أسرع وأسهل. اذكر أقرب علامة مميزة." : "📍 The more precise your description, the faster and easier delivery gets. Mention the nearest landmark." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-[#2a655f]/10 dark:bg-[#2a655f]/20 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              id: "isDefault",
              checked: newAddress.is_default,
              onChange: (e) => setNewAddress({ ...newAddress, is_default: e.target.checked }),
              className: "h-4 w-4 rounded border-[#2a655f]/30 text-[#2a655f] focus:ring-[#2a655f]/30"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "isDefault", className: "text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-200", children: lang === "ar" ? "تعيين كعنوان افتراضي" : "Set as default address" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsAdding(false), children: lang === "ar" ? "إلغاء" : "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleAddAddress,
            className: "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#0d2e2a]/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Plus, className: "h-4 w-4 mr-2", color: "text-white", size: "h-4 w-4", delay: 0 }),
              lang === "ar" ? "إضافة" : "Add"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editingAddress, onOpenChange: (open) => !open && setEditingAddress(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: lang === "ar" ? "تعديل العنوان" : "Edit Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: lang === "ar" ? "قم بتحديث موقعك وتفاصيل العنوان" : "Update your location and address details" })
      ] }),
      editingAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: lang === "ar" ? "تسمية العنوان *" : "Address Label *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: editingAddress.label || "",
              onChange: (e) => setEditingAddress({ ...editingAddress, label: e.target.value }),
              placeholder: lang === "ar" ? "مثال: المنزل، العمل" : "e.g. Home, Work",
              className: "mt-1.5 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: lang === "ar" ? "اختر الموقع على الخريطة *" : "Pick Location on Map *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 rounded-xl overflow-hidden border border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AddressPicker,
            {
              value: selectedLocation,
              onChange: setSelectedLocation,
              lang,
              showLabel: false,
              showDetails: false
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: lang === "ar" ? "الوصف التفصيلي *" : "Detailed Description *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: editingAddress.details || "",
              onChange: (e) => setEditingAddress({ ...editingAddress, details: e.target.value }),
              placeholder: lang === "ar" ? "وصف تفصيلي للعنوان (شارع، بناء، طابق، علامة مميزة...)" : "Detailed address description (street, building, floor, landmark...)",
              rows: 4,
              required: true,
              className: "mt-1.5 w-full px-4 py-3 rounded-xl border border-[#2a655f]/30 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/60 focus:ring-2 focus:ring-[#2a655f]/30 focus:outline-none transition-all resize-none text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-[#2a655f]/10 dark:bg-[#2a655f]/20 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              id: "editIsDefault",
              checked: editingAddress.is_default,
              onChange: (e) => setEditingAddress({ ...editingAddress, is_default: e.target.checked }),
              className: "h-4 w-4 rounded border-[#2a655f]/30 text-[#2a655f] focus:ring-[#2a655f]/30"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "editIsDefault", className: "text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-200", children: lang === "ar" ? "تعيين كعنوان افتراضي" : "Set as default address" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditingAddress(null), children: lang === "ar" ? "إلغاء" : "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleUpdateAddress,
            className: "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#0d2e2a]/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Save, className: "h-4 w-4 mr-2", color: "text-white", size: "h-4 w-4", delay: 0 }),
              lang === "ar" ? "حفظ التغييرات" : "Save Changes"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function ProfileTab({ profile, refetch }) {
  const app = useApp();
  useT();
  const updateProfile = useUpdateProfile();
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [avatarUrl, setAvatarUrl] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [phoneError, setPhoneError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);
  const handlePhoneChange = async (value) => {
    setPhone(value);
    setPhoneError(null);
    if (value.trim().length >= 5 && app.user) {
      const result = await isPhoneAvailable(value.trim(), app.user.id);
      if (!result.available) {
        setPhoneError(result.message || null);
      }
    }
  };
  async function saveProfile() {
    if (!app.user) return;
    if (phone && phone.trim().length >= 5) {
      const phoneCheck = await isPhoneAvailable(phone.trim(), app.user.id);
      if (!phoneCheck.available) {
        toast.error(phoneCheck.message);
        return;
      }
    }
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: app.user.id,
        patch: {
          full_name: fullName || null,
          phone: phone || null,
          avatar_url: avatarUrl || null
        }
      });
      if (app.user) {
        app.updateUser({
          name: fullName,
          phone,
          avatar_url: avatarUrl
        });
      }
      toast.success(app.lang === "ar" ? "✅ تم حفظ الملف الشخصي" : "✅ Profile saved");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-[#2a655f]/20 shadow-lg shadow-[#2a655f]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 dark:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: User, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 0, glow: true }),
        app.lang === "ar" ? "معلومات الملف الشخصي" : "Profile Information"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: app.lang === "ar" ? "تحديث معلوماتك الشخصية الأساسية" : "Update your basic personal information" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Camera, className: "h-4 w-4", color: "text-[#2a655f]", size: "h-4 w-4", delay: 100 }),
          app.lang === "ar" ? "الصورة الشخصية" : "Profile Picture",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: [
            "(",
            app.lang === "ar" ? "اختياري" : "Optional",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-20 w-20 rounded-2xl border-2 border-[#2a655f]/30", children: avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl, alt: fullName }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white text-2xl", children: fullName?.charAt(0)?.toUpperCase() || "U" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageInput,
            {
              value: avatarUrl,
              onChange: setAvatarUrl,
              userId: app.user?.id,
              folder: "avatars",
              lang: app.lang,
              label: app.lang === "ar" ? "📸 اضغط لرفع الصورة الشخصية" : "📸 Click to upload profile picture",
              hint: app.lang === "ar" ? "صورة مربعة، يفضل 400×400 بكسل" : "Square image, preferably 400×400 pixels",
              previewClassName: "h-20 w-20 rounded-2xl object-cover",
              required: false
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: app.lang === "ar" ? "الاسم الكامل" : "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: fullName,
            onChange: (e) => setFullName(e.target.value),
            placeholder: app.lang === "ar" ? "أدخل اسمك الكامل" : "Enter your full name",
            className: "mt-1.5 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Phone, className: "h-4 w-4", color: "text-[#2a655f]", size: "h-4 w-4", delay: 200 }),
          app.lang === "ar" ? "رقم الهاتف" : "Phone Number",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-normal", children: [
            "(",
            app.lang === "ar" ? "فريد" : "Unique",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: phone,
            onChange: (e) => handlePhoneChange(e.target.value),
            placeholder: app.lang === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number",
            className: `mt-1.5 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30 ${phoneError ? "border-red-500 focus-visible:ring-red-500" : ""}`,
            dir: "ltr"
          }
        ),
        phoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 mt-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
          phoneError
        ] }),
        phone && phone.trim().length >= 5 && !phoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-500 mt-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
          app.lang === "ar" ? "✅ رقم الهاتف متاح" : "✅ Phone number is available"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: saveProfile,
          disabled: isSaving || !!phoneError,
          className: "w-full rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#0d2e2a]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed h-12",
          children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            app.lang === "ar" ? "جاري الحفظ..." : "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Save, className: "h-4 w-4 mr-2", color: "text-white", size: "h-4 w-4", delay: 0 }),
            app.lang === "ar" ? "حفظ التغييرات" : "Save Changes"
          ] })
        }
      )
    ] })
  ] });
}
function SecurityTab() {
  const app = useApp();
  const [currentPassword, setCurrentPassword] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = reactExports.useState(false);
  const [showNewPassword, setShowNewPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [passwordError, setPasswordError] = reactExports.useState(null);
  const validatePassword = () => {
    if (currentPassword && newPassword === currentPassword) {
      setPasswordError(
        app.lang === "ar" ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" : "⚠️ New password must be different from the old one"
      );
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError(
        app.lang === "ar" ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters"
      );
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(
        app.lang === "ar" ? "كلمة المرور غير متطابقة" : "Passwords do not match"
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };
  const handleChangePassword = async () => {
    if (currentPassword === newPassword) {
      toast.error(
        app.lang === "ar" ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" : "⚠️ New password must be different from the old one"
      );
      return;
    }
    if (!validatePassword()) return;
    if (!app.user?.email) {
      toast.error(
        app.lang === "ar" ? "❌ لا يوجد بريد إلكتروني مرتبط بالحساب" : "❌ No email associated with account"
      );
      return;
    }
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: app.user.email,
        password: currentPassword
      });
      if (signInError) {
        toast.error(
          app.lang === "ar" ? "❌ كلمة المرور الحالية غير صحيحة" : "❌ Current password is incorrect"
        );
        setIsLoading(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        if (error.message?.includes("same as the old password") || error.message?.includes("should be different from the old password")) {
          toast.error(
            app.lang === "ar" ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" : "⚠️ New password must be different from the old one"
          );
        } else {
          toast.error(
            error.message || app.lang === "ar" ? "❌ فشل تغيير كلمة المرور" : "❌ Failed to change password"
          );
        }
        setIsLoading(false);
        return;
      }
      toast.success(
        app.lang === "ar" ? "✅ تم تغيير كلمة المرور بنجاح" : "✅ Password changed successfully"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.message?.includes("same as the old password") || error.message?.includes("should be different from the old password")) {
        toast.error(
          app.lang === "ar" ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" : "⚠️ New password must be different from the old one"
        );
      } else {
        toast.error(
          error.message || app.lang === "ar" ? "❌ فشل تغيير كلمة المرور" : "❌ Failed to change password"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-[#2a655f]/20 shadow-lg shadow-[#2a655f]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 dark:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Shield, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 0, glow: true }),
        app.lang === "ar" ? "الأمان وكلمة المرور" : "Security & Password"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: app.lang === "ar" ? "تغيير كلمة المرور وإدارة أمان الحساب" : "Change password and manage account security" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-[#2a655f]/10 dark:bg-[#2a655f]/20 border border-[#2a655f]/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-slate-900 dark:text-white flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Lock, className: "h-4 w-4", color: "text-[#2a655f]", size: "h-4 w-4", delay: 100 }),
        app.lang === "ar" ? "تغيير كلمة المرور" : "Change Password"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: app.lang === "ar" ? "كلمة المرور الحالية *" : "Current Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: showCurrentPassword ? "text" : "password",
                value: currentPassword,
                onChange: (e) => setCurrentPassword(e.target.value),
                placeholder: app.lang === "ar" ? "أدخل كلمة المرور الحالية" : "Enter current password",
                className: "h-11 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30 pr-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowCurrentPassword(!showCurrentPassword),
                className: "absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition",
                children: showCurrentPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: app.lang === "ar" ? "كلمة المرور الجديدة *" : "New Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: showNewPassword ? "text" : "password",
                value: newPassword,
                onChange: (e) => {
                  setNewPassword(e.target.value);
                  setPasswordError(null);
                },
                placeholder: app.lang === "ar" ? "أدخل كلمة المرور الجديدة (8 أحرف على الأقل)" : "Enter new password (at least 8 characters)",
                className: "h-11 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30 pr-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowNewPassword(!showNewPassword),
                className: "absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition",
                children: showNewPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-200", children: app.lang === "ar" ? "تأكيد كلمة المرور *" : "Confirm Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: showConfirmPassword ? "text" : "password",
                value: confirmPassword,
                onChange: (e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError(null);
                },
                placeholder: app.lang === "ar" ? "أعد إدخال كلمة المرور الجديدة" : "Re-enter new password",
                className: "h-11 rounded-xl border-[#2a655f]/30 focus:ring-[#2a655f]/30 pr-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                className: "absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition",
                children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        passwordError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-500 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: passwordError })
        ] }),
        currentPassword && newPassword && currentPassword === newPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-600 dark:text-amber-400", children: app.lang === "ar" ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" : "⚠️ New password must be different from the old one" })
        ] }),
        newPassword.length > 0 && !passwordError && currentPassword !== newPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all duration-300 ${newPassword.length < 8 ? "w-1/3 bg-red-500" : newPassword.length < 10 ? "w-2/3 bg-yellow-500" : "w-full bg-[#2a655f]"}`
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: newPassword.length < 8 ? app.lang === "ar" ? "ضعيفة" : "Weak" : newPassword.length < 10 ? app.lang === "ar" ? "متوسطة" : "Medium" : app.lang === "ar" ? "قوية" : "Strong" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleChangePassword,
            disabled: isLoading || !currentPassword || !newPassword || !confirmPassword || currentPassword === newPassword,
            className: "w-full h-11 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white font-bold shadow-lg shadow-[#0d2e2a]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
              app.lang === "ar" ? "جاري التغيير..." : "Changing..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: CircleCheck, className: "h-4 w-4", color: "text-white", size: "h-4 w-4", delay: 0 }),
              app.lang === "ar" ? "تغيير كلمة المرور" : "Change Password"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-start gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Shield, className: "h-3 w-3 text-[#2a655f] flex-shrink-0 mt-0.5", color: "text-[#2a655f]", size: "h-3 w-3", delay: 200 }),
          app.lang === "ar" ? "💡 استخدم كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز" : "💡 Use a strong password with uppercase, lowercase, numbers, and symbols"
        ] })
      ] })
    ] }) })
  ] });
}
function PreferencesTab() {
  const app = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = reactExports.useState(true);
  const [soundEnabled, setSoundEnabled] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-[#2a655f]/20 shadow-lg shadow-[#2a655f]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 dark:text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Globe, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 0, glow: true }),
        app.lang === "ar" ? "التفضيلات والإعدادات" : "Preferences & Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: app.lang === "ar" ? "تخصيص تجربتك في التطبيق" : "Customize your app experience" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition border border-transparent hover:border-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          app.theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Moon, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 100 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Sun, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 100 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: app.lang === "ar" ? "الوضع الليلي" : "Dark Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "تغيير مظهر التطبيق" : "Change app appearance" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: app.theme === "dark",
            onCheckedChange: app.toggleTheme,
            className: "data-[state=checked]:bg-[#2a655f]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition border border-transparent hover:border-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          notificationsEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Bell, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 200 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: BellOff, className: "h-5 w-5", color: "text-slate-400", size: "h-5 w-5", delay: 200 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: app.lang === "ar" ? "الإشعارات" : "Notifications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "تفعيل أو تعطيل الإشعارات" : "Enable or disable notifications" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: notificationsEnabled,
            onCheckedChange: setNotificationsEnabled,
            className: "data-[state=checked]:bg-[#2a655f]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition border border-transparent hover:border-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          soundEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Volume2, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 300 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: VolumeX, className: "h-5 w-5", color: "text-slate-400", size: "h-5 w-5", delay: 300 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: app.lang === "ar" ? "صوت الإشعارات" : "Notification Sound" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "تفعيل أو تعطيل صوت الإشعارات" : "Enable or disable notification sound" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: soundEnabled,
            onCheckedChange: setSoundEnabled,
            className: "data-[state=checked]:bg-[#2a655f]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition border border-transparent hover:border-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Globe, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 400 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: app.lang === "ar" ? "اللغة" : "Language" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "العربية" : "English" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => app.setLang(app.lang === "ar" ? "en" : "ar"),
            className: "rounded-xl border-[#2a655f]/30 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/60 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Globe, className: "h-4 w-4 mr-2", color: "text-[#2a655f]", size: "h-4 w-4", delay: 500 }),
              app.lang === "ar" ? "English" : "العربية"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function UserSettingsPage() {
  const app = useApp();
  const { profile, refetch } = useProfileWithUpdate();
  if (!app.user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#2a655f]/10 dark:bg-[#2a655f]/20 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-10 w-10 text-[#2a655f]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white mb-2", children: app.lang === "ar" ? "يرجى تسجيل الدخول" : "Please Login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: app.lang === "ar" ? "يجب تسجيل الدخول للوصول إلى إعدادات الملف الشخصي" : "You must be logged in to access profile settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => window.location.href = "/auth/login",
          className: "rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#0d2e2a]/30",
          children: app.lang === "ar" ? "تسجيل الدخول" : "Login"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto py-8 px-4 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-2xl shadow-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Settings, className: "h-7 w-7 text-white", color: "text-white", size: "h-7 w-7", delay: 0 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2a655f]/30 to-[#3a8a82]/30 blur-xl animate-pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [
          app.lang === "ar" ? "الإعدادات الشخصية" : "Personal Settings",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f] text-white text-[8px] font-bold", children: app.lang === "ar" ? "محدث" : "Updated" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Sparkles, className: "h-3.5 w-3.5", color: "text-[#2a655f]", size: "h-3.5 w-3.5", delay: 100 }),
          app.lang === "ar" ? "إدارة ملفك الشخصي وعناوينك وإعدادات الحساب" : "Manage your profile, addresses, and account settings"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "profile", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 w-full max-w-lg rounded-xl bg-[#2a655f]/10 dark:bg-[#2a655f]/20 p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "profile", className: "rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-[#2a655f]/20 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: User, className: "h-4 w-4 mr-2", color: "text-[#2a655f]", size: "h-4 w-4", delay: 0 }),
          app.lang === "ar" ? "الملف" : "Profile"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "addresses", className: "rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-[#2a655f]/20 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: MapPin, className: "h-4 w-4 mr-2", color: "text-[#2a655f]", size: "h-4 w-4", delay: 100 }),
          app.lang === "ar" ? "العناوين" : "Addresses"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "security", className: "rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-[#2a655f]/20 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Shield, className: "h-4 w-4 mr-2", color: "text-[#2a655f]", size: "h-4 w-4", delay: 200 }),
          app.lang === "ar" ? "الأمان" : "Security"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "preferences", className: "rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-[#2a655f]/20 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Globe, className: "h-4 w-4 mr-2", color: "text-[#2a655f]", size: "h-4 w-4", delay: 300 }),
          app.lang === "ar" ? "التفضيلات" : "Preferences"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileTab, { profile, refetch }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "addresses", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-[#2a655f]/20 shadow-lg shadow-[#2a655f]/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 dark:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: MapPinned, className: "h-5 w-5", color: "text-[#2a655f]", size: "h-5 w-5", delay: 0, glow: true }),
            app.lang === "ar" ? "عناويني" : "My Addresses"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: app.lang === "ar" ? "إدارة عناوينك (يمكنك إضافة عدة عناوين وتحديد الافتراضي)" : "Manage your addresses (you can add multiple addresses and set a default)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddressManager, { userId: app.user.id, lang: app.lang }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "security", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "preferences", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PreferencesTab, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(3deg); }
          75% { transform: translateY(4px) rotate(-2deg); }
        }
        .animate-float-icon {
          animation: float-icon 3s ease-in-out infinite;
        }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 3s ease-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      ` })
  ] });
}
const SplitComponent = UserSettingsPage;
export {
  SplitComponent as component
};
