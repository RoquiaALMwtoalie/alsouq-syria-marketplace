
// src/routes/auth.$mode.tsx - مع العبارات الجانبية + لوغو جانبي متحرك

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Lock,
  User as UserIcon,
  Phone,
  Sparkles,
  Eye,
  EyeOff,
  Headphones,
  X,
  Send,
  CheckCircle,
  Shield,
  HelpCircle,
  Loader2,
  AlertCircle,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ShoppingBag,
  Truck,
  Compass,
  Gem,
  Crown,
  Rocket,
  UserPlus,
  Heart,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";
import { useUserRoles } from "@/lib/queries";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const ZOOQ_COLORS = {
  primary: "#2a655f",
  pink: "#f9a8d4",
  pinkLight: "#fbcfe8",
};

// ============================================================
// ✅ Export route
// ============================================================
export const Route = createFileRoute("/auth/$mode")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "ذوق | Zooq" }],
  }),
});

// ============================================================
// Helper functions
// ============================================================
function phoneToEmail(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `sy${digits}@souqi.local`;
}

function isValidSyrianPhoneFormat(phone: string): { valid: boolean; message?: string } {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  if (!/^[0-9+]+$/.test(cleanPhone)) {
    return { valid: false, message: "⚠️ الرقم يجب أن يحتوي على أرقام فقط" };
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
      message: "⚠️ صيغة الرقم غير صحيحة. استخدم: +963xxxxxxxxx أو 0xxxxxxxxx (يبدأ بـ 9)",
    };
  }

  return { valid: true };
}

