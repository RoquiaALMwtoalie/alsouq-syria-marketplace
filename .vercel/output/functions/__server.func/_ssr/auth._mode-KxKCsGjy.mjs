import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b3 as Route$o, u as useApp, a as useT, b4 as useUserRoles, I as Input, L as Label, b2 as AddressPicker, b as Button } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { cz as Compass, g as Sparkles, bt as Gem, ar as Rocket, l as Crown, U as User, p as LoaderCircle, e as CircleCheckBig, X, r as Phone, _ as CircleAlert, c3 as EyeOff, W as Eye, cr as Lock, a0 as MapPin, ah as UserPlus, am as CircleQuestionMark, cA as Twitter, cB as Instagram, cC as Facebook, cD as Youtube, aa as Globe, ao as Headphones, Y as Send } from "../_libs/lucide-react.mjs";
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
async function getAuthRedirect(user) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const userRoles = (roles ?? []).map((r) => r.role);
  const role = userRoles[0] || "customer";
  const [{ data: profile }, { data: addressRows }] = await Promise.all([
    supabase.from("profiles").select("phone, full_name, address_text").eq("id", user.id).maybeSingle(),
    supabase.from("user_addresses").select("address_text").eq("user_id", user.id).eq("is_default", true).maybeSingle()
  ]);
  const hasPhone = profile?.phone && profile.phone.trim() !== "";
  const hasName = profile?.full_name && profile.full_name.trim() !== "";
  const hasAddress = Boolean(profile?.address_text?.trim() || addressRows?.address_text?.trim());
  if (role === "admin") {
    return { url: "/admin", needsCompletion: false, role };
  }
  if (role === "delivery_company") {
    if (!hasName || !hasPhone || !hasAddress) {
      return { url: "/delivery/complete", needsCompletion: true, role };
    }
    return { url: "/delivery/dashboard", needsCompletion: false, role };
  }
  if (role === "distributor") {
    return { url: "/distributor/dashboard", needsCompletion: false, role };
  }
  if (role === "seller") {
    return { url: "/dashboard", needsCompletion: false, role };
  }
  return { url: "/", needsCompletion: false, role };
}
function phoneToEmail(phone) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `sy${digits}@souqi.local`;
}
function isValidSyrianPhoneFormat(phone) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  if (!/^[0-9+]+$/.test(cleanPhone)) {
    return {
      valid: false,
      message: "⚠️ الرقم يجب أن يحتوي على أرقام فقط"
    };
  }
  const digits = cleanPhone.replace(/[^0-9]/g, "");
  let isValid = false;
  let numberAfterPrefix = "";
  if (cleanPhone.startsWith("+963")) {
    if (digits.length === 12) {
      numberAfterPrefix = digits.slice(-9);
      isValid = numberAfterPrefix.startsWith("9");
    }
  } else if (cleanPhone.startsWith("00963")) {
    if (digits.length === 14) {
      numberAfterPrefix = digits.slice(-9);
      isValid = numberAfterPrefix.startsWith("9");
    }
  } else if (cleanPhone.startsWith("0")) {
    if (digits.length === 10) {
      numberAfterPrefix = digits.slice(1);
      isValid = numberAfterPrefix.startsWith("9");
    }
  } else if (digits.length === 9) {
    numberAfterPrefix = digits;
    isValid = numberAfterPrefix.startsWith("9");
  }
  if (!isValid) {
    return {
      valid: false,
      message: "⚠️ صيغة الرقم غير صحيحة. استخدم: +963xxxxxxxxx أو 0xxxxxxxxx (يبدأ بـ 9)"
    };
  }
  return {
    valid: true
  };
}
async function isPhoneAvailableForRegister(phone) {
  if (!phone || phone.trim().length < 5) {
    return {
      available: false,
      message: "رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)"
    };
  }
  const formatCheck = isValidSyrianPhoneFormat(phone);
  if (!formatCheck.valid) {
    return {
      available: false,
      message: formatCheck.message || "⚠️ صيغة الرقم غير صحيحة"
    };
  }
  const {
    data,
    error
  } = await supabase.from("profiles").select("id, phone").eq("phone", phone.trim()).maybeSingle();
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
  return {
    available: true
  };
}
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
async function saveAddressWithGovernorate(userId, location) {
  try {
    const {
      governorate_id,
      governorate_name
    } = await extractGovernorateFromAddress(location.address, location.lat, location.lng);
    console.log("📍 Extracted governorate:", governorate_name, "ID:", governorate_id);
    const addressPayload = {
      user_id: userId,
      label: location.label || "الرئيسي",
      address_text: location.address.trim(),
      details: location.details?.trim() || "",
      lat: location.lat || 0,
      lng: location.lng || 0,
      governorate_id: governorate_id || null,
      is_default: true
    };
    const {
      data: existingAddress
    } = await supabase.from("user_addresses").select("id").eq("user_id", userId).maybeSingle();
    if (existingAddress?.id) {
      const {
        error
      } = await supabase.from("user_addresses").update(addressPayload).eq("id", existingAddress.id);
      if (error) throw error;
    } else {
      const {
        error
      } = await supabase.from("user_addresses").insert(addressPayload);
      if (error) throw error;
    }
    const {
      error: updateProfileError
    } = await supabase.from("profiles").update({
      lat: location.lat || 0,
      lng: location.lng || 0,
      address_text: location.address.trim(),
      governorate_id: governorate_id || null
    }).eq("id", userId);
    if (updateProfileError) {
      console.error("❌ Error updating profile:", updateProfileError);
      throw updateProfileError;
    }
    console.log("✅ Address saved with governorate:", governorate_name);
    return {
      success: true
    };
  } catch (error) {
    console.error("❌ Error saving address:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
function GlassField({
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-xs font-bold text-white/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-y-0 start-3 z-10 my-auto h-4 w-4 text-[#f9a8d4]", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "[&_input]:h-12 [&_input]:rounded-2xl [&_input]:border-0 [&_input]:bg-white/[.97] [&_input]:ps-9 [&_input]:text-slate-800 [&_input]:placeholder:text-slate-400 [&_input]:shadow-[0_4px_20px_rgba(0,0,0,.08)] [&_input]:focus:ring-2 [&_input]:focus:ring-[#f9a8d4]/50", children })
    ] })
  ] });
}
const ZOOQ_SLIDES = [{
  arTitle: "كل ذوق… إله مكان.",
  arText: "اكتشف متاجر ومنتجات بتشبهك، وخلي اختيارك يحكي عنك.",
  enTitle: "Every taste has a place.",
  enText: "Discover stores and products that feel like you.",
  icon: Compass,
  accent: "pink"
}, {
  arTitle: "مو بس تسوّق…",
  arText: "اختار. اكتشف. واستمتع بتجربة معمولة على ذوقك.",
  enTitle: "More than shopping.",
  enText: "Discover. Choose. Enjoy a shopping experience made for you.",
  icon: Sparkles,
  accent: "olive"
}, {
  arTitle: "الاختيار إلو ذوق.",
  arText: "ومن هون… بيبدأ الاختيار الصح.",
  enTitle: "Choice has a taste.",
  enText: "And this is where the right choice begins.",
  icon: Gem,
  accent: "pink"
}, {
  arTitle: "اللي بتدور عليه… أقرب مما تتخيّل.",
  arText: "مكان واحد، آلاف الخيارات، وذوقك هو البداية.",
  enTitle: "What you want is closer than you think.",
  enText: "One place. Endless choices. Your taste leads the way.",
  icon: Rocket,
  accent: "olive"
}, {
  arTitle: "خلّي ذوقك يحكي.",
  arText: "تسوّق بطريقتك. اختار بطريقتك. وكن أنت.",
  enTitle: "Let your taste speak.",
  enText: "Shop your way. Choose your way. Be you.",
  icon: Crown,
  accent: "pink"
}];
function AuthPage() {
  const {
    mode
  } = Route$o.useParams();
  const app = useApp();
  const t = useT();
  const nav = useNavigate();
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [slide, setSlide] = reactExports.useState(0);
  const [isCheckingPhone, setIsCheckingPhone] = reactExports.useState(false);
  const [phoneError, setPhoneError] = reactExports.useState(null);
  const [phoneAvailable, setPhoneAvailable] = reactExports.useState(null);
  const [detectedGovernorate, setDetectedGovernorate] = reactExports.useState("");
  const [isExtractingGovernorate, setIsExtractingGovernorate] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % 5);
    }, 5e3);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    const checkSession = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (session?.user) {
          const {
            data: roles
          } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
          const userRoles2 = roles?.map((r) => r.role) || [];
          let redirectPath = "/";
          if (userRoles2.includes("admin")) redirectPath = "/admin";
          else if (userRoles2.includes("delivery_company")) redirectPath = "/delivery/dashboard";
          else if (userRoles2.includes("distributor")) redirectPath = "/distributor/dashboard";
          else if (userRoles2.includes("seller")) redirectPath = "/dashboard";
          window.location.replace(redirectPath);
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    timeoutId = setTimeout(checkSession, 150);
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  reactExports.useEffect(() => {
    if (!isRegister) return;
    const checkPhone = async () => {
      const cleanPhone = phone.trim();
      if (cleanPhone.length < 5) {
        setPhoneError(null);
        setPhoneAvailable(null);
        return;
      }
      setIsCheckingPhone(true);
      try {
        const result = await isPhoneAvailableForRegister(cleanPhone);
        setPhoneAvailable(result.available);
        setPhoneError(result.available ? null : result.message || null);
      } catch (error) {
        console.error("Error checking phone:", error);
        setPhoneError("حدث خطأ في التحقق من الرقم");
        setPhoneAvailable(false);
      } finally {
        setIsCheckingPhone(false);
      }
    };
    const timer = setTimeout(checkPhone, 500);
    return () => clearTimeout(timer);
  }, [phone, isRegister]);
  reactExports.useEffect(() => {
    const extractGovernorate = async () => {
      if (!location) {
        setDetectedGovernorate("");
        return;
      }
      setIsExtractingGovernorate(true);
      try {
        const result = await extractGovernorateFromAddress(location.address, location.lat, location.lng);
        setDetectedGovernorate(result.governorate_name);
      } catch (error) {
        console.error("Error extracting governorate:", error);
      } finally {
        setIsExtractingGovernorate(false);
      }
    };
    extractGovernorate();
  }, [location]);
  function handleForgotPasswordClick() {
    nav({
      to: "/reset-password"
    });
  }
  function getLoginErrorMessage(error) {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";
    const errorMessages = {
      "Invalid login credentials": {
        ar: "❌ رقم الهاتف أو كلمة المرور غير صحيحة",
        en: "❌ Invalid phone number or password"
      },
      "Email not confirmed": {
        ar: "⚠️ البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني",
        en: "⚠️ Email not confirmed. Please check your email"
      },
      "User not found": {
        ar: "❌ لا يوجد حساب بهذا الرقم",
        en: "❌ No account found with this number"
      },
      "Invalid password": {
        ar: "❌ كلمة المرور غير صحيحة",
        en: "❌ Invalid password"
      },
      "Too many requests": {
        ar: "⚠️ عدد كبير من المحاولات. يرجى المحاولة لاحقاً",
        en: "⚠️ Too many attempts. Please try again later"
      }
    };
    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value[lang];
      }
    }
    if (message.includes("phone") || message.includes("رقم")) {
      return lang === "ar" ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number";
    }
    if (message.includes("password") || message.includes("كلمة المرور")) {
      return lang === "ar" ? "❌ كلمة المرور غير صحيحة" : "❌ Invalid password";
    }
    return lang === "ar" ? `❌ حدث خطأ: ${message}` : `❌ Error: ${message}`;
  }
  function getRegisterErrorMessage(error) {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";
    const errorMessages = {
      "User already registered": {
        ar: "⚠️ هذا الرقم مسجل مسبقاً. يرجى تسجيل الدخول",
        en: "⚠️ This number is already registered. Please login"
      },
      "Password should be at least 6 characters": {
        ar: "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        en: "❌ Password must be at least 6 characters"
      },
      "Email already in use": {
        ar: "⚠️ هذا الرقم مستخدم من قبل حساب آخر",
        en: "⚠️ This number is already in use"
      },
      "Network error": {
        ar: "⚠️ خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت",
        en: "⚠️ Network error. Please check your internet connection"
      }
    };
    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value[lang];
      }
    }
    if (message.includes("phone") || message.includes("رقم")) {
      return lang === "ar" ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number";
    }
    if (message.includes("password") || message.includes("كلمة المرور")) {
      return lang === "ar" ? "❌ كلمة المرور غير صحيحة" : "❌ Invalid password";
    }
    return lang === "ar" ? `❌ حدث خطأ: ${message}` : `❌ Error: ${message}`;
  }
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!phone.trim() || !password.trim()) {
        toast.error(app.lang === "ar" ? "❌ رقم الهاتف وكلمة المرور مطلوبة" : "❌ Phone and password are required");
        setLoading(false);
        return;
      }
      const formatCheck = isValidSyrianPhoneFormat(phone);
      if (!formatCheck.valid) {
        toast.error(app.lang === "ar" ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx" : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx");
        setLoading(false);
        return;
      }
      const digits = phone.replace(/[^0-9]/g, "");
      const possibleEmails = [`sy${digits}@souqi.local`, `${digits}@delivery.com`, `${digits}@distributor.sy`, `${digits}@company-admin.com`, `${digits}@company.com`];
      let signInData = null;
      let signInError = null;
      for (const email of possibleEmails) {
        console.log("🔍 Trying email format:", email);
        const res = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (!res.error) {
          signInData = res.data;
          console.log("✅ Successfully signed in with:", email);
          break;
        } else {
          signInError = res.error;
        }
      }
      if (!signInData && signInError) {
        const errorMessage = getLoginErrorMessage(signInError);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      const redirect = await getAuthRedirect(signInData.user);
      toast.success(app.lang === "ar" ? "✨ أهلاً بعودتك إلى ذوق" : "✨ Welcome back to Zooq");
      setTimeout(() => {
        window.location.replace(redirect.url);
      }, 300);
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = getLoginErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!phone.trim()) {
        toast.error(app.lang === "ar" ? "❌ رقم الهاتف مطلوب" : "❌ Phone is required");
        setLoading(false);
        return;
      }
      const formatCheck = isValidSyrianPhoneFormat(phone);
      if (!formatCheck.valid) {
        toast.error(app.lang === "ar" ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx" : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx");
        setLoading(false);
        return;
      }
      if (phoneError) {
        toast.error(phoneError);
        setLoading(false);
        return;
      }
      if (phoneAvailable === false) {
        toast.error(app.lang === "ar" ? "⚠️ هذا الرقم مستخدم من قبل" : "⚠️ This phone is already in use");
        setLoading(false);
        return;
      }
      if (!fullName.trim()) {
        toast.error(app.lang === "ar" ? "❌ الاسم الكامل مطلوب" : "❌ Full name is required");
        setLoading(false);
        return;
      }
      if (!password.trim()) {
        toast.error(app.lang === "ar" ? "❌ كلمة المرور مطلوبة" : "❌ Password is required");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error(app.lang === "ar" ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      if (!location) {
        toast.error(app.lang === "ar" ? "❌ الرجاء اختيار الموقع على الخريطة" : "❌ Please select a location on the map");
        setLoading(false);
        return;
      }
      if (!location.address || location.address.trim() === "") {
        toast.error(app.lang === "ar" ? "❌ الرجاء اختيار عنوان صحيح من الخريطة" : "❌ Please select a valid address from the map");
        setLoading(false);
        return;
      }
      const addressDetails = location.details?.trim() || "";
      if (!addressDetails) {
        toast.error(app.lang === "ar" ? "❌ الرجاء إدخال وصف تفصيلي للعنوان" : "❌ Please enter a detailed description for the address");
        setLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email: phoneToEmail(phone),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim()
          }
        }
      });
      if (error) {
        const errorMessage = getRegisterErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      const signInResult = await supabase.auth.signInWithPassword({
        email: phoneToEmail(phone),
        password
      });
      if (signInResult.error) {
        const errorMessage = getLoginErrorMessage(signInResult.error);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      const uid = signInResult.data.user?.id ?? data?.user?.id;
      if (!uid) {
        toast.error(app.lang === "ar" ? "❌ فشل تسجيل الدخول بعد التسجيل" : "❌ Failed to sign in after registration");
        setLoading(false);
        return;
      }
      const profileData = {
        id: uid,
        full_name: fullName.trim(),
        phone: phone.trim()
      };
      const {
        error: profileError
      } = await supabase.from("profiles").upsert(profileData, {
        onConflict: "id"
      });
      if (profileError) {
        console.error("Profile error:", profileError);
        toast.error(app.lang === "ar" ? "⚠️ حدث خطأ في حفظ الملف الشخصي" : "⚠️ Error saving profile");
        setLoading(false);
        return;
      }
      const saveResult = await saveAddressWithGovernorate(uid, location);
      if (!saveResult.success) {
        console.warn("⚠️ Address saved but governorate extraction failed:", saveResult.error);
      }
      if (detectedGovernorate) {
        toast.success(app.lang === "ar" ? `✨ تم تحديد المحافظة: ${detectedGovernorate}` : `✨ Governorate detected: ${detectedGovernorate}`);
      }
      toast.success(app.lang === "ar" ? "🎉 أهلاً فيك بعالم ذوق!" : "🎉 Welcome to the world of Zooq!");
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        const redirect = await getAuthRedirect(user);
        setTimeout(() => {
          window.location.replace(redirect.url);
        }, 500);
      } else {
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = getRegisterErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (isLogin) {
      await handleLogin(e);
    } else {
      await handleRegister(e);
    }
  }
  const {
    data: userRoles = []
  } = useUserRoles(app.user?.id);
  const isDeliveryCompany = userRoles.includes("delivery_company");
  const isDistributor = userRoles.includes("distributor");
  const isAdmin = userRoles.includes("admin");
  const isSeller = userRoles.includes("seller");
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  ZOOQ_SLIDES[slide]?.icon ?? Sparkles;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { dir: app.lang === "ar" ? "rtl" : "ltr", className: "relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#071f1c] text-white selection:bg-[#f9a8d4]/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10 overflow-hidden bg-[#071f1c]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/Logo.png", alt: "", draggable: false, className: "\n              absolute\n              inset-0\n              h-full\n              w-full\n              object-cover\n              select-none\n              pointer-events-none\n              opacity-[0.05]\n              sm:opacity-[0.07]\n              md:opacity-[0.09]\n              lg:opacity-[0.11]\n              animate-[logo-float-bg_12s_ease-in-out_infinite]\n            ", style: {
        filter: "blur(0.5px) drop-shadow(0 0 100px rgba(249,168,212,0.04))"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "\n            absolute\n            left-1/2\n            top-1/2\n            aspect-square\n            w-[70%]\n            max-w-[700px]\n            -translate-x-1/2\n            -translate-y-1/2\n            rounded-full\n            bg-[#f9a8d4]/[0.04]\n            blur-3xl\n            animate-[pulse-glow_8s_ease-in-out_infinite]\n          " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "\n            absolute\n            left-1/2\n            top-1/2\n            aspect-square\n            w-[50%]\n            max-w-[500px]\n            -translate-x-1/2\n            -translate-y-1/2\n            rounded-full\n            bg-[#2a655f]/[0.05]\n            blur-3xl\n            animate-[pulse-glow_10s_ease-in-out_infinite]\n            delay-1000\n          " })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes logo-float-bg {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }

          25% {
            transform: scale(1.03) rotate(1deg);
          }

          50% {
            transform: scale(1.06) rotate(0deg);
          }

          75% {
            transform: scale(1.03) rotate(-1deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }

          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes zooq-shine {
          0% {
            transform: translateX(-140%) skewX(-18deg);
          }

          100% {
            transform: translateX(280%) skewX(-18deg);
          }
        }

        @keyframes shimmer-gold {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        @keyframes logo-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }

          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }

        .zooq-glass {
          background:
            linear-gradient(
              145deg,
              rgba(9,35,32,.92),
              rgba(20,68,63,.85)
            );

          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);

          border: 1px solid rgba(255,255,255,.09);

          box-shadow:
            0 35px 100px rgba(0,0,0,.52),
            inset 0 1px 0 rgba(255,255,255,.055);
        }

        .zooq-submit {
          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #fbcfe8 28%,
              #f9a8d4 70%,
              #2a655f 135%
            );

          color: #082520;

          box-shadow:
            0 16px 38px rgba(249,168,212,.26),
            inset 0 1px 0 rgba(255,255,255,.7);

          transition:
            transform .3s ease,
            box-shadow .3s ease,
            filter .3s ease;
        }

        .zooq-submit:hover:not(:disabled) {
          transform: translateY(-3px);

          box-shadow:
            0 22px 50px rgba(249,168,212,.38),
            0 0 25px rgba(42,101,95,.16);

          filter: brightness(1.035);
        }

        .zooq-submit:active:not(:disabled) {
          transform: translateY(-1px) scale(.99);
        }

        .zooq-submit:disabled {
          opacity: .58;
          cursor: not-allowed;
        }

        .zooq-link {
          transition:
            color .2s ease,
            opacity .2s ease,
            transform .2s ease;
        }

        .zooq-link:hover {
          color: #f9a8d4;
        }

        .logo-animate {
          animation:
            logo-float 4s ease-in-out infinite;
        }

        .zooq-brand-title {
          text-shadow:
            0 15px 45px rgba(0,0,0,.35);
        }

        .zooq-o-pink {
          color: #f9a8d4;

          text-shadow:
            0 0 30px rgba(249,168,212,.38);
        }

        .zooq-o-olive {
          color: #2a655f;

          text-shadow:
            0 0 24px rgba(42,101,95,.32);
        }

        .zooq-logo-ring {
          animation:
            logo-float 8s linear infinite;

          transform-origin: center;
        }

        .zooq-social {
          transition: all .25s ease;
        }

        .zooq-social:hover {
          transform: translateY(-4px);

          color: #f9a8d4;

          border-color:
            rgba(249,168,212,.38);

          background:
            rgba(42,101,95,.18);

          box-shadow:
            0 8px 25px rgba(249,168,212,.08);
        }

        .slide-content {
          animation:
            slide-enter .6s ease both;
        }

        @keyframes slide-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .zooq-slide-title-accent {
          position: relative;
          display: inline-block;
        }

        .zooq-slide-title-accent::after {
          content: "";

          position: absolute;

          left: 4%;
          right: 4%;

          bottom: -7px;

          height: 3px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #2a655f 25%,
              #f9a8d4 50%,
              #2a655f 75%,
              transparent
            );

          opacity: .72;

          filter: blur(.2px);
        }

        .zooq-slide-accent-line {
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(42,101,95,.95),
              rgba(249,168,212,.85),
              transparent
            );
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -start-32 -top-32 h-96 w-96 rounded-full bg-[#f9a8d4]/8 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -end-20 h-[30rem] w-[30rem] rounded-full bg-[#2a655f]/20 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute start-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbcfe8]/4 blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-6xl items-center justify-center px-4 py-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-lg mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "zooq-glass relative w-full overflow-hidden rounded-[2.5rem] p-6 shadow-[0_40px_120px_rgba(0,0,0,.55)] sm:p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#2a655f] opacity-90" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "zooq-brand-title text-3xl font-black leading-none tracking-[-.06em] sm:text-4xl", dir: "rtl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-white via-[#fbcfe8] to-[#f9a8d4] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer-gold_4s_linear_infinite]", children: "ذوق" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-6 bg-gradient-to-r from-transparent to-[#2a655f]/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-black tracking-[.2em] sm:text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "z" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "zooq-o-pink", children: "o" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "o" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "q" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-6 bg-gradient-to-l from-transparent to-[#f9a8d4]/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-full border border-[#f9a8d4]/15 bg-gradient-to-r from-[#2a655f]/10 via-[#f9a8d4]/[.045] to-[#fbcfe8]/[.05] px-3 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,.8)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black tracking-[.08em] text-white/60 sm:text-[10px]", children: app.lang === "ar" ? "كلشي ع ذوقك" : "Exactly your taste" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#f9a8d4] shadow-[0_0_12px_rgba(249,168,212,.8)]" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-black tracking-[.25em] text-white/20", children: isLogin ? app.lang === "ar" ? "دخول" : "LOGIN" : app.lang === "ar" ? "تسجيل" : "REGISTER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/30" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "relative space-y-4", onSubmit: handleSubmit, autoComplete: "off", children: [
        isRegister && /* @__PURE__ */ jsxRuntimeExports.jsx(GlassField, { label: t("full_name") + " *", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-[#f9a8d4]" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value), required: true, autoComplete: "off", className: "input-glow rounded-2xl border-0 transition-all duration-300", placeholder: app.lang === "ar" ? "الاسم اللي بتحب نناديك فيه" : "The name you'd like us to call you" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GlassField, { label: t("phone") + " *", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-[#f9a8d4]" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "zooq-input relative rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", placeholder: "+963 9xx xxx xxx", value: phone, onChange: (e) => setPhone(e.target.value), required: true, autoComplete: "off", className: `input-glow rounded-2xl border-0 pe-10 transition-all duration-300 ${phoneError && isRegister ? "border-red-500 focus-visible:ring-red-500" : ""} ${phoneAvailable === true && isRegister && phone.trim().length >= 5 ? "border-[#f9a8d4]" : ""}` }),
          isRegister && phone.trim().length >= 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 end-3 flex items-center", children: isCheckingPhone ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#f9a8d4]" }) : phoneAvailable === true ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-[#2a655f]" }) : phoneAvailable === false ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-red-400" }) : null })
        ] }) }),
        isRegister && phone.trim().length >= 5 && phoneError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 shrink-0 text-red-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-red-200", children: phoneError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GlassField, { label: t("password") + " *", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-[#f9a8d4]" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "zooq-input relative rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, autoComplete: "off", className: "input-glow rounded-2xl border-0 pe-10 transition-all duration-300", placeholder: app.lang === "ar" ? "كلمة المرور — 6 أحرف على الأقل" : "Password — 6+ characters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 end-3 my-auto text-[#f9a8d4]/70 transition hover:text-[#f9a8d4]", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
        ] }) }),
        isRegister && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-xs font-bold text-white/85", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]" }),
            app.lang === "ar" ? "وين بدنا نوصل طلباتك؟ *" : "Where should we deliver? *"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-white/10 bg-white/[.96] p-3 text-slate-800 transition-all duration-300 focus-within:border-[#f9a8d4]/60 focus-within:shadow-[0_0_0_3px_rgba(249,168,212,.08)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddressPicker, { value: location ?? void 0, onChange: setLocation, lang: app.lang }) }),
          location && detectedGovernorate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-[#f9a8d4]/20 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/[.07] p-2.5", children: [
            isExtractingGovernorate ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-[#f9a8d4]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-[#fbcfe8]", children: isExtractingGovernorate ? app.lang === "ar" ? "عم نحدد منطقتك..." : "Detecting your area..." : detectedGovernorate ? app.lang === "ar" ? `المحافظة: ${detectedGovernorate}` : `Governorate: ${detectedGovernorate}` : app.lang === "ar" ? "⚠️ لم يتم التحديد" : "⚠️ Not detected" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "lg", className: "zooq-submit group relative mt-2 h-13 w-full overflow-hidden rounded-2xl border-0 text-base font-black", disabled: loading || isRegister && (phoneAvailable === false || phoneError !== null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "zooq-shine pointer-events-none absolute inset-y-0 -start-1/2 w-1/2 skew-x-[-18deg] bg-white/20 animate-[zooq-shine_2.8s_ease-in-out_infinite]" }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-10 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" }),
            app.lang === "ar" ? "لحظة… عم نجهز كل شي" : "Just a moment..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-10 flex items-center justify-center gap-2", children: [
            isLogin ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
            isLogin ? app.lang === "ar" ? "دخول إلى ذوق" : "Enter Zooq" : app.lang === "ar" ? "ابدأ رحلتك مع ذوق" : "Start your Zooq journey"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-2 text-center text-sm text-white/65", children: isLogin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            app.lang === "ar" ? "لسا ما صار عندك حساب؟" : "Don't have an account?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/$mode", params: {
              mode: "register"
            }, className: "zooq-link font-black text-[#f9a8d4]", children: app.lang === "ar" ? "خلينا نبدأ" : "Let's start" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleForgotPasswordClick, className: "zooq-link mx-auto flex items-center justify-center gap-1.5 text-xs text-white/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-3.5 w-3.5 text-[#f9a8d4]" }),
            app.lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot your password?"
          ] }),
          app.user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1.5 border-t border-white/8 pt-3", children: [
            isDeliveryCompany && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/delivery/dashboard", className: "zooq-link block text-xs text-[#f9a8d4]", children: [
              "🚚 ",
              app.lang === "ar" ? "لوحة التوصيل" : "Delivery Dashboard"
            ] }),
            isDistributor && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/distributor/dashboard", className: "zooq-link block text-xs text-[#2a655f]", children: [
              "📦 ",
              app.lang === "ar" ? "لوحة الموزع" : "Distributor Dashboard"
            ] }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "zooq-link block text-xs text-red-300", children: [
              "⚡ ",
              app.lang === "ar" ? "لوحة الأدمن" : "Admin Panel"
            ] }),
            isSeller && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "zooq-link block text-xs text-amber-300", children: [
              "🏪 ",
              app.lang === "ar" ? "لوحة البائع" : "Seller Dashboard"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            app.lang === "ar" ? "عندك حساب معنا؟" : "Already part of Zooq?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/$mode", params: {
              mode: "login"
            }, className: "zooq-link font-black text-[#f9a8d4]", children: app.lang === "ar" ? "فوت لعندنا" : "Sign in" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 top-0 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black tracking-[.25em] text-white/25", children: app.lang === "ar" ? "أو" : "OR" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/20" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "block w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-2 h-11 w-full rounded-2xl border-white/10 bg-white/[.035] text-sm font-bold text-white hover:border-[#f9a8d4]/35 hover:bg-[#2a655f]/10 hover:text-white", children: app.lang === "ar" ? "خليني اكتشف أول 👀" : "Let me explore first 👀" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] text-white/30", children: app.lang === "ar" ? "تصفح، اكتشف، وخلي التسجيل لوقت ما تكون جاهز." : "Explore first. Sign up when you're ready." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-6 flex flex-col items-center justify-center gap-2 border-t border-white/7 pt-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#2a655f] shadow-[0_0_8px_rgba(42,101,95,.8)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black tracking-[.28em] text-white/25", children: "zooq" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[#f9a8d4] shadow-[0_0_8px_rgba(249,168,212,.8)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-white/30", children: app.lang === "ar" ? "كلشي ع ذوقك" : "Exactly your taste" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto w-full max-w-6xl px-4 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/7 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-between gap-3 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: [{
        icon: Twitter,
        label: "Twitter"
      }, {
        icon: Instagram,
        label: "Instagram"
      }, {
        icon: Facebook,
        label: "Facebook"
      }, {
        icon: Youtube,
        label: "YouTube"
      }, {
        icon: Globe,
        label: "Website"
      }].map((social) => {
        const Icon = social.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": social.label, className: "zooq-social flex h-8 w-8 items-center justify-center rounded-xl border border-white/7 bg-white/[.025] text-white/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }) }, social.label);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2 text-[10px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "zooq-link text-white/32", children: app.lang === "ar" ? "الخصوصية" : "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/15", children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "zooq-link text-white/32", children: app.lang === "ar" ? "الشروط" : "Terms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/15", children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/25", children: [
          "© ",
          year,
          " ذوق"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SupportButton, {})
  ] });
}
function SupportButton() {
  const app = useApp();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const [subject, setSubject] = reactExports.useState("");
  const [visitorPhone, setVisitorPhone] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isSuccess, setIsSuccess] = reactExports.useState(false);
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const handleOpenSupport = () => setIsOpen(true);
  const handleSubmitSupport = async () => {
    const phone = app.user?.phone || visitorPhone.trim();
    if (!phone) {
      toast.error(app.lang === "ar" ? "الرجاء إدخال رقم هاتفك للتواصل معك" : "Please enter your phone number");
      return;
    }
    if (!message.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء كتابة رسالتك" : "Please write your message");
      return;
    }
    setIsLoading(true);
    try {
      const {
        data: adminData,
        error: adminError
      } = await supabase.from("user_roles").select("user_id").eq("role", "admin").limit(1).single();
      if (adminError || !adminData) {
        toast.error(app.lang === "ar" ? "حدث خطأ، يرجى المحاولة لاحقاً" : "Error, please try again later");
        return;
      }
      const adminId = adminData.user_id;
      const userId = app.user?.id || adminId;
      const userPhone = app.user?.phone || visitorPhone.trim();
      const isRegistered = !!app.user;
      const {
        data: newConversation,
        error: convError
      } = await supabase.from("conversations").insert({
        participant1_id: userId,
        participant2_id: adminId,
        last_message: message.substring(0, 100),
        last_message_at: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (convError) throw convError;
      const conversationId = newConversation.id;
      const {
        error: msgError
      } = await supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: adminId,
        conversation_id: conversationId,
        content: `📩 رسالة دعم
📞 من: ${userPhone}
${isRegistered ? "✅ مستخدم مسجل" : "❌ زائر (ليس لديه حساب)"}
الموضوع: ${subject || "دعم"}

الرسالة:
${message}`,
        type: "text",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (msgError) throw msgError;
      await supabase.from("notifications").insert({
        user_id: adminId,
        type: "support",
        title_ar: "📩 رسالة دعم جديدة",
        body_ar: `📞 من: ${userPhone}
${isRegistered ? "✅ مسجل" : "❌ زائر"}
الموضوع: ${subject || "دعم"}`,
        reference_id: conversationId,
        link_url: `/messages/${conversationId}`,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setMessage("");
        setSubject("");
        setVisitorPhone("");
      }, 2e3);
      toast.success(app.lang === "ar" ? "✅ وصلت رسالتك! نحنا معك." : "✅ Your message is on its way!");
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 start-6 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleOpenSupport, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: "group relative flex items-center gap-3 rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] px-4 py-2.5 text-white shadow-lg shadow-[#f9a8d4]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#f9a8d4]/45 hover:shadow-xl hover:shadow-[#f9a8d4]/25", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { className: "h-5 w-5 text-[#f9a8d4]" }),
        !isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#fbcfe8] shadow-[0_0_8px_rgba(249,168,212,.8)]" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-sm font-bold sm:inline", children: app.lang === "ar" ? "نحنا هون" : "We're here" })
    ] }) }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] animate-in fade-in bg-black/65 backdrop-blur-md duration-200", onClick: () => setIsOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[101] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md animate-in overflow-hidden rounded-[2rem] border border-[#f9a8d4]/25 bg-[#071f1c] shadow-[0_35px_100px_rgba(0,0,0,.58)] zoom-in-95 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-[#f9a8d4]/15 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-br from-[#2a655f]/30 to-[#f9a8d4]/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { className: "h-6 w-6 text-[#f9a8d4]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black text-white", children: app.lang === "ar" ? "خلينا نساعدك" : "Let's help you" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-[#fbcfe8]/80", children: app.lang === "ar" ? "رسالتك بتوصلنا مباشرة 💗" : "Your message reaches us directly 💗" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsOpen(false), className: "text-white/50 transition-colors hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 p-6", children: isSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#f9a8d4]/30 bg-[#f9a8d4]/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-8 w-8 text-[#f9a8d4]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-black text-white", children: app.lang === "ar" ? "وصلت! 💗" : "Got it! 💗" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-[#fbcfe8]/80", children: app.lang === "ar" ? "نحنا معك، وراح نرد عليك بأسرع وقت." : "We're on it and will get back to you soon." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          app.user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-white/90", children: app.lang === "ar" ? "رقم هاتفك" : "Your Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", value: app.user?.phone || "غير متاح", disabled: true, className: "mt-1.5 h-11 cursor-not-allowed rounded-xl border-[#f9a8d4]/20 bg-white/10 text-white" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-white/90", children: app.lang === "ar" ? "رقم الهاتف *" : "Phone Number *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", value: visitorPhone, onChange: (e) => setVisitorPhone(e.target.value), placeholder: "+963 9xx xxx xxx", className: "mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-white/40", children: app.lang === "ar" ? "بس مشان نقدر نرجعلك" : "So we can get back to you" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-white/90", children: app.lang === "ar" ? "شو الموضوع؟" : "What's on your mind?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: subject, onChange: (e) => setSubject(e.target.value), placeholder: app.lang === "ar" ? "مثلاً: مشكلة بالحساب..." : "e.g. Account issue...", className: "mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-white/90", children: app.lang === "ar" ? "احكيلنا شو صار *" : "Tell us what happened *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: app.lang === "ar" ? "اكتب رسالتك هون… نحنا سامعينك." : "Write your message here...", rows: 4, className: "mt-1.5 w-full resize-none rounded-xl border border-[#f9a8d4]/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50 focus:bg-white/10 focus:outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSubmitSupport, disabled: isLoading || !message.trim() || !app.user && !visitorPhone.trim(), className: "h-12 w-full rounded-xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#174944] to-[#2a655f] font-black text-white shadow-lg shadow-[#f9a8d4]/15 transition-all hover:-translate-y-0.5 hover:border-[#f9a8d4]/45 hover:shadow-[#f9a8d4]/25", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }),
            app.lang === "ar" ? "عم نوصلها..." : "Sending..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-[#f9a8d4]" }),
            app.lang === "ar" ? "إرسال الرسالة" : "Send message"
          ] }) })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  AuthPage as component
};