async function isPhoneAvailableForRegister(phone: string): Promise<{
  available: boolean;
  message?: string;
}> {
  if (!phone || phone.trim().length < 5) {
    return {
      available: false,
      message: "رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)",
    };
  }

  const formatCheck = isValidSyrianPhoneFormat(phone);

  if (!formatCheck.valid) {
    return {
      available: false,
      message: formatCheck.message || "⚠️ صيغة الرقم غير صحيحة",
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, phone")
    .eq("phone", phone.trim())
    .maybeSingle();

  if (error) {
    console.error("Error checking phone:", error);

    return {
      available: false,
      message: "حدث خطأ في التحقق من الرقم",
    };
  }

  if (data) {
    return {
      available: false,
      message: "⚠️ هذا الرقم مستخدم من قبل حساب آخر",
    };
  }

  return { available: true };
}

async function extractGovernorateFromAddress(
  address: string,
  lat?: number,
  lng?: number
): Promise<{ governorate_id: string; governorate_name: string }> {
  try {
    if (lat && lng) {
      const { data: governorates } = await supabase.from("governorates").select("*");

      if (governorates) {
        for (const g of governorates) {
          if (g.center_lat && g.center_lng) {
            const distance = Math.sqrt(
              Math.pow(lat - g.center_lat, 2) +
              Math.pow(lng - g.center_lng, 2)
            );

            if (distance < 0.5) {
              return {
                governorate_id: g.id,
                governorate_name: g.name_ar,
              };
            }
          }
        }
      }
    }

    if (address) {
      const { data: governorates } = await supabase.from("governorates").select("*");

      if (governorates) {
        for (const g of governorates) {
          if (address.includes(g.name_ar) || address.includes(g.name_en || "")) {
            return {
              governorate_id: g.id,
              governorate_name: g.name_ar,
            };
          }
        }
      }
    }

    const { data: defaultGov } = await supabase
      .from("governorates")
      .select("id, name_ar")
      .eq("name_ar", "دمشق")
      .single();

    if (defaultGov) {
      return {
        governorate_id: defaultGov.id,
        governorate_name: defaultGov.name_ar,
      };
    }

    return {
      governorate_id: "",
      governorate_name: "",
    };
  } catch (error) {
    console.error("Error extracting governorate:", error);

    return {
      governorate_id: "",
      governorate_name: "",
    };
  }
}

async function saveAddressWithGovernorate(
  userId: string,
  location: PickedLocation
): Promise<{ success: boolean; error?: string }> {
  try {
    const { governorate_id, governorate_name } =
      await extractGovernorateFromAddress(
        location.address,
        location.lat,
        location.lng
      );

    console.log(
      "📍 Extracted governorate:",
      governorate_name,
      "ID:",
      governorate_id
    );

    const addressPayload = {
      user_id: userId,
      label: location.label || "الرئيسي",
      address_text: location.address.trim(),
      details: location.details?.trim() || "",
      lat: location.lat || 0,
      lng: location.lng || 0,
      governorate_id: governorate_id || null,
      is_default: true,
    };

    const { data: existingAddress } = await supabase
      .from("user_addresses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingAddress?.id) {
      const { error } = await supabase
        .from("user_addresses")
        .update(addressPayload)
        .eq("id", existingAddress.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("user_addresses")
        .insert(addressPayload);

      if (error) throw error;
    }

    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        lat: location.lat || 0,
        lng: location.lng || 0,
        address_text: location.address.trim(),
        governorate_id: governorate_id || null,
      })
      .eq("id", userId);

    if (updateProfileError) {
      console.error("❌ Error updating profile:", updateProfileError);
      throw updateProfileError;
    }

    console.log(
      "✅ Address saved with governorate:",
      governorate_name
    );

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error saving address:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================
// GlassField
// ============================================================
function GlassField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <Label className="flex items-center gap-2 text-xs font-bold text-white/90">
        <span className="h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]" />
        {label}
      </Label>

      <div className="relative mt-1.5">
        <span className="absolute inset-y-0 start-3 z-10 my-auto h-4 w-4 text-[#f9a8d4]">
          {icon}
        </span>

        <div className="[&_input]:h-12 [&_input]:rounded-2xl [&_input]:border-0 [&_input]:bg-white/[.97] [&_input]:ps-9 [&_input]:text-slate-800 [&_input]:placeholder:text-slate-400 [&_input]:shadow-[0_4px_20px_rgba(0,0,0,.08)] [&_input]:focus:ring-2 [&_input]:focus:ring-[#f9a8d4]/50">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🎨 ZOOQ — Brand slider content
// ============================================================
const ZOOQ_SLIDES = [
  {
    arTitle: "كل ذوق… إله مكان.",
    arText: "اكتشف متاجر ومنتجات بتشبهك، وخلي اختيارك يحكي عنك.",
    enTitle: "Every taste has a place.",
    enText: "Discover stores and products that feel like you.",
    icon: Compass,
    accent: "pink",
  },
  {
    arTitle: "مو بس تسوّق…",
    arText: "اختار. اكتشف. واستمتع بتجربة معمولة على ذوقك.",
    enTitle: "More than shopping.",
    enText:
      "Discover. Choose. Enjoy a shopping experience made for you.",
    icon: Sparkles,
    accent: "olive",
  },
  {
    arTitle: "الاختيار إلو ذوق.",
    arText: "ومن هون… بيبدأ الاختيار الصح.",
    enTitle: "Choice has a taste.",
    enText: "And this is where the right choice begins.",
    icon: Gem,
    accent: "pink",
  },
  {
    arTitle: "اللي بتدور عليه… أقرب مما تتخيّل.",
    arText: "مكان واحد، آلاف الخيارات، وذوقك هو البداية.",
    enTitle: "What you want is closer than you think.",
    enText:
      "One place. Endless choices. Your taste leads the way.",
    icon: Rocket,
    accent: "olive",
  },
  {
    arTitle: "خلّي ذوقك يحكي.",
    arText: "تسوّق بطريقتك. اختار بطريقتك. وكن أنت.",
    enTitle: "Let your taste speak.",
    enText: "Shop your way. Choose your way. Be you.",
    icon: Crown,
    accent: "pink",
  },
];

// ============================================================
// AuthPage
// ============================================================
function AuthPage() {
  const { mode } = Route.useParams();
  const app = useApp();
  const t = useT();
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] =
    useState<PickedLocation | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [slide, setSlide] = useState(0);

  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] =
    useState<string | null>(null);
  const [phoneAvailable, setPhoneAvailable] =
    useState<boolean | null>(null);

  const [detectedGovernorate, setDetectedGovernorate] =
    useState<string>("");
  const [isExtractingGovernorate, setIsExtractingGovernorate] =
    useState(false);

  // ============================================================
  // Slider auto-play
  // ============================================================
  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % 5);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  useEffect(() => {
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
        const result =
          await isPhoneAvailableForRegister(cleanPhone);

        setPhoneAvailable(result.available);
        setPhoneError(
          result.available ? null : result.message || null
        );
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

  useEffect(() => {
    const extractGovernorate = async () => {
      if (!location) {
        setDetectedGovernorate("");
        return;
      }

      setIsExtractingGovernorate(true);

      try {
        const result =
          await extractGovernorateFromAddress(
            location.address,
            location.lat,
            location.lng
          );

        setDetectedGovernorate(result.governorate_name);
      } catch (error) {
        console.error(
          "Error extracting governorate:",
          error
        );
      } finally {
        setIsExtractingGovernorate(false);
      }
    };

    extractGovernorate();
  }, [location]);

  function handleForgotPasswordClick() {
    nav({ to: "/reset-password" });
  }

  function getLoginErrorMessage(error: any): string {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";

    const errorMessages: Record<
      string,
      { ar: string; en: string }
    > = {
      "Invalid login credentials": {
        ar: "❌ رقم الهاتف أو كلمة المرور غير صحيحة",
        en: "❌ Invalid phone number or password",
      },
      "Email not confirmed": {
        ar: "⚠️ البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني",
        en: "⚠️ Email not confirmed. Please check your email",
      },
      "User not found": {
        ar: "❌ لا يوجد حساب بهذا الرقم",
        en: "❌ No account found with this number",
      },
      "Invalid password": {
        ar: "❌ كلمة المرور غير صحيحة",
        en: "❌ Invalid password",
      },
      "Too many requests": {
        ar: "⚠️ عدد كبير من المحاولات. يرجى المحاولة لاحقاً",
        en: "⚠️ Too many attempts. Please try again later",
      },
    };

    for (const [key, value] of Object.entries(errorMessages)) {
      if (
        message
          .toLowerCase()
          .includes(key.toLowerCase())
      ) {
        return value[lang];
      }
    }

    if (
      message.includes("phone") ||
      message.includes("رقم")
    ) {
      return lang === "ar"
        ? "❌ رقم الهاتف غير صحيح"
        : "❌ Invalid phone number";
    }

    if (
      message.includes("password") ||
      message.includes("كلمة المرور")
    ) {
      return lang === "ar"
        ? "❌ كلمة المرور غير صحيحة"
        : "❌ Invalid password";
    }

    return lang === "ar"
      ? `❌ حدث خطأ: ${message}`
      : `❌ Error: ${message}`;
  }

  function getRegisterErrorMessage(error: any): string {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";

    const errorMessages: Record<
      string,
      { ar: string; en: string }
    > = {
      "User already registered": {
        ar: "⚠️ هذا الرقم مسجل مسبقاً. يرجى تسجيل الدخول",
        en: "⚠️ This number is already registered. Please login",
      },
      "Password should be at least 6 characters": {
        ar: "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        en: "❌ Password must be at least 6 characters",
      },
      "Email already in use": {
        ar: "⚠️ هذا الرقم مستخدم من قبل حساب آخر",
        en: "⚠️ This number is already in use",
      },
      "Network error": {
        ar: "⚠️ خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت",
        en: "⚠️ Network error. Please check your internet connection",
      },
    };

    for (const [key, value] of Object.entries(errorMessages)) {
      if (
        message
          .toLowerCase()
          .includes(key.toLowerCase())
      ) {
        return value[lang];
      }
    }

    if (
      message.includes("phone") ||
      message.includes("رقم")
    ) {
      return lang === "ar"
        ? "❌ رقم الهاتف غير صحيح"
        : "❌ Invalid phone number";
    }

    if (
      message.includes("password") ||
      message.includes("كلمة المرور")
    ) {
      return lang === "ar"
        ? "❌ كلمة المرور غير صحيحة"
        : "❌ Invalid password";
    }

    return lang === "ar"
      ? `❌ حدث خطأ: ${message}`
      : `❌ Error: ${message}`;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!phone.trim() || !password.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ رقم الهاتف وكلمة المرور مطلوبة"
            : "❌ Phone and password are required"
        );

        setLoading(false);
        return;
      }

      const formatCheck =
        isValidSyrianPhoneFormat(phone);

      if (!formatCheck.valid) {
        toast.error(
          app.lang === "ar"
            ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx"
            : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx"
        );

        setLoading(false);
        return;
      }

      const digits = phone.replace(/[^0-9]/g, "");

      const possibleEmails = [
        `sy${digits}@souqi.local`,
        `${digits}@delivery.com`,
        `${digits}@distributor.sy`,
        `${digits}@company-admin.com`,
        `${digits}@company.com`,
      ];

      let signInData = null;
      let signInError = null;

      for (const email of possibleEmails) {
        console.log(
          "🔍 Trying email format:",
          email
        );

        const res =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (!res.error) {
          signInData = res.data;

          console.log(
            "✅ Successfully signed in with:",
            email
          );

          break;
        } else {
          signInError = res.error;
        }
      }

      if (!signInData && signInError) {
        const errorMessage =
          getLoginErrorMessage(signInError);

        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const redirect =
        await getAuthRedirect(signInData.user);

      toast.success(
        app.lang === "ar"
          ? "✨ أهلاً بعودتك إلى ذوق"
          : "✨ Welcome back to Zooq"
      );

      nav({
        to: redirect.url,
        state: {
          showLoginSplash: true,
        },
      });
    } catch (err: any) {
      console.error("❌ Login error:", err);

      const errorMessage =
        getLoginErrorMessage(err);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!phone.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ رقم الهاتف مطلوب"
            : "❌ Phone is required"
        );

        setLoading(false);
        return;
      }

      const formatCheck =
        isValidSyrianPhoneFormat(phone);

      if (!formatCheck.valid) {
        toast.error(
          app.lang === "ar"
            ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx"
            : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx"
        );

        setLoading(false);
        return;
      }

      if (phoneError) {
        toast.error(phoneError);
        setLoading(false);
        return;
      }

      if (phoneAvailable === false) {
        toast.error(
          app.lang === "ar"
            ? "⚠️ هذا الرقم مستخدم من قبل"
            : "⚠️ This phone is already in use"
        );

        setLoading(false);
        return;
      }

      if (!fullName.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ الاسم الكامل مطلوب"
            : "❌ Full name is required"
        );

        setLoading(false);
        return;
      }

      if (!password.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ كلمة المرور مطلوبة"
            : "❌ Password is required"
        );

        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error(
          app.lang === "ar"
            ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل"
            : "❌ Password must be at least 6 characters"
        );

        setLoading(false);
        return;
      }

      if (!location) {
        toast.error(
          app.lang === "ar"
            ? "❌ الرجاء اختيار الموقع على الخريطة"
            : "❌ Please select a location on the map"
        );

        setLoading(false);
        return;
      }

      if (
        !location.address ||
        location.address.trim() === ""
      ) {
        toast.error(
          app.lang === "ar"
            ? "❌ الرجاء اختيار عنوان صحيح من الخريطة"
            : "❌ Please select a valid address from the map"
        );

        setLoading(false);
        return;
      }

      const addressDetails =
        location.details?.trim() || "";

      if (!addressDetails) {
        toast.error(
          app.lang === "ar"
            ? "❌ الرجاء إدخال وصف تفصيلي للعنوان"
            : "❌ Please enter a detailed description for the address"
        );

        setLoading(false);
        return;
      }

      const { data, error } =
        await supabase.auth.signUp({
          email: phoneToEmail(phone),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
            },
          },
        });

      if (error) {
        const errorMessage =
          getRegisterErrorMessage(error);

        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const signInResult =
        await supabase.auth.signInWithPassword({
          email: phoneToEmail(phone),
          password,
        });

      if (signInResult.error) {
        const errorMessage =
          getLoginErrorMessage(
            signInResult.error
          );

        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const uid =
        signInResult.data.user?.id ??
        data?.user?.id;

      if (!uid) {
        toast.error(
          app.lang === "ar"
            ? "❌ فشل تسجيل الدخول بعد التسجيل"
            : "❌ Failed to sign in after registration"
        );

        setLoading(false);
        return;
      }

      const profileData = {
        id: uid,
        full_name: fullName.trim(),
        phone: phone.trim(),
      };

      const { error: profileError } =
        await supabase
          .from("profiles")
          .upsert(profileData, {
            onConflict: "id",
          });

      if (profileError) {
        console.error(
          "Profile error:",
          profileError
        );

        toast.error(
          app.lang === "ar"
            ? "⚠️ حدث خطأ في حفظ الملف الشخصي"
            : "⚠️ Error saving profile"
        );

        setLoading(false);
        return;
      }

      const saveResult =
        await saveAddressWithGovernorate(
          uid,
          location
        );

      if (!saveResult.success) {
        console.warn(
          "⚠️ Address saved but governorate extraction failed:",
          saveResult.error
        );
      }

      if (detectedGovernorate) {
        toast.success(
          app.lang === "ar"
            ? `✨ تم تحديد المحافظة: ${detectedGovernorate}`
            : `✨ Governorate detected: ${detectedGovernorate}`
        );
      }

      toast.success(
        app.lang === "ar"
          ? "🎉 أهلاً فيك بعالم ذوق!"
          : "🎉 Welcome to the world of Zooq!"
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const redirect =
          await getAuthRedirect(user);

        setTimeout(() => {
          window.location.replace(
            redirect.url
          );
        }, 500);
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (err: any) {
      console.error(
        "Registration error:",
        err
      );

      const errorMessage =
        getRegisterErrorMessage(err);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isLogin) {
      await handleLogin(e);
    } else {
      await handleRegister(e);
    }
  }

  const { data: userRoles = [] } =
    useUserRoles(app.user?.id);

  const isDeliveryCompany =
    userRoles.includes("delivery_company");

  const isDistributor =
    userRoles.includes("distributor");

  const isAdmin =
    userRoles.includes("admin");

  const isSeller =
    userRoles.includes("seller");

  const year =
    new Date().getFullYear();

  const CurrentSlideIcon =
    ZOOQ_SLIDES[slide]?.icon ??
    Sparkles;

  const currentSlide =
    ZOOQ_SLIDES[slide];

  return (
    <div
      dir={app.lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#071f1c] text-white selection:bg-[#f9a8d4]/30"
    >
      {/* ======================================================
          PREMIUM BACKGROUND
      ====================================================== */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#071f1c]">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/Logo.png"
            alt=""
            draggable={false}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              select-none
              pointer-events-none
              opacity-[0.05]
              sm:opacity-[0.07]
              md:opacity-[0.09]
              lg:opacity-[0.11]
              animate-[logo-float-bg_12s_ease-in-out_infinite]
            "
            style={{
              filter:
                "blur(0.5px) drop-shadow(0 0 100px rgba(249,168,212,0.04))",
            }}
          />
        </div>

        <div
          className="
            absolute
            left-1/2
            top-1/2
            aspect-square
            w-[70%]
            max-w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#f9a8d4]/[0.04]
            blur-3xl
            animate-[pulse-glow_8s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            aspect-square
            w-[50%]
            max-w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#2a655f]/[0.05]
            blur-3xl
            animate-[pulse-glow_10s_ease-in-out_infinite]
            delay-1000
          "
        />
      </div>

      {/* ======================================================
          PREMIUM ANIMATIONS
      ====================================================== */}
      <style>{`
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

        @keyframes side-logo-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }

          50% {
            transform: translateY(-10px) scale(1.035);
          }
        }

        @keyframes side-logo-glow {
          0%, 100% {
            opacity: .45;
            transform: scale(.96);
          }

          50% {
            opacity: .85;
            transform: scale(1.06);
          }
        }

        @keyframes side-ring-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes side-ring-spin-reverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
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

        /* ====================================================
           SIDE CARDS
        ==================================================== */

        .zooq-side-card {
          position: relative;
          min-height: 500px;
          overflow: hidden;

          border-radius: 2rem;

          border:
            1px solid rgba(249,168,212,.45);

          background:
            linear-gradient(
              145deg,
              rgba(249,168,212,.97),
              rgba(251,207,232,.94)
            );

          box-shadow:
            0 30px 80px rgba(0,0,0,.32),
            0 0 45px rgba(249,168,212,.10),
            inset 0 1px 0 rgba(255,255,255,.75);

          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);

          transition:
            transform .45s ease,
            box-shadow .45s ease;
        }

        .zooq-side-card:hover {
          transform: translateY(-5px);

          box-shadow:
            0 40px 100px rgba(0,0,0,.38),
            0 0 55px rgba(249,168,212,.20),
            inset 0 1px 0 rgba(255,255,255,.82);
        }

        .zooq-side-card::before {
          content: "";

          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 50% 18%,
              rgba(255,255,255,.52),
              transparent 34%
            );

          pointer-events: none;
        }

        .zooq-side-card::after {
          content: "";

          position: absolute;

          left: -30%;
          right: -30%;
          bottom: -35%;

          height: 55%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(42,101,95,.15),
              transparent 68%
            );

          filter: blur(22px);

          pointer-events: none;
        }

        .zooq-side-content {
          position: relative;
          z-index: 10;

          min-height: 500px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 2rem 1.5rem;
        }

        .zooq-side-icon {
          display: flex;

          height: 62px;
          width: 62px;

          align-items: center;
          justify-content: center;

          border-radius: 20px;

          border:
            1px solid rgba(42,101,95,.20);

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.68),
              rgba(42,101,95,.08)
            );

          box-shadow:
            0 12px 30px rgba(42,101,95,.12),
            inset 0 1px 0 rgba(255,255,255,.75);
        }

        .zooq-side-logo-wrap {
          position: relative;

          width: 150px;
          height: 150px;

          margin-top: 2rem;

          display: flex;
          align-items: center;
          justify-content: center;

          animation:
            side-logo-float 4.5s ease-in-out infinite;
        }

        .zooq-side-logo-glow {
          position: absolute;

          inset: 18px;

          border-radius: 999px;

          background:
            radial-gradient(
              circle,
              rgba(255,255,255,.92),
              rgba(249,168,212,.42) 38%,
              rgba(42,101,95,.12) 70%,
              transparent 76%
            );

          filter: blur(18px);

          animation:
            side-logo-glow 4s ease-in-out infinite;
        }

        .zooq-side-logo-ring {
          position: absolute;

          border-radius: 999px;

          border: 1px solid rgba(42,101,95,.22);

          border-top-color: #2a655f;
          border-right-color: rgba(249,168,212,.65);

          animation:
            side-ring-spin 10s linear infinite;
        }

        .zooq-side-logo-ring-one {
          inset: 5px;
        }

        .zooq-side-logo-ring-two {
          inset: 17px;

          border-color: rgba(249,168,212,.35);
          border-bottom-color: #2a655f;
          border-left-color: rgba(42,101,95,.45);

          animation:
            side-ring-spin-reverse 7s linear infinite;
        }

        .zooq-side-logo-image {
          position: relative;
          z-index: 5;

          height: 112px;
          width: 112px;

          object-fit: contain;

          filter:
            drop-shadow(
              0 18px 28px rgba(42,101,95,.28)
            );

          user-select: none;
          pointer-events: none;

          transition:
            transform .45s ease,
            filter .45s ease;
        }

        .zooq-side-card:hover
        .zooq-side-logo-image {
          transform:
            scale(1.08)
            rotate(-2deg);

          filter:
            drop-shadow(
              0 22px 38px rgba(42,101,95,.34)
            );
        }

        .zooq-side-logo-shine {
          position: absolute;

          z-index: 8;

          left: 50%;
          top: 50%;

          width: 8px;
          height: 125px;

          transform:
            translate(-50%, -50%)
            rotate(28deg);

          border-radius: 999px;

          background:
            linear-gradient(
              to bottom,
              transparent,
              rgba(255,255,255,.68),
              transparent
            );

          filter: blur(5px);

          opacity: .55;

          pointer-events: none;

          animation:
            side-logo-shine 4s ease-in-out infinite;
        }

        @keyframes side-logo-shine {
          0%, 100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(28deg)
              translateY(20px);
          }

          45% {
            opacity: .7;
          }

          70% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              rotate(28deg)
              translateY(-20px);
          }
        }

        .zooq-side-title {
          color: #082520;

          text-shadow:
            0 5px 20px rgba(255,255,255,.32);
        }

        .zooq-side-text {
          color: rgba(8,37,32,.68);
        }

        .zooq-side-dots button {
          box-shadow:
            0 2px 8px rgba(42,101,95,.12);
        }

        /* ====================================================
           FULL LOGO LEFT CARD
           الصورة الكاملة بدون قص وبدون أي نص
        ==================================================== */

        .zooq-logo-full-card {
          position: relative;
          min-height: 500px;
          width: 100%;
          overflow: hidden;
          border-radius: 2rem;

          border:
            1px solid rgba(249,168,212,.45);

          background:
            linear-gradient(
              145deg,
              rgba(249,168,212,.97),
              rgba(251,207,232,.94)
            );

          box-shadow:
            0 30px 80px rgba(0,0,0,.32),
            0 0 45px rgba(249,168,212,.10),
            inset 0 1px 0 rgba(255,255,255,.75);

          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);

          transition:
            transform .45s ease,
            box-shadow .45s ease;
        }

        .zooq-logo-full-card:hover {
          transform: translateY(-5px);

          box-shadow:
            0 40px 100px rgba(0,0,0,.38),
            0 0 55px rgba(249,168,212,.20),
            inset 0 1px 0 rgba(255,255,255,.82);
        }

        .zooq-logo-full-card::before {
          content: "";

          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(255,255,255,.38),
              transparent 58%
            );

          pointer-events: none;
        }

        .zooq-logo-full-card::after {
          content: "";

          position: absolute;

          left: -30%;
          right: -30%;
          bottom: -35%;

          height: 55%;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(42,101,95,.13),
              transparent 68%
            );

          filter: blur(22px);

          pointer-events: none;
        }

        .zooq-logo-full-image-wrap {
          position: relative;
          z-index: 5;

          min-height: 500px;
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 1.5rem;

          animation:
            side-logo-float 5s ease-in-out infinite;
        }

        .zooq-logo-full-image {
          display: block;

          width: 100%;
          height: 100%;

          max-width: 100%;
          max-height: 100%;

          object-fit: contain;
          object-position: center;

          user-select: none;
          pointer-events: none;

          filter:
            drop-shadow(
              0 22px 38px rgba(42,101,95,.24)
            );

          transition:
            transform .5s ease,
            filter .5s ease;
        }

        .zooq-logo-full-card:hover
        .zooq-logo-full-image {
          transform: scale(1.035);

          filter:
            drop-shadow(
              0 28px 48px rgba(42,101,95,.32)
            );
        }
      `}</style>

      {/* ======================================================
          DECORATIVE LIGHTS
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-32 -top-32 h-96 w-96 rounded-full bg-[#f9a8d4]/8 blur-3xl" />

        <div className="absolute -bottom-40 -end-20 h-[30rem] w-[30rem] rounded-full bg-[#2a655f]/20 blur-3xl" />

        <div className="absolute start-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbcfe8]/4 blur-3xl" />
      </div>

    {/* ======================================================
    MAIN CONTENT
====================================================== */}
<div className="relative mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-6xl items-center justify-center px-4 py-7">

  <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.2fr_1fr]">

    {/* ==================================================
        LEFT SIDE CARD (يظهر على اليسار في RTL)
        عبارات + لوغو صغير متحرك
    ================================================== */}
    <div className="hidden lg:block">
      <div className="zooq-side-card">

        <div className="slide-content zooq-side-content" key={slide + 5}>

          {/* ICON */}
          <div className="zooq-side-icon mb-5">
            <CurrentSlideIcon className="h-7 w-7 text-[#2a655f]" />
          </div>

          {/* TITLE */}
          <h2 className="zooq-side-title text-center text-2xl font-black leading-tight">
            {app.lang === "ar" ? (
              <>
                {slide === 0 ? (
                  <>كل <span className="text-[#2a655f]">ذوق</span> … إله مكان.</>
                ) : slide === 1 ? (
                  <>مو بس <span className="zooq-slide-title-accent text-[#2a655f]">تسوّق…</span></>
                ) : slide === 2 ? (
                  <>الاختيار إلو <span className="text-[#2a655f]">ذوق.</span></>
                ) : slide === 3 ? (
                  <>اللي بتدور عليه… <span className="text-[#2a655f]">أقرب</span> مما تتخيّل.</>
                ) : (
                  <>خلّي <span className="text-[#2a655f]">ذوقك</span> يحكي.</>
                )}
              </>
            ) : (
              currentSlide.enTitle
            )}
          </h2>

          {/* DESCRIPTION */}
          <div className="mt-4 flex max-w-xs items-start gap-2 text-start">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.7)]" />
            <p className="zooq-side-text text-sm font-semibold leading-6">
              {app.lang === "ar" ? currentSlide.arText : currentSlide.enText}
            </p>
          </div>

          {/* ==================================================
              LOGO UNDER THE PHRASE - متحرك واحترافي
          ================================================== */}
          <div className="zooq-side-logo-wrap">

            <div className="zooq-side-logo-glow" />

            <div className="zooq-side-logo-ring zooq-side-logo-ring-one" />

            <div className="zooq-side-logo-ring zooq-side-logo-ring-two" />

            <img
              src="/images/Logo.png"
              alt="ذوق | zooq"
              draggable={false}
              className="zooq-side-logo-image"
            />

            <div className="zooq-side-logo-shine" />
          </div>

          {/* SMALL BRAND TEXT */}
          <div className="mt-1 flex items-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#2a655f]/40" />
            <span className="text-[10px] font-black tracking-[.28em] text-[#2a655f]/70">zooq</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#2a655f]/40" />
          </div>

          {/* DOTS */}
          <div className="zooq-side-dots mt-5 flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  slide === i
                    ? "w-8 bg-gradient-to-r from-[#2a655f] via-[#f9a8d4] to-[#fbcfe8]"
                    : "w-1.5 bg-[#2a655f]/20 hover:bg-[#2a655f]/55"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* ==================================================
        FORM CARD - بدون لوغو (تم إزالته)
    ================================================== */}
    <div className="zooq-glass relative w-full overflow-hidden rounded-[2.5rem] p-6 shadow-[0_40px_120px_rgba(0,0,0,.55)] sm:p-8">

      {/* TOP DECORATIVE LINE */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#2a655f] opacity-90" />

      {/* ==================================================
          BRAND NAME ONLY - بدون صورة اللوغو
      ================================================== */}
      <div className="relative mb-6 flex flex-col items-center text-center">

        <div className="flex items-center gap-2">
          <h1
            className="zooq-brand-title text-3xl font-black leading-none tracking-[-.06em] sm:text-4xl"
            dir="rtl"
          >
            <span className="bg-gradient-to-r from-white via-[#fbcfe8] to-[#f9a8d4] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer-gold_4s_linear_infinite]">
              ذوق
            </span>
          </h1>
        </div>

        {/* ZOOQ */}
        <div className="mt-2 flex items-center gap-2">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#2a655f]/50" />
          <span className="text-base font-black tracking-[.2em] sm:text-lg">
            <span className="text-[#2a655f]">z</span>
            <span className="zooq-o-pink">o</span>
            <span className="text-[#2a655f]">o</span>
            <span className="text-[#2a655f]">q</span>
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#f9a8d4]/50" />
        </div>

        {/* TAGLINE */}
        <div className="mt-2 flex items-center gap-2 rounded-full border border-[#f9a8d4]/15 bg-gradient-to-r from-[#2a655f]/10 via-[#f9a8d4]/[.045] to-[#fbcfe8]/[.05] px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,.8)]" />
          <span className="text-[9px] font-black tracking-[.08em] text-white/60 sm:text-[10px]">
            {app.lang === "ar" ? "كلشي ع ذوقك" : "Exactly your taste"}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#f9a8d4] shadow-[0_0_12px_rgba(249,168,212,.8)]" />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="relative my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/30" />
        <span className="text-[8px] font-black tracking-[.25em] text-white/20">
          {isLogin ? (app.lang === "ar" ? "دخول" : "LOGIN") : (app.lang === "ar" ? "تسجيل" : "REGISTER")}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/30" />
      </div>

      {/* FORM */}
      <form className="relative space-y-4" onSubmit={handleSubmit} autoComplete="off">

        {/* FULL NAME */}
        {isRegister && (
          <GlassField label={t("full_name") + " *"} icon={<UserIcon className="h-4 w-4 text-[#f9a8d4]" />}>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="off"
              className="input-glow rounded-2xl border-0 transition-all duration-300"
              placeholder={app.lang === "ar" ? "الاسم اللي بتحب نناديك فيه" : "The name you'd like us to call you"}
            />
          </GlassField>
        )}

        {/* PHONE */}
        <GlassField label={t("phone") + " *"} icon={<Phone className="h-4 w-4 text-[#f9a8d4]" />}>
          <div className="zooq-input relative rounded-2xl">
            <Input
              type="tel"
              placeholder="+963 9xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="off"
              className={`input-glow rounded-2xl border-0 pe-10 transition-all duration-300 ${
                phoneError && isRegister ? "border-red-500 focus-visible:ring-red-500" : ""
              } ${phoneAvailable === true && isRegister && phone.trim().length >= 5 ? "border-[#f9a8d4]" : ""}`}
            />
            {isRegister && phone.trim().length >= 5 && (
              <div className="absolute inset-y-0 end-3 flex items-center">
                {isCheckingPhone ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#f9a8d4]" />
                ) : phoneAvailable === true ? (
                  <CheckCircle className="h-4 w-4 text-[#2a655f]" />
                ) : phoneAvailable === false ? (
                  <X className="h-4 w-4 text-red-400" />
                ) : null}
              </div>
            )}
          </div>
        </GlassField>

        {/* PHONE ERROR */}
        {isRegister && phone.trim().length >= 5 && phoneError && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <p className="text-xs font-semibold text-red-200">{phoneError}</p>
          </div>
        )}

        {/* PASSWORD */}
        <GlassField label={t("password") + " *"} icon={<Lock className="h-4 w-4 text-[#f9a8d4]" />}>
          <div className="zooq-input relative rounded-2xl">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="off"
              className="input-glow rounded-2xl border-0 pe-10 transition-all duration-300"
              placeholder={app.lang === "ar" ? "كلمة المرور — 6 أحرف على الأقل" : "Password — 6+ characters"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-3 my-auto text-[#f9a8d4]/70 transition hover:text-[#f9a8d4]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </GlassField>

        {/* ADDRESS */}
        {isRegister && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-bold text-white/85">
              <span className="h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]" />
              {app.lang === "ar" ? "وين بدنا نوصل طلباتك؟ *" : "Where should we deliver? *"}
            </Label>
            <div className="rounded-2xl border border-white/10 bg-white/[.96] p-3 text-slate-800 transition-all duration-300 focus-within:border-[#f9a8d4]/60 focus-within:shadow-[0_0_0_3px_rgba(249,168,212,.08)]">
              <AddressPicker value={location ?? undefined} onChange={setLocation} lang={app.lang} />
            </div>
            {location && detectedGovernorate && (
              <div className="flex items-center gap-2 rounded-xl border border-[#f9a8d4]/20 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/[.07] p-2.5">
                {isExtractingGovernorate ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#f9a8d4]" />
                ) : (
                  <MapPin className="h-3.5 w-3.5 text-[#2a655f]" />
                )}
                <span className="text-[11px] font-medium text-[#fbcfe8]">
                  {isExtractingGovernorate
                    ? app.lang === "ar" ? "عم نحدد منطقتك..." : "Detecting your area..."
                    : detectedGovernorate
                      ? app.lang === "ar" ? `المحافظة: ${detectedGovernorate}` : `Governorate: ${detectedGovernorate}`
                      : app.lang === "ar" ? "⚠️ لم يتم التحديد" : "⚠️ Not detected"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* SUBMIT */}
        <Button
          type="submit"
          size="lg"
          className="zooq-submit group relative mt-2 h-13 w-full overflow-hidden rounded-2xl border-0 text-base font-black"
          disabled={loading || (isRegister && (phoneAvailable === false || phoneError !== null))}
        >
          <span className="zooq-shine pointer-events-none absolute inset-y-0 -start-1/2 w-1/2 skew-x-[-18deg] bg-white/20 animate-[zooq-shine_2.8s_ease-in-out_infinite]" />
          {loading ? (
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />
              {app.lang === "ar" ? "لحظة… عم نجهز كل شي" : "Just a moment..."}
            </span>
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLogin ? <Lock className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {isLogin
                ? app.lang === "ar" ? "دخول إلى ذوق" : "Enter Zooq"
                : app.lang === "ar" ? "ابدأ رحلتك مع ذوق" : "Start your Zooq journey"}
            </span>
          )}
        </Button>

        {/* LINKS */}
        <div className="space-y-3 pt-2 text-center text-sm text-white/65">
          {isLogin ? (
            <>
              <div>
                {app.lang === "ar" ? "لسا ما صار عندك حساب؟" : "Don't have an account?"}{" "}
                <Link to="/auth/$mode" params={{ mode: "register" }} className="zooq-link font-black text-[#f9a8d4]">
                  {app.lang === "ar" ? "خلينا نبدأ" : "Let's start"}
                </Link>
              </div>
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="zooq-link mx-auto flex items-center justify-center gap-1.5 text-xs text-white/40"
              >
                <HelpCircle className="h-3.5 w-3.5 text-[#f9a8d4]" />
                {app.lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot your password?"}
              </button>
              {app.user && (
                <div className="mt-3 space-y-1.5 border-t border-white/8 pt-3">
                  {isDeliveryCompany && (
                    <Link to="/delivery/dashboard" className="zooq-link block text-xs text-[#f9a8d4]">
                      🚚 {app.lang === "ar" ? "لوحة التوصيل" : "Delivery Dashboard"}
                    </Link>
                  )}
                  {isDistributor && (
                    <Link to="/distributor/dashboard" className="zooq-link block text-xs text-[#2a655f]">
                      📦 {app.lang === "ar" ? "لوحة الموزع" : "Distributor Dashboard"}
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className="zooq-link block text-xs text-red-300">
                      ⚡ {app.lang === "ar" ? "لوحة الأدمن" : "Admin Panel"}
                    </Link>
                  )}
                  {isSeller && (
                    <Link to="/dashboard" className="zooq-link block text-xs text-amber-300">
                      🏪 {app.lang === "ar" ? "لوحة البائع" : "Seller Dashboard"}
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                {app.lang === "ar" ? "عندك حساب معنا؟" : "Already part of Zooq?"}{" "}
                <Link to="/auth/$mode" params={{ mode: "login" }} className="zooq-link font-black text-[#f9a8d4]">
                  {app.lang === "ar" ? "فوت لعندنا" : "Sign in"}
                </Link>
              </div>
              <div className="relative pt-4">
                <div className="absolute inset-x-0 top-0 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/20" />
                  <span className="text-[9px] font-black tracking-[.25em] text-white/25">
                    {app.lang === "ar" ? "أو" : "OR"}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/20" />
                </div>
                <Link to="/" className="block w-full">
                  <Button
                    variant="outline"
                    className="mt-2 h-11 w-full rounded-2xl border-white/10 bg-white/[.035] text-sm font-bold text-white hover:border-[#f9a8d4]/35 hover:bg-[#2a655f]/10 hover:text-white"
                  >
                    {app.lang === "ar" ? "خليني اكتشف أول 👀" : "Let me explore first 👀"}
                  </Button>
                </Link>
                <p className="mt-2 text-[10px] text-white/30">
                  {app.lang === "ar"
                    ? "تصفح، اكتشف، وخلي التسجيل لوقت ما تكون جاهز."
                    : "Explore first. Sign up when you're ready."}
                </p>
              </div>
            </>
          )}
        </div>

      </form>

      {/* BRAND FOOTER */}
      <div className="relative mt-6 flex flex-col items-center justify-center gap-2 border-t border-white/7 pt-4 text-center">
        <div className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-[#2a655f] shadow-[0_0_8px_rgba(42,101,95,.8)]" />
          <span className="text-[9px] font-black tracking-[.28em] text-white/25">zooq</span>
          <span className="h-1 w-1 rounded-full bg-[#f9a8d4] shadow-[0_0_8px_rgba(249,168,212,.8)]" />
        </div>
        <p className="text-[10px] font-semibold text-white/30">
          {app.lang === "ar" ? "كلشي ع ذوقك" : "Exactly your taste"}
        </p>
      </div>

    </div>

    {/* ==================================================
        RIGHT SIDE CARD (يظهر على اليمين في RTL)
        FULL ZOOQ LOGO - بدون أي نص
    ================================================== */}
    <div className="hidden lg:block">
      <div className="zooq-logo-full-card">
        <div className="zooq-logo-full-image-wrap">
          <img
            src="/images/Logo.png"
            alt="ذوق | zooq"
            draggable={false}
            className="zooq-logo-full-image"
          />
        </div>
      </div>
    </div>

  </div>
</div>

      {/* ======================================================
          FOOTER
      ====================================================== */}
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-5">
        <div className="border-t border-white/7 pt-4">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

            <div className="flex items-center gap-1.5">
              {[
                {
                  icon: Twitter,
                  label: "Twitter",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                },
                {
                  icon: Youtube,
                  label: "YouTube",
                },
                {
                  icon: Globe,
                  label: "Website",
                },
              ].map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="zooq-social flex h-8 w-8 items-center justify-center rounded-xl border border-white/7 bg-white/[.025] text-white/30"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">
              <Link
                to="/privacy"
                className="zooq-link text-white/32"
              >
                {app.lang === "ar"
                  ? "الخصوصية"
                  : "Privacy"}
              </Link>

              <span className="text-white/15">
                •
              </span>

              <Link
                to="/terms"
                className="zooq-link text-white/32"
              >
                {app.lang === "ar"
                  ? "الشروط"
                  : "Terms"}
              </Link>

              <span className="text-white/15">
                •
              </span>

              <span className="text-white/25">
                © {year} ذوق
              </span>
            </div>
          </div>
        </div>
      </div>

      <SupportButton />
    </div>
  );
}

// ============================================================
// SupportButton Component
// ============================================================
function SupportButton() {
  const app = useApp();

  const [isOpen, setIsOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [visitorPhone, setVisitorPhone] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [isHovered, setIsHovered] =
    useState(false);

  const handleOpenSupport = () =>
    setIsOpen(true);

  const handleSubmitSupport =
    async () => {
      const phone =
        app.user?.phone ||
        visitorPhone.trim();

      if (!phone) {
        toast.error(
          app.lang === "ar"
            ? "الرجاء إدخال رقم هاتفك للتواصل معك"
            : "Please enter your phone number"
        );

        return;
      }

      if (!message.trim()) {
        toast.error(
          app.lang === "ar"
            ? "الرجاء كتابة رسالتك"
            : "Please write your message"
        );

        return;
      }

      setIsLoading(true);

      try {
        const {
          data: adminData,
          error: adminError,
        } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .limit(1)
          .single();

        if (
          adminError ||
          !adminData
        ) {
          toast.error(
            app.lang === "ar"
              ? "حدث خطأ، يرجى المحاولة لاحقاً"
              : "Error, please try again later"
          );

          return;
        }

        const adminId =
          adminData.user_id;

        const userId =
          app.user?.id ||
          adminId;

        const userPhone =
          app.user?.phone ||
          visitorPhone.trim();

        const isRegistered =
          !!app.user;

        const {
          data: newConversation,
          error: convError,
        } = await supabase
          .from("conversations")
          .insert({
            participant1_id: userId,
            participant2_id: adminId,
            last_message:
              message.substring(0, 100),
            last_message_at:
              new Date().toISOString(),
          })
          .select()
          .single();

        if (convError)
          throw convError;

        const conversationId =
          newConversation.id;

        const { error: msgError } =
          await supabase
            .from("messages")
            .insert({
              sender_id: userId,
              receiver_id: adminId,
              conversation_id:
                conversationId,
              content: `📩 رسالة دعم\n📞 من: ${userPhone}\n${
                isRegistered
                  ? "✅ مستخدم مسجل"
                  : "❌ زائر (ليس لديه حساب)"
              }\nالموضوع: ${
                subject || "دعم"
              }\n\nالرسالة:\n${message}`,
              type: "text",
              created_at:
                new Date().toISOString(),
            });

        if (msgError)
          throw msgError;

        await supabase
          .from("notifications")
          .insert({
            user_id: adminId,
            type: "support",
            title_ar:
              "📩 رسالة دعم جديدة",
            body_ar: `📞 من: ${userPhone}\n${
              isRegistered
                ? "✅ مسجل"
                : "❌ زائر"
            }\nالموضوع: ${
              subject || "دعم"
            }`,
            reference_id:
              conversationId,
            link_url:
              `/messages/${conversationId}`,
            created_at:
              new Date().toISOString(),
          });

        setIsSuccess(true);

        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setMessage("");
          setSubject("");
          setVisitorPhone("");
        }, 2000);

        toast.success(
          app.lang === "ar"
            ? "✅ وصلت رسالتك! نحنا معك."
            : "✅ Your message is on its way!"
        );
      } catch (error) {
        console.error(
          "Error sending support message:",
          error
        );

        toast.error(
          app.lang === "ar"
            ? "حدث خطأ أثناء الإرسال"
            : "Error sending message"
        );
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <>
      <div className="fixed bottom-6 start-6 z-50">
        <button
          onClick={handleOpenSupport}
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
          className="group relative flex items-center gap-3 rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] px-4 py-2.5 text-white shadow-lg shadow-[#f9a8d4]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#f9a8d4]/45 hover:shadow-xl hover:shadow-[#f9a8d4]/25"
        >
          <div className="relative">
            <Headphones className="h-5 w-5 text-[#f9a8d4]" />

            {!isHovered && (
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#fbcfe8] shadow-[0_0_8px_rgba(249,168,212,.8)]" />
            )}
          </div>

          <span className="hidden text-sm font-bold sm:inline">
            {app.lang === "ar"
              ? "نحنا هون"
              : "We're here"}
          </span>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] animate-in fade-in bg-black/65 backdrop-blur-md duration-200"
            onClick={() =>
              setIsOpen(false)
            }
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-in overflow-hidden rounded-[2rem] border border-[#f9a8d4]/25 bg-[#071f1c] shadow-[0_35px_100px_rgba(0,0,0,.58)] zoom-in-95 duration-300">

              <div className="border-b border-[#f9a8d4]/15 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-br from-[#2a655f]/30 to-[#f9a8d4]/15">
                      <Headphones className="h-6 w-6 text-[#f9a8d4]" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white">
                        {app.lang === "ar"
                          ? "خلينا نساعدك"
                          : "Let's help you"}
                      </h3>

                      <p className="mt-0.5 text-sm text-[#fbcfe8]/80">
                        {app.lang === "ar"
                          ? "رسالتك بتوصلنا مباشرة 💗"
                          : "Your message reaches us directly 💗"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="text-white/50 transition-colors hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-6">

                {isSuccess ? (
                  <div className="py-8 text-center">

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#f9a8d4]/30 bg-[#f9a8d4]/15">
                      <CheckCircle className="h-8 w-8 text-[#f9a8d4]" />
                    </div>

                    <h4 className="text-lg font-black text-white">
                      {app.lang === "ar"
                        ? "وصلت! 💗"
                        : "Got it! 💗"}
                    </h4>

                    <p className="mt-1 text-sm text-[#fbcfe8]/80">
                      {app.lang === "ar"
                        ? "نحنا معك، وراح نرد عليك بأسرع وقت."
                        : "We're on it and will get back to you soon."}
                    </p>
                  </div>
                ) : (
                  <>
                    {app.user ? (
                      <div>
                        <Label className="text-sm font-semibold text-white/90">
                          {app.lang === "ar"
                            ? "رقم هاتفك"
                            : "Your Phone"}
                        </Label>

                        <Input
                          type="tel"
                          value={
                            app.user?.phone ||
                            "غير متاح"
                          }
                          disabled
                          className="mt-1.5 h-11 cursor-not-allowed rounded-xl border-[#f9a8d4]/20 bg-white/10 text-white"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-sm font-semibold text-white/90">
                          {app.lang === "ar"
                            ? "رقم الهاتف *"
                            : "Phone Number *"}
                        </Label>

                        <Input
                          type="tel"
                          value={visitorPhone}
                          onChange={(e) =>
                            setVisitorPhone(
                              e.target.value
                            )
                          }
                          placeholder="+963 9xx xxx xxx"
                          className="mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50"
                          required
                        />

                        <p className="mt-1 text-[10px] text-white/40">
                          {app.lang === "ar"
                            ? "بس مشان نقدر نرجعلك"
                            : "So we can get back to you"}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-semibold text-white/90">
                        {app.lang === "ar"
                          ? "شو الموضوع؟"
                          : "What's on your mind?"}
                      </Label>

                      <Input
                        value={subject}
                        onChange={(e) =>
                          setSubject(
                            e.target.value
                          )
                        }
                        placeholder={
                          app.lang === "ar"
                            ? "مثلاً: مشكلة بالحساب..."
                            : "e.g. Account issue..."
                        }
                        className="mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-white/90">
                        {app.lang === "ar"
                          ? "احكيلنا شو صار *"
                          : "Tell us what happened *"}
                      </Label>

                      <textarea
                        value={message}
                        onChange={(e) =>
                          setMessage(
                            e.target.value
                          )
                        }
                        placeholder={
                          app.lang === "ar"
                            ? "اكتب رسالتك هون… نحنا سامعينك."
                            : "Write your message here..."
                        }
                        rows={4}
                        className="mt-1.5 w-full resize-none rounded-xl border border-[#f9a8d4]/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50 focus:bg-white/10 focus:outline-none"
                      />
                    </div>

                    <Button
                      onClick={
                        handleSubmitSupport
                      }
                      disabled={
                        isLoading ||
                        !message.trim() ||
                        (!app.user &&
                          !visitorPhone.trim())
                      }
                      className="h-12 w-full rounded-xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#174944] to-[#2a655f] font-black text-white shadow-lg shadow-[#f9a8d4]/15 transition-all hover:-translate-y-0.5 hover:border-[#f9a8d4]/45 hover:shadow-[#f9a8d4]/25"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          {app.lang === "ar"
                            ? "عم نوصلها..."
                            : "Sending..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-[#f9a8d4]" />

                          {app.lang === "ar"
                            ? "إرسال الرسالة"
                            : "Send message"}
                        </span>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

